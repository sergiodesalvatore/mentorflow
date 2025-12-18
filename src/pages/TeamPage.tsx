import React, { useEffect, useState } from 'react';
import { InternCard } from '../components/team/InternCard';
import { AddInternModal } from '../components/team/AddInternModal';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import { Plus, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Separate client for "Invites" to avoid logging out the current user
// We use the same public credentials
const inviteClient = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://oreumuycaizvlxoudhrg.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZXVtdXljYWl6dmx4b3VkaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTAxMTUsImV4cCI6MjA4MTU4NjExNX0.SdMUYou9PIOFMgtVTuE-HhvT3GcrUtaxtVLC79-M_9c',
    {
        auth: {
            persistSession: false, // Don't persist this session
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);

export const TeamPage: React.FC = () => {
    const { projects } = useProjects();
    const { user } = useAuth();
    const [interns, setInterns] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchInterns = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'intern');

            if (error) throw error;

            if (data) {
                const mappedInterns: User[] = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    email: p.email,
                    role: 'intern',
                    avatar: p.avatar,
                    specialty: p.specialty,
                    courseYear: p.course_year
                }));
                setInterns(mappedInterns);
            }
        } catch (error) {
            console.error('Error fetching interns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterns();

        // Subscribe to changes in profiles
        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchInterns();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleAddMember = async (data: { name: string; email: string; role: 'intern' | 'supervisor'; courseYear?: string; password?: string }) => {
        // Use the isolated client to sign up the new user
        // This triggers the handle_new_user trigger in Postgres to create the profile
        const { error } = await inviteClient.auth.signUp({
            email: data.email,
            password: data.password || 'TemporaryPassword123!', // Use provided password or fallback (though UI requires it now)
            options: {
                data: {
                    name: data.name,
                    role: data.role,
                    courseYear: data.courseYear,
                    // Default avatar
                    avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`
                }
            }
        });

        if (error) throw error;

        // Refresh list
        await fetchInterns();
    };

    const handleDeleteMember = async (id: string) => {
        // Soft delete from profiles only (Auth user remains but hidden from app)
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting member:', error);
            alert('Errore eliminazione. Assicurati di avere i permessi.');
        } else {
            setInterns(interns.filter(i => i.id !== id));
        }
    };

    const isMentor = user?.role === 'supervisor';

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Il Tuo Team</h1>
                    <p className="text-slate-500 mt-1">Gestisci e monitora i progressi dei tuoi Mentee</p>
                </div>
                {isMentor && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transform duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Aggiungi Membro
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-500 animate-pulse">Caricamento team...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interns.map((intern) => (
                        <InternCard
                            key={intern.id}
                            intern={intern}
                            projects={projects}
                            onDelete={handleDeleteMember}
                        />
                    ))}
                    {interns.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">Nessun mentee trovato.</p>
                            {isMentor && <p className="text-sm text-slate-400 mt-2">Usa il tasto "Aggiungi Membro" per iniziare.</p>}
                        </div>
                    )}
                </div>
            )}

            <AddInternModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMember}
            />
        </div>
    );
};
