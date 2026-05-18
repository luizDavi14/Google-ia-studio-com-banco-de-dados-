import { 
    Trophy, 
    Star, 
    Award, 
    Zap, 
    Gift, 
    ArrowRight, 
    CheckCircle2,
    Target,
    Activity,
    Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, getLoyaltyColor } from '../lib/utils';

const LEVELS = [
    {
        id: 'Bronze',
        points: '0 - 99',
        icon: Star,
        color: 'text-orange-600 bg-orange-50 border-orange-100',
        benefits: [
            'Newsletter exclusiva',
            'Acesso antecipado a ingressos (2h)',
            'Certificado de participação digital'
        ]
    },
    {
        id: 'Silver',
        points: '100 - 249',
        icon: Trophy,
        color: 'text-slate-500 bg-slate-50 border-slate-100',
        benefits: [
            'Tudo do Bronze',
            'Desconto de 5% em todos eventos',
            'Check-in prioritário',
            'Badge de destaque no perfil'
        ]
    },
    {
        id: 'Gold',
        points: '250 - 499',
        icon: Award,
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        benefits: [
            'Tudo do Silver',
            'Desconto de 15% em todos eventos',
            'Kit boas-vindas físico',
            'Área reservada em eventos presenciais'
        ]
    },
    {
        id: 'Platinum',
        points: '500+',
        icon: Zap,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        benefits: [
            'Tudo do Gold',
            'Ingresso VIP gratuito por ano',
            'Concierge dedicado',
            'Acesso a eventos fechados (Invite-only)',
            'Brindes premium de parceiros'
        ]
    }
];

export default function Loyalty() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-800">Sistema de Fidelidade</h1>
                <p className="text-slate-500">Regras de pontuação, níveis e benefícios desbloqueáveis.</p>
            </div>

            {/* Score Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-brand-indigo">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Gift size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Como Ganhar Pontos</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            { action: '1 Ingresso Comprado', points: '+10 pontos', desc: 'Pontos creditados após a confirmação do pagamento.' },
                            { action: 'Presença Confirmada', points: '+20 pontos', desc: 'Escaneie seu QR Code na entrada do evento.' },
                            { action: 'Indicação de Lead', points: '+50 pontos', desc: 'Quando seu indicado se registrar em um evento.' },
                        ].map((rule, i) => (
                            <li key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="mt-1 w-2 h-2 rounded-full bg-brand-indigo shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-800 text-sm">{rule.action}</span>
                                        <span className="text-brand-indigo font-black text-sm">{rule.points}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{rule.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-brand-violet">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                            <Target size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Resgate de Pontos</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { item: 'Cupom de 20% OFF', value: '50 pontos', icon: Activity },
                            { item: 'Upgrade para VIP', value: '100 pontos', icon: Zap },
                            { item: 'Ingresso Inteiro Grátis', value: '500 pontos', icon: Award }
                        ].map((reward, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-violet">
                                    <reward.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm">{reward.item}</h4>
                                    <p className="text-xs text-brand-violet font-bold uppercase tracking-widest">{reward.value}</p>
                                </div>
                                <button className="text-slate-400 hover:text-brand-violet transition-colors">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Level Comparison */}
            <h2 className="text-xl font-bold text-slate-800 pt-4">Níveis de Estrutura</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {LEVELS.map((level, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={level.id} 
                        className="glass-card flex flex-col p-6 h-full relative overflow-hidden group"
                    >
                        <div className={cn("absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500", level.color.split(' ')[1])} />
                        
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border", level.color)}>
                            <level.icon size={28} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{level.id}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{level.points} PONTOS</p>
                        
                        <div className="space-y-4 flex-1">
                            {level.benefits.map((benefit, j) => (
                                <div key={j} className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className={cn("mt-0.5 shrink-0", level.color.split(' ')[0])} />
                                    <span className="text-sm text-slate-600 leading-tight">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <button className={cn(
                            "mt-8 w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95",
                            level.id === 'Bronze' ? "bg-slate-100 text-slate-600 shadow-none cursor-default" : "bg-white border border-slate-200 text-slate-700 hover:border-brand-indigo hover:text-brand-indigo"
                        )}>
                            {level.id === 'Bronze' ? 'Nível Inicial' : 'Ver Detalhes'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Loyalty Stats */}
            <div className="glass-card p-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white relative overflow-hidden">
                <Users size={200} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Visão Geral da Comunidade</h3>
                            <p className="text-indigo-100 max-w-md">Mais de 85% dos seus leads estão engajados em algum nível de fidelidade. A retenção aumentou 24% no último trimestre.</p>
                        </div>
                        <div className="flex gap-10">
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1">Total Bronze</p>
                                <p className="text-3xl font-black">542</p>
                            </div>
                            <div className="w-px h-12 bg-white/20 self-center" />
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1">Membros VIP</p>
                                <p className="text-3xl font-black">48</p>
                            </div>
                            <div className="w-px h-12 bg-white/20 self-center" />
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1">Pts Distribuídos</p>
                                <p className="text-3xl font-black">128k</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
