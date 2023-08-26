import { useContext, useState } from "react"
import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"
import { useNavigate } from "react-router-dom"
import { CRMContext } from "../../context/CRMContext"

function LogIn () {

  const history = useNavigate()

  const [datos, setDatos] = useState({
    email: '',
    password: ''
  })

  const [auth, setAuth] = useContext(CRMContext)

  const leerDatos = e => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }

  const iniciarSesion = e => {
    e.preventDefault()
    clienteAxios.post('/login', datos)
      .then(res => {
        const {token} = res.data
        localStorage.setItem('token', token)
        setAuth({
          token,
          auth: true
        })
        history('/')
      })
      .catch(error => {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error',
          text: error.response.data.mensaje
        })
      })
  }

  return (
    <div className="login">
      <h2>Iniciar Sesion</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text" 
              name="email"
              placeholder="Email para iniciar sesion"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password" 
              name="password"
              placeholder="Password para iniciar sesion"
              required
              onChange={leerDatos}
            />
          </div>
          <input type="submit" value="Iniciar Sesion" className="btn btn-verde btn-block" />
        </form>
      </div>
    </div>
  )
}

export default LogIn