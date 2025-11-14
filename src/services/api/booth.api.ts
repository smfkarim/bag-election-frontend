import { ListParams, ListResponse } from "@/@types";
import { Booth } from "@/@types/booth";
import { queryClient } from "@/components/layout/query-provider";
import { parseErrorMessage } from "@/lib/helpers";
import { useAuthStore } from "@/store/auth-store";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const tag = `booth`;
const baseURL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

export const useGetBoothList = (params: ListParams<Booth>) => {
    const token = useAuthStore.getState().accessToken;
    return useQuery({
        queryKey: [tag, params],
        queryFn: async () => {
            const data = await axios.get<ListResponse<Booth>>(
                baseURL + `/v1/${tag}/get`,
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token ? token : ""}`,
                    },
                }
            );
            return data.data;
        },
    });
};

// export const useBoothUpdateMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-update"],
//         mutationFn: (payload: {
//             id: string | number;
//             data: Partial<Booth>;
//         }) => {
//             return axios.put(
//                 baseURL + `/v1/${tag}/update/${payload.id}`,
//                 payload.data
//             );
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Booth updated successfully",
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
// export const useBoothCreateMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-create"],
//         mutationFn: (payload: Partial<Booth>) => {
//             return axios.post(`/v1/${tag}/store`, payload);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Booth created successfully",
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

// export const useBoothDestroyMutation = () => {
//     return useMutation({
//         mutationKey: [tag + "-update"],
//         mutationFn: (id: string | number) => {
//             return api.delete(`/v1/${tag}/destroy/${id}`);
//         },
//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: [tag] });
//             notifications.show({
//                 title: "Success",
//                 message: "Booth deleted successfully",
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
