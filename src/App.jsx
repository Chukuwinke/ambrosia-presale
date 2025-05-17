// src/App.jsx
import React, { useState, useEffect } from 'react'
import './App.css'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { ethers } from 'ethers'
import HeroSection from './components/HeroSection'
import WaitlistModal from './components/WaitlistModal'
import { MyConnectButton } from './components/atoms/MyConnectButton'
import Tokenomics from './components/Tokenomics'
import Roadmap from './components/Roadmap'
import Team from './components/Team'
import Footer from './components/Footer'

// 1) Your presale contract’s minimal ABI
export const PresaleABI = [
  "function startTime() view returns (uint256)",
  "function endTime()   view returns (uint256)",
  "function getPrice()  view returns (uint256)",
  "function totalSold() view returns (uint256)",
  "function buy(uint256,bytes32[]) payable",
  "function buyWithToken(address,uint256,bytes32[])"
]

export default function App() {
  // — Mobile menu state
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)

  // — Wagmi & Viem hooks
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { address, isConnected } = useAccount()

  // — On-chain sale state
  const [proof, setProof]       = useState([])
  const [isWL, setIsWL]         = useState(false)
  const [saleStart, setSaleStart] = useState(0)
  const [saleEnd, setSaleEnd]     = useState(0)
  const [priceRaw, setPriceRaw]   = useState('0')
  const [soldRaw, setSoldRaw]     = useState('0')

  // — Waitlist UI state
  const [isOnWaitlist, setOnWaitlist] = useState(false)
  const [isModalOpen, setModalOpen]   = useState(false)

  // Your contract address in .env (or stub if not deployed yet)
  const PRESALE_ADDR = import.meta.env.VITE_PRESALE_ADDRESS

  // 2) Load on-chain parameters once
  useEffect(() => {
    if (!publicClient || !isAddress(PRESALE_ADDR)) {
      console.warn(
        `⚠️ Invalid presale address "${PRESALE_ADDR}", skipping on-chain calls.`
      )
      return
    }
    ;(async () => {
      const [start, end, p, s] = await Promise.all([
        publicClient.readContract({
          address: PRESALE_ADDR,
          abi: PresaleABI,
          functionName: 'startTime'
        }),
        publicClient.readContract({
          address: PRESALE_ADDR,
          abi: PresaleABI,
          functionName: 'endTime'
        }),
        publicClient.readContract({
          address: PRESALE_ADDR,
          abi: PresaleABI,
          functionName: 'getPrice'
        }),
        publicClient.readContract({
          address: PRESALE_ADDR,
          abi: PresaleABI,
          functionName: 'totalSold'
        })
      ])
      setSaleStart(Number(start))
      setSaleEnd(  Number(end))
      setPriceRaw(p.toString())
      setSoldRaw( s.toString())
    })()
  }, [publicClient, PRESALE_ADDR])

  // 3) Fetch Merkle proof off-chain on connect
  useEffect(() => {
    if (!address) return
    ;(async () => {
      try {
        const res = await fetch(`/api/proofs/${address.toLowerCase()}`)
        if (!res.ok) throw new Error(`Proof fetch failed (${res.status})`)
        const data = await res.json()
        setProof(data.proof || [])
        setIsWL((data.proof || []).length > 0)
      } catch (err) {
        console.error('Proof fetch error:', err)
        setProof([])
        setIsWL(false)
      }
    })()
  }, [address])

  // 3a) Check waitlist status on connect
  useEffect(() => {
    if (!address) {
      setOnWaitlist(false)
      return
    }
    ;(async () => {
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, email: '' })  // blank email = status check
        })
        if (!res.ok) throw new Error(`Status check failed (${res.status})`)
        const { already } = await res.json()
        setOnWaitlist(!!already)
      } catch (err) {
        console.error('Waitlist status check failed:', err)
      }
    })()
  }, [address])

  // 4) Open modal to join waitlist
  const handleJoinClick = () => {
    if (!isConnected) return
    if (!isOnWaitlist) setModalOpen(true)
  }

  // 5) On-chain buy
  const onBuy = async (amount, tokenAddr) => {
    if (!walletClient) return alert('Connect your wallet first')
    if (!isAddress(PRESALE_ADDR))
      return alert('⚠️ Presale contract not deployed yet')

    if (tokenAddr) {
      await walletClient.writeContract({
        address: PRESALE_ADDR,
        abi: PresaleABI,
        functionName: 'buyWithToken',
        args: [tokenAddr, amount, proof]
      })
    } else {
      const cost = ethers.BigNumber.from(priceRaw).mul(amount)
      await walletClient.writeContract({
        address: PRESALE_ADDR,
        abi: PresaleABI,
        functionName: 'buy',
        args: [amount, proof],
        value: cost
      })
    }
    alert('🎉 Purchase successful')
  }

  // 6) Derive UI stats
  const now            = Math.floor(Date.now() / 1000)
  const pricePerToken  = parseFloat(ethers.formatUnits(priceRaw, 6))
  const totalSoldNum   = parseInt(soldRaw, 10)
  const totalRaisedUSD = pricePerToken * totalSoldNum

  // 7) Sale status logic
  let saleStatus
  if (saleStart <= 0)        saleStatus = 'Coming Soon'
  else if (now < saleStart)  saleStatus = 'Coming Soon'
  else if (now >= saleEnd)   saleStatus = 'Ended'
  else                        saleStatus = 'Live'

  // 8) Stage caps
  const caps = [10000, 20000, 30000 /* …add more… */]

  return (
    <>
      <header>
        {/* …your header/nav as before… */}
        <div className="container">
          <nav>
            <h1 className="logo">Ambrosia</h1>
            <div className="nav-links desktop-only">
              <a href="#about">About</a>
              <a href="#tokenomics">Tokenomics</a>
              <a href="#roadmap">Roadmap</a>
              <a href="#team">Pantheon</a>
            </div>
            <div className="header-right desktop-only">
              <a href="/whitepaper.pdf" className="connect-wallet">
                <i className="fas fa-graduation-cap"></i> Whitepaper
              </a>
              <MyConnectButton
                buttonText="Connect Wallet"
                iconClass="fas fa-wallet"
                buttonClass="connect-wallet"
              />
            </div>
            <button
              className="hamburger-menu mobile-only"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen
                ? <i className="fas fa-times" aria-hidden="true" />
                : <i className="fas fa-bars" aria-hidden="true" />}
            </button>
          </nav>
        </div>
        <div className={`nav-links mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* …mobile menu links as before… */}
        </div>
      </header>

      <HeroSection
        totalSold={totalSoldNum}
        caps={caps}
        saleStart={saleStart}
        saleEnd={saleEnd}
        saleStatus={saleStatus}
        totalRaisedUSD={totalRaisedUSD}
        currentPriceUSD={pricePerToken}
        isConnected={isConnected}
        isWhitelisted={isWL}
        isOnWaitlist={isOnWaitlist}          // newly added prop
        onJoinWaitlist={handleJoinClick}     // now opens modal
        onBuy={onBuy}
      />

      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        address={address || ''}
      />

      <Tokenomics />
      <Roadmap />
      <Team />
      <Footer />
    </>
  )
}
