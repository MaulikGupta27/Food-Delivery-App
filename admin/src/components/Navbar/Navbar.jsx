import "./Navbar.css"
import {assets} from "../../assets/assets"

const Navbar = ({ onLogout }) => {
  return (
    <div className="navbar glass-panel">
      <div className="navbar-brand">
        <img className="logo" src={assets.logo} alt="FeastDash admin logo" />
        <div>
          <p className="navbar-kicker">FeastDash Admin</p>
          <p className="navbar-subtitle">Menu and order control</p>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-user">
          <img className="profile" src={assets.profile_image} alt="Admin profile" />
          <div className="navbar-user-copy">
            <span>Admin</span>
            <small>Signed in</small>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
