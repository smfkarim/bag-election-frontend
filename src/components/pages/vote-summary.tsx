"use client";

import { SortedCandidate } from "@/@types/candidate";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { PANEL_A_TITLE, PANEL_B_TITLE } from "@/constants";
import { useGetPanelWiseCandidates } from "@/services/api/candidate.api";
import { useGetBallotInfoMutation } from "@/services/api/vote.api";
import { Image } from "@mantine/core";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RightReserved from "../ui/right-reserved";

export default function VoteSummary() {
    const { ballotNumber }: { ballotNumber: string } = useParams();
    //vote
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCandidates } = useVoteStore();
    const { panelA, panelB, ...panelReq } = useGetPanelWiseCandidates();
    const { mutateAsync: getBallotInfo } = useGetBallotInfoMutation();
    const panelATitle =
        process.env.NEXT_PUBLIC_SHOW_PANEL_TITLE === "true"
            ? PANEL_A_TITLE
            : "Panel A";
    const panelBTitle =
        process.env.NEXT_PUBLIC_SHOW_PANEL_TITLE === "true"
            ? PANEL_B_TITLE
            : "Panel B";

    /** PANEL SWAP LOGIC */
    const swap = process.env.NEXT_PUBLIC_PANEL_SWAP === "true";
    const orderA = swap ? "order-2" : "order-1";
    const orderB = swap ? "order-1" : "order-2";
    useEffect(() => {
        getBallotInfo(ballotNumber)
            .then((info) => {
                useVoteStore.setState({
                    selectedCandidates: info.data.data.map((x, idx) => ({
                        uuid: x.candidate_id,
                        code: "",
                        id: 0,
                        name: "",
                        panelId: 0,
                        photo_url: "",
                        type: "",
                        digital_votes: 0,
                        manual_votes: 0,
                        total_votes: 0,
                    })),
                });
                console.log(info, "INFO");
            })
            .finally(() => {
                setIsLoading(false);
            })
            .catch(() => {
                useVoteStore.setState({
                    selectedCandidates: [],
                });
            });
        // useVoteStore.setState({});
    }, []);

    if (isLoading || panelReq.isLoading) return null;
    if (selectedCandidates.length === 0) return <p>Invalid ballot</p>;

    return (
        <div className="a4-page bg-white text-black p-10 flex flex-col justify-between">
            {/* HEADER */}
            <header className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                <div className="w-20">
                    <Image src="/bag_logo.png" alt="bag_logo" />
                </div>

                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-bold text-green-800 uppercase">
                        Official Ballot Paper
                    </h1>
                    <p className="text-sm text-gray-700">
                        Ballot Number: {ballotNumber || "—"}
                    </p>
                </div>

                <div className="text-right text-sm">
                    <p>{dayjs().format("hh:mm A")}</p>
                    <p>{dayjs().format("DD MMMM, YYYY")}</p>
                </div>
            </header>

            {/* PANELS */}
            <main className="grid grid-cols-2 gap-6 flex-1 items-stretch ">
                <div className={orderA}>
                    <PanelPrint
                        title={panelATitle}
                        color="green"
                        list={(panelA as any) ?? []}
                    />
                </div>

                <div className={orderB}>
                    <PanelPrint
                        title={panelBTitle}
                        color="violet"
                        list={(panelB as any) ?? []}
                    />
                </div>
            </main>

            {/* FOOTER */}
            <RightReserved />
        </div>
    );
}

const PanelPrint = ({
    title,
    color,
    list,
}: {
    title: string;
    color: "violet" | "green";
    list: SortedCandidate[];
}) => {
    const selectedCandidates = useVoteStore(
        (state) => state.selectedCandidates
    );
    return (
        <div className="border border-gray-400 rounded-md p-3 flex flex-col h-full">
            <h2
                className={`text-center font-semibold mb-2 ${
                    color === "green" ? "text-green-700" : "text-violet-700"
                }`}
            >
                {title}
            </h2>

            <table className="w-full  text-sm flex-1 justify-start">
                <thead className=" border-b ">
                    <tr className="">
                        <th className="p-1 w-6 text-left">#</th>
                        <th className="p-1 text-left">Candidate</th>
                        <th className="p-1 text-left">Type</th>
                        <th className="p-1 w-6 text-center">✓</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((c, i) => {
                        const isChecked = !!selectedCandidates.find(
                            (s) => s.uuid === c.uuid
                        );
                        return (
                            <tr key={i} className=" border-b last:border-none">
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">{c.name}</td>
                                <td className="p-1 text-gray-600">
                                    {c.type ?? ""}
                                </td>
                                <td className="p-1 text-center">
                                    {isChecked ? "✔️" : ""}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
