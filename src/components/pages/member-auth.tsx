"use client";
import { useValidateSixDigitKeyMutation } from "@/services/api/voter.api";
import { Button, Image, PinInput } from "@mantine/core";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";

export default function MemberAuth() {
    const router = useRouter();
    // const requiredPin = "123456";
    const { mutateAsync: validateSixDigitCode } =
        useValidateSixDigitKeyMutation();
    const [blocked, setBlocked] = useState(false);
    const [pin, setPin] = useState("111111");
    const [retryCount, setRetryCount] = useState(0);

    const handleContinue = async () => {
        // if (pin !== requiredPin) {
        //     notifications.show({
        //         color: "red",
        //         title: "Wrong PIN",
        //         message: "You have enter wrong pin",
        //     });
        //     setRetryCount((v) => v + 1);
        //     return;
        // }
        // // notifications.show({})

        try {
            await validateSixDigitCode({
                code: pin,
                device_id: "123456",
            });

            cookie.set("isVoter", "1");
            router.push("/election/vote");
        } catch (error) {
            setBlocked(true);
        }
    };

    useEffect(() => {
        if (retryCount === 2) {
            setBlocked(true);
        }
    }, [retryCount]);

    return (
        <div className=" shadow-2xl shadow-green-800/40 p-10 rounded-2xl ">
            <div className=" flex flex-col items-center w-fit space-y-2 max-w-[400px]">
                <div className=" size-20">
                    <Image
                        src={"/bag_logo.png"}
                        alt="bag-logo"
                        className="h-full w-full"
                    />
                </div>
                <h1 className=" text-4xl font-bold text-green-900">Welcome</h1>
                <p className=" text-xl">To</p>
                <p className=" text-xl">BAG Member System</p>
                <br />
                <div>
                    {blocked ? (
                        <p className=" text-center  whitespace-pre-line my-5 text-red-500">
                            {`You have been blocked\n due to wrong input of so many times.
                             Please contact to the Election Commission.`}
                        </p>
                    ) : (
                        <p className=" text-xl my-5">Input your code here</p>
                    )}
                </div>
                <div className=" flex items-center gap-3 relative p-4">
                    {blocked && (
                        <div className=" w-full h-full bg-gray-400/80 absolute z-10  left-0 right-0 rounded-lg flex justify-center items-center">
                            <AiOutlineLock size={40} />
                        </div>
                    )}
                    <PinInput
                        size="lg"
                        length={6}
                        value={pin}
                        onChange={setPin}
                        classNames={{
                            input:
                                pin.length === 6
                                    ? "border-2! border-green-800!"
                                    : "",
                        }}
                    />
                    {/* <p
                        className={`text-3xl mx-2 ${
                            blocked ? "opacity-0" : ""
                        }`}
                    >
                        -
                    </p> */}
                </div>
                <Button
                    type="submit"
                    disabled={pin.length !== 6 || blocked}
                    onClick={handleContinue}
                    size="lg"
                    radius={20}
                    fullWidth
                    mt={20}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
