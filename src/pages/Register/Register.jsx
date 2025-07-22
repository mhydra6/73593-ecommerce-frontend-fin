import React, { useState } from "react";
import "./Register.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const MOCKAPI_URL = "https://685b755e89952852c2d9975f.mockapi.io/usuarios";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Validar que password y confirm-password coincidan
    if (formData.get("password") !== formData.get("confirm-password")) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Crear objeto con los datos a enviar
    const nuevoUsuario = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      birthdate: formData.get("birthdate"),
      country: formData.get("country"),
      observations: formData.get("observations"),
    };

    try {
      const res = await fetch(MOCKAPI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        alert("Usuario registrado correctamente");
        e.target.reset();
      } else {
        alert("Error al registrar el usuario");
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
        />

        <label htmlFor="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required maxLength={100} />

        <label htmlFor="password">Contraseña</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            minLength={8}
            maxLength={20}
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
            minLength={8}
            maxLength={20}
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
        <input type="date" id="birthdate" name="birthdate" required />

        <label htmlFor="country">País</label>
        <select id="country" name="country" required defaultValue="">
          <option value="" disabled>
            Elija País
          </option>
          <option value="alemania">Alemania</option>
          <option value="argentina">Argentina</option>
          <option value="australia">Australia</option>
          <option value="austria">Austria</option>
          <option value="belgica">Bélgica</option>
          <option value="bolivia">Bolivia</option>
          <option value="brasil">Brasil</option>
          <option value="canada">Canadá</option>
          <option value="chile">Chile</option>
          <option value="colombia">Colombia</option>
          <option value="corea_del_sur">Corea del Sur</option>
          <option value="costa_rica">Costa Rica</option>
          <option value="dinamarca">Dinamarca</option>
          <option value="ecuador">Ecuador</option>
          <option value="egipto">Egipto</option>
          <option value="el_salvador">El Salvador</option>
          <option value="emiratos_arabes">Emiratos Árabes Unidos</option>
          <option value="españa">España</option>
          <option value="estados_unidos">Estados Unidos</option>
          <option value="filipinas">Filipinas</option>
          <option value="finlandia">Finlandia</option>
          <option value="francia">Francia</option>
          <option value="grecia">Grecia</option>
          <option value="guatemala">Guatemala</option>
          <option value="honduras">Honduras</option>
          <option value="hungria">Hungría</option>
          <option value="india">India</option>
          <option value="indonesia">Indonesia</option>
          <option value="irlanda">Irlanda</option>
          <option value="israel">Israel</option>
          <option value="italia">Italia</option>
          <option value="jamaica">Jamaica</option>
          <option value="japon">Japón</option>
          <option value="mexico">México</option>
          <option value="marruecos">Marruecos</option>
          <option value="noruega">Noruega</option>
          <option value="nueva_zelanda">Nueva Zelanda</option>
          <option value="panama">Panamá</option>
          <option value="paraguay">Paraguay</option>
          <option value="peru">Perú</option>
          <option value="polonia">Polonia</option>
          <option value="portugal">Portugal</option>
          <option value="reino_unido">Reino Unido</option>
          <option value="republica_dominicana">República Dominicana</option>
          <option value="sudafrica">Sudáfrica</option>
          <option value="suecia">Suecia</option>
          <option value="suiza">Suiza</option>
          <option value="tailandia">Tailandia</option>
          <option value="turquia">Turquía</option>
          <option value="uruguay">Uruguay</option>
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
