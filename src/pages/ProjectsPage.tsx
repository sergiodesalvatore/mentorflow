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
    const [projectToEdit, setProjectToEdit] = useState<any>(null); // Use existing CreateProjectModal for editing

    // ...

    const handleEdit = (project: any) => {
        setProjectToEdit(project);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setProjectToEdit(null);
    };

    // ... inside map ...
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => setSelectedProjectId(project.id)}
                        onDelete={(e) => handleDelete(e, project.id)}
                        onEdit={(e) => { e.stopPropagation(); handleEdit(project); }} // Trigger edit
                        currentUserRole={user?.role}
                    />

    // ...

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                projectToEdit={projectToEdit}
            />

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
            />
        </div >
    );
};
