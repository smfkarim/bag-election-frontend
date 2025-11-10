import { ListParams, ListResponse } from "@/@types";
import { Candidate, SortedCandidate } from "@/@types/candidate";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const tag = `candidate`;

const baseURL = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

export const useGetCandidateList = (params: ListParams<Candidate>) =>
    useQuery({
        queryKey: [tag, params],
        queryFn: async () => {
            const data = await axios.get<ListResponse<Candidate>>(
                baseURL + `/v1/${tag}/get`,
                params
                    ? {
                          params,
                      }
                    : undefined
            );
            return data.data;
        },
    });

export const useGetPanelCandidatesSortedList = (
    params: ListParams<Candidate>
) =>
    useQuery({
        queryKey: ["candidate-sorted", params],
        queryFn: async () => {
            const data = await axios.get<ListResponse<PanelCandidates>>(
                baseURL + `/v1/${tag}/get-candidates`,
                params
                    ? {
                          params,
                      }
                    : undefined
            );
            return data.data;
        },
    });

interface PanelCandidates {
    panel_id: number;
    panel_name: string;
    panel_code: string;
    candidate_types: CandidateType[];
}

interface CandidateType {
    candidate_type_id: number;
    candidate_type_name: string;
    candidates: TCandidate[];
}

export interface TCandidate {
    id: number;
    uuid: string;
    name: string;
    code: string;
    photo_url: string;
    digital_votes?: number;
    manual_votes?: number;
    total_votes?: number;
}

// export const useCandidateUpdateMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-update"],
//         mutationFn: (payload: {
//             id: string | number;
//             data: Partial<Candidate>;
//         }) => {
//             const formData = new FormData();
//             Object.entries(payload.data).forEach(([key, value]) => {
//                 if (key === "symbol") {
//                     console.log(value, "VALUE___");
//                 }
//                 formData.append(key, value as string);
//             });
//             return api.put(`/v1/${tag}/update/${payload.id}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Candidate  updated successfully",
//             });
//         },
//         onError: (error) => {
//             notifications.show({
//                 color: "red",
//                 title: "Failed",
//                 message: parseErrorMessage(error as ErrorResponse),
//             });
//         },
//     });
// };
// export const useCandidateCreateMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-create"],
//         mutationFn: (payload: Partial<Candidate>) => {
//             const formData = new FormData();
//             Object.entries(payload).forEach(([key, value]) => {
//                 formData.append(key, value as string);
//             });
//             return api.post(`/v1/${tag}/store`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Candidate  created successfully",
//             });
//         },
//         onError: (error) => {
//             notifications.show({
//                 color: "red",
//                 title: "Failed",
//                 message: parseErrorMessage(error as ErrorResponse),
//             });
//         },
//     });
// };

// export const useCandidateDestroyMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-update"],
//         mutationFn: (id: string | number) => {
//             return api.delete(`/v1/${tag}/destroy/${id}`);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Candidate  deleted successfully",
//             });
//         },
//         onError: (error) => {
//             notifications.show({
//                 color: "red",
//                 title: "Failed",
//                 message: parseErrorMessage(error as ErrorResponse),
//             });
//         },
//     });
// };

export const useGetPanelWiseCandidates = () => {
    const { data, isLoading } = useGetPanelCandidatesSortedList({
        per_page: 100,
        page: 1,
    });

    const panelA = data?.data?.data?.find((x) => x.panel_name === "Panel A");
    const panelB = data?.data?.data?.find((x) => x.panel_name === "Panel B");
    const panelASorted = panelA?.candidate_types
        ?.map((x) => ({
            a: x.candidates.sort((a, b) =>
                a.name.localeCompare(b.name, "en", { sensitivity: "base" })
            ),
            b: x.candidate_type_name,
        }))
        .map((x) => x.a.map((y) => ({ ...y, type: x.b, panelId: 1 })))
        .flat(Infinity);
    const panelBSorted = panelB?.candidate_types
        ?.map((x) => ({
            a: x.candidates.sort((a, b) =>
                a.name.localeCompare(b.name, "en", { sensitivity: "base" })
            ),
            b: x.candidate_type_name,
        }))
        .map((x) => x.a.map((y) => ({ ...y, type: x.b, panelId: 2 })))
        .flat(Infinity);

    return {
        isLoading,
        panelA: panelASorted as SortedCandidate[],
        panelB: panelBSorted as SortedCandidate[],
    };
};

export const useGetPanelWiseVoteCountList = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["candidate-vote"],
        queryFn: () =>
            axios.get<ListResponse<PanelCandidates>>(
                `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/v1/election/candidates-vote-count?per_page=100`
            ),
    });

    const panelA = data?.data?.data?.data?.find(
        (x) => x.panel_name === "Panel A"
    );
    const panelB = data?.data?.data?.data?.find(
        (x) => x.panel_name === "Panel B"
    );
    const panelASorted = panelA?.candidate_types
        ?.map((x) => ({
            a: x.candidates.sort((a, b) =>
                a.name.localeCompare(b.name, "en", { sensitivity: "base" })
            ),
            b: x.candidate_type_name,
        }))
        .map((x) => x.a.map((y) => ({ ...y, type: x.b, panelId: 1 })))
        .flat(Infinity);
    const panelBSorted = panelB?.candidate_types
        ?.map((x) => ({
            a: x.candidates.sort((a, b) =>
                a.name.localeCompare(b.name, "en", { sensitivity: "base" })
            ),
            b: x.candidate_type_name,
        }))
        .map((x) => x.a.map((y) => ({ ...y, type: x.b, panelId: 2 })))
        .flat(Infinity);

    return {
        isLoading,
        panelA: panelASorted as SortedCandidate[],
        panelB: panelBSorted as SortedCandidate[],
    };
};
