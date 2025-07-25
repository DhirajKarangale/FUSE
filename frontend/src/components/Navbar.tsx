import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Flame, User, Info, SlidersHorizontal, FilePlus2, LucideMessageSquareText } from 'lucide-react';
import { routeFeed, routePopular, routeCustomizeFeed, routeAddPost, routeUser, routeAbout, routeMessages } from '../utils/Routes';

const navItems = [
    { name: 'Feed', path: routeFeed, icon: <Home size={20} /> },
    { name: 'Popular', path: routePopular, icon: <Flame size={20} /> },
    // { name: 'Messages', path: routeMessages, icon: <LucideMessageSquareText size={20} /> },
    { name: 'Customize Feed', path: routeCustomizeFeed, icon: <SlidersHorizontal size={20} /> },
    { name: 'AddPost', path: routeAddPost, icon: <FilePlus2 size={20} /> },
    { name: 'User', path: routeUser, icon: <User size={20} /> },
    { name: 'About', path: routeAbout, icon: <Info size={20} /> },
];

function Navbar() {
    return (
        <>
            <div className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-xl border-r border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-4 z-5">
                <div className="flex flex-col gap-4">

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-white text-base font-medium transition-all duration-300
                        ${isActive ? "bg-cyan-600" : "hover:bg-cyan-600/30"}`}>
                            {item.icon}
                            <span className="select-none">{item.name}</span>
                        </NavLink>
                    ))}

                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 w-full h-10 p-0 m-0 z-0 bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-xl border-r border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <div className="flex justify-around items-center px-0 py-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-200 px-0 py-1
                             ${isActive ? "text-cyan-400" : "hover:text-cyan-300"}`}>
                            {item.icon}
                        </NavLink>
                    ))}
                </div>
            </div>

        </>
    );
}

export default React.memo(Navbar);