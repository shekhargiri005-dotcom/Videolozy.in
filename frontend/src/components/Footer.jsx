import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Instagram, Youtube, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer({ settings = {} }) {
    return (
        <footer className="border-t border-white/10 bg-surface-950 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 font-display font-bold text-xl text-white mb-3">
                            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                                <Film size={18} className="text-white" />
                            </div>
                            <span>Videolozy<span className="text-brand-400">.in</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {settings.editor_tagline || 'Crafting Stories Frame by Frame'}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            {[['/', 'Home'], ['/portfolio', 'Portfolio'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                                <li key={to}>
                                    <Link to={to} className="text-slate-400 hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Connect</h4>
                        <div className="flex flex-col gap-2">
                            {settings.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors text-sm">
                                    <Instagram size={16} /> Instagram
                                </a>
                            )}
                            {settings.youtube_url && (
                                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm">
                                    <Youtube size={16} /> YouTube
                                </a>
                            )}
                            {settings.linkedin_url && (
                                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm">
                                    <Linkedin size={16} /> LinkedIn
                                </a>
                            )}
                            {settings.vimeo_url && (
                                <a href={settings.vimeo_url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm">
                                    <ExternalLink size={16} /> Vimeo
                                </a>
                            )}
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`}
                                    className="text-slate-400 hover:text-brand-400 transition-colors text-sm">
                                    {settings.contact_email}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} Videolozy.in. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
