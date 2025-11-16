import { Voter } from "@/@types/voter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./auth-store";

interface VoterStore {
    voter: Voter | null;
}

export const useVoterStore = create<VoterStore>()(
    persist(
        (set, get) => ({
            voter: null,
        }),
        {
            skipHydration: false,
            name: "auth",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
