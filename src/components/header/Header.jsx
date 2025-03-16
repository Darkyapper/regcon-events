import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { FaUser } from "react-icons/fa";
import logo from "../../assets/regcon-logo.png";
import { initFlowbite } from "flowbite";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirigir

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Hook para redirigir

    // Inicializar Flowbite (para el menú desplegable)
    useEffect(() => {
        initFlowbite();
    }, []);

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        logout(); // Llama a la función logout del AuthProvider
        navigate("/login"); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <nav className="bg-accent border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src={logo}
                        className="h-8 logo-custom"
                        alt="RegCon Events Logo"
                    />
                </a>

                {/* Botón de usuario */}
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? (
                        // Usuario autenticado: Mostrar imagen y menú desplegable
                        <div className="relative">
                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                id="user-menu-button"
                                aria-expanded="false"
                                data-dropdown-toggle="user-dropdown"
                                data-dropdown-placement="bottom"
                            >
                                <span className="sr-only">Abrir menú de usuario</span>
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={user.user_pic || "/default-user.png"} // Usa una imagen por defecto si no hay una
                                    alt="Foto de perfil"
                                />
                            </button>

                            {/* Menú desplegable */}
                            <div
                                className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                id="user-dropdown"
                            >
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">
                                        {user.first_name || "Usuario"}
                                    </span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                        {user.email || "usuario@example.com"}
                                    </span>
                                </div>
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <a
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Perfil
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Configuración
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout} // Llama a handleLogout al hacer clic
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        // Usuario no autenticado: Mostrar botón de inicio de sesión
                        <a
                            href="/login"
                            className="text-white bg-[#2F27CE] hover:bg-[#443DFF] focus:ring-4 focus:outline-none focus:ring-white-600 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <FaUser className="inline-block w-5 h-5 -mt-0.5 me-2" />
                            Ingresar
                        </a>
                    )}

                    {/* Botón para móviles */}
                    <button
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Abrir menú principal</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Menú principal */}
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-accent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a
                                href="/"
                                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-white md:p-0 md:dark:text-blue-500"
                                aria-current="page"
                            >
                                Eventos
                            </a>
                        </li>
                        <li>
                            <a
                                href="/about"
                                className="block py-2 px-3 text-text rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Acerca de
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact"
                                className="block py-2 px-3 text-text rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Contacto
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;