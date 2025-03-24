import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClientesProvider } from './context/contextClientes'

// Páginas principales
import Login from './pages/login-register/Login'
import Register from './pages/login-register/Register'
import Dashboard from './pages/Dashboard/dashboard'

function App() {
    return (
      <ClientesProvider>
            <BrowserRouter>
            <Routes>
               <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
           </BrowserRouter>
       </ClientesProvider>
    );
}

export default App;
