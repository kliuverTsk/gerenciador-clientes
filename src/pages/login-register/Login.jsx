import { useState, useEffect } from 'react'
import { useFirebase } from '../../context/firebase/contextFirebase'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { handleLogin } = useFirebase()
  const navigate = useNavigate()

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Por favor complete todos los campos')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingrese un email válido')
      return
    }

    setIsLoading(true)
    try {
      const response = await handleLogin(email, password)  
      if (response === true) {
        toast.success('Iniciando sesión')
        navigate('/dashboard')
      } else {
        toast.error('Error al intentar iniciar sesión')
      }
    } catch (error) {
      toast.error(`Error al intentar iniciar sesión: ${error.message}`)
    } finally {
      setIsLoading(false)
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
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className='button-login'
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="link-text">
          ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  )
}

export default Login