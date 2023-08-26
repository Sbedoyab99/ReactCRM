import { useContext, useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import Pedido from "./Pedido"
import { CRMContext } from "../../context/CRMContext"


function Pedidos() {

  const [pedidos, setPedidos] = useState([])

  const [auth, setAuth] = useContext(CRMContext)
  
  const consultarAPI = () =>{
    clienteAxios.get('/pedidos', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
      .then(res => {
        setPedidos(res.data)
      })
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