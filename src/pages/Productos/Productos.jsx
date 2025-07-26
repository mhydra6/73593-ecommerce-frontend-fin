import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Productos.css";

const API_URL = import.meta.env.VITE_API_URL + "/products"; 

export default function Productos() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log("ID recibido desde URL:", id);
      axios.get(`${API_URL}/${id}`)
        .then(res => {
          console.log("Producto recibido:", res.data);
          setProduct(res.data.product); // Asegúrate que sea res.data.product
        })
        .catch(err => {
          console.error("Error al traer el producto", err);
          setProduct(null);
        });
    }
  }, [id]);

  if (!product) return <p>Cargando producto...</p>;

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto añadido al carrito.");
  };

  return (
    <main>
      <div className="product-detail">
        <div className="box-2">
          <img
            src={product.image?.startsWith("http") ? product.image : "https://via.placeholder.com/300"}
            alt={product.title}
          />
        </div>
        <div className="box-1">
          <h2>{product.title || product.name || "Sin título"}</h2>
          <p><strong>Descripción:</strong> {product.descripcion || product.description || "Sin descripción"}</p>
          <p><strong>Precio:</strong> {product.price ?? "N/A"}</p>
          <p><strong>Status:</strong> {product.status ?? "N/A"}</p>
          <p><strong>Rating:</strong> {product.rating ?? "-"} ⭐</p>
          <p><strong>Reviews:</strong> {product.reviews ?? "-"}</p>

          <div className="quantity-controls" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
            <button onClick={decreaseQuantity} className="quantity-button">-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-button">+</button>
          </div>

          <button className="buy-button">Comprar</button>

          {/* ESTE ES EL BOTÓN CORRECTO */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Añadir al carrito
          </button>

          <br />
          <button className="back-button" onClick={() => navigate("/")}>
            Volver a la tienda
          </button>
        </div>
      </div>
    </main>
  );
}
