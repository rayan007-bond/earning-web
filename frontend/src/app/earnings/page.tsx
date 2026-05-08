'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function EarningsHistoryPage() {
    const router = useRouter();

    // Mock data for UI demonstration
    const history = [
        { id: 1, title: 'Completed Survey', amount: '+$0.50', status: 'Completed', time: '2 hours ago' },
        { id: 2, title: 'Daily Login Reward', amount: '+$0.10', status: 'Completed', time: '5 hours ago' },
        { id: 3, title: 'Watched Video Ad', amount: '+$0.05', status: 'Completed', time: 'Yesterday' },
        { id: 4, title: 'Referral Bonus', amount: '+$1.00', status: 'Completed', time: '2 days ago' },
    ];

    return (
        <div className="mobile-container pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center gap-4 p-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Earning History</h1>
                </div>
            </header>

            {/* Content */}
            <main className="p-4 space-y-4">
                <div className="card bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/10 border border-[var(--primary)]/20 shadow-lg text-center p-6 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="text-[var(--primary)] w-6 h-6" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">$1.65</div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Total Earned This Week</div>
                </div>

                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2 mt-8 mb-4">Recent Transactions</h2>

                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item.id} className="card p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                                    <CheckCircle2 className="text-[var(--success)] w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{item.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                                        <Clock size={12} />
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-[var(--success)]">{item.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
