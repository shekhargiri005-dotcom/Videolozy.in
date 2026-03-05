import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Film, Instagram, Youtube } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProjects, fetchSiteSettings } from '../../services/api';

/* ─── Shared: Section Tab Strip ─────────────────────────────────── */
function TabStrip({ active }) {
    const tabs = ['PROFIL', 'PROJECT', 'CONTACT PERSON'];
    return (
        <div className="flex items-center justify-center gap-6 py-4 border-b border-white/8 text-[10px] font-bold tracking-[0.3em] uppercase">
            {tabs.map((t) => (
                <a
                    key={t}
                    href={t === 'PROFIL' ? '#profile' : t === 'PROJECT' ? '#gallery' : '#contact'}
                    className={`transition-colors ${active === t ? 'text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full' : 'text-white/25 hover:text-white/50'}`}
                >
                    {t}
                </a>
            ))}
        </div>
    );
}

/* ─── Skill icon chip ────────────────────────────────────────────── */
function SkillChip({ label, color, border }) {
    return (
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg"
            style={{ background: color, border: border ? `1px solid ${border}` : 'none' }}
            title={label}
        >
            {label}
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
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

    const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
    const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

    const name = settings.editor_name || 'Bhuvan Bhaskar';
    const tagline = settings.editor_tagline || 'Content Creator';
    const bio = settings.about_text || "HI, I'M BHUVAN BHASKAR, I'M BACK MAKING A PORTFOLIO AT THE END OF THE YEAR. I LEARNED A LOT OF THINGS FROM EDITING, FROM GRAPHIC DESIGN, VIDEO, TYPOGRAPHY AND OTHERS. ABOUT EDITING, I LEARNED FROM 2018 AUTODIDACTED, AND I HAVE A LITTLE EDITING SKILL THAT I LEARNED FROM YEAR TO YEAR.";
    const email = settings.contact_email || 'admin@videolozy.in';
    const igUrl = settings.instagram_url || 'https://instagram.com';
    const ytUrl = settings.youtube_url || 'https://youtube.com';

    /* Split name for display */
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    const skills = [
        { label: 'Pr', color: '#54a3ff' },          // Light blue like 'P' in ref
        { label: 'Ps', color: '#001e36' },          // Dark blue Photoshop
        { label: 'Lr', color: '#001e36' },          // Dark blue Lightroom
        { label: 'Cp', color: '#fff', border: '#ccc' }, // White Capcut style
        { label: 'Ae', color: '#00ff73', border: '#005e2a' }, // Green Ae style
        { label: 'Da', color: '#b91dff' },          // Purple DaVinci style
    ];

    return (
        <>
            <Helmet>
                <title>Portfolio — Videolozy.in</title>
                <meta name="description" content="Explore the creative portfolio of Videolozy.in Film Editor." />
            </Helmet>
            <Navbar />

            {/* Global dark bg */}
            <div className="fixed inset-0 z-[-1]" style={{ background: '#02050a' }} />

            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-20 pb-24 space-y-6">

                {/* Small logo */}
                <div className="py-2 text-white/30 text-sm font-black tracking-widest flex items-center gap-1.5 pl-2">
                    <Film size={18} /> <span>Vl.</span>
                </div>

                {/* ════════════════════════════════════════════════
                    BOX 1 — HERO
                ════════════════════════════════════════════════ */}
                <div
                    className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl"
                    style={{ background: '#0a101d' }}
                >
                    <div className="flex items-stretch min-h-[260px]">
                        {/* LEFT: Portrait on crimson bg */}
                        <div
                            className="relative w-[180px] sm:w-[260px] flex-shrink-0 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #7a0c1a 0%, #3a0517 100%)' }}
                        >
                            {/* Curved right edge mask to match reference's capsule shape */}
                            <div className="absolute inset-y-0 right-[-40px] w-[80px] rounded-full bg-[#0a101d] z-10 hidden sm:block" />
                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="w-full h-full object-cover object-top relative z-0"
                            />
                        </div>

                        {/* RIGHT: Title + nav */}
                        <div className="flex flex-col justify-center items-center flex-1 px-6 py-10 gap-5 text-center sm:text-left sm:items-start pl-8">
                            <div className="flex items-baseline gap-4">
                                <h1
                                    className="text-white font-black leading-none uppercase tracking-tighter"
                                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#dbe4e8' }}
                                >
                                    PORTFOLIO
                                </h1>
                                <span className="text-white/40 font-medium" style={{ fontSize: 'clamp(1rem, 3vw, 1.8rem)' }}>
                                    2025
                                </span>
                            </div>

                            <div className="flex items-center gap-2 justify-center sm:justify-start w-full">
                                <span className="w-2.5 h-2.5 rounded-sm bg-white inline-block" />
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
                                    {tagline}
                                </p>
                            </div>

                            {/* Game-menu style links */}
                            <div className="space-y-1.5 text-[11px] font-medium text-white/50 text-center w-full">
                                <a href="#gallery" className="block hover:text-cyan-400 transition-colors tracking-[0.2em]">START</a>
                                <a href="#profile" className="block hover:text-cyan-400 transition-colors tracking-[0.2em]">OPTIONS</a>
                                <Link to="/" className="block hover:text-cyan-400 transition-colors tracking-[0.2em]">EXIT</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    BOX 2 — PROFILE
                ════════════════════════════════════════════════ */}
                <div
                    id="profile"
                    className="overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl relative"
                    style={{ background: '#090f19' }}
                >
                    {/* Subtle cyan glow right side */}
                    <div className="absolute top-0 right-0 w-96 h-full bg-cyan-900/10 blur-[120px] pointer-events-none z-0" />

                    <TabStrip active="PROFIL" />

                    <div className="flex flex-col sm:flex-row relative z-10">
                        {/* Left: portrait + name */}
                        <div className="relative flex-shrink-0 w-full sm:w-[280px] flex flex-col items-center justify-end overflow-hidden pt-12 pb-6 px-6 bg-[#040812]">
                            {/* Blue glow behind portrait inside the dark box */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-600/30 blur-[60px] rounded-full z-0" />

                            <div className="text-center z-10 mb-4 whitespace-nowrap">
                                <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-semibold mb-1">Hello, I am</p>
                                <p className="text-white/80 font-black text-xl uppercase tracking-widest">{firstName}</p>
                                {lastName && <p className="text-white/80 font-black text-xl uppercase tracking-widest">{lastName}</p>}
                            </div>

                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="w-full object-contain relative z-10 drop-shadow-2xl"
                                style={{ maxHeight: 300 }}
                            />
                            {/* Fire sparks visual detail (simulated) */}
                            <div className="absolute bottom-4 left-4 w-2 h-6 bg-orange-500/40 blur-sm rounded-full rotate-45" />
                            <div className="absolute bottom-12 right-6 w-1.5 h-4 bg-orange-400/50 blur-sm rounded-full -rotate-12" />
                            <div className="absolute top-1/2 left-8 w-2 h-3 bg-orange-300/30 blur-sm rounded-full rotate-12" />
                        </div>

                        {/* Right: About + skills */}
                        <div className="flex-1 px-8 py-8 sm:px-12 sm:py-10 space-y-8">
                            {/* About Me */}
                            <div>
                                <h2 className="text-white font-black text-xl mb-3 tracking-wide uppercase" style={{ color: '#dbe4e8' }}>
                                    About Me
                                </h2>
                                <p className="text-white/40 text-[9px] leading-[1.8] uppercase tracking-wide">
                                    {bio}
                                </p>
                            </div>

                            {/* Software Skills */}
                            <div>
                                <h3 className="text-white font-black text-lg mb-4 tracking-wide uppercase" style={{ color: '#dbe4e8' }}>Software Skills</h3>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map(s => <SkillChip key={s.label} {...s} />)}
                                </div>
                            </div>

                            {/* Education + Experience */}
                            <div className="grid grid-cols-2 gap-8 text-[10px]">
                                <div>
                                    <p className="text-white uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: '#dbe4e8' }}>Education</p>
                                    <p className="text-white/40 text-[9px] mb-1">● 2018 - 2022</p>
                                    <p className="text-white/70 font-semibold uppercase">Film & Media Studies</p>
                                    <p className="text-white/40 text-[9px]">Specialization in Post-Production</p>
                                </div>
                                <div>
                                    <p className="text-white uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: '#dbe4e8' }}>Experience</p>
                                    <p className="text-white/40 text-[9px] mb-1 uppercase tracking-wider">Video Editor</p>
                                    <p className="text-white/70 font-semibold text-[9px] uppercase">Freelance & Agency Work</p>
                                    <p className="text-white/40 text-[9px]">Commercials, Music Videos, Reels</p>
                                </div>
                            </div>

                            {/* Language */}
                            <div>
                                <p className="text-white uppercase tracking-[0.2em] mb-3 text-[10px] font-bold" style={{ color: '#dbe4e8' }}>Language (Communication)</p>
                                <div className="space-y-1.5">
                                    {[['Hindi', '100%'], ['English', '80%']].map(([lang, pct]) => (
                                        <div key={lang} className="flex items-center gap-6">
                                            <p className="text-white/50 text-[10px] w-20 uppercase font-medium">{lang}</p>
                                            <p className="text-white/50 text-[10px]">{pct}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    BOX 3 — RECAP PROJECT GALLERY
                ════════════════════════════════════════════════ */}
                <div
                    id="gallery"
                    className="overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl"
                    style={{ background: '#090f19' }}
                >
                    <TabStrip active="PROJECT" />

                    <div className="px-8 py-10">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8 gap-4">
                            <div className="flex items-baseline gap-3">
                                <h2
                                    className="text-white font-black text-2xl tracking-wide uppercase"
                                    style={{ color: '#dbe4e8' }}
                                >
                                    Recap Project 2025
                                </h2>
                                <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest border border-white/10 rounded px-1.5 py-0.5">
                                    No AI
                                </span>
                            </div>

                            {/* Category Filter */}
                            {categories.length > 1 && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all duration-200 ${activeCategory === cat
                                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
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
                            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* First row: 3 small blocks, 1 large block (span 2 cols) */}
                                {filtered.map((p, i) => {
                                    const thumb = p.thumbnail_url ||
                                        (p.cloudinary_thumbnail_id && cloudName
                                            ? `https://res.cloudinary.com/${cloudName}/image/upload/w_600,h_400,c_fill/${p.cloudinary_thumbnail_id}.jpg`
                                            : null);

                                    // Custom masonry logic mimicking the reference image
                                    let colSpan = 'span 1';
                                    let rowSpan = 'span 1';
                                    let minHeight = '140px';

                                    if (i === 3) { colSpan = 'span 2'; } // Wide header banner
                                    if (i === 4) { rowSpan = 'span 2'; minHeight = '292px'; } // Tall portrait poster
                                    if (i === 5) { rowSpan = 'span 2'; minHeight = '292px'; } // Tall portrait poster
                                    if (i === 6) { colSpan = 'span 2'; } // Wide footer banner

                                    return (
                                        <Link
                                            key={p.id}
                                            to={`/portfolio/${p.id}`}
                                            className="relative overflow-hidden rounded bg-black/40 group block"
                                            style={{ gridColumn: colSpan, gridRow: rowSpan, minHeight }}
                                        >
                                            {thumb ? (
                                                <img
                                                    src={thumb}
                                                    alt={p.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                                    <Film size={24} className="text-white/20" />
                                                </div>
                                            )}
                                            {/* Hover info */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-[10px] font-bold tracking-widest uppercase px-4 text-center">{p.title}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-white/20 text-sm">
                                No projects in this category.
                            </div>
                        )}
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    BOX 4 — CONTACT
                ════════════════════════════════════════════════ */}
                <div
                    id="contact"
                    className="overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl relative"
                    style={{ background: '#090f19' }}
                >
                    <TabStrip active="CONTACT PERSON" />

                    <div className="flex flex-col md:flex-row items-stretch gap-8 px-8 py-10">

                        {/* Left: Contact Info */}
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-6 md:w-1/3">
                            <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">Contact Me</p>

                            <div className="flex items-center gap-6">
                                {/* Circular Avatar */}
                                <div className="w-28 h-28 rounded-full overflow-hidden border border-white/10 bg-black">
                                    <img src="/about-bg.png" alt={name} className="w-full h-full object-cover object-top" />
                                </div>
                                {/* Social List */}
                                <div className="space-y-3">
                                    <a href={igUrl} className="flex items-center gap-3 group">
                                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-cyan-400 transition-colors">
                                            <Instagram size={14} />
                                        </div>
                                        <span className="text-white/60 text-[10px] font-bold tracking-widest group-hover:text-white">{settings.instagram_handle || 'INSTAGRAM'}</span>
                                    </a>
                                    <a href={ytUrl} className="flex items-center gap-3 group">
                                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-cyan-400 transition-colors">
                                            <Youtube size={14} />
                                        </div>
                                        <span className="text-white/60 text-[10px] font-bold tracking-widest group-hover:text-white">{settings.youtube_handle || 'YOUTUBE'}</span>
                                    </a>
                                    <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-cyan-400 transition-colors">
                                            <Film size={14} />
                                        </div>
                                        <span className="text-white/60 text-[10px] font-bold tracking-widest group-hover:text-white">EMAIL</span>
                                    </a>
                                </div>
                            </div>

                            <div className="mt-2 text-center uppercase tracking-[0.2em] w-28">
                                <p className="text-white text-[10px] font-bold leading-tight">{name}</p>
                                <p className="text-white/30 text-[8px] mt-1">21</p>
                            </div>
                        </div>

                        {/* Middle/Right: Thank You Visuals */}
                        <div className="flex-1 flex flex-col items-center md:items-end justify-between relative pl-8 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0">

                            {/* Huge Typography */}
                            <div className="text-center md:text-right pr-4 mb-10 w-full">
                                <h2
                                    className="font-black leading-[0.85] text-white/90 uppercase"
                                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#dbe4e8' }}
                                >
                                    THANK YOU<br />
                                    <span className="text-white/20">2025</span>
                                </h2>
                            </div>

                            {/* Year Cards Row */}
                            <div className="flex gap-4 self-center md:self-start w-full max-w-[300px]">
                                <div className="flex-1 bg-black/40 border border-white/5 rounded-lg p-3 relative h-20 overflow-hidden group">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest z-10 relative">Portfolio.</p>
                                    <p className="absolute bottom-2 left-0 right-0 text-center text-white/30 text-[8px] font-bold z-10">2023</p>
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/30 transition-colors" />
                                </div>
                                <div className="flex-1 bg-white border border-white/5 rounded-lg p-3 relative h-20 overflow-hidden group">
                                    <p className="text-black text-[9px] font-black uppercase tracking-tighter leading-tight z-10 relative">DESIGN<br />PORTFOLIO</p>
                                    <p className="absolute bottom-2 left-0 right-0 text-center text-black/50 text-[8px] font-bold z-10">2024</p>
                                    <div className="absolute right-0 bottom-0 top-0 w-8 bg-orange-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer settings={settings} />
        </>
    );
}
