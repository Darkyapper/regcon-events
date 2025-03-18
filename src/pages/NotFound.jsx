import React, { useEffect } from "react";
import Layout from "../components/layout/Layout";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NotFound() {

    return (
        <div className="flex flex-col min-h-screen">
            <Layout>
                <div className="flex flex-col items-center justify-center h-screen">
                    <DotLottieReact
                        src="https://lottie.host/f029c669-5940-4a52-b47e-09b7875fffaa/pJngMP54EF.lottie"
                        autoplay
                        className="w-[20rem]"
                    />
                    <h2 className="text-3xl font-bold md:text-2xl md:font-semibold text-center text-gray-800 dark:text-gray-200">
                        ¡Ups! Página no encontrada
                    </h2>
                    <p className="text-gray-600 mt-4 dark:text-gray-400 text-xl md:text-medium text-center">
                        Parece que la página que buscas no existe o ha sido movida.
                    </p>

                    <a
                        href="/"
                        className="mt-4 px-4 py-2 text-xl md:text-base font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200" >
                        Volver a la página principal
                    </a>
                </div>
            </Layout>
        </div>
    );
}
