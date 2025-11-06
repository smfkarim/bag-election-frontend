import { TForeignId } from "@/@types";
import { VoterSearchResponse } from "@/@types/voter";
import {
    UndefinedInitialDataOptions,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import api from ".";

export const useVoterSearchQuery = (
    {
        type,
        query,
    }: {
        type: "email" | "first_name" | "last_name" | "national_id";
        query: string;
    },
    options?: Omit<
        UndefinedInitialDataOptions<AxiosResponse<VoterSearchResponse>>,
        "queryKey" | "queryFn"
    >
) =>
    useQuery({
        ...options,
        queryKey: ["voter_search", { type, query }],
        queryFn: async () => {
            return (
                await api.get(`/v1/voters/search?type=${type}&query=${query}`)
            ).data;
        },
    });

export const useSendSixDigitCodeMutation = () =>
    useMutation({
        mutationKey: ["send-six-digit-code"],
        mutationFn: (payload: {
            type: "mail" | "both" | "print" | "ballot";
            user_id: TForeignId;
            device_info: TForeignId;
            uuid: string;
        }) => api.post("/v1/send/code", payload),
    });
