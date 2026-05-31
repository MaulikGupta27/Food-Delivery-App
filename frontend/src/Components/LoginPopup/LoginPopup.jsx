import { useContext, useState } from "react"
import "./LoginPopup.css"
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {

  const {url, setToken} = useContext(StoreContext)

    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        setData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if(currState === "Login"){
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }
        
        try {
          const response = await axios.post(newUrl, data);
          if(response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    }

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
      <form onSubmit={onLogin} className="login-modal">
        <div className="login-header">
            <h2>{currState === "Login" ? "Welcome back" : "Create Account"}</h2>
            <p className="login-header-sub">
              {currState === "Login" 
                ? "Sign in to continue ordering" 
                : "Join FeastDash for delicious food"}
            </p>
            <button type="button" className="login-close" onClick={() => setShowLogin(false)} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
        </div>
        <div className="login-fields">
            {currState !== "Login" && (
              <div className="login-field">
                <label htmlFor="login-name">Full Name</label>
                <input id="login-name" name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="John Doe" required />
              </div>
            )}
            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="you@example.com" required />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="••••••••" required />
            </div>
        </div>
        <button type="submit" className="btn-gradient login-submit">
          {currState === "Sign Up" ? "Create Account" : "Sign In"}
        </button>
        <div className="login-terms">
            <input type="checkbox" id="login-terms-check" required />
            <label htmlFor="login-terms-check">I accept the Terms and Privacy Policy.</label>
        </div>
        <p className="login-switch">
          {currState === "Login"
            ? <>New here? <button type="button" className="login-switch-btn" onClick={() => setCurrState("Sign Up")}>Create Account</button></>
            : <>Already have an account? <button type="button" className="login-switch-btn" onClick={() => setCurrState("Login")}>Sign In</button></>
          }
        </p>
      </form>
    </div>
  )
}

export default LoginPopup
