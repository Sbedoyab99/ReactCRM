import clienteAxios from "../../config/axios"
import Cliente from "./Cliente"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Clientes() {

  async function consultarAPI () {
    const clientesConsulta = await clienteAxios.get('/clientes')
    setClientes(clientesConsulta.data)
  }

  const [clientes, setClientes] = useState([])

  useEffect(() => {
    consultarAPI()
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