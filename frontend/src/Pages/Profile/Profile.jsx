import { useState, useEffect, useContext, useCallback } from "react";
import "./Profile.css";
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info"); // "info", "addresses", "security"
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  // Profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  });

  // Password fields
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // New Address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    label: "Home",
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(url + "/api/user/profile", {
        headers: { token },
      });
      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error("fetchProfile error:", err);
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  const showNotification = (text, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage({ text: "", type: "" });
    }, 4000);
  };

  // Update Personal Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        url + "/api/user/profile",
        { name: profile.name, phone: profile.phone },
        { headers: { token } }
      );
      if (res.data.success) {
        showNotification("Profile updated successfully!");
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update profile", "error");
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showNotification("New passwords do not match!", "error");
      return;
    }
    if (passwords.newPassword.length < 8) {
      showNotification("New password must be at least 8 characters", "error");
      return;
    }
    try {
      const res = await axios.put(
        url + "/api/user/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { token } }
      );
      if (res.data.success) {
        showNotification("Password changed successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to change password", "error");
    }
  };

  // Add Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        url + "/api/user/address",
        {
          ...newAddress,
          email: profile.email,
        },
        { headers: { token } }
      );
      if (res.data.success) {
        showNotification("Address added successfully!");
        setProfile((prev) => ({ ...prev, addresses: res.data.data }));
        setShowAddAddress(false);
        setNewAddress({
          firstName: "",
          lastName: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
          phone: "",
          label: "Home",
        });
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to add address", "error");
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await axios.delete(`${url}/api/user/address/${addressId}`, {
        headers: { token },
      });
      if (res.data.success) {
        showNotification("Address deleted");
        setProfile((prev) => ({ ...prev, addresses: res.data.data }));
      }
    } catch (err) {
      showNotification("Failed to delete address", "error");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-circle">
          {profile.name ? profile.name[0].toUpperCase() : "U"}
        </div>
        <div>
          <h2>{profile.name || "Your Profile"}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>
      </div>

      {statusMessage.text && (
        <div className={`profile-status-banner ${statusMessage.type}`}>
          {statusMessage.type === "error" ? "❌ " : "✅ "}
          {statusMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          👤 Personal Info
        </button>
        <button
          className={`tab-btn ${activeTab === "addresses" ? "active" : ""}`}
          onClick={() => setActiveTab("addresses")}
        >
          📍 Saved Addresses ({profile.addresses?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          🔒 Security
        </button>
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === "info" && (
        <form className="profile-card" onSubmit={handleUpdateProfile}>
          <h3>Personal Details</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={profile.email} disabled className="disabled-input" />
            <small>Email address cannot be changed.</small>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-gradient save-profile-btn">
            Save Changes
          </button>
        </form>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="profile-card">
          <div className="address-header-row">
            <h3>Saved Addresses</h3>
            <button
              className="btn-gradient add-addr-toggle"
              onClick={() => setShowAddAddress(!showAddAddress)}
            >
              {showAddAddress ? "Cancel" : "+ Add New Address"}
            </button>
          </div>

          {showAddAddress && (
            <form className="add-address-form" onSubmit={handleAddAddress}>
              <h4>Add New Delivery Address</h4>
              <div className="multi-fields">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newAddress.firstName}
                  onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newAddress.lastName}
                  onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="Street Address, Flat / House No."
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                required
              />
              <div className="multi-fields">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>
              <div className="multi-fields">
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                />
              </div>
              <div className="address-label-picker">
                <span>Label: </span>
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    type="button"
                    key={lbl}
                    className={`tag-btn ${newAddress.label === lbl ? "active" : ""}`}
                    onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-gradient save-addr-btn">
                Save Address
              </button>
            </form>
          )}

          {profile.addresses && profile.addresses.length > 0 ? (
            <div className="profile-address-grid">
              {profile.addresses.map((addr) => (
                <div key={addr._id} className="profile-address-card">
                  <div className="card-top">
                    <span className="address-label-badge">{addr.label || "Address"}</span>
                    <button
                      className="delete-addr-btn"
                      onClick={() => handleDeleteAddress(addr._id)}
                      title="Delete Address"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="addr-name">{addr.firstName} {addr.lastName}</p>
                  <p className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                  <p className="addr-phone">📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-address-text">No saved addresses yet. Add one above to speed up checkout!</p>
          )}
        </div>
      )}

      {/* Tab 3: Security / Change Password */}
      {activeTab === "security" && (
        <form className="profile-card" onSubmit={handleChangePassword}>
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password (min 8 characters)</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-gradient save-profile-btn">
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;

