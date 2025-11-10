"use client";

import MemberAuth from "@/components/pages/member-auth";

export default function RootPage() {
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const snapshot = await get(ref(db, "printJobs"));
    //         const data = snapshot.val();
    //         console.log("🔥 FULL DATABASE:", data);
    //     };
    //     fetchData();
    // }, []);
    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* <MemberLogin /> */}
            <MemberAuth />
        </div>
    );
}
