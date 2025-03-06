import React from "react";
import EventCarousel from "./EventCarousel";

const HomeDash = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-center mt-4">Descubra los Próximos Eventos</h1>
            <EventCarousel />
        </div>
    );
};

export default HomeDash;
