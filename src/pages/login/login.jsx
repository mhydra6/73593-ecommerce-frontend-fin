import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const API_URL = import.meta.env.VITE_API_URL + "/users";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  async function login(authData) {
    try {
      const { data } = await axios.post(`${API_URL}/login`, authData);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      await Swal.fire({
        icon: 'success',
        title: `Bienvenido ${data.user.name}`,
        timer: 1500,
        showConfirmButton: false
      });

      window.location.reload();

      if (data.user.role === "admin") {
        navigate("/adminproductos");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error.response.data.message || 'Credenciales incorrectas'
        });
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo contactar con el servidor. Intenta más tarde.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: error.message || 'Ocurrió un error desconocido'
        });
      }
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email es obligatorio" })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: "Contraseña es obligatoria" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
