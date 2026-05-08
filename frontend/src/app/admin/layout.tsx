'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, ListTodo, UserCog, CreditCard,
    Crown, Settings, Gift, LogOut
} from 'lucide-react';

const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/tasks', icon: ListTodo, label: 'Tasks' },
    { href: '/admin/offerwalls', icon: Gift, label: 'Offerwalls' },
    { href: '/admin/users', icon: UserCog, label: 'Users' },
    { href: '/admin/withdrawals', icon: CreditCard, label: 'Withdrawals' },
    { href: '/admin/vip-requests', icon: Crown, label: 'VIP Requests' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // If we are on the exact '/admin' page (the login page), do not show the layout
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] p-4 hidden md:block z-50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <span className="text-xl">💰</span>
                    </div>
                    <div>
                        <h1 className="font-bold">GPT Earn</h1>
                        <p className="text-xs text-[var(--muted)]">Admin Panel</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                    : 'text-[var(--muted)] hover:bg-[var(--card-border)]'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="absolute bottom-4 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* Mobile Nav Header (Optional, for future) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--card-bg)] border-b border-[var(--card-border)] flex items-center px-4 z-50 justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <h1 className="font-bold">Admin Panel</h1>
                </div>
                <button onClick={handleLogout} className="text-red-500">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 w-full mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}
