'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to process request');
            }

            setIsSubmitted(true);
            showToast('If the email exists, a reset link has been sent.', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mobile-container min-h-screen flex flex-col">
            {/* Header */}
            <div className="gradient-primary pt-6 pb-12 text-center flex flex-col items-center relative">
                <button 
                    onClick={() => router.back()} 
                    className="absolute top-6 left-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-48 h-28 transform hover:scale-105 transition-transform duration-300">
                    <img src="/logo.png" alt="PrimeLoot Logo" className="w-full h-full object-contain filter drop-shadow-2xl" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm mt-2">Reset Password</h1>
            </div>

            {/* Form Card */}
            <div className="flex-1 -mt-6 bg-[var(--background)] rounded-t-[2.5rem] p-6 shadow-2xl relative z-10">
                {!isSubmitted ? (
                    <>
                        <p className="text-sm text-[var(--muted)] text-center mb-6">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-[var(--muted)]" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[var(--primary)]/20 mt-4 flex justify-center items-center"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Check your email</h2>
                        <p className="text-[var(--muted)] text-sm mb-6">
                            We've sent password reset instructions to <br/>
                            <span className="font-semibold text-[var(--foreground)]">{email}</span>
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full py-3.5 bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--card-hover)] text-[var(--foreground)] rounded-xl font-bold transition-all"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
