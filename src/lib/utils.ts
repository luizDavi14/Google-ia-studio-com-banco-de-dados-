import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number) {
    return new Intl.NumberFormat().format(points);
}

export function getLoyaltyColor(level: string) {
    switch (level) {
        case 'Platinum': return 'text-indigo-600 bg-indigo-50';
        case 'Gold': return 'text-amber-600 bg-amber-50';
        case 'Silver': return 'text-slate-500 bg-slate-50';
        default: return 'text-orange-600 bg-orange-50';
    }
}
