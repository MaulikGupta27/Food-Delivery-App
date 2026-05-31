import { assets } from "../../assets/assets"
import "./AppDownload.css"

const AppDownload = () => {
  return (
    <section className="app-download" id="app-download">
      <div className="app-download-card">
        <div className="app-download-content">
          <span className="app-download-badge">📱 Mobile App</span>
          <h2>Get the <span className="gradient-text">FeastDash</span> App</h2>
          <p>For a faster, smoother experience — download the FeastDash app and order on the go!</p>
          <div className="app-download-buttons">
            <img src={assets.play_store} alt="Google Play Store" />
            <img src={assets.app_store} alt="Apple App Store" />
          </div>
        </div>
        <div className="app-download-glow"></div>
      </div>
    </section>
  )
}

export default AppDownload
