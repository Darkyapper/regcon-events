import React from "react";
import EventCarousel from "./EventCarousel";
import Search from "./Search";

const HomeDash = () => {
    return (
        <div>
            <Search />
            <h1 className="text-2xl font-semibold text-center mt-4">Próximos Eventos</h1>
            <EventCarousel />
        </div>
    );
};

export default HomeDash;
