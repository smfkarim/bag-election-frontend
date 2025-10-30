"use client";

import { useEffect, useState } from "react";
import { useClientDeviceInfo } from "./useClientInfo";

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
}

export function useFullDeviceInfo() {
    const { info: client, loading: clientLoading } = useClientDeviceInfo();
    const [device, setDevice] = useState<Partial<Device>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        let mounted = true;

        async function run() {
            try {
                // fetch server-visible info
                const res = await fetch("/api/device", { cache: "no-store" });
                if (!res.ok) throw new Error(`GET /api/device ${res.status}`);
                const serverData = await res.json();

                const combined: Partial<Device> = {
                    // server-provided
                    hostname:
                        serverData?.server?.hostname ??
                        (typeof window !== "undefined"
                            ? window.location.hostname
                            : "unknown"),
                    ipAddress: serverData?.clientIp ?? undefined,
                    macAddress: serverData?.server?.serverMacs
                        ? (Object.values(
                              serverData.server.serverMacs
                          )[0] as string)
                        : undefined,
                    reverseHost: serverData?.reverseHost ?? null,
                    geo: serverData?.geo ?? undefined,

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
