"use client";
import CandidateSelectionPrint from "@/components/pages/candiate-selection-print";
import cookie from "js-cookie";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useVoteStore } from "../vote.store";

export default function VoteSummary() {
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });

    useEffect(() => {
        reactToPrintFn();
        const timer = setTimeout(() => {
            useVoteStore.setState({
                ballotNumber: "",
                selectedCandidates: [],
                voter_id: "",
            });
            cookie.remove("isVoter");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className=" flex justify-center items-center" ref={printRef}>
            <CandidateSelectionPrint />
        </div>
    );
}
