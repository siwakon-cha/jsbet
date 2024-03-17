import { NextUIProvider } from '@nextui-org/react';
import '@/styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import Head from 'next/head';

const chilizTestnet = {
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  iconUrl: '',
  iconBackground: '#fff',
  nativeCurrency: { name: 'CHZ', symbol: 'CHZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://spicy-rpc.chiliz.com'] },
  },
  blockExplorers: {
    default: { name: 'chiliscan', url: 'https://testnet.chiliscan.com/' },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'ETHGlobal London',
  projectId: 'd94bcec50cd790a8736b2a3e87e5a335',
  chains: [chilizTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  return (
    <div className="min-h-screen">
      <Head>
        <title>FiRoll</title>
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <NextUIProvider>
              <main className="dark text-foreground bg-background min-h-screen">
                {getLayout(<Component {...pageProps} />)}
                <Toaster
                  toastOptions={{
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                    },
                  }}
                />
              </main>
            </NextUIProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default MyApp;
