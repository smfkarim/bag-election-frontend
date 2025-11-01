"use client";
import { Button } from "@mantine/core";

export default function PrintPage() {
    return (
        <div>
            <Button
                onClick={() => {
                    window.print();
                }}
            >
                Print
            </Button>
        </div>
    );
}
