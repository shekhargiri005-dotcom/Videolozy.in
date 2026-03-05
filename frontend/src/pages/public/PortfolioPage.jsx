import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music, Film } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProjects, fetchSiteSettings } from '../../services/api';

/* ─── Shared: Section Tab Strip ─────────────────────────────────── */
function TabStrip({ active }) {
    const tabs = ['PROFIL', 'PROJECT', 'CONTACT PERSON'];
    return (
        <div className="flex items-center gap-4 px-6 py-3 border-b border-white/8 text-[10px] font-bold tracking-[0.3em] uppercase">
            {tabs.map((t) => (
                <a
                    key={t}
                    href={t === 'PROFIL' ? '#profil' : t === 'PROJECT' ? '#project' : '#contact'}
                    className={`transition-colors ${active === t ? 'text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded' : 'text-white/25 hover:text-white/50'}`}
                >
                    {t}
                </a>
            ))}
        </div>
    );
}

/* ─── Skill icon chip ────────────────────────────────────────────── */
function SkillChip({ label, color }) {
    return (
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg"
            style={{ background: color }}
            title={label}
        >
            {label.slice(0, 2)}
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    useEffect(() => {
        Promise.all([fetchProjects(), fetchSiteSettings()])
            .then(([p, s]) => { setProjects(p.data); setSettings(s.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const name = settings.editor_name || 'Bhuvan Bhaskar';
    const tagline = settings.editor_tagline || 'Film Editor';
    const bio = settings.about_text || 'Creating compelling visual stories through masterful editing, sound design, and color grading. I have learned a lot from editing and I have a skill that I learned year to year.';
    const email = settings.contact_email || 'admin@videolozy.in';
    const igUrl = settings.instagram_url || 'https://instagram.com';
    const ytUrl = settings.youtube_url || 'https://youtube.com';

    /* Split name for display */
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    const skills = [
        { label: 'Premiere', color: '#9b00ff' },
        { label: 'Photoshop', color: '#2d9be2' },
        { label: 'Lightroom', color: '#b6e3ff66', border: '#2d9be2' },
        { label: 'CapCut', color: '#1a1a2e' },
        { label: 'DaVinci', color: '#c45d1a' },
        { label: 'After Fx', color: '#9b00ff66' },
    ];

    return (
        <>
            <Helmet>
                <title>Portfolio — Videolozy.in</title>
                <meta name="description" content="Explore the creative portfolio of Videolozy.in Film Editor." />
            </Helmet>
            <Navbar />

            {/* ====================================================
                GLOBAL BG
            ==================================================== */}
            <div className="fixed inset-0 z-[-1]" style={{ background: '#07090f' }} />

            <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-20 pb-20 space-y-3">

                {/* ── SMALL LOGO ── */}
                <div className="py-2 text-white/30 text-sm font-black tracking-widest">
                    <Film size={18} className="inline mr-1" /> Vl.
                </div>

                {/* ════════════════════════════════════════════════
                    SECTION 1 — HERO
                ════════════════════════════════════════════════ */}
                <div
                    className="relative overflow-hidden rounded-2xl border border-white/8"
                    style={{ background: '#090c1a' }}
                >
                    <div className="flex items-stretch min-h-[200px]">

                        {/* LEFT: Portrait with red bg */}
                        <div
                            className="relative w-[160px] sm:w-[200px] flex-shrink-0 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #6b0a12 0%, #3a0517 100%)' }}
                        >
                            {/* Right fade blend */}
                            <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-r from-transparent to-[#090c1a]" />
                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>

                        {/* RIGHT: Title + nav */}
                        <div className="flex flex-col justify-center px-6 py-8 gap-4">
                            <div>
                                <h1
                                    className="text-white font-black leading-none"
                                    style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
                                >
                                    PORTFOLIO
                                </h1>
                                <span className="text-white/30 font-black" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.2rem)' }}>
                                    2025
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-sm bg-white/60 inline-block" />
                                <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.3em]">
                                    {tagline}
                                </p>
                            </div>

                            {/* Game-menu style links */}
                            <div className="space-y-0.5 text-[13px] font-medium text-white/50">
                                <a href="#project" className="block hover:text-white transition-colors tracking-widest">START</a>
                                <a href="#profil" className="block hover:text-white transition-colors tracking-widest">OPTIONS</a>
                                <Link to="/" className="block hover:text-white transition-colors tracking-widest">EXIT</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    SECTION 2 — PROFILE / ABOUT ME
                ════════════════════════════════════════════════ */}
                <div
                    id="profil"
                    className="overflow-hidden rounded-2xl border border-white/8"
                    style={{ background: '#090c1a' }}
                >
                    <TabStrip active="PROFIL" />

                    <div className="flex flex-col sm:flex-row">

                        {/* Left: portrait + name */}
                        <div
                            className="relative flex-shrink-0 w-full sm:w-[180px] flex flex-col items-center justify-end overflow-hidden"
                            style={{ background: 'linear-gradient(160deg, #0d111f 0%, #16202e 100%)', minHeight: 200 }}
                        >
                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="w-full object-contain object-bottom"
                                style={{ maxHeight: 260 }}
                            />
                            <div className="absolute bottom-3 left-0 right-0 text-center z-10">
                                <p className="text-white/30 text-[8px] uppercase tracking-[0.35em]">Hello, I am</p>
                                <p className="text-white font-black text-sm uppercase leading-tight">{firstName}</p>
                                {lastName && <p className="text-white font-black text-sm uppercase leading-tight">{lastName}</p>}
                            </div>
                            {/* Right blend */}
                            <div className="hidden sm:block absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#090c1a]" />
                        </div>

                        {/* Right: About + skills */}
                        <div className="flex-1 px-6 py-6 space-y-5">

                            {/* About Me */}
                            <div>
                                <h2
                                    className="text-white font-black text-lg mb-2 tracking-wide"
                                    style={{ fontFamily: 'Outfit, sans-serif' }}
                                >
                                    About Me
                                </h2>
                                <p className="text-white/45 text-[11px] leading-relaxed uppercase tracking-wide">{bio}</p>
                            </div>

                            {/* Software Skills */}
                            <div>
                                <h3 className="text-white font-black text-sm mb-3 tracking-wide">Software Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(s => <SkillChip key={s.label} {...s} />)}
                                </div>
                            </div>

                            {/* Education + Experience row */}
                            <div className="grid grid-cols-2 gap-4 text-[10px]">
                                <div>
                                    <p className="text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Education</p>
                                    <p className="text-white/70 font-semibold">BFA Film Editing</p>
                                    <p className="text-white/35">Visual FX & Post Production</p>
                                </div>
                                <div>
                                    <p className="text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Experience</p>
                                    <p className="text-white/70 font-semibold">Film Editor</p>
                                    <p className="text-white/35">10+ years · 250+ projects</p>
                                </div>
                            </div>

                            {/* Language */}
                            <div>
                                <p className="text-white/30 uppercase tracking-[0.3em] mb-2 text-[10px] font-bold">Language (Communication)</p>
                                <div className="space-y-1">
                                    {[['Hindi', '100%'], ['English', '80%'], ['Urdu', '60%']].map(([lang, pct]) => (
                                        <div key={lang} className="flex items-center gap-3">
                                            <p className="text-white/55 text-[10px] w-16 uppercase">{lang}</p>
                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-500/70 rounded-full" style={{ width: pct }} />
                                            </div>
                                            <p className="text-white/25 text-[9px]">{pct}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    SECTION 3 — RECAP PROJECT GALLERY
                ════════════════════════════════════════════════ */}
                <div
                    id="project"
                    className="overflow-hidden rounded-2xl border border-white/8"
                    style={{ background: '#090c1a' }}
                >
                    <TabStrip active="PROJECT" />

                    <div className="px-6 py-6">
                        <div className="flex items-baseline gap-3 mb-5">
                            <h2
                                className="text-white font-black text-xl tracking-wide"
                                style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                                Recap Project 2025
                            </h2>
                            <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest border border-white/15 rounded px-1.5 py-0.5">
                                No AI
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-16"><LoadingSpinner /></div>
                        ) : projects.length > 0 ? (
                            /* Masonry-style mixed grid matching reference */
                            <div
                                className="grid gap-2"
                                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gridAutoRows: '130px', gridAutoFlow: 'dense' }}
                            >
                                {projects.map((p, i) => {
                                    const thumb = p.thumbnail_url ||
                                        (p.cloudinary_thumbnail_id && cloudName
                                            ? `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/${p.cloudinary_thumbnail_id}.jpg`
                                            : null);
                                    /* Make some cards taller for visual variety */
                                    const isTall = i % 5 === 0;
                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/portfolio/${p.id}`}
                                            className="relative overflow-hidden rounded-xl bg-white/5 border border-white/8 group"
                                            style={{ gridRow: isTall ? 'span 2' : 'span 1' }}
                                        >
                                            {thumb ? (
                                                <img
                                                    src={thumb}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                                                    <Film size={24} className="text-white/20" />
                                                </div>
                                            )}
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-2">
                                                <p className="text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2 leading-tight">
                                                    {p.title}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-white/20 text-sm">
                                No projects added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    SECTION 4 — CONTACT
                ════════════════════════════════════════════════ */}
                <div
                    id="contact"
                    className="overflow-hidden rounded-2xl border border-white/8"
                    style={{ background: '#090c1a' }}
                >
                    <TabStrip active="CONTACT PERSON" />

                    <div className="flex flex-col sm:flex-row items-start gap-6 px-6 py-8">

                        {/* Left: Photo + socials */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 mb-4">
                                <img src="/about-bg.png" alt={name} className="w-full h-full object-cover object-top" />
                            </div>
                            <p className="text-white/30 text-[9px] uppercase tracking-[0.35em] mb-3 font-bold">Contact Me</p>
                            <div className="space-y-2 text-[11px]">
                                <a href={igUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white/50 hover:text-pink-400 transition-colors">
                                    <Instagram size={13} />
                                    <span className="font-medium">{settings.instagram_handle || '@videolozy'}</span>
                                </a>
                                <a href={ytUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors">
                                    <Youtube size={13} />
                                    <span className="font-medium">{settings.youtube_handle || '@videolozy'}</span>
                                </a>
                                <a href={`mailto:${email}`}
                                    className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors">
                                    <Film size={13} />
                                    <span className="font-medium">{email}</span>
                                </a>
                            </div>
                            <p className="text-white/20 text-[9px] mt-3 uppercase tracking-wide">{name}<br />Film Editor</p>
                        </div>

                        {/* Right: Thank you */}
                        <div className="flex-1 flex flex-col justify-between h-full">
                            <div>
                                <h2
                                    className="font-black text-white leading-none uppercase"
                                    style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', fontFamily: 'Outfit, sans-serif' }}
                                >
                                    THANK YOU
                                </h2>
                                <p className="text-white/25 font-black text-3xl">2025</p>
                            </div>
                            {/* Previous year portfolio mini-cards */}
                            <div className="flex gap-3 mt-6">
                                {['2023', '2024'].map((yr) => (
                                    <div
                                        key={yr}
                                        className="w-28 h-20 rounded-xl border border-white/10 bg-white/5 flex flex-col items-start justify-end p-3 relative overflow-hidden"
                                    >
                                        <Film size={20} className="absolute top-2 right-2 text-white/10" />
                                        <p className="text-white/30 text-[8px] uppercase tracking-widest">Portofolio.</p>
                                        <p className="text-white/50 text-xs font-black">{yr}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer settings={settings} />
        </>
    );
}
