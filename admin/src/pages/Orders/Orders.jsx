import "./Orders.css";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const orderStatuses = ["Food Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const Orders = ({ url, token }) => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [url, token]);

  const normalizeStatus = (status) => {
    return orderStatuses.includes(status) ? status : orderStatuses[0];
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        url + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to "${newStatus}"`);
      }
    } catch {
      toast.error("Failed to update order status");
    }
  };

  // KPI Analytics Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered");
    const activeOrders = orders.filter(
      (o) => o.status === "Food Preparing" || o.status === "Out for Delivery"
    );
    const totalRevenue = orders
      .filter((o) => o.status !== "Cancelled" && (o.payment === true || o.status === "Delivered"))
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return {
      totalOrders,
      deliveredCount: deliveredOrders.length,
      activeCount: activeOrders.length,
      totalRevenue,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        statusFilter === "All" || order.status === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const customerName = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.toLowerCase();
      const orderId = (order._id || "").toLowerCase();
      const phone = (order.address?.phone || "").toLowerCase();
      const city = (order.address?.city || "").toLowerCase();

      const matchesSearch =
        !q ||
        customerName.includes(q) ||
        orderId.includes(q) ||
        phone.includes(q) ||
        city.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="order panel-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Order Fulfillment & Analytics</h2>
        </div>
        <p className="section-note">
          Monitor real-time revenue, incoming requests, and dispatch workflow.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <span className="kpi-label">Realized Revenue</span>
            <span className="kpi-value">₹{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="kpi-card orders">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Orders</span>
            <span className="kpi-value">{stats.totalOrders}</span>
          </div>
        </div>

        <div className="kpi-card active">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-content">
            <span className="kpi-label">Active in Kitchen/Transit</span>
            <span className="kpi-value">{stats.activeCount}</span>
          </div>
        </div>

        <div className="kpi-card delivered">
          <div className="kpi-icon">✅</div>
          <div className="kpi-content">
            <span className="kpi-label">Delivered Orders</span>
            <span className="kpi-value">{stats.deliveredCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="orders-control-bar">
        <div className="status-tabs">
          {["All", "Food Preparing", "Out for Delivery", "Delivered", "Cancelled"].map(
            (tab) => {
              const count =
                tab === "All"
                  ? orders.length
                  : orders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  className={`status-tab-btn ${statusFilter === tab ? "active" : ""}`}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab} ({count})
                </button>
              );
            }
          )}
        </div>

        <div className="orders-search-wrap">
          <input
            type="text"
            placeholder="Search by customer, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="order-list">
        {loading ? (
          <div className="empty-state">Loading order pipeline...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            No orders match the current filter or search criteria.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCOD = order.paymentMethod === "COD";
            const isPaid = order.payment === true;

            return (
              <div key={order._id} className="order-item">
                <img src={assets.parcel_icon} alt="Parcel" className="order-parcel-img" />

                <div className="order-item-main">
                  {/* Header row */}
                  <div className="order-item-header">
                    <span className="order-ref">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-time">
                      {new Date(order.date || order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    <span className={`admin-pay-badge ${isCOD ? "cod" : "online"}`}>
                      {isCOD ? "Cash on Delivery" : "Online (Stripe)"}
                    </span>
                    <span className={`admin-pay-status ${isPaid ? "paid" : "pending"}`}>
                      {isPaid ? "Paid" : "Payment Pending"}
                    </span>
                  </div>

                  {/* Food items summary */}
                  <p className="order-item-food">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return `${item.name} x ${item.quantity}`;
                      }
                      return `${item.name} x ${item.quantity}, `;
                    })}
                  </p>

                  {/* Customer details */}
                  <p className="order-item-name">
                    👤 {order.address.firstName} {order.address.lastName}
                  </p>

                  <div className="order-item-address">
                    <p>
                      📍 {order.address.street}, {order.address.city},{" "}
                      {order.address.state} - {order.address.zipCode}
                    </p>
                  </div>

                  <p className="order-item-phone">
                    📞 {order.address.phone} {order.address.email && `| ✉️ ${order.address.email}`}
                  </p>
                </div>

                <div className="order-meta-col">
                  <p className="items-count-text">Items: {order.items.length}</p>
                  <p className="amount-text">₹{Number(order.amount).toFixed(2)}</p>
                </div>

                <div className="order-action-col">
                  <label className="status-label">Update Status:</label>
                  <select
                    className={`order-status-select status-${normalizeStatus(order.status).toLowerCase().replace(/\s+/g, "-")}`}
                    onChange={(event) => statusHandler(event, order._id)}
                    value={normalizeStatus(order.status)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
