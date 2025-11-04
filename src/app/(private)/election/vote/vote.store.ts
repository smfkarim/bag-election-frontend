import { create } from "zustand";
import type { TSelection } from "@/components/pages/candidate-selection";

interface TVoteStore {
  ballotNumber: string;
  selectedCandidates: TSelection[];
  onSelectedCandidatesChanged: (check: boolean, data: TSelection) => void;
  isChecked: (data: TSelection) => boolean;
}
export const useVoteStore = create<TVoteStore>((set, get) => ({
  ballotNumber: "78985264",
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
          (x) => x.id !== data.id,
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
}));
