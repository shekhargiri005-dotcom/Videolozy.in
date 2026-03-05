import React, { useState, useEffect } from 'react';
import { Briefcase, Mail, Camera, Film } from 'lucide-react';
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
    const nameParts = name.split(' ');

    return (
        <PageLayout
            title="About — Videolozy.in"
            description="Learn more about the film editor behind Videolozy.in."
            settings={settings}
            bgTheme="slate"
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

                {/*
                ── MAGAZINE COVER ABOUT CARD ──
                Layout inspired by the editorial magazine cover reference:
                - Full character centered + dominant
                - Text overlaid left, right, and bottom like editorial columns
                - Full body visible — no cropping
                */}
                <div
                    className="relative w-full overflow-hidden rounded-[40px] border border-cyan-900/30 shadow-2xl"
                    style={{ background: '#051114', minHeight: '700px' }}
                >
                    {/* ── AMBIENT BACKGROUND GLOWS ── */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/8 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-900/20 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-900/10 blur-[100px] rounded-full" />
                    </div>

                    {/*
                    ── DESKTOP LAYOUT: magazine grid ──
                    3 zones: left text | center image | right text
                    */}
                    <div className="hidden lg:grid relative z-10" style={{ gridTemplateColumns: '1fr 2fr 1fr', minHeight: '700px' }}>

                        {/* ── LEFT EDITORIAL COLUMN ── */}
                        <div className="flex flex-col justify-between p-10 border-r border-cyan-900/20">
                            {/* Top: title label */}
                            <div>
                                <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.35em] mb-6">Film Editor</p>
                                <p className="text-white/10 font-black text-[80px] leading-none tracking-tighter select-none mb-8 -ml-2">
                                    {nameParts[0] || 'BB'}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-cyan-400/80 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Specialty</h3>
                                        <p className="text-white font-bold text-sm leading-snug">Mastering<br />Cinematic<br />Storytelling</p>
                                    </div>
                                    <div className="w-8 h-px bg-cyan-700" />
                                    <div>
                                        <h3 className="text-cyan-400/80 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Expertise</h3>
                                        <p className="text-white font-bold text-sm leading-snug">Video Editing<br />Color Grading<br />Visual FX</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Experience card */}
                            <div className="bg-white/5 border border-cyan-900/30 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase size={14} className="text-cyan-400" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Experience</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Commercials, music videos, short films, and documentaries.
                                </p>
                            </div>
                        </div>

                        {/* ── CENTER: FULL CHARACTER IMAGE (magazine cover hero) ── */}
                        <div className="relative flex items-end justify-center overflow-hidden">
                            {/* Subtle vignette sides */}
                            <div className="absolute inset-y-0 left-0 w-16 z-20 bg-gradient-to-r from-[#051114] to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-16 z-20 bg-gradient-to-l from-[#051114] to-transparent" />
                            {/* Bottom fade */}
                            <div className="absolute inset-x-0 bottom-0 h-32 z-20 bg-gradient-to-t from-[#051114] to-transparent" />

                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="relative z-10 w-full object-contain object-bottom"
                                style={{ maxHeight: '100vh' }}
                            />

                            {/* Floating label at top center */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 text-center">
                                <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.5em]">The Visionary Issue</p>
                            </div>
                        </div>

                        {/* ── RIGHT EDITORIAL COLUMN ── */}
                        <div className="flex flex-col justify-between p-10 border-l border-cyan-900/20">
                            {/* Top: second name part / brand */}
                            <div>
                                <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.35em] mb-6">Portfolio</p>
                                <p className="text-white/10 font-black text-[80px] leading-none tracking-tighter select-none mb-8 -mr-2 text-right">
                                    {nameParts[1] || 'IN'}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-cyan-400/80 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Projects</h3>
                                        <p className="text-white font-bold text-sm leading-snug">250+<br />Completed<br />Productions</p>
                                    </div>
                                    <div className="w-8 h-px bg-cyan-700 ml-auto" />
                                    <div>
                                        <h3 className="text-cyan-400/80 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Experience</h3>
                                        <p className="text-white font-bold text-sm leading-snug text-right">10+ Years<br />In The<br />Industry</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: contact card */}
                            <div className="bg-white/5 border border-cyan-900/30 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail size={14} className="text-cyan-400" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Get In Touch</span>
                                </div>
                                <p className="text-slate-400 text-xs">
                                    {settings.contact_email ? (
                                        <a href={`mailto:${settings.contact_email}`}
                                            className="hover:text-cyan-300 transition-colors underline underline-offset-4 break-all">
                                            {settings.contact_email}
                                        </a>
                                    ) : 'Contact via the contact page.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/*
                    ── MOBILE LAYOUT: stacked magazine ──
                    Image centered + full visible, stats below
                    */}
                    <div className="lg:hidden relative z-10 flex flex-col items-center">

                        {/* Top label */}
                        <div className="pt-10 pb-4 text-center">
                            <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em]">About</p>
                            <h1 className="text-4xl font-display font-bold text-white mt-2">{name}</h1>
                            <p className="text-cyan-200/60 text-sm mt-1">{settings.editor_tagline || 'Film Editor'}</p>
                        </div>

                        {/* Full character image — centered, full visible */}
                        <div className="relative w-full flex justify-center">
                            <div className="absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-[#051114] to-transparent" />
                            <img
                                src="/about-bg.png"
                                alt={name}
                                className="relative z-0 w-full object-contain"
                                style={{ maxHeight: '70vh' }}
                            />
                        </div>

                        {/* Bio + cards below */}
                        <div className="relative z-10 w-full px-6 pb-10 pt-4 space-y-4">
                            {settings.about_text && (
                                <div className="bg-white/5 border border-cyan-900/30 rounded-2xl p-5">
                                    <p className="text-slate-200 text-sm leading-relaxed">{settings.about_text}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-cyan-900/30 rounded-xl p-4">
                                    <Briefcase size={14} className="text-cyan-400 mb-2" />
                                    <p className="text-white text-xs font-bold mb-1">Experience</p>
                                    <p className="text-slate-400 text-xs">Commercials, music videos, documentaries.</p>
                                </div>
                                <div className="bg-white/5 border border-cyan-900/30 rounded-xl p-4">
                                    <Mail size={14} className="text-cyan-400 mb-2" />
                                    <p className="text-white text-xs font-bold mb-1">Get in Touch</p>
                                    {settings.contact_email ? (
                                        <a href={`mailto:${settings.contact_email}`}
                                            className="text-slate-400 text-xs hover:text-cyan-300 underline underline-offset-2 break-all">
                                            {settings.contact_email}
                                        </a>
                                    ) : <p className="text-slate-400 text-xs">Contact page</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── BOTTOM STRIP (desktop only) — like magazine bottom blurb ── */}
                    <div className="hidden lg:block relative z-20 border-t border-cyan-900/20 px-10 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Film size={16} className="text-cyan-500" />
                                <span className="text-white/70 text-xs font-bold uppercase tracking-[0.3em]">
                                    {settings.editor_tagline || 'Crafting Stories Frame by Frame'}
                                </span>
                            </div>
                            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Videolozy.in</p>
                        </div>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
}
