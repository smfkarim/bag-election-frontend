import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const tag = "election-setup";
export const useGetElectionSetupById = (
    id: string,
    enabled: boolean = true
) => {
    return useQuery({
        enabled,
        queryKey: [tag, id],
        queryFn: async () => {
            const data = await axios.get<{ data: ElectionSetup }>(
                process.env.NEXT_PUBLIC_ADMIN_API_URL + `/v1/${tag}/get/${id}`
            );
            return data.data;
        },
    });
};

export type ElectionStatus = "pending" | "ongoing" | "completed";
export type VotingCountStatus = "in_progress" | "not_started" | "completed";

export interface ElectionSetup {
    id: number;
    code: string;
    election_name: string;
    election_date: string;
    from_time: string;
    to_time: string;
    location: string;
    description: string;
    election_status: ElectionStatus;
    voting_count_status: VotingCountStatus;
    created_by: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
    import_close_date_time: string;
    panel_admin_registration_close_date_time: string;
    individual_payment_close_date_time: string;
    ec_superadmin_input_access_close_date_time: string;
    driver_link: string | null;
}
