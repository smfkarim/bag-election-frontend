import { secureStorage } from "@/store/auth-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type TSelection = {
    id: number;
    index: number;
    name: string;
    type: string;
    uuid: string;
};
interface TVoteStore {
    voter_id: string;
    ballotNumber: string;
    selectedCandidates: TSelection[];
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
