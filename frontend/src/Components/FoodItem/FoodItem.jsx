import "./FoodItem.css"
import { useContext } from "react"
import { StoreContext } from "../../Context/storeContext";

const FoodItem = ({id, name, price, description, image}) => {

    const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
    const count = cartItems[id] || 0;

  return (
    <div className="food-card">
        <div className="food-card-image-wrapper">
            <img className="food-card-image" src={url + "/images/" + image} alt={name} />
            <div className="food-card-image-overlay"></div>
            {!count
                ? <button className="food-card-add" onClick={() => addToCart(id)} aria-label="Add to cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                : <div className="food-card-counter">
                    <button onClick={() => removeFromCart(id)} aria-label="Remove one">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span className="counter-value">{count}</span>
                    <button onClick={() => addToCart(id)} aria-label="Add one more">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
            }
        </div>
        <div className="food-card-body">
            <div className="food-card-row">
                <h3 className="food-card-name">{name}</h3>
                <div className="food-card-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-start)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>4.5</span>
                </div>
            </div>
            <p className="food-card-desc">{description}</p>
            <div className="food-card-footer">
              <span className="food-card-price">₹{price}</span>
            </div>
        </div>
    </div>
  )
}

export default FoodItem
