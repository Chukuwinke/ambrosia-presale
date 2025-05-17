// src/components/HeroSection.jsx
import React from 'react'
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
  isOnWaitlist,      // NEW
  onJoinWaitlist,    // now just opens modal
  onBuy
}) {
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

  // Determine button label
  const buttonText = !isConnected
    ? 'Join The Pantheon'
    : isOnWaitlist
      ? 'Already on Waitlist'            // NEW
      : !isWhitelisted
        ? 'Join Waitlist'
        : saleStatus === 'Live'
          ? 'Buy Now'
          : saleStatus === 'Coming Soon'
            ? 'Coming Soon'
            : 'Sale Ended'

  // Determine disabled state
  const buttonDisabled = 
    !isConnected ||
    isOnWaitlist ||                       // NEW
    (isWhitelisted && saleStatus !== 'Live')

  // Determine icon & styling
  const iconClass = !isConnected
    ? 'fas fa-coins'
    : isOnWaitlist
      ? 'fas fa-user-clock'              // you can choose a different icon for "waiting"
      : !isWhitelisted
        ? 'fas fa-user-plus'
        : 'fas fa-shopping-cart'

  const buttonClass = !isConnected
    ? 'buy-tokens'
    : isOnWaitlist
      ? 'join-pantheon disabled-btn'     // match your disabled style
      : !isWhitelisted
        ? 'join-pantheon'
        : saleStatus === 'Live'
          ? 'buy-tokens'
          : 'disabled-btn'

  // Click handler
  const handleClick = () => {
    if (!isConnected || buttonDisabled) return
    if (!isWhitelisted && !isOnWaitlist) {
      return onJoinWaitlist()
    }
    if (isWhitelisted && saleStatus === 'Live') {
      // amount prompt moved to modal/buy UI
      return onBuy(ethers.BigNumber.from(1))  // default amount or handle elsewhere
    }
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
              disabled={buttonDisabled}               // NEW
            />

            {/* NOTE: Inline inputs removed; all waitlist/email and buy amount flows now handled via modal/UI elsewhere */}
          </div>
        </div>
      </div>
    </section>
  )
}
