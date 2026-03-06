import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Reusable layout wrapper for internal pages (About, Portfolio, Contact)
 * Ensures a consistent cinematic background and structure, keeping page files clean.
 */
export default function PageLayout({ children, title, description, settings, bgTheme = 'default' }) {
    return (
        <div className="min-h-screen flex flex-col relative z-0">
            <Helmet>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
            </Helmet>

            <Navbar />

            {/* Cinematic Background shared across standard pages */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/filmset-bg.png')" }}
                />
                {bgTheme === 'golden' ? (
                    <>
                        {/* Golden/Amber gradient overlay for Portfolio & About */}
                        <div className="absolute inset-0 bg-amber-950/85 backdrop-blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/20 via-amber-900/50 to-surface-950/95" />
                    </>
                ) : bgTheme === 'slate' ? (
                    <>
                        {/* Sleek Slate/Gray modern studio gradient from the mockup */}
                        <div className="absolute inset-0 bg-[#2C2C2F]/90 backdrop-blur-md" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#4A4B50]/30 via-[#2C2C2F]/60 to-[#101012]" />
                    </>
                ) : bgTheme === 'contact' ? (
                    <>
                        {/* Contact page: use contact-bg.png instead of filmset-bg.png */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/contact-bg.png')" }}
                        />
                        <div className="absolute inset-0 bg-surface-950/75 backdrop-blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/40 via-surface-950/60 to-surface-950/95" />
                    </>
                ) : (
                    <>
                        {/* Standard dark cinematic gradient overlay */}
                        <div className="absolute inset-0 bg-surface-950/85 backdrop-blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/50 via-surface-950/80 to-surface-950/95" />
                    </>
                )}
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow">
                {children}
            </main>

            <div className="relative z-10 mt-auto">
                <Footer settings={settings} />
            </div>
        </div>
    );
}
