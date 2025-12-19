import React from 'react';
import { Filter } from 'lucide-react';
import type { ProjectStatus } from '../../types';

interface ProjectFiltersProps {
    currentFilter: ProjectStatus | 'all';
    onFilterChange: (status: ProjectStatus | 'all') => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ currentFilter, onFilterChange }) => {
    const filters: { label: string; value: ProjectStatus | 'all' }[] = [
        { label: 'Tutti', value: 'all' },
        { label: 'Da Fare', value: 'todo' },
        { label: 'In Corso', value: 'in-progress' },
        { label: 'In Revisione', value: 'review' },
        { label: 'Completati', value: 'done' },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-5 h-5 text-slate-400" />
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => onFilterChange(f.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentFilter === f.value
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};
