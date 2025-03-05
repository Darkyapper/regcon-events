import React from "react";
import Header from "../header/Header"; // Componente de encabezado
import Footer from "../footer/Footer"; // Componente de pie de página

const Layout = ({ children }) => {
    return (
        <div className="app">
            <Header /> {/* Encabezado común */}
            <div className="main-content">
                <div className="content">
                    {children} {/* Contenido dinámico de cada página */}
                </div>
            </div>
            <Footer /> {/* Pie de página común */}
        </div>
    );
};

export default Layout;