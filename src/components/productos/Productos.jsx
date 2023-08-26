import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import Producto from "./Producto"
import { CRMContext } from "../../context/CRMContext"

function Productos() {

  const [auth, setAuth] = useContext(CRMContext)

  const [productos, setProductos] = useState([])

  const consultarAPI = async () => {
    const productosConsulta = await clienteAxios.get('/productos', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    setProductos(productosConsulta.data)
  }

  useEffect(() => {
    if(auth.token !== '') {
      try {
        consultarAPI()
      } catch (error) {
        if(error.response.status === 500) {
          history('/login')
        }
      }
    } else {
      history('/login')
    }
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