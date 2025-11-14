export interface Device {
    id: number;
    code?: string;
    uuid?: string;
    hostname: string;
    ip_address?: string;
    mac_address?: string;
    firebase_id?: string;
    operating_system?: string;
    device_type: string;
    status?: string;
    remarks?: string;
    metadata?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface DeviceLog {
    id: number;
    code?: string;
    uuid?: string;
    device_id?: string;
    status?: string;
    remarks?: string;
    created_at?: Date;
    updated_at?: Date;
}
