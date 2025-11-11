"use client";

import MemberAuth from "@/components/pages/member-auth";
import useDashboardListener from "@/services/api/firebase.api";

export default function RootPage() {
    const { data, isLoading, error } = useDashboardListener();
    console.log(data, isLoading, error);
    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* <MemberLogin /> */}
            <MemberAuth />
        </div>
    );
}
