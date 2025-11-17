"use client";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { LoadingOverlay, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { MdWarning, MdPhoneIphone, MdDownload } from "react-icons/md";

import { Alert, Button, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import useDeviceListener from "@/services/api/firebase.api";
import { useForm } from "@mantine/form";
import { useGetBoothList } from "@/services/api/booth.api";
import { modals } from "@mantine/modals";
import axios from "axios";
import { usePathname } from "next/navigation";

interface RegisterType {
    booth_id: string;
    ip_address: string;
    mac_address: string;
    device_type: string;
    operating_system: string;
    remarks: string;
}

export default function DeviceProvider(props: PropsWithChildren) {
    const pathname = usePathname();
    const { error, loading, device } = useFullDeviceInfo();
    const { isLoading, devices } = useDeviceListener();

    const isDeviceRequiredRoute =
        pathname === "/" || pathname.includes("/election/vote");

    const deviceInfo =
        devices?.[device?.macAddress as keyof typeof devices] ?? null;

    if (loading || isLoading) return <LoadingOverlay />;
    if (error) return <CompanionSoftwareRequired />;
    if (!deviceInfo && isDeviceRequiredRoute) return <DeviceNotRegistered />;

    return <> {props.children}</>;
}

// --- Page 1: Animated Device Not Registered ---
export function DeviceNotRegistered() {
    const { error, device } = useFullDeviceInfo();

    const [isLoading, setIsLoading] = useState(false);
    const { data: boothList } = useGetBoothList({ per_page: 100, page: 1 });
    const form = useForm<RegisterType>({
        initialValues: {
            booth_id: "",
            ip_address: "",
            mac_address: "",
            device_type: "",
            operating_system: "",
            remarks: "",
        },
        validate: {
            booth_id: (_value) => !_value && "Booth is required",
        },
    });

    useEffect(() => {
        if (device) {
            form.setValues({
                ip_address: device.ipAddress,
                mac_address: device.macAddress,
                device_type: device.deviceType,
                operating_system: device.operatingSystem,
                remarks: JSON.stringify(device),
            });
        }
    }, [device]);

    const handleRegisterDevice = async (values: typeof form.values) => {
        setIsLoading(true);
        const baseURL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
        await axios
            .post(`${baseURL}/v1/device/register-with-mac`, values)
            .then(() => {
                notifications.show({ message: "Device registered" });
            })
            .catch((err) => {
                notifications.show({
                    color: "red",
                    message: "Device registration failed",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 relative overflow-hidden">
            {/* Floating glowing background animation */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,0,70,0.4),transparent_70%)] animate-pulse" />

            <Paper
                shadow="xl"
                radius="xl"
                className="max-w-sm w-full p-8 bg-white/10! backdrop-blur-xl border border-white/20 text-center animate-fade-in"
            >
                <Stack align="center" gap={20}>
                    {/* Icon */}
                    <div className="rounded-full bg-red-500/20 p-6 shadow-inner animate-bounce">
                        <MdPhoneIphone className="text-red-400 text-6xl" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Device Not Registered
                    </h1>

                    <Alert
                        color="red"
                        radius="md"
                        variant="light"
                        // icon={  }
                        className="w-full bg-red-500/10 border-red-400/30 text-red-200"
                    >
                        <p className=" text-sm text-white">
                            This device is not registered in the system. Please
                            select a booth and register.
                        </p>
                    </Alert>

                    <form
                        className=" w-full space-y-3 "
                        onSubmit={form.onSubmit(handleRegisterDevice)}
                    >
                        <Select
                            label="Select Booth"
                            data={boothList?.data?.data?.map((x) => ({
                                label: x.name,
                                value: x.id.toString(),
                            }))}
                            placeholder="Select a booth"
                            {...form.getInputProps("booth_id")}
                        />
                        <Button
                            type="submit"
                            disabled={!form.values.booth_id || isLoading}
                            loading={isLoading}
                            fullWidth
                            size="md"
                            radius="md"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all hover:scale-105"
                        >
                            Register
                        </Button>
                    </form>

                    <a
                        href="/companion-required"
                        className="text-sm text-blue-400 hover:underline hover:text-blue-300 transition"
                    >
                        Dependent software not installed?
                    </a>
                </Stack>
            </Paper>

            <div className="absolute bottom-6 text-xs text-gray-500 opacity-50">
                © {new Date().getFullYear()} ZHB Solutions — All Rights Reserved
            </div>
        </div>
    );
}

// --- Page 2: Companion Software Required (Animated) ---
export function CompanionSoftwareRequired() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 relative overflow-hidden">
            {/* Soft Glow */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom,_rgba(255,200,0,0.3),transparent_70%)] animate-pulse" />

            <Paper
                shadow="xl"
                radius="xl"
                className="max-w-sm w-full p-8 bg-white/10! backdrop-blur-xl border border-white/20 text-center animate-fade-in"
            >
                <Stack align="center" gap={20}>
                    <div className="rounded-full bg-red-500/20 p-6 animate-bounce">
                        <MdWarning className="text-red-400 text-6xl" />
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        BAG Drivers Missing
                    </h1>

                    <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
                        The required companion desktop software is not installed
                        on this device. Please download and install it to
                        continue.
                    </p>

                    <Button
                        component="a"
                        href="https://example.com/download-companion"
                        target="_blank"
                        radius="md"
                        fullWidth
                        leftSection={<MdDownload size={18} />}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105 transition-all"
                    >
                        Download BAG Driver
                    </Button>

                    <p className="text-xs text-gray-400">
                        After installation, refresh this page.
                    </p>
                </Stack>
            </Paper>

            <div className="absolute bottom-6 text-xs text-gray-500 opacity-50">
                © {new Date().getFullYear()} ZHB Solutions — All Rights Reserved
            </div>
        </div>
    );
}
