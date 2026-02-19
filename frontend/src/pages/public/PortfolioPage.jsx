import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Clapperboard } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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
        <>
            <Helmet>
                <title>Portfolio — Videolozy.in</title>
                <meta name="description" content="Browse all video editing projects by Videolozy.in — commercials, music videos, documentaries, and more." />
            </Helmet>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center mb-12">
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Work</p>
                    <h1 className="section-title mb-4">Portfolio</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        A curated selection of projects spanning various genres and styles.
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

            <Footer settings={settings} />
        </>
    );
}
