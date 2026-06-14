import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { DATA_SUFFIX_HEX } from './erc8021'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ target: 'metaMask' }),
    coinbaseWallet({ 
      appName: 'Colary - Train Your Brain',
      preference: 'all'
    }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // @ts-ignore
  dataSuffix: DATA_SUFFIX_HEX,
})
