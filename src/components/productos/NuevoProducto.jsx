import { useState } from "react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import clienteAxios from "../../config/axios"

function NuevoProducto() {
  const history = useNavigate()

  const [producto, setProducto] = useState({
    nombre: '',
    precio: ''
  })

  const [imagen, setImagen] = useState('')

  const leerProducto = e => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    })
  }

  const leerArchivo = e => {
    setImagen(e.target.files[0])
  }

  const agregarProducto = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('nombre', producto.nombre)
    formData.append('precio', producto.precio)
    formData.append('imagen', imagen)
    clienteAxios.post('/productos', formData, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
      .then(res => {
        Swal.fire(
          'Se agrego el producto',
          res.data.mensaje,
          'success'
        )
        history('/productos')
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data,
        })
      })
  }

  return(
    <>
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto}>
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input 
                type="text" 
                placeholder="Nombre Producto" 
                name="nombre"
                onChange={leerProducto}
              />
          </div>

          <div className="campo">
              <label>Precio:</label>
              <input 
                type="number" 
                name="precio" 
                min="0.00" 
                step="0.01" 
                placeholder="Precio" 
                onChange={leerProducto}
              />
          </div>

          <div className="campo">
              <label>Imagen:</label>
              <input 
                type="file"  
                name="imagen" 
                onChange={leerArchivo}
              />
          </div>

          <div className="enviar">
              <input 
                type="submit" 
                className="btn btn-azul" 
                value="Agregar Producto"
              />
          </div>
      </form>
    </>
  )
}

export default NuevoProducto
