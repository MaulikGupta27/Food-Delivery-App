import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { StoreContext } from "./storeContext";

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
    }, []);

    // Global interceptor: automatically clean up stale/expired JWT tokens on 401
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    const reqUrl = error.config?.url || "";
                    const isLoginOrRegister = reqUrl.includes("/api/user/login") || reqUrl.includes("/api/user/register");
                    if (!isLoginOrRegister) {
                        console.warn("Session expired or token invalid (401). Clearing token.");
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [logout]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(
                    url + "/api/cart/add",
                    { itemId },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Failed to add cart item:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
        if (token) {
            try {
                await axios.post(
                    url + "/api/cart/remove",
                    { itemId },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Failed to remove cart item:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    useEffect(() => {
        async function loadData() {
            try {
                const foodResponse = await axios.get(url + "/api/food/list");
                setFoodList(foodResponse.data.data || []);
            } catch (err) {
                console.error("Failed to load food list:", err);
            }

            const localToken = localStorage.getItem("token");
            if (localToken) {
                try {
                    const cartResponse = await axios.post(
                        url + "/api/cart/get",
                        {},
                        { headers: { token: localToken } }
                    );
                    setCartItems(cartResponse.data.cartData || {});
                    setToken(localToken);
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.warn("Stored token is invalid or expired. Removing.");
                        logout();
                    }
                }
            }
        }
        void loadData();
    }, [url, logout]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        logout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
