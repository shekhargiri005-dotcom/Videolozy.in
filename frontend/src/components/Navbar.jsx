import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { checkAdminEmail } from '../services/api';

const PUBLIC_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

/* ── Easter-egg email gate modal ─────────────────────────────────────── */
function AdminGateModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [checking, setChecking] = useState(false);
    const [granted, setGranted] = useState(false);
    const [shook, setShook] = useState(false);   // wrong-email shake animation
    const inputRef = useRef();

    // Auto-focus the input when modal opens
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 80);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleVerify = async () => {
        if (!email.trim() || checking) return;
        setChecking(true);
        try {
            const res = await checkAdminEmail(email.trim());
            if (res.data.matched) {
                setGranted(true);
            } else {
                // Wrong email — silently shake + close (no error text leaked)
                setShook(true);
                setTimeout(() => { setShook(false); onClose(); }, 600);
            }
        } catch {
            onClose(); // network error → silent close
        } finally {
            setChecking(false);
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Blurred dark overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal card */}
            <div
                className={`relative z-10 w-full max-w-sm mx-4 bg-surface-900 border border-white/10 rounded-2xl p-7 shadow-2xl shadow-black/60
                    transition-all duration-300 animate-slide-up
                    ${shook ? 'animate-shake' : ''}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                {!granted ? (
                    <>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                                <ShieldCheck size={18} className="text-brand-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Secure Access</p>
                                <p className="text-slate-500 text-xs">Enter your registered email</p>
                            </div>
                        </div>

                        <input
                            ref={inputRef}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
                            placeholder="your@email.com"
                            className="w-full bg-surface-950 border border-white/10 text-slate-100 rounded-xl px-4 py-3 text-sm
                                focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
                                placeholder-slate-600 transition-all duration-200 mb-4"
                        />

                        <button
                            onClick={handleVerify}
                            disabled={checking || !email.trim()}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
                                bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {checking
                                ? <><Loader2 size={15} className="animate-spin" /> Verifying…</>
                                : 'Verify'
                            }
                        </button>
                    </>
                ) : (
                    /* Access granted screen */
                    <div className="text-center py-2">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-green-500/15 border border-green-500/30
                            flex items-center justify-center mb-4 animate-pulse-slow">
                            <ShieldCheck size={28} className="text-green-400" />
                        </div>
                        <p className="text-white font-semibold mb-1">Access Granted</p>
                        <p className="text-slate-400 text-sm mb-5">Welcome back.</p>
                        <a
                            href={import.meta.env.VITE_ADMIN_URL || '/admin'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                                bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 shadow-lg shadow-brand-900/40"
                        >
                            <ExternalLink size={15} /> Open Admin Panel
                        </a>
                        <p className="text-slate-600 text-xs mt-4">Opens in a new tab</p>
                    </div>
                )}
            </div>

            {/* Shake keyframe */}
            <style>{`
                @keyframes shake {
                  0%,100%{ transform:translateX(0) }
                  20%    { transform:translateX(-8px) }
                  40%    { transform:translateX(8px) }
                  60%    { transform:translateX(-5px) }
                  80%    { transform:translateX(5px) }
                }
                .animate-shake { animation: shake 0.5s ease; }
            `}</style>
        </div>
    );
}

/* ── Main Navbar ─────────────────────────────────────────────────────── */
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [gateOpen, setGateOpen] = useState(false);
    const location = useLocation();

    // 5-click easter egg on the logo
    const clickCount = useRef(0);
    const clickTimer = useRef(null);

    const handleLogoClick = () => {
        clickCount.current += 1;
        clearTimeout(clickTimer.current);

        if (clickCount.current >= 5) {
            clickCount.current = 0;
            setGateOpen(true);
        } else {
            // Reset counter if no next click within 1.2 s
            clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1200);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-900/70 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo — secret 5-click trigger */}
                        <button
                            onClick={handleLogoClick}
                            className="flex items-center gap-2.5 font-display font-bold text-xl text-white select-none focus:outline-none"
                            aria-label="Home"
                        >
                            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                                <Film size={18} className="text-white" />
                            </div>
                            <span>Videolozy<span className="text-brand-400">.in</span></span>
                        </button>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-1">
                            {PUBLIC_LINKS.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === to
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile burger */}
                        <button
                            className="md:hidden text-slate-400 hover:text-white transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-surface-900/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 space-y-1">
                        {PUBLIC_LINKS.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {/* Email gate modal — renders outside nav via portal-like absolute positioning */}
            {gateOpen && <AdminGateModal onClose={() => setGateOpen(false)} />}
        </>
    );
}
