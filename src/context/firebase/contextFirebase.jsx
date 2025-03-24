import { createContext, useContext, useEffect } from "react";
import {useState} from "react";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


const Context = createContext();

export function FirebaseProvider({children}) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    
    // Limpieza del observador cuando el componente se desmonte
    return () => unsubscribe()
  }, [])

  const handleRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Usuario registrado exitosamente");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Usuario logueado exitosamente");
    } catch (error) {
        setError(error.message);
    }
  }
  const handleLogout = async () => {
    try {
        await signOut(auth);
        alert("Usuario deslogueado exitosamente");
    } catch (error) {
        setError(error.message);
    }
  }

  return (
    <Context.Provider value={{user, error, handleRegister, handleLogin, handleLogout}}>
      {children}
    </Context.Provider>
  )


}

export const useFirebase = () => useContext(Context)