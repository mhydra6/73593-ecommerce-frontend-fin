// src/context/useOrder.js (o ajustá la ruta según tu estructura)

import { useContext } from "react";
import { OrderContext } from "./OrderContext";

// Custom hook para usar el contexto del carrito/pedidos
export const useOrder = () => {
  return useContext(OrderContext);
};