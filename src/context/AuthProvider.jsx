import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para obtener la información completa del usuario
    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/users/${userId}`);
            const data = await response.json();
            if (data.message === "Success") {
                return data.data; // Devuelve la información completa del usuario
            }
            return null;
        } catch (error) {
            console.error("Error obteniendo detalles del usuario:", error);
            return null;
        }
    };

    useEffect(() => {
        console.log("Revisando autenticación del usuario...");

        fetch(`${apiUrl}/auth/me`, {
            credentials: "include", // Para enviar cookies automáticamente
        })
            .then(response => response.json())
            .then(async (data) => {
                if (data.token) {
                    console.log("Token obtenido desde el backend con éxito.");
                    localStorage.setItem("authToken", data.token);

                    try {
                        // Decodificar el token
                        const decoded = jwtDecode(data.token);
                        if (decoded.id) {
                            // Obtener la información completa del usuario
                            const userDetails = await fetchUserDetails(decoded.id);
                            if (userDetails) {
                                // Actualizar el estado con la información completa
                                setUser({
                                    ...decoded,
                                    ...userDetails, // Incluye user_pic, name, etc.
                                });
                            }
                        }
                    } catch (error) {
                        console.error("Error al decodificar el token:", error);
                    }
                } else {
                    console.log("No se encontró token.");
                }
            })
            .catch(error => console.error("Error obteniendo autenticación:", error))
            .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user_id");
        localStorage.removeItem("userType");
        
        setUser(null);
    };

    const refreshAuth = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/me`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.token) {
                console.log("Token actualizado exitosamente.");
                localStorage.setItem("authToken", data.token);
    
                try {
                    const decoded = jwtDecode(data.token);
                    if (decoded.id) {
                        // Obtener la información completa del usuario
                        const userDetails = await fetchUserDetails(decoded.id);
                        if (userDetails) {
                            // Actualizar el estado con la información completa
                            setUser({
                                ...decoded,
                                ...userDetails, // Incluye user_pic, name, etc.
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error al decodificar el token:", error);
                }
            }
        } catch (error) {
            console.error("Error obteniendo autenticación:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);