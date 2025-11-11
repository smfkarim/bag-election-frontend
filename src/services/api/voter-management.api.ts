import { ListParams, ListResponse } from "@/@types";
import { TVoterRegistration } from "@/@types/voter";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import api from ".";

// Tag
const tag = `voter-registrations`;

export const vrKeys = {
    list: (meta: {
        page: number;
        per_page: number;
        extra?: Record<string, string | number>;
    }) => ["vr-list", meta],
};

export const useGetVoterRegistrationList = (
    params: ListParams<TVoterRegistration>,
    options?: Partial<UndefinedInitialDataOptions>
) =>
    useQuery({
        ...options,
        queryKey: vrKeys.list(params),
        queryFn: async () => {
            const data = await api.get<ListResponse<TVoterRegistration>>(
                `/v1/${tag}/get`,
                params
                    ? {
                          params,
                      }
                    : undefined
            );

            return data.data.data;
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
    });
