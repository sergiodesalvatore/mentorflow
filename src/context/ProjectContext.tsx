import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Project, ProjectStatus, ChecklistItem, Comment } from '../types';

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'comments'>) => void;
    updateProjectStatus: (id: string, status: ProjectStatus) => void;
    updateChecklist: (projectId: string, checklist: ChecklistItem[]) => void;
    addComment: (projectId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
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

// Mock Data
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Cardiology Case Study: Arrhythmia',
        description: 'Analyze the patient data from Case #402 and propose a treatment plan.',
        assignedToId: '2', // John Doe
        createdById: '1', // Dr. Sarah Smith
        status: 'in-progress',
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        checklist: [
            { id: 'c1', text: 'Review patient history', completed: true },
            { id: 'c2', text: 'Analyze ECG data', completed: false },
            { id: 'c3', text: 'Draft treatment plan', completed: false },
        ],
        comments: [
            { id: 'cm1', userId: '1', text: 'Please pay attention to the QRS complex.', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    {
        id: '2',
        title: 'Neurology Research Paper',
        description: 'Literature review on recent advancements in Alzheimer treatment.',
        assignedToId: '2',
        createdById: '1',
        status: 'todo',
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        checklist: [
            { id: 'c1', text: 'Select 10 key papers', completed: false },
            { id: 'c2', text: 'Write abstract', completed: false },
        ],
        comments: []
    },
    {
        id: '3',
        title: 'Emergency Room Rotation Log',
        description: 'Complete the logbook for the 2-week ER rotation.',
        assignedToId: '2',
        createdById: '1',
        status: 'review',
        deadline: new Date(Date.now() - 86400000).toISOString(), // Overdue
        checklist: [
            { id: 'c1', text: 'Week 1 Log', completed: true },
            { id: 'c2', text: 'Week 2 Log', completed: true },
            { id: 'c3', text: 'Supervisor Signature', completed: false },
        ],
        comments: []
    }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('mentorflow_projects');
        if (stored) {
            setProjects(JSON.parse(stored));
        } else {
            setProjects(MOCK_PROJECTS);
            localStorage.setItem('mentorflow_projects', JSON.stringify(MOCK_PROJECTS));
        }
    }, []);

    const saveProjects = (newProjects: Project[]) => {
        setProjects(newProjects);
        localStorage.setItem('mentorflow_projects', JSON.stringify(newProjects));
    };

    const addProject = (projectData: Omit<Project, 'id' | 'comments'>) => {
        const newProject: Project = {
            ...projectData,
            id: Math.random().toString(36).substr(2, 9),
            comments: []
        };
        saveProjects([...projects, newProject]);
    };

    const updateProjectStatus = (id: string, status: ProjectStatus) => {
        const updated = projects.map(p => p.id === id ? { ...p, status } : p);
        saveProjects(updated);
    };

    const updateChecklist = (projectId: string, checklist: ChecklistItem[]) => {
        const updated = projects.map(p => p.id === projectId ? { ...p, checklist } : p);
        saveProjects(updated);
    };

    const addComment = (projectId: string, commentData: Omit<Comment, 'id' | 'timestamp'>) => {
        const newComment: Comment = {
            ...commentData,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString()
        };
        const updated = projects.map(p => {
            if (p.id === projectId) {
                return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
        });
        saveProjects(updated);
    };

    const getProject = (id: string) => projects.find(p => p.id === id);

    return (
        <ProjectContext.Provider value={{ projects, addProject, updateProjectStatus, updateChecklist, addComment, getProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
