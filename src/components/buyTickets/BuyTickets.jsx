import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from "../../context/AuthProvider";

export default function BuyTickets() {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("event");
    const ticketCategoryId = searchParams.get("ticket_category");

    const [tickets, setTickets] = useState([]);
    const [category, setCategory] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth(); // Mover la llamada al hook aquí

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
        const userId = user?.id; // Extraer ID del usuario
        if (!userId) {
            setError("Debes iniciar sesión para realizar la compra.");
            return;
        }

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
            if (paymentRes.message !== "registro de pago pendiente creado exitosamente") throw new Error("Error registrando el pago");

            const token = localStorage.getItem("authToken"); // O desde las cookies si se guarda allí

            if (!token) {
                setError("Error al autentificar, por favor, inicia sesión de nuevo.");
                return;
            }
            // Crear sesión de pago con Stripe
            const stripeRes = await fetch(`${apiUrl}/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Enviar el token JWT en el encabezado Authorization
                },
                body: JSON.stringify({ ticket_code: availableTicket.code })
            }).then(res => res.json());
            if (!stripeRes.url) throw new Error("Error creando sesión de pago");

            window.location.href = stripeRes.url; // Redirigir al pago
        } catch (err) {
            setError(err.message); // Mostrar mensaje de error
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1>Resumen de Compra</h1>
            <h2>{event.event_name}</h2>
            <p>{category.name}</p>
            <p>Precio: ${category.price} MXN</p>
            <p>Boletos totales: {category.total_tickets}</p>
            <p>Boletos disponibles: {category.available_tickets}</p>
            <button onClick={handlePurchase} disabled={!tickets.length || !category}>Comprar</button>
        </div>
    );
}
