"use client";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import useDeviceListener from "@/services/api/firebase.api";
import { useValidateSixDigitKeyMutation } from "@/services/api/voter.api";
import { Button, Image, PinInput } from "@mantine/core";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";

export default function MemberAuth() {
    const { device } = useFullDeviceInfo();
    const { devices, globalDeviceLockStatus } = useDeviceListener();
    const deviceInfo =
        devices?.[device?.macAddress as keyof typeof devices] ?? null;
    const router = useRouter();
    const { mutateAsync: validateSixDigitCode } =
        useValidateSixDigitKeyMutation();
    const [pin, setPin] = useState("");
    const blocked = globalDeviceLockStatus && !!deviceInfo?.lock_status;

    const handleContinue = async () => {
        try {
            const res = await validateSixDigitCode({
                code: pin,
                device_id: "",
            });

            useVoteStore.setState({
                ballotNumber: res.data?.data.eight_digit_code,
                voter_id: res.data?.data.voter_id,
            });

            cookie.set("isVoter", "1");
            router.push("/election/vote");
        } catch {}
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            useVoteStore.setState({
                ballotNumber: "",
                selectedCandidates: [],
                voter_id: "",
            });
            cookie.remove("isVoter");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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
                        <p className=" text-xl ">Input your code here</p>
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
                </div>
                <Button
                    type="submit"
                    disabled={pin.length !== 6 || blocked}
                    onClick={handleContinue}
                    classNames={{
                        root: "disabled:bg-green-800!  disabled:text-white! disabled:opacity-50",
                    }}
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
