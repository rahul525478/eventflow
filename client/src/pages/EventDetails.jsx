
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Share2, ArrowLeft, Clock, Shield, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import API_URL from '../apiConfig';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        fetch(`${API_URL} /events/${id} `)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Event not found');
                }
                return res.json();
            })
            .then(data => setEvent(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
        // Simulate API call
        setTimeout(() => {
            setRegistering(false);
            setRegistered(true);
        }, 1500);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>;
    if (!event) return <div className="text-center py-20 text-slate-500">Event not found</div>;

    return (
        <div className="space-y-8 -mt-8 -mx-8">
            {/* Immersive Hero Section */}
            <div className="relative h-[500px] w-full group overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <img src={event.image} alt={event.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]" />

                <div className="absolute top-8 left-8 z-20">
                    <Link to="/events" className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all font-medium text-sm border border-white/10">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-10 z-20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex gap-4 mb-4">
                                <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-indigo-500/20">Featured Event</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl shadow-sm">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-white/90 font-medium text-lg">
                                <span className="flex items-center bg-white/5 backdrop-blur px-4 py-2 rounded-lg border border-white/10"><Calendar className="w-5 h-5 mr-3 text-indigo-300" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="flex items-center bg-white/5 backdrop-blur px-4 py-2 rounded-lg border border-white/10"><MapPin className="w-5 h-5 mr-3 text-pink-300" /> {event.location}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                                About this Event
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{event.description}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100"
                        >
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">What to expect</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['World-class Speakers', 'Interactive Workshops', 'Networking Sessions', 'After-party Access', 'Exclusive Merch', 'Gourmet Catering'].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-28 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Ticket Price</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-bold text-slate-900">₹{event.price}</span>
                                            <span className="text-slate-400 font-medium">/person</span>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {registered ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center bg-emerald-50 text-emerald-600 p-6 rounded-2xl border border-emerald-100"
                                        >
                                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <h4 className="font-bold text-xl mb-1">You're In!</h4>
                                            <p className="text-sm opacity-80">Check your email for your ticket.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleRegister} className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                                                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                                                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required placeholder="john@example.com" />
                                            </div>

                                            <Button type="submit" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 rounded-xl" isLoading={registering}>
                                                Register Now
                                            </Button>
                                            <p className="text-xs text-center text-slate-400 mt-4">Limited spots available. Book yours today!</p>
                                        </form>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200 flex items-center justify-center gap-2 transition-colors">
                                    <Heart className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
