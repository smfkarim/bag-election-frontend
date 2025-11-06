import { ListParams, ListResponse } from "@/@types";
import { Candidate } from "@/@types/candidate";
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
