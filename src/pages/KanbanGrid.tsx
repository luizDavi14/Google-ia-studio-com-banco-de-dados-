import { useState, useEffect, useCallback, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { KanbanTask } from '../types';
import { 
    Plus, 
    MoreHorizontal, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    GripVertical,
    Calendar,
    Filter,
    Loader2,
    Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';

type Status = KanbanTask['status'];

const COLUMNS: { id: Status; label: string; color: string }[] = [
    { id: 'Todo', label: 'Para Fazer', color: 'bg-slate-500' },
    { id: 'In Progress', label: 'Em Progresso', color: 'bg-blue-500' },
    { id: 'Review', label: 'Em Revisão', color: 'bg-amber-500' },
    { id: 'Done', label: 'Concluído', color: 'bg-emerald-500' },
];

export default function KanbanGrid() {
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Todo' as Status,
        priority: 'Medium' as const
    });

    const fetchTasks = useCallback(async () => {
        const { data, error } = await supabase
            .from('kanban_tasks')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) setTasks(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTasks();
        const sub = supabase.channel('kanban_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_tasks' }, fetchTasks).subscribe();
        return () => { sub.unsubscribe(); };
    }, [fetchTasks]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('kanban_tasks').insert(formData);
        if (!error) {
            setIsModalOpen(false);
            setFormData({ title: '', description: '', status: 'Todo', priority: 'Medium' });
            fetchTasks();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir tarefa?')) return;
        await supabase.from('kanban_tasks').delete().eq('id', id);
        fetchTasks();
    };

    const handleUpdateStatus = async (id: string, status: Status) => {
        await supabase.from('kanban_tasks').update({ status }).eq('id', id);
        fetchTasks();
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-rose-600 bg-rose-50';
            case 'Medium': return 'text-amber-600 bg-amber-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    if (isLoading && tasks.length === 0) return <div className="flex h-64 items-center justify-center">Carregando quadro...</div>;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quadro Kanban</h1>
                    <p className="text-slate-500">Gestão visual de tarefas e preparativos de eventos.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-indigo text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg"
                >
                    <Plus size={20} />
                    Nova Tarefa
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-max pr-6">
                    {COLUMNS.map((column) => {
                        const columnTasks = tasks.filter(t => t.status === column.id);
                        return (
                            <div key={column.id} className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", column.color)} />
                                        <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">{column.label}</span>
                                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{columnTasks.length}</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-100/50 rounded-2xl p-2 space-y-3 overflow-y-auto border border-slate-200/50">
                                    {columnTasks.map((task) => (
                                        <motion.div layout key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all group">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ring-1 ring-inset", getPriorityStyles(task.priority))}>
                                                    {task.priority}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleDelete(task.id)}
                                                        className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{task.title}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                                            
                                            <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-50">
                                                <div className="flex gap-1">
                                                    {COLUMNS.filter(c => c.id !== column.id).map(c => (
                                                        <button 
                                                            key={c.id}
                                                            onClick={() => handleUpdateStatus(task.id, c.id)}
                                                            className="text-[10px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
                                                            title={`Mover para ${c.label}`}
                                                        >
                                                            {c.label.split(' ')[0]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Tarefa">
                <form onSubmit={handleSave} className="space-y-4">
                    <input required placeholder="Título da tarefa" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})} className="w-full px-4 py-2 border rounded-xl">
                        <option value="Low">Prioridade Baixa</option>
                        <option value="Medium">Prioridade Média</option>
                        <option value="High">Prioridade Alta</option>
                    </select>
                    <textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                    <button type="submit" disabled={isSaving} className="w-full bg-brand-indigo text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Adicionar Tarefa
                    </button>
                </form>
            </Modal>
        </div>
    );
}

