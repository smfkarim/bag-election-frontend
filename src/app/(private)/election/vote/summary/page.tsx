"use client";
import CandidateSelectionPrint from "@/components/pages/candiate-selection-print";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function VoteSummary() {
  const printRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Ballot Paper",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      reactToPrintFn();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" flex justify-center items-center" ref={printRef}>
      <CandidateSelectionPrint />
    </div>
  );
}
