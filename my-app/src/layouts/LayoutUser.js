import React from 'react'

import Navbar from '../components/user/Navbar'
import Footer from '../components/user/Footer'
import { Outlet } from 'react-router-dom'

export default function LayoutUser() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto p-2 my-2">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
