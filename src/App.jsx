import './App.css'
import { HashRouter as Router } from 'react-router-dom'
import { ClientesProvider } from './context/contextClientes'

// Páginas principales
import Login from './pages/login-register/Login'
import Register from './pages/login-register/Register'
import Dashboard from './pages/Dashboard/dashboard'

function App() {
    return (
      <ClientesProvider>

        <Router>
            <Routes>
               <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
          </Router>
       </ClientesProvider>
    );
}

export default App;
