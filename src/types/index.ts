export type Role = 'supervisor' | 'intern';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    specialty?: string; // For supervisors
    courseYear?: string; // For interns
}

export type ProjectStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    text: string;
    timestamp: string; // ISO string
}

export interface Project {
    id: string;
    title: string;
    description: string;
    assignedToId: string; // Intern ID
    createdById: string; // Supervisor ID
    status: ProjectStatus;
    deadline: string; // ISO string
    checklist: ChecklistItem[];
    comments: Comment[];
}
