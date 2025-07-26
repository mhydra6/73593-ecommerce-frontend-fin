import React, { useState, useEffect, useContext } from 'react';
import './Home.css';
import './CartPopup.css';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../../context/OrderContext';

const API_URL = import.meta.env.VITE_API_URL;

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  let clean = priceStr.replace(/[^0-9.,]/g, '');
  if (clean.includes('.') && clean.includes(',')) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else {
    clean = clean.replace(',', '.');
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(price);
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const { cart, addToCart, clearCart, createOrder, removeFromCart } = useContext(OrderContext);

  useEffect(() => {
    if (!API_URL) {
      setError('La URL de la API no está definida');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la respuesta de la API');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error('Error al traer productos:', err);
      });
  }, []);

  const handleAddToCart = (product) => {
    const parsedPrice = parsePrice(product.price);
    const updatedProduct = {
      ...product,
      price: parsedPrice,
    };
    addToCart(updatedProduct);
    setShowCart(true);
  };

  const handleToggleCart = () => setShowCart((prev) => !prev);
  const handleClearCart = () => clearCart();
  const handleClose = () => setShowCart(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCart = cart.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="main-container">
      {/* Ícono del carrito */}
      <div className="cart-icon-wrapper" onClick={handleToggleCart} aria-label="Abrir carrito">
        <i className="fa-solid fa-cart-shopping" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>

      {/* Carrito emergente */}
      {showCart && (
        <div className="cart-popup" role="dialog" aria-modal="true">
          <h3>🛒 Carrito</h3>
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.productId} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
                    <p><strong>Título:</strong> {item.title}</p>
                    <p><strong>Cantidad:</strong> {item.quantity}</p>
                    <p><strong>Precio unitario:</strong> {formatPrice(item.price)}</p>
                    <p><strong>Subtotal:</strong> {formatPrice(parsePrice(item.price) * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.productId)}>❌ Quitar</button>
                  </li>
                ))}
              </ul>

              <p className="cart-total">Total: {formatPrice(totalCart)}</p>

              <button className="clear-cart-btn" onClick={handleClearCart}>Vaciar carrito</button>
              <button className="send-order-btn" onClick={() => createOrder(cart)}>Enviar pedido</button>
              <button className="close-cart-btn" onClick={handleToggleCart}>Cerrar</button>
            </>
          )}
          <button className="close-btn" onClick={handleClose}>✖</button>
        </div>
      )}

      {/* Sección de productos */}
      <section className="section-productos">
        <h1 className="h1-products">PRODUCTOS DESTACADOS</h1>
      </section>

      <div className="product-container">
        {products.map((product) => (
          <article key={product._id || product.id} className="card">
            <div className="card-content">
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.title}
                className="card-image"
              />
              <div className="card-status">{product.status || 'Sin estado'}</div>
              <div className="card-icon-container">
                <div className="icon-circle"><i className="fa-regular fa-heart" /></div>
                <div className="icon-circle"><i className="fa-solid fa-layer-group" /></div>
                <div
                  className="icon-circle"
                  onClick={() => navigate(`/productos/${product._id || product.id}`)}
                >
                  <i className="fa-regular fa-eye" />
                </div>
              </div>
              <button className="card-add" onClick={() => handleAddToCart(product)}>
                Agregar al carrito
              </button>
            </div>
            <div className="card-info">
              <h3 className="card-title">{product.title || 'Producto sin título'}</h3>
              <div className="card-rate">
                <div className="card-icon">{'⭐'.repeat(product.rating || 0)}</div>
                <div className="card-review">({product.reviews || 0} reviews)</div>
              </div>
              <div className="card-price">
                {formatPrice(parsePrice(product.price))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
