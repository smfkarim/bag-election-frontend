// import { SortedCandidate } from "@/@types/candidate";
// import { create } from "zustand";

// interface TVoteStore {
//     voter_id: string;
//     ballotNumber: string;
//     selectedCandidates: SortedCandidate[];
//     selectCandidate: (candidate: SortedCandidate) => void;
//     unSelectCandidate: (candidate: SortedCandidate) => void;
//     isChecked: (candidate: SortedCandidate) => boolean;
//     isDisabled: (candidate: SortedCandidate) => boolean;
// }
// export const useVoteStore = create<TVoteStore>(
//     // )(
//     //     persist<TVoteStore>(
//     (set, get) => ({
//         voter_id: "",
//         ballotNumber: "",
//         selectedCandidates: [],

//         // actions
//         isChecked(candidate) {
//             return !!get().selectedCandidates.find(
//                 (x) => x.uuid === candidate.uuid
//             );
//         },
//         isDisabled(candidate) {
//             const isChecked = get().isChecked(candidate);
//             if (isChecked) return false;

//             if (candidate.type === "Vice President") {
//                 // only 2 person allowed
//                 const _filtered = get().selectedCandidates.filter(
//                     (x) => x.type === "Vice President"
//                 );
//                 if (_filtered.length === 2) {
//                     return true;
//                 }
//             }

//             if (candidate.type === "Executive Secretary") {
//                 // only 5 person allowed
//                 const _filtered = get().selectedCandidates.filter(
//                     (x) => x.type === "Executive Secretary"
//                 );
//                 if (_filtered.length === 5) {
//                     return true;
//                 }
//             }

//             //    for others (only 1 person allowed)
//             if (
//                 get().selectedCandidates.find((x) => x.type === candidate.type)
//             ) {
//                 return true;
//             }

//             return false;
//         },
//         selectCandidate: (payload) => {
//             set((state) => ({
//                 selectedCandidates: state.selectedCandidates.concat(payload),
//             }));
//         },
//         unSelectCandidate: (payload) => {
//             set((state) => ({
//                 selectedCandidates: state.selectedCandidates.filter(
//                     (x) => x.uuid !== payload.uuid
//                 ),
//             }));
//         },
//     })
//     //     {
//     //         name: "vote-store",
//     //         storage: createJSONStorage(() => secureStorage),
//     //     }
//     // )
// );

import { SortedCandidate } from "@/@types/candidate";
import { secureStorage } from "@/store/auth-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TVoteStore {
    voter_id: string;
    ballotNumber: string;
    selectedCandidates: SortedCandidate[];
    selectCandidate: (candidate: SortedCandidate) => void;
    unSelectCandidate: (candidate: SortedCandidate) => void;
}

export const useVoteStore = create<TVoteStore>()(
    persist(
        (set, get) => ({
            voter_id: "",
            ballotNumber: "",
            selectedCandidates: [],

            /** ✅ Add a candidate if not already selected */
            selectCandidate(candidate) {
                const selected = get().selectedCandidates;
                if (!selected.find((x) => x.uuid === candidate.uuid)) {
                    set({ selectedCandidates: [...selected, candidate] });
                }
            },

            /** ✅ Remove a candidate cleanly */
            unSelectCandidate(candidate) {
                set({
                    selectedCandidates: get().selectedCandidates.filter(
                        (x) => x.uuid !== candidate.uuid
                    ),
                });
            },
        }),
        {
            name: "vote_store",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
