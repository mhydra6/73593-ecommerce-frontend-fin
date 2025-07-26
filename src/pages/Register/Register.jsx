import React, { useState } from "react";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9]{4}$/;
    if (!passwordRegex.test(password)) {
      alert("La contraseña debe tener exactamente 4 caracteres alfanuméricos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoUsuario = {
      name: formData.get("name"),
      email,
      password,
      birthdate: formData.get("birthdate"),
      country: formData.get("country"),
      observations: formData.get("observations"),
      role: formData.get("role"), // ← ← ← Nuevo: el rol elegido
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        alert("Usuario registrado correctamente");
        e.target.reset();
      } else {
        const err = await res.json();
        alert("Error al registrar: " + err.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <main>
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>REGISTRARSE</h1>

        <label htmlFor="name">Nombre Completo</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={50}
          pattern="^[A-Za-zÀ-ÿ\s]+$"
          placeholder="Ej: Juan Pérez"
        />

        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={100}
          placeholder="Ej: correo@ejemplo.com"
        />

        <label htmlFor="password">Contraseña</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            maxLength={4}
            pattern="[a-zA-Z0-9]{4}"
            placeholder="4 caracteres alfanuméricos"
          />
          <label className="eye-icon">
            <input
              type="checkbox"
              onClick={() => setShowPassword(!showPassword)}
            />
            <i className="fa-solid fa-eye" />
          </label>
        </div>

        <label htmlFor="confirm-password">Repetir Contraseña</label>
        <div className="password-container">
          <input
            type={showConfirm ? "text" : "password"}
            id="confirm-password"
            name="confirm-password"
            required
            maxLength={4}
            pattern="[a-zA-Z0-9]{4}"
            placeholder="Repite la contraseña"
          />
          <label className="eye-icon">
            <input
              type="checkbox"
              onClick={() => setShowConfirm(!showConfirm)}
            />
            <i className="fa-solid fa-eye" />
          </label>
        </div>

        <label htmlFor="birthdate">Fecha de Nacimiento</label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          required
        />

        <label htmlFor="country">País</label>
        <select id="country" name="country" required defaultValue="">
          <option value="" disabled>Elija País</option>
          <option value="argentina">Argentina</option>
          <option value="chile">Chile</option>
          <option value="uruguay">Uruguay</option>
          {/* + Países */}
        </select>

        <label htmlFor="role">Rol</label>
        <select id="role" name="role" required>
          <option value="client">cliente</option>
          <option value="employee">empleado</option>
          <option value="admin">admin</option>
        </select>

        <label htmlFor="observations">Observaciones</label>
        <textarea
          id="observations"
          name="observations"
          rows={4}
          placeholder="Escribe tus observaciones aquí..."
        />

        <button type="submit">Registrarse</button>
      </form>
    </main>
  );
}
