"use client";

import { TForeignId } from "@/@types";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { PANEL_A_TITLE, PANEL_B_TITLE } from "@/constants";
import { getBucketURL } from "@/lib/helpers";
import { useGetPanelWiseCandidates } from "@/services/api/candidate.api";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ManualVoteBallot() {
    const params = useParams<{ ballotNumber: string }>();
    const { ballotNumber } = useVoteStore();
    const { panelA, panelB } = useGetPanelWiseCandidates();

    /** PANEL SWAP LOGIC */
    const swap = process.env.NEXT_PUBLIC_PANEL_SWAP === "true";
    const orderA = swap ? "order-2" : "order-1";
    const orderB = swap ? "order-1" : "order-2";

    const panelATitle =
        process.env.NEXT_PUBLIC_SHOW_PANEL_TITLE === "true"
            ? PANEL_A_TITLE
            : "Panel A";
    const panelBTitle =
        process.env.NEXT_PUBLIC_SHOW_PANEL_TITLE === "true"
            ? PANEL_B_TITLE
            : "Panel B";

    return (
        <div className="a4-page bg-white text-black p-10 flex flex-col justify-between">
            {/* HEADER */}
            <header className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                <div className="w-20">
                    <Image
                        src="/bag_logo.png"
                        alt="bag_logo"
                        height={40}
                        width={40}
                    />
                </div>

                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-bold text-green-800 uppercase">
                        Official Ballot Paper
                    </h1>
                    <p className="text-sm text-gray-700">
                        Ballot Number:{" "}
                        {params?.ballotNumber ?? (ballotNumber || "—")}
                    </p>
                </div>

                <div className="text-right text-sm">
                    <p>{dayjs().format("hh:mm A")}</p>
                    <p>{dayjs().format("DD MMMM, YYYY")}</p>
                </div>
            </header>

            <div className="border border-gray-400 rounded-md p-1">
                {/* PRESIDENTS */}
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

                {/* VICE PRESIDENTS */}
                <div>
                    <h1 className="text-base font-semibold text-center">
                        Vote two from the following four
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

                {/* OTHERS */}
                <div>
                    <div className="h-px bg-black mt-5"></div>
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

                {/* SECRETARY */}
                <div>
                    <h1 className="text-base font-semibold text-center mt-2">
                        Vote five from the following ten
                    </h1>

                    <main className="grid grid-cols-2 gap-6 flex-1 items-stretch mt-2">
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
            </div>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
                <p>System Generated Ballot Paper</p>
            </footer>
        </div>
    );
}

/* -----------------------------------------
   COMPONENTS
----------------------------------------- */

const PresidentsPanelPrint = ({ title, color, list }: any) => {
    const presidents = list.filter(
        (candidate: any) => candidate.type === "President"
    );
    return <PanelTable title={title} color={color} candidates={presidents} />;
};

const VicePresidentsPanelPrint = ({ title, color, list }: any) => {
    const filtered = list.filter(
        (candidate: any) => candidate.type === "Vice President"
    );
    return <PanelTable color={color} candidates={filtered} />;
};

const OthersAllsPanelPrint = ({ title, color, list }: any) => {
    const filtered = list.filter(
        (candidate: any) =>
            candidate.type !== "President" &&
            candidate.type !== "Vice President" &&
            candidate.type !== "Executive Secretary"
    );
    return <PanelTable color={color} candidates={filtered} />;
};

const ExecutiveSecretaryPanelPrint = ({ title, color, list }: any) => {
    const filtered = list.filter(
        (candidate: any) => candidate.type === "Executive Secretary"
    );
    return <PanelTable color={color} candidates={filtered} />;
};

/* -----------------------------------------
   REUSABLE TABLE COMPONENT
----------------------------------------- */

const PanelTable = ({
    title,
    color,
    candidates,
}: {
    title?: string;
    color: string;
    candidates: any[];
}) => {
    return (
        <div className="p-1 flex flex-col h-full">
            {title ? (
                <h2
                    className={`text-center font-semibold ${
                        color === "green" ? "text-green-700" : "text-red-700"
                    }`}
                >
                    {title}
                </h2>
            ) : null}

            <table className="w-full text-sm flex-1 justify-start">
                {title && (
                    <thead className="border-b">
                        <tr>
                            {/* <th className="p-1 w-6">#</th> */}
                            <th className="p-1 w-10 text-left">Photo</th>
                            <th className="p-1 text-left">Candidate</th>
                            <th className="p-1 text-left">Type</th>
                            <th className="p-1 w-6 text-center">✓</th>
                        </tr>
                    </thead>
                )}

                <tbody>
                    {candidates.map((c, i) => (
                        <tr key={i} className="border-b last:border-none h-10">
                            {/* <td className="p-1">{i + 1}</td> */}

                            <td>
                                <div className="size-10 my-1 mx-auto">
                                    <Image
                                        height={40}
                                        width={40}
                                        className="object-contain object-top h-full w-full"
                                        src={getBucketURL(c.photo_url)}
                                        alt={c?.name}
                                    />
                                </div>
                            </td>

                            <td className="p-1 text-xs">{c.name}</td>
                            <td className="p-1 text-xs text-gray-600">
                                {c.type}
                            </td>

                            <td className="p-1 text-center">
                                <div className="border size-6 rounded-sm" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
