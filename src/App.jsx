import { Route, Routes } from "react-router-dom";
import Footer from "./layout/Footer/Footer";
import Header from "./layout/Header/Header";
import AcercaDe from "./pages/Acercade/AcercaDe";
import AdminContacto from "./pages/AdminContactos/AdminContacto";
import AdminProductos from "./pages/AdminProductos/AdminProductos";
import Contacto from "./pages/Contacto/Contacto";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Productos from "./pages/Productos/Productos";
import Login from "./pages/login/login";


const URL= import.meta.env.VITE_MOCKAPI_URL;

export default function App() {
    return <>
      <Header />
      <main className="main-container">


        <Routes>
          <Route path="/" element= {<Home />}/>
          <Route path="/home" element={<Home />} /> 
          <Route path="/Contacto" element= {<Contacto />}/>
          <Route path="/AcercaDe" element= {<AcercaDe />}/>
          <Route path="/Login" element = {<Login />} />
          <Route path="/admincontacto" element={<AdminContacto />} />
          <Route path="/AdminProductos" element= {<AdminProductos />}/>
          <Route path="/Register" element= {<Register />}/>
          <Route path="/productos/:id" element={<Productos />} />
        </Routes>


      </main>

      <Footer />
    </>

}