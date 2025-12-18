import React, { useState, useRef, useEffect } from 'react';
import type { Project } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../../services/ai';

interface ProjectDiscussionTabProps {
    project: Project;
}

export const ProjectDiscussionTab: React.FC<ProjectDiscussionTabProps> = ({ project }) => {
    const { addComment } = useProjects();
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [project.comments]);

    const handleAddComment = () => {
        if (newComment.trim() && user) {
            addComment(project.id, {
                userId: user.id,
                text: newComment,
            });
            setNewComment('');
        }
    };

    const handleSmartReply = async () => {
        setIsGenerating(true);
        const lastComment = project.comments.length > 0
            ? project.comments[project.comments.length - 1].text
            : "No comments yet.";

        const suggestion = await aiService.generateSmartReply(project.description, lastComment);
        setNewComment(suggestion);
        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {project.comments.length === 0 && (
                    <div className="text-center text-slate-400 py-10">
                        <p>No comments yet. Start the discussion!</p>
                    </div>
                )}

                {project.comments.map((comment) => {
                    const isMe = comment.userId === user?.id;
                    // In real app, resolve user details from ID
                    const commentUser = comment.userId === '1' ? 'Dr. Sarah Smith' : 'John Doe';
                    const avatar = comment.userId === '1'
                        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop'
                        : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop';

                    return (
                        <div key={comment.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <img
                                src={avatar}
                                alt={commentUser}
                                className="w-8 h-8 rounded-full object-cover mt-1"
                            />
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-slate-600">{commentUser}</span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                    }`}>
                                    {comment.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={handleSmartReply}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {isGenerating ? 'Generando...' : 'Risposta Smart'}
                    </button>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Scrivi un commento..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
