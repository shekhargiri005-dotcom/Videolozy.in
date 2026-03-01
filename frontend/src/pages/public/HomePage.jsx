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
    const featured = projects.filter((p) => p.is_featured).slice(0, 10);
    const displayFeatured = featured.length > 0 ? featured : projects.slice(0, 10);

    return (
        <>
            <Helmet>
                <title>Videolozy.in — Film Editor Portfolio</title>
                <meta name="description" content={settings.editor_tagline || 'Professional film editor crafting compelling visual stories.'} />
            </Helmet>
            <Navbar />

            {/* Global Screen Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/filmset-bg.png')" }}
                />
                {/* Dark Vignette / Gradient Overlay to ensure text readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface-950/40 via-surface-950/80 to-surface-950/95" />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-surface-950/80 via-transparent to-surface-950/80" />
            </div>

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-brand-950/30" />
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
                    <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 leading-none tracking-tight">
                        Videolozy<span className="text-brand-400">.in</span>
                    </h1>

                    <h2 className="text-2xl sm:text-3xl font-display font-medium bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent mb-8">
                        Crafting Stories Frame by Frame
                    </h2>

                    <p className="text-lg text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
                        {settings.home_text || 'Professional film editor crafting compelling visual narratives. Explore our collection of cinematic masterpieces.'}
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
            <section className="relative w-full py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Showcase</p>
                            <h2 className="section-title">Featured Projects</h2>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : displayFeatured.length > 0 ? (
                    <div className="flex overflow-x-auto gap-6 pb-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory 
                        [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-surface-900/50 [&::-webkit-scrollbar-thumb]:bg-brand-600/50 
                        [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-500 transition-colors">

                        {/* Empty spacer div to align the first item with the main container margin */}
                        <div className="min-w-[max(0px,calc((100vw-80rem)/2))] flex-shrink-0 hidden xl:block border-none" aria-hidden="true" />

                        {displayFeatured.map((p) => (
                            <div key={p.id} className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[420px] snap-center flex-shrink-0">
                                <ProjectCard project={p} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Clapperboard size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No featured projects yet. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* Comprehensive Portfolio Gallery directly on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 bg-surface-950/30">
                <div className="text-center mb-16">
                    <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-2">Complete Gallery</p>
                    <h2 className="section-title">Explore Our Portfolio</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mt-4">Browse through our comprehensive collection of short films, movies, weddings, and commercial projects.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Clapperboard size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No projects available.</p>
                    </div>
                )}

                <div className="mt-16 text-center text-slate-500 flex items-center justify-center gap-3">
                    <div className="w-12 h-px bg-slate-700"></div>
                    <span className="text-sm font-medium tracking-wide">End of Portfolio</span>
                    <div className="w-12 h-px bg-slate-700"></div>
                </div>
            </section>

            {/* Cinematic Quotes Section */}
            <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32 mb-20 overflow-hidden bg-surface-950 rounded-3xl border border-surface-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-emerald-900/20 blur-3xl rounded-full z-0" />
                <div className="relative z-10 text-center">
                    <Clapperboard className="mx-auto text-brand-500/40 w-16 h-16 mb-8 transform -scale-x-100" />
                    <blockquote className="text-3xl md:text-5xl font-display font-light text-surface-100 leading-snug tracking-tight mb-8">
                        “Editing is where movies are made or broken.<br />
                        <span className="text-brand-300 italic font-medium">Editing is the invisible art.</span>”
                    </blockquote>
                    <div className="h-px w-24 bg-brand-500/50 mx-auto mb-6"></div>
                    <p className="text-sm uppercase tracking-[0.2em] text-surface-400 font-medium">— The Essence of Cinema</p>
                </div>
            </section>

            <Footer settings={settings} />
        </>
    );
}
