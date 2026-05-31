import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/storeContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const location = useLocation();
  const navigate = useNavigate();

  const scrollToHeader = (attempts = 8) => {
    const headerSection = document.getElementById("home-top");
    if (headerSection) {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const scrollTop =
        window.pageYOffset +
        headerSection.getBoundingClientRect().top -
        navbarHeight -
        8;

      window.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" });
      return;
    }

    if (attempts > 0) {
      setTimeout(() => scrollToHeader(attempts - 1), 50);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = (event) => {
    event.preventDefault();
    setMenu("home");
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => scrollToHeader(), 0);
  };

  const handleNavClick = (menuName) => {
    setMenu(menuName);
    setMobileMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo-text">Feast<span className="logo-accent">Dash</span></span>
      </Link>

      <button
        className={`navbar-hamburger ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
        <li>
          <Link
            to="/"
            className={`navbar-link ${menu === "home" ? "active" : ""}`}
            onClick={handleHomeClick}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href="#explore-menu"
            className={`navbar-link ${menu === "menu" ? "active" : ""}`}
            onClick={() => handleNavClick("menu")}
          >
            Menu
          </a>
        </li>
        <li>
          <a
            href="#app-download"
            className={`navbar-link ${menu === "mobile-app" ? "active" : ""}`}
            onClick={() => handleNavClick("mobile-app")}
          >
            App
          </a>
        </li>
        <li>
          <a
            href="#footer"
            className={`navbar-link ${menu === "contact-us" ? "active" : ""}`}
            onClick={() => handleNavClick("contact-us")}
          >
            Contact
          </a>
        </li>
      </ul>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-cart" aria-label="View cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
        </Link>
        {!token ? (
          <button className="btn-gradient navbar-signin" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className="navbar-profile">
            <div className="navbar-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <ul className="navbar-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>My Orders</span>
              </li>
              <li onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
