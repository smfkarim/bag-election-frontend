import { DashboardJSON, DeviceJSON } from "@/@types/firebase";
import { autoLogin, db, dbPath } from "@/lib/firebase";
import { increment, onValue, ref, set } from "firebase/database";
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

export default function useDeviceListener() {
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
    }, []);

    return {
        isLoading,
        devices,
        globalDeviceLockStatus,
    };
}

export const toggleDeviceLockStatus = async (
    deviceMAC: string,
    lockStatus: boolean
) => {
    try {
        await autoLogin();
        const deviceRef = ref(db, dbPath(`devices/${deviceMAC}/lock_status`));
        await set(deviceRef, lockStatus);
    } catch (error) {
        console.error("Error toggling device lock status:", error);
        throw error;
    }
};

// export const setGlobalLockStatus = async (lockStatus: boolean) => {
//     try {
//         await autoLogin();
//         const globalLockRef = ref(db, dbPath(`global_device_lock_setting`));
//         await set(globalLockRef, lockStatus);
//     } catch (error) {
//         console.error("Error setting global lock status:", error);
//         throw error;
//     }
// };

export const setWrongAttempts = async (deviceMAC: string, attempts: number) => {
    try {
        await autoLogin();
        const deviceRef = ref(
            db,
            dbPath(`devices/${deviceMAC}/wrong_attempts`)
        );
        await set(deviceRef, attempts);
    } catch (error) {
        console.error("Error setting wrong attempts:", error);
        throw error;
    }
};

export const manualBallotPrintCountIncrement = async () => {
    try {
        await autoLogin();

        const dashboardRef = ref(
            db,
            dbPath("dashboard/votingCounts/manualBallotPrints")
        );

        // Atomically increment - no race conditions possible
        await set(dashboardRef, increment(1));

        return true;
    } catch (error) {
        console.error("Error incrementing ballot print count:", error);
        throw error;
    }
};
