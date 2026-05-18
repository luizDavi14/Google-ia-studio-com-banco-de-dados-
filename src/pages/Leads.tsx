import { useState, useEffect, useCallback, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Lead } from '../types';
import { 
    Users, 
    Search, 
    Filter, 
    UserPlus, 
    Mail, 
    Phone, 
    Trophy, 
    Star,
    MoreVertical,
    ArrowUpRight,
    Award,
    Loader2,
    Trash2
} from 'lucide-react';
import { cn, getLoyaltyColor } from '../lib/utils';
import Modal from '../components/Modal';

export default function Leads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        points: 0
    });

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('points', { ascending: false });
        
        if (!error && data) setLeads(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('leads').insert(formData);
        if (!error) {
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '', points: 0 });
            fetchLeads();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir lead?')) return;
        await supabase.from('leads').delete().eq('id', id);
        fetchLeads();
    };

    const filteredLeads = leads.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading && leads.length === 0) return <div className="flex h-64 items-center justify-center">Carregando leads...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Gestão de Leads</h1>
                    <p className="text-slate-500">Acompanhe seus clientes e o desempenho da fidelidade.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-violet text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-200 hover:bg-brand-violet/90 transition-all font-sans"
                >
                    <UserPlus size={20} />
                    Adicionar Lead
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-4 flex items-center gap-4 bg-gradient-to-br from-indigo-50 to-white">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase">Total Leads</p>
                        <h4 className="text-xl font-bold text-slate-800">{leads.length}</h4>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4 bg-gradient-to-br from-amber-50 to-white">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                        <Star size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase">Leads Gold+</p>
                        <h4 className="text-xl font-bold text-slate-800">
                            {leads.filter(l => l.loyalty_level === 'Gold' || l.loyalty_level === 'Platinum').length}
                        </h4>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase">Próximo Ranking</p>
                        <h4 className="text-xl font-bold text-slate-800">8 Leads Prox. Nível</h4>
                    </div>
                </div>
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
                                placeholder="Buscar por nome ou email..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-72"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Lead</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Nível</th>
                                <th className="px-6 py-4">Pontuação</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{lead.name}</p>
                                                    <p className="text-xs text-slate-400">ID: {lead.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 truncate max-w-[150px]">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {lead.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                                                getLoyaltyColor(lead.loyalty_level)
                                            )}>
                                                <Star size={12} className="fill-current" />
                                                {lead.loyalty_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-800">
                                            {lead.points.toLocaleString()} pts
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                        Nenhum lead encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Lead">
                <form onSubmit={handleSave} className="space-y-4">
                    <input required placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <input placeholder="Telefone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <input type="number" placeholder="Pontos Iniciais" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border rounded-xl" />
                    <button type="submit" disabled={isSaving} className="w-full bg-brand-violet text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Salvar Lead
                    </button>
                </form>
            </Modal>
        </div>
    );
}

