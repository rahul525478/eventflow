import React, { useState } from 'react';
import { User, Bell, Shield, Lock, CreditCard, Mail, Phone, Camera, HelpCircle } from 'lucide-react';
import API_URL from '../apiConfig';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const Tab = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

const SectionHeading = ({ title, subtext }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 text-sm">{subtext}</p>
    </div>
);

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
                        <SectionHeading title="Public Profile" subtext="Manage how you appear to other users." />
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center mb-8">
                            <div className="relative mb-6 group">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                                    {user?.image ? (
                                        <img
                                            src={`${API_URL}${user.image}`}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-white"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border-4 border-white">
                                            <User className="w-12 h-12 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-slate-500 text-sm font-medium">{user?.role || 'User'} Account</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <Input label="First Name" defaultValue={user?.firstName || ''} />
                                <Input label="Last Name" defaultValue={user?.lastName || ''} />
                            </div>
                            <Input label="Email" defaultValue={user?.email || ''} type="email" />
                            <Input label="Phone" defaultValue={user?.phone || ''} type="tel" />

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 block text-left">Bio</label>
                                <textarea className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" rows="4" placeholder="Tell us about yourself..." defaultValue="Event enthusiast and tech lover." />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" isLoading={loading}>Save Changes</Button>
                            </div>
                        </form>
                    </motion.div>
                );
            case 'notifications':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
                        <SectionHeading title="Notifications" subtext="Control when and how we contact you." />
                        <div className="space-y-4">
                            {[
                                'Email me when a new event is created',
                                'Send weekly analytics reports',
                                'Notify me of successful registrations',
                                'Alert me about system maintenance'
                            ].map((item, i) => (
                                <label key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                    <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                </label>
                            ))}
                        </div>
                    </motion.div>
                );
            default:
                return <div className="text-slate-500">Select a tab to view settings.</div>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-500 mb-8">Manage your account preferences and security.</p>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-64 space-y-2">
                    <Tab icon={User} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <Tab icon={Bell} label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                    <Tab icon={Shield} label="Security" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                    <Tab icon={CreditCard} label="Billing" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                    <Tab icon={Mail} label="Integrations" isActive={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
                </div>

                <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
