
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toolbar } from "../UI/Toolbar";
import { Sidebar } from "../UI/SideBar";

export const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">

        <Toolbar onMenuClick={() => setIsOpen(!isOpen)} /> 
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isOpen} />
                <main className={`flex-1 p-8 transition-all duration-300 overflow-y-auto ${isOpen ? "ml-64" : "ml-20"}`}>
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};