import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import clienteAxios from "../../config/axios"

function EditarProducto() {

  const history = useNavigate()
  const {idProducto} = useParams()

  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  })

  const [imagen, setImagen] = useState('')

  const consultarAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${idProducto}`)
    setProducto(productoConsulta.data)
  }

  useEffect(() => {
    consultarAPI()
  }, [])

  const leerProducto = e => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    })
  }

  const leerArchivo = e => {
    setImagen(e.target.files[0])
  }

  const editarProducto = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('nombre', producto.nombre)
    formData.append('precio', producto.precio)
    formData.append('imagen', imagen)
    clienteAxios.put(`/productos/${idProducto}`, formData, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
      .then(res => {
        Swal.fire(
          'Correcto',
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
      <h2>Editar Producto</h2>

      <form onSubmit={editarProducto}>
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input 
                type="text" 
                placeholder="Nombre Producto" 
                name="nombre"
                value={producto.nombre}
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
                value={producto.precio}
                onChange={leerProducto}
              />
          </div>

          <div className="campo">
              <label>Imagen:</label>
              {producto.imagen ? (
                <img src={`http://localhost:3000/${producto.imagen}`} alt='imagen' width='300'/>
              ) : null}
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

export default EditarProducto
