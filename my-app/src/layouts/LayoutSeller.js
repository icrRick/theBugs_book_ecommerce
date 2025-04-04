import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/seller/Navbar";
import Sidebar from "../components/seller/Sidebar";

const LayoutSeller = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [reportMenuOpen, setReportMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                setSidebarOpen={setSidebarOpen}
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
            />

            <Sidebar
                sidebarOpen={sidebarOpen}

            />

            {/* Main Content */}
            <main className="p-4 lg:ml-64 pt-16 ">
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutSeller;
