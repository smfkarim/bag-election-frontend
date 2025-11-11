import { DBModel } from ".";

export interface TPanel extends Omit<DBModel, "code" | "uuid"> {
    code?: string;
    uuid?: string;
    name: string;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
}

export type PanelCreate = {
    name: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
};
