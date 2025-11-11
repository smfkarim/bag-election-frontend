"use client";

import { useEffect, useMemo, useState } from "react";

export interface ClientDeviceInfo {
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  timezone?: string;
  language?: string;
  hardwareConcurrency?: number;
  gpu?: string | null;
  localIps?: string[]; // best-effort via WebRTC (no STUN)
}

export function useClientDeviceInfo() {
  const [info, setInfo] = useState<ClientDeviceInfo>({});
  const [loading, setLoading] = useState(true);

  const initial: ClientDeviceInfo = useMemo(() => {
    if (typeof window === "undefined") return {};
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function collect() {
      // GPU (WebGL) — may be blocked
      let gpu: string | null = null;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          const dbg = (gl as any).getExtension("WEBGL_debug_renderer_info");
          if (dbg) {
            gpu = (gl as any).getParameter(dbg.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch {
        /* ignore */
      }

      // Local/private IPs via WebRTC (no STUN) — modern browsers may return none
      const localSet = new Set<string>();
      try {
        if (typeof RTCPeerConnection !== "undefined") {
          const pc = new RTCPeerConnection({ iceServers: [] });
          try {
            pc.createDataChannel("d");
          } catch {}
          pc.onicecandidate = (e) => {
            if (!e.candidate) return;
            const cand = e.candidate.candidate || "";
            const matches = cand.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/g);
            matches?.forEach((ip) => localSet.add(ip));
          };
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await new Promise((r) => setTimeout(r, 400));
          pc.close();
        }
      } catch {
        /* ignore */
      }

      if (!mounted) return;
      setInfo((prev) => ({
        ...initial,
        gpu,
        localIps: Array.from(localSet),
      }));
      setLoading(false);
    }

    collect();
    return () => {
      mounted = false;
    };
  }, [initial]);

  return { info, loading };
}
