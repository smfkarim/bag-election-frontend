import { Voter } from "@/@types/voter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./auth-store";

interface VoterStore {
    voter: Voter | null;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useVoterStore = create<VoterStore>()(
    persist(
        (set) => ({
            voter: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: "voter_store",
            storage: createJSONStorage(() => secureStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
