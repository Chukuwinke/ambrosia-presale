// src/setupTests.js
import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// 1) Stub wagmi entirely
vi.mock('wagmi', () => {
  // identity provider so <WagmiConfig> works if used
  const WagmiConfig = ({ children }) => React.createElement(React.Fragment, null, children)
  return {
    WagmiConfig,
    createConfig:    () => ({}),
    usePublicClient:  () => ({ readContract: vi.fn().mockResolvedValue(0n) }),
    useWalletClient:  () => ({ writeContract: vi.fn().mockResolvedValue({}) }),
    useAccount:       () => ({ address: '0x0000000000000000000000000000000000000000', isConnected: true }),
  }
})

// 2) Stub rainbowkit so ConnectButton.Custom never breaks
vi.mock('@rainbow-me/rainbowkit', () => {
  const RainbowKitProvider = ({ children }) => React.createElement(React.Fragment, null, children)
  const ConnectButton = {
    Custom: ({ children }) =>
      children({
        account: { address: '0x0' },
        chain: { id: 0 },
        openConnectModal: () => {},
        openAccountModal: () => {},
        mounted: true
      })
  }
  return { RainbowKitProvider, ConnectButton, getDefaultWallets: () => ({ wallets: [] }) }
})

// 3) Stub fetch() for your Merkle‐proof endpoint
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ proof: ['0xproof1','0xproof2'] })
  })
)
