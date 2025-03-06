import { useState, useEffect } from "react";

const Search = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [offset, setOffset] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const limit = 3;

    /*useEffect(() => {
        fetchCategories();
    }, [offset]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/event-categories?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            if (data.message === "Success") {
                setCategories((prev) => [...prev, ...data.data]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };*/

    return (
        <form className="max-w-4xl w-full mx-auto mt-4">
            <div className="flex w-full relative">
                <div className="relative w-full">
                    <input
                        type="search"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Buscar eventos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800"
                    >
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-500 pl-1 mt-1 hover:underline hover:text-gray-700 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                Aplicar Filtros
            </p>
        </form>
    );
};

export default Search;