import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    LogOut,
    Stethoscope,
    Bell,
    Search,
    Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FolderKanban, label: 'Progetti', path: '/projects' },
        { icon: Users, label: 'Team', path: '/team' },
    ];


    const [searchQuery, setSearchQuery] = React.useState('');
    const [showNotifications, setShowNotifications] = React.useState(false);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const notifications = [
        { id: 1, text: 'Nuovo commento su "Cardiologia"', time: '5 min fa', unread: true },
        { id: 2, text: 'Scadenza progetto domani', time: '1 ora fa', unread: true },
        { id: 3, text: 'Benvenuto in MentorFlow!', time: '1 giorno fa', unread: false },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white m-4 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col border border-slate-100 hidden lg:flex z-20">
                <div className="p-8 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 tracking-tight">MentorFlow</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium group relative overflow-hidden",
                                    isActive
                                        ? "text-indigo-600 bg-indigo-50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-indigo-50 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={cn("w-5 h-5 relative z-10", isActive && "text-indigo-600")} />
                                    <span className="relative z-10">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                        <NavLink to="/profile" className="flex items-center gap-3 mb-3 hover:bg-slate-100 p-2 rounded-lg transition-colors -mx-2">
                            <img
                                src={user?.avatar || 'https://via.placeholder.com/40'}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">
                                    {user?.role === 'supervisor' ? 'Mentor' : 'Mentee'}
                                </p>
                            </div>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-3 h-3" />
                            Esci
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="px-8 py-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="font-bold text-xl text-slate-900">MentorFlow</span>
                    </div>

                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {navItems.find(i => i.path === location.pathname)?.label || (location.pathname === '/profile' ? 'Profilo' : 'Panoramica')}
                        </h1>
                        <p className="text-slate-500 text-sm">Bentornato, {user?.name.split(' ')[0]}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-64">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cerca..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-3 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm border border-slate-100 group"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-900">Notifiche</h3>
                                            <span className="text-xs text-indigo-600 font-medium cursor-pointer">Segna lette</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${notif.unread ? 'bg-indigo-50/30' : ''}`}>
                                                    <p className="text-sm text-slate-800 font-medium mb-1">{notif.text}</p>
                                                    <p className="text-xs text-slate-400">{notif.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-slate-50">
                                            <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                                                Vedi tutte
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
