import { TVoterRegistration } from "@/@types/voter";
import { create } from "zustand";

interface VoterStore {
    voter: TVoterRegistration | null;
}

export const useVoterStore = create<VoterStore>((set, get) => ({
    voter: null,
}));
