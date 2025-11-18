"use client";
import ThermalPrinterUI from "@/components/ui/secret-print-layout";
import { useSearchParams } from "next/navigation";

export default function SecretPrint() {
    const searchParams = useSearchParams();
    return (
        <ThermalPrinterUI
            name={searchParams.get("name") ?? ""}
            secret={searchParams.get("secret") ?? ""}
        />
    );
}
