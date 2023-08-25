import { useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import Pedido from "./Pedido"

function Pedidos() {

  const [pedidos, setPedidos] = useState([])
  
  const consultarAPI = () =>{
    clienteAxios.get('/pedidos')
      .then(res => {
        setPedidos(res.data)
      })
    }

  useEffect(() => {
    consultarAPI()
  }, [pedidos])

  return(
    <>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
          {pedidos.map(pedido => (
            <Pedido 
              key={pedido._id}
              pedido={pedido}
            />
          ))}
      </ul>
    </>
  )
}

export default Pedidos