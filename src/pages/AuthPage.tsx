import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User as UserIcon, ArrowRight, Lock, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthPage: React.FC = () => {
    // Cast to any to access new methods while we fix the context types properly if needed
    const { signIn, signUp, isAuthenticated } = useAuth() as any;
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Form states
    const [name, setName] = useState('');
    const [username, setUsername] = useState(''); // Changed from email
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('1° Anno Specializzazione'); // Unified status
    const [avatar, setAvatar] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

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

    const [error, setError] = useState<string | null>(null);

    // Clear error when switching modes
    useEffect(() => {
        setError(null);
    }, [isLogin]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        const email = `${username.toLowerCase().replace(/\s+/g, '')}@mentorflow.local`;

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    setError('Credenziali non valide. Controlla nome utente e password.');
                }
            } else {
                const { error } = await signUp(email, password, {
                    name,
                    role: 'supervisor', // Default everyone to supervisor to enable all features
                    avatar,
                    specialty: status === 'Specialista' ? 'Specialista' : undefined,
                    courseYear: status !== 'Specialista' ? status : undefined,
                    status: status // Save explicitly
                });

                if (error) {
                    setError(error.message || 'Errore durante la registrazione.');
                } else {
                    setSuccessMessage('Account creato! Accesso in corso...');
                    await signIn(email, password);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore imprevisto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-600/90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                    alt="Medical Team"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="relative z-20 flex flex-col justify-center px-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            La Tua Piattaforma <span className="text-indigo-200">Clinica</span>
                        </h1>
                        <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
                            Gestisci la tua formazione e le attività cliniche in un unico posto.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:hidden">
                        <div className="mx-auto bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">MentorFlow</h2>
                    </div>

                    <div className="bg-slate-50 p-1.5 rounded-xl flex mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Registrati
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {successMessage}
                                </motion.div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Dr. Mario Rossi"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Utente</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="mariorossi"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualifica / Anno</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    >
                                        <option value="1° Anno Specializzazione">1° Anno Specializzazione</option>
                                        <option value="2° Anno Specializzazione">2° Anno Specializzazione</option>
                                        <option value="3° Anno Specializzazione">3° Anno Specializzazione</option>
                                        <option value="4° Anno Specializzazione">4° Anno Specializzazione</option>
                                        <option value="5° Anno Specializzazione">5° Anno Specializzazione</option>
                                        <option value="Specialista">Già Specialista</option>
                                    </select>
                                </motion.div>
                            )}

                            {!isLogin && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Foto Profilo (Opzionale)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                                            {avatar ? (
                                                <img src={avatar} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserIcon className="h-8 w-8 text-slate-400" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                            Carica Foto
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Crea Account')}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    {isLogin && (
                        <div className="mt-8 text-center text-sm text-slate-500">
                            <p>Non hai un account? <button onClick={() => setIsLogin(false)} className="text-indigo-600 font-semibold hover:underline">Registrati</button></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
