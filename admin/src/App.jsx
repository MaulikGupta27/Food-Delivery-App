import Navbar from "./components/Navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import Login from "./pages/Login/Login"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"

const pageConfig = {
  "/add": {
    kicker: "Catalog",
    title: "Add menu items",
    description: "Create new dishes, upload a standout image, and publish them to the storefront.",
    tags: ["New item", "Fresh image", "Fast publish"],
  },
  "/list": {
    kicker: "Inventory",
    title: "Manage the menu",
    description: "Review every item in the catalog and remove anything that should no longer be live.",
    tags: ["Live catalog", "Quick cleanup", "Menu control"],
  },
  "/orders": {
    title: "Track active orders",
    description: "Move orders through the delivery pipeline with a clean, readable workflow.",
    tags: ["Kitchen queue", "Delivery status", "Order flow"],
  },
}


const App = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const showHero = location.pathname !== "/orders";
  const currentView = pageConfig[location.pathname] || {
    kicker: "FeastDash Admin",
    title: "Restaurant control center",
    description: "Keep the menu and order pipeline aligned from one clean dashboard.",
    tags: ["Menu updates", "Order monitoring", "Operational clarity"],
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <ToastContainer />
        <Login url={url} onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <ToastContainer position="top-right" autoClose={2200} theme="dark" />
      <Navbar onLogout={handleLogout} />
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          {showHero && (
            <section className="dashboard-hero glass-panel">
              <div className="dashboard-hero-copy">
                <p className="eyebrow">{currentView.kicker}</p>
                <h1>{currentView.title}</h1>
                <p>{currentView.description}</p>
              </div>
              <div className="dashboard-hero-tags">
                {currentView.tags.map((tag) => (
                  <span key={tag} className="hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="route-panel">
            <Routes>
              <Route path="/" element={<Navigate to="/add" replace />} />
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} token={localStorage.getItem("adminToken")} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
