"use client";

import { Candidate } from "@/@types/candidate";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { getBucketURL } from "@/lib/helpers";
import { useGetCandidateList } from "@/services/api/candidate.api";
import { useGiveVoteMutation } from "@/services/api/voter.api";
import { Button, Checkbox, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export type TCandidate = {
    id: number;
    name: string;
    type: string;
    img_url: string;
};

export type TSelection = {
    id: number;
    index: number;
    name: string;
    type: string;
    panel: string;
};

export default function CandidateSelectionView() {
    const router = useRouter();

    const { data: panelACandidates } = useGetCandidateList({
        page: 1,
        per_page: 100,
    });
    const { data: panelBCandidates } = useGetCandidateList({
        page: 1,
        per_page: 100,
    });

    const { ballotNumber, selectedCandidates, voter_id } = useVoteStore();
    const giveVoteMutation = useGiveVoteMutation();

    const handleSubmitVote = async () => {
        try {
            for (let candidate of selectedCandidates) {
                await giveVoteMutation.mutateAsync({
                    candidate_id: candidate.id,
                    device_id: "windows",
                    election_id: "1",
                    voter_id,
                });
            }
            modals.closeAll();
            router.push("/election/vote/summary");
        } catch {}
    };

    return (
        <div className="m-5 max-w-7xl mx-auto space-y-5">
            {/* Print Button */}

            {/* 🧭 Your original UI remains the same */}
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-2 rounded-2xl bg-green-100">
                    <div className="size-15">
                        <Image src={"/bag_logo.png"} alt="bag_logo" />
                    </div>

                    <h1 className="text-right text-2xl text-green-800 font-semibold">
                        Ballot Number: {ballotNumber}
                    </h1>
                    <div className="sm:text-lg">
                        <p className="text-right">
                            {dayjs().format("hh:mm A")}
                        </p>
                        <p>{dayjs().format("DD MMMM, YYYY")}</p>
                    </div>
                </div>
                <div>
                    {panelACandidates?.data?.data?.length === 0 ||
                    panelBCandidates?.data?.data?.length === 0 ? (
                        <p className=" text-center my-10 ">
                            No candidates available
                        </p>
                    ) : (
                        <div>
                            {/* Panel Options */}
                            <div className="flex items-center gap-10">
                                <PanelSection
                                    candidateList={
                                        panelACandidates?.data.data ?? []
                                    }
                                    name="B"
                                    color="red"
                                />
                                <PanelSection
                                    candidateList={
                                        panelBCandidates?.data.data ?? []
                                    }
                                    name="A"
                                    color="green"
                                />
                            </div>

                            <div className="flex justify-center items-center">
                                <Button
                                    disabled={selectedCandidates.length !== 15}
                                    onClick={() => {
                                        modals.open({
                                            closeOnClickOutside: false,
                                            withCloseButton: false,
                                            centered: true,
                                            size: "300px",
                                            children: (
                                                <div className=" flex flex-col items-center space-y-3">
                                                    <p className=" text-center p-5 ">
                                                        Are you sure to confirm
                                                        the vote and print the
                                                        Ballot Paper ?
                                                    </p>

                                                    <div className=" flex items-center gap-5">
                                                        <Button
                                                            variant="outline"
                                                            color="red"
                                                            onClick={() => {
                                                                modals.closeAll();
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={
                                                                handleSubmitVote
                                                            }
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        });
                                    }}
                                    radius={10}
                                    w={400}
                                    size="lg"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const PanelSection = (props: {
    name: string;
    candidateList: Candidate[];
    color: "red" | "green";
}) => {
    return (
        <div className="flex-1 space-y-2 mt-5">
            <div>
                <h1 className="text-center text-2xl">Panel {props.name}</h1>
            </div>
            <div
                className={`p-10 rounded-2xl space-y-3 ${
                    props.color === "red" ? "bg-red-800/10" : "bg-green-800/10"
                }`}
            >
                {props.candidateList?.map((x, i) => (
                    <CandidateCard
                        key={x.id}
                        panel={props.name}
                        data={x}
                        index={i + 1}
                    />
                ))}
            </div>
        </div>
    );
};

const CandidateCard = (props: {
    panel: string;
    data: Candidate;
    index: number;
}) => {
    const { onSelectedCandidatesChanged, selectedCandidates } = useVoteStore();
    const data = {
        name: props.data.name,
        type: props.data.candidate_type?.name ?? "",
        index: props.index,
        panel: props.panel,
        id: Number(props.data.id),
    };

    const checked = !!selectedCandidates?.find((x) => x.id === props.data.id);
    const disabled = !!selectedCandidates.find((x) => x.index === data.index);
    const cardDisable = !checked && disabled;

    return (
        <div
            className={`flex gap-5 bg-white items-center border rounded-xl px-5 py-2 ${
                checked ? "border-green-800" : "border-transparent"
            } ${cardDisable ? "opacity-50" : ""}`}
        >
            <Checkbox
                disabled={cardDisable}
                size="md"
                checked={checked}
                onChange={(e) =>
                    onSelectedCandidatesChanged(e.target.checked, data)
                }
            />
            <div className="size-15 rounded-full">
                <Image
                    src={getBucketURL(props.data?.photo_url as string)}
                    alt={props.data.name}
                    className="h-full w-full"
                />
            </div>
            <div>
                <h1>{props.data?.name}</h1>
                <p className="text-xs">{props.data?.candidate_type?.name}</p>
            </div>
        </div>
    );
};
