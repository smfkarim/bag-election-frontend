import { DBModel, TForeignId } from ".";
import { TMembershipType } from "./membership";

import { TPanel } from "./panel";

// Type-safe File reference that works during SSR
type FileType = typeof File extends { new (...args: never[]): infer F }
    ? F
    : never;

export interface TVoterRegistration extends DBModel {
    // Personal Information
    first_name: string;
    last_name: string;
    date_of_birth: string; // ISO date string
    gender?: string | null;
    is_18_or_above?: boolean;
    payment_term?: boolean;

    // Contact Information
    email: string;
    phone: string;
    address?: string | null;
    national_id?: string | null;
    drivers_license_number?: string | null;
    drivers_license_expiry?: string;

    // Photo Upload
    photo_url?: string | null | FileType;
    photo_filename?: string | null;
    photo_uploaded_at?: string | null;

    // Panel & Membership
    panel_id?: TForeignId | null;
    membership_type_id: TForeignId | null;

    // Registration Status
    status: "pending" | "approved" | "rejected" | "registered" | "disputed";
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    approved_at?: string | null;
    dispute_reason?: string | null;

    voted_at?: string | null;

    // Payment
    payment_received: boolean;
    payment_date?: string | null;
    payment_receipt_number?: string | null;

    // Timestamps
    registered_at: string;

    // Optional expanded relations
    panel?: TPanel;
    membership_type?: TMembershipType;
    voter_id_generated?: string;
    middle_name: string;
    acknowledged_status: boolean;
    payment_transactions: PaymentTransactions[];
}

export type TVoterRegistrationCreate = Omit<
    TVoterRegistration,
    | keyof DBModel
    | "panel"
    | "membership_type"
    | "registered_at"
    | "payment_transactions"
>;

export interface PaymentTransactions {
    id: number;
    voter_registration_id: number;
    amount: string;
    status: string;
    transaction_reference: string;
    payment_method_id: number;
    payment_date: string;
    notes: null;
    provider_response: string;
    created_at: string;
    updated_at: string;
}

export interface VoterSearchResponse {
    source: string;
    voters: Voter[];
}

export interface Voter {
    uuid: string;
    first_name: string;
    middle_name: null;
    last_name: string;
    email: string;
    phone: string;
    voter_id_generated: string;
    national_id: string;
    photo_url: string;
    membership_type: null;
    panel: null;
    creator: null;
    payment_transactions: null;
    address?: string;
    secret_key: string;
    booth_id: null | string;
    ballot_number: string;
}
