export interface DashboardJSON {
    devices: Devices;
    printJobsCount: PrintJobsCount;
    votingCounts: VotingCounts;
}

interface VotingCounts {
    "6DigitSecretKeysActivated": number;
    "8DigitSecretKeysActivated": number;
    castedVotes: number;
    manualBallotPrints: number;
    manualVotes: number;
}

interface PrintJobsCount {
    done: number;
    pending: number;
}

interface Devices {
    activeDevicesCount: number;
    blockedDevicesCount: number;
}

export interface DeviceJSON {
    booths: Booth[];
    code: string;
    created_at: string;
    device_type: string;
    hostname: string;
    id: number;
    ip_address: string;
    lock_status: boolean;
    mac_address: string;
    operating_system: string;
    remarks: string;
    status: string;
    updated_at: string;
}

interface Booth {
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    location: string;
    name: string;
    pivot: Pivot;
    updated_at: string;
}

interface Pivot {
    booth_id: number;
    created_at: string;
    device_id: number;
    updated_at: string;
    uuid: string;
}
