import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// 1) Bring in Wagmi + RainbowKit helpers
import { WagmiConfig, createConfig } from 'wagmi'
import { RainbowKitProvider }         from '@rainbow-me/rainbowkit'
import { configureChains, jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider }             from 'wagmi/providers/public'

import App from '../App'

// 2) Set up a dummy chains/publicClient for tests
const { chains, publicClient } = configureChains(
  [], // no real chains needed
  [
    jsonRpcProvider({ rpc: () => ({ http: 'https://example.com' }) }),
    publicProvider()
  ]
)

const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
  connectors: []  // no real connectors needed
})

// 3) Helper to render with both providers
function renderWithProviders(ui) {
  return render(
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {ui}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

describe('<App />', () => {
  test('renders logo and header connect button', () => {
    renderWithProviders(<App />)

    // logo is an <h1>
    expect(
      screen.getByRole('heading', { name: /ambrosia/i })
    ).toBeInTheDocument()

    // header button shows "Connect Wallet"
    expect(
      screen.getByRole('button', { name: /connect wallet/i })
    ).toBeVisible()
  })

  test('toggles mobile menu on hamburger click', async () => {
    renderWithProviders(<App />)

    // hamburger toggle has aria-expanded="false" initially
    const toggle = screen.getByRole('button', { name: /toggle menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    // click to open
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('.mobile-menu.open')).toBeInTheDocument()

    // click again to close
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.querySelector('.mobile-menu.open')).toBeNull()
  })
})
