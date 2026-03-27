import { useContext } from "react";
import "./Verify.css"
import { useNavigate, useSearchParams } from "react-router-dom"
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";
import { useEffect } from "react";


const Verify = () => {

  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const {url} = useContext(StoreContext);
  const navigate = useNavigate();
  
  useEffect(()=> {
    const verifyPayment = async()=> {
      try {
        const response = await axios.get(url+"/api/order/verify", {
          params: { success, orderId }
        });

        if(response.data.success) {
          navigate("/myorders");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    if (!success || !orderId) {
      navigate("/");
      return;
    }

    void verifyPayment();
  }, [navigate, orderId, success, url])

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  )
}

export default Verify;
