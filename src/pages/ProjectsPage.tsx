import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import type { ProjectStatus } from '../types';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
    const { projects, deleteProject } = useProjects();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Update search query if URL param changes
    React.useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const filteredProjects = projects.filter(project => {
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
            await deleteProject(id);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Progetti</h1>
                    <p className="text-slate-500 mt-1">Gestisci e monitora tutte le ricerche e le attività in corso</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transform duration-200"
                >
                    <Plus className="w-5 h-5" />
                    Nuovo Progetto
                </button>
            </div>

            <ProjectFilters
                statusFilter={filterStatus}
                onStatusFilterChange={setFilterStatus}
                search={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => setSelectedProjectId(project.id)}
                        onDelete={(e) => handleDelete(e, project.id)}
                        currentUserRole={user?.role}
                    />
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-500 text-lg">Nessun progetto trovato con i criteri selezionati.</p>
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
            />
        </div>
    );
};
