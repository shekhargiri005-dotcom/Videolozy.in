import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '../../services/api';

const STATUS_OPTIONS = ['unread', 'read', 'replied'];
const statusClass = { unread: 'badge-unread', read: 'badge-read', replied: 'badge-replied' };

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetchInquiries()
            .then((res) => setInquiries(res.data))
            .catch(() => setError('Failed to load inquiries.'))
            .finally(() => setLoading(false));
    }, []);

    const handleStatus = async (id, status) => {
        try {
            const res = await updateInquiryStatus(id, status);
            setInquiries((prev) => prev.map((i) => (i.id === id ? res.data : i)));
        } catch {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        try {
            await deleteInquiry(id);
            setInquiries((prev) => prev.filter((i) => i.id !== id));
        } catch {
            alert('Failed to delete.');
        }
    };

    return (
        <>
            <Helmet><title>Inquiries — Admin</title></Helmet>
            <Navbar variant="admin" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">Inquiries</h1>
                    <p className="text-slate-400 text-sm mt-1">{inquiries.length} total — {inquiries.filter((i) => i.status === 'unread').length} unread</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">No inquiries yet.</div>
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Budget</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((i) => (
                                    <React.Fragment key={i.id}>
                                        <tr
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            onClick={() => setExpanded(expanded === i.id ? null : i.id)}
                                        >
                                            <td className="p-4 text-white font-medium">{i.name}</td>
                                            <td className="p-4 text-slate-400">
                                                <a href={`mailto:${i.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-white transition-colors">
                                                    {i.email}
                                                </a>
                                            </td>
                                            <td className="p-4 text-slate-500 text-xs">{i.budget || '—'}</td>
                                            <td className="p-4">
                                                <select
                                                    value={i.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleStatus(i.id, e.target.value)}
                                                    className="text-xs px-2 py-1.5 rounded-lg bg-surface-800 border border-white/10 text-slate-300 focus:outline-none focus:border-brand-500"
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s} className="bg-surface-900">{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-4 text-slate-500 text-xs whitespace-nowrap">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {i.created_at ? new Date(i.created_at).toLocaleDateString('en-IN') : '—'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(i.id); }}
                                                    className="btn-danger text-xs flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {expanded === i.id && (
                                            <tr className="border-b border-white/5 bg-surface-900/50">
                                                <td colSpan={6} className="px-6 py-4">
                                                    <p className="text-slate-300 text-sm whitespace-pre-line">{i.message}</p>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
