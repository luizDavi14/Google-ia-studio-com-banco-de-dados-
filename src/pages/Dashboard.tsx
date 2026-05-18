import React, { useEffect, useState } from 'react';
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    Trophy,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    CheckCircle2
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Event, Lead } from '../types';

const retentionData = [
    { name: 'Bronze', color: '#f97316' },
    { name: 'Silver', color: '#94a3b8' },
    { name: 'Gold', color: '#f59e0b' },
    { name: 'Platinum', color: '#6366f1' },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className={cn("p-3 rounded-2xl", color)}>
                <Icon size={24} className="text-white" />
            </div>
            {change !== undefined && (
                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                    change >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                    {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(change)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
    </div>
);

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [leadsRes, eventsRes] = await Promise.all([
                supabase.from('leads').select('*').order('points', { ascending: false }),
                supabase.from('events').select('*')
            ]);

            if (leadsRes.data) setLeads(leadsRes.data);
            if (eventsRes.data) setEvents(eventsRes.data);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const totalPoints = leads.reduce((acc, curr) => acc + curr.points, 0);
    const activeEvents = events.filter(e => e.status !== 'Completed').length;
    
    const levelsCount = leads.reduce((acc: any, curr) => {
        acc[curr.loyalty_level] = (acc[curr.loyalty_level] || 0) + 1;
        return acc;
    }, {});

    const pieData = retentionData.map(d => ({
        ...d,
        value: leads.length ? Math.round((levelsCount[d.name] || 0) / leads.length * 100) : 0
    }));

    if (isLoading) return <div className="flex h-64 items-center justify-center">Carregando painel...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-800 font-sans">Bem-vindo, Admin</h1>
                <p className="text-slate-500">Aqui está o que está acontecendo com seus eventos hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total de Leads" 
                    value={leads.length.toLocaleString()} 
                    change={leads.length > 0 ? 12 : 0} 
                    icon={Users} 
                    color="bg-brand-indigo" 
                />
                <StatCard 
                    title="Eventos Ativos" 
                    value={activeEvents.toString()} 
                    icon={Calendar} 
                    color="bg-brand-violet" 
                />
                <StatCard 
                    title="Pontos Atribuídos" 
                    value={(totalPoints / 1000).toFixed(1) + 'k'} 
                    icon={Trophy} 
                    color="bg-amber-500" 
                />
                <StatCard 
                    title="Taxa de Retenção" 
                    value="78%" 
                    icon={TrendingUp} 
                    color="bg-emerald-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Níveis de Fidelidade</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Ranking de Clientes</h3>
                    <div className="space-y-4">
                        {leads.slice(0, 5).map((user, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 truncate max-w-[120px]">{user.name}</h4>
                                    <p className="text-xs text-slate-500">{user.loyalty_level}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-brand-indigo">{user.points}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pontos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Eventos mais Frequentados</h3>
                    <div className="space-y-4">
                        {events.slice(0, 3).map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="p-2 bg-indigo-50 text-brand-indigo rounded-lg">
                                    <Target size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800">{event.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-indigo" style={{ width: `${80 + i * 5}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">{80 + i * 5}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

