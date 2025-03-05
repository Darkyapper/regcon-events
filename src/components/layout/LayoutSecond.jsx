import React from "react";
import HeaderIcon from "../header/HeaderIcon"; // Componente de encabezado
import Footer from "../footer/Footer"; // Componente de pie de página

const LayoutSecond = ({ children }) => {
    return (
        <div className="app flex flex-col min-h-screen">
            <HeaderIcon /> {/* Encabezado común */}
            <main className="flex-grow">
                {children} {/* Contenido dinámico de cada página */}
            </main>
            <Footer /> {/* Pie de página común */}
        </div>
    );
};

export default LayoutSecond;