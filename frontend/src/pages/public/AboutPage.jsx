import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Briefcase, Camera } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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
        <>
            <Helmet>
                <title>About — Videolozy.in</title>
                <meta name="description" content="Learn more about the film editor behind Videolozy.in." />
            </Helmet>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center mb-14">
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">About</p>
                    <h1 className="section-title mb-4">{settings.editor_name || 'Videolozy'}</h1>
                    <p className="text-slate-400">{settings.editor_tagline || 'Film Editor'}</p>
                </div>

                {/* Avatar placeholder */}
                <div className="flex justify-center mb-12">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-brand-900/40">
                        <User size={52} className="text-white" />
                    </div>
                </div>

                {/* About text */}
                <div className="card p-8 mb-8">
                    <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                        {settings.about_text || 'Bio coming soon.'}
                    </p>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center">
                                <Briefcase size={18} className="text-brand-400" />
                            </div>
                            <h3 className="font-semibold text-white">Experience</h3>
                        </div>
                        <p className="text-slate-400 text-sm">Commercials, music videos, short films, and documentaries.</p>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                <Camera size={18} className="text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-white">Get in Touch</h3>
                        </div>
                        <p className="text-slate-400 text-sm">
                            {settings.contact_email ? (
                                <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors underline underline-offset-2">
                                    {settings.contact_email}
                                </a>
                            ) : (
                                'Contact via the contact page.'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <Footer settings={settings} />
        </>
    );
}
