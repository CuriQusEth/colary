import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({ 
      appName: 'Colary - Train Your Brain',
      preference: 'all' // Smart Wallet and EOA
    }),
    injected()
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
