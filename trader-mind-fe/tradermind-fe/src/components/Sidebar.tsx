import React from "react";
import { Home, PlusCircle, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path
            ? "bg-gradient-to-r from-gray-600 to-gray-900 text-white"
            : "hover:bg-gray-800 hover:text-white text-gray-900";


    return (
        <div className="w-64 bg-gray-100 text-gray-900 min-h-screen fixed left-0 top-0 p-6 z-50 hidden md:block">
            <nav className="space-y-3">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${isActive(
                        "/dashboard"
                    )}`}
                >
                    <span>Dashboard</span>
                </button>

                <button
                    onClick={() => navigate("/dashboard/add-trade")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${isActive(
                        "/dashboard/add-trade"
                    )}`}
                >
                    <span>Add New Trade</span>
                </button>

                <button
                    onClick={() => navigate("/dashboard/documents")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${isActive(
                        "/dashboard/documents"
                    )}`}
                >
                    <span>Documents</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;