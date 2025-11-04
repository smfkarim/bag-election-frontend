"use client";

import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { panelACandidates, panelBCandidates } from "@/data/candidates";
import { Image } from "@mantine/core";
import dayjs from "dayjs";

export default function CandidateSelectionPrint() {
    const { ballotNumber, selectedCandidates } = useVoteStore();

    return (
        <div
            className="bg-white text-black p-10 flex flex-col justify-between"
            style={{
                width: "210mm",
                height: "297mm", // ✅ exact A4 height
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif",
                // pageBreakAfter: "always",
            }}
        >
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
                    list={panelACandidates}
                    selected={selectedCandidates}
                />
                <PanelPrint
                    title="Panel B"
                    color="red"
                    list={panelBCandidates}
                    selected={selectedCandidates}
                />
            </main>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
                <p>Printed by BAG Voting System</p>
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
    list: { id: number; name: string; type: string; img_url: string }[];
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

            <table className="w-full  text-sm flex-1">
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
                                <td className="p-1 text-gray-600">{c.type}</td>
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
