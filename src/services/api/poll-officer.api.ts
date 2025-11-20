import { TForeignId } from "@/@types";
import { VoterSearchResponse } from "@/@types/voter";
import { parseErrorMessage } from "@/lib/helpers";
import {
    UndefinedInitialDataOptions,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
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
        UndefinedInitialDataOptions<VoterSearchResponse>,
        "queryKey" | "queryFn"
    >
) =>
    useQuery({
        ...options,
        queryKey: ["voter_search", { type, query }],
        queryFn: async () => {
            try {
                return (
                    await api.get(
                        `/v1/voters/search?type=${type}&query=${query}`
                    )
                ).data;
            } catch (error) {
                throw parseErrorMessage(error as AxiosError);
            }
        },
    });

export const useSendSixDigitCodeMutation = () =>
    useMutation({
        mutationFn: (payload: {
            type: "mail" | "both" | "print" | "ballot" | "show_secret";
            user_id: TForeignId;
            device_info: TForeignId;
            uuid: string;
        }) => api.post("/v1/send/code", payload),
    });
