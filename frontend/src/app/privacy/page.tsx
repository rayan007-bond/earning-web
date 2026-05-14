'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, Eye, Database, Server } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="mobile-container pb-24 bg-[var(--background)]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center gap-4 p-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
                </div>
            </header>

            <main className="p-4 space-y-6">
                
                {/* Intro Card */}
                <div className="card p-6 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-blue-500/5 border border-[var(--primary)]/20 text-center shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-[var(--primary)] w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-black text-white mb-2">Data Protection</h2>
                    <p className="text-sm text-white/70 leading-relaxed px-2">
                        At PrimeLoot, we take your privacy seriously. This policy explains how we collect, use, and protect your personal data in compliance with global standards including the GDPR and CCPA.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Section 1 */}
                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <Database className="text-[var(--primary)] w-5 h-5" />
                            <h3 className="font-bold text-white text-lg">1. Information We Collect</h3>
                        </div>
                        <div className="text-sm text-white/60 space-y-3 leading-relaxed">
                            <p>We collect information you provide directly to us when you create an account, participate in activities, or communicate with us.</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/50">
                                <li><strong>Account Information:</strong> Email address, username, and encrypted passwords.</li>
                                <li><strong>Device Information:</strong> IP address, browser type, device identifiers, and operating system.</li>
                                <li><strong>Activity Data:</strong> Tasks completed, offerwall interactions, and withdrawal history.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <Server className="text-blue-400 w-5 h-5" />
                            <h3 className="font-bold text-white text-lg">2. How We Use Your Data</h3>
                        </div>
                        <div className="text-sm text-white/60 space-y-3 leading-relaxed">
                            <p>We use the collected information for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/50">
                                <li>To provide, maintain, and improve our services.</li>
                                <li>To process your rewards and withdrawals securely.</li>
                                <li>To detect and prevent fraud, VPN usage, and multiple accounts.</li>
                                <li>To communicate with you regarding your account or platform updates.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <Eye className="text-green-400 w-5 h-5" />
                            <h3 className="font-bold text-white text-lg">3. Third-Party Offerwalls</h3>
                        </div>
                        <div className="text-sm text-white/60 space-y-3 leading-relaxed">
                            <p>
                                PrimeLoot integrates with third-party offerwalls (e.g., CPX Research, AdGate Media). When you interact with an offerwall, you are subject to their specific Privacy Policies.
                            </p>
                            <p>
                                We share a unique, anonymous User ID with these partners to track your task completions and credit your account. We <strong>do not</strong> share your email or password with them.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <Lock className="text-orange-400 w-5 h-5" />
                            <h3 className="font-bold text-white text-lg">4. Your Rights (GDPR/CCPA)</h3>
                        </div>
                        <div className="text-sm text-white/60 space-y-3 leading-relaxed">
                            <p>Depending on your location, you have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/50">
                                <li>Access the personal data we hold about you.</li>
                                <li>Request correction of inaccurate data.</li>
                                <li>Request the permanent deletion of your account and data.</li>
                                <li>Opt-out of marketing communications.</li>
                            </ul>
                            <p className="mt-2 text-[var(--primary)] font-medium">To exercise these rights, please contact support@primeloot.com.</p>
                        </div>
                    </section>
                </div>

                <div className="text-center pt-6 pb-2">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Last Updated: May 14, 2026</p>
                    <p className="text-[10px] text-white/20 mt-1">© 2026 PrimeLoot. All rights reserved.</p>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
