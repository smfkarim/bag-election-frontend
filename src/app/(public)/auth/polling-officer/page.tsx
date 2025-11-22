"use client";
import CenterWrapper from "@/components/layout/center-wrapper";
import PaperWrapper from "@/components/layout/paper-wrapper";
import useAuth from "@/hooks/useAuth";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdLogin } from "react-icons/md";

export default function PollingAgentLogin() {
    const [loading, setLoading] = useState(false);
    const [otpRequired, setOtpRequired] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const router = useRouter();
    const { isAuthenticated, role } = useAuth();
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            otp: "",
        },
        validate: {
            email: (_email) => !_email && "Email is required",
            password: (_password) => !_password && "Password is required",
            otp: (_otp) => otpRequired && !_otp && "OTP is required",
        },
        validateInputOnBlur: true,
    });
    const handleLogin = async (values: typeof form.values) => {
        try {
            setLoading(true);
            // auth action
            const res = await signIn("credentials", {
                email: values.email,
                password: values.password,
                otp: values.otp,
                redirect: false,
            });
            console.log(res);

            if (res?.ok) {
                router.push("/polling-officer");
            } else {
                if (res?.error === "OTP_REQUIRED") {
                    setOtpRequired(true);
                    setResendTimer(60);
                    notifications.show({
                        color: "blue",
                        title: "OTP Sent",
                        message: "Please check your email for OTP",
                    });
                } else {
                    notifications.show({
                        color: "red",
                        title: "Failed",
                        message: JSON.stringify(res?.error),
                    });
                }
            }
        }catch(e){
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);
            const res = await signIn("credentials", {
                email: form.values.email,
                password: form.values.password,
                redirect: false,
            });

            if (res?.error === "OTP_REQUIRED") {
                setResendTimer(60);
                notifications.show({
                    color: "blue",
                    title: "OTP Resent",
                    message: "Please check your email for the new OTP",
                });
            } else {
                notifications.show({
                    color: "red",
                    title: "Failed",
                    message: JSON.stringify(res?.error),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        if (isAuthenticated && role === "Poll Officer") {
            router.push("/polling-officer");
        }
    }, []);

    return (
        <CenterWrapper>
            <PaperWrapper>
                <div>
                    <form
                        onSubmit={form.onSubmit(handleLogin)}
                        className="  space-y-3   w-lg p-20 py-10"
                    >
                        <div className=" size-10 sm:size-16 mx-auto">
                            <Image
                                src={"/bag_logo.png"}
                                className=""
                                height={200}
                                width={200}
                                alt="bag_logo"
                            />
                        </div>
                        <h1 className=" font-semibold text-2xl text-primary text-center">
                            Polling Agent Login
                        </h1>
                        <div className=" space-y-1 mt-5">
                            {!otpRequired ? (
                                <>
                                    <TextInput
                                        type="email"
                                        label="Email Address"
                                        placeholder="Enter your email"
                                        classNames={{
                                            input: "placeholder:text-center",
                                        }}
                                        {...form.getInputProps("email")}
                                    />
                                    <PasswordInput
                                        label="Password"
                                        placeholder="Password"
                                        classNames={{
                                            innerInput:
                                                "placeholder:text-center placeholder:mt-10",
                                        }}
                                        {...form.getInputProps("password")}
                                    />
                                </>
                            ) : (

                                <>
                                    <TextInput
                                        label="Enter OTP"
                                        placeholder="Enter OTP"
                                        classNames={{
                                            input: "placeholder:text-center",
                                        }}
                                        {...form.getInputProps("otp")}
                                    />
                                    <Group justify="flex-end">
                                        <Button
                                            variant="subtle"
                                            size="xs"
                                            onClick={handleResendOtp}
                                            disabled={resendTimer > 0 || loading}
                                        >
                                            {resendTimer > 0
                                                ? `Resend in ${resendTimer}s`
                                                : "Resend OTP"}
                                        </Button>
                                    </Group>
                                </>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                mt={30}
                                loading={loading}
                                rightSection={<MdLogin size={20} />}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </PaperWrapper>
        </CenterWrapper>
    );
}
