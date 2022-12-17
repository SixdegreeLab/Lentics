import { chain } from 'wagmi';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';
export const MAINNET_API_URL = 'https://api.lens.dev';
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev';
export const SANDBOX_API_URL = 'https://api-sandbox-mumbai.lens.dev';
export const STAGING_API_URL = 'https://staging-api-social-mumbai.lens.crtlkey.com';
export const STAGING_SANDBOX_API_URL = 'https://staging-api-social-mumbai.sandbox.crtlkey.com';

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

