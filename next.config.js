/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fonts-archive.s3.ap-northeast-2.amazonaws.com',
                port: '',
                pathname: '/*',
            },
        ],
    },
}

module.exports = nextConfig