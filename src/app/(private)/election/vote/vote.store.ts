import { secureStorage } from "@/store/auth-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TVoteStore {
    voter_id: string;
    ballotNumber: string;
    selectedCandidates: { index: number; uuid: string }[];
}
export const useVoteStore = create<TVoteStore>()(
    persist(
        (set, get) => ({
            voter_id: "",
            ballotNumber: "",
            selectedCandidates: [],
        }),
        {
            name: "vote-store",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
