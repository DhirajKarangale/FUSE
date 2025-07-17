import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function LayoutNavbar() {
    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="ml-56 w-full relative"><Outlet /></main>
        </div>
    );
}

export default React.memo(LayoutNavbar);