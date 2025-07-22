import { useContext } from "react";
import { OrderContext } from "./OrderContext"; // Asegurate de que el path sea correcto

export const useOrder = () => useContext(OrderContext);
