"use client";
import { Device } from "@/types/device"; // adjust path
import { useEffect, useState } from "react";

export function useFullDeviceInfo() {
    const [device, setDevice] = useState<Partial<Device>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function collectDeviceInfo() {
            try {
                /* -------------------- 🔹 Client-side info -------------------- */
                const ua = navigator.userAgent;
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const timezone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone;
                const language = navigator.language;
                const hardwareConcurrency = navigator.hardwareConcurrency;

                // Detect GPU (if available)
                let gpu: string | null = null;
                try {
                    const canvas = document.createElement("canvas");
                    const gl =
                        canvas.getContext("webgl") ||
                        canvas.getContext("experimental-webgl");
                    if (gl) {
                        const debugInfo = (gl as any).getExtension(
                            "WEBGL_debug_renderer_info"
                        );
                        if (debugInfo) {
                            gpu = (gl as any).getParameter(
                                debugInfo.UNMASKED_RENDERER_WEBGL
                            );
                        }
                    }
                } catch {}

                // Get public IP (via ipify)
                let publicIp: string | undefined;
                try {
                    const ipRes = await fetch(
                        "https://api.ipify.org?format=json"
                    );
                    const ipJson = await ipRes.json();
                    publicIp = ipJson.ip;
                } catch {}

                // Attempt local IP discovery (WebRTC trick)
                const localIps: string[] = [];
                try {
                    const pc = new RTCPeerConnection({ iceServers: [] });
                    pc.createDataChannel("");
                    pc.onicecandidate = (e) => {
                        if (!e.candidate) return;
                        const ips = e.candidate.candidate.match(
                            /([0-9]{1,3}(\.[0-9]{1,3}){3})/g
                        );
                        if (ips) localIps.push(...ips);
                    };
                    await pc
                        .createOffer()
                        .then((o) => pc.setLocalDescription(o));
                    await new Promise((r) => setTimeout(r, 500));
                    pc.close();
                } catch {}

                /* -------------------- 🔹 Server-side info -------------------- */
                const serverRes = await fetch("/api/device", {
                    cache: "no-store",
                });
                const serverData = await serverRes.json();

                const parsedUA = serverData.ua || {};
                const deviceInfo: Partial<Device> = {
                    hostname: serverData.server?.hostname || "unknown",
                    ipAddress: publicIp || serverData.clientIp,
                    localIps,
                    macAddress: serverData.server?.macs
                        ? Object.values(serverData.server.macs)[0]
                        : undefined,
                    operatingSystem:
                        parsedUA.os?.name ||
                        navigator.platform ||
                        serverData.server?.platform,
                    osVersion: parsedUA.os?.version || undefined,
                    browser: parsedUA.client?.name || undefined,
                    browserVersion: parsedUA.client?.version || undefined,
                    deviceType: parsedUA.device?.type || "desktop",
                    gpu,
                    timezone,
                    language,
                    screenWidth,
                    screenHeight,
                    hardwareConcurrency,
                    geo: serverData.geo,
                    reverseHost: serverData.reverseHost,
                    metadata: JSON.stringify({
                        userAgent: ua,
                        network: serverData.server?.network,
                    }),
                    createdAt: new Date(),
                };

                setDevice(deviceInfo);
            } catch (err: any) {
                console.error("Error collecting device info", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        collectDeviceInfo();
    }, []);

    return { device, loading, error };
}
