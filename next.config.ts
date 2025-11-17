import type { NextConfig } from "next";
const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || "";
const { hostname } = new URL(bucketUrl);
const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: hostname, // dynamic based on env
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
