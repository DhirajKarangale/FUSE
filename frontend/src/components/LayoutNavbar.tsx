import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function LayoutNavbar() {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            <main className="flex-1 lg:ml-56 px-0 py-0 sm:px-3 sm:py-3 md:px-4 md:py-4 pb-10 lg:pb-4 overflow-y-auto">
                <Outlet />
            </main>

            <Navbar />
        </div>
    );
}

export default React.memo(LayoutNavbar);