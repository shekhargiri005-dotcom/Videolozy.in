import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAdminProjects, deleteProject } from '../../services/api';

export default function ProjectsListPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    const load = () => {
        setLoading(true);
        fetchAdminProjects()
            .then((res) => setProjects(res.data))
            .catch(() => setError('Failed to load projects.'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project? This also removes it from Cloudinary.')) return;
        setDeleting(id);
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert('Failed to delete project.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <>
            <Helmet><title>Projects — Admin</title></Helmet>
            <Navbar variant="admin" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Projects</h1>
                        <p className="text-slate-400 text-sm mt-1">{projects.length} total</p>
                    </div>
                    <Link to="/admin/projects/new" className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> Add Project
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p>No projects yet.</p>
                        <Link to="/admin/projects/new" className="btn-primary mt-4 inline-flex">Add Your First Project</Link>
                    </div>
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-slate-400 font-medium">Thumbnail</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Category</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Featured</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p) => (
                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            {p.thumbnail_url ? (
                                                <img src={p.thumbnail_url} alt={p.title} className="w-20 h-12 object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-20 h-12 bg-surface-800 rounded-lg flex items-center justify-center text-slate-600 text-xs">No img</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-white font-medium max-w-[200px] truncate">{p.title}</td>
                                        <td className="p-4 text-slate-400">{p.category || '—'}</td>
                                        <td className="p-4 text-slate-500">
                                            {p.release_date ? new Date(p.release_date).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="p-4">
                                            {p.is_featured && <Star size={16} className="text-amber-400" fill="currentColor" />}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/projects/${p.id}/edit`}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-400 hover:text-white bg-brand-600/20 hover:bg-brand-600/40 rounded-lg border border-brand-600/30 transition-all"
                                                >
                                                    <Edit2 size={13} /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={deleting === p.id}
                                                    className="btn-danger text-xs flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <Trash2 size={13} /> {deleting === p.id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
