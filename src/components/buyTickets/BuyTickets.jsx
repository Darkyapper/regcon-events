import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from "../../context/AuthProvider";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function BuyTickets() {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("event");
    const ticketCategoryId = searchParams.get("ticket_category");

    const [tickets, setTickets] = useState([]);
    const [category, setCategory] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // Estado para controlar el modal

    const { user } = useAuth();

    useEffect(() => {
        if (!eventId || !ticketCategoryId) {
            setError("Faltan parámetros en la URL");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [ticketRes, categoryRes, eventRes] = await Promise.all([
                    fetch(`${apiUrl}/ticket-list/${ticketCategoryId}`).then(res => res.json()),
                    fetch(`${apiUrl}/ticket-categories-with-counts/${ticketCategoryId}`).then(res => res.json()),
                    fetch(`${apiUrl}/event-detail/${eventId}`).then(res => res.json())
                ]);

                if (ticketRes.message !== "Success") throw new Error("Error obteniendo los boletos");
                if (categoryRes.message !== "Success") throw new Error("Error obteniendo la categoría");
                if (eventRes.message !== "Success") throw new Error("Error obteniendo el evento");

                setTickets(ticketRes.data);
                setCategory(categoryRes.data);
                setEvent(eventRes.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, ticketCategoryId]);

    const handlePurchase = async () => {
        const userId = user?.id;
        if (!userId) {
            setError("Debes iniciar sesión para realizar la compra.");
            return;
        }

        setIsProcessing(true); // Mostrar el modal

        try {
            const availableTicket = tickets.find(ticket => ticket.ticket_status === "Disponible");
            if (!availableTicket) throw new Error("No hay boletos disponibles");

            // Apartar boleto
            const preregisterRes = await fetch(`${apiUrl}/preregister-user-ticket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, ticket_code: availableTicket.code })
            }).then(res => res.json());
            if (preregisterRes.message !== "Registro creado exitosamente") throw new Error("Error registrando el boleto");

            // Registrar pago pendiente
            const paymentRes = await fetch(`${apiUrl}/register-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: eventId,
                    ticket_code: availableTicket.code,
                    amount: category.price
                })
            }).then(res => res.json());

            if (paymentRes.message !== "registro de pago pendiente creado exitosamente") {
                throw new Error("Error registrando el pago");
            }

            // Guardamos el ID del pago para referencia en caso de fallo
            const paymentId = paymentRes.data.id;

            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Error al autentificar, por favor, inicia sesión de nuevo.");
                setIsProcessing(false); // Cerrar el modal en caso de error
                return;
            }

            // Crear sesión de pago con Stripe
            const stripeRes = await fetch(`${apiUrl}/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ payment_id : paymentId })
            }).then(res => res.json());
            if (!stripeRes.url) throw new Error("Error creando sesión de pago");

            // Redirigir a Stripe sin cerrar el modal
            window.location.href = stripeRes.url;
        } catch (err) {
            setError(err.message); // Mostrar mensaje de error
            setIsProcessing(false); // Cerrar el modal en caso de error

            if (typeof paymentId !== "undefined") {
                await fetch(`${apiUrl}/cancel-payment`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ payment_id: paymentId })
                }).then(res => res.json())
                  .then(cancelRes => console.log("Cancelación automática:", cancelRes))
                  .catch(cancelError => console.error("Error cancelando el pago:", cancelError));
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {/* Modal de procesamiento */}
            {isProcessing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-4 text-lg font-medium">Espere, procesando pago...</p>
                    </div>
                </div>
            )}

            <div className="mt-4 mb-4 p-4 max-w-4xl mx-auto bg-cards shadow-xl rounded-lg ">
                <h1 className="mb-6 text-3xl text-center font-extrabold leading-none tracking-tight text-text md:text-4xl dark:text-dark-text">Resumen de Compra</h1>
                <div className="md:flex mb-6 md:mb-8 md:justify-center md:content-center md:place-content-between">
                    <div className="md:bg-select md:p-4 md:rounded-lg md:content-center md:place-content-between mb-10">
                        <h2 className="mb-4 text-2xl text-center font-semibold leading-none tracking-tight text-text md:text-4xl dark:text-dark-text md:text-xl">Información del Boleto</h2>
                        <h2 className="mb-4 text-lg font-medium leading-none tracking-tight text-text dark:text-dark-text">Evento: {event.event_name}</h2>
                        <div className="w-[23.7rem] md:w-2xs overflow-hidden rounded-lg">
                            <img src={event.event_image} alt={event.event_name} className="w-full h-full object-cover" />
                        </div>

                        <p className="mt-4 mb-4 text-lg font-medium leading-none tracking-tight text-text dark:text-dark-text text-center">Boleto: {category.name}</p>
                        <p className="mb-4">Precio: <span className="font-bold">${category.price} MXN</span></p>
                        <div className="flex flex-row justify-between space-x-4 mb-4">
                            <div className="transition ease-in-out flex flex-col items-center justify-center bg-primary rounded-lg p-2 w-1/2 text-dark-text hover:scale-105 hover:-translate-y-1">
                                <p>Boletos totales</p>
                                <p className="font-extrabold text-2xl">{category.total_tickets}</p>
                            </div>
                            <div className="transition ease-in-out flex flex-col items-center justify-center bg-green-400 rounded-lg p-2 w-1/2 text-text hover:scale-105 hover:-translate-y-1">
                                <p>Boletos disponibles</p>
                                <p className="font-extrabold text-2xl">{category.available_tickets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:p-4 md:rounded-lg md:place-content-between">
                        <h2 className="mb-4 text-2xl text-center font-semibold leading-none tracking-tight text-text md:text-4xl dark:text-dark-text md:text-xl">Información de Usuario</h2>
                        <div className="flex flex-nowrap items-center space-x-3 pl-4 mb-2">
                            <FaUser className="text-4xl text-center text-primary" />
                            <p className="font-medium text-lg">{user.first_name} {user.last_name}</p>
                        </div>
                        <div className="flex flex-nowrap items-center space-x-3 pl-4">
                            <MdEmail className="text-4xl text-center text-primary" />
                            <p className="text-sm font-medium text-lg">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-4">
                    <button
                        onClick={handlePurchase}
                        disabled={!tickets.length || !category}
                        type="button"
                        className="transition ease-in-out text-xl text-white hover:scale-110 hover:-translate-y-1 hover:bg-blue-300 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <FaShoppingCart className="inline-block w-5 h-5 -mt-0.5 me-2" />
                        Comprar Boletos
                    </button>
                </div>
                <p className="text-xs">Al continuar comprando, aceptas nuestros <Link to="/terminos-y-condiciones"><span className="hover:underline">Terminos y Condiciones</span></Link> del servicio.</p>
            </div>
        </div>
    );
}