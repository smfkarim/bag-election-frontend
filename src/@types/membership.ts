import { DBModel } from ".";

export interface TMembershipType extends DBModel {
    name: string; // e.g., 'Standard', 'Life Member'
    fee: number; // decimal(10,2)
    description?: string | null;
    stripe_payment_amount_in_dollars?: number | string;
}
