import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

// Using a slightly more flexible User type for display
interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    specialty?: string;
    course_year?: string;
    status?: string;
}

export const TeamPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();

        // Subscribe to changes
        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchTeam();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchTeam = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) setTeam(data);
        } catch (error) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Il Team</h1>
                    <p className="text-slate-500 mt-1">Tutti i membri della piattaforma</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-all group"
                    >
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform">
                                <img
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center bg-indigo-500`}>
                                <User className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>

                        {/* Display Username (email without domain) */}
                        <p className="text-sm text-slate-400 font-medium mb-3">
                            @{member.email?.split('@')[0]}
                        </p>

                        <div className="flex flex-col gap-2 w-full mt-2">
                            {(member.status || member.course_year || member.specialty) && (
                                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    {member.status || member.course_year || member.specialty}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
