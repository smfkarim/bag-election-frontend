"use client";

import { Button, Image, Paper, PinInput } from "@mantine/core";
import { ComponentRef, useEffect, useRef, useState } from "react";

export default function MemberLogin() {
    const pin1Ref = useRef<ComponentRef<typeof PinInput>>(null);
    const pin2Ref = useRef<ComponentRef<typeof PinInput>>(null);
    const [pin1, setPin1] = useState("");
    const [pin2, setPin2] = useState("");

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

    return (
        <Paper shadow="sm" p={40} radius={20} className=" w-fit">
            <div className=" flex flex-col items-center w-fit space-y-2">
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
                <p className=" text-xl my-5">Input your code here</p>
                <div className=" flex items-center gap-3">
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
                    <p className=" text-3xl mx-2">-</p>
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
                <Button size="lg" radius={20} fullWidth mt={20}>
                    Continue
                </Button>
            </div>
        </Paper>
    );
}
