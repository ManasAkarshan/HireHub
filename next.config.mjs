/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bdwylwjoxaononowehcq.supabase.co',  // Your Supabase hostname
          port: '',   // Leave empty if no port is used
          pathname: '/storage/v1/object/public/**',  // Path to your stored images
        },
      ], 
    },
  };
  
  export default nextConfig;
  