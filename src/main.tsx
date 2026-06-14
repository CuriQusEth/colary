import { Buffer } from 'buffer';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from './lib/wagmi.config';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
