"use client";
import CandidateSelectionPrint from "@/components/pages/candiate-selection-print";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
export default function VoteSummary() {
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });

    useEffect(() => {
        reactToPrintFn();
        const timer = setTimeout(() => {
            router.replace("/");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className=" flex justify-center items-center" ref={printRef}>
            <CandidateSelectionPrint />
        </div>
    );
}
