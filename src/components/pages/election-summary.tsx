"use client";

import { TForeignId } from "@/@types";
import { getBucketURL } from "@/lib/helpers";
import { useGetPanelWiseVoteCountList } from "@/services/api/candidate.api";
import { Image } from "@mantine/core";
import dayjs from "dayjs";
import { useParams } from "next/navigation";

export default function ElectionSummary() {
    const { electionId } = useParams<{ electionId: string }>();
    const { panelA, panelB } = useGetPanelWiseVoteCountList();

    // fetch electionData by electionId

    return (
        <div className="a4-page bg-white text-black p-10 flex flex-col justify-between">
            {/* HEADER */}
            <header className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                <div className="w-20">
                    <Image src="/bag_logo.png" alt="bag_logo" />
                </div>

                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-bold text-green-800 uppercase">
                        Election Summary
                    </h1>
                    <p className="text-sm text-gray-700">
                        Election Identifier: {electionId || "—"}
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
                    list={(panelA as any) ?? []}
                />
                <PanelPrint
                    title="Panel B"
                    color="red"
                    list={(panelB as any) ?? []}
                />
            </main>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
                <p>System Generated Election Summary</p>
            </footer>
        </div>
    );
}

const PanelPrint = ({
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
        total_votes: number;
        manual_votes: number;
        digital_votes: number;
    }[];
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
                        {/* <th className="p-1 w-6 text-left">#</th> */}
                        <th className="p-1 text-left">Candidate</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((c, i) => {
                        return (
                            <tr key={i} className=" border-b last:border-none">
                                {/* <td className="p-1">{i + 1}</td> */}
                                <td className="p-1">
                                    <div className=" flex items-center justify-center gap-2 ">
                                        <div className=" size-10 ">
                                            <Image
                                                className="object-top h-full w-full"
                                                src={getBucketURL(c.photo_url)}
                                            />
                                        </div>
                                        <div>
                                            <p className="">{c.name}</p>
                                            <p className=" text-gray-600">
                                                {c.type ?? ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className=" p-1 pt-5 rounded-lg">
                                        <div className=" flex items-center justify-between">
                                            <p>
                                                Manual{" "}
                                                <p className=" text-center">
                                                    {Number(c.manual_votes)}
                                                </p>
                                            </p>
                                            <p>
                                                Digital{" "}
                                                <p className=" text-center">
                                                    {Number(c.digital_votes)}
                                                </p>
                                            </p>
                                            <p>
                                                Total{" "}
                                                <p className=" text-center">
                                                    {Number(c.total_votes)}
                                                </p>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
