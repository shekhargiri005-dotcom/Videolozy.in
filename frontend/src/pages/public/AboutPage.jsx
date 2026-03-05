import React, { useState, useEffect } from 'react';
import { Briefcase, Mail, Film, Star } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { PageLoader } from '../../components/LoadingSpinner';
import { fetchSiteSettings } from '../../services/api';

export default function AboutPage() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSiteSettings()
            .then((res) => setSettings(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageLoader />;

    const name = settings.editor_name || 'Videolozy';
    const tagline = settings.editor_tagline || 'Senior Film Editor';
    const bio = settings.about_text || 'A passionate film editor crafting stories through rhythm, pacing, and visual storytelling. Specializing in commercials, music videos, short films, and documentaries.';
    const email = settings.contact_email || '';

    return (
        <PageLayout
            title="About — Videolozy.in"
            description="Learn more about the film editor behind Videolozy.in."
            settings={settings}
            bgTheme="slate"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

                {/* ── ABOUT CARD ── */}
                <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 shadow-2xl bg-[#07141a]">

                    {/* Subtle ambient glow */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-cyan-950/40 blur-[100px]" />
                    </div>

                    {/* ── TWO-COLUMN GRID ── */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

                        {/* ── LEFT: PORTRAIT (proportional, full body, no crop) ── */}
                        <div className="relative flex items-end justify-center overflow-hidden bg-[#051114]">

                            {/* Right-edge blend into content column */}
                            <div className="hidden lg:block absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-r from-transparent to-[#07141a]" />
                            {/* Bottom fade — mobile */}
                            <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 z-20 bg-gradient-to-t from-[#07141a] to-transparent" />

                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="relative z-10 w-full object-contain object-bottom"
                                style={{ maxHeight: '90vh' }}
                            />
                        </div>

                        {/* ── RIGHT: CONTENT (clear hierarchy) ── */}
                        <div className="flex flex-col justify-center gap-6 px-8 py-12 lg:px-12 lg:py-16">

                            {/* 1 — Label */}
                            <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.35em]">
                                About
                            </p>

                            {/* 2 — Primary: Name + Title */}
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight">
                                    {name}
                                </h1>
                                <p className="text-cyan-300/80 text-base font-semibold tracking-wide mt-2">
                                    {tagline}
                                </p>
                            </div>

                            {/* Accent line */}
                            <div className="w-12 h-0.5 bg-cyan-500/50 rounded-full" />

                            {/* 3 — Bio */}
                            <p className="text-slate-300 leading-relaxed text-[15px]">
                                {bio}
                            </p>

                            {/* 4 — Stats (close to intro for logical flow) */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: '250+', label: 'Projects' },
                                    { value: '10+', label: 'Years' },
                                    { value: '5★', label: 'Rated' },
                                ].map(({ value, label }) => (
                                    <div
                                        key={label}
                                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                                    >
                                        <p className="text-white text-xl font-bold font-display leading-none mb-1">{value}</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 5 — Skills */}
                            <div className="flex flex-wrap gap-2">
                                {['Video Editing', 'Color Grading', 'Visual FX', 'Motion Graphics', 'Sound Design'].map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 text-xs font-medium text-cyan-300/80 bg-cyan-900/20 border border-cyan-900/40 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* 6 — Contact */}
                            {email && (
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-fit">
                                    <Mail size={15} className="text-cyan-400 shrink-0" />
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-slate-300 text-sm hover:text-cyan-300 transition-colors"
                                    >
                                        {email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
