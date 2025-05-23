// SidebarPage.jsx
import {
    Home, MapPin, Boxes, Layers, Package, Activity, BarChart2, LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";

const sidebarItems = [
    { label: "Dashboard", icon: <Home />, path: "/" },
    { label: "Location", icon: <MapPin />, path: "/locations" },
    { label: "Category", icon: <Layers />, path: "/categories" },
    { label: "Products", icon: <Package />, path: "/products" },
    { label: "Logs", icon: <Activity />, path: "/logs" },
    { label: "Inventory", icon: <BarChart2 />, path: "/stocks" },
    { label: "Logout", icon: <LogOut />, path: "/logout" },
];

const SidebarPage = () => {
    return (
        <aside className="w-56 bg-white shadow-md h-full flex flex-col px-4 py-6">
            <div className="flex justify-center align-middle">
                <img src={Logo} alt="Logo" className="h-8 w-16 pr-2" />
                <div className="text-2xl font-bold italic text-black mb-10 tracking-wide">
                    InvManage
                </div>
            </div>
            <nav className="flex flex-col space-y-2">
                {sidebarItems.map((item) => (
                    <NavLink
                        to={item.path}
                        key={item.label}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 
                ${isActive
                                ? "bg-[#F8486E]/20 text-[#F8486E] font-semibold"
                                : "text-black hover:bg-[#F8486E]/5 hover:text-[#F8486E]"}`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default SidebarPage;  