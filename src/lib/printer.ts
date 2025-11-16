"use client";
import axios from "axios";

export const printPage = async (pageURL: string) => {
    const baseURL = process.env.NEXT_PUBLIC_LOCAL_SERVER_API_URL || "";
    return await axios.post(
        baseURL + "/print",
        { fileUrl: window.location.origin + pageURL },
        { timeout: 1000 * 3600 * 1 }
    );
};
