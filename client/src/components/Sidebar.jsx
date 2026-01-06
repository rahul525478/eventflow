import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, LogOut, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Use logout from context

    const handleLogout = () => {
        logout(); // clear context and storage
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className={cn(
            "h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-white/5 fixed left-0 top-0 flex flex-col p-6 z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 backdrop-blur-xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white lg:hidden"
            >
                <X className="w-6 h-6" />
            </button>
            {/* Dynamic Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-indigo-600/30 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-pink-600/30 rounded-full blur-[80px]" />
            </div>

            <Link to="/" className="mb-10 flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <span className="text-xl font-bold tracking-tight text-white block leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">EventFlow</span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Manager</span>
                </div>
            </Link>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "relative group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300",
                                isActive
                                    ? "text-white shadow-lg shadow-indigo-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <item.icon className={cn("w-5 h-5 relative z-10 transition-colors duration-300", isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "group-hover:text-indigo-400")} />
                                <span className="relative z-10">{item.label}</span>

                                {isActive && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl w-full transition-all group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
