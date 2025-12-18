import React from 'react';
import { InternCard } from '../components/team/InternCard';
import { useProjects } from '../context/ProjectContext';
import type { User } from '../types';

export const TeamPage: React.FC = () => {
    const { projects } = useProjects();

    // Mock Interns Data (In real app, fetch from API/Context)
    const interns: User[] = [
        {
            id: '2',
            name: 'John Doe',
            email: 'john@student.com',
            role: 'intern',
            courseYear: '3rd Year',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop'
        },
        {
            id: '3',
            name: 'Alice Cooper',
            email: 'alice@student.com',
            role: 'intern',
            courseYear: '4th Year',
            avatar: 'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?q=80&w=200&auto=format&fit=crop'
        },
        {
            id: '4',
            name: 'Robert Fox',
            email: 'robert@student.com',
            role: 'intern',
            courseYear: '2nd Year',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Il Tuo Team</h1>
                <p className="text-slate-500 mt-1">Gestisci e monitora i progressi dei tuoi Mentee</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interns.map((intern) => (
                    <InternCard
                        key={intern.id}
                        intern={intern}
                        projects={projects}
                    />
                ))}
            </div>
        </div>
    );
};
