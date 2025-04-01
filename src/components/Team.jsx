

export default function Team() {
    return (
      <section className="hero" id="team">
         <div className="container">
            <div className="team-content">
                <h2 className="section-title">Our Pantheon</h2>
                <div className="team-grid">
                    <div className="team-card">
                        {/* Fixed img tags with closing slash */}
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Team Member" />
                        <h3>zeus</h3>
                        <p>Chief God (Founder)</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                    <div className="team-card">
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Team Member" />
                        <h3>Iris</h3>
                        <p>Goddess of trade/commerce (Marketing Lead)</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                    <div className="team-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" />
                        <h3>Ares</h3>
                        <p>cheif Developer</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                    <div className="team-card">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" />
                        <h3>Athena</h3>
                        <p>godess of wisdom/ law (Smart Contract Auditor)</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    )
}