import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DevSettingsState {
    apiBaseUrl: string;
    adminBaseUrl: string;
    enableDebug: boolean;
    enableLogs: boolean;

    setApiBaseUrl: (v: string) => void;
    setAdminBaseUrl: (v: string) => void;
    setEnableDebug: (v: boolean) => void;
    setEnableLogs: (v: boolean) => void;
}

const LS_KEY = "dev-settings";

/* Load default from ENV on first run */
const defaultState = {
    apiBaseUrl:
        typeof window !== "undefined"
            ? localStorage.getItem(LS_KEY)
                ? JSON.parse(localStorage.getItem(LS_KEY)!).state.apiBaseUrl
                : process.env.NEXT_PUBLIC_API_BASE_URL ||
                  "http://localhost:9000/api"
            : process.env.NEXT_PUBLIC_API_BASE_URL ||
              "http://localhost:9000/api",

    adminBaseUrl:
        typeof window !== "undefined"
            ? localStorage.getItem(LS_KEY)
                ? JSON.parse(localStorage.getItem(LS_KEY)!).state.adminBaseUrl
                : process.env.NEXT_PUBLIC_ADMIN_BASE_URL ||
                  "http://localhost:8000/api"
            : process.env.NEXT_PUBLIC_ADMIN_BASE_URL ||
              "http://localhost:8000/api",

    enableDebug: false,
    enableLogs: false,
};

export const useDevSettings = create<DevSettingsState>()(
    persist(
        (set) => ({
            ...defaultState,

            setApiBaseUrl: (v) => set({ apiBaseUrl: v }),
            setAdminBaseUrl: (v) => set({ adminBaseUrl: v }),
            setEnableDebug: (v) => set({ enableDebug: v }),
            setEnableLogs: (v) => set({ enableLogs: v }),
        }),
        {
            name: LS_KEY, // 🔥 FINAL LOCALSTORAGE KEY = "dev-settings"
            storage: createJSONStorage(() => localStorage),
        }
    )
);
