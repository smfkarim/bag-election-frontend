"use client";
import CandidateSelection, {
    TSelection,
} from "@/components/pages/candidate-selection";
import { useState } from "react";

export default function VoteScreen() {
    const [selected, setSelected] = useState<TSelection[]>([]);
    return (
        <div>
            <CandidateSelection />
        </div>
    );
}
