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
                hostname: 'www.google.com',
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
    env: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY, 
        NEXT_PUBLIC_APP_URL: process.env.APP_URL,
    },
    
};

export default nextConfig;
