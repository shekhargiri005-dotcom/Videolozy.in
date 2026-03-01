import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Film, Image, Plus, Trash2, Smartphone } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
    fetchAdminProject,
    createProject,
    updateProject,
    uploadFile,
} from '../../services/api';

const CATEGORIES = ['Commercial', 'Music Video', 'Documentary', 'Short Film', 'Corporate', 'Wedding', 'Other'];

function FileUploadField({ label, accept, resourceType, folder, currentUrl, onSuccess, icon: Icon }) {
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
            const res = await uploadFile(file, resourceType, folder);
            setPreview(res.data.url);
            onSuccess(res.data.public_id, res.data.url);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors"
            >
                {uploading ? (
                    <LoadingSpinner size="sm" text="Uploading..." />
                ) : preview ? (
                    resourceType === 'image' ? (
                        <img src={preview} alt="preview" className="h-24 mx-auto rounded object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-green-400">
                            <Film size={24} />
                            <p className="text-[10px] uppercase font-bold tracking-wider">Video Uploaded</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                        <Icon size={24} />
                        <p className="text-xs">Click to upload {label.toLowerCase()}</p>
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
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        release_date: '',
        is_featured: false,
        cloudinary_video_id: '',
        cloudinary_thumbnail_id: '',
        media: [], // The new array of ProjectMedia objects
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState('');

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
                    is_featured: p.is_featured || false,
                    cloudinary_video_id: p.cloudinary_video_id || '',
                    cloudinary_thumbnail_id: p.cloudinary_thumbnail_id || '',
                    media: p.media || [],
                });
                if (p.cloudinary_thumbnail_id && cloudName) {
                    setCurrentThumbnailUrl(
                        `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/${p.cloudinary_thumbnail_id}.jpg`
                    );
                }
            })
            .catch(() => setError('Failed to load project.'))
            .finally(() => setLoading(false));
    }, [id, isEdit, cloudName]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddMedia = () => {
        setForm((f) => ({
            ...f,
            media: [...f.media, { media_type: 'standard_video', cloudinary_id: '', url: '' }]
        }));
    };

    const handleRemoveMedia = (index) => {
        setForm((f) => {
            const newMedia = [...f.media];
            newMedia.splice(index, 1);
            return { ...f, media: newMedia };
        });
    };

    const handleMediaChange = (index, field, value) => {
        setForm((f) => {
            const newMedia = [...f.media];
            newMedia[index] = { ...newMedia[index], [field]: value };
            return { ...f, media: newMedia };
        });
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <Link to="/admin/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back to Projects
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">
                        {isEdit ? 'Edit Project' : 'Add New Project'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic info */}
                    <div className="card p-6 space-y-4">
                        <h2 className="font-semibold text-white border-b border-white/10 pb-3">Basic Details</h2>
                        <div>
                            <label className="label">Project Title <span className="text-red-400">*</span></label>
                            <input name="title" value={form.title} onChange={handleChange} className="input-field text-lg font-medium" placeholder="E.g. Nike Summer Campaign" />
                        </div>
                        <div>
                            <label className="label">Description / Credits</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Describe the project or paste credits..." />
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
                    </div>

                    {/* Primary Hero Media (Backward compatibility for the portfolio grid main image) */}
                    <div className="card p-6 space-y-4 border-brand-500/20">
                        <div className="mb-2">
                            <h2 className="font-semibold text-white">Primary Thumbnail & Hero</h2>
                            <p className="text-xs text-slate-400 mt-1">This image and video represent the project on the main Portfolio grid page.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label text-brand-300">Thumbnail Image <span className="text-slate-500 font-normal">(16:9 recommended)</span></label>
                                {/* Legacy Upload Field modified correctly just for Image */}
                                <div>
                                    <div className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-xl p-4 text-center">
                                        {currentThumbnailUrl ? (
                                            <img src={currentThumbnailUrl} alt="preview" className="h-24 mx-auto rounded object-cover" />
                                        ) : (
                                            <p className="text-xs text-slate-500 py-4">Upload below OR paste ID manually</p>
                                        )}
                                    </div>
                                    <input
                                        name="cloudinary_thumbnail_id"
                                        value={form.cloudinary_thumbnail_id}
                                        onChange={handleChange}
                                        className="input-field mt-2 text-xs font-mono"
                                        placeholder="Public ID (e.g., sample-thumb)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Hero Video <span className="text-slate-500 font-normal">(Optional main trailer)</span></label>
                                <div>
                                    <div className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-xl p-4 text-center">
                                        {form.cloudinary_video_id ? (
                                            <div className="flex flex-col items-center gap-1 text-green-400 py-4">
                                                <Film size={24} />
                                                <p className="text-[10px] uppercase font-bold tracking-wider">Video Linked</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 py-4">Upload below OR paste ID manually</p>
                                        )}
                                    </div>
                                    <input
                                        name="cloudinary_video_id"
                                        value={form.cloudinary_video_id}
                                        onChange={handleChange}
                                        className="input-field mt-2 text-xs font-mono"
                                        placeholder="Public ID (e.g., sample-video)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-white/5 mt-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    name="is_featured"
                                    checked={form.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-white/20 bg-surface-900 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="is_featured" className="text-sm text-brand-400 font-medium cursor-pointer">Mark as Featured (Pin to Homepage Slider)</label>
                            </div>
                        </div>
                    </div>

                    {/* All-in-One Project Media Gallery Array */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <div>
                                <h2 className="font-semibold text-white flex items-center gap-2">
                                    <Film size={18} className="text-purple-400" /> Mixed Media Gallery
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Upload multiple videos here (Shorts, Reels, standard MP4s) to show on the project's detail page.</p>
                            </div>
                            <button type="button" onClick={handleAddMedia} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                                <Plus size={14} /> Add Media Block
                            </button>
                        </div>

                        {form.media.length === 0 ? (
                            <div className="text-center py-10 bg-surface-900/50 rounded-xl border border-dashed border-white/10">
                                <Film size={32} className="mx-auto text-slate-600 mb-2" />
                                <p className="text-sm text-slate-400">No extra media blocks added.</p>
                                <button type="button" onClick={handleAddMedia} className="text-brand-400 hover:text-brand-300 text-xs mt-2 font-medium">
                                    + Add the first video block
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {form.media.map((item, index) => (
                                    <div key={index} className="bg-surface-900 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 relative group">

                                        {/* Upload Widget specific to this item */}
                                        <div className="w-full md:w-48 shrink-0">
                                            <FileUploadField
                                                label="Upload Media"
                                                accept={item.media_type === 'image' ? ".jpg,.png,.webp" : ".mp4,.mov,.webm"}
                                                resourceType={item.media_type === 'image' ? 'image' : 'video'}
                                                folder={`videolozy/projects/${item.media_type}s`}
                                                currentUrl={item.url}
                                                onSuccess={(publicId, url) => {
                                                    handleMediaChange(index, 'cloudinary_id', publicId);
                                                    handleMediaChange(index, 'url', url);
                                                }}
                                                icon={item.media_type === 'short_reel' ? Smartphone : item.media_type === 'image' ? Image : Film}
                                            />
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="label text-xs">Media Type</label>
                                                <select
                                                    value={item.media_type}
                                                    onChange={(e) => handleMediaChange(index, 'media_type', e.target.value)}
                                                    className="input-field py-1.5 text-sm"
                                                >
                                                    <option value="standard_video">Standard Video (16:9 Horizontal)</option>
                                                    <option value="short_reel">Short / Reel (9:16 Vertical)</option>
                                                    <option value="image">Still Image</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="label text-[10px] text-slate-400">Cloudinary ID</label>
                                                    <input
                                                        value={item.cloudinary_id}
                                                        onChange={(e) => handleMediaChange(index, 'cloudinary_id', e.target.value)}
                                                        className="input-field py-1 text-xs bg-surface-950 font-mono text-slate-300"
                                                        placeholder="e.g. sample-video"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label text-[10px] text-slate-400">Direct URL / Cloudinary Link</label>
                                                    <input
                                                        value={item.url}
                                                        onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                                                        className="input-field py-1 text-xs bg-surface-950 font-mono text-slate-300"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Remove media block"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-400 text-sm font-medium p-3 bg-red-900/20 border border-red-500/20 rounded-lg">{error}</p>}

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60 px-8">
                            <Save size={18} /> {saving ? 'Saving Project...' : isEdit ? 'Update Project' : 'Publish Project'}
                        </button>
                        <Link to="/admin/projects" className="text-slate-400 hover:text-white transition-colors text-sm px-4">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
