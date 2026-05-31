import { useContext } from "react"
import "./Cart.css"
import { StoreContext } from "../../Context/storeContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {cartItems, food_list, removeFromCart, getTotalCartAmount, url} = useContext(StoreContext);
  const navigate = useNavigate();

  const cartCount = Object.values(cartItems).filter(v => v > 0).length;

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Your <span className="gradient-text">Cart</span></h1>
      
      {cartCount === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <p>Your cart is empty</p>
          <button className="btn-gradient" onClick={() => navigate('/')}>Browse Menu</button>
        </div>
      ) : (
        <>
          <div className="cart-items-card">
            <div className="cart-items-header">
              <span>Item</span>
              <span>Title</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span></span>
            </div>
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id || item.id} className="cart-item-row">
                    <img src={url + "/images/" + item.image} alt={item.name} className="cart-item-img" />
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">₹{item.price}</span>
                    <span className="cart-item-qty">{cartItems[item._id]}</span>
                    <span className="cart-item-total">₹{(item.price * cartItems[item._id]).toFixed(2)}</span>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )
              }
              return null;
            })}
          </div>
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h2>Order Summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{getTotalCartAmount().toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery Fee</span>
                <span>₹{getTotalCartAmount() ? 2 : 0}</span>
              </div>
              <div className="cart-summary-divider"></div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>₹{getTotalCartAmount() ? (getTotalCartAmount() + 2).toFixed(2) : 0}</span>
              </div>
              <button className="btn-gradient cart-checkout-btn" onClick={() => navigate('/order')}>
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
