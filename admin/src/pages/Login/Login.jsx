import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ url, onLoginSuccess }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/admin/login`, {
        password
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Login successful!");
        onLoginSuccess();
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-shell glass-panel">
        <section className="login-marketing">
          <p className="eyebrow">FeastDash Admin</p>
          <h1>Restaurant operations, tuned for speed.</h1>
          <p>
            Update dishes, review orders, and keep the storefront aligned from a focused dashboard.
          </p>
          <div className="login-highlights">
            <span>Menu publishing</span>
            <span>Order tracking</span>
            <span>Secure access</span>
          </div>
        </section>

        <div className="login-box">
          <p className="login-kicker">Secure access</p>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
