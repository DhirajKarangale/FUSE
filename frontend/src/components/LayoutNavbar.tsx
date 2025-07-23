import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function LayoutNavbar() {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            <main className="flex-1 lg:ml-56 pt-4 pb-14 lg:pt-4 lg:pb-4 px-4 sm:px-6 overflow-y-auto">
                <Outlet />
            </main>

            <Navbar />
        </div>
    );
}

export default React.memo(LayoutNavbar);