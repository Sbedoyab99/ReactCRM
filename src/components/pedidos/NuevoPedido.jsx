import { useEffect, useState, useContext } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import clienteAxios from "../../config/axios"
import FormBuscarProducto from "./FormBuscarProducto"
import FormCantidad from "./FormCantidad"
import { CRMContext } from "../../context/CRMContext"

function NuevoPedido() {

  const {idCliente} = useParams()
  const history = useNavigate()

  const [cliente, setCliente] = useState({})
  const [busqueda, setBusqueda] = useState('')
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [auth, setAuth] = useContext(CRMContext)

  const consultarAPI = async () => {
    const cliente = await clienteAxios.get(`/clientes/${idCliente}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    setCliente(cliente.data)
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
  }, [])

  useEffect(() => {
    calcularTotal()
  }, [productos])

  const buscarProducto = e => {
    e.preventDefault()
    clienteAxios.post(`/productos/busqueda/${busqueda}`)
      .then(res => {
        if(res.data[0]) {
          let productoResultado = res.data[0]
          productoResultado.producto = res.data[0]._id
          productoResultado.cantidad = 0
          setProductos([...productos, productoResultado])
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No Resultados',
            text: 'No hay resultados para tu busqueda'
          })
        }
      })
  }

  const leerDatosBusqueda = e => {
    setBusqueda(e.target.value)
  }

  const restarProductos = i => {
    const cantidadProductos = [...productos]
    if(cantidadProductos[i].cantidad === 0) return
    cantidadProductos[i].cantidad--
    setProductos(cantidadProductos)
  }

  const sumarProductos = i => {
    const cantidadProductos = [...productos]
    cantidadProductos[i].cantidad++
    setProductos(cantidadProductos)
  }

  const calcularTotal = () => {
    if(productos.length === 0) {
      return setTotal(0)
    }
    let nuevoTotal = 0
    productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio))
    setTotal(nuevoTotal)
  }

  const eliminarProducto = id => {
    Swal.fire({
			title: 'Estas Seguro?',
			text: "No Podras Revertir Esta Operacion",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Estoy Seguro',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {	
        const todosProductos = productos.filter(producto => producto.producto !== id)
        setProductos(todosProductos)
			}
		})
  }

  const realizarPedido = e => {
    e.preventDefault()

    const pedido = {
      "cliente": idCliente,
      "pedido": productos,
      "total": total
    }
    clienteAxios.post('/pedidos', pedido, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: res.data.mensaje
        })
        history('/pedidos')
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un Error',
          text: error.response.data
        })
      })
  }

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>{cliente.nombre} {cliente.apellido}</p>
        <p>Telefono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

        <ul className="resumen">
          {productos.map((producto, index) => (
            <FormCantidad
              key={producto.producto}
              producto={producto}
              restarProductos={restarProductos}
              sumarProductos={sumarProductos}
              eliminarProducto={eliminarProducto}
              index={index}
            />
          ))}
        </ul>
        <p className="total">Total a Pagar: <span>${total}</span></p>
        {total > 0 ? (
          <form onSubmit={realizarPedido}>
            <input type="submit" className="btn btn-verde btn-block" value="Realizar Pedido" />
          </form>
        ) : null}
    </>
  )
}

export default NuevoPedido