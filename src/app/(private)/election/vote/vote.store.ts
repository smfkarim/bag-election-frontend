import { secureStorage } from "@/store/auth-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type TSelection = {
    id: number;
    index: number;
    name: string;
    type: string;
    panel: string;
};
interface TVoteStore {
    voter_id: string;
    ballotNumber: string;
    selectedCandidates: TSelection[];
    onSelectedCandidatesChanged: (check: boolean, data: TSelection) => void;
    isChecked: (data: TSelection) => boolean;
}
export const useVoteStore = create<TVoteStore>()(
    persist(
        (set, get) => ({
            voter_id: "",
            ballotNumber: "",
            selectedCandidates: [],
            onSelectedCandidatesChanged(check, data) {
                if (check) {
                    set({
                        selectedCandidates: get()
                            .selectedCandidates.filter((x) => x.id !== data.id)
                            .concat(data),
                    });
                } else {
                    set({
                        selectedCandidates: get().selectedCandidates.filter(
                            (x) => x.id !== data.id
                        ),
                    });
                }
            },
            isChecked(data) {
                return (
                    get().selectedCandidates?.length > 0 &&
                    !!get().selectedCandidates.find((x) => x.id === data.id)
                );
            },
        }),
        {
            name: "vote-store",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
