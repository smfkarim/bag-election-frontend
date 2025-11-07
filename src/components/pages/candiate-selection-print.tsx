"use client";

import { TForeignId } from "@/@types";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { useGetPanelCandidatesSortedList } from "@/services/api/candidate.api";
import { Image } from "@mantine/core";
import dayjs from "dayjs";

export default function CandidateSelectionPrint() {
    const { ballotNumber, selectedCandidates } = useVoteStore();

    const { data } = useGetPanelCandidatesSortedList({
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
            <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
                <PanelPrint
                    title="Panel A"
                    color="green"
                    list={(panelASorted as any) ?? []}
                    selected={selectedCandidates}
                />
                <PanelPrint
                    title="Panel B"
                    color="red"
                    list={(panelBSorted as any) ?? []}
                    selected={selectedCandidates}
                />
            </main>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
                <p>System Generated Ballot Paper</p>
            </footer>
        </div>
    );
}

const PanelPrint = ({
    title,
    color,
    list,
    selected,
}: {
    title: string;
    color: "red" | "green";
    list: {
        panelId: string;
        name: string;
        type: string;
        id: TForeignId;
        photo_url: string;
    }[];
    selected: any[];
}) => {
    return (
        <div className="border border-gray-400 rounded-md p-3 flex flex-col h-full">
            <h2
                className={`text-center font-semibold mb-2 ${
                    color === "green" ? "text-green-700" : "text-red-700"
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
                        const isChecked = !!selected.find((s) => s.id === c.id);
                        return (
                            <tr key={c.id} className=" border-b">
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
