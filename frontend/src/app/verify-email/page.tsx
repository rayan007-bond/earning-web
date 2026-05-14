'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, Sparkles, Gift, Zap, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    
    // Get email from URL parameters
    const email = searchParams.get('email');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (!email) {
            setStatus('error');
            setMessage('No email address provided. Please register or login.');
        }
    }, [email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;
        
        if (otp.length < 6) {
            showToast('Please enter the 6-digit code', 'error');
            return;
        }

        setStatus('loading');
        
        try {
            const response = await api.verifyEmail(email, otp);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            setStatus('success');
            setMessage('Your email has been verified successfully!');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Verification failed. The code may be invalid.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="card text-center overflow-hidden">
                    {/* Default Input State */}
                    {(status === 'idle' || status === 'error') && (
                        <>
                            <div className="mb-6">
                                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                                    <Mail className="text-[var(--primary)]" size={40} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                            <p className="text-[var(--muted)] mb-2">
                                We sent a 6-digit code to:
                            </p>
                            <p className="font-semibold text-[var(--primary)] mb-6">{email}</p>
                            
                            {status === 'error' && email && (
                                <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-500/20">
                                    {message}
                                </div>
                            )}

                            {email ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="Enter 6-digit code"
                                            className="input text-center text-2xl tracking-[0.5em] font-mono h-16"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            disabled={!email}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!email || otp.length < 6}
                                        className="btn btn-primary w-full py-4 text-base"
                                    >
                                        Verify Account
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-500/20">
                                    No email provided. Please go back to the registration page.
                                </div>
                            )}
                            
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-sm text-[var(--primary)] hover:underline"
                                >
                                    Already verified? Login here
                                </button>
                            </div>
                        </>
                    )}

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div className="py-8">
                            <div className="mb-6">
                                <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                                    <Loader2 className="text-[var(--primary)] animate-spin" size={40} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Verifying Code...</h1>
                            <p className="text-[var(--muted)]">Please wait a moment</p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <>
                            {/* Confetti-like animation */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
                                        <CheckCircle className="text-white" size={50} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="text-yellow-500" size={24} />
                                    <h1 className="text-2xl font-bold text-green-500">You're Verified!</h1>
                                    <Sparkles className="text-yellow-500" size={24} />
                                </div>

                                <p className="text-lg font-medium mb-2">Welcome to PrimeLoot! 🎉</p>
                                <p className="text-[var(--muted)] mb-6">
                                    Your account is now active. Start completing tasks and earning real money today!
                                </p>

                                {/* Benefits Preview */}
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-around text-sm">
                                        <div className="text-center">
                                            <Gift className="text-[var(--primary)] mx-auto mb-1" size={20} />
                                            <span className="text-[var(--muted)]">Free Tasks</span>
                                        </div>
                                        <div className="text-center">
                                            <Zap className="text-yellow-500 mx-auto mb-1" size={20} />
                                            <span className="text-[var(--muted)]">Instant Pay</span>
                                        </div>
                                        <div className="text-center">
                                            <Sparkles className="text-purple-500 mx-auto mb-1" size={20} />
                                            <span className="text-[var(--muted)]">VIP Bonus</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="btn gradient-primary text-white font-semibold px-8 py-4 rounded-xl w-full flex items-center justify-center gap-2 text-lg hover:scale-105 transition-transform"
                                >
                                    Start Earning Now
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 size={40} className="animate-spin text-[var(--primary)]" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
