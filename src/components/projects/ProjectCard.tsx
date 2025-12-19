import React from 'react';
import type { Project, Role } from '../../types';
import { CheckSquare, Clock, AlertCircle, Trash2, Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    project: Project;
    onClick: (project: Project) => void;
    onDelete?: (e: React.MouseEvent) => void;
    onEdit?: (e: React.MouseEvent) => void;
    currentUserRole?: Role;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete, onEdit, currentUserRole }) => {
    const completedTasks = project.checklist.filter(i => i.completed).length;
    const totalTasks = project.checklist.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'done';

    const statusColors = {
        'todo': 'bg-slate-100 text-slate-600 border-slate-200',
        'in-progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'review': 'bg-purple-50 text-purple-600 border-purple-100',
        'done': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    };

    const statusLabels = {
        'todo': 'Da Fare',
        'in-progress': 'In Corso',
        'review': 'In Revisione',
        'done': 'Completato',
    };

    return (
        <motion.div
            layoutId={`project-${project.id}`}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onClick(project)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all cursor-pointer group relative overflow-hidden"
        >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide",
                        statusColors[project.status]
                    )}>
                        {statusLabels[project.status]}
                    </span>
                    {currentUserRole === 'supervisor' && (
                        <div className="flex items-center gap-1">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Modifica Progetto"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Elimina Progetto"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {isOverdue && (
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs font-bold">Scaduto</span>
                    </div>
                )}
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {project.title}
            </h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                {project.description}
            </p>

            <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-600 flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                            {completedTasks}/{totalTasks} Tasks
                        </span>
                        <span className="font-bold text-indigo-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                progress === 100 ? "bg-emerald-500" : "bg-indigo-500"
                            )}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>

                    {/* Avatar Stack Placeholder */}
                    <div className="flex -space-x-2">
                        <img
                            src={`https://ui-avatars.com/api/?name=${project.assignedToId}&background=random`}
                            alt="Assignee"
                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
