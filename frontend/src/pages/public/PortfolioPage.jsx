import React, { useState, useEffect } from 'react';
import { Search, Clapperboard, MonitorPlay, Film, ArrowUpRight, Mail, Phone } from 'lucide-react';
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

    return (
        <PageLayout
            title="Portfolio & Profile — Videolozy.in"
            description="Explore the creative journey and portfolio of Bhuvan Bhaskar."
            settings={settings}
            bgTheme="slate"
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 overflow-hidden">

                {/* --- GLASSMORPHIC PROFILE SECTION --- */}
                <div className="relative w-full min-h-[800px] mb-32 flex flex-col md:flex-row justify-between pt-10">

                    {/* OVERLAPPING LARGE TEXT BEHIND EVERYTHING */}
                    <div className="absolute top-0 left-0 z-0 leading-[0.85] tracking-tighter opacity-80 mix-blend-overlay pointer-events-none select-none hidden sm:block">
                        <h1 className="text-[12vw] md:text-[8rem] lg:text-[11rem] font-black text-white mix-blend-color-dodge">BHUVAN</h1>
                        <h1 className="text-[12vw] md:text-[8rem] lg:text-[11rem] font-black text-white mix-blend-color-dodge">BHASKAR</h1>
                        <p className="text-xl md:text-3xl font-bold tracking-widest text-slate-400 mt-4 ml-2">SENIOR FILM EDITOR</p>
                    </div>

                    <div className="sm:hidden mb-12 text-center">
                        <h1 className="text-5xl font-black text-white tracking-tighter mix-blend-color-dodge">BHUVAN<br />BHASKAR</h1>
                        <p className="text-sm font-bold tracking-widest text-slate-400 mt-2">SENIOR FILM EDITOR</p>
                    </div>

                    {/* CENTER CUTOUT IMAGE PLACEHOLDER (Z-10) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[90%] z-10 pointer-events-none hidden lg:flex items-end justify-center">
                        {/* Avatar cutout */}
                        <div className="w-[340px] h-[700px] bg-gradient-to-t from-surface-950 to-surface-700/20 rounded-t-full border border-white/5 backdrop-blur-sm shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('/avatar.png')] bg-cover bg-bottom"></div>
                        </div>
                    </div>

                    {/* LEFT COLUMN (Z-20) */}
                    <div className="relative z-20 w-full lg:w-1/3 flex flex-col gap-6 pt-0 sm:pt-48 lg:pt-[22rem]">

                        {/* Creative DNA */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                            <h3 className="text-white font-bold text-xl mb-4 uppercase tracking-wider">Creative DNA</h3>
                            <ul className="text-brand-400 font-bold space-y-1 mb-6 text-lg">
                                <li><span className="text-white">250+</span> Projects.</li>
                                <li><span className="text-white">10+</span> Years.</li>
                                <li><span className="text-white">One</span> obsessive visual mind.</li>
                            </ul>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                                I'm an editor who found home in the cutting room, crafting cinematic experiences that blur the lines between rhythm, sound, and visual storytelling. I play with pacing, color, and emotion to take narratives even further.
                            </p>
                        </div>

                        {/* BEHANCE/PORTFOLIO LINK */}
                        <a href="#gallery" className="bg-surface-950 border border-white/5 rounded-3xl p-6 flex items-center gap-6 hover:border-brand-500/50 transition-colors group cursor-pointer shadow-xl">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-black font-black text-3xl shrink-0 leading-none">
                                Vl
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl uppercase tracking-wider mb-1">Portfolio</h4>
                                <p className="text-slate-400 text-sm mb-2">Click to view my world.</p>
                                <div className="flex items-center gap-2 text-brand-400">
                                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <span className="text-xs truncate max-w-[150px]">videolozy.in/portfolio</span>
                                </div>
                            </div>
                        </a>

                        {/* MEGA CLIENTS */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                            <h3 className="text-brand-400 font-bold text-lg mb-6 uppercase tracking-wider">Mega <span className="text-white">Clients</span></h3>
                            <div className="grid grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 text-white">
                                <div className="flex justify-center"><MonitorPlay size={32} /></div>
                                <div className="flex justify-center"><Film size={32} /></div>
                                <div className="flex justify-center"><Clapperboard size={32} /></div>
                                <div className="flex justify-center"><MonitorPlay size={32} /></div>
                                <div className="flex justify-center"><Film size={32} /></div>
                                <div className="flex justify-center"><Clapperboard size={32} /></div>
                                <div className="flex justify-center"><MonitorPlay size={32} /></div>
                                <div className="flex justify-center"><Film size={32} /></div>
                                <div className="flex justify-center"><Clapperboard size={32} /></div>
                            </div>
                        </div>

                        {/* CONTACT */}
                        <div className="mt-8 space-y-2 text-sm text-slate-400 font-medium bg-black/40 p-4 rounded-xl border border-white/5 inline-block w-fit backdrop-blur-md">
                            <p className="flex items-center gap-3"><Mail size={16} /> {settings.contact_email || 'hello@videolozy.in'}</p>
                            <p className="flex items-center gap-3"><Phone size={16} /> +91 98765 43210</p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Z-20) */}
                    <div className="relative z-20 w-full lg:w-1/3 flex flex-col gap-6 pt-10 lg:pt-16 lg:items-end">

                        {/* EDUCATION */}
                        <div className="lg:text-right mb-6 lg:mb-10 max-w-sm">
                            <h3 className="text-white font-bold text-xl mb-2 uppercase tracking-wider">Education</h3>
                            <p className="text-slate-400 text-sm font-light">Bachelor of Fine Arts (BFA)<br />Film Editing & Visual FX</p>
                        </div>

                        {/* SKILLS */}
                        <div className="lg:text-right mb-6 lg:mb-32">
                            <h3 className="text-brand-400 font-bold text-xl mb-4 uppercase tracking-wider">Skills</h3>
                            <ul className="text-slate-300 text-sm space-y-2 font-light">
                                <li>Video Editing</li>
                                <li>Color Grading</li>
                                <li>Visual Storytelling</li>
                                <li>Motion Graphics</li>
                                <li>Sound Design</li>
                                <li>VFX Compositing</li>
                                <li>Team Leadership</li>
                                <li>Creative Direction</li>
                            </ul>
                        </div>

                        {/* CREATIVE JOURNEY */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl w-full">
                            <h3 className="text-white font-bold text-xl mb-8 uppercase tracking-wider lg:text-right">Creative Journey</h3>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent lg:before:ml-auto lg:before:mr-2">

                                <div className="relative flex items-center justify-between md:justify-normal lg:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-surface-900 bg-brand-500 text-slate-500 shrink-0 absolute left-0 md:left-1/2 md:-ml-2.5 lg:left-auto lg:right-0"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] lg:w-[calc(100%-2.5rem)] pl-4 md:pl-0 lg:pr-4 md:pr-4 group-odd:pl-4 lg:group-odd:pl-0 lg:text-right">
                                        <h4 className="text-brand-400 font-bold text-sm uppercase tracking-wider">Senior Film Editor</h4>
                                        <p className="text-white text-sm font-medium">Videolozy.in</p>
                                        <p className="text-slate-500 text-xs">2022 – Present (Full-Time / Remote)</p>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal lg:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-surface-900 bg-white/20 text-slate-500 shrink-0 absolute left-0 md:left-1/2 md:-ml-2.5 lg:left-auto lg:right-0"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] lg:w-[calc(100%-2.5rem)] pl-4 md:pl-0 lg:pr-4 md:pr-4 group-odd:pl-4 lg:group-odd:pl-0 lg:text-right">
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Lead Editor</h4>
                                        <p className="text-slate-300 text-sm font-medium">Creative Agency Studios</p>
                                        <p className="text-slate-500 text-xs">2019 – 2022 (Full-Time)</p>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal lg:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-surface-900 bg-white/20 text-slate-500 shrink-0 absolute left-0 md:left-1/2 md:-ml-2.5 lg:left-auto lg:right-0"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] lg:w-[calc(100%-2.5rem)] pl-4 md:pl-0 lg:pr-4 md:pr-4 group-odd:pl-4 lg:group-odd:pl-0 lg:text-right">
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Freelance Editor</h4>
                                        <p className="text-slate-300 text-sm font-medium">Self-Employed</p>
                                        <p className="text-slate-500 text-xs">2016 – 2019</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* --- SEPARATOR --- */}
                <div id="gallery" className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-20"></div>

                {/* --- ORIGINAL PORTFOLIO GRID --- */}
                <div className="text-center mb-12">
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Projects</p>
                    <h2 className="section-title mb-4">Video Gallery</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        A curated selection of my past projects spanning various genres and visual styles.
                    </p>
                </div>

                {/* Category filter */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-32"><LoadingSpinner size="lg" text="Loading projects..." /></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">{error}</div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Clapperboard size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No projects found in this category.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
