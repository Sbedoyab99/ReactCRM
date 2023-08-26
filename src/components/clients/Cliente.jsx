import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"
import { CRMContext } from "../../context/CRMContext"
import { useContext } from "react"

function Cliente({cliente}) {
  const {_id, nombre, apellido, empresa, email, telefono} = cliente

	const [auth, isAuth] = useContext(CRMContext)

	const eliminarCliente = idCliente => {
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
				clienteAxios.delete(`/clientes/${idCliente}`,  {
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
    <li className="cliente">
        <div className="info-cliente">
            <p className="nombre">{nombre} {apellido}</p>
            <p className="empresa">{empresa}</p>
            <p>{email}</p>
            <p>Tel: {telefono}</p>
        </div>
        <div className="acciones">
            <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                <i className="fas fa-pen-alt"></i>
                Editar Cliente
            </Link>
            <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
                <i className="fas fa-plus"></i>
                Nuevo Pedido
            </Link>
            <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => eliminarCliente(_id)}>
                <i className="fas fa-times"></i>
                Eliminar Cliente
            </button>
        </div>
    </li>
  )
}

export default Cliente