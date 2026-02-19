import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Play } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { PageLoader } from '../../components/LoadingSpinner';
import { fetchProject, fetchSiteSettings } from '../../services/api';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    useEffect(() => {
        Promise.all([fetchProject(id), fetchSiteSettings()])
            .then(([projRes, settingsRes]) => {
                setProject(projRes.data);
                setSettings(settingsRes.data);
            })
            .catch(() => setError('Project not found or failed to load.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <PageLoader />;

    if (error || !project) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                    <p className="text-red-400">{error || 'Project not found'}</p>
                    <Link to="/portfolio" className="btn-secondary">← Back to Portfolio</Link>
                </div>
            </>
        );
    }

    const videoUrl = project.video_url ||
        (project.cloudinary_video_id && cloudName
            ? `https://res.cloudinary.com/${cloudName}/video/upload/${project.cloudinary_video_id}.mp4`
            : null);

    return (
        <>
            <Helmet>
                <title>{project.title} — Videolozy.in</title>
                <meta name="description" content={project.description?.slice(0, 160) || `Watch ${project.title} by Videolozy.in`} />
            </Helmet>
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
                >
                    <ArrowLeft size={16} /> Back to Portfolio
                </Link>

                {/* Video */}
                <div className="mb-8">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            controls
                            poster={project.thumbnail_url}
                            className="w-full aspect-video object-cover rounded-2xl shadow-2xl shadow-black/60 bg-surface-900"
                        />
                    ) : (
                        <div className="w-full aspect-video bg-surface-800 rounded-2xl flex items-center justify-center border border-white/10">
                            <div className="text-center text-slate-500">
                                <Play size={48} className="mx-auto mb-3 opacity-30" />
                                <p>No video available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    {project.category && (
                        <span className="flex items-center gap-1.5 text-sm text-brand-400">
                            <Tag size={14} /> {project.category}
                        </span>
                    )}
                    {project.release_date && (
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <Calendar size={14} />
                            {new Date(project.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    )}
                </div>

                <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                    {project.title}
                </h1>

                {project.description && (
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>
                )}
            </div>

            <Footer settings={settings} />
        </>
    );
}
