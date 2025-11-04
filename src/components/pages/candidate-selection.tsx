import { Button, Checkbox, Image } from "@mantine/core";
import dayjs from "dayjs";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { panelACandidates, panelBCandidates } from "@/data/candidates";

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

export default function CandidateSelection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { ballotNumber, selectedCandidates } = useVoteStore();
  return (
    <div ref={contentRef} className=" m-5 max-w-7xl mx-auto space-y-5">
      <Button onClick={reactToPrintFn} color="red">
        Print
      </Button>
      {/* Header */}
      <div className=" flex items-center justify-between px-5 py-2 rounded-2xl bg-green-100 ">
        <div className=" size-15">
          <Image src={"/bag_logo.png"} alt="bag_logo" />
        </div>

        {/* Ballot Number */}
        <h1 className=" text-right text-2xl text-green-800 font-semibold">
          Ballot Number: {ballotNumber}
        </h1>
        <div className=" sm:text-lg">
          <p className=" text-right">{dayjs(new Date()).format("hh:mm A")}</p>
          <p>{dayjs(new Date()).format("DD MMMM, YYYY")}</p>
        </div>
      </div>

      {/* Panel Options */}
      <div className=" flex items-center gap-10">
        <PanelSection candidateList={panelBCandidates} name="B" color="red" />
        <PanelSection candidateList={panelACandidates} name="A" color="green" />
      </div>
      <div className="flex justify-center items-center">
        <Button radius={10} w={400} size="lg">
          Submit
        </Button>
      </div>
    </div>
  );
}

const PanelSection = (props: {
  name: string;
  candidateList: TCandidate[];
  color: "red" | "green";
}) => {
  return (
    <div className="flex-1 space-y-2 mt-5">
      <div>
        <h1 className=" text-center text-2xl">Panel {props.name}</h1>
      </div>
      <div
        className={`p-10 rounded-2xl space-y-3 ${
          props.color === "red" ? "bg-red-800/10" : "bg-green-800/10"
        }`}
      >
        {props.candidateList?.map((x, i) => (
          <CandidateCard key={x.id} panel={props.name} data={x} index={i + 1} />
        ))}
      </div>
    </div>
  );
};

const CandidateCard = (props: {
  panel: string;
  data: TCandidate;
  index: number;
}) => {
  const { onSelectedCandidatesChanged, selectedCandidates } = useVoteStore();
  const data = {
    name: props.data.name,
    type: props.data.type,
    index: props.index,
    panel: props.panel,
    id: props.data.id,
  };

  const checked = !!selectedCandidates?.find((x) => x.id === props.data.id);
  const disabled = !!selectedCandidates.find((x) => x.index === data.index);
  const cardDisable = !checked && disabled;

  return (
    <div
      className={`flex gap-5 bg-white items-center border  rounded-xl px-5 py-2 ${
        checked ? "border-green-800 " : " border-transparent"
      } ${cardDisable ? " opacity-50 " : " "}`}
    >
      <Checkbox
        disabled={cardDisable}
        size="md"
        checked={checked}
        onChange={(e) => onSelectedCandidatesChanged(e.target.checked, data)}
      />
      <div className="size-15 rounded-full">
        <Image
          src={props.data?.img_url}
          alt={props.data.name}
          className=" h-full w-full"
        />
      </div>
      <div>
        <h1>{props.data?.name}</h1>
        <p className="text-xs">{props.data?.type}</p>
      </div>
    </div>
  );
};
