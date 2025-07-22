import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_SERVER_API;

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  async function login(authData) {
    try {
      const { data } = await axios.post(`${API_URL}/login`, authData);

      // Guardamos el usuario completo (con role, name, etc)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
await Swal.fire({
  icon: 'success',
  title: `Bienvenido ${data.user.name}`,
  timer: 1500,
  showConfirmButton: false
});

window.location.reload(); // se ejecuta después del Swal

      // Redirige según su rol
      if (data.user.role === "admin") {
        navigate("/adminproductos");
      } else {
        navigate("/home");
      }

    } catch (error) {
      if (error.response) {
        // Error del servidor (401, 403, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error.response.data.message || 'Credenciales incorrectas'
        });
      } else if (error.request) {
        // No hubo respuesta del servidor
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo contactar con el servidor. Intenta más tarde.'
        });
      } else {
        // Otro tipo de error
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: error.message || 'Ocurrió un error desconocido'
        });
      }
    }
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(login)}>
        <p>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email es obligatorio" })}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        </p>
        <p>
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: "Contraseña es obligatoria" })}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        </p>
        <p>
          <button className="btn" type="submit">Login</button>
        </p>
      </form>
    </div>
  );
}
