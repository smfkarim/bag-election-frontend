import { DashboardJSON, DeviceJSON } from "@/@types/firebase";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { autoLogin, db, dbPath } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export function useDashboardListener() {
    const [error, setError] = useState<null | unknown>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DashboardJSON | null>(null);
    useEffect(() => {
        autoLogin()
            .then(() => {
                const jsonRef = ref(db, dbPath("dashboard"));
                onValue(jsonRef, (snapshot) => {
                    const res = snapshot.val();
                    console.log("📥 Dashboard:", res);
                    setData(res);
                    setIsLoading(false);
                });
            })
            .catch((e) => {
                setError(e);
                setIsLoading(false);
            });
    }, []);

    return {
        isLoading,
        error,
        data,
    };
}

export default function useDeviceListener(deviceMAC?: string) {
    const [devices, setDevices] = useState<Record<string, DeviceJSON> | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [globalDeviceLockStatus, setGlobalDeviceLockStatus] = useState<
        boolean | null
    >(null);

    useEffect(() => {
        autoLogin().then(() => {
            const jsonRef = ref(db, dbPath("devices"));
            onValue(jsonRef, (snapshot) => {
                const res = snapshot.val();
                setDevices(res);
                setIsLoading(false);
            });

            onValue(
                ref(db, dbPath(`global_device_lock_setting`)),
                (snapshot) => {
                    const res = snapshot.val();
                    setGlobalDeviceLockStatus(res);
                    setIsLoading(false);
                }
            );
        });
    }, [deviceMAC]);

    return {
        isLoading,
        data: deviceMAC && devices ? (devices[deviceMAC] as DeviceJSON) : null,
        devices,
        globalDeviceLockStatus,
    };
}
