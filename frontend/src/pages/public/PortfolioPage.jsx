import React, { useState, useEffect } from 'react';
import { Clapperboard, MonitorPlay, Film } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import ProjectCard from '../../components/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProjects, fetchSiteSettings } from '../../services/api';

export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        Promise.all([fetchProjects(), fetchSiteSettings()])
            .then(([projRes, settingsRes]) => {
                setProjects(projRes.data);
                setSettings(settingsRes.data);
            })
            .catch(() => setError('Failed to load projects. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
    const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

    const name = settings.editor_name || 'Bhuvan Bhaskar';
    const tagline = settings.editor_tagline || 'Senior Film Editor';

    return (
        <PageLayout
            title="Portfolio — Videolozy.in"
            description="Explore the creative journey and portfolio of the team at Videolozy.in."
            settings={settings}
            bgTheme="slate"
        >
            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 1 — HERO / INTRODUCTION                         */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
                <div
                    className="relative overflow-hidden rounded-[28px] border border-white/8 shadow-2xl"
                    style={{ background: '#080d18' }}
                >
                    {/* Ambient glow */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-900/20 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row min-h-[320px]">

                        {/* Left — Portrait with colored bg accent */}
                        <div
                            className="relative flex-shrink-0 w-full md:w-[280px] lg:w-[320px] flex items-end justify-center overflow-hidden"
                            style={{ background: 'linear-gradient(160deg, #1a0a12 0%, #0d0517 100%)' }}
                        >
                            {/* Red accent glow behind portrait */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-900/30 blur-[80px] rounded-full" />
                            {/* Right edge blend */}
                            <div className="hidden md:block absolute inset-y-0 right-0 w-20 z-20 bg-gradient-to-r from-transparent to-[#080d18]" />
                            {/* Bottom fade (mobile) */}
                            <div className="md:hidden absolute inset-x-0 bottom-0 h-20 z-20 bg-gradient-to-t from-[#080d18] to-transparent" />

                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="relative z-10 w-[70%] md:w-full object-contain object-bottom"
                                style={{ maxHeight: '320px' }}
                            />
                        </div>

                        {/* Right — Title + tagline */}
                        <div className="flex flex-col justify-center px-8 py-10 lg:px-12 gap-4">
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.5em]">
                                Videolozy.in
                            </p>
                            <h1 className="font-display font-black text-white leading-none tracking-tight">
                                <span className="text-5xl sm:text-6xl lg:text-7xl block">PORTFOLIO</span>
                                <span className="text-3xl sm:text-4xl lg:text-5xl text-white/40">2025</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-sm bg-cyan-400 inline-block" />
                                <p className="text-cyan-300 text-xs font-bold uppercase tracking-[0.3em]">
                                    {tagline}
                                </p>
                            </div>

                            {/* Quick stats */}
                            <div className="flex flex-wrap gap-6 mt-2">
                                {[
                                    { n: '250+', l: 'Projects' },
                                    { n: '10+', l: 'Years' },
                                    { n: '5★', l: 'Rated' },
                                ].map(({ n, l }) => (
                                    <div key={l}>
                                        <p className="text-white text-2xl font-black font-display leading-none">{n}</p>
                                        <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 2 — ABOUT + SKILLS                             */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div
                    className="relative overflow-hidden rounded-[28px] border border-white/8"
                    style={{ background: '#0a1020' }}
                >
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/8">

                        {/* About Me */}
                        <div className="px-8 py-8 lg:px-10">
                            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-1">Hello, I am</p>
                            <h2 className="font-display font-black text-white text-2xl mb-5 uppercase tracking-wide">
                                {name}
                            </h2>
                            <p className="text-white/55 text-sm leading-relaxed">
                                {settings.about_text || 'A passionate film editor crafting stories through rhythm, pacing, and visual storytelling. Specializing in commercials, music videos, short films, and documentaries.'}
                            </p>
                        </div>

                        {/* Skills + Experience */}
                        <div className="px-8 py-8 lg:px-10">
                            <p className="text-cyan-400 text-[9px] uppercase tracking-[0.4em] mb-4 font-bold">Skills</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Video Editing', 'Color Grading', 'Visual FX', 'Motion Graphics', 'Sound Design', 'Creative Direction'].map((s) => (
                                    <span key={s} className="px-3 py-1 text-xs font-semibold text-white/70 bg-white/8 border border-white/10 rounded-full">
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mb-1">Education</p>
                                    <p className="text-white/80 font-semibold text-xs">Bachelor of Fine Arts</p>
                                    <p className="text-white/40 text-xs">Film Editing & Visual FX</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mb-1">Experience</p>
                                    <p className="text-white/80 font-semibold text-xs">10+ Years</p>
                                    <p className="text-white/40 text-xs">Full-time / Remote</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 3 — RECAP / PROJECT GALLERY                    */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
                <div
                    className="relative overflow-hidden rounded-[28px] border border-white/8 px-8 py-8 lg:px-10 lg:py-10"
                    style={{ background: '#080d18' }}
                >
                    {/* Heading */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                        <div>
                            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mb-1">Recap</p>
                            <h2 className="font-display font-black text-white text-3xl uppercase tracking-tight">
                                Project <span className="text-white/30">2025</span>
                            </h2>
                        </div>

                        {/* Category Filter */}
                        {categories.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${activeCategory === cat
                                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                                : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Grid */}
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <LoadingSpinner size="lg" text="Loading projects..." />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-400 text-sm">{error}</div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-white/20">
                            <Clapperboard size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No projects in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
