import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import Producto from "./Producto"

function Productos() {

  const [productos, setProductos] = useState([])

  const consultarAPI = async () => {
    const productosConsulta = await clienteAxios.get('/productos')
    setProductos(productosConsulta.data)
  }

  useEffect(() => {
    consultarAPI()
  }, [productos])

  return(
    <>
      <h2>Productos</h2>
      <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> 
          <i className="fas fa-plus-circle"></i>
          Nuevo Producto
      </Link>

      <ul className="listado-productos">
          {productos.map(producto => (
            <Producto key={producto._id} producto={producto}/>
          ))}
      </ul>
    </>
  )
}

export default Productos