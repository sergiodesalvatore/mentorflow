import React, { useState, useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import type { ProjectStatus } from '../types';
import { Plus, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const ProjectsPage: React.FC = () => {
    const { projects, deleteProject } = useProjects();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');

    // State for modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<any>(null);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchQuery, filterStatus]);

    const handleEdit = (project: any) => {
        setProjectToEdit(project);
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setProjectToEdit(null);
    };

    const handleDelete = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
            await deleteProject(projectId);
        }
    };

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Progetti</h1>
                    <p className="text-slate-500 mt-1">Gestisci e monitora i tuoi obiettivi formativi</p>
                </div>
                <button
                    onClick={() => {
                        setProjectToEdit(null);
                        setIsCreateModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transform duration-200"
                >
                    <Plus className="w-5 h-5" />
                    Nuovo Progetto
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca progetti..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
                <ProjectFilters
                    currentFilter={filterStatus}
                    onFilterChange={setFilterStatus}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProjectId(project.id)}
                            onDelete={(e) => handleDelete(e, project.id)}
                            onEdit={(e) => { e.stopPropagation(); handleEdit(project); }}
                            currentUserRole={user?.role}
                        />
                    ))}
                </AnimatePresence>

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center py-20"
                    >
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Nessun progetto trovato</h3>
                        <p className="text-slate-500">Prova a modificare i filtri o crea un nuovo progetto.</p>
                    </motion.div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                projectToEdit={projectToEdit}
            />

            <ProjectModal
                project={selectedProject || null}
                onClose={() => setSelectedProjectId(null)}
            />
        </div>
    );
};
