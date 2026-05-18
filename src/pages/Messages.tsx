import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Message } from '../types';
import { 
    Send, 
    Search, 
    MoreVertical, 
    User, 
    Paperclip, 
    Smile,
    Sidebar as SidebarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        
        // Setup REALTIME listener
        const channel = supabase
            .channel('chat_messages')
            .on(
                'postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (!error && data) setMessages(data);
        setIsLoading(false);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert({
                sender_name: 'Administrador', // Mock user for demo
                content: newMessage
            });

        if (!error) setNewMessage('');
    };

    if (isLoading) return <div className="flex h-64 items-center justify-center">Iniciando chat em tempo real...</div>;

    return (
        <div className="h-full flex gap-6 bg-white overflow-hidden rounded-2xl border border-slate-200">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-slate-800">Canais</h3>
                    <SidebarIcon size={18} className="text-slate-400" />
                </div>
                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Buscar conversa..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-lg text-sm focus:ring-1 focus:ring-indigo-100 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 px-2">
                    {[
                        { name: 'Suporte Geral', msg: 'Estamos online hoje.', time: '10:45', unread: 2, active: true },
                        { name: 'Coordenação Eventos', msg: 'Pauta para amanhã?', time: '09:30', unread: 0 },
                        { name: 'Marketing', msg: 'Novas artes prontas.', time: 'Ontem', unread: 0 },
                        { name: 'Vendas VIP', msg: 'Lead interessado em VIP.', time: 'Segunda', unread: 5 },
                    ].map((chat, i) => (
                        <button 
                            key={i} 
                            className={cn(
                                "w-full p-3 rounded-xl flex items-start gap-3 transition-all",
                                chat.active ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-slate-100/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                {chat.name[0]}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-semibold text-slate-800 text-sm truncate">{chat.name}</span>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{chat.msg}</p>
                            </div>
                            {chat.unread > 0 && (
                                <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {chat.unread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold relative">
                            S
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Suporte Geral</h4>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online em Tempo Real</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Search size={18} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><MoreVertical size={18} /></button>
                    </div>
                </div>

                {/* Messages List */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
                >
                    {messages.map((msg, i) => {
                        const isMine = msg.sender_name === 'Administrador';
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: isMine ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id || i}
                                className={cn(
                                    "flex items-end gap-3",
                                    isMine ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-xs font-bold shrink-0",
                                    isMine ? "bg-indigo-600 text-white" : "bg-white text-slate-600"
                                )}>
                                    {msg.sender_name[0]}
                                </div>
                                <div className={cn(
                                    "max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm",
                                    isMine 
                                        ? "bg-indigo-600 text-white rounded-br-none" 
                                        : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                                )}>
                                    {msg.content}
                                    <div className={cn(
                                        "text-[10px] mt-1 opacity-60 flex items-center justify-end gap-1 font-medium",
                                        isMine ? "text-white" : "text-slate-400"
                                    )}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <form onSubmit={sendMessage} className="flex items-center gap-3">
                        <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escreva sua mensagem..."
                                className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all pr-10"
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500">
                                <Smile size={18} />
                            </button>
                        </div>
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className={cn(
                                "p-3 rounded-xl transition-all shadow-lg active:scale-95",
                                newMessage.trim() 
                                    ? "bg-indigo-600 text-white shadow-indigo-100" 
                                    : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                            )}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
