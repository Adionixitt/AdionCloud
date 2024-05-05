/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "efficient-pigeon-17.convex.cloud",
            }
        ]
    },
};

export default nextConfig;
