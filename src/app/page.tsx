"use client";

import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";

export default function DeviceInfoCard() {
    const { device, loading, error } = useFullDeviceInfo();

    if (loading) return <p>collecting…</p>;
    if (error) return <p className="text-red-600">error: {error}</p>;

    return (
        <div className="space-y-3">
            <pre className="p-3 bg-gray-50 rounded text-xs">
                {JSON.stringify(device, null, 2)}
            </pre>
        </div>
    );
}
