"use client";

import Link from "next/link";
import { FaArrowLeft, FaLock } from "react-icons/fa";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 text-gray-800 px-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md">
                <FaLock className="w-12 h-12 text-orange-500" />
            </div>

            {/* Title */}
            <h1 className="mt-8 text-4xl font-bold text-gray-900 text-center">
                Unauthorized Access
            </h1>

            {/* Message */}
            <p className="mt-3 text-lg text-gray-600 text-center max-w-md">
                You don’t have permission to view this page. Please log in with
                an authorized account or return to the homepage.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-all duration-200"
                >
                    <FaArrowLeft />
                    Go to Home
                </Link>
                <Link
                    href="/auth/polling-agent"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-orange-400 text-orange-600 hover:bg-orange-50 font-semibold transition-all duration-200"
                >
                    Login Again
                </Link>
            </div>

            {/* Footer */}
            <p className="mt-10 text-sm text-gray-400">
                © {new Date().getFullYear()} BAG Voting System
            </p>
        </div>
    );
}
