"use client";

import MemberAuth from "@/components/pages/member-auth";

export default function RootPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* <MemberLogin /> */}
            <MemberAuth />
        </div>
    );
}
