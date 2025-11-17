"use client";
import { useVoteStore } from "@/app/(private)/election/vote/vote.store";
import ManualVoteBallot from "@/components/pages/manual-vote-ballot";
import useAuth from "@/hooks/useAuth";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { getBucketURL } from "@/lib/helpers";
import { printPage } from "@/lib/printer";
import { useGetBoothList } from "@/services/api/booth.api";
import { useSendSixDigitCodeMutation } from "@/services/api/poll-officer.api";
import { useVoteStatus } from "@/services/api/vote.api";
import { useVoterStore } from "@/store/voter-store";
import { wait } from "@/utils/helper";
import { Button, Image, Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineKey, AiOutlinePrinter, AiOutlineSend } from "react-icons/ai";
import { MdArrowBackIosNew } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function VoterDetails() {
    const sixDigitKeySendEmailMutation = useSendSixDigitCodeMutation();
    const sixDigitKeyPrintMutation = useSendSixDigitCodeMutation();
    const sixDigitKeyPrintBallotMutation = useSendSixDigitCodeMutation();
    const doBothMutation = useSendSixDigitCodeMutation();
    const { device } = useFullDeviceInfo();
    const { voter } = useVoterStore();
    const { userId } = useAuth();
    const { voterId } = useParams<{ voterId: string }>();
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });
    const { data: voteStatus, refetch, isLoading } = useVoteStatus(voterId);
    const [boothId, setBoothId] = useState<null | string>(null);
    const [secretKeyShown, setSecretKeyShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: boothList } = useGetBoothList({
        per_page: 100,
        page: 1,
    });
    const info = {
        booth_id: boothId,
        device_info: device?.macAddress ?? "",
        user_id: userId ?? "",
        uuid: voterId,
    };

    useEffect(() => {
        setBoothId(voteStatus?.six_digit_key.booth_id?.toString() ?? "");
        useVoteStore.setState({
            ballotNumber: voteStatus?.eight_digit_key.secret_key,
        });
    }, [voteStatus]);

    const sendSecretKey = async () => {
        try {
            await sixDigitKeySendEmailMutation.mutateAsync({
                type: "mail",
                ...info,
            });
            notifications.show({
                title: "Success",
                message: "Secret key sent to voter's email",
            });
        } finally {
            refetch();
        }
    };

    const printSecretKey = async () => {
        try {
            await sixDigitKeyPrintMutation.mutateAsync({
                type: "print",
                ...info,
            });
            notifications.show({
                title: "Success",
                message: "Secret Key printed successfully",
            });
        } finally {
            refetch();
        }
    };

    const doBoth = async () => {
        try {
            await doBothMutation.mutateAsync({
                type: "both",
                ...info,
            });
        } finally {
            refetch();
            notifications.show({
                message: "Secret Key sent and Printing",
            });
        }
    };

    const handleShowSecureCode = async () => {
        await sixDigitKeySendEmailMutation.mutateAsync({
            type: "show_secret",
            ...info,
        });
        setSecretKeyShown((v) => !v);
        refetch();
    };

    const printBallotPaper = async () => {
        setLoading(true);
        modals.open({
            closeOnClickOutside: false,
            centered: true,
            withCloseButton: false,
            size: "350",
            children: <PrintBallotConfirmation />,
        });
    };

    const PrintBallotConfirmation = () => {
        const [loading, setLoading] = useState(false);
        return (
            <div>
                <h1 className=" text-center">
                    {loading
                        ? "Your ballot paper is printing."
                        : " Are you sure to Print your ballot paper ?"}
                </h1>
                <div className=" flex justify-center items-center gap-5 mt-5">
                    <Button
                        onClick={() => {
                            modals.closeAll();
                            setLoading(false);
                        }}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await wait(2 * 1000);
                                // await sixDigitKeyPrintBallotMutation.mutateAsync(
                                //     {
                                //         type: "ballot",
                                //         ...info,
                                //     }
                                // );
                                // await printPage(
                                //     "/print/manual-vote/" +
                                //         voteStatus?.eight_digit_key
                                //             .secret_key
                                // );
                                // await wait(6 * 1000);
                                // reactToPrintFn();
                            } finally {
                                setLoading(false);
                                notifications.show({
                                    title: "Success",
                                    message:
                                        "Ballot paper printed successfully",
                                });
                                modals.closeAll();
                                refetch();
                            }
                        }}
                    >
                        {loading ? "Printing..." : " Print Ballot Paper"}
                    </Button>
                </div>
            </div>
        );
    };

    const printBallotPaperDisabled =
        !boothId || voteStatus?.eight_digit_key.ballot_print_status;
    const secretPrintOrSendDisabled =
        !boothId ||
        printBallotPaperDisabled ||
        voteStatus?.six_digit_key.status;

    if (isLoading) return null;

    if (!voter) return <div>Voter not found.</div>;

    return (
        <div>
            {/* ✅ Keep this div mounted and offscreen (NOT hidden or display:none) */}
            <div style={{ display: "none" }}>
                <div ref={printRef}>
                    <ManualVoteBallot />
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-10 space-y-5">
                {/* Header */}
                <div className=" flex items-center justify-between px-5 py-2 rounded-2xl bg-green-100 ">
                    <div className=" size-15">
                        <Image src={"/bag_logo.png"} alt="bag_logo" />
                    </div>

                    <div className=" sm:text-lg">
                        <p className=" text-right">
                            {dayjs(new Date()).format("hh:mm A")}
                        </p>
                        <p>{dayjs(new Date()).format("DD MMMM, YYYY")}</p>
                    </div>
                </div>

                {/* Information section */}

                <section className=" bg-gray-100 p-10  rounded-2xl space-y-10">
                    {/* Back */}
                    <div className="flex items-center justify-between">
                        {!boothId
                            ? null
                            : (secretPrintOrSendDisabled ||
                                  printBallotPaperDisabled) && (
                                  <h1 className=" text-red-400 text-2xl">
                                      {secretPrintOrSendDisabled
                                          ? "Secret already generated"
                                          : "Manual ballot already printed"}
                                  </h1>
                              )}
                        <div
                            onClick={() => {
                                router.back();
                            }}
                            className="flex items-center gap-3 bg-gray-200 w-fit ml-auto px-5 py-3 rounded-2xl hover:opacity-80 hover:cursor-pointer"
                        >
                            <MdArrowBackIosNew /> Back To Search
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="border-4 border-primary/30  w-40 h-50  bg-white shadow-2xl rounded-2xl">
                            <img
                                src={
                                    voter?.photo_url
                                        ? getBucketURL(
                                              voter?.photo_url as string
                                          )
                                        : "/placeholder.jpg"
                                }
                                className=" h-full w-full object-cover rounded-xl "
                            />
                        </div>
                        {/* Info card */}

                        <div className=" flex-1 bg-white px-10 py-10 rounded-2xl shadow-xl grid   sm:grid-cols-2 gap-5">
                            <LabelValueCard
                                label="Name"
                                value={`${voter?.first_name} ${
                                    voter?.middle_name ?? ""
                                } ${voter?.last_name}`}
                            />
                            <LabelValueCard
                                label="Photo ID"
                                value={voter?.national_id ?? ""}
                            />
                            <LabelValueCard
                                label="Contact Number"
                                value={voter?.phone}
                            />
                            <LabelValueCard
                                label="Voter ID"
                                value={voter?.voter_id_generated ?? ""}
                            />
                            <LabelValueCard
                                label="Email"
                                value={voter?.email}
                            />
                            <LabelValueCard
                                label="Address"
                                value={voter?.address}
                            />
                        </div>
                    </div>

                    <div>
                        {/* Action Buttons */}

                        <div className=" flex gap-5 flex-wrap ">
                            <Select
                                disabled={voteStatus?.six_digit_key.status}
                                placeholder="Select booth"
                                data={boothList?.data?.data?.map((x) => ({
                                    label: x.name,
                                    value: x.id.toString(),
                                }))}
                                onChange={(e) => {
                                    if (!e) return;
                                    setBoothId(e);
                                }}
                                value={boothId}
                                onClear={() => {
                                    setBoothId("");
                                }}
                            />
                            <Button
                                onClick={handleShowSecureCode}
                                radius={15}
                                disabled={secretPrintOrSendDisabled}
                                loading={sixDigitKeySendEmailMutation.isPending}
                            >
                                {secretKeyShown
                                    ? voter.secret_key
                                    : "Show Secret Key"}
                            </Button>
                            <Button
                                loading={sixDigitKeySendEmailMutation.isPending}
                                disabled={secretPrintOrSendDisabled}
                                onClick={sendSecretKey}
                                leftSection={<AiOutlineSend size={16} />}
                                radius={15}
                            >
                                Send Secrete Key
                            </Button>
                            <Button
                                loading={sixDigitKeyPrintMutation.isPending}
                                disabled={secretPrintOrSendDisabled}
                                onClick={printSecretKey}
                                leftSection={<AiOutlineKey size={16} />}
                                radius={15}
                            >
                                Print Secrete Key
                            </Button>
                            <Button
                                disabled={secretPrintOrSendDisabled}
                                onClick={doBoth}
                                leftSection={<AiOutlineKey size={16} />}
                                radius={15}
                            >
                                Both
                            </Button>
                            <Button
                                loading={
                                    sixDigitKeyPrintBallotMutation.isPending
                                }
                                disabled={
                                    printBallotPaperDisabled ||
                                    secretPrintOrSendDisabled
                                }
                                onClick={printBallotPaper}
                                leftSection={<AiOutlinePrinter size={16} />}
                                radius={15}
                                color="blue"
                            >
                                Print ballot Paper
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

const LabelValueCard = (props: { label: string; value?: string }) => {
    return (
        <p>
            <span className=" font-semibold">{props.label} : </span>
            <span>{props.value ?? "N/A"}</span>
        </p>
    );
};
