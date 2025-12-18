import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: 'blue' | 'green' | 'orange' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = 'blue'
}) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        green: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl transition-colors duration-300", colorStyles[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full border",
                        trendUp
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1 group-hover:text-slate-600 transition-colors">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};
