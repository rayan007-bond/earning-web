'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Key, Smartphone, Mail, AlertTriangle } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';
import { useToast } from '@/components/ui/Toast';

export default function SecurityPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Password updated successfully', 'success');
    };

    const handleToggle2FA = () => {
        setIs2FAEnabled(!is2FAEnabled);
        showToast(is2FAEnabled ? '2FA disabled' : '2FA enabled', 'info');
    };

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
                    <h1 className="text-xl font-bold text-white">Security Settings</h1>
                </div>
            </header>

            <main className="p-4 space-y-6">
                
                {/* 2FA Section */}
                <section>
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2 mb-3">Two-Factor Authentication</h2>
                    <div className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                                <Smartphone className="text-[var(--primary)] w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">Authenticator App</h3>
                                <p className="text-xs text-white/50 leading-relaxed mb-4">
                                    Use an authenticator app (like Google Authenticator) to generate one-time codes.
                                </p>
                                <button 
                                    onClick={handleToggle2FA}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                        is2FAEnabled 
                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                                            : 'bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20'
                                    }`}
                                >
                                    {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Change Password Section */}
                <section>
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2 mb-3">Change Password</h2>
                    <div className="card p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-1">Current Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-1">New Password</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-opacity">
                                Update Password
                            </button>
                        </form>
                    </div>
                </section>

                {/* Account Actions */}
                <section>
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2 mb-3">Danger Zone</h2>
                    <div className="card p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="text-red-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-500">Delete Account</h3>
                                <p className="text-xs text-red-400/60">This action cannot be undone</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                            Delete
                        </button>
                    </div>
                </section>

            </main>

            <BottomNav />
        </div>
    );
}
