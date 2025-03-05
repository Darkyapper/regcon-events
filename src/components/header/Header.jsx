import React from "react";

const Header = () => {
    return (
        <header className="header">
            <h1>Mi Aplicación</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/about">Acerca de</a>
                <a href="/contact">Contacto</a>
            </nav>
        </header>
    );
};

export default Header;