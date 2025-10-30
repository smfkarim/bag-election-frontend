// app/api/device/route.ts
import DeviceDetector from "device-detector-js";
import dns from "dns/promises";
import macaddress from "macaddress";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import os from "os";

export async function GET(request: Request) {
    // ✅ headers() is now sync in Next 16 when called in a Route Handler
    const _headers = await headers();

    // 1️⃣ Extract client IP
    const forwarded = _headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0].trim() || "0.0.0.0";

    // 2️⃣ Parse UA
    const uaHeader = _headers.get("user-agent") ?? "";
    const uaParsed = userAgent(request); // optional built-in summary
    const detector = new DeviceDetector();
    const parsedUA = detector.parse(uaHeader);

    // 3️⃣ Reverse DNS lookup (best-effort)
    let reverseHost: string | null = null;
    try {
        if (clientIp && clientIp !== "0.0.0.0") {
            const rev = await dns.reverse(clientIp);
            reverseHost = rev?.[0] ?? null;
        }
    } catch {}

    // 4️⃣ Server info
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const networkInterfaces = os.networkInterfaces();

    // 5️⃣ Server MACs
    let serverMacs: Record<string, string> | null = null;
    try {
        const all = await macaddress.all();
        serverMacs = {};
        Object.entries(all).forEach(([iface, info]: any) => {
            serverMacs![iface] = info.mac;
        });
    } catch {}

    return Response.json({
        clientIp,
        reverseHost,
        ua: uaHeader,
        uaParsed,
        parsedUA,
        server: { hostname, platform, arch, networkInterfaces, serverMacs },
    });
}
