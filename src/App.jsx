import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HeroSection from './components/HeroSection'
import Tokenomics from './components/Tokenomics'
import Roadmap from './components/Roadmap'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  return (
    <>
      {/* Header */}
      <header>
        <div className="container">
          <nav>
            <div className="logo">Ambr<span>osia</span></div>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#tokenomics">Tokenomics</a>
              <a href="#roadmap">Roadmap</a>
              <a href="#team">Pantheon</a>
            </div>
            <button className="connect-wallet">
              <i className="fas fa-wallet"></i> Connect Wallet
            </button>
          </nav>
        </div>
      </header>

      {/* sections */}
      <HeroSection />
      <Tokenomics />
      <Roadmap />
      <Team />
      <Footer />

    </>
  )
}

export default App
