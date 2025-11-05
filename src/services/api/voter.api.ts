import { TVoter } from "@/@types/voter";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import api from ".";

interface VoterSearchResponse {
    source: "server" | "cache";
    voter: TVoter[];
}

export const useVoterSearchQuery = (
    {
        type,
        query,
    }: {
        type: "email" | "first_name" | "last_name" | "national_id";
        query: string;
    },
    options?: Omit<UndefinedInitialDataOptions, "queryKey" | "queryFn">
) =>
    useQuery({
        ...options,
        queryKey: ["voter_search", { type, query }],
        queryFn: async () => {
            return await api.get<VoterSearchResponse>(
                `/v1/voters/search?type=${type}&query=${query}`
            );
        },
    });
