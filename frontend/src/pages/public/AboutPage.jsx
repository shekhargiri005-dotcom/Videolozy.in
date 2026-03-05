import React, { useState, useEffect } from 'react';
import { Briefcase, Mail } from 'lucide-react';
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
                <div
                    className="relative w-full overflow-hidden rounded-[40px] border border-cyan-900/30 shadow-2xl"
                    style={{ background: '#051114' }}
                >
                    {/* Ambient glow blobs — behind everything */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-2/3 h-full bg-cyan-950/30 blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400/5 blur-[80px] rounded-full" />
                    </div>

                    {/* ── LAYOUT: image left + content right ── */}
                    <div className="relative z-10 flex flex-col lg:flex-row">

                        {/* ── LEFT: IMAGE PANEL (atmospheric, no crop) ── */}
                        <div className="relative w-full lg:w-[45%] flex-shrink-0 flex items-stretch">

                            {/*
                                The image sits inside a column. We use `object-contain` so
                                the FULL image is always shown — no cropping whatsoever.
                                On desktop the image fills the column height naturally.
                                On mobile it scales down proportionally.
                            */}
                            <div className="relative w-full flex items-center justify-center
                                            py-10 px-6 lg:py-0 lg:px-0 min-h-[360px] lg:min-h-[600px]">

                                <img
                                    src="/about-bg.png"
                                    alt={settings.editor_name || 'Film Editor Portrait'}
                                    className="relative z-10 w-full h-full max-h-[80vh] object-contain object-center"
                                    style={{ display: 'block' }}
                                />

                                {/*
                                    Gradient on the RIGHT edge of the image panel so it
                                    bleeds seamlessly into the content column.
                                    Only visible on large screens.
                                */}
                                <div className="hidden lg:block absolute inset-y-0 right-0 w-40 z-20
                                                bg-gradient-to-r from-transparent to-[#051114]" />

                                {/* Bottom fade so image blends into dark bg on mobile */}
                                <div className="lg:hidden absolute inset-x-0 bottom-0 h-28 z-20
                                                bg-gradient-to-t from-[#051114] to-transparent" />
                            </div>
                        </div>

                        {/* ── RIGHT: TEXT CONTENT ── */}
                        <div className="relative z-10 w-full lg:w-[55%] flex flex-col justify-center
                                        px-8 pb-12 pt-2 lg:px-14 lg:py-16 gap-7">

                            {/* Label + Title + Tagline */}
                            <div>
                                <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">
                                    About
                                </p>
                                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-display font-bold
                                               text-white leading-tight mb-3 drop-shadow-xl">
                                    {settings.editor_name || 'Videolozy'}
                                </h1>
                                <p className="text-cyan-200/70 text-base lg:text-lg font-medium tracking-wide">
                                    {settings.editor_tagline || 'Film Editor'}
                                </p>
                            </div>

                            {/* Teal accent line */}
                            <div className="w-14 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />

                            {/* Bio */}
                            <div className="bg-white/5 backdrop-blur-md border border-cyan-900/30 rounded-2xl p-6">
                                <p className="text-slate-200 leading-relaxed text-base whitespace-pre-line">
                                    {settings.about_text || 'A passionate film editor crafting stories through rhythm, pacing, and visual storytelling.'}
                                </p>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-cyan-900/30 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-700/30 flex items-center justify-center">
                                            <Briefcase size={15} className="text-cyan-300" />
                                        </div>
                                        <h3 className="font-semibold text-white text-sm tracking-wide">Experience</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Commercials, music videos, short films, and documentaries.
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-md border border-cyan-900/30 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-700/30 flex items-center justify-center">
                                            <Mail size={15} className="text-cyan-300" />
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
