"use client";

import { SortedCandidate } from "@/@types/candidate";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import { PANEL_A_TITLE, PANEL_B_TITLE } from "@/constants";
import { getBucketURL } from "@/lib/helpers";
import { printPage } from "@/lib/printer";
import { useGetPanelWiseCandidates } from "@/services/api/candidate.api";
import { useGiveBulkVoteMutation } from "@/services/api/voter.api";
import { Button, Image, Skeleton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import CandidateSelectionPrint from "./candiate-selection-print";

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
    uuid: string;
};

export default function CandidateSelectionView() {
    const [step, setStep] = useState<"selection" | "confirmation">("selection");
    const router = useRouter();
    const { ballotNumber, selectedCandidates, voter_id } = useVoteStore();
    const giveVoteMutation = useGiveBulkVoteMutation();
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });

    let first = "President";
    let second = "Vice President";
    let third = "others";
    let fourth = "Executive Secretary";

    const VoteSubmitConfirmation = () => {
        const [loading, setLoading] = useState(false);
        return (
            <div className="flex flex-col items-center space-y-3">
                <p className="text-center p-5">
                    Are you sure to confirm the vote and print the Ballot Paper?
                </p>

                <div className="flex items-center gap-5">
                    <Button
                        disabled={giveVoteMutation.isPending || loading}
                        variant="outline"
                        color="violet"
                        onClick={() => {
                            modals.closeAll();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={giveVoteMutation.isPending || loading}
                        loading={giveVoteMutation.isPending || loading}
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                setLoading(true);
                                const ids = selectedCandidates?.map(
                                    (x) => x.uuid
                                );
                                await giveVoteMutation.mutateAsync({
                                    candidate_ids: ids,
                                    device_id: "windows",
                                    election_id: "1",
                                    voter_id,
                                });
                                // reactToPrintFn();
                                await printPage(
                                    "/print/digital-vote/" + ballotNumber
                                );
                                modals.closeAll();
                                setTimeout(() => router.replace("/"), 1000);
                            } catch (error) {
                                notifications.show({
                                    autoClose: 40 * 1000,
                                    title: "Error printing digital ballot",
                                    message:
                                        "Your vote is submitted. But there was an error while trying to print the digital vote. Please contact election-commission to reprint your ballot paper.",
                                    color: "red",
                                });
                                modals.closeAll();
                                router.replace("/");

                                console.error(error);
                            } finally {
                                setLoading(false);
                                modals.closeAll();
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        );
    };
    const handleSubmitVote = async () => {
        modals.open({
            closeOnClickOutside: false,
            withCloseButton: false,
            centered: true,
            size: "300px",
            children: <VoteSubmitConfirmation />,
        });
    };

    // 🧠 Extract data safely
    const { panelA, panelB, isLoading } = useGetPanelWiseCandidates();

    const renderSelectionStep = (
        <div className="m-5 max-w-7xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-2 rounded-2xl bg-green-100">
                <div className="size-15">
                    <Image src={"/bag_logo.png"} alt="bag_logo" />
                </div>

                <h1 className="text-right text-2xl text-green-800 font-semibold">
                    Ballot Number: {ballotNumber}
                </h1>
                <div className="sm:text-lg">
                    <p className="text-right">{dayjs().format("hh:mm A")}</p>
                    <p>{dayjs().format("DD MMMM, YYYY")}</p>
                </div>
            </div>

            {/* ⏳ Loading Skeleton */}
            {isLoading ? (
                <div className="flex gap-10 mt-10">
                    {[1, 2].map((panel) => (
                        <div key={panel} className="flex-1 space-y-5">
                            <Skeleton height={30} width="40%" mx="auto" />
                            {[...Array(10)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    height={60}
                                    radius="xl"
                                    className="mt-3"
                                    animate
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {panelA?.length === 0 || panelB?.length === 0 ? (
                        <p className="text-center my-10">
                            No candidates available
                        </p>
                    ) : (
                        <div>
                            {/* Presidents */}
                            <div
                                className={`flex gap-10 ${
                                    process.env.NEXT_PUBLIC_PANEL_SWAP ===
                                    "true"
                                        ? "flex-row-reverse"
                                        : ""
                                }`}
                            >
                                <PanelSection
                                    type={first}
                                    candidateList={(panelA as any) ?? []}
                                    name="A"
                                    color="green"
                                />
                                <PanelSection
                                    type={first}
                                    candidateList={(panelB as any) ?? []}
                                    name="B"
                                    color="violet"
                                />
                            </div>

                            {/* Vice Presidents */}
                            <div>
                                <h1 className="text-2xl font-bold text-center mt-5">
                                    Vote two from following four
                                </h1>
                                <div
                                    className={`flex gap-10 ${
                                        process.env.NEXT_PUBLIC_PANEL_SWAP ===
                                        "true"
                                            ? "flex-row-reverse"
                                            : ""
                                    }`}
                                >
                                    <VicePresidentPanelSection
                                        type={second}
                                        candidateList={(panelA as any) ?? []}
                                        name="A"
                                        color="green"
                                    />
                                    <VicePresidentPanelSection
                                        type={second}
                                        candidateList={(panelB as any) ?? []}
                                        name="B"
                                        color="violet"
                                    />
                                </div>
                            </div>
                            {/* others all */}
                            <div>
                                <div
                                    className={`flex gap-10 ${
                                        process.env.NEXT_PUBLIC_PANEL_SWAP ===
                                        "true"
                                            ? "flex-row-reverse"
                                            : ""
                                    }`}
                                >
                                    <AllPanelSection
                                        candidateList={(panelA as any) ?? []}
                                        name="A"
                                        color="green"
                                    />
                                    <AllPanelSection
                                        candidateList={(panelB as any) ?? []}
                                        name="B"
                                        color="violet"
                                    />
                                </div>
                            </div>
                            {/*  Executive Secretary */}
                            <div>
                                <h1 className="text-2xl font-bold text-center mt-5">
                                    Vote five from the following ten
                                </h1>
                                <div
                                    className={`flex gap-10 ${
                                        process.env.NEXT_PUBLIC_PANEL_SWAP ===
                                        "true"
                                            ? "flex-row-reverse"
                                            : ""
                                    }`}
                                >
                                    <ExecutiveSecretaryPanelSection
                                        type={fourth}
                                        candidateList={(panelA as any) ?? []}
                                        name="A"
                                        color="green"
                                    />
                                    <ExecutiveSecretaryPanelSection
                                        type={fourth}
                                        candidateList={(panelB as any) ?? []}
                                        name="B"
                                        color="violet"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center my-10">
                                <Button
                                    classNames={{
                                        root: "disabled:bg-green-800!  disabled:text-white! disabled:opacity-50",
                                    }}
                                    disabled={selectedCandidates.length !== 15}
                                    onClick={() => {
                                        setStep("confirmation");
                                    }}
                                    radius={10}
                                    w={400}
                                    size="lg"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderConfirmationStep = (
        <div className=" max-w-5xl mx-auto">
            <div ref={printRef}>
                <CandidateSelectionPrint />
            </div>
            <div className="flex justify-center items-center my-10 gap-10">
                <Button
                    classNames={{
                        root: "disabled:bg-green-800!  disabled:text-white! disabled:opacity-50",
                    }}
                    variant="outline"
                    onClick={() => setStep("selection")}
                    radius={10}
                    w={400}
                    size="lg"
                >
                    Back
                </Button>
                <Button
                    classNames={{
                        root: "disabled:bg-green-800!  disabled:text-white! disabled:opacity-50",
                    }}
                    disabled={selectedCandidates.length !== 15}
                    onClick={handleSubmitVote}
                    radius={10}
                    w={400}
                    size="lg"
                >
                    Print & Submit
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex mx-auto">
            {step === "selection"
                ? renderSelectionStep
                : renderConfirmationStep}
        </div>
    );
}

//   All
const AllPanelSection = (props: {
    name: string;
    candidateList: SortedCandidate[];
    color: "violet" | "green";
}) => {
    const all = props.candidateList.filter(
        (candidate) =>
            candidate.type !== "President" &&
            candidate.type !== "Vice President" &&
            candidate.type !== "Executive Secretary"
    );
    return (
        <div className="flex-1 space-y-2 mt-5">
            <div
                className={`p-5 rounded-2xl space-y-3 ${
                    props.color === "violet"
                        ? "bg-violet-800/10"
                        : "bg-green-800/10"
                }`}
            >
                {all?.map((x, i) => (
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

//   presidents
const PanelSection = (props: {
    type: string;
    name: string;
    candidateList: SortedCandidate[];
    color: "violet" | "green";
}) => {
    const presidents = props.candidateList.filter(
        (candidate) => candidate.type === props.type
    );

    const panelTitle =
        process.env.NEXT_PUBLIC_SHOW_PANEL_TITLE === "true" ? (
            <>{props.name === "A" ? PANEL_A_TITLE : PANEL_B_TITLE}</>
        ) : (
            <>Panel {props.name}</>
        );

    return (
        <div className="flex-1 space-y-2 mt-5">
            <h1 className="text-center text-2xl">{panelTitle}</h1>
            <div
                className={`p-5 rounded-2xl space-y-3 ${
                    props.color === "violet"
                        ? "bg-violet-800/10"
                        : "bg-green-800/10"
                }`}
            >
                {presidents?.map((x, i) => (
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

// Vice President
const VicePresidentPanelSection = (props: {
    type: string;
    name: string;
    candidateList: SortedCandidate[];
    color: "violet" | "green";
}) => {
    const vicePresidents = props.candidateList.filter(
        (candidate) => candidate.type === props.type
    );
    return (
        <div className="flex-1 space-y-2 mt-5">
            <div
                className={`p-5 rounded-2xl space-y-3 ${
                    props.color === "violet"
                        ? "bg-violet-800/10"
                        : "bg-green-800/10"
                }`}
            >
                {vicePresidents?.map((x, i) => (
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

// "Executive Secretary"
const ExecutiveSecretaryPanelSection = (props: {
    type: string;
    name: string;
    candidateList: SortedCandidate[];
    color: "violet" | "green";
}) => {
    console.log(props?.candidateList);
    const ExecutiveSecretary = props.candidateList.filter(
        (candidate) => candidate.type === props.type
    );
    return (
        <div className="flex-1 space-y-2 mt-5">
            <div
                className={`p-5 rounded-2xl space-y-3 ${
                    props.color === "violet"
                        ? "bg-violet-800/10"
                        : "bg-green-800/10"
                }`}
            >
                {ExecutiveSecretary?.map((x, i) => (
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
    data: SortedCandidate;
    index: number;
}) => {
    const selectedCandidates = useVoteStore((s) => s.selectedCandidates);
    const selectCandidate = useVoteStore((s) => s.selectCandidate);
    const unSelectCandidate = useVoteStore((s) => s.unSelectCandidate);

    const checked = selectedCandidates.some((x) => x.uuid === props.data.uuid);

    // 👇 compute disable directly
    const disabled = (() => {
        if (checked) return false;
        const sameType = selectedCandidates.filter(
            (x) => x.type === props.data.type
        );
        switch (props.data.type) {
            case "Vice President":
                return sameType.length >= 2;
            case "Executive Secretary":
                return sameType.length >= 5;
            default:
                return sameType.length >= 1;
        }
    })();

    return (
        <div
            onClick={() => {
                if (disabled && !checked) return; // prevent click when disabled
                checked
                    ? unSelectCandidate(props.data)
                    : selectCandidate(props.data);
            }}
            className={`select-none flex gap-5 bg-white items-center border-2 rounded-xl px-5 py-2 ${
                checked ? "border-green-800" : "border-transparent"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <div
                className={`border-2 rounded-lg ${
                    checked ? "border-primary" : " border-gray-400"
                }`}
            >
                <AiOutlineCheck
                    className={` text-primary size-10 ${
                        checked ? "" : "opacity-0"
                    }`}
                />
            </div>
            <div className="size-25 rounded-full">
                <Image
                    src={getBucketURL(props.data?.photo_url as string)}
                    alt={props.data.name}
                    className="h-full w-full object-top"
                />
            </div>
            <div>
                <h1 className="text-2xl">{props.data?.name}</h1>
                <p className="font-semibold">{props.data?.type}</p>
            </div>
        </div>
    );
};
