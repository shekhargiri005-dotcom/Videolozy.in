import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft, Save, Film, Image } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
    fetchAdminProject,
    createProject,
    updateProject,
    uploadFile,
} from '../../services/api';

const CATEGORIES = ['Commercial', 'Music Video', 'Documentary', 'Short Film', 'Corporate', 'Wedding', 'Other'];

function FileUploadField({ label, accept, resourceType, currentUrl, onSuccess, icon: Icon }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentUrl || '');
    const [error, setError] = useState('');
    const fileRef = useRef();

    useEffect(() => { setPreview(currentUrl || ''); }, [currentUrl]);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const res = await uploadFile(file, resourceType);
            setPreview(res.data.url);
            onSuccess(res.data.public_id);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="label">{label}</label>
            <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
                {uploading ? (
                    <LoadingSpinner size="sm" text="Uploading..." />
                ) : preview ? (
                    resourceType === 'image' ? (
                        <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-green-400">
                            <Film size={32} />
                            <p className="text-xs">Video uploaded ✓</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Icon size={28} />
                        <p className="text-sm">Click to upload {label.toLowerCase()}</p>
                        <p className="text-xs">{accept}</p>
                    </div>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept={accept}
                    onChange={handleFile}
                    className="hidden"
                />
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function ProjectFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        release_date: '',
        cloudinary_video_id: '',
        cloudinary_thumbnail_id: '',
        is_featured: false,
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    useEffect(() => {
        if (!isEdit) return;
        fetchAdminProject(id)
            .then((res) => {
                const p = res.data;
                setForm({
                    title: p.title || '',
                    description: p.description || '',
                    category: p.category || '',
                    release_date: p.release_date || '',
                    cloudinary_video_id: p.cloudinary_video_id || '',
                    cloudinary_thumbnail_id: p.cloudinary_thumbnail_id || '',
                    is_featured: p.is_featured || false,
                });
                if (p.cloudinary_thumbnail_id && cloudName) {
                    setCurrentThumbnailUrl(
                        `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/${p.cloudinary_thumbnail_id}.jpg`
                    );
                }
            })
            .catch(() => setError('Failed to load project.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Title is required.'); return; }
        setSaving(true);
        setError('');
        try {
            if (isEdit) {
                await updateProject(id, form);
            } else {
                await createProject(form);
            }
            navigate('/admin/projects');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save project.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <>
            <Navbar variant="admin" />
            <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>
        </>
    );

    return (
        <>
            <Helmet><title>{isEdit ? 'Edit Project' : 'New Project'} — Admin</title></Helmet>
            <Navbar variant="admin" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <Link to="/admin/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>
                <h1 className="text-3xl font-display font-bold text-white mb-8">
                    {isEdit ? 'Edit Project' : 'Add New Project'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic info */}
                    <div className="card p-6 space-y-4">
                        <h2 className="font-semibold text-white border-b border-white/10 pb-3">Basic Info</h2>
                        <div>
                            <label className="label">Title <span className="text-red-400">*</span></label>
                            <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Project title" />
                        </div>
                        <div>
                            <label className="label">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Describe the project..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-surface-900">{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Release Date</label>
                                <input type="date" name="release_date" value={form.release_date} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={form.is_featured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/20 bg-surface-900 text-brand-600 focus:ring-brand-500"
                            />
                            <label htmlFor="is_featured" className="text-sm text-slate-300">Mark as Featured (shown on homepage)</label>
                        </div>
                    </div>

                    {/* Media Uploads */}
                    <div className="card p-6 space-y-5">
                        <h2 className="font-semibold text-white border-b border-white/10 pb-3">Media</h2>
                        <FileUploadField
                            label="Thumbnail Image"
                            accept=".jpg,.jpeg,.png,.webp"
                            resourceType="image"
                            currentUrl={currentThumbnailUrl}
                            onSuccess={(publicId) => setForm((f) => ({ ...f, cloudinary_thumbnail_id: publicId }))}
                            icon={Image}
                        />
                        <FileUploadField
                            label="Project Video"
                            accept=".mp4,.mov,.avi,.mkv,.webm"
                            resourceType="video"
                            currentUrl={form.cloudinary_video_id ? 'has_video' : ''}
                            onSuccess={(publicId) => setForm((f) => ({ ...f, cloudinary_video_id: publicId }))}
                            icon={Film}
                        />
                        <div className="pt-2">
                            <p className="text-xs text-slate-500">Or enter Cloudinary public IDs directly:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                <div>
                                    <label className="label text-xs">Video Public ID</label>
                                    <input name="cloudinary_video_id" value={form.cloudinary_video_id} onChange={handleChange} className="input-field text-sm" placeholder="videolozy/videos/..." />
                                </div>
                                <div>
                                    <label className="label text-xs">Thumbnail Public ID</label>
                                    <input name="cloudinary_thumbnail_id" value={form.cloudinary_thumbnail_id} onChange={handleChange} className="input-field text-sm" placeholder="videolozy/thumbnails/..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                            <Save size={18} /> {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
                        </button>
                        <Link to="/admin/projects" className="btn-secondary">Cancel</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
