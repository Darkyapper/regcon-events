import React, { useState, useEffect } from 'react';
import { FloatingLabel } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const { refreshAuth } = useAuth();

    // Validación de email
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    // Validación en tiempo real
    useEffect(() => {
        if (email && !validateEmail(email)) {
            setError('El correo es inválido.');
        } else if (password && password.length < 8) {
            setError('La contraseña contiene al menos 8 caracteres.');
        } else {
            setError('');
        }
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Bloquear intentos después de 5 fallos
        if (attempts >= 5) {
            setError('Demasiados intentos. Espera unos minutos o resuelve el CAPTCHA.');
            return;
        }

        // Validar antes de enviar al backend
        if (!validateEmail(email)) {
            setError('Ingrese un correo válido.');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña contiene al menos 8 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${apiUrl}/user-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Para manejar cookies de sesión
            });

            const data = await response.json();
            if (response.ok) {
                // No guardamos datos sensibles en localStorage
                await refreshAuth();
                navigate('/');
            } else {
                setAttempts(attempts + 1);
                if (response.status === 401) {
                    setError('Correo o contraseña incorrectos.');
                } else if (response.status === 429) {
                    setError('Demasiados intentos. Intenta más tarde.');
                } else {
                    setError(data.error || 'Error al intentar iniciar sesión.');
                }
            }
        } catch (error) {
            console.error('Error en la solicitud de inicio de sesión:', error);
            setError('Error al conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`mt-6 main-container ${isLoading ? 'cursor-wait' : ''}`}>
            <div className='custom-form'>
                <form className="poppins-font max-w-sm mx-auto bg-cards dark:bg-dark-cards text-text dark:text-dark-text shadow-2xl p-6 rounded-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="info-form">
                        <h1 className='poppins-font font-semibold text-center text-3xl mb-2'>Iniciar Sesión</h1>
                        <p className='description-form text-center text-base'>
                            Hola de nuevo 👋
                        </p>
                        <p className='description-form text-center text-sm mb-4'>
                            Vamos a iniciar sesión, ingrese sus datos de inicio de sesión.
                        </p>
                    </div>
                    {error && <p className="text-center text-red-500 dark:text-red-400 mb-4 text-sm">{error}</p>}
                    <div className="mb-5">
                        <FloatingLabel
                            variant="outlined"
                            label="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            disabled={isLoading}
                            required
                            className="text-text dark:text-dark-text bg-background dark:bg-dark-background border-gray-300 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary"
                        />
                    </div>
                    <div className="mb-5">
                        <FloatingLabel
                            variant="outlined"
                            label="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            disabled={isLoading}
                            required
                            className="text-text dark:text-dark-text bg-background dark:bg-dark-background border-gray-300 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary"
                        />
                    </div>
                    <div className='justify-center place-self-center button-to-access'>
                        <button
                            type="submit"
                            className={`group transition-transform transform hover:scale-105 duration-300 ease-in-out text-white bg-primary dark:bg-dark-primary hover:bg-accent dark:hover:bg-dark-accent focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${isLoading ? 'cursor-wait opacity-50' : ''}`}
                            disabled={isLoading || attempts >= 5}
                        >
                            {isLoading ? 'Iniciando Sesión...' : 'Acceder'}
                        </button>
                    </div>
                    <p className='pics-as mt-2 text-center text-sm'>
                        ¿Aún no tienes una cuenta? <a className="hover:underline just-it-a" href="/register">¡Crea una aquí!</a>
                    </p>
                </form>
            </div>
        </div>
    );
}