module.exports = {
  reactStrictMode: false,
  experimental: {
    transpilePackages: ["ui"],
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
    ],
    //domains: ['media.lenster.xyz', 'lens.infura-ipfs.io', 'images.lens.phaver.com'],
  },
};
