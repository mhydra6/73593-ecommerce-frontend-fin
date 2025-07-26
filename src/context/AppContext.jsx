import React, { createContext, useState, useEffect, useContext } from "react";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export default function OrderProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const storedCart = JSON.parse(localStorage.getItem("cart"));

    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
    if (storedCart) setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.productId === product._id);
      if (exists) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  const clearCart = () => setCart([]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
  };

  return (
    <OrderContext.Provider
      value={{
        user,
        token,
        cart,
        addToCart,
        clearCart,
        setUser,
        setToken,
        logout,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
