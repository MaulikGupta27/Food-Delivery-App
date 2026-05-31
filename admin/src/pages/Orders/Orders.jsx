import "./Orders.css"
import { useEffect } from "react";
import { useState } from "react";
import {toast} from "react-toastify";
import axios from "axios";
import {assets} from "../../assets/assets";

const orderStatuses = ["Food Preparing", "Out for Delivery", "Delivered"];

const Orders = ({url, token}) => {
  const [orders, setOrders] = useState([]);

  const normalizeStatus = (status) => {
    return orderStatuses.includes(status) ? status : orderStatuses[0];
  }

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
    <div className="order panel-card">
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="empty-state">No active orders right now. New requests will appear here automatically.</div>
        ) : orders.map((order)=> (
          <div key={order._id} className="order-item">
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
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipCode}</p>
              </div>
              <p className="order-item-phone">
                {order.address.phone}
              </p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount.toFixed(2)}</p>
            <select
              className="order-status-select"
              onChange={(event)=>statusHandler(event, order._id)}
              value={normalizeStatus(order.status)}
            >
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
