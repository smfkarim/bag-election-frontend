import { DBModel, TForeignId } from ".";
import { Device } from "./device.type";

export interface Booth extends DBModel {
    name: string;
    location: string;
}

export interface BoothDevice extends DBModel {
    booth_id: TForeignId;
    booth: Booth | null;
    device_id: TForeignId;
    device: Device | null;
    note?: string;
}
