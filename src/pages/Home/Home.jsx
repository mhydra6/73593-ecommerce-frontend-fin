import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const URL = import.meta.env.VITE_MOCKAPI_URL;

// Función para convertir string precio a número
function parsePrice(priceStr) {
  if (typeof priceStr === "number") return priceStr;

  if (!priceStr) return 0;

  let clean = priceStr.replace(/[^0-9.,]/g, '');

  if (clean.indexOf('.') > -1 && clean.indexOf(',') > -1) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else {
    clean = clean.replace(',', '.');
  }

  const parsed = parseFloat(clean);

  return isNaN(parsed) ? 0 : parsed;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!URL) {
      setError('URL de la API no está definida');
      setLoading(false);
      return;
    }

    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la respuesta de la API');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error('Error al traer productos:', err);
      });
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.title} agregado al carrito`);
  };

  const handleToggleCart = () => {
    setShowCart((prev) => !prev);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalCart = cart.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <main className="main-container">
      <section className="section-productos">
        <h1 className="h1-products">PRODUCTOS DESTACADOS</h1>
        <button onClick={handleToggleCart}>
          {showCart ? 'Cerrar Carrito' : 'Ver Carrito'} (
          {cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </section>

      {showCart && (
        <div className="cart-inline">
          <h2>Carrito</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong> - Cantidad: {item.quantity} - Precio unitario: ${parsePrice(item.price).toFixed(2)} - Subtotal: ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total: ${totalCart.toFixed(2)}</strong>
              </p>
              <button onClick={handleClearCart}>Vaciar Carrito</button>
            </>
          )}
        </div>
      )}

      <div className="product-container">
        {products.map((product) => (
          <article key={product.id} className="card">
            <div className="card-content">
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.title}
                className="card-image"
              />
              <div className="card-status">{product.status || 'Sin estado'}</div>
              <div className="card-icon-container">
                <div className="icon-circle">
                  <i className="fa-regular fa-heart" />
                </div>
                <div className="icon-circle">
                  <i className="fa-solid fa-layer-group" />
                </div>
                <div
                  className="icon-circle"
                  onClick={() => navigate(`/productos/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-eye" />
                </div>
              </div>
              <button
                className="card-add"
                onClick={() => handleAddToCart(product)}
              >
                Agregar al carrito
              </button>
            </div>
            <div className="card-info">
              <h3 className="card-title">{product.title || 'Producto sin título'}</h3>
              <div className="card-rate">
                <div className="card-icon">{'⭐'.repeat(product.rating || 0)}</div>
                <div className="card-review">({product.reviews || 0} reviews)</div>
              </div>
              <div className="card-price">{product.price || 'Precio no disponible'}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
