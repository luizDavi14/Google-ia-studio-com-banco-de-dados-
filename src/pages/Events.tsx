import { useState, useEffect, useCallback, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';
import { 
    Calendar, 
    MapPin, 
    Users, 
    MoreHorizontal, 
    Plus, 
    Search, 
    Filter,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    PlayCircle,
    Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        location: '',
        capacity: 100,
        status: 'Upcoming' as const
    });

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });
        
        if (!error && data) setEvents(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('events').insert(formData);
        if (!error) {
            setIsModalOpen(false);
            setFormData({ title: '', description: '', event_date: '', location: '', capacity: 100, status: 'Upcoming' });
            fetchEvents();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir evento?')) return;
        await supabase.from('events').delete().eq('id', id);
        fetchEvents();
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Live': return <PlayCircle size={16} className="text-emerald-500" />;
            case 'Completed': return <CheckCircle2 size={16} className="text-slate-400" />;
            default: return <Clock size={16} className="text-brand-indigo" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Live': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Completed': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-indigo-50 text-brand-indigo border-indigo-100';
        }
    };

    if (isLoading && events.length === 0) return <div className="flex h-64 items-center justify-center">Carregando eventos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Gestão de Eventos</h1>
                    <p className="text-slate-500">Crie, edite e acompanhe seus próximos eventos.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-indigo text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-brand-indigo/90 transition-all"
                >
                    <Plus size={20} />
                    Novo Evento
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filtrar eventos..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Localização</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-brand-indigo rounded-lg flex items-center justify-center font-bold">
                                                    {event.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{event.title}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{event.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(event.event_date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {event.location}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleDelete(event.id)}
                                                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                                        Nenhum evento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Evento">
                <form onSubmit={handleSave} className="space-y-4">
                    <input required placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <input required placeholder="Local" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <input required type="date" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <button type="submit" disabled={isSaving} className="w-full bg-brand-indigo text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Salvar
                    </button>
                </form>
            </Modal>
        </div>
    );
}

