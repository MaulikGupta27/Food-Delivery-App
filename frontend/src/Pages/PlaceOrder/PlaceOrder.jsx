import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, setToken, food_list, cartItems, setCartItems, url } =
    useContext(StoreContext);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" or "Stripe"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });

  const navigate = useNavigate();

  // Load user profile & saved addresses if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get(url + "/api/user/profile", {
          headers: { token }
        });
        if (res.data.success && res.data.data) {
          const user = res.data.data;
          const addresses = user.addresses || [];
          setSavedAddresses(addresses);

          if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddr._id);
            setData({
              firstName: defaultAddr.firstName || "",
              lastName: defaultAddr.lastName || "",
              email: defaultAddr.email || user.email || "",
              street: defaultAddr.street || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              zipCode: defaultAddr.zipCode || "",
              country: defaultAddr.country || "India",
              phone: defaultAddr.phone || user.phone || "",
            });
          } else {
            setData((prev) => ({
              ...prev,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              email: user.email || "",
              phone: user.phone || "",
            }));
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setToken("");
          setErrorMessage("Your session has expired. Please sign in again.");
        }
      }
    };

    fetchUserProfile();
  }, [token, url, setToken]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setData({
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone,
    });
  };

  const handleAddNewAddressOption = () => {
    setSelectedAddressId("new");
    setData({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
    });
  };

  const onChangeHandler = (event) => {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const openLoginPopup = () => {
    window.dispatchEvent(new CustomEvent("open-login"));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Please sign in to place your order.");
      openLoginPopup();
      return;
    }

    setIsSubmitting(true);

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    if (orderItems.length === 0) {
      setErrorMessage("Your cart is empty.");
      setIsSubmitting(false);
      return;
    }

    // Save address to user profile if checked
    if (saveAddressToProfile && selectedAddressId === "new") {
      try {
        await axios.post(
          url + "/api/user/address",
          { ...data, label: addressLabel },
          { headers: { token } }
        );
      } catch (err) {
        console.log("Could not save address to profile:", err.message);
      }
    }

    const orderData = {
      address: data,
      items: orderItems,
      paymentMethod,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        setIsOrderPlaced(true);
        setCartItems({});
        if (paymentMethod === "COD") {
          navigate("/myorders", { replace: true });
        } else if (response.data.session_url) {
          window.location.replace(response.data.session_url);
        } else {
          setErrorMessage("Failed to initiate online payment.");
          setIsSubmitting(false);
        }
      } else {
        setErrorMessage(response.data.message || "Order placement failed.");
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
        setErrorMessage("Your session has expired. Please sign in again to complete your order.");
        openLoginPopup();
      } else {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOrderPlaced && getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [getTotalCartAmount, navigate, isOrderPlaced]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <h2 className="title">Delivery Information</h2>

        {errorMessage && (
          <div className="order-error-banner">
            <span>⚠️ {errorMessage}</span>
            {!token && (
              <button
                type="button"
                className="banner-signin-btn"
                onClick={openLoginPopup}
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Not Logged In Banner */}
        {!token && (
          <div className="guest-signin-prompt">
            <p>Already have an account? Sign in for saved addresses and faster checkout.</p>
            <button
              type="button"
              className="btn-gradient signin-checkout-btn"
              onClick={openLoginPopup}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Saved Addresses Section */}
        {token && savedAddresses.length > 0 && (
          <div className="saved-addresses-block">
            <p className="sub-title">Choose Delivery Address</p>
            <div className="saved-address-cards">
              {savedAddresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`saved-address-card ${
                    selectedAddressId === addr._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectSavedAddress(addr)}
                >
                  <div className="card-top">
                    <span className="address-label-badge">{addr.label || "Address"}</span>
                    {addr.isDefault && <span className="default-pill">Default</span>}
                  </div>
                  <p className="addr-name">{addr.firstName} {addr.lastName}</p>
                  <p className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                  <p className="addr-phone">📞 {addr.phone}</p>
                </div>
              ))}
              <div
                className={`saved-address-card new-address-card ${
                  selectedAddressId === "new" ? "selected" : ""
                }`}
                onClick={handleAddNewAddressOption}
              >
                <span className="plus-icon">+</span>
                <p>Deliver to a new address</p>
              </div>
            </div>
          </div>
        )}

        {/* Address Fields */}
        <div className="address-form-fields">
          <div className="multi-fields">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={data.firstName}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            placeholder="Street Address, House / Flat No."
            name="street"
            value={data.street}
            onChange={onChangeHandler}
            required
          />
          <div className="multi-fields">
            <input
              type="text"
              placeholder="City"
              name="city"
              value={data.city}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              value={data.state}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="Zip code / PIN"
              name="zipCode"
              value={data.zipCode}
              onChange={onChangeHandler}
              required
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={data.country}
              onChange={onChangeHandler}
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number (10 digits)"
            name="phone"
            value={data.phone}
            onChange={onChangeHandler}
            required
          />

          {/* Option to save address */}
          {token && selectedAddressId === "new" && (
            <div className="save-address-opt">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={saveAddressToProfile}
                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                />
                <span>Save this address for future orders</span>
              </label>
              {saveAddressToProfile && (
                <div className="address-tag-select">
                  <span>Label: </span>
                  {["Home", "Work", "Other"].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className={`tag-btn ${addressLabel === tag ? "active" : ""}`}
                      onClick={() => setAddressLabel(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="place-order-right">
        {/* Payment Method Selector */}
        <div className="payment-method-card">
          <h3 className="section-title">Payment Method</h3>
          <div className="payment-options">
            <label
              className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}
              onClick={() => setPaymentMethod("COD")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <div className="option-content">
                <span className="option-icon">💵</span>
                <div>
                  <p className="option-title">Cash on Delivery (COD)</p>
                  <p className="option-subtitle">Pay with cash or UPI upon delivery</p>
                </div>
              </div>
            </label>

            <label
              className={`payment-option ${paymentMethod === "Stripe" ? "active" : ""}`}
              onClick={() => setPaymentMethod("Stripe")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={() => setPaymentMethod("Stripe")}
              />
              <div className="option-content">
                <span className="option-icon">💳</span>
                <div>
                  <p className="option-title">Online Payment</p>
                  <p className="option-subtitle">Cards, UPI, NetBanking via Stripe</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Cart Total Breakdown */}
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() ? 2 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details total-row">
              <b>Total Amount</b>
              <b className="total-value">
                ₹{getTotalCartAmount() ? (getTotalCartAmount() + 2).toFixed(2) : 0}
              </b>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gradient place-order-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "PROCESSING..."
              : paymentMethod === "COD"
              ? "PLACE ORDER (CASH ON DELIVERY)"
              : "PROCEED TO ONLINE PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
