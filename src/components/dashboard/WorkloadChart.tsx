import React from 'react';
import { useProjects } from '../../context/ProjectContext';

export const WorkloadChart: React.FC = () => {
    const { projects } = useProjects();

    // Mock intern data (in a real app, we'd fetch users)
    const interns = [
        { id: '2', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop' },
        { id: '3', name: 'Alice Cooper', avatar: 'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?q=80&w=200&auto=format&fit=crop' }, // Mock extra intern
    ];

    const getWorkload = (internId: string) => {
        const internProjects = projects.filter(p => p.assignedToId === internId && p.status !== 'done');
        return internProjects.length;
    };

    const MAX_PROJECTS = 5; // Threshold for "full" workload

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Intern Workload</h3>
            <div className="space-y-6">
                {interns.map(intern => {
                    const count = getWorkload(intern.id);
                    const percentage = Math.min((count / MAX_PROJECTS) * 100, 100);

                    return (
                        <div key={intern.id}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <img src={intern.avatar} alt={intern.name} className="w-8 h-8 rounded-full object-cover" />
                                    <span className="font-medium text-slate-700">{intern.name}</span>
                                </div>
                                <span className="text-sm text-slate-500">{count} Active Projects</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-orange-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
