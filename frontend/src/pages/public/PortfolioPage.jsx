import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProjects, fetchSiteSettings } from '../../services/api';

export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    useEffect(() => {
        Promise.all([fetchProjects(), fetchSiteSettings()])
            .then(([p, s]) => { setProjects(p.data); setSettings(s.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
    const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);
    const name = settings.editor_name || 'Bhuvan Bhaskar';
    const tagline = settings.editor_tagline || 'Film Editor';

    return (
        <>
            <Helmet>
                <title>Portfolio — Videolozy.in</title>
                <meta name="description" content="Explore the portfolio of Videolozy.in." />
            </Helmet>
            <Navbar />

            {/* Global dark bg */}
            <div className="fixed inset-0 z-[-1]" style={{ background: '#06080f' }} />

            <div className="max-w-[820px] mx-auto px-4 sm:px-6 pt-20 pb-24">

                {/* Small logo */}
                <div className="py-4 text-white/25 text-xs font-black tracking-widest flex items-center gap-1.5">
                    <Film size={14} /> <span>Vl.</span>
                </div>

                {/* ══════════════════════════════════════════════
                    BOX 1 — HERO
                ══════════════════════════════════════════════ */}
                <div
                    className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                    style={{ background: '#0a0d1c' }}
                >
                    {/* Ambient glow */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-rose-900/15 blur-[100px] pointer-events-none z-0" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-900/15 blur-[80px] pointer-events-none z-0" />

                    <div className="relative z-10 flex items-stretch min-h-[240px]">

                        {/* LEFT — portrait on crimson bg */}
                        <div
                            className="relative flex-shrink-0 w-[42%] sm:w-[38%] overflow-hidden"
                            style={{ background: 'linear-gradient(150deg, #5c0a10 0%, #280417 60%, #0a0d1c 100%)' }}
                        >
                            {/* Right blend */}
                            <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-r from-transparent to-[#0a0d1c]" />
                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="w-full h-full object-cover object-top"
                                style={{ minHeight: '240px' }}
                            />
                        </div>

                        {/* RIGHT — title + game menu */}
                        <div className="flex flex-col justify-center px-6 sm:px-10 py-10 gap-5 flex-1">

                            <div className="leading-none">
                                <h1
                                    className="font-black text-white tracking-tight"
                                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 7vw, 4rem)' }}
                                >
                                    PORTFOLIO
                                </h1>
                                <span
                                    className="font-black text-white/25"
                                    style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)' }}
                                >
                                    2025
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-sm bg-white/50 flex-shrink-0" />
                                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.35em]">
                                    {tagline}
                                </p>
                            </div>

                            {/* Game-style menu */}
                            <div className="space-y-1">
                                {[
                                    { label: 'START', href: '#gallery' },
                                    { label: 'OPTIONS', href: '/admin/login' },
                                    { label: 'EXIT', href: '/' },
                                ].map(({ label, href }) => (
                                    href.startsWith('#') || href.startsWith('/admin') || href === '/'
                                        ? <Link
                                            key={label}
                                            to={href.startsWith('#') ? '/portfolio' + href : href}
                                            className="block text-white/40 hover:text-white transition-colors duration-200 text-sm font-semibold tracking-[0.3em] uppercase"
                                        >
                                            {label}
                                        </Link>
                                        : <a key={label} href={href} className="block text-white/40 hover:text-white transition-colors text-sm font-semibold tracking-[0.3em] uppercase">{label}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    GAP between boxes
                ══════════════════════════════════════════════ */}
                <div className="h-4" />

                {/* ══════════════════════════════════════════════
                    BOX 2 — PROJECT GALLERY
                ══════════════════════════════════════════════ */}
                <div
                    id="gallery"
                    className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                    style={{ background: '#0a0d1c' }}
                >
                    {/* Subtle glow */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-900/10 blur-[80px] pointer-events-none z-0" />

                    <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-8">

                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                            <div>
                                <p className="text-white/25 text-[9px] uppercase tracking-[0.5em] mb-1 font-bold">Recap</p>
                                <h2
                                    className="font-black text-white leading-none tracking-tight flex items-baseline gap-3"
                                    style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}
                                >
                                    Project 2025
                                    <span className="text-[9px] font-bold text-white/20 border border-white/15 rounded px-2 py-0.5 tracking-widest uppercase">No AI</span>
                                </h2>
                            </div>

                            {/* Category filter */}
                            {categories.length > 1 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${activeCategory === cat
                                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                                    : 'bg-white/5 text-white/35 border-white/8 hover:text-white/60 hover:border-white/20'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Masonry Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20"><LoadingSpinner /></div>
                        ) : filtered.length > 0 ? (
                            <div
                                className="grid gap-2"
                                style={{
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gridAutoRows: '120px',
                                    gridAutoFlow: 'dense'
                                }}
                            >
                                {filtered.map((p, i) => {
                                    const thumb = p.thumbnail_url ||
                                        (p.cloudinary_thumbnail_id && cloudName
                                            ? `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/${p.cloudinary_thumbnail_id}.jpg`
                                            : null);
                                    const isTall = i % 4 === 0;
                                    const isWide = i % 7 === 3;
                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/portfolio/${p.id}`}
                                            className="relative overflow-hidden rounded-xl bg-white/5 border border-white/8 group cursor-pointer"
                                            style={{
                                                gridRow: isTall ? 'span 2' : 'span 1',
                                                gridColumn: isWide ? 'span 2' : 'span 1',
                                            }}
                                        >
                                            {thumb ? (
                                                <img
                                                    src={thumb}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Film size={22} className="text-white/15" />
                                                </div>
                                            )}
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                                <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight">{p.title}</p>
                                            </div>
                                            {p.is_featured && (
                                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-white/20 text-sm">No projects yet.</div>
                        )}
                    </div>
                </div>
            </div>

            <Footer settings={settings} />
        </>
    );
}
