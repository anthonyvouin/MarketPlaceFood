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
        ignoreDuringBuilds: true, 
    },
    env: {
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY, 
        NEXT_PUBLIC_APP_URL: process.env.APP_URL,
    },
    // typescript: {
    //     ignoreBuildErrors: true,
    // },
    output: 'standalone',
    experimental: {
        outputFileTracingExcludes: {
            '/api/sse/revenue': ['**/*']
        }
    }
};

export default nextConfig;