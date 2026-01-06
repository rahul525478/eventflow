import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';
import { Menu } from 'lucide-react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-500/30 selection:text-indigo-900 font-sans">
            {/* Background Noise/Gradient - Enhanced & Vibrant */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-20"></div>
            <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none z-0 animate-blob mix-blend-multiply"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-[100px] pointer-events-none z-0 animate-blob animation-delay-2000 mix-blend-multiply"></div>
            <div className="fixed top-[40%] left-[40%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px] pointer-events-none z-0 animate-blob animation-delay-4000 mix-blend-multiply"></div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0' : ''} lg:pl-72 relative z-10`}>
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Chatbot />
        </div>
    );
};

export default Layout;
