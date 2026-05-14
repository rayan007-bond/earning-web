'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function TermsPrivacyPage() {
    const router = useRouter();

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
                    <h1 className="text-xl font-bold text-white">Terms & Privacy</h1>
                </div>
            </header>

            <main className="p-4 space-y-6">
                
                {/* Intro Card */}
                <div className="card p-5 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/5 border border-[var(--primary)]/20 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck className="text-[var(--primary)] w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">Your Privacy Matters</h2>
                    <p className="text-xs text-white/60 leading-relaxed px-2">
                        We are committed to protecting your personal data and being transparent about how we use it to provide you with the best earning experience.
                    </p>
                </div>

                {/* Terms Sections */}
                <div className="space-y-4">
                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="text-[var(--primary)] w-5 h-5" />
                            <h3 className="font-bold text-white">Terms of Service</h3>
                        </div>
                        <div className="text-xs text-white/50 space-y-3 leading-relaxed">
                            <p>
                                By accessing or using PrimeLoot, you agree to be bound by these terms. You must be at least 13 years old to use our services.
                            </p>
                            <p>
                                <strong>1. Account Rules:</strong> You may only create one account per person. Using VPNs, proxies, or automation tools will result in an immediate ban and forfeiture of all earnings.
                            </p>
                            <p>
                                <strong>2. Earnings & Payouts:</strong> Earnings from third-party offerwalls are subject to their specific terms and validation periods.
                            </p>
                        </div>
                    </section>

                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="text-purple-400 w-5 h-5" />
                            <h3 className="font-bold text-white">Privacy Policy</h3>
                        </div>
                        <div className="text-xs text-white/50 space-y-3 leading-relaxed">
                            <p>
                                We collect minimal personal data required to operate the platform and process your payouts securely.
                            </p>
                            <p>
                                <strong>Data Collection:</strong> We collect your email address, IP address, and payout details. We do not sell your personal data to third parties.
                            </p>
                            <p>
                                <strong>Data Security:</strong> Your data is encrypted and stored securely using industry-standard protocols.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="text-center pt-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Last Updated: May 2026</p>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
