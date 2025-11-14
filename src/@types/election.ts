export interface ElectionStatusResponse {
    voter_id: string;
    six_digit_key: SixDigitKey;
    eight_digit_key: EightDigitKey;
}

interface EightDigitKey {
    secret_key: string;
    vote_status: boolean;
    ballot_print_status: boolean;
    used_at: null;
    expires_at: null;
    created_at: string;
    updated_at: string;
}

interface SixDigitKey {
    secret_key: string;
    status: boolean;
    activated_by: number;
    booth_id: string;
    device_id: string;
    used_at: null;
    created_at: string;
    updated_at: string;
}
