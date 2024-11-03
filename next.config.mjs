/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.openfoodfacts.org',
            }
        ],
    },
    eslint: {
        ignoreDuringBuilds: true, // Désactive ESLint lors du build
    },
};

export default nextConfig;
