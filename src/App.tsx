import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    Kanban, 
    Trophy, 
    MessageSquare, 
    Settings,
    LogOut,
    Plus,
    Search,
    Bell,
    ChevronRight,
    TrendingUp,
    Star,
    Award,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';

// Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Leads from './pages/Leads';
import KanbanGrid from './pages/KanbanGrid';
import Loyalty from './pages/Loyalty';
import Messages from './pages/Messages';

type Page = 'dashboard' | 'events' | 'leads' | 'kanban' | 'loyalty' | 'messages';

export default function App() {
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'kanban', label: 'Gestão/Kanban', icon: Kanban },
        { id: 'loyalty', label: 'Fidelidade', icon: Trophy },
        { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    ];

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <Dashboard />;
            case 'events': return <Events />;
            case 'leads': return <Leads />;
            case 'kanban': return <KanbanGrid />;
            case 'loyalty': return <Loyalty />;
            case 'messages': return <Messages />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside 
                className={cn(
                    "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                        <Calendar size={24} />
                    </div>
                    {isSidebarOpen && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-xl tracking-tight text-slate-800"
                        >
                            EventPro
                        </motion.span>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setActivePage(item.id as Page)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                                activePage === item.id 
                                    ? "bg-indigo-50 text-brand-indigo shadow-sm" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon size={22} className={cn(
                                activePage === item.id ? "text-brand-indigo" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {isSidebarOpen && (
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {activePage === item.id && isSidebarOpen && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="ml-auto w-1 h-5 bg-brand-indigo rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    {isSidebarOpen && (
                        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={16} className="text-brand-violet" />
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Premium</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2">Sua conta está em nível Platinum.</p>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-brand-violet" />
                            </div>
                        </div>
                    )}
                    <button className="sidebar-link w-full">
                        <Settings size={20} />
                        {isSidebarOpen && <span>Configurações</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                        >
                            <ChevronRight className={cn("transition-transform duration-300", isSidebarOpen && "rotate-180")} size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 capitalize">
                            {menuItems.find(i => i.id === activePage)?.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Pesquisar..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 rounded-xl text-sm w-64 transition-all"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="w-px h-8 bg-slate-200 mx-2" />
                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold text-slate-800">Admin User</p>
                                    <p className="text-xs text-slate-500">Administrador</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="min-h-full"
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
