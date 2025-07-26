import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "./AdminProductos.css";

const API_URL = import.meta.env.VITE_API_URL + "/products";

export default function AdminProductos() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    descripcion: "",
    ingreso: "",
    categoria: "",
    rating: "",
    reviews: "",
    status: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [modalDescription, setModalDescription] = useState(null);
  const formRef = useRef(null);

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.products);
    } catch (error) {
      Swal.fire("Error", "Error al obtener productos: " + error.message, "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else if (name === "reviews") {
      if (value === "" || /^[0-9]*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const formatPriceDisplay = (price) => {
    const number = parseFloat(price);
    if (isNaN(number)) return price;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  // ✅ Corrige puntos de miles y coma decimal
  function normalizePrice(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      price,
      image,
      descripcion,
      ingreso,
      categoria,
      rating,
      reviews,
      status
    } = form;

    if (
      !title || !price || !image || !descripcion || !ingreso ||
      !categoria || rating === "" || reviews === "" || !status
    ) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios", "warning");
      return;
    }

    const priceNumber = normalizePrice(price);
    if (isNaN(priceNumber)) {
      Swal.fire("Precio inválido", "Ingresá un precio correcto", "error");
      return;
    }
    const ingresoTimestamp = ingreso
  ? Math.floor(new Date(ingreso).getTime() / 1000)
  : null;

if (!ingresoTimestamp || isNaN(ingresoTimestamp)) {
  Swal.fire("Error", "Ingresá una fecha válida", "error");
  return;
}
    const data = {
      title,
      price: priceNumber,
      image,
      descripcion,
      ingreso: ingresoTimestamp,
      categoria,
      rating: parseFloat(rating),
      reviews: parseInt(reviews, 10),
      status
    };

    try {
      if (editingId) {
        await axiosAuth.put(`${API_URL}/${editingId}`, data);
        Swal.fire("Actualizado", "Producto actualizado con éxito", "success");
        setEditingId(null);
      } else {
        await axiosAuth.post(API_URL, data);
        Swal.fire("Creado", "Producto creado con éxito", "success");
      }

      setForm({
        title: "",
        price: "",
        image: "",
        descripcion: "",
        ingreso: "",
        categoria: "",
        rating: "",
        reviews: "",
        status: ""
      });

      fetchProducts();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await axiosAuth.delete(`${API_URL}/${id}`);
        Swal.fire("Eliminado", "Producto eliminado", "success");
        fetchProducts();
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || error.message, "error");
      }
    }
  };

  const handleEdit = (product) => {
    if (!product) return;

    setForm({
      title: product.title || "",
      price: product.price?.toString() || "",
      image: product.image || "",
      descripcion: product.descripcion || "",
ingreso: (product.ingreso && !isNaN(product.ingreso))
  ? new Date(Number(product.ingreso) * 1000).toISOString().split("T")[0]
  : "",

      categoria: product.categoria || "",
      rating: product.rating?.toString() || "",
      reviews: product.reviews?.toString() || "",
      status: product.status || ""
    });

    setEditingId(product.id);
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openModal = (desc) => setModalDescription(desc);
  const closeModal = () => setModalDescription(null);

  const recortarDescripcion = (desc) => {
    const texto = desc || "";
    const palabras = texto.split(" ");
    if (palabras.length <= 20) return texto;
    return palabras.slice(0, 20).join(" ") + "...";
  };

  return (
    <main>
      <h1>ADMINISTRADOR DE PRODUCTOS</h1>

      {editingId && <p style={{ color: "green" }}>Editando producto ID: {editingId}</p>}

      <form onSubmit={handleSubmit} className="form-container" ref={formRef}>
        <input type="text" name="title" placeholder="Nombre del producto" value={form.title} onChange={handleChange} />
        <input type="text" name="price" placeholder="Precio (ej: 2.300,50)" value={form.price} onChange={handleChange} />
        <input type="url" name="image" placeholder="URL de la imagen" value={form.image} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input type="date" name="ingreso" value={form.ingreso} onChange={handleChange} />
        <select name="categoria" value={form.categoria} onChange={handleChange}>
          <option value="">Selecciona categoría</option>
          <option value="Novela">Novela</option>
          <option value="Historia">Historia</option>
          <option value="Filosofía">Filosofía</option>
          <option value="Infantil">Infantil</option>
          <option value="Otros">Otros</option>
        </select>
        <input type="number" step="0.1" min="0" max="5" name="rating" placeholder="Rating (0 a 5)" value={form.rating} onChange={handleChange} />
        <input type="number" min="0" name="reviews" placeholder="Número de reviews" value={form.reviews} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="">Selecciona estado</option>
          <option value="Disponible">Disponible</option>
          <option value="Sin Stock">Sin Stock</option>
        </select>
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setForm({
              title: "",
              price: "",
              image: "",
              descripcion: "",
              ingreso: "",
              categoria: "",
              rating: "",
              reviews: "",
              status: ""
            });
          }} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>IMAGEN</th>
            <th>PRODUCTO</th>
            <th>DESCRIPCIÓN</th>
            <th>INGRESO</th>
            <th>PRECIO</th>
            <th>RATING</th>
            <th>REVIEWS</th>
            <th>STATUS</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const descTexto = product.descripcion || "";
            const isLongDesc = descTexto.split(" ").length > 20;

            return (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.title} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                </td>
                <td>{product.title}</td>
                <td className="descripcion-cell">
                  <div>{recortarDescripcion(descTexto)}</div>
                  {isLongDesc && (
                    <button className="ver-mas-btn" onClick={() => openModal(descTexto)}>Ver más</button>
                  )}
                </td>
                <td>
                  {product.ingreso && !isNaN(product.ingreso)
                    ? new Date(Number(product.ingreso) * 1000).toLocaleDateString("es-AR")
                    : "Sin fecha"}
                </td>
                <td>{formatPriceDisplay(product.price)}</td>
                <td>{product.rating ?? "-"}</td>
                <td>{product.reviews ?? "-"}</td>
                <td>{product.status ?? "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)} title="Editar">
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)} title="Eliminar">
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalDescription && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Descripción completa</h2>
            <p>{modalDescription}</p>
            <button onClick={closeModal} className="close-modal-btn">Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}
