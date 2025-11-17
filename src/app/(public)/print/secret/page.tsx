"use client";
import ThermalPrinterUI from "@/components/ui/secret-print-layout";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function SecretPrint() {
    const searchParams = useSearchParams();
    searchParams;
    return (
        <ThermalPrinterUI
            name={searchParams.get("name") ?? ""}
            secret={searchParams.get("secret") ?? ""}
        />
    );
}
