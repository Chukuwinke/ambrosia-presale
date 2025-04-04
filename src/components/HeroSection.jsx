export default function HeroSection() {
    return (
      <section className="hero" id="about">
        <div className="container">
            <div className="hero-content">
                <h1>The Fashion Gods of Crypto</h1>
                <p>Ambrosia is the divine currency of the Agoraki project, revolutionizing the future of fashion by driving the adoption of stylistic expression within blockchain ecosystems. Join our presale and become part of a new pantheon.</p>
                
                <div className="quote">
                Modomachia! A fashion-blockchain uprising is coming you're either with us or against us.
                </div>
                
                <div className="presale-box">
                    <div className="presale-progress">
                        <div className="progress-header">
                            <h3>Presale Progress</h3>
                            <h3>65%</h3>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                    
                    <div className="presale-stats">
                        <div className="stat-card">
                            <h3>$4.2M</h3>
                            <p>Raised</p>
                        </div>
                        <div className="stat-card">
                            <h3>12 Days</h3>
                            <p>Left</p>
                        </div>
                        <div className="stat-card">
                            <h3>1 AMB = $0.12</h3>
                            <p>Current Price</p>
                        </div>
                    </div>
                    
                    <button className="buy-tokens">
                        <i className="fas fa-coins"></i> Join The Pantheon
                    </button>
                </div>
            </div>
        </div>
      </section>
    )
  }