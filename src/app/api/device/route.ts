// app/api/device/route.ts
import DeviceDetector from "device-detector-js";
import dns from "dns/promises";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import requestIp from "request-ip";
/** Optional libs - install if you want: macaddress, geoip-lite */
import geoip from "geoip-lite";
import macaddress from "macaddress";

export async function GET(req: NextRequest) {
    // 1) client IP (respecting proxies)
    // request-ip works with NextRequest when passed as any; fallback to headers
    const clientIpFromHeader =
        requestIp.getClientIp(req as any) ||
        req.headers.get("x-forwarded-for") ||
        req.ip ||
        "";

    // x-forwarded-for can have comma list, pick first
    const clientIp = (clientIpFromHeader || "").split(",")[0].trim();

    // 2) user-agent parse
    const ua = req.headers.get("user-agent") || "";
    const detector = new DeviceDetector();
    let parsedUA = null;
    try {
        parsedUA = detector.parse(ua);
    } catch (e) {
        parsedUA = { error: "ua-parse-failed", raw: ua };
    }

    // 3) geo (optional, local package)
    let geo = null;
    try {
        if (clientIp) {
            geo = geoip.lookup(clientIp);
        }
    } catch {}

    // 4) reverse DNS for client ip (best-effort)
    let reverseHost: string | null = null;
    try {
        if (clientIp) {
            const rev = await dns.reverse(clientIp);
            reverseHost = rev?.[0] ?? null;
        }
    } catch {
        reverseHost = null;
    }

    // 5) server info
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const networkInterfaces = os.networkInterfaces();

    // 6) server MACs (optional)
    let serverMacs: Record<string, string> | null = null;
    try {
        const all = await macaddress.all();
        // macaddress.all returns object: { eth0: { mac, ip }, ... }
        serverMacs = {};
        Object.entries(all).forEach(([iface, info]: any) => {
            serverMacs![iface] = info?.mac || null;
        });
    } catch {
        serverMacs = null;
    }

    const payload = {
        clientIp,
        ua,
        parsedUA,
        geo,
        reverseHost,
        server: {
            hostname,
            platform,
            arch,
            networkInterfaces,
            serverMacs,
        },
        notes: {
            clientMacAvailable: false,
            why: "Browsers do not expose client MAC or SSID. To obtain MAC you need a native agent or network-level access.",
        },
    };

    return NextResponse.json(payload);
}
