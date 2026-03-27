import "./Orders.css"
import { useEffect } from "react";
import { useState } from "react";
import {toast} from "react-toastify";
import axios from "axios";
import {assets} from "../../assets/assets";

const Orders = ({url, token}) => {
  const [orders, setOrders] = useState([]);

  const statusHandler = async(event, orderId)=> {
    try {
      const response = await axios.post(url+"/api/order/status", {
        orderId,
        status: event.target.value
      }, {
        headers: {
          token
        }
      })
      if(response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: event.target.value } : order
          )
        );
      }
    } catch {
      toast.error("Failed to update order status");
    }
  }

  useEffect(()=> {
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(url+"/api/order/list", {
          headers: {
            token
          }
        });
        if(response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch {
        toast.error("Failed to fetch orders");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [url, token])

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index)=> (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index)=> {
                  if(index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName+" "+order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street+", "}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipCode}</p>
              </div>
              <p className="order-item-phone">
                {order.address.phone}
              </p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount.toFixed(2)}</p>
            <select onChange={(event)=>statusHandler(event, order._id)} value={order.status}>
              <option value="Food Preparing">Food Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
