import type { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

// Infer the return type of your own auth() instance
export type AuthType = Awaited<ReturnType<typeof auth>>;

// Extend NextRequest to include it
export interface AuthRequest extends NextRequest {
    auth: AuthType;
}
