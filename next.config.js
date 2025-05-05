/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'dev3.webgis.co.id',
                port: '',
                pathname: '/be/gs/thumbnail/***',
            },
        ],
    },
}

module.exports = nextConfig
