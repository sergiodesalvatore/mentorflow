import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ProjectStatus } from '../../types';

interface ProjectFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: ProjectStatus | 'all';
    onStatusFilterChange: (value: ProjectStatus | 'all') => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cerca progetti..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter className="w-5 h-5 text-slate-400" />
                {(['all', 'todo', 'in-progress', 'review', 'done'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusFilterChange(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {status === 'all' ? 'Tutti' :
                            status === 'todo' ? 'Da Fare' :
                                status === 'in-progress' ? 'In Corso' :
                                    status === 'review' ? 'In Revisione' : 'Completati'}
                    </button>
                ))}
            </div>
        </div>
    );
};
