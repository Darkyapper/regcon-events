import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const EventCarousel = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${apiUrl}/all-events?limit=5&nearest=true`);
                const data = await response.json();
                if (response.ok) {
                    setEvents(data.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-6 mb-8">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                navigation
                pagination={{ clickable: true }}
            >
                {events.map((event) => (
                    <SwiperSlide key={event.event_id}>
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-10">
                            <img src={event.event_image} alt={event.event_name} className="w-full h-48 object-cover" />
                            <div className="p-4 text-center">
                                <Link
                                    to={`/events/${event.event_id}`}
                                    className="hover:text-accent duration-300 ease-in-out"
                                >
                                    <h3 className="text-lg font-semibold">{event.event_name}</h3>
                                </Link>
                                <p className="text-gray-600 dark:text-gray-300">{new Date(event.event_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {truncateText(event.event_description, 60)}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default EventCarousel;
