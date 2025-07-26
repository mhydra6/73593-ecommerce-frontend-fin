import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./AdminContacto.css";

export default function AdminContacto() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch("http://localhost:3000/users");
        if (!res.ok) throw new Error(`Error al cargar usuarios: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data.users)) throw new Error("Respuesta inesperada del servidor");
        setUsuarios(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  const handleEditClick = (usuario) => {
    setEditUserId(usuario._id);
    setEditFormData({
      name: usuario.name || "",
      email: usuario.email || "",
      role: usuario.role || "client"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar usuario");
      }

      const result = await res.json();
      const updatedUser = result.user; // ✅ Extraer solo el usuario

      setUsuarios((prev) =>
        prev.map((usuario) => (usuario._id === id ? updatedUser : usuario))
      );
      setEditUserId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelClick = () => {
    setEditUserId(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("¿Estás seguro de que querés eliminar este usuario?")) {
      try {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al eliminar usuario");
        }

        setUsuarios((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-contacto-container">
      <div className="header-actions">
        <h2>Lista de Usuarios Registrados</h2>
        <NavLink to="/register" className="btn-new-user">
          Nuevo Usuario
        </NavLink>
      </div>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) =>
              editUserId === usuario._id ? (
                <tr key={usuario._id}>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleInputChange}
                    >
                      <option value="client">Cliente</option>
                      <option value="employee">Empleado</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleSaveClick(usuario._id)}>
                      Guardar
                    </button>
                    <button className="delete-btn" onClick={handleCancelClick}>
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={usuario._id}>
                  <td>{usuario.name}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(usuario)}>
                      Editar
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(usuario._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
