import { chain } from 'wagmi';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';
export const MAINNET_API_URL = 'https://api.lens.dev';
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev';
export const SANDBOX_API_URL = 'https://api-sandbox-mumbai.lens.dev';
export const STAGING_API_URL = 'https://staging-api-social-mumbai.lens.crtlkey.com';
export const STAGING_SANDBOX_API_URL = 'https://staging-api-social-mumbai.sandbox.crtlkey.com';

// ipfs
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/';
export const getIPFSLink = (hash: string): string => {
  if (!hash) {
    return '';
  }

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`)
    .replace('https://ipfs.io/ipfs/', IPFS_GATEWAY)
    .replace('ipfs://', IPFS_GATEWAY);
};

// lenster cdn
export const IMGPROXY_URL = 'https://media.lenster.xyz';
export const getAvatarFromLenster = (url: string) => (
  `${IMGPROXY_URL}?name=avatar&image=${url}`
)

export const getPostImageFromLenster = (url: string) => (
  `${IMGPROXY_URL}?name=attachment&image=${url}`
)

const getEnvConfig = () => {
    switch (LENS_NETWORK) {
        case 'mainnet':
            return {
                apiEndpoint: MAINNET_API_URL
            };
        case 'testnet':
            return {
                apiEndpoint: TESTNET_API_URL
            };
        case 'staging':
            return {
                apiEndpoint: STAGING_API_URL
            };
        case 'sandbox':
            return {
                apiEndpoint: SANDBOX_API_URL
            };
        case 'staging-sandbox':
            return {
                apiEndpoint: STAGING_SANDBOX_API_URL
            };
        default:
            return {
                apiEndpoint: MAINNET_API_URL
            };
    }
};

// Localstorage keys
export const LS_KEYS = {
  LENSTER_STORE: 'lenster.store',
  TRANSACTION_STORE: 'transaction.store',
  TIMELINE_STORE: 'timeline.store',
  MESSAGE_STORE: 'message.store'
};

export const PRO_STATUS_API_URL = 'https://pro.lenster.xyz';

export const API_URL = getEnvConfig().apiEndpoint;
export const IS_MAINNET = API_URL === MAINNET_API_URL;

// Web3
export const RPC_URL = IS_MAINNET ? 'https://rpc.ankr.com/polygon' : 'https://rpc.ankr.com/polygon_mumbai';

export const POLYGON_MAINNET = {
    ...chain.polygon,
    name: 'Polygon Mainnet',
    rpcUrls: { default: 'https://polygon-rpc.com' }
};
export const POLYGON_MUMBAI = {
    ...chain.polygonMumbai,
    name: 'Polygon Mumbai',
    rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
};
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;

// Api
export const WALLET_WHITELIST = process.env.WALLET_WHITELIST ? process.env.WALLET_WHITELIST.split(",") : [];

// CORS
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : "*";

// Demo User Address
export const  DEMO_USER_ADDRESS = process.env.NEXT_PUBLIC_DEMO_USER_ADDRESS ?? "";

// GraphQL Server
export const APOLLO_SERVER_URL = process.env.NEXT_PUBLIC_APOLLO_SERVER_URL ?? "";

// Next-Auth
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : "";
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : "";
