import { useState, useEffect, useContext } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import clienteAxios from "../../config/axios"
import FormBuscarProducto from "./FormBuscarProducto"
import FormCantidadEditar from "./FormCantidadEditar"
import { CRMContext } from "../../context/CRMContext"


function EditarPedido() {

  const history = useNavigate()
  const {idPedido} = useParams()
  const [pedido, setPedido] = useState({
    id: '',
    cliente: {},
    pedido: [],
    total: 0
  })
  const [busqueda, setBusqueda] = useState('')
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [auth, setAuth] = useContext(CRMContext)

  const consultarAPI = async () => {
    const pedidoConsulta = await clienteAxios.get(`/pedidos/${idPedido}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    setPedido(pedidoConsulta.data)
    setProductos(pedidoConsulta.data.pedido)
    setTotal(pedidoConsulta.data.total)
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
          let productoResultado = {}
          productoResultado.producto = res.data[0]
          productoResultado._id = res.data[0]._id
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
    productos.map(producto => nuevoTotal += (producto.cantidad * producto.producto.precio))
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
        const todosProductos = productos.filter(producto => producto._id !== id)
        setProductos(todosProductos)
			}
		})
  }

  const guardarCambios = e => {
    e.preventDefault()

    const pedidoActualizado = {
      "cliente": pedido.cliente._id,
      "pedido": productos,
      "total": total
    }
    clienteAxios.put(`/pedidos/${idPedido}`, pedidoActualizado, {
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
      <h2>Editar Pedido</h2>
      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</p>
        <p>Telefono: {pedido.cliente?.telefono}</p>
      </div>
      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />
      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadEditar
            key={producto._id}
            producto={producto.producto}
            restarProductos={restarProductos}
            sumarProductos={sumarProductos}
            eliminarProducto={eliminarProducto}
            index={index}
            cantidad={producto.cantidad}
          />
        ))}
      </ul>
      <p className="total">Total a Pagar: <span>${total}</span></p>
        {total > 0 ? (
          <form onSubmit={guardarCambios}>
            <input type="submit" className="btn btn-verde btn-block" value="Guardar Cambios" />
          </form>
        ) : null}
    </>
  )
}

export default EditarPedido