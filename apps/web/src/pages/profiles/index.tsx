import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    chain,
    WagmiConfig,
    createClient,
    configureChains,
} from 'wagmi'

import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { IS_MAINNET, RPC_URL, CHAIN_ID } from 'data/constants';

const btnStyle = { display: "block", backgroundColor: "rgba(16, 185, 129, 0.8)", color: "#FFFFFF", padding: "8px 16px", margin: "12px auto", border: 0, width: "90%" }

function Profile() {
    const { address, connector, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })
    const { connect, connectors, error, isLoading, pendingConnector={id: 0} } =
        useConnect()
    const { disconnect } = useDisconnect()

    return isConnected ? (
        <div style={{ width: "100%", height: "100vh" }}>
            {ensAvatar && (<img src={ensAvatar} alt="ENS Avatar" />)}
            <div>{ensName ? `${ensName} (${address})` : address}</div>
            {connector && (<div>Connected to {connector.name}</div>)}
            <button style={btnStyle} onClick={disconnect}>Disconnect</button>
        </div>
    ) : (
        <div className="container mx-auto px-4 h-screen">
            <div className="mt-48 space-y-4">
                {connectors.map((connector) => (
                    <button
                        style={btnStyle}
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                        {connector.name}
                        {!connector.ready && ' (unsupported)'}
                        {isLoading &&
                        connector.id === pendingConnector.id &&
                        ' (connecting)'}
                    </button>
                ))}

                {error && <div>{error.message}</div>}
            </div>
        </div>
    )
}

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider } = configureChains(
    [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
    [jsonRpcProvider({ rpc: () => ({ http: RPC_URL }) })]
);

const connectors = () => {
    return [
        new InjectedConnector({
            chains,
            options: { shimDisconnect: true }
        }),
        new WalletConnectConnector({
            chains,
            options: { rpc: { [CHAIN_ID]: RPC_URL } }
        })
    ];
};

// Set up client
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
});

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiConfig client={wagmiClient}>
            {children}
        </WagmiConfig>
    );
};

export default function App() {
    return (
        <Providers>
            <Profile />
        </Providers>
    )
}
