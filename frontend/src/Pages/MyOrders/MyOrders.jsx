import { useContext, useEffect, useState, useCallback } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const TRACKING_STEPS = [
  { key: "placed", label: "Order Placed", icon: "📝" },
  { key: "preparing", label: "Food Preparing", icon: "🍳" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];

const getStepIndex = (status) => {
  const norm = (status || "").toLowerCase();
  if (norm.includes("deliver") && !norm.includes("out")) return 3;
  if (norm.includes("out")) return 2;
  if (norm.includes("prepar") || norm.includes("process")) return 1;
  return 0;
};

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setOrders(response.data.data || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <div>
          <h2>My Orders</h2>
          <p className="my-orders-subtitle">
            Track real-time progress of your food orders
          </p>
        </div>
        <button
          className="refresh-orders-btn"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh Status"}
        </button>
      </div>

      {loading ? (
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <img src={assets.parcel_icon} alt="No orders" className="empty-parcel-icon" />
          <h3>No Orders Yet</h3>
          <p>You haven't placed any food orders yet. Explore our menu to get started!</p>
          <a href="/#explore-menu" className="btn-gradient explore-menu-link">
            Explore Menu
          </a>
        </div>
      ) : (
        <div className="orders-feed">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);
            const isDelivered = currentStep === 3;
            const orderDate = new Date(order.date || order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div key={order._id} className="order-card">
                {/* Card Top: Order Meta */}
                <div className="order-card-meta">
                  <div className="meta-left">
                    <span className="order-id">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="order-date">{orderDate}</span>
                  </div>

                  <div className="meta-right">
                    <span className={`payment-pill ${order.paymentMethod === "COD" ? "cod" : "online"}`}>
                      {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Paid"}
                    </span>
                    <span className={`status-pill status-${currentStep}`}>
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="order-stepper-container">
                  <div className="order-stepper">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStep;
                      const isActive = idx === currentStep;
                      return (
                        <div
                          key={step.key}
                          className={`step-item ${isCompleted ? "completed" : ""} ${
                            isActive ? "active" : ""
                          }`}
                        >
                          <div className="step-circle">
                            {isCompleted ? "✓" : step.icon}
                          </div>
                          <span className="step-label">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="stepper-progress-bar">
                    <div
                      className="stepper-progress-fill"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Card Items & Details */}
                <div className="order-card-content">
                  <div className="order-items-summary">
                    <p className="summary-title">Items Ordered ({order.items.length})</p>
                    <div className="items-chip-list">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="item-chip">
                          {item.name} <b className="item-qty">x{item.quantity}</b>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="order-footer-details">
                    <div className="delivery-destination">
                      <span className="dest-icon">📍</span>
                      <span className="dest-text">
                        {order.address?.street}, {order.address?.city}
                      </span>
                    </div>

                    <div className="order-total-price">
                      <span className="total-label">Total Amount:</span>
                      <span className="total-amount">₹{Number(order.amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
