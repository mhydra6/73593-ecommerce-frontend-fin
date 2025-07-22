import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";
import "./slider.css";
import { useOrder } from "../../context/useOrder"; // ajustá la ruta si tu estructura cambia


export default function Header() {
  const [user, setUser] = useState(null);
  const { count, total } = useOrder();


  // Obtener el usuario del localStorage al cargar
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  // Slider automático
  useEffect(() => {
    const slides = document.querySelectorAll('input[name="slider"]');
    let current = 0;

    const interval = setInterval(() => {
      current = (current + 1) % slides.length;
      slides[current].checked = true;
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Logout
  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/home"; // redirecciona
  }

  return (
    <>
      <header className="main-header">
        <input className="input-burger" type="checkbox" id="burger" />
        <label className="burger-container" htmlFor="burger">
          <div className="burger" />
        </label>

        <div className="logo">
          <a href="/">
            <img
              className="nav-logo"
              src="/src/assets/Images/Logo/logo.jpg"
              alt="Logo de la empresa"
            />
          </a>
        </div>

        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item"><NavLink className="nav-link" to="/home">PRINCIPAL</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">PRODUCTOS</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/register">REGISTRO</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">CONTACTO</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/acercade">NUESTRA EMPRESA</NavLink></li>

            {user?.role === "admin" && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/adminproductos">ADMIN PRODUCTOS</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admincontacto">ADMIN USUARIOS</NavLink></li>
              </>
            )}
          </ul>
        </nav>

        <div className="user-info">
          <div>
            {user ? (
              <>
                <span className="nav-link">Hola, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-logout">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="nav-link">LOGIN</NavLink>
            )}
          </div>
          <div className="cart-container">
            <i className="fa-solid fa-cart-shopping" />
            <span className="cart-info"> {count} - ${total}</span>
          </div>
          <div className="picture-container">
            <img
              className="user-picture"
              src="/src/assets/Images/User Icon/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp"
              alt="User avatar"
            />
          </div>
        </div>
      </header>

      <section className="section-banner1">
        <div className="slider">
          <input type="radio" name="slider" id="slide-1" defaultChecked />
          <input type="radio" name="slider" id="slide-2" />
          <input type="radio" name="slider" id="slide-3" />

          <div className="slider-content">
            <div className="slide">
              <img src="/src/assets/Images/Carrousel/5 (5).png" alt="Slide 1" />
            </div>
            <div className="slide">
              <img src="/src/assets/Images/Carrousel/6 (3).png" alt="Slide 2" />
            </div>
            <div className="slide">
              <img src="/src/assets/Images/Carrousel/6 (5).png" alt="Slide 3" />
            </div>
          </div>

          <div className="slider-buttons">
            <label htmlFor="slide-1"></label>
            <label htmlFor="slide-2"></label>
            <label htmlFor="slide-3"></label>
          </div>
        </div>
      </section>
    </>
  );
}
