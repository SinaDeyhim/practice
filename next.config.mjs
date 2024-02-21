/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            // Add other CORS headers if needed
          ],
        },
      ];
    },
}

export default nextConfig;
