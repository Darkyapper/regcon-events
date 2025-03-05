import React from "react";
import "./Header.css";
import logo from "../../assets/regcon-logo.png";

const HeaderIcon = () => {

    return (
        <nav className="bg-accent border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src={logo}
                        className="h-8 logo-custom"
                        alt="RegCon Events Logo"
                    />
                </a>
            </div>
        </nav>
    );
};

export default HeaderIcon;