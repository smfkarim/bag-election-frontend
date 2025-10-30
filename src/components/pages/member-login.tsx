"use client";

import { Button, Image, Paper, PinInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";

export default function MemberLogin() {
    const requiredPin = "123456";
    const [blocked, setBlocked] = useState(false);
    const pin1Ref = useRef<ComponentRef<typeof PinInput>>(null);
    const pin2Ref = useRef<ComponentRef<typeof PinInput>>(null);
    const [pin1, setPin1] = useState("");
    const [pin2, setPin2] = useState("");
    const pin = pin1 + pin2;
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (pin1.length === 3) {
            pin2Ref?.current?.focus();
        }
    }, [pin1]);
    const handlePin2Change = (value: string) => {
        setPin2(value);
        // If pin2 becomes empty and pin1 has content, focus back to last input of pin1
        if (value === "" && pin1.length > 0) {
            // Use setTimeout to ensure the focus happens after the state update
            setTimeout(() => {
                const pin1Element = pin1Ref.current;
                if (pin1Element) {
                    // Get all input elements within pin1
                    const inputs = pin1Element.querySelectorAll("input");
                    // Focus the last input (index 2 for length 3)
                    if (inputs.length > 0) {
                        inputs[inputs.length - 1].focus();
                    }
                }
            }, 0);
        }
    };

    const handleContinue = async () => {
        if (pin !== requiredPin) {
            notifications.show({
                color: "red",
                title: "Wrong PIN",
                message: "You have enter wrong pin",
            });
            setRetryCount((v) => v + 1);
            return;
        }
    };

    useEffect(() => {
        if (retryCount === 2) {
            setBlocked(true);
        }
    }, [retryCount]);

    return (
        <Paper shadow="sm" p={40} radius={20} className="">
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
                             Please contact to the ElectionCommission.`}
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
                        ref={pin1Ref}
                        length={3}
                        value={pin1}
                        onChange={setPin1}
                        classNames={{
                            input:
                                pin1.length === 3
                                    ? "border-2! border-green-800!"
                                    : "",
                        }}
                    />
                    <p
                        className={`text-3xl mx-2 ${
                            blocked ? "opacity-0" : ""
                        }`}
                    >
                        -
                    </p>
                    <PinInput
                        classNames={{
                            input:
                                pin2.length === 3
                                    ? "border-2! border-green-800!"
                                    : "",
                        }}
                        size="lg"
                        value={pin2}
                        onChange={handlePin2Change}
                        ref={pin2Ref}
                        length={3}
                    />
                </div>
                <Button
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
        </Paper>
    );
}
