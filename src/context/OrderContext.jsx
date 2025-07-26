import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

const API_URL = import.meta.env.VITE_API_URL;

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const productId = product._id || product.id;

    const exists = cart.find((item) => item.productId === productId);

    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId,
          title: product.title || "Producto sin título",
          price: Number(product.price),
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const createOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        Swal.fire("Error", "Debes iniciar sesión para hacer un pedido", "error");
        return;
      }

      const transformedProducts = cart.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const total = transformedProducts.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      const orderData = {
        userId: user._id,
        userName: user.name,
        products: transformedProducts,
        total,
      };

      // POST: Crear la orden
      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ GET: Mostrar órdenes en consola después del POST
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Órdenes actuales:", response.data);

      Swal.fire("Éxito", "Pedido enviado correctamente", "success");
      clearCart();
    } catch (error) {
      console.error("Error al crear orden:", error.response?.data || error.message);
      Swal.fire("Error", "No se pudo enviar el pedido", "error");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext };
