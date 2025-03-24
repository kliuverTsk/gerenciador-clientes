import { useState,useEffect } from 'react'
import { useFirebase } from '../../context/firebase/contextFirebase'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin} = useFirebase()
  const navigate = useNavigate()

  // Detectar modo oscuro al cargar
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Por favor complete todos los campos')
      return
    }
    try {
      const response = await handleRegister(email, password)
      if (response === true) {
        alert('iniciando sesion')
        navigate('/dashboard')
      } else {
        alert('Error al intentar iniciar sesion')
      }
    } catch (error) {
      alert('Error al intentar iniciar sesion: ' + error.message)
    }
      
    
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
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
          <button type="submit" className='button-login'>Iniciar Sesión</button>
        </form>
        <p className="link-text">
          ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  )
}

export default Login