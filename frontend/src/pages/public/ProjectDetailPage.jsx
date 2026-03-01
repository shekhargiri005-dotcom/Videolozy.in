import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Play, Film } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
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

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>
        </>
    );

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

    // Helper URLs for the main legacy Hero video/thumbnail
    const heroVideoUrl = project.video_url ||
        (project.cloudinary_video_id && cloudName
            ? `https://res.cloudinary.com/${cloudName}/video/upload/${project.cloudinary_video_id}.mp4`
            : null);

    // Filter media by types for creative layout
    const media = project.media || [];
    const standardVideos = media.filter(m => m.media_type === 'standard_video');
    const shortReels = media.filter(m => m.media_type === 'short_reel');
    const images = media.filter(m => m.media_type === 'image');

    return (
        <>
            <Helmet>
                <title>{project.title} — Videolozy.in</title>
                <meta name="description" content={project.description?.slice(0, 160) || `Watch ${project.title} by Videolozy.in`} />
            </Helmet>
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
                >
                    <ArrowLeft size={16} /> Back to Portfolio
                </Link>

                {/* Hero Title & Meta */}
                <div className="text-center mb-10 max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        {project.category && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-brand-400 bg-brand-900/20 px-3 py-1 rounded-full border border-brand-500/20">
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

                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {project.title}
                    </h1>

                    {project.description && (
                        <div className="prose prose-invert max-w-none mx-auto text-left md:text-center mt-8">
                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Main Hero Video (If available) */}
                {(heroVideoUrl || project.thumbnail_url) && (
                    <div className="mb-20">
                        {heroVideoUrl ? (
                            <video
                                src={heroVideoUrl}
                                controls
                                poster={project.thumbnail_url}
                                className="w-full aspect-video object-cover rounded-2xl shadow-2xl shadow-black/80 bg-surface-900 border border-white/5"
                            />
                        ) : project.thumbnail_url ? (
                            <img
                                src={project.thumbnail_url}
                                alt={project.title}
                                className="w-full rounded-2xl shadow-xl shadow-black/50 border border-white/5"
                            />
                        ) : null}
                    </div>
                )}

                {/* --- MIXED MEDIA SHOWCASE --- */}
                {media.length > 0 && (
                    <div className="space-y-24 mt-16 pt-16 border-t border-white/10">
                        {/* 1. Standard Horizontal Videos */}
                        {standardVideos.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                                    <Film className="text-brand-500" /> Videos
                                </h3>
                                <div className="space-y-12">
                                    {standardVideos.map(vid => (
                                        <div key={vid.id} className="w-full bg-surface-900 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                            <video
                                                src={vid.url}
                                                controls
                                                className="w-full aspect-video object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Short Reels (Vertical / 9:16) */}
                        {shortReels.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                                    <Play className="text-purple-500" fill="currentColor" /> Shorts & Reels
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {shortReels.map(reel => (
                                        <div key={reel.id} className="relative aspect-[9/16] bg-surface-900 rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
                                            <video
                                                src={reel.url}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Image Gallery */}
                        {images.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                                    <span className="text-emerald-500">★</span> Production Stills
                                </h3>
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                    {images.map(img => (
                                        <div key={img.id} className="break-inside-avoid">
                                            <img
                                                src={img.url}
                                                alt="Project Still"
                                                className="w-full rounded-xl shadow-lg border border-white/5 object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer settings={settings} />
        </>
    );
}
