"use client";

import { Permission, Role } from "@/@types/auth";
import { TUser } from "@/@types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type AuthState = {
    isLoading: boolean;
    accessToken: string | null;
    user: TUser | null;
    permissions: Permission[];
    roles: Role[];

    isAuthenticated: () => boolean;

    setAuth: (data: {
        accessToken: string;
        user: TUser;
        roles: Role[];
        permissions: Permission[];
    }) => void;
};

// Example secure storage that works with SSR
export const secureStorage = {
    getItem: (name: string): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem(name, value);
    },
    removeItem: (name: string): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set, get) => ({
            isLoading: false,
            accessToken: null,
            user: null,
            permissions: [],
            roles: [],

            isAuthenticated() {
                const { accessToken, user } = get();
                return !!accessToken && !!user;
            },

            setAuth(data) {
                set(data);
            },
        }),
        {
            name: "auth",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
