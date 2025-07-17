import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import SetBG from "../backgrounds/SetBG";

function LayoutNavbar() {
    return (
        // <div className="flex h-screen">
        //     <Navbar />
        //     <main className="ml-56 w-full relative"><Outlet /></main>
        // </div>

        <div className="flex h-screen relative overflow-hidden">
            <SetBG />
            <Navbar />
            <main className="ml-56 w-full relative">
                <Outlet />
            </main>
        </div>
    );
}

export default React.memo(LayoutNavbar);