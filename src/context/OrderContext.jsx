import { createContext, useState } from "react";

export const OrderContext = createContext(); 

export default function OrderProvider({ children }) {
const [order, setOrder] = useState([]);
const [count, setCount] = useState(0);
const [total, setTotal] = useState(0);
const [allOrders, setAllOrders] = useState([]);

const addItemToOrder = (product) => {
    const exist = order.find((item) => item._id === product._id);
    let newOrder;
    if (exist) {
    newOrder = order.map((item) =>
        item._id === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    } else {
    newOrder = [...order, { ...product, quantity: 1 }];
    }
    setOrder(newOrder);
    updateCountAndTotal(newOrder);
};

const clearOrder = () => {
    setOrder([]);
    setCount(0);
    setTotal(0);
};

const updateCountAndTotal = (orderItems) => {
    const newCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const newTotal = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
    0
    );
    setCount(newCount);
    setTotal(newTotal);
};

const createOrder = async (userId, token) => {
    try {
    const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        userId,
        items: order.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
        })),
        total,
        }),
    });

    if (!response.ok) throw new Error("Error creando orden");

    const data = await response.json();
    console.log("Orden creada:", data);

    const allOrdersRes = await fetch("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
    });

    const orderList = await allOrdersRes.json();
    console.log("Órdenes actuales:", orderList);
    setAllOrders(orderList);

    clearOrder();
    } catch (error) {
    console.error(error.message);
    }
};

return (
    <OrderContext.Provider
    value={{
        order,
        count,
        total,
        allOrders,
        addItemToOrder,
        clearOrder,
        createOrder,
    }}
    >
    {children}
    </OrderContext.Provider>
);
}

