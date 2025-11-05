import { TForeignId } from ".";
import { TPanel } from "./panel";

export interface TUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    profile_image_link: null;
    status: number;
    email_verified_at: null;
    ttl: null;
    created_at: string;
    updated_at: string;
    panel_id: TForeignId | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    panel_id: null;
    ttl: null;
    created_at: string;
    roles: Role[];
    panel: null | TPanel;
    mfa_status: boolean;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: null;
    updated_at: null;
    pivot: Pivot;
}

interface Pivot {
    model_type: string;
    model_id: number;
    role_id: number;
}

export type UserCreate = {
    name: string;
    email: string;
    password?: string;
    phone: string;
    gender: string;
    status?: number;
    panel_id: number | null | string;
    role_id: number | string;
    mfa_status: boolean;
};
