import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, Loader2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ChecklistItem, User } from '../../types';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const { addProject } = useProjects();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [newItemText, setNewItemText] = useState('');

    const [mentees, setMentees] = useState<User[]>([]);
    const [loadingMentees, setLoadingMentees] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchMentees = async () => {
                setLoadingMentees(true);
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'intern');

                if (data) {
                    const mapped: User[] = data.map(p => ({
                        id: p.id,
                        name: p.name,
                        email: p.email,
                        role: 'intern',
                        avatar: p.avatar,
                        courseYear: p.course_year
                    }));
                    setMentees(mapped);
                }
                setLoadingMentees(false);
            };
            fetchMentees();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddChecklistItem = () => {
        if (newItemText.trim()) {
            setChecklistItems([
                ...checklistItems,
                { id: Math.random().toString(36).substr(2, 9), text: newItemText, completed: false }
            ]);
            setNewItemText('');
        }
    };

    const handleRemoveChecklistItem = (id: string) => {
        setChecklistItems(checklistItems.filter(item => item.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !assignedToId) {
            alert("Seleziona un Mentee a cui assegnare il progetto.");
            return;
        }

        setSubmitting(true);
        try {
            await addProject({
                title,
                description,
                assignedToId,
                createdById: user.id,
                status: 'todo',
                deadline: new Date(deadline).toISOString(),
            });

            // Reset form
            setTitle('');
            setDescription('');
            setDeadline('');
            setAssignedToId('');
            setChecklistItems([]);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Errore nella creazione del progetto. Riprova.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Crea Nuovo Progetto</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Titolo Progetto</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="es. Caso Studio Cardiologia"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrizione</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            placeholder="Descrivi gli obiettivi del progetto..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assegna a</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <select
                                    value={assignedToId}
                                    onChange={(e) => setAssignedToId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                                    required
                                >
                                    <option value="">Seleziona Mentee</option>
                                    {loadingMentees ? (
                                        <option disabled>Caricamento...</option>
                                    ) : (
                                        mentees.map(mentee => (
                                            <option key={mentee.id} value={mentee.id}>
                                                {mentee.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Scadenza</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    required
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Checklist Iniziale</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                placeholder="Aggiungi elemento alla checklist..."
                            />
                            <button
                                type="button"
                                onClick={handleAddChecklistItem}
                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                            >
                                Aggiungi
                            </button>
                        </div>

                        <div className="space-y-2">
                            {checklistItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                                    <span className="text-sm text-slate-700">{item.text}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveChecklistItem(item.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X className="w-4 h-4" /> {/* Changed from Trash2 to X */}
                                    </button>
                                </div>
                            ))}
                            {checklistItems.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-2 italic">Nessun elemento aggiunto ancora</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Crea Progetto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
