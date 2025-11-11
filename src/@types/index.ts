import { AxiosError } from "axios";

export interface DBModel {
    id: number | string;
    code: string;
    uuid: string;
    created_at: number | string;
    updated_at: number | string;
}

export type TForeignId = DBModel["id"];

export interface ListResponse<T> {
    message: string;
    data: {
        current_page: number;
        data: T[];
        next_page_url: string | null;
        total: number;
    };
}

export interface ResponseGetById<T> {
    data: T;
    message: string;
    status: string;
    code: number;
}

export type ErrorResponse = AxiosError<{ message: string }>;

export type ListParams<T> = {
    page: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
} & Partial<Record<keyof T, unknown>>;
