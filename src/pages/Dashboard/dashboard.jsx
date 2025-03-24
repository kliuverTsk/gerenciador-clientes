import { useFirebase } from '../../context/firebase/contextFirebase'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useClientes } from '../../context/contextClientes'
import './dashboard.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRef } from 'react'

const Dashboard = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [telefono, setTelefono] = useState('')
    const [email, setEmail] = useState('')
    const [direccion, setDireccion] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user, handleLogout } = useFirebase()
    const { handleCreateCliente, handleGetClientes, handleUpdateCliente, handleDeleteCliente, clientes } = useClientes()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await handleLogout()
        navigate('/login')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!nombre || !apellido || !telefono || !email || !direccion) {
            toast.error('Por favor complete todos los campos')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Por favor ingrese un email válido')
            return
        }

        const phoneRegex = /^\+?[\d-]{10,}$/
        if (!phoneRegex.test(telefono)) {
            toast.error('Por favor ingrese un teléfono válido')
            return
        }
        
        const clienteData = {
            userId: user.uid,
            nombre,
            apellido,
            telefono,
            email,
            direccion
        }

        let response
        if (editingId) {
            response = await handleUpdateCliente(editingId, clienteData)
        } else {
            response = await handleCreateCliente(clienteData)
        }

        if (response.includes("exitosamente")) {
            toast.success(response)
            await handleGetClientes(user.uid)
            setNombre('')
            setApellido('')
            setTelefono('')
            setEmail('')
            setDireccion('')
            setEditingId(null)
        } else {
            toast.error('Error en la operación')
        }
    }

    // Primero, añade una referencia al formulario
    const formRef = useRef(null);
    
    // Modifica la función handleEdit
    const handleEdit = (cliente) => {
        setEditingId(cliente.id)
        setNombre(cliente.nombre)
        setApellido(cliente.apellido)
        setTelefono(cliente.telefono)
        setEmail(cliente.email)
        setDireccion(cliente.direccion)
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleCancel = () => {
        setEditingId(null)
        setNombre('')
        setApellido('')
        setTelefono('')
        setEmail('')
        setDireccion('')
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            const response = await handleDeleteCliente(id);
            if (response.includes("exitosamente")) {
                toast.success(response);
                await handleGetClientes(user.uid);
            } else {
                toast.error('Error al eliminar el cliente');
            }
        }
    }
    
    useEffect(() => {
        const cargarClientes = async () => {
            if (user) {
                setIsLoading(true)
                await handleGetClientes(user.uid)
                setIsLoading(false)            
            }
        };
        cargarClientes()
    }, [user])

    const normalizeText = (text) => {
        return text.toLowerCase().trim();
    };

    const filteredClientes = clientes.filter(cliente => {
        const search = normalizeText(searchTerm);
        const nombreCompleto = normalizeText(`${cliente.nombre} ${cliente.apellido}`);
        const nombreReverso = normalizeText(`${cliente.apellido} ${cliente.nombre}`);
        const email = normalizeText(cliente.email);

        return nombreCompleto.includes(search) ||
               nombreReverso.includes(search) ||
               email.includes(search) ||
               normalizeText(cliente.nombre).includes(search) ||
               normalizeText(cliente.apellido).includes(search);
    });

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={darkMode ? "dark" : "light"}
            />
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando clientes...</p>
                </div>
            ) : user && (
                <div className="dashboard-card">
                    <nav className="dashboard-nav">
                        <h2>Panel de Control</h2>
                        <div className="user-info">
                            <span>{user.email}</span>
                            <button 
                                className="theme-toggle" 
                                onClick={() => setDarkMode(!darkMode)}
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <button onClick={handleSignOut}>Cerrar Sesión</button>
                        </div>
                    </nav>
                    <main className="dashboard-main">
                        <h1>Bienvenido al Sistema</h1>
                        <form ref={formRef} onSubmit={handleSubmit}>
                            <input type="text" value={nombre} placeholder='nombre' onChange={(e)=>setNombre(e.target.value)} />
                            <input type="text" value={apellido} placeholder='apellido' onChange={(e)=>setApellido(e.target.value)} />
                            <input type="text" value={telefono} placeholder='telefono' onChange={(e)=>setTelefono(e.target.value)} />
                            <input type="text" value={email} placeholder='email' onChange={(e)=>setEmail(e.target.value)} />
                            <input type="text" value={direccion} placeholder='direccion' onChange={(e)=>setDireccion(e.target.value)} />
                            <div className="form-buttons">
                                <button type="submit">
                                    {editingId ? 'Actualizar cliente' : 'Añadir cliente'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancel}>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                        <h2>Clientes</h2>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        
                        {filteredClientes.length > 0 ? (
                            <div className="cliente-list">
                                {filteredClientes.map((cliente, index) => (
                                    <div key={cliente.id || index} className="cliente-card">
                                        <h3>{cliente.nombre} {cliente.apellido}</h3>
                                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                                        <p><strong>Email:</strong> {cliente.email}</p>
                                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                                        <div className="cliente-buttons">
                                            <button onClick={() => handleEdit(cliente)}>Editar</button>
                                            <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-clientes">
                                <p>No se encontraron clientes</p>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
};

export default Dashboard