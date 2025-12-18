import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Project, ProjectStatus, ChecklistItem, Comment } from '../types';

interface ProjectContextType {
    projects: Project[];
    loading: boolean;
    addProject: (project: Omit<Project, 'id' | 'comments' | 'checklist'>) => Promise<void>;
    updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
    updateChecklist: (projectId: string, checklist: ChecklistItem[]) => Promise<void>;
    addComment: (projectId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedProjects: Project[] = data.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    assignedToId: p.assigned_to_id,
                    createdById: p.created_by_id,
                    status: p.status as ProjectStatus,
                    deadline: p.deadline,
                    checklist: p.checklist || [],
                    comments: p.comments || []
                }));
                setProjects(mappedProjects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchProjects();

        // Realtime subscription
        const channel = supabase
            .channel('public:projects')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchProjects();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addProject = async (projectData: Omit<Project, 'id' | 'comments' | 'checklist'>) => {
        if (!user) return;

        const { error } = await supabase.from('projects').insert({
            title: projectData.title,
            description: projectData.description,
            assigned_to_id: projectData.assignedToId,
            created_by_id: user.id, // Current user is the creator
            status: projectData.status,
            deadline: projectData.deadline,
            checklist: [],
            comments: []
        });

        if (error) {
            console.error('Error adding project:', error);
            throw error;
        }
    };

    const updateProjectStatus = async (id: string, status: ProjectStatus) => {
        const { error } = await supabase
            .from('projects')
            .update({ status })
            .eq('id', id);

        if (error) console.error('Error updating status:', error);
    };

    const updateChecklist = async (projectId: string, checklist: ChecklistItem[]) => {
        const { error } = await supabase
            .from('projects')
            .update({ checklist })
            .eq('id', projectId);

        if (error) console.error('Error updating checklist:', error);
    };

    const addComment = async (projectId: string, commentData: Omit<Comment, 'id' | 'timestamp'>) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const newComment: Comment = {
            id: Math.random().toString(36).substr(2, 9), // ID generation for JSONB array item
            userId: commentData.userId,
            text: commentData.text,
            timestamp: new Date().toISOString()
        };

        const updatedComments = [...project.comments, newComment];

        const { error } = await supabase
            .from('projects')
            .update({ comments: updatedComments })
            .eq('id', projectId);

        if (error) console.error('Error adding comment:', error);
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    };

    const getProject = (id: string) => projects.find(p => p.id === id);

    return (
        <ProjectContext.Provider value={{
            projects,
            loading,
            addProject,
            updateProjectStatus,
            updateChecklist,
            addComment,
            deleteProject,
            getProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
