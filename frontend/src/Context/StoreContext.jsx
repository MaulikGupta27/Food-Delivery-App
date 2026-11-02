import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { StoreContext } from "./storeContext";

const StoreContextProvider = (props) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);

    // Initialize cart from localStorage so guest cart survives reloads & logins
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("cartItems");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Keep localStorage in sync with cartItems
    useEffect(() => {
        try {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (e) {
            console.error("Failed to persist cart:", e);
        }
    }, [cartItems]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
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

    // Merges guest cart with server cart when user signs in
    const syncCartWithServer = useCallback(async (userToken) => {
        const activeToken = userToken || token;
        if (!activeToken) return;

        try {
            const currentLocalCart = { ...cartItems };

            // 1. Get existing server cart
            const cartResponse = await axios.post(
                url + "/api/cart/get",
                {},
                { headers: { token: activeToken } }
            );
            const serverCart = cartResponse.data.cartData || {};

            // 2. Merge local guest items with server items
            const mergedCart = { ...serverCart };

            for (const itemId in currentLocalCart) {
                const localQty = currentLocalCart[itemId] || 0;
                if (localQty > 0) {
                    const serverQty = mergedCart[itemId] || 0;
                    if (localQty > serverQty) {
                        const diff = localQty - serverQty;
                        // Push missing quantities to server
                        for (let i = 0; i < diff; i++) {
                            await axios.post(
                                url + "/api/cart/add",
                                { itemId },
                                { headers: { token: activeToken } }
                            );
                        }
                        mergedCart[itemId] = localQty;
                    }
                }
            }

            setCartItems(mergedCart);
            localStorage.setItem("cartItems", JSON.stringify(mergedCart));
            return mergedCart;
        } catch (err) {
            console.error("syncCartWithServer error:", err);
        }
    }, [cartItems, token, url]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

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
        setCartItems((prev) => {
            const updated = { ...prev };
            if (updated[itemId] > 1) {
                updated[itemId] -= 1;
            } else {
                delete updated[itemId];
            }
            return updated;
        });

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
                    const serverCart = cartResponse.data.cartData || {};
                    // Merge rather than completely overwriting
                    setCartItems((prev) => {
                        const merged = { ...serverCart, ...prev };
                        return Object.keys(merged).length > 0 ? merged : serverCart;
                    });
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
        logout,
        syncCartWithServer
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
