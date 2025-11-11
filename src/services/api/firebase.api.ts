import { DashboardJSON, DeviceJSON } from "@/@types/firebase";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { autoLogin, db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export function useDashboardListener() {
    const [error, setError] = useState<null | unknown>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DashboardJSON | null>(null);
    useEffect(() => {
        autoLogin()
            .then(() => {
                const jsonRef = ref(db, "dashboard");
                onValue(jsonRef, (snapshot) => {
                    const res = snapshot.val();
                    console.log("📥 Dashboard:", data);
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

export default function useDeviceListener() {
    const { device } = useFullDeviceInfo();
    const deviceId = "deviceID";
    const [error, setError] = useState<null | unknown>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DeviceJSON | null>(null);
    useEffect(() => {
        autoLogin()
            .then(() => {
                const jsonRef = ref(db, "devices");
                onValue(jsonRef, (snapshot) => {
                    const res = snapshot.val();
                    console.log("📥 Device:", res);
                    setData(res?.[deviceId] ?? null);
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
