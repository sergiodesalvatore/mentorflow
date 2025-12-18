import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Stethoscope, GraduationCap, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [specialty, setSpecialty] = useState(user?.specialty || '');
    const [courseYear, setCourseYear] = useState(user?.courseYear || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate network delay
        setTimeout(() => {
            updateUser({
                name,
                specialty: user.role === 'supervisor' ? specialty : undefined,
                courseYear: user.role === 'intern' ? courseYear : undefined,
                avatar
            });
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Il Mio Profilo</h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-8 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg">
                                <img
                                    src={avatar || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                                <Camera className="w-5 h-5 text-slate-600" />
                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                            </label>
                        </div>
                        <div className="mb-2">
                            <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border border-indigo-100">
                                {user.role === 'supervisor' ? 'Mentor' : 'Mentee'}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">L'email non può essere modificata.</p>
                        </div>

                        {user.role === 'supervisor' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Specializzazione</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {user.role === 'intern' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Anno di Corso</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                    <select
                                        value={courseYear}
                                        onChange={(e) => setCourseYear(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSaving ? (
                                    <>Salvataggio...</>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Salva Modifiche
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
