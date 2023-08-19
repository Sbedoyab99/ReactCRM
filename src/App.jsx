import Header from "./components/layout/Header"
import Navegacion from "./components/layout/Navegacion"
import Clientes from "./components/clients/Clientes"
import Pedidos from "./components/pedidos/Pedidos"
import Productos from "./components/productos/Productos"
import NuevoCliente from "./components/clients/NuevoCliente"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <>
        <Header/>
        <div className="grid contenedor contenido-principal">
          <Navegacion/>
          <main className="caja-contenido col-9">
            {/* TODO: Routing a los componentes */}
            <Routes>
              <Route path="/" element={<Clientes/>}/>
              <Route path="/clientes/nuevo" element={<NuevoCliente/>}/>
              <Route path="/productos" element={<Productos/>}/>
              <Route path="/pedidos" element={<Pedidos/>}/>
            </Routes>
          </main>
        </div>
      </>
    </BrowserRouter>
  )
}

export default App
