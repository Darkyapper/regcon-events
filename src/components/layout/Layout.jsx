import React from "react";
import Header from "../header/Header"; // Componente de encabezado
import Footer from "../footer/Footer"; // Componente de pie de página

const Layout = ({ children }) => {
    return (
        <div className="app flex flex-col min-h-screen">
            <Header /> {/* Encabezado común */}
            <main className="flex-grow">
                {children} {/* Contenido dinámico de cada página */}
            </main>
            <Footer /> {/* Pie de página común */}
        </div>
    );
};

export default Layout;