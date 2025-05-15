import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function MyConnectButton({
  buttonText,
  iconClass,
  buttonClass,
  onClick
}) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
        const connected = mounted && account && chain
        const handleClick = connected ? openAccountModal : openConnectModal
        return (
          <button
            className={buttonClass}
            onClick={connected ? (onClick||handleClick) : handleClick}
            disabled={buttonText==='Coming Soon' || buttonText==='Sale Ended'}
          >
            {iconClass && <i className={iconClass}></i>}
            <span style={{ marginLeft: iconClass ? '8px' : 0 }}>
              {buttonText}
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
