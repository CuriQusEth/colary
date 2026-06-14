import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ target: 'metaMask' }),
    coinbaseWallet({ 
      appName: 'Colary - Train Your Brain',
      preference: 'all'
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
