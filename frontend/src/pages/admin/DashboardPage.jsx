import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, FolderOpen, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchDashboard } from '../../services/api';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard()
            .then((res) => setData(res.data))
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    const statusClass = { unread: 'badge-unread', read: 'badge-read', replied: 'badge-replied' };

    return (
        <>
            <Helmet><title>Dashboard — Admin</title></Helmet>
            <Navbar variant="admin" />
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
                            <Link to="/admin/inquiries" className="block">
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
                                                    <td className="p-4">
                                                        <span className={statusClass[i.status] || 'badge'}>{i.status}</span>
                                                    </td>
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
