import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { DATA_SUFFIX } from './erc8021'

export const queryClient = new QueryClient()

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ 
      appName: 'Colary - Train Your Brain',
      preference: 'all'
    }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' })
  ],
  transports: {
    [base.id]: http(),
  },
  // @ts-ignore
  dataSuffix: DATA_SUFFIX,
})
