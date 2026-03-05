import React, { useState, useEffect } from 'react';
import { Briefcase, Camera } from 'lucide-react';
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
                <div className="relative w-full min-h-[700px] flex flex-col items-center pt-24 pb-16 overflow-hidden rounded-[40px] shadow-2xl shadow-black/50">

                    {/* FULL BACKGROUND IMAGE */}
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[40px] overflow-hidden">
                        <div
                            className="absolute inset-0 bg-[url('/about-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-700">
                        </div>

                        {/* Edge Gradients */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent"></div>
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/70 to-transparent"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-4xl px-4 text-center mb-14">
                        <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2 drop-shadow-md">About</p>
                        <h1 className="section-title mb-4 drop-shadow-xl">{settings.editor_name || 'Videolozy'}</h1>
                        <p className="text-slate-300 font-medium drop-shadow-md">{settings.editor_tagline || 'Film Editor'}</p>
                    </div>

                    <div className="relative z-10 w-full max-w-4xl px-4">
                        {/* About text */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
                            <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line">
                                {settings.about_text || 'Bio coming soon.'}
                            </p>
                        </div>

                        {/* Info cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-brand-600/30 flex items-center justify-center">
                                        <Briefcase size={18} className="text-brand-300" />
                                    </div>
                                    <h3 className="font-semibold text-white tracking-wide">Experience</h3>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">Commercials, music videos, short films, and documentaries.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-purple-600/30 flex items-center justify-center">
                                        <Camera size={18} className="text-purple-300" />
                                    </div>
                                    <h3 className="font-semibold text-white tracking-wide">Get in Touch</h3>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    {settings.contact_email ? (
                                        <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors underline underline-offset-4">
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
        </PageLayout>
    );
}
