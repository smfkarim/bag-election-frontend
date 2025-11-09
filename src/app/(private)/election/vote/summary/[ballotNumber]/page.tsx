"use client";
import VoteSummary from "@/components/pages/vote-summary";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
export default function Page() {
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Ballot Paper",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            // reactToPrintFn();
            // router.replace("/");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className=" flex justify-center items-center" ref={printRef}>
            <VoteSummary />
        </div>
    );
}
