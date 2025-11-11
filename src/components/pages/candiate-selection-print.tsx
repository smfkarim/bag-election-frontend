"use client";

import { TForeignId } from "@/@types";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { useGetPanelWiseCandidates } from "@/services/api/candidate.api";
import { Image } from "@mantine/core";
import dayjs from "dayjs";

export default function CandidateSelectionPrint() {
  const { ballotNumber } = useVoteStore();
  const { panelA, panelB } = useGetPanelWiseCandidates();

  let first = "President";
  let second = "Vice President";
  let third = "others";
  let fourth = "Executive Secretary";

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
      <div>
        <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
          <PresidentsPanelPrint
            title="Panel A"
            color="green"
            list={(panelA as any) ?? []}
          />
          <PresidentsPanelPrint
            title="Panel B"
            color="red"
            list={(panelB as any) ?? []}
          />
        </main>
      </div>
      {/* vice  */}
      <div>
        <h1 className="text-base font-semibold text-center">{second}</h1>
        <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
          <VicePresidentsPanelPrint
            title="Panel A"
            color="green"
            list={(panelA as any) ?? []}
          />
          <VicePresidentsPanelPrint
            title="Panel B"
            color="red"
            list={(panelB as any) ?? []}
          />
        </main>
      </div>
      {/* others  */}
      <div>
        <main className="grid grid-cols-2 gap-6 flex-1 items-stretch mt-2">
          <OthersAllsPanelPrint
            title="Panel A"
            color="green"
            list={(panelA as any) ?? []}
          />
          <OthersAllsPanelPrint
            title="Panel B"
            color="red"
            list={(panelB as any) ?? []}
          />
        </main>
      </div>
      {/* others  */}
      <div>
        <h1 className="text-base font-semibold text-center">{fourth}</h1>
        <main className="grid grid-cols-2 gap-6 flex-1 items-stretch">
          <ExecutiveSecretaryPanelPrint
            title="Panel A"
            color="green"
            list={(panelA as any) ?? []}
          />
          <ExecutiveSecretaryPanelPrint
            title="Panel B"
            color="red"
            list={(panelB as any) ?? []}
          />
        </main>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 pt-3 shrink-0">
        <p>System Generated Ballot Paper</p>
      </footer>
    </div>
  );
}

//
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
  const presidents = list.filter((candidate) => candidate.type === "President");
  const selectedCandidates = useVoteStore((state) => state.selectedCandidates);
  return (
    <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full">
      <h2
        className={`text-center font-semibold mb-0 ${
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
          {presidents.map((c, i) => {
            const isChecked = !!selectedCandidates.find(
              (x) => x.uuid === c.uuid
            );
            return (
              <tr key={i} className=" border-b">
                <td className="p-1">{i + 1}</td>
                <td className="p-1">{c.name}</td>
                <td className="p-1 text-gray-600">{c.type ?? ""}</td>
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
  list: {
    panelId: string;
    name: string;
    type: string;
    id: TForeignId;
    photo_url: string;
    uuid: string;
  }[];
}) => {
  const vicePresidents = list.filter(
    (candidate) => candidate.type === "Vice President"
  );
  const selectedCandidates = useVoteStore((state) => state.selectedCandidates);
  return (
    <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full">
      <table className="w-full  text-sm flex-1 justify-start">
        <tbody>
          {vicePresidents.map((c, i) => {
            const isChecked = !!selectedCandidates.find(
              (x) => x.uuid === c.uuid
            );
            return (
              <tr key={i} className=" border-b">
                <td className="p-1">{i + 1}</td>
                <td className="p-1">{c.name}</td>
                <td className="p-1 text-gray-600">{c.type ?? ""}</td>
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

//
const OthersAllsPanelPrint = ({
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
  const othersAll = list.filter(
    (candidate) =>
      candidate.type !== "President" &&
      candidate.type !== "Vice President" &&
      candidate.type !== "Executive Secretary"
  );
  const selectedCandidates = useVoteStore((state) => state.selectedCandidates);
  return (
    <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full">
      <table className="w-full  text-sm flex-1 justify-start">
        <tbody>
          {othersAll.map((c, i) => {
            const isChecked = !!selectedCandidates.find(
              (x) => x.uuid === c.uuid
            );
            return (
              <tr key={i} className=" border-b">
                <td className="p-1">{i + 1}</td>
                <td className="p-1">{c.name}</td>
                <td className="p-1 text-gray-600">{c.type ?? ""}</td>
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

//
const ExecutiveSecretaryPanelPrint = ({
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
  const executiveSecretary = list.filter(
    (candidate) => candidate.type === "Executive Secretary"
  );
  const selectedCandidates = useVoteStore((state) => state.selectedCandidates);
  return (
    <div className="border border-gray-400 rounded-md p-2 flex flex-col h-full">
      <table className="w-full  text-sm flex-1 justify-start">
        <tbody>
          {executiveSecretary.map((c, i) => {
            const isChecked = !!selectedCandidates.find(
              (x) => x.uuid === c.uuid
            );
            return (
              <tr key={i} className="border-b">
                <td className="p-1">{i + 1}</td>
                <td className="p-1">{c.name}</td>
                <td className="p-1 text-gray-600">{c.type ?? ""}</td>
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
