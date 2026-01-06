import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import EventModal from '../components/EventModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/events');
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Events</h1>
                    <p className="text-slate-500 mt-2">Manage and track your upcoming events.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 px-6 py-3 rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Event
                </Button>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-[400px] bg-white rounded-3xl animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden border border-slate-100 relative"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <img
                                        src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000'}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-slate-900 shadow-xl">
                                        ₹{event.price}
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur text-white text-xs font-semibold mb-2 shadow-lg">
                                            <Calendar className="w-3 h-3 mr-1" /> {new Date(event.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col relative z-20 bg-white">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                        <div className="flex items-center -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                            ))}
                                            <span className="text-xs font-medium text-slate-400 pl-3">+{event.attendees} going</span>
                                        </div>

                                        <Link to={`/events/${event.id}`}>
                                            <button className="p-3 rounded-full bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white transition-all duration-300 group/btn">
                                                <ArrowRight className="w-5 h-5 group-hover/btn:-rotate-45 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEvents}
            />
        </div>
    );
};

export default Events;
