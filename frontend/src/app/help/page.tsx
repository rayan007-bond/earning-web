'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, HelpCircle, Mail, ChevronDown } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function HelpPage() {
    const router = useRouter();

    const faqs = [
        {
            question: "How do I withdraw my earnings?",
            answer: "You can withdraw your earnings from the Withdraw page once you reach the minimum payout threshold. We support PayPal, Crypto, and Gift Cards."
        },
        {
            question: "When will I get paid?",
            answer: "Standard withdrawals are processed within 24-48 hours. VIP members enjoy instant withdrawals."
        },
        {
            question: "Why was my task rejected?",
            answer: "Tasks may be rejected by the offerwall provider if the instructions were not followed correctly or if you used a VPN/Proxy."
        },
        {
            question: "How does the referral program work?",
            answer: "Share your unique referral link to invite friends. You will earn a 10% commission on all their earnings for life."
        }
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
                    <h1 className="text-xl font-bold text-white">Help Center</h1>
                </div>
            </header>

            <main className="p-4 space-y-6">
                
                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="card p-4 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/10 border border-[var(--primary)]/20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <MessageCircle className="text-[var(--primary)] w-8 h-8" />
                        <span className="font-bold text-sm text-white">Live Chat</span>
                        <span className="text-[10px] text-white/50 uppercase">24/7 Support</span>
                    </button>
                    <button className="card p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                        <Mail className="text-white/60 w-8 h-8" />
                        <span className="font-bold text-sm text-white">Email Us</span>
                        <span className="text-[10px] text-white/50 uppercase">Response in 24h</span>
                    </button>
                </div>

                {/* FAQ Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <HelpCircle className="text-[var(--primary)] w-5 h-5" />
                        <h2 className="text-lg font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <details key={index} className="group card rounded-2xl bg-white/[0.02] border border-white/5 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-white">
                                    {faq.question}
                                    <ChevronDown size={16} className="text-white/40 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-4 pb-4 pt-0 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-3 mt-1 mx-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
                
            </main>

            <BottomNav />
        </div>
    );
}
