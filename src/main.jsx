// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'                          
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { polygonAmoy } from './chains'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

// 1) Load your Amoy RPC URL and WalletConnect v2 project ID
const RPC_URL   = import.meta.env.VITE_AMOY_RPC_URL
const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

// 2) Build unified config with getDefaultConfig
const config = getDefaultConfig({
  appName:    'Ambrosia Presale',  
  projectId:  PROJECT_ID,           // WalletConnect v2 ID :contentReference[oaicite:5]{index=5}
  chains:     [polygonAmoy],        // only Amoy testnet
  transports: {                     // define custom RPC transport
    [polygonAmoy.id]: http(RPC_URL)
  },
  metadata: {
    url: window.location.origin  // ← ensures metadata.url matches actual origin
  }
})
// 3) Create a TanStack Query client
const queryClient = new QueryClient()

// 4) Render the app
createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
