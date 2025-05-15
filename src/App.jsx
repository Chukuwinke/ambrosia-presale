// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { ethers } from 'ethers'
import HeroSection from './components/HeroSection'
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
  const [proof, setProof] = useState([])
  const [isWL, setIsWL] = useState(false)
  const [saleStart, setSaleStart] = useState(0)
  const [saleEnd, setSaleEnd] = useState(0)
  const [priceRaw, setPriceRaw] = useState('0')
  const [soldRaw, setSoldRaw] = useState('0')

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
      setSaleEnd(Number(end))
      setPriceRaw(p.toString())
      setSoldRaw(s.toString())
    })()
  }, [publicClient, PRESALE_ADDR])

  // 3) Fetch Merkle proof off-chain on connect
  useEffect(() => {
    if (!address) return
    fetch(`/api/proofs/${address.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        setProof(data.proof || [])
        setIsWL((data.proof || []).length > 0)
      })
  }, [address])

  // 4) Off-chain waitlist signup
  const onJoinWaitlist = async email => {
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, email })
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Waitlist failed:', text)
        throw new Error(`Waitlist API error (${res.status})`)
      }

      const data = await res.json()
      console.log('Waitlist success response:', data)
      alert('✅ You’re on the waitlist!')
    } catch (err) {
      console.error(err)
      alert(`❌ Failed to join waitlist: ${err.message}`)
    }
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
  const now = Math.floor(Date.now() / 1000)
  const pricePerToken = parseFloat(ethers.formatUnits(priceRaw, 6))
  const totalSoldNum = parseInt(soldRaw, 10)
  const totalRaisedUSD = pricePerToken * totalSoldNum

  // 7) Correct status logic: uninitialized → Coming Soon
  let saleStatus
  if (saleStart <= 0) {
    saleStatus = 'Coming Soon'
  } else if (now < saleStart) {
    saleStatus = 'Coming Soon'
  } else if (now >= saleEnd) {
    saleStatus = 'Ended'
  } else {
    saleStatus = 'Live'
  }

  // 8) Define your cumulative stage caps
  const caps = [10000, 20000, 30000 /* …add more if needed… */]

  return (
    <>
       <header>
        {/* …your header/nav code… */}
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
        <div className={
          `nav-links mobile-menu ${isMobileMenuOpen ? 'open' : ''}`
        }>
          {/* …mobile links & connect button… */}
          <div
            className="mobile-menu-close"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-times"></i>
          </div>
          <a href="#about">About</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#team">Pantheon</a>
          <a href="/whitepaper.pdf" className="connect-wallet">
            <i className="fas fa-graduation-cap"></i> Whitepaper
          </a>
          <MyConnectButton
            buttonText="Connect Wallet"
            iconClass="fas fa-wallet"
            buttonClass="connect-wallet"
          />
           <hr className="mobile-menu-divider" />
        <div className="mobile-social-links">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-telegram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-medium"></i></a>
          {/* Add additional social links as needed */}
        </div>
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
        onJoinWaitlist={onJoinWaitlist}
        onBuy={onBuy}
      />

      <Tokenomics />
      <Roadmap />
      <Team />
      <Footer />
    </>
  )
}
