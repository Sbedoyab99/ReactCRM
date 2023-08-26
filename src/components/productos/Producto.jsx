import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"
import { CRMContext } from "../../context/CRMContext"
import { useContext } from "react"

function Producto({producto}) {
  const {_id, nombre, precio, imagen} = producto

	const [auth, isAuth] = useContext(CRMContext)

  const eliminarProducto = idProducto => {
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
				clienteAxios.delete(`/productos/${idProducto}`, {
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

  return(
    <li className="producto">
        <div className="info-producto">
            <p className="nombre">{nombre}</p>
            <p className="precio">$ {precio} </p>
            {
              imagen ? (<img src={`http://localhost:3000/${imagen}`}/>) : null
            }
        </div>
        <div className="acciones">
            <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
                <i className="fas fa-pen-alt"></i>
                Editar Producto
            </Link>

            <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => eliminarProducto(_id)}>
                <i className="fas fa-times"></i>
                Eliminar Producto
            </button>
        </div>
    </li>
  )
}

export default Producto
