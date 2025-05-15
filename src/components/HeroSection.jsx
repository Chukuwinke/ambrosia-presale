import React, { useState } from 'react'
import { ethers } from 'ethers'
import { MyConnectButton } from './atoms/MyConnectButton'
import { TierProgressBar } from './TierProgressBar'
import { CountdownTimer } from './CountdownTimer'

export default function HeroSection({
  totalSold,
  caps,
  saleStart,
  saleEnd,
  saleStatus,
  totalRaisedUSD,
  currentPriceUSD,
  isConnected,
  isWhitelisted,
  onJoinWaitlist,
  onBuy
}) {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')

  // Stats: show TBA until Live or Ended
  const stats = [
    {
      label: 'Raised',
      value:
        saleStatus === 'Live' || saleStatus === 'Ended'
          ? `$${totalRaisedUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
          : 'TBA'
    },
    {
      label: 'Current Price',
      value:
        saleStatus === 'Live' || saleStatus === 'Ended'
          ? `$${currentPriceUSD.toFixed(2)}`
          : 'TBA'
    },
    {
      label: 'Status',
      value: saleStatus
    }
  ]

  // Decide button props
  const buttonText = !isConnected
    ? 'Join The Pantheon'
    : !isWhitelisted
      ? 'Join Waitlist'
      : saleStatus === 'Live'
        ? 'Buy Now'
        : saleStatus === 'Coming Soon'
          ? 'Coming Soon'
          : 'Sale Ended'

  const iconClass = !isConnected
    ? 'fas fa-coins'
    : !isWhitelisted
      ? 'fas fa-user-plus'
      : 'fas fa-shopping-cart'

  const buttonClass = !isConnected
    ? 'buy-tokens'
    : !isWhitelisted
      ? 'join-pantheon'
      : saleStatus === 'Live'
        ? 'buy-tokens'
        : 'disabled-btn'

  const handleClick = () => {
    if (!isConnected) return
    if (isConnected && !isWhitelisted) return onJoinWaitlist(email)
    if (isConnected && isWhitelisted && saleStatus === 'Live')
      return onBuy(ethers.BigNumber.from(amount))
  }

  return (
    <section className="hero" id="about">
      <div className="container">
        <div className="hero-content">
          <h1>The Fashion Gods of Crypto</h1>
          <p>
            Ambrosia is the divine currency of the Agoraki project, revolutionizing
            the future of fashion by driving the adoption of stylistic expression
            within blockchain ecosystems. Join our presale and become part of a new pantheon.
          </p>
          <div className="quote">
            Modomachia! A fashion-blockchain uprising is coming—you’re either with us or against us.
          </div>

          <div className="presale-box">
            {/* Tiered progress & timer */}
            <TierProgressBar
              totalSold={totalSold}
              caps={caps}
              saleStart={saleStart}
              saleStatus={saleStatus}
            />
            <CountdownTimer
              targetTimestamp={saleEnd}
              saleStatus={saleStatus}
            />

            {/* Stats cards */}
            <div className="presale-stats">
              {stats.map(({ label, value }) => (
                <div className="stat-card" key={label}>
                  <h3>{value}</h3>
                  <p>{label}</p>
                </div>
              ))}
            </div>

            {/* Primary button */}
            <MyConnectButton
              buttonText={buttonText}
              iconClass={iconClass}
              buttonClass={buttonClass}
              onClick={handleClick}
            />

            {/* Email input for waitlist */}
            {isConnected && !isWhitelisted && (
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            )}

            {/* Amount input for on-chain buy */}
            {isConnected && isWhitelisted && saleStatus === 'Live' && (
              <input
                type="number"
                placeholder="Tokens to buy"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
