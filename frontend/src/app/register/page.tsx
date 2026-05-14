'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { User, Mail, Lock, Eye, EyeOff, Gift, Loader2 } from 'lucide-react';

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register } = useAuth();
    const { showToast } = useToast();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !email || !password) {
            showToast('Please fill in all required fields', 'error');
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
            // Generate or retrieve Device ID
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) {
                deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('device_id', deviceId);
            }

            const result = await register(email, username, password, referralCode || undefined, deviceId);

            if (result.requiresVerification) {
                // Email verification required - redirect to OTP page
                showToast('Registration successful! Please check your email for the verification code.', 'success');
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                // Auto-logged in (no SMTP configured)
                showToast('Account created! Welcome!', 'success');
                router.push('/');
            }
        } catch (error: any) {
            showToast(error.message || 'Registration failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // (Removed Email Verification Message UI as we redirect to verify-email page)

    return (
        <div className="mobile-container min-h-screen flex flex-col">
            {/* Header */}
            <div className="gradient-primary pt-6 pb-12 text-center flex flex-col items-center">
                <div className="w-56 h-32 transform hover:scale-105 transition-transform duration-300">
                    <img src="/logo.png" alt="PrimeLoot Logo" className="w-full h-full object-contain filter drop-shadow-2xl" />
                </div>
                <p className="text-white/80 text-sm mt-2 font-medium">Start earning money today</p>
            </div>

            {/* Form Card */}
            <div className="flex-1 -mt-6 bg-[var(--background)] rounded-t-[2.5rem] p-6 shadow-2xl relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="input"
                                style={{ paddingLeft: '45px', paddingRight: '45px' }}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Referral Code <span className="text-[var(--muted)]">(Optional)</span>
                        </label>
                        <div className="relative">
                            <Gift size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                placeholder="Enter referral code"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full py-4 text-base"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[var(--muted)]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--primary)] font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="mt-4 text-xs text-center text-[var(--muted)]">
                    By signing up, you agree to our <Link href="/terms" className="text-[var(--primary)] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 size={40} className="animate-spin text-[var(--primary)]" />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}

