import { createContext, useContext, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const ClientesContext = createContext();

export const useClientes = () => useContext(ClientesContext);

export function ClientesProvider({ children }) {
    const [clientes, setClientes] = useState([]);

    const handleCreateCliente = async (cliente) => {
        try {
            const clienteWithTimestamp = {
                ...cliente,
                timestamp: Date.now()  // Añadir timestamp
            };
            const docRef = await addDoc(collection(db, "clientes"), clienteWithTimestamp);
            if (docRef.id) {
                return "Cliente creado exitosamente";
            } else {
                return "Error al crear el cliente";
            }
        } catch (e) {
            console.error("Error específico:", e);
            return "Error al crear el cliente";
        }
    };

    const handleGetClientes = async (userId) => {
        try {
            const querySnapshot = await getDocs(collection(db, "clientes"));
            const clientesList = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(cliente => cliente.userId === userId)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Ordenar por timestamp
            setClientes(clientesList);
            return clientesList;
        } catch (e) {
            return "Error al obtener los clientes";
        }
    };

    const handleUpdateCliente = async (id, cliente) => {
        try {
            const clienteRef = doc(db, "clientes", id);
            await updateDoc(clienteRef, cliente);
            return "Cliente actualizado exitosamente";
        } catch (e) {
            return "Error al actualizar el cliente";
        }
    };

    const handleDeleteCliente = async (id) => {
        try {
            await deleteDoc(doc(db, "clientes", id));
            return "Cliente eliminado exitosamente";
        } catch (e) {
            return "Error al eliminar el cliente";
        }
    };

    return (
        <ClientesContext.Provider value={{
            clientes,
            handleCreateCliente,
            handleGetClientes,
            handleUpdateCliente,
            handleDeleteCliente
        }}>
            {children}
        </ClientesContext.Provider>
    );
}