import axios from "axios";
import { useEffect, useState } from "react";
import { StoreContext } from "./storeContext";

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        // If the item is not already in the cart, add it with a quantity of 1
        if(!cartItems[itemId]) {
            setCartItems(prev=>({...prev, [itemId]: 1}))
        } else {
            setCartItems(prev=>({...prev, [itemId]: prev[itemId]+1}))
        }
        if(token) {
            try {
                await axios.post(url+"/api/cart/add", {itemId}, {
                    headers: {
                        token
                    }
                });
            } catch (error) {
                console.error("Failed to add cart item:", error);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]: prev[itemId]-1}));
        if(token) {
            try {
                await axios.post(url+"/api/cart/remove", {itemId}, {
                    headers: {
                        token
                    }
                });
            } catch (error) {
                console.error("Failed to remove cart item:", error);
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0) {
                let itemInfo = food_list.find((product)=>product._id === item);
                if(itemInfo) totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    useEffect(()=> {
        async function loadData() {
            const foodResponse = await axios.get(url+"/api/food/list");
            setFoodList(foodResponse.data.data);

            const localToken = localStorage.getItem("token");
            if(localToken) {
                setToken(localToken);
                try {
                    const cartResponse = await axios.post(url+"/api/cart/get", {}, {
                        headers: {
                            token: localToken
                        }
                    });
                    setCartItems(cartResponse.data.cartData || {});
                } catch (error) {
                    console.error("Failed to load cart:", error);
                }
            }
        }
        void loadData();
    }, [url])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;