import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroSection from '../components/HeroSection'

const baseProps = {
  totalSold:        0,
  caps:             [10000, 20000, 30000],
  saleStart:        0,
  saleEnd:          0,
  saleStatus:       'Coming Soon',
  totalRaisedUSD:   0,
  currentPriceUSD:  0,
  isConnected:      false,
  isWhitelisted:    false,
  onJoinWaitlist:   jest.fn(),
  onBuy:            jest.fn()
}

describe('<HeroSection />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Join The Pantheon when disconnected', () => {
    render(<HeroSection {...baseProps} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent('Join The Pantheon')
    expect(btn).not.toBeDisabled()
  })

  test('Join Waitlist UI when connected but not whitelisted', () => {
    render(
      <HeroSection
        {...baseProps}
        isConnected={true}
        saleStatus="Coming Soon"
      />
    )
    // still Join Waitlist
    const btn = screen.getByRole('button', { name: /join waitlist/i })
    expect(btn).toBeVisible()
    // show email input
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument()
  })

  test('calls onJoinWaitlist with email', async () => {
    render(
      <HeroSection
        {...baseProps}
        isConnected={true}
        saleStatus="Coming Soon"
      />
    )
    const emailInput = screen.getByPlaceholderText(/your email/i)
    await userEvent.type(emailInput, 'a@b.com')
    await userEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
    expect(baseProps.onJoinWaitlist).toHaveBeenCalledWith('a@b.com')
  })

  test('Buy Now when live & whitelisted', () => {
    render(
      <HeroSection
        {...baseProps}
        isConnected={true}
        isWhitelisted={true}
        saleStatus="Live"
      />
    )
    expect(screen.getByRole('button')).toHaveTextContent('Buy Now')
    expect(screen.getByPlaceholderText(/tokens to buy/i)).toBeInTheDocument()
  })

  test('calls onBuy when amount entered', async () => {
    render(
      <HeroSection
        {...baseProps}
        isConnected={true}
        isWhitelisted={true}
        saleStatus="Live"
      />
    )
    const amountInput = screen.getByPlaceholderText(/tokens to buy/i)
    await userEvent.type(amountInput, '5')
    await userEvent.click(screen.getByRole('button', { name: /buy now/i }))
    expect(baseProps.onBuy).toHaveBeenCalledWith(expect.any(Object))
  })

  test('Sale Ended disables button', () => {
    render(
      <HeroSection
        {...baseProps}
        isConnected={true}
        isWhitelisted={true}
        saleStatus="Ended"
      />
    )
    const btn = screen.getByRole('button')
    expect(btn).toHaveTextContent('Sale Ended')
    expect(btn).toBeDisabled()
  })
})
