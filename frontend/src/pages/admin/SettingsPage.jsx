import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAdminSettings, updateSettings } from '../../services/api';

const SETTING_FIELDS = [
    { key: 'editor_name', label: 'Editor / Brand Name', type: 'text' },
    { key: 'editor_tagline', label: 'Tagline', type: 'text' },
    { key: 'about_text', label: 'About Text', type: 'textarea' },
    { key: 'showreel_video_id', label: 'Showreel Video Cloudinary Public ID', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'vimeo_url', label: 'Vimeo URL', type: 'url' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
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
                    <h1 className="text-3xl font-display font-bold text-white">Site Settings</h1>
                    <p className="text-slate-400 text-sm mt-1">Update your bio, social links, and site content.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : (
                    <form onSubmit={handleSave} className="card p-8 space-y-5">
                        {SETTING_FIELDS.map(({ key, label, type }) => (
                            <div key={key}>
                                <label className="label">{label}</label>
                                {type === 'textarea' ? (
                                    <textarea
                                        value={data[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        rows={5}
                                        className="input-field resize-none"
                                        placeholder={label}
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        value={data[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="input-field"
                                        placeholder={label}
                                    />
                                )}
                            </div>
                        ))}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

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
