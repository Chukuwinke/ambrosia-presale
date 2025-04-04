import { useState } from 'react'
import './App.css'
import HeroSection from './components/HeroSection'
import Tokenomics from './components/Tokenomics'
import Roadmap from './components/Roadmap'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <div className="logo">Ambrosia</div>
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
              <button className="connect-wallet">
                <i className="fas fa-wallet"></i> Connect Wallet
              </button>
            </div>
            <div className="hamburger-menu mobile-only" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-bars"></i>
              )}
            </div>

          </nav>
        </div>
        {/* Mobile Menu */}
        {/* Mobile Menu */}
      <div className={`nav-links mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-close" onClick={toggleMobileMenu}>
          <i className="fas fa-times"></i>
        </div>
        <a href="#about">About</a>
        <a href="#tokenomics">Tokenomics</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#team">Pantheon</a>
        <a href="/whitepaper.pdf" className="connect-wallet">
          <i className="fas fa-graduation-cap"></i> Whitepaper
        </a>
        <button className="connect-wallet">
          <i className="fas fa-wallet"></i> Connect Wallet
        </button>
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

      {/* Sections */}
      <HeroSection />
      <Tokenomics />
      <Roadmap />
      <Team />
      <Footer />
    </>
  )
}

export default App
