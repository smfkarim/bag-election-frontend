"use client";
import VoteSummary from "@/components/pages/vote-summary";
import { Button } from "@mantine/core";
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
        <div className=" max-w-5xl mx-auto pt-10">
            <div className=" flex justify-end ">
                <Button color="red" onClick={reactToPrintFn}>
                    Print
                </Button>
            </div>
            <div className=" flex justify-center items-center" ref={printRef}>
                <VoteSummary />
            </div>
        </div>
    );
}
