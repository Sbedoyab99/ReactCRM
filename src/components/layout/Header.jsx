import { useContext } from "react"
import { CRMContext } from "../../context/CRMContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Header = () => {

  const history = useNavigate()

  const [auth, setAuth] = useContext(CRMContext)
  
  const cerrarSesion = () => {
    Swal.fire({
			title: 'Estas Seguro?',
			text: "Deseas Cerrar Sesion?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Estoy Seguro',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
      if (result.isConfirmed) {
        setAuth({
          token: '',
          auth: false
        })
        localStorage.removeItem('token')
        history('/login')
      }
    })
		}
  

  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          <h1>CRM - Administrador de Clientes</h1>
          {auth.auth ? (
            <button type="button" className="btn btn-azul" onClick={cerrarSesion}>
              <i className="far fa-times-circle"></i>
              Cerrar Sesion
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header