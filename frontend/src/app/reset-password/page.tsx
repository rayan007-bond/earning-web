'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { showToast } = useToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            showToast('Invalid or missing reset token. Please request a new link.', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            showToast('Password reset successfully! You can now log in.', 'success');
            router.push('/login');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="mobile-container min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Invalid Link</h2>
                    <p className="text-[var(--muted)] mb-6">The password reset link is invalid or has expired.</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="px-6 py-2 bg-[var(--primary)] text-white rounded-xl font-bold"
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-container min-h-screen flex flex-col">
            {/* Header */}
            <div className="gradient-primary pt-6 pb-12 text-center flex flex-col items-center">
                <div className="w-48 h-28 transform hover:scale-105 transition-transform duration-300">
                    <img src="/logo.png" alt="PrimeLoot Logo" className="w-full h-full object-contain filter drop-shadow-2xl" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm mt-2">Create New Password</h1>
            </div>

            {/* Form Card */}
            <div className="flex-1 -mt-6 bg-[var(--background)] rounded-t-[2.5rem] p-6 shadow-2xl relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[var(--muted)]" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)] hover:text-[var(--foreground)]"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[var(--muted)]" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[var(--primary)]/20 mt-4 flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-[var(--primary)]" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
