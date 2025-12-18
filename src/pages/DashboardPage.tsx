import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { StatCard } from '../components/dashboard/StatCard';
import { WorkloadChart } from '../components/dashboard/WorkloadChart';
import {
    CheckCircle,
    Clock,
    Activity,
    Users
} from 'lucide-react';



export const DashboardPage: React.FC = () => {
    const { projects } = useProjects();

    const stats = {
        activeProjects: projects.filter(p => p.status !== 'done').length,
        completedTasks: projects.filter(p => p.status === 'done').length, // Reusing 'completed' logic
        upcomingDeadlines: projects.filter(p => p.status !== 'done' && new Date(p.deadline) > new Date()).length,
        totalInterns: 15, // Placeholder
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Panoramica</h1>
                <p className="text-slate-500 mt-1">Monitora i progressi e le attività recenti</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Progetti Attivi"
                    value={stats.activeProjects}
                    icon={Activity}
                    trend="+12%"
                    trendUp={true}
                    color="blue"
                />
                <StatCard
                    label="Compiti Completati"
                    value={stats.completedTasks}
                    icon={CheckCircle}
                    trend="+5%"
                    trendUp={true}
                    color="green"
                />
                <StatCard
                    label="Scadenze Imminenti"
                    value={stats.upcomingDeadlines}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    label="Mentee Totali"
                    value={stats.totalInterns}
                    icon={Users}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Carico di Lavoro Mentee</h2>
                    <WorkloadChart />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Scadenze Recenti</h2>
                    <div className="space-y-4">
                        {projects
                            .filter(p => new Date(p.deadline) > new Date())
                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                            .slice(0, 5)
                            .map(project => (
                                <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                        <p className="text-sm text-slate-500">Scadenza: {new Date(project.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                        project.status === 'review' ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {project.status === 'in-progress' ? 'In Corso' :
                                            project.status === 'review' ? 'In Revisione' :
                                                project.status === 'todo' ? 'Da Fare' : 'Completato'}
                                    </span>
                                </div>
                            ))}
                        {projects.filter(p => new Date(p.deadline) > new Date()).length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-4">Nessuna scadenza imminente</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
