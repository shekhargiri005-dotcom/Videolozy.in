import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Instagram, Youtube, Music } from 'lucide-react';

export default function Footer({ settings = {}, hideNavigation = false }) {
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
                    {!hideNavigation && (
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
                    )}

                    {/* Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <a href={settings.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-surface-900 border border-surface-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/30 transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href={settings.youtube_url || "https://youtube.com"} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-surface-900 border border-surface-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                                <Youtube size={18} />
                            </a>
                            <a href={settings.spotify_url || "https://spotify.com"} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-surface-900 border border-surface-800 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/30 transition-all">
                                <Music size={18} />
                            </a>
                        </div>
                        {settings.contact_email && (
                            <a href={`mailto:${settings.contact_email}`}
                                className="text-slate-400 hover:text-brand-400 transition-colors text-sm">
                                {settings.contact_email}
                            </a>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                    <div>© {new Date().getFullYear()} Videolozy.in. All rights reserved.</div>
                    <div className="font-medium tracking-wider uppercase">Patna, Bihar</div>
                </div>
            </div>
        </footer>
    );
}
