/** @type {import('next').NextConfig} */
const nextConfig = {
    // Define hosts that have public images
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
