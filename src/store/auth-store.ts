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

export const secureStorage = {
    getItem: (name: string) => {
        const item = localStorage.getItem(name);
        if (!item) return null;
        const decoded = atob(item);
        return decoded;
    },
    setItem: (name: string, value: string) => {
        localStorage.setItem(name, btoa(value)); // Base64 encoding
    },
    removeItem: (name: string) => localStorage.removeItem(name),
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
