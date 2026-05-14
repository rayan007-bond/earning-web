'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import {
    CheckCircle, XCircle, Clock,
    Phone, Bitcoin, CreditCard, Loader2, Download
} from 'lucide-react';

interface Withdrawal {
    id: number;
    user_id: number;
    username: string;
    email: string;
    amount: number;
    fee: number;
    net_amount: number;
    payment_method: string;
    payment_details: any;
    status: string;
    created_at: string;
}

export default function AdminWithdrawalsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin');
            return;
        }
        loadWithdrawals(token);
    }, [router, filter]);

    const loadWithdrawals = async (token: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/withdrawals?status=${filter}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            // Handle both array response and object response
            const withdrawalsList = Array.isArray(data) ? data : (data.withdrawals || []);
            setWithdrawals(withdrawalsList);
        } catch (error) {
            showToast('Failed to load withdrawals', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const processWithdrawal = async (id: number, action: 'approve' | 'reject') => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        setProcessing(id);

        try {
            const body: any = { action };
            if (action === 'reject') {
                const reason = prompt('Rejection reason:');
                if (!reason) {
                    setProcessing(null);
                    return;
                }
                body.reason = reason;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/withdrawals/${id}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            showToast(`Withdrawal ${action === 'approve' ? 'approved' : 'rejected'}`, 'success');
            loadWithdrawals(token);
        } catch (error) {
            showToast('Failed to process withdrawal', 'error');
        } finally {
            setProcessing(null);
        }
    };

    const exportToCSV = () => {
        if (withdrawals.length === 0) {
            showToast('No data to export', 'error');
            return;
        }

        const headers = ['ID', 'User ID', 'Username', 'Email', 'Amount ($)', 'Fee ($)', 'Net Amount ($)', 'Payment Method', 'Payment Details', 'Status', 'Date'];
        
        const csvRows = withdrawals.map(w => {
            const details = typeof w.payment_details === 'string' ? w.payment_details : JSON.stringify(w.payment_details);
            // Escape quotes and wrap in quotes to handle commas in JSON string
            const safeDetails = `"${details.replace(/"/g, '""')}"`;
            
            return [
                w.id,
                w.user_id,
                w.username,
                w.email,
                w.amount,
                w.fee,
                w.net_amount,
                w.payment_method,
                safeDetails,
                w.status,
                new Date(w.created_at).toLocaleString()
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `withdrawals_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const methodIcons: Record<string, any> = {
        jazzcash: Phone,
        easypaisa: Phone,
        usdt_trc20: Bitcoin,
        binance_pay: CreditCard,
    };

    const statusColors: Record<string, string> = {
        pending: 'text-amber-500 bg-amber-500/10',
        approved: 'text-blue-500 bg-blue-500/10',
        processing: 'text-blue-500 bg-blue-500/10',
        completed: 'text-green-500 bg-green-500/10',
        rejected: 'text-red-500 bg-red-500/10',
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="w-full">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold">Withdrawals</h1>
                </div>

                {/* Filter Tabs & Export */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        {['pending', 'approved', 'completed', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--card-bg)] border border-[var(--card-border)]'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] text-[var(--primary)] rounded-lg text-sm font-bold transition-all shadow-sm"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                {/* Withdrawals List */}
                <div className="space-y-3">
                    {withdrawals.length === 0 ? (
                        <div className="card text-center py-12 text-[var(--muted)]">
                            <Clock size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No {filter} withdrawals</p>
                        </div>
                    ) : (
                        withdrawals.map((w) => {
                            const MethodIcon = methodIcons[w.payment_method] || CreditCard;
                            const details = typeof w.payment_details === 'string'
                                ? JSON.parse(w.payment_details)
                                : w.payment_details;

                            return (
                                <div key={w.id} className="card">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-[var(--card-border)]">
                                            <MethodIcon size={24} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{w.username}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[w.status]}`}>
                                                    {w.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--muted)]">{w.email}</p>

                                            <div className="mt-2 p-2 bg-[var(--background)] rounded-lg text-sm">
                                                <div className="font-medium">{w.payment_method.replace('_', ' ').toUpperCase()}</div>
                                                {details.accountNumber && <div>Account: {details.accountNumber}</div>}
                                                {details.walletAddress && <div className="truncate">Wallet: {details.walletAddress}</div>}
                                                {details.binanceId && <div>Binance ID: {details.binanceId}</div>}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xl font-bold">${parseFloat(w.net_amount as any).toFixed(2)}</div>
                                            <div className="text-xs text-[var(--muted)]">
                                                Fee: ${parseFloat(w.fee as any).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-[var(--muted)]">
                                                {new Date(w.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {w.status === 'pending' && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--card-border)]">
                                            <button
                                                onClick={() => processWithdrawal(w.id, 'approve')}
                                                disabled={processing === w.id}
                                                className="btn btn-success flex-1"
                                            >
                                                {processing === w.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle size={16} className="mr-2" />
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => processWithdrawal(w.id, 'reject')}
                                                disabled={processing === w.id}
                                                className="btn flex-1 bg-red-500 text-white"
                                            >
                                                <XCircle size={16} className="mr-2" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
