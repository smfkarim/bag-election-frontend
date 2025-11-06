import { TForeignId } from "@/@types";
import { useMutation } from "@tanstack/react-query";
import api from ".";

export const useValidateSixDigitKeyMutation = () =>
    useMutation({
        mutationKey: ["validate-six-digit-key"],
        mutationFn: (payload: { deviceId: TForeignId; code: string }) =>
            api.post("/v1/voter/validate", payload),
    });

export const useGiveVoteMutation = () =>
    useMutation({
        mutationKey: ["vote"],
        mutationFn: (payload: {
            election_id: TForeignId;
            voter_id: TForeignId;
            candidate_id: TForeignId;
            device_id: TForeignId;
        }) => api.post("/vote", payload),
    });
