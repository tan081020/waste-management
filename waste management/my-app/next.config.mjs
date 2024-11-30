/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        W3_AUTH_CLIENT_ID: process.env.W3_AUTH_CLIENT_ID,
        GEMENI_API_KEY: process.env.GEMENI_API_KEY,
        GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

    },

 images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
        ],
 }
};
export default nextConfig;
