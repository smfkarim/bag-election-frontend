"use client";
import CandidateSelectionPrint from "@/components/pages/candiate-selection-print";
import { Button, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiOutlineKey, AiOutlinePrinter, AiOutlineSend } from "react-icons/ai";
import { MdArrowBackIosNew } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export default function VoterDetails() {
  const [ballotPrinted, setBallotPrinted] = useState(false);
  const { voterId }: { voterId: string } = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Ballot Paper",
  });

  const sendSecretKey = async () => {
    notifications.show({
      title: "Success",
      message: "Secret key sent to user's email",
    });
  };

  const printSecretKey = async () => {
    notifications.show({
      title: "Success",
      message: "Secret Key printed successfully",
    });
  };

  const doBoth = async () => {
    await sendSecretKey();

    setTimeout(async () => {
      await printSecretKey();
    }, 2000);
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
              onClick={() => {
                setBallotPrinted(true);
                reactToPrintFn();
                // notifications.show({
                //     title: "Success",
                //     message:
                //         "Ballot paper printed successfully",
                // });
                modals.closeAll();
              }}
            >
              Print Ballot Paper
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div>
      {/* ✅ Keep this div mounted and offscreen (NOT hidden or display:none) */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {" "}
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
            <p className=" text-right">{dayjs(new Date()).format("hh:mm A")}</p>
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
                "https://plus.unsplash.com/premium_photo-1661638006395-76d9c7a9f9fa"
              }
              className=" h-full w-full object-cover rounded-xl "
            />
          </div>

          {/* Info card */}

          <div className=" bg-white px-10 py-10 rounded-2xl shadow-xl grid grid-cols-1  sm:grid-cols-2 gap-5">
            <LabelValueCard label="Name" value="Albi Ummid Tanvir" />
            <LabelValueCard label="Photo ID" value="8985255" />
            <LabelValueCard label="Contact Number" value="(303) 555-0105" />
            <LabelValueCard label="Voter ID" value="78777556" />
            <LabelValueCard label="Email" value="albi.ummid@gmail.com" />
            <LabelValueCard
              label="Address"
              value="3517 W. Gray St. Utica, Pennsylvania 57867"
            />
          </div>

          {/* Action Buttons */}
          <div className=" flex justify-center gap-5 mt-10">
            <Button
              disabled={ballotPrinted}
              onClick={sendSecretKey}
              leftSection={<AiOutlineSend size={16} />}
              radius={15}
            >
              Send Secrete Key
            </Button>
            <Button
              disabled={ballotPrinted}
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

const LabelValueCard = (props: { label: string; value: string }) => {
  return (
    <p>
      <span className=" font-semibold">{props.label} : </span>
      <span>{props.value}</span>
    </p>
  );
};
