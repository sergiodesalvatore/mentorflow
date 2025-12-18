import React from 'react';
import type { User, Project } from '../../types';

interface InternCardProps {
    intern: User;
    projects: Project[];
}

export const InternCard: React.FC<InternCardProps> = ({ intern, projects }) => {
    const internProjects = projects.filter(p => p.assignedToId === intern.id);
    const activeProjects = internProjects.filter(p => p.status !== 'done').length;
    const completedProjects = internProjects.filter(p => p.status === 'done').length;
    const totalProjects = internProjects.length;
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={intern.avatar}
                    alt={intern.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-slate-50"
                />
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{intern.name}</h3>
                    <p className="text-slate-500 text-sm">{intern.courseYear}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-indigo-600">{activeProjects}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Attivi</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">{completedProjects}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completati</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">Tasso Completamento</span>
                    <span className="font-bold text-slate-900">{Math.round(completionRate)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
