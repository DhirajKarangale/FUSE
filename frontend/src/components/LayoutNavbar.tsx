import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function LayoutNavbar() {
    return (
        <div className="flex">
            <Navbar />
            <main className="ml-56 w-full p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default React.memo(LayoutNavbar);