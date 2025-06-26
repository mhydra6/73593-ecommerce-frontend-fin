import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import "./Header.css";
import "./slider.css";

export default function Header() {
  useEffect(() => {
    const slides = document.querySelectorAll('input[name="slider"]');
    let current = 0;

    const interval = setInterval(() => {
      current = (current + 1) % slides.length;
      slides[current].checked = true;
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval); // limpieza al desmontar
  }, []);

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
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">PRINCIPAL</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Productos">PRODUCTOS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">REGISTRO</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">CONTACTO</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Acercade">NUESTRA EMPRESA</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/adminproductos">ADMIN PRODUCTOS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admincontacto">ADMIN USUARIOS</NavLink>
            </li>
          </ul>
        </nav>
        <div className="user-info">
          <div className="cart-container">
            <i className="fa-solid fa-cart-shopping" />
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