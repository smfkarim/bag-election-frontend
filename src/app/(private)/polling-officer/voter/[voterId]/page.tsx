"use client";
import CandidateSelectionPrint from "@/components/pages/candiate-selection-print";
import useAuth from "@/hooks/useAuth";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";
import { getBucketURL } from "@/lib/helpers";
import { useSendSixDigitCodeMutation } from "@/services/api/poll-officer.api";
import { useVoterStore } from "@/store/voter-store";
import { Button, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiOutlineKey, AiOutlinePrinter, AiOutlineSend } from "react-icons/ai";
import { MdArrowBackIosNew } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function VoterDetails() {
    const { device, loading, error } = useFullDeviceInfo();
    const sixDigitKeySendEmailMutation = useSendSixDigitCodeMutation();
    const sixDigitKeyPrintMutation = useSendSixDigitCodeMutation();
    const sixDigitKeyPrintBallotMutation = useSendSixDigitCodeMutation();
    const { voter } = useVoterStore();
    const { userId } = useAuth();
    const [ballotPrinted, setBallotPrinted] = useState(false); // this case will be handled later.
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });
    const [boothId, setBoothId] = useState<null | string>(null);
    const [secretKeyShown, setSecretKeyShown] = useState(false);

    const sendSecretKey = async () => {
        try {
            await sixDigitKeySendEmailMutation.mutateAsync({
                type: "mail",
                device_info: device?.hostname ?? "",
                user_id: userId ?? "",
                uuid: voter?.uuid ?? "",
            });
            notifications.show({
                title: "Success",
                message: "Secret key sent to voter's email",
            });
        } catch {}
    };

    const printSecretKey = async () => {
        try {
            await sixDigitKeyPrintMutation.mutateAsync({
                type: "print",
                device_info: device?.hostname ?? "",
                user_id: userId ?? "",
                uuid: voter?.uuid ?? "",
            });
            notifications.show({
                title: "Success",
                message: "Secret Key printed successfully",
            });
        } catch {}
    };

    const doBoth = async () => {
        try {
            // we don't need both api call
            await sendSecretKey();
            setTimeout(async () => {
                await printSecretKey();
            }, 2000);
        } catch {}
    };

    const printBallotPaper = () => {
        modals.open({
            closeOnClickOutside: false,
            centered: true,
            withCloseButton: false,
            size: "350",
            children: (
                <div>
                    <h1 className=" text-center">
                        Are you sure to Print your ballot paper ?
                    </h1>
                    <div className=" flex justify-center items-center gap-5 mt-5">
                        <Button
                            onClick={() => {
                                modals.closeAll();
                            }}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    setBallotPrinted(true);
                                    await sixDigitKeyPrintBallotMutation.mutateAsync(
                                        {
                                            type: "ballot",
                                            device_info: "123456",
                                            user_id: userId ?? "",
                                            uuid: voter?.uuid ?? "",
                                        }
                                    );
                                    reactToPrintFn();
                                } finally {
                                    // notifications.show({
                                    //     title: "Success",
                                    //     message:
                                    //         "Ballot paper printed successfully",
                                    // });
                                    modals.closeAll();
                                }
                            }}
                        >
                            Print Ballot Paper
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    // if (loading) return <div>Device is loading...</div>;
    // if (error) return <div>Got error to load device info</div>;
    if (!voter) return <div>Voter not found.</div>;

    return (
        <div>
            {/* ✅ Keep this div mounted and offscreen (NOT hidden or display:none) */}
            <div style={{ display: "none" }}>
                <div ref={printRef}>
                    <CandidateSelectionPrint />
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

                {/* Back */}
                <div
                    onClick={() => {
                        router.back();
                    }}
                    className="flex items-center gap-3 bg-gray-200 w-fit ml-auto px-5 py-3 rounded-2xl hover:opacity-80 hover:cursor-pointer"
                >
                    <MdArrowBackIosNew /> Back To Search
                </div>

                {/* Information section */}

                <section className=" bg-gray-100 p-10  rounded-2xl space-y-5">
                    <div className=" border-4 border-primary/30  w-36 h-40  bg-white shadow-2xl rounded-2xl">
                        <img
                            src={
                                voter?.photo_url
                                    ? getBucketURL(voter?.photo_url as string)
                                    : "/placeholder.jpg"
                            }
                            className=" h-full w-full object-cover rounded-xl "
                        />
                    </div>

                    {/* Info card */}

                    <div className=" bg-white px-10 py-10 rounded-2xl shadow-xl grid grid-cols-1  sm:grid-cols-2 gap-5">
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
                        <LabelValueCard label="Email" value={voter?.email} />
                        <LabelValueCard
                            label="Address"
                            value={voter?.address}
                        />
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex items-center justify-center mt-10">
                        <Select placeholder="Select booth" />
                    </div> */}
                    <div className=" flex justify-center gap-5 ">
                        <Button
                            onClick={() => setSecretKeyShown((v) => !v)}
                            radius={15}
                            // disabled={!boothId}
                        >
                            {secretKeyShown
                                ? voter.secret_key
                                : "Show Secret Key"}
                        </Button>
                        <Button
                            loading={sixDigitKeySendEmailMutation.isPending}
                            disabled={
                                ballotPrinted
                                // || !boothId
                            }
                            onClick={sendSecretKey}
                            leftSection={<AiOutlineSend size={16} />}
                            radius={15}
                        >
                            Send Secrete Key
                        </Button>
                        <Button
                            loading={sixDigitKeyPrintMutation.isPending}
                            disabled={
                                ballotPrinted
                                // || !boothId
                            }
                            onClick={printSecretKey}
                            leftSection={<AiOutlineKey size={16} />}
                            radius={15}
                        >
                            Print Secrete Key
                        </Button>
                        <Button
                            disabled={ballotPrinted}
                            onClick={doBoth}
                            leftSection={<AiOutlineKey size={16} />}
                            radius={15}
                        >
                            Both
                        </Button>
                        <Button
                            loading={sixDigitKeyPrintBallotMutation.isPending}
                            disabled={ballotPrinted}
                            onClick={printBallotPaper}
                            leftSection={<AiOutlinePrinter size={16} />}
                            radius={15}
                            color="blue"
                        >
                            Print ballot Paper
                        </Button>
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
