import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Clapperboard } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProjects, fetchSiteSettings } from '../../services/api';

export default function HomePage() {
    const [projects, setProjects] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [showreel, setShowreel] = useState(false);

    useEffect(() => {
        Promise.all([fetchProjects(), fetchSiteSettings()])
            .then(([projRes, settingsRes]) => {
                setProjects(projRes.data);
                setSettings(settingsRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    const showreelId = settings.showreel_video_id;
    const featured = projects.filter((p) => p.is_featured).slice(0, 3);
    const displayProjects = featured.length > 0 ? featured : projects.slice(0, 3);

    return (
        <>
            <Helmet>
                <title>Videolozy.in — Film Editor Portfolio</title>
                <meta name="description" content={settings.editor_tagline || 'Professional film editor crafting compelling visual stories.'} />
            </Helmet>
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-brand-950/30" />
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-brand-300 text-sm font-medium mb-8 border border-brand-500/20">
                        <Clapperboard size={15} />
                        {settings.editor_name || 'Videolozy'} — Film Editor
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight">
                        Crafting
                        <span className="block bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                            Stories
                        </span>
                        Frame by Frame
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {settings.editor_tagline || 'Professional film editor creating compelling narratives through the art of editing.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/portfolio" className="btn-primary flex items-center gap-2">
                            View Portfolio <ArrowRight size={18} />
                        </Link>
                        {showreelId && (
                            <button
                                onClick={() => setShowreel(true)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Play size={18} fill="currentColor" /> Watch Showreel
                            </button>
                        )}
                        <Link to="/contact" className="btn-secondary flex items-center gap-2">
                            Hire Me
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent" />
                </div>
            </section>

            {/* Showreel Modal */}
            {showreel && showreelId && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowreel(false)}
                >
                    <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <video
                            src={`https://res.cloudinary.com/${cloudName}/video/upload/${showreelId}.mp4`}
                            controls
                            autoPlay
                            className="w-full rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Featured Projects */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Selected Work</p>
                        <h2 className="section-title">Featured Projects</h2>
                    </div>
                    <Link to="/portfolio" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : displayProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Clapperboard size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No projects yet. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="card p-10 text-center bg-gradient-to-br from-brand-900/30 to-purple-900/20 border-brand-500/20">
                    <h2 className="section-title mb-4">Ready to tell your story?</h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8">
                        Whether it's a commercial, music video, documentary, or any visual project — let's collaborate.
                    </p>
                    <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                        Get In Touch <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer settings={settings} />
        </>
    );
}
