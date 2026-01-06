import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, DollarSign, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const EventModal = ({ isOpen, onClose, onEventCreated }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        price: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateAI = async () => {
        if (!formData.title || !formData.location) {
            alert("Please enter a title and location first.");
            return;
        }

        setAiLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    location: formData.location,
                    // Sending existing description to refine it, or just generate new
                    currentDescription: formData.description
                })
            });
            const data = await res.json();
            if (data.description) {
                setFormData(prev => ({ ...prev, description: data.description }));
            } else {
                alert("AI could not generate a description. Check API quota.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate AI description");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('date', formData.date);
        data.append('location', formData.location);
        data.append('price', formData.price);
        data.append('description', formData.description);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type here, let browser set it for FormData
                },
                body: data
            });

            if (!res.ok) throw new Error('Failed to create event');

            const newEvent = await res.json();
            onEventCreated(newEvent);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error creating event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title</label>
                                <input
                                    name="title"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                    placeholder="e.g. Tech Summit 2025"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        name="location"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Event Cover Image</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 transition-all hover:bg-slate-50 group">
                                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Click to upload cover image</span>
                                            <span className="text-xs opacity-70 mt-1">PNG, JPG up to 5MB</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                        {/* Description with AI */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-slate-700">Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={aiLoading}
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                >
                                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    {aiLoading ? 'Magic at work...' : 'Auto-Generate with AI'}
                                </button>
                            </div>
                            <textarea
                                name="description"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[120px] resize-none font-medium text-slate-600"
                                placeholder="Describe your amazing event..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg"
                            >
                                Create Event
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
