"use client";

import { TForeignId } from "@/@types";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { PANEL_A_TITLE, PANEL_B_TITLE } from "@/constants";
import { useGetPanelWiseCandidates } from "@/services/api/candidate.api";
import { Image } from "@mantine/core";
import dayjs from "dayjs";

export default function CandidateSelectionPrint() {
    const { ballotNumber } = useVoteStore();
    const { panelA, panelB } = useGetPanelWiseCandidates();

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

            {/* PRESIDENT SECTION */}
            <div>
                <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
                    <div className={orderA}>
                        <PresidentsPanelPrint
                            title={panelATitle}
                            color="green"
                            list={(panelA as any) ?? []}
                        />
                    </div>

                    <div className={orderB}>
                        <PresidentsPanelPrint
                            title={panelBTitle}
                            color="red"
                            list={(panelB as any) ?? []}
                        />
                    </div>
                </main>
            </div>

            {/* VICE PRESIDENT SECTION */}
            <div>
                <h1 className="text-base font-semibold text-center">
                    Select two from the following four
                </h1>

                <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
                    <div className={orderA}>
                        <VicePresidentsPanelPrint
                            title={panelATitle}
                            color="green"
                            list={(panelA as any) ?? []}
                        />
                    </div>

                    <div className={orderB}>
                        <VicePresidentsPanelPrint
                            title={panelBTitle}
                            color="red"
                            list={(panelB as any) ?? []}
                        />
                    </div>
                </main>
            </div>

            {/* OTHERS SECTION */}
            <div>
                <main className="grid grid-cols-2 gap-6 flex-1 items-stretch mt-2">
                    <div className={orderA}>
                        <OthersAllsPanelPrint
                            title={panelATitle}
                            color="green"
                            list={(panelA as any) ?? []}
                        />
                    </div>

                    <div className={orderB}>
                        <OthersAllsPanelPrint
                            title={panelBTitle}
                            color="red"
                            list={(panelB as any) ?? []}
                        />
                    </div>
                </main>
            </div>

            {/* EXECUTIVE SECRETARY SECTION */}
            <div>
                <h1 className="text-base font-semibold text-center">
                    Select five from the following ten
                </h1>

                <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
                    <div className={orderA}>
                        <ExecutiveSecretaryPanelPrint
                            title={panelATitle}
                            color="green"
                            list={(panelA as any) ?? []}
                        />
                    </div>

                    <div className={orderB}>
                        <ExecutiveSecretaryPanelPrint
                            title={panelBTitle}
                            color="red"
                            list={(panelB as any) ?? []}
                        />
                    </div>
                </main>
            </div>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
                <p>System Generated Ballot Paper</p>
            </footer>
        </div>
    );
}

/* ------------------------------
   COMPONENTS BELOW
------------------------------ */

const PresidentsPanelPrint = ({
    title,
    color,
    list,
}: {
    title: string;
    color: "red" | "green";
    list: {
        panelId: string;
        name: string;
        type: string;
        id: TForeignId;
        photo_url: string;
        uuid: string;
    }[];
}) => {
    const presidents = list.filter(
        (candidate) => candidate.type === "President"
    );
    const selectedCandidates = useVoteStore(
        (state) => state.selectedCandidates
    );

    return (
        <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full flex-1">
            <h2
                className={`text-center font-semibold mb-0 ${
                    color === "green" ? "text-green-700" : "text-red-700"
                }`}
            >
                {title}
            </h2>

            <table className="w-full text-sm flex-1 justify-start">
                <thead className="border-b">
                    <tr>
                        <th className="p-1 w-6 text-left">#</th>
                        <th className="p-1 text-left">Candidate</th>
                        <th className="p-1 text-left">Type</th>
                        <th className="p-1 w-6 text-center">✓</th>
                    </tr>
                </thead>

                <tbody>
                    {presidents.map((c, i) => {
                        const isChecked = !!selectedCandidates.find(
                            (x) => x.uuid === c.uuid
                        );

                        return (
                            <tr key={i} className="border-b">
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">{c.name}</td>
                                <td className="p-1 text-gray-600">
                                    {c.type ?? ""}
                                </td>
                                <td className="p-1 text-xs text-center">
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

const VicePresidentsPanelPrint = ({
    title,
    color,
    list,
}: {
    title: string;
    color: "red" | "green";
    list: any[];
}) => {
    const vicePresidents = list.filter(
        (candidate) => candidate.type === "Vice President"
    );
    const selectedCandidates = useVoteStore(
        (state) => state.selectedCandidates
    );

    return (
        <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full flex-1">
            <table className="w-full text-sm flex-1 justify-start">
                <tbody>
                    {vicePresidents.map((c, i) => {
                        const isChecked = !!selectedCandidates.find(
                            (x) => x.uuid === c.uuid
                        );

                        return (
                            <tr key={i} className="border-b">
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">{c.name}</td>
                                <td className="p-1 text-gray-600">
                                    {c.type ?? ""}
                                </td>
                                <td className="p-1 text-xs text-center">
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

const OthersAllsPanelPrint = ({
    title,
    color,
    list,
}: {
    title: string;
    color: "red" | "green";
    list: any[];
}) => {
    const othersAll = list.filter(
        (candidate) =>
            candidate.type !== "President" &&
            candidate.type !== "Vice President" &&
            candidate.type !== "Executive Secretary"
    );
    const selectedCandidates = useVoteStore(
        (state) => state.selectedCandidates
    );

    return (
        <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full flex-1">
            <table className="w-full text-sm flex-1 justify-start">
                <tbody>
                    {othersAll.map((c, i) => {
                        const isChecked = !!selectedCandidates.find(
                            (x) => x.uuid === c.uuid
                        );

                        return (
                            <tr key={i} className="border-b">
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">{c.name}</td>
                                <td className="p-1 text-gray-600">
                                    {c.type ?? ""}
                                </td>
                                <td className="p-1 text-xs text-center">
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

const ExecutiveSecretaryPanelPrint = ({
    title,
    color,
    list,
}: {
    title: string;
    color: "red" | "green";
    list: any[];
}) => {
    const executiveSecretary = list.filter(
        (candidate) => candidate.type === "Executive Secretary"
    );
    const selectedCandidates = useVoteStore(
        (state) => state.selectedCandidates
    );

    return (
        <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full flex-1">
            <table className="w-full text-sm flex-1 justify-start">
                <tbody>
                    {executiveSecretary.map((c, i) => {
                        const isChecked = !!selectedCandidates.find(
                            (x) => x.uuid === c.uuid
                        );

                        return (
                            <tr key={i} className="border-b">
                                <td className="p-1">{i + 1}</td>
                                <td className="p-1">{c.name}</td>
                                <td className="p-1 text-gray-600">
                                    {c.type ?? ""}
                                </td>
                                <td className="p-1 text-xs text-center">
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
