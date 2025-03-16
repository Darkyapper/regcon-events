import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { BsCalendar2DateFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { MdLocationPin } from "react-icons/md";
import { FaTag } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";

export default function EventDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState([]);
    const [ticketCategories, setTicketCategories] = useState([]);

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

    return (
        <div>
            <div className="mt-4 mb-4 md:flex">
                <div className="w-[25.75rem] h-[18rem] md:w-[1100px] md:h-[420px] overflow-hidden rounded-lg md:ml-4">
                    <img src={event.event_image} alt={event.event_name}
                        className="w-full h-full object-cover" />
                </div>
                <div className="p-6 bg-secondary rounded-lg mt-4 md:mt-0 md:ml-4 md:mr-4 md:h-[420px] md:size-full">
                    <h1 className="text-center text-xl md:text-2xl poppins-font font-bold">{event.event_name}</h1>
                    <div className="mt-4 text-justify text-base md:h-[130px]">
                        <p>
                            {event.event_description}
                        </p>
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
                        <p className="ml-2">Categoria: {event.category_name}</p>
                    </div>
                    <div className="mt-4 flex content-center">
                        <MdGroupWork className="text-2xl" />
                        <p className="ml-2">Organizado por: {event.workgroup_name}</p>
                    </div>
                </div>
            </div>
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
        </div>
    );
}