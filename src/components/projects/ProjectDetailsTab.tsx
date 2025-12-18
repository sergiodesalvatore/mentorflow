import React, { useState } from 'react';
import type { Project, ProjectStatus } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { CheckSquare, Square, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectDetailsTabProps {
    project: Project;
}

export const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ project }) => {
    const { updateProjectStatus, updateChecklist } = useProjects();
    const [newItemText, setNewItemText] = useState('');

    const handleStatusChange = (status: ProjectStatus) => {
        updateProjectStatus(project.id, status);
    };

    const toggleChecklistItem = (itemId: string) => {
        const updatedChecklist = project.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        updateChecklist(project.id, updatedChecklist);
    };

    const addChecklistItem = () => {
        if (newItemText.trim()) {
            const newItem = {
                id: Math.random().toString(36).substr(2, 9),
                text: newItemText,
                completed: false
            };
            updateChecklist(project.id, [...project.checklist, newItem]);
            setNewItemText('');
        }
    };

    const removeChecklistItem = (itemId: string) => {
        const updatedChecklist = project.checklist.filter(item => item.id !== itemId);
        updateChecklist(project.id, updatedChecklist);
    };

    const statusOptions: { value: ProjectStatus; label: string; color: string }[] = [
        { value: 'todo', label: 'Da Fare', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
        { value: 'in-progress', label: 'In Corso', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
        { value: 'review', label: 'In Revisione', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
        { value: 'done', label: 'Completato', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    ];

    return (
        <div className="space-y-8">
            {/* Status Section */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Stato</h3>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                option.color,
                                project.status === option.value ? "ring-2 ring-offset-2 ring-blue-500 shadow-sm" : "opacity-60 hover:opacity-100"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Description Section */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Descrizione</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {project.description}
                </p>
            </div>

            {/* Checklist Section */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Checklist ({project.checklist.filter(i => i.completed).length}/{project.checklist.length})
                </h3>

                <div className="space-y-2 mb-4">
                    {project.checklist.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all group",
                                item.completed ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 hover:border-blue-300"
                            )}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <button
                                    onClick={() => toggleChecklistItem(item.id)}
                                    className={cn(
                                        "transition-colors",
                                        item.completed ? "text-green-500" : "text-slate-300 hover:text-blue-500"
                                    )}
                                >
                                    {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </button>
                                <span className={cn(
                                    "text-sm transition-all",
                                    item.completed ? "text-slate-400 line-through" : "text-slate-700"
                                )}>
                                    {item.text}
                                </span>
                            </div>
                            <button
                                onClick={() => removeChecklistItem(item.id)}
                                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        placeholder="Aggiungi nuovo elemento..."
                    />
                    <button
                        onClick={addChecklistItem}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
