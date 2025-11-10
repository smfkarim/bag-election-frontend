import { DBModel, TForeignId } from ".";
import { TPanel } from "./panel";

export interface Candidate extends DBModel {
    candidate_type_id: TForeignId;
    panel_id?: TForeignId;
    panel: TPanel | null;
    candidate_type: CandidateType | null;
    name: string;
    photo_url: string | File | null; // mandatory
    symbol?: string | File | null; // optional
}

export interface CandidateType extends DBModel {
    name: string;
    description?: string;
}

export interface SortedCandidate {
    type: string;
    panelId: number;
    id: number;
    uuid: string;
    name: string;
    code: string;
    photo_url: string;
    digital_votes?: number;
    manual_votes?: number;
    total_votes?: number;
}
