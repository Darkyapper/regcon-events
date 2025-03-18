import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { Link } from 'react-router-dom';

export default function CancelPay() {

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <DotLottieReact
                src="https://lottie.host/cce2db1a-9f9c-4210-81ea-e1e29d612e4f/DSmaULql5l.lottie"
                autoplay
                className="w-44 h-44"
            />
            <h2 className="text-3xl font-bold md:text-2xl md:font-semibold text-center text-gray-800 dark:text-gray-200">
                ¡Pago cancelado!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xl md:text-medium text-center">
                Tu pago ha sido cancelado. Puedes intentar nuevamente.
            </p>
            <Link
                to="/buy-tickets"
                className="mt-4 px-4 py-2 text-xl md:text-base font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            >
                Intentar nuevamente
            </Link>
        </div>
    );
}
