"use client";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { PropsWithChildren, useEffect } from "react";
import { MdWarning, MdPhoneIphone, MdDownload } from "react-icons/md";

import { Alert, Button, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import useDeviceListener from "@/services/api/firebase.api";

export default function DeviceProvider(props: PropsWithChildren) {
    const { error, loading, device } = useFullDeviceInfo();
    const { data } = useDeviceListener(device?.macAddress);

    if (loading) return <LoadingOverlay />;
    if (error) return <CompanionSoftwareRequired />;
    if (!data) return <DeviceNotRegistered />;

    return <> {props.children}</>;
}

// --- Page 1: Animated Device Not Registered ---
export function DeviceNotRegistered() {
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
                            contact your administrator.
                        </p>
                    </Alert>

                    <Button
                        fullWidth
                        size="md"
                        radius="md"
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all hover:scale-105"
                        onClick={() => window.location.reload()}
                    >
                        Register
                    </Button>

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
