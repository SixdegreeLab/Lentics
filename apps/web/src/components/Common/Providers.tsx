import { ApolloProvider } from '@apollo/client';
import { IS_MAINNET, RPC_URL } from 'data/constants';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { CHAIN_ID } from 'data/constants';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

import client from '../../apollo';
import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
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

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const Providers = ({ children, initSession }: { children: ReactNode, initSession: Session }) => {
  return (
    <ErrorBoundary>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider session={initSession} refetchInterval={0}>
          <ApolloProvider client={client}>
            <ThemeProvider defaultTheme="light" attribute="class">
              <Layout>{children}</Layout>
            </ThemeProvider>
          </ApolloProvider>
        </SessionProvider>
      </WagmiConfig>
    </ErrorBoundary>
  );
};

export default Providers;
