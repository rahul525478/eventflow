
import React, { useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import ReportModal from '../components/ReportModal';

const StatCard = ({ title, value, change, icon: Icon, colorClass, delay, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        onClick={onClick}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:bg-white/20 transition-all duration-300 relative overflow-hidden group cursor-pointer"
    >
        {/* Glowing Gradient Border Effect */}
        <div className={`absolute inset - 0 bg - gradient - to - br ${colorClass} opacity - 0 group - hover: opacity - 10 transition - opacity duration - 500`} />

        <div className={`absolute top - 0 right - 0 w - 32 h - 32 bg - gradient - to - br ${colorClass} opacity - 20 rounded - full blur - 3xl - mr - 10 - mt - 10 transition - transform duration - 700 group - hover: scale - 150`} />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p - 3.5 rounded - 2xl bg - gradient - to - br ${colorClass} text - white shadow - lg shadow - black / 10 group - hover: scale - 110 transition - transform duration - 300 ring - 2 ring - white / 10`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className={`flex items - center gap - 1 text - xs font - bold px - 2.5 py - 1 rounded - full border backdrop - blur - md ${change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} `}>
                {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(change)}%
            </div>
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-300 text-sm font-bold tracking-wide uppercase mb-1">{title}</h3>
            <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Click to view detailed report</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { user, token } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [reportData, setReportData] = useState(null);

    const displayName = user ? `${user.firstName} ` : 'User';

    const fetchReport = async (type) => {
        try {
            const res = await fetch(`${API_URL} /reports/${type} `, {
                headers: { 'Authorization': `Bearer ${token} ` }
            });
            const data = await res.json();
            if (res.ok) {
                setReportData(data);
                setModalOpen(true);
            } else {
                alert("Failed to load report");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="space-y-8 p-6 lg:p-10 min-h-screen bg-slate-900 text-slate-100">
            <ReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} reportData={reportData} />

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-2 text-base md:text-lg">
                        Good morning, <span className="text-white font-semibold">{displayName}</span>! Here's your daily breakdown.
                    </p>
                </div>
                {/* Legacy Download Button (can keep or remove, maybe rename to General Report) */}
                <button
                    onClick={() => fetchReport('events')} // Default to events for now
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2 group w-full md:w-auto justify-center"
                >
                    <div className="p-1 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                        <Download className="w-4 h-4" />
                    </div>
                    Download Full Report
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <StatCard
                    title="Total Events"
                    value="24"
                    change={12.5}
                    icon={Calendar}
                    colorClass="from-indigo-500 to-blue-500"
                    delay={0.1}
                    onClick={() => fetchReport('events')}
                />
                <StatCard
                    title="Total Attendees"
                    value="1,240"
                    change={-2.4}
                    icon={Users}
                    colorClass="from-violet-500 to-purple-500"
                    delay={0.2}
                    onClick={() => fetchReport('attendees')}
                />
                <StatCard
                    title="Revenue"
                    value="$45,200"
                    change={8.2}
                    icon={DollarSign}
                    colorClass="from-emerald-400 to-teal-500"
                    delay={0.3}
                    onClick={() => fetchReport('revenue')}
                />
                <StatCard
                    title="Growth"
                    value="15.3%"
                    change={2.1}
                    icon={TrendingUp}
                    colorClass="from-pink-500 to-rose-500"
                    delay={0.4}
                    onClick={() => fetchReport('growth')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Revenue Analytics (Clickable for Revenue Report) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => fetchReport('revenue')}
                    className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/10 relative overflow-hidden group cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
                        </div>
                        <p className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click for details</p>
                    </div>

                    {/* Chart Visual */}
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-4 pb-2 border-b border-white/5">
                        {[35, 45, 30, 60, 75, 50, 65, 80, 55, 70, 45, 60].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}% ` }}
                                transition={{ duration: 1, delay: 0.6 + (i * 0.05) }}
                                className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg relative transition-colors"
                            >
                                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-300 h-[0%] group-hover:h-full opacity-40"></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity (Clickable) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => fetchReport('activity')}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">New registration</p>
                                    <p className="text-xs text-slate-400 mt-1">Isabella registered for Tech Summit</p>
                                    <p className="text-[10px] text-slate-500 mt-2 font-medium">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider group-hover:text-white transition-colors">View All Activity</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
