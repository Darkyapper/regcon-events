import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { BsCalendar2DateFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { MdLocationPin } from "react-icons/md";
import { FaTag } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";

// Importaciones de Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Solución para el icono del marcador en Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const markerIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${apiUrl}/event-detail/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setEvent(data.data);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) {
        return <p className="text-center">Cargando evento...</p>;
    }

    return (
        <div>
            {/* Información del evento */}
            <div className="mt-4 mb-4 md:flex">
                <div className="w-[25.75rem] h-[18rem] md:w-[1100px] md:h-[420px] overflow-hidden rounded-lg md:ml-4">
                    <img src={event.event_image} alt={event.event_name}
                        className="w-full h-full object-cover" />
                </div>
                <div className="p-6 bg-secondary rounded-lg mt-4 md:mt-0 md:ml-4 md:mr-4 md:h-[420px] md:size-full">
                    <h1 className="text-center text-xl md:text-2xl poppins-font font-bold">{event.event_name}</h1>
                    <div className="mt-4 text-justify text-base md:h-[130px]">
                        <p>{event.event_description}</p>
                    </div>
                    <div className="mt-4 flex content-center">
                        <BsCalendar2DateFill className="text-2xl" />
                        <p className="ml-2">Fecha: {event.event_date}</p>
                    </div>
                    <div className="mt-4 flex content-center">
                        <MdLocationPin className="text-2xl" />
                        <p className="ml-2">Lugar: {event.location}</p>
                    </div>
                    <div className="mt-4 flex content-center">
                        <FaTag className="text-2xl" />
                        <p className="ml-2">Categoría: {event.category_name}</p>
                    </div>
                    <div className="mt-4 flex content-center">
                        <MdGroupWork className="text-2xl" />
                        <p className="ml-2">Organizado por: {event.workgroup_name}</p>
                    </div>
                </div>
            </div>

            {/* Sección de boletos */}
            <div className="m-4 bg-cards shadow-xl rounded-lg p-4">
                <h1 className="font-bold text-center md:text-3xl">¡Adquiere tus boletos ya!</h1>
                <div className="mt-4 bg-select rounded-lg p-4 md:flex md:content-center md:place-content-between">
                    <div className="rounded-lg p-4 md:content-center">
                        <h1>{event.ticket_name}</h1>
                        <h2 className="font-semibold">${event.ticket_price}</h2>
                    </div>
                    <Link
                        to={`/buy-tickets?event=${event.event_id}&ticket_category=${event.ticket_category_id}`}
                        className="md:content-center md:place-self-center"
                    >
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Comprar Boletos
                        </button>
                    </Link>
                </div>
            </div>

            {/* Sección del mapa */}
            <div className="m-4 bg-white shadow-xl rounded-lg p-4">
                <h1 className="text-xl font-bold text-center">Ubicación del evento</h1>
                {event.latitude !== null && event.longitude !== null ? (
                    <div className="mt-4 w-full h-96 rounded-lg overflow-hidden">
                        <MapContainer
                            center={[event.latitude, event.longitude]}
                            zoom={15}
                            className="w-full h-full rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[event.latitude, event.longitude]} icon={markerIcon}>
                                <Popup>{event.location}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">
                        El organizador no ha especificado la ubicación exacta del evento.
                    </p>
                )}
            </div>
        </div>
    );
}
