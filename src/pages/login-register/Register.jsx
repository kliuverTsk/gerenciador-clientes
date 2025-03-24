import { useState, useEffect } from 'react'
import { useFirebase } from '../../context/firebase/contextFirebase'
import '../login-register/Login.css'  // Podemos reutilizar los estilos del login
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleRegister, error } = useFirebase()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Por favor complete todos los campos')
      return
    }
    await handleRegister(email, password)
    navigate('/login')
  }

  useEffect(() => {
    if (error) {
      alert(error)
    }
  }, [error])

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className='button-login'>Registrarse</button>
        </form>
        <p className="link-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register