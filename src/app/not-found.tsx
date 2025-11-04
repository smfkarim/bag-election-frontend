"use client";

import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

export default function ErrorPage() {
    const router = useRouter();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="flex flex-col items-center text-center space-y-6 p-6">
                <div className="rounded-full bg-red-500/10 p-6">
                    <MdErrorOutline className="text-red-500 text-6xl animate-bounce" />
                </div>

                <h1 className="text-6xl font-bold tracking-tight">404</h1>
                <p className="text-lg text-gray-300 max-w-md">
                    Oops! The page you’re looking for doesn’t exist or has been
                    moved.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-white font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                    <FaHome className="text-xl" />
                    Go Home
                </button>
            </div>

            <div className="absolute bottom-6 text-sm text-gray-500">
                © {new Date().getFullYear()} ZHB Solutions — All Rights Reserved
            </div>
        </div>
    );
}
