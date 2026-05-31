import "./Header.css"

const Header = () => {
  const handleViewMenuClick = () => {
    const menuSection = document.getElementById("explore-menu");
    if (!menuSection) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const scrollTop =
      window.pageYOffset +
      menuSection.getBoundingClientRect().top -
      navbarHeight -
      8;

    window.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" });
  };

  return (
    <section id="home-top" className="header">
      <div className="header-bg-pattern"></div>
      <div className="header-content">
        <div className="header-tag">🔥 #1 Food Delivery App</div>
        <h1 className="header-title">
          Delicious Food,
          <br />
          <span className="gradient-text">Delivered Fast</span>
        </h1>
        <p className="header-subtitle">
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Your
          cravings, satisfied in minutes.
        </p>
        <div className="header-actions">
          <button
            type="button"
            className="btn-gradient header-cta"
            onClick={handleViewMenuClick}
          >
            Explore Menu
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Dishes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">30min</span>
              <span className="stat-label">Delivery</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
      <div className="header-visual">
        <div className="header-glow"></div>
        <div className="header-floating-cards">
          <div className="floating-card fc-1">🍕</div>
          <div className="floating-card fc-2">🍜</div>
          <div className="floating-card fc-3">🍔</div>
          <div className="floating-card fc-4">🥗</div>
          <div className="floating-card fc-5">🍰</div>
        </div>
      </div>
    </section>
  )
}

export default Header
