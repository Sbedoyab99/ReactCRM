import clienteAxios from "../../config/axios"
import Cliente from "./Cliente"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CRMContext } from "../../context/CRMContext"

function Clientes() {

  const history = useNavigate()

  async function consultarAPI () {
    const clientesConsulta = await clienteAxios.get('/clientes', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    setClientes(clientesConsulta.data)
  }

  const [clientes, setClientes] = useState([])
  const [auth, setAuth] = useContext(CRMContext)

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
  }, [clientes])

  return(
    <>
      <h2>Clientes</h2>
      <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
          Nuevo Cliente
      </Link>
      <ul className="listado-clientes">
        {clientes.map(cliente => (
          <Cliente
            key={cliente._id}
            cliente={cliente}
          />
        ))}
      </ul>
    </>
  )
}

export default Clientes