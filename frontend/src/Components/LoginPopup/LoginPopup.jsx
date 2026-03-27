import { useContext, useState } from "react"
import "./LoginPopup.css"
import { assets } from "../../assets/assets";
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
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
            {currState==="Login" ? <></> : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter your name" required />}
            <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter your email" required />
            <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
        </div>
        <button type="submit">{currState==="Sign Up" ? "Create Account" : "Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>I accept the Terms and Privacy Policy.</p>
        </div>
        {currState==="Login"
        ? <p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Sign Up</span></p>
        : <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login</span></p>}
      </form>
    </div>
  )
}

export default LoginPopup
