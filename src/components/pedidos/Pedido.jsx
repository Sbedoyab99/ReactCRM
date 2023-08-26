import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"
import { Link } from "react-router-dom"
import { CRMContext } from "../../context/CRMContext"
import { useContext } from "react"

function Pedido ({pedido}) {

	const [auth, setAuth] = useContext(CRMContext)

  const completarPedido = idPedido => {
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
				clienteAxios.delete(`/pedidos/${idPedido}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
					.then(res => {
						Swal.fire(
							'Eliminado!',
							res.data.mensaje,
							'success'
						)
					})
					.catch(error => {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: error.response.data,
						})
					})
			}
		})
	}

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido._id}</p>
        <p className="nombre">Cliente: {pedido.cliente.nombre} {pedido.cliente.apellido}</p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {pedido.pedido.map(articulo => (
              <li key={articulo.producto._id}>
                <p>{articulo.producto.nombre}</p>
                <p>Precio: ${articulo.producto.precio}</p>
                <p>Cantidad: {articulo.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: ${pedido.total} </p>
      </div>
      <div className="acciones">
				<Link to={`/pedidos/editar/${pedido._id}`} className="btn btn-azul">
					<i className="fas fa-pen-alt"></i>
					Editar Pedido
				</Link>
        <button type="button" className="btn btn-verde btn-eliminar" onClick={() => completarPedido(pedido._id)}>
          <i className="fas fa-check"></i>
          Completar Pedido
        </button>
      </div>
    </li>
  )
}

export default Pedido