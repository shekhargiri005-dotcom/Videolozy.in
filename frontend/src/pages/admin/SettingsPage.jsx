import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAdminSettings, updateSettings } from '../../services/api';

const PAGE_FIELDS = [
    { key: 'home_text', label: 'Home Page Intro Text', type: 'textarea' },
    { key: 'portfolio_text', label: 'Portfolio Page Description', type: 'textarea' },
    { key: 'about_text', label: 'About Page Content', type: 'textarea' },
    { key: 'contact_text', label: 'Contact Page Intro', type: 'textarea' },
];

const GLOBAL_FIELDS = [
    { key: 'editor_name', label: 'Editor / Brand Name', type: 'text' },
    { key: 'editor_tagline', label: 'Tagline', type: 'text' },
    { key: 'showreel_video_id', label: 'Showreel Video Cloudinary Public ID', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'vimeo_url', label: 'Vimeo URL', type: 'url' },
    { key: 'twitter_url', label: 'Twitter (X) URL', type: 'url' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
];

export default function SettingsPage() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminSettings()
            .then((res) => setData(res.data))
            .catch(() => setError('Failed to load settings.'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (key, value) => {
        setData((d) => ({ ...d, [key]: value }));
        setSaved(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await updateSettings(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Helmet><title>Settings — Admin</title></Helmet>
            <Navbar variant="admin" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">Site Content & Settings</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage what visitors see on your website pages and update global options.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : (
                    <form onSubmit={handleSave} className="card p-8 space-y-5">
                        {/* PAGE CONTENT SECTION */}
                        <div className="mb-8">
                            <h2 className="text-xl font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Page Content Management</h2>
                            <div className="space-y-5">
                                {PAGE_FIELDS.map(({ key, label, type }) => (
                                    <div key={key}>
                                        <label className="label">{label}</label>
                                        <textarea
                                            value={data[key] || ''}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            rows={4}
                                            className="input-field resize-none bg-surface-900 border-surface-800"
                                            placeholder={label}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GLOBAL SETTINGS SECTION */}
                        <div>
                            <h2 className="text-xl font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Global Settings & Links</h2>
                            <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
                                {GLOBAL_FIELDS.map(({ key, label, type }) => (
                                    <div key={key} className={type === 'textarea' ? "md:col-span-2 mt-4" : "mt-4"}>
                                        <label className="label">{label}</label>
                                        <input
                                            type={type}
                                            value={data[key] || ''}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            className="input-field bg-surface-900 border-surface-800"
                                            placeholder={label}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                        <div className="flex items-center gap-4 pt-2">
                            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                                <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                            {saved && (
                                <span className="flex items-center gap-1.5 text-green-400 text-sm">
                                    <CheckCircle size={16} /> Saved!
                                </span>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
