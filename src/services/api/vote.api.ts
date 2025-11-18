import { useMutation, useQuery } from "@tanstack/react-query";
import api from ".";
import { ElectionStatusResponse } from "@/@types/election";

export const useGetBallotInfoMutation = () =>
    useMutation({
        mutationFn: (ballot_id: string) =>
            api.post<{ data: BallotCandidate[] }>(`/v1/vote/count/ballot`, {
                ballot_id,
            }),
    });

export const useGetCandidateVoteCounts = () =>
    useQuery({
        queryKey: ["candidate-vote-count"],
        queryFn: () =>
            api.get(`/v1/election/candidates-vote-count?per_page=100`),
    });

interface BallotCandidate {
    election_id: string;
    candidate_id: string;
    device_id: string;
    booth_id: null;
    cast_time: string;
}

export const useVoteStatus = (voter_id?: string) => {
    return useQuery({
        enabled: !!voter_id,
        queryKey: ["vote-status", voter_id],
        queryFn: async () =>
            (
                await api.post<{ data: ElectionStatusResponse }>(`/v1/status`, {
                    voter_id,
                })
            ).data.data,
    });
};
