import React, { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';

interface AddInternModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; email: string; role: 'intern' | 'supervisor'; courseYear?: string; password?: string }) => Promise<void>;
}

export const AddInternModal: React.FC<AddInternModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'intern' as 'intern' | 'supervisor',
        courseYear: '1° Anno' // Default
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: formData.role,
                courseYear: formData.courseYear,
                password: formData.password
            });
            onClose();
            // Show credentials confirmation
            alert(`Utente creato con successo!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nComunicare queste credenziali all'utente.`);
        } catch (error) {
            console.error(error);
            alert('Errore durante l\'aggiunta dell\'utente. Potresti aver superato il limite di email o l\'utente esiste già.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Aggiungi Membro</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cognome</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                required
                                minLength={6}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 6 caratteri"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ruolo</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'intern' | 'supervisor' })}
                        >
                            <option value="intern">Mentee (Studente/Specializzando)</option>
                            <option value="supervisor">Mentor (Supervisore)</option>
                        </select>
                    </div>

                    {formData.role === 'intern' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stato / Anno</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                value={formData.courseYear}
                                onChange={(e) => setFormData({ ...formData, courseYear: e.target.value })}
                            >
                                <option value="1° Anno">1° Anno Specializzazione</option>
                                <option value="2° Anno">2° Anno Specializzazione</option>
                                <option value="3° Anno">3° Anno Specializzazione</option>
                                <option value="4° Anno">4° Anno Specializzazione</option>
                                <option value="5° Anno">5° Anno Specializzazione</option>
                                <option value="Specialista">Già Specialista</option>
                            </select>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Crea Utente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
