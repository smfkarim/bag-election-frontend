import { TForeignId } from "@/@types";
import { useMutation } from "@tanstack/react-query";
import api from ".";

export const useValidateSixDigitKeyMutation = () =>
    useMutation({
        // mutationKey: ["validate-six-digit-key"],
        mutationFn: (payload: { device_id: TForeignId; code: string }) =>
            api.post<{
                data: {
                    id: number;
                    uuid: string;
                    voter_id: string;
                    secret_key: string;
                    secret_key_status: boolean;
                    activated_by: null;
                    used_at: null;
                    created_at: string;
                    updated_at: string;
                    eight_digit_code: string;
                };
            }>("/v1/voter/validate", payload),
    });

// export const useGiveVoteMutation = () =>
//     useMutation({
//         mutationKey: ["vote"],
//         mutationFn: (payload: {
//             election_id: TForeignId;
//             voter_id: TForeignId;
//             candidate_id: TForeignId;
//             device_id: TForeignId;
//         }) => api.post("/v1/vote", payload),
//     });

export const useGiveBulkVoteMutation = () =>
    useMutation({
        mutationFn: (payload: {
            election_id: TForeignId;
            voter_id: TForeignId;
            candidate_ids: TForeignId[];
            device_id: TForeignId;
        }) => api.post("/v1/vote", payload),
    });
