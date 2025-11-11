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
    locked_at: string;
    locked_until: string;
    reason: string;
    status: "locked" | "unlocked";
}
