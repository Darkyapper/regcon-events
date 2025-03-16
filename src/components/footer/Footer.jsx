import React from "react";
import "./Footer.css";
import logo from "../../assets/regcon-logo.png";

const Footer = () => {
    return (
        <footer className="bg-primary shadow-sm dark:bg-gray-900">
            <div className="w-full p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a
                        href="https://flowbite.com/"
                        className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                    >
                        <img
                            src={logo}
                            className="h-8 logo-custom-f"
                            alt="RegCon Logo"
                        />
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Acerca De
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Política de Privacidad
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Terminos y Condiciones
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-white sm:text-center dark:text-gray-400">
                    © 2024-2025{" "}
                    <a href="https://flowbite.com/" className="hover:underline">
                        RegCon™
                    </a>
                    . Todos los derechos reservados.
                </span>
            </div>
        </footer>
    );
};

export default Footer;