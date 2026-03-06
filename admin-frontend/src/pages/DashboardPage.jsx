import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, FolderOpen, Clock, HardDrive, Film, Database } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchDashboard, fetchStorageStats } from '../services/api';

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-3xl font-display font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [storageStats, setStorageStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchDashboard(), fetchStorageStats()])
            .then(([dashRes, storageRes]) => {
                setData(dashRes.data);
                setStorageStats(storageRes.data);
            })
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
    };

    const statusClass = { unread: 'badge-unread', read: 'badge-read', replied: 'badge-replied' };

    return (
        <>
            <Helmet><title>Dashboard — Admin</title></Helmet>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Overview of your portfolio stats</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                            <StatCard icon={FolderOpen} label="Total Projects" value={data.total_projects} color="bg-brand-600" />
                            <StatCard icon={Mail} label="Unread Inquiries" value={data.unread_inquiries} color="bg-amber-600" />
                            <Link to="/inquiries" className="block">
                                <div className="card p-6 flex items-center gap-4 hover:border-brand-500/40 transition-colors">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-600">
                                        <BarChart3 size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm">View Inquiries</p>
                                        <p className="text-white font-semibold">→</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Storage Stats */}
                        {storageStats && (
                            <div className="card p-0 overflow-hidden border border-white/10 mb-10">
                                <div className="p-5 border-b border-white/10 bg-surface-900/50 flex items-center gap-3">
                                    <HardDrive className="text-brand-400" size={20} />
                                    <h2 className="text-lg font-display font-semibold text-white">Storage & Usage</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-slate-300 font-medium flex items-center gap-2 text-sm"><Database size={16} className="text-purple-400" /> Database Volume</h3>
                                                <p className="text-xs text-slate-500 mt-1">NeonDB cluster storage</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-white">{formatBytes(storageStats.database_bytes)}</span>
                                                <span className="text-xs text-slate-500 block">/ {formatBytes(storageStats.database_limit_bytes)}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-950 rounded-full h-3 border border-white/5 overflow-hidden">
                                            <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(100, Math.max(1, (storageStats.database_bytes / storageStats.database_limit_bytes) * 100))}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-slate-300 font-medium flex items-center gap-2 text-sm"><Film size={16} className="text-brand-400" /> Media Volume</h3>
                                                <p className="text-xs text-slate-500 mt-1">Cloudinary video & image storage</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-white">{formatBytes(storageStats.cloudinary_bytes)}</span>
                                                <span className="text-xs text-slate-500 block">/ {formatBytes(storageStats.cloudinary_limit_bytes)}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-950 rounded-full h-3 border border-white/5 overflow-hidden">
                                            <div className="bg-brand-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(100, Math.max(1, (storageStats.cloudinary_bytes / storageStats.cloudinary_limit_bytes) * 100))}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Inquiries */}
                        <div>
                            <h2 className="text-xl font-display font-semibold text-white mb-4">Recent Inquiries</h2>
                            {data.recent_inquiries.length === 0 ? (
                                <p className="text-slate-500">No inquiries yet.</p>
                            ) : (
                                <div className="card overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                                                <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                                                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                                                <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.recent_inquiries.map((i) => (
                                                <tr key={i.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-white font-medium">{i.name}</td>
                                                    <td className="p-4 text-slate-400">{i.email}</td>
                                                    <td className="p-4"><span className={statusClass[i.status] || 'badge'}>{i.status}</span></td>
                                                    <td className="p-4 text-slate-500 flex items-center gap-1.5">
                                                        <Clock size={13} />
                                                        {i.created_at ? new Date(i.created_at).toLocaleDateString() : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
