import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Menu, X, LogOut, LayoutDashboard, FolderOpen, Mail, Settings } from 'lucide-react';

const NAV_LINKS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
    { to: '/inquiries', label: 'Inquiries', icon: Mail },
    { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-xl text-white">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                            <Film size={18} className="text-white" />
                        </div>
                        <span>Videolozy<span className="text-brand-400">.in</span> <span className="text-slate-500 text-sm font-medium">Admin</span></span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === to
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={15} />
                                {label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    {/* Mobile burger */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden glass border-t border-white/10 px-4 py-3 space-y-1">
                    {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Icon size={15} /> {label}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400"
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
