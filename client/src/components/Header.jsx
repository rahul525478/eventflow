import React from 'react';
import { Search, Bell, User, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    return (
        <header className="h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="hidden md:flex bg-slate-100/50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 rounded-full px-4 py-2.5 w-96 items-center gap-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search events, analytics, etc..."
                        className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                </button>

                <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1 capitalize">{user?.role || 'User'}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
                        {user?.image ? (
                            <img
                                src={`http://localhost:5000${user.image}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-indigo-500" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
