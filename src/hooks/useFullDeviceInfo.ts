"use client";
import { useEffect, useState } from "react";
import { useClientDeviceInfo } from "./useClientInfo";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/store/auth-store";

interface DeviceInfoResponse {
    Success: boolean;
    Message: string;
    Data: Data;
    Errors: null;
}

interface Data {
    ip: string;
    pc_user: string;
    pc_name: string;
    mb: Mb;
    mac: string;
}

interface Mb {
    model: string;
    manufacturer: string;
}

export interface Device {
    id?: number;
    code?: string;
    uuid?: string;

    hostname: string;
    ipAddress?: string;
    localIps?: string[];
    macAddress?: string;
    firebaseId?: string;
    operatingSystem?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    deviceType?: string;
    gpu?: string | null;
    timezone?: string;
    language?: string;
    screenWidth?: number;
    screenHeight?: number;
    hardwareConcurrency?: number;
    geo?: any;
    reverseHost?: string | null;
    status?: string;
    remarks?: string;
    metadata?: string;
    createdAt?: Date;
    updatedAt?: Date;
    motherboard?: Mb;
}

const useDeviceStore = create<{
    device: Partial<Device> | null;
    loading: boolean;
    error: string | null;
    // actions
    setDevice: (device: Partial<Device>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}>()(
    persist(
        (set) => ({
            loading: false,
            error: null,
            device: null,
            // actions
            setDevice: (device) => set({ device }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: "device-store",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);

export function useFullDeviceInfo() {
    const { info: client, loading: clientLoading } = useClientDeviceInfo();
    const { device, loading, error, setDevice, setError, setLoading } =
        useDeviceStore();

    useEffect(() => {
        let mounted = true;

        async function run() {
            try {
                setError(null);
                // Fetch Device Info From local Server
                const localServerRes = await axios.get<DeviceInfoResponse>(
                    `${process.env.NEXT_PUBLIC_LOCAL_SERVER_API_URL}/device-info`,
                    {
                        timeout: 5000,
                    }
                );
                const { ip, mac, mb, pc_name, pc_user } =
                    localServerRes.data.Data;

                // fetch server-visible info
                const res = await fetch("/api/device", { cache: "no-store" });
                if (!res.ok) throw new Error(`GET /api/device ${res.status}`);
                const serverData = await res.json();

                const combined: Partial<Device> = {
                    // server-provided
                    hostname: pc_user + "@" + pc_name,
                    ipAddress: ip,
                    macAddress: mac.toUpperCase(),
                    reverseHost: serverData?.reverseHost ?? null,
                    geo: serverData?.geo ?? undefined,
                    motherboard: mb,

                    // parsed UA from server (prefer server to avoid client spoofing)
                    operatingSystem:
                        serverData?.parsedUA?.os?.name ?? undefined,
                    osVersion: serverData?.parsedUA?.os?.version ?? undefined,
                    browser: serverData?.parsedUA?.client?.name ?? undefined,
                    browserVersion:
                        serverData?.parsedUA?.client?.version ?? undefined,
                    deviceType: serverData?.parsedUA?.device?.type ?? "desktop",

                    // client extras
                    localIps: client.localIps,
                    gpu: client.gpu ?? null,
                    timezone: client.timezone,
                    language: client.language,
                    screenWidth: client.screenWidth,
                    screenHeight: client.screenHeight,
                    hardwareConcurrency: client.hardwareConcurrency,

                    metadata: JSON.stringify({
                        userAgentClient: client.userAgent,
                        userAgentServerRaw: serverData?.ua,
                        networkInterfacesSampled: Boolean(
                            serverData?.server?.networkInterfaces
                        ),
                    }),
                    createdAt: new Date(),
                };

                if (mounted) setDevice(combined);
            } catch (e: any) {
                if (mounted)
                    setError(e?.message || "failed to collect device info");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        // wait until client info done (tiny race guard)
        if (!clientLoading) run();

        return () => {
            mounted = false;
        };
    }, [clientLoading, client]);

    return { device, loading: loading || clientLoading, error };
}
