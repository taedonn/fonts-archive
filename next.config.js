/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    images: {
        remotePatterns: [
            {   // s3 image
                protocol: 'https',
                hostname: '*.amazonaws.com',
                port: '',
                pathname: '**',
            },
            {   // google profile image
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
                pathname: '**',
            },
            {   // github profile image
                protocol: 'https',
                hostname: '*.githubusercontent.com',
                port: '',
                pathname: '**',
            },
            {   // naver profile image
                protocol: 'https',
                hostname: '*.pstatic.net',
                port: '',
                pathname: '**',
            },
            {   // kakao profile image
                protocol: 'http',
                hostname: '*.kakaocdn.net',
                port: '',
                pathname: '**',
            }
        ],
    },
}

module.exports = nextConfig