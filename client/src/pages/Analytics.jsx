import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsCard = ({ title, value, subtext, icon: Icon, trend, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden"
    >
        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl`} />

        <div className="flex justify-between items-start z-10">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>

        <div className="z-10">
            <h3 className="text-slate-500 text-sm font-semibold">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
    </motion.div>
);

const Bar = ({ height, label, color }) => (
    <div className="flex flex-col items-center gap-2 group cursor-pointer flex-1">
        <div className="w-full bg-slate-50 rounded-t-lg h-32 relative overflow-hidden">
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute bottom-0 w-full rounded-t-lg bg-${color}-500 group-hover:bg-${color}-600 transition-colors`}
            />
        </div>
        <span className="text-xs font-medium text-slate-400">{label}</span>
    </div>
)

const Analytics = () => {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                    <p className="text-slate-500 mt-2">Deep dive into your event performance.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                    <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        Export
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard title="Total Revenue" value="$124,500" subtext="In the last 30 days" icon={DollarSign} trend={12.5} color="indigo" />
                <AnalyticsCard title="Tickets Sold" value="3,402" subtext="Across 12 events" icon={Activity} trend={8.2} color="pink" />
                <AnalyticsCard title="Page Views" value="45.2k" subtext="Event details pages" icon={BarChart3} trend={-2.1} color="blue" />
                <AnalyticsCard title="Conversion Rate" value="4.8%" subtext="Visits to Registration" icon={TrendingUp} trend={0.5} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Revenue Trends</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Current
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="w-3 h-3 rounded-full bg-slate-200"></span> Previous
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between gap-3 h-64 w-full">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <Bar key={i} height={Math.min(100, Math.random() * 80 + 20)} label={d} color="indigo" />
                        ))}
                    </div>
                </motion.div>

                {/* Demographics / Audience */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Audience Location</h3>
                    <div className="space-y-6">
                        {[
                            { city: 'San Francisco', count: '45%', color: 'w-[45%]' },
                            { city: 'New York', count: '30%', color: 'w-[30%]' },
                            { city: 'London', count: '15%', color: 'w-[15%]' },
                            { city: 'Remote', count: '10%', color: 'w-[10%]' },
                        ].map((loc, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-slate-700">{loc.city}</span>
                                    <span className="text-slate-500">{loc.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`bg-indigo-500 h-2 rounded-full ${loc.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Device Usage</h3>
                        <div className="flex gap-4 justify-around text-center">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-sm font-bold text-slate-700">65%</span>
                            </div>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-sm font-bold text-slate-700">35%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
