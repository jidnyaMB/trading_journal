import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path
            ? "bg-gradient-to-r from-gray-600 to-gray-900 text-white shadow-sm"
            : "hover:bg-gray-100 text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <Sidebar />

            {/* Mobile Header */}
            <header className="md:hidden bg-white shadow-sm px-4 py-4 flex items-center border-b sticky top-0 z-30">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                {/* <h1 className="ml-4 text-xl font-bold text-[#301934]">TraderMind</h1> */}
            </header>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#301934]">Menu</h2>
                    <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard");
                            setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isActive(
                            "/dashboard"
                        )}`}
                    >
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => {
                            navigate("/dashboard/add-trade");
                            setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isActive(
                            "/dashboard/add-trade"
                        )}`}
                    >
                        <span>Add New Trade</span>
                    </button>

                    <button
                        onClick={() => {
                            navigate("/dashboard/documents");
                            setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${isActive(
                            "/dashboard/documents"
                        )}`}
                    >
                        <span>Documents</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 md:ml-64 transition-all duration-300 ${isDrawerOpen ? "blur-sm md:blur-none" : ""}`}>
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
