import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Both fields are required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(form.username, form.password);
            navigate(from, { replace: true });
        } catch {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet><title>Admin Login — Videolozy.in</title></Helmet>
            <div className="min-h-screen flex items-center justify-center px-4 bg-surface-950">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2.5 font-display font-bold text-2xl text-white mb-6">
                            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                                <Film size={22} className="text-white" />
                            </div>
                            Videolozy<span className="text-brand-400">.in</span>
                        </div>
                        <h1 className="text-xl font-semibold text-white">Admin Login</h1>
                        <p className="text-slate-500 text-sm mt-1">Sign in to manage your portfolio</p>
                    </div>

                    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                        <div>
                            <label className="label">Username</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                                className="input-field"
                                placeholder="admin"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                className="input-field"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            <Lock size={16} />
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
