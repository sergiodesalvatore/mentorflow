import React, { useState, useEffect } from 'react';
import type { Project } from '../../types';
import { X, AlertTriangle } from 'lucide-react';
import { ProjectDetailsTab } from './ProjectDetailsTab';
import { ProjectDiscussionTab } from './ProjectDiscussionTab';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/ai';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'discussion'>('details');
    const [riskAnalysis, setRiskAnalysis] = useState<{ riskLevel: string; reason: string } | null>(null);

    useEffect(() => {
        if (project) {
            const fetchRisk = async () => {
                const completed = project.checklist.filter(i => i.completed).length;
                const result = await aiService.analyzeRisk(
                    project.title,
                    project.status,
                    project.deadline,
                    completed,
                    project.checklist.length
                );
                setRiskAnalysis(result);
            };
            fetchRisk();
        }
    }, [project]);

    if (!project) return null;

    const isHighRisk = riskAnalysis?.riskLevel === 'High';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                <motion.div
                    layoutId={`project-${project.id}`}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">{project.title}</h2>
                                {isHighRisk && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Alto Rischio</span>
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm">Scadenza: {new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 px-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={cn(
                                "px-6 py-4 text-sm font-medium border-b-2 transition-colors relative",
                                activeTab === 'details'
                                    ? "text-indigo-600 border-indigo-600"
                                    : "text-slate-500 border-transparent hover:text-slate-700"
                            )}
                        >
                            Dettagli & Checklist
                        </button>
                        <button
                            onClick={() => setActiveTab('discussion')}
                            className={cn(
                                "px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                                activeTab === 'discussion'
                                    ? "text-indigo-600 border-indigo-600"
                                    : "text-slate-500 border-transparent hover:text-slate-700"
                            )}
                        >
                            Discussione
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                                {project.comments.length}
                            </span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'details' ? (
                                    <ProjectDetailsTab project={project} />
                                ) : (
                                    <ProjectDiscussionTab project={project} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
