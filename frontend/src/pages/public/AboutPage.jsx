import React, { useState, useEffect } from 'react';
import { Briefcase, Camera, Mail } from 'lucide-react';
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

    return (
        <PageLayout
            title="About — Videolozy.in"
            description="Learn more about the film editor behind Videolozy.in."
            settings={settings}
            bgTheme="slate"
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

                {/* ── ABOUT CARD ── */}
                <div className="relative w-full overflow-hidden rounded-[40px] border border-cyan-900/30 shadow-2xl bg-[#051114]">

                    {/* Ambient glow blobs */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-72 bg-cyan-500/10 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400/5 blur-[80px] rounded-full" />
                    </div>

                    {/* ── TWO-COLUMN LAYOUT ── */}
                    <div className="relative z-10 flex flex-col lg:flex-row min-h-[600px]">

                        {/* ── LEFT: FULL IMAGE (no crop, full visibility) ── */}
                        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#051114]/80 p-6 lg:p-10">
                            <div className="w-full max-w-sm lg:max-w-full flex items-center justify-center">
                                <img
                                    src="/about-bg.png"
                                    alt={settings.editor_name || 'About — Videolozy.in'}
                                    className="w-full h-auto max-h-[70vh] object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.20)] rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* ── RIGHT: TEXT CONTENT ── */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-12 lg:py-16 gap-8">

                            {/* Header */}
                            <div>
                                <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">About</p>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-3">
                                    {settings.editor_name || 'Videolozy'}
                                </h1>
                                <p className="text-cyan-200/70 text-base lg:text-lg font-medium tracking-wide">
                                    {settings.editor_tagline || 'Film Editor'}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="w-16 h-px bg-cyan-500/40" />

                            {/* Bio */}
                            <div className="bg-white/5 backdrop-blur-md border border-cyan-900/40 rounded-2xl p-6">
                                <p className="text-slate-200 leading-relaxed text-base whitespace-pre-line">
                                    {settings.about_text || 'A passionate film editor crafting stories through rhythm, pacing, and visual storytelling.'}
                                </p>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Experience */}
                                <div className="bg-white/5 backdrop-blur-md border border-cyan-900/40 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-700/30 flex items-center justify-center">
                                            <Briefcase size={16} className="text-cyan-300" />
                                        </div>
                                        <h3 className="font-semibold text-white text-sm tracking-wide">Experience</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Commercials, music videos, short films, and documentaries.
                                    </p>
                                </div>

                                {/* Contact */}
                                <div className="bg-white/5 backdrop-blur-md border border-cyan-900/40 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-700/30 flex items-center justify-center">
                                            <Mail size={16} className="text-cyan-300" />
                                        </div>
                                        <h3 className="font-semibold text-white text-sm tracking-wide">Get in Touch</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        {settings.contact_email ? (
                                            <a
                                                href={`mailto:${settings.contact_email}`}
                                                className="hover:text-cyan-300 transition-colors underline underline-offset-4"
                                            >
                                                {settings.contact_email}
                                            </a>
                                        ) : (
                                            'Contact via the contact page.'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
