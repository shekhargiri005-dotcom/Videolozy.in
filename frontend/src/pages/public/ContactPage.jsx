import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { submitContact, fetchSiteSettings } from '../../services/api';

const BUDGET_OPTIONS = [
    '', 'Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000', 'Above ₹1,00,000', 'Let\'s discuss',
];

export default function ContactPage() {
    const [settings, setSettings] = useState({});
    const [form, setForm] = useState({ name: '', email: '', message: '', budget: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        fetchSiteSettings().then((res) => setSettings(res.data)).catch(() => { });
    }, []);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required.';
        if (!form.message.trim()) e.message = 'Message is required.';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e_ = validate();
        if (Object.keys(e_).length > 0) { setErrors(e_); return; }
        setSubmitting(true);
        setServerError('');
        try {
            await submitContact(form);
            setSubmitted(true);
        } catch (err) {
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).join(' ')
                : 'Something went wrong. Please try again.';
            setServerError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact — Videolozy.in</title>
                <meta name="description" content="Hire Videolozy.in for your next film editing project. Get in touch today." />
            </Helmet>
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="text-center mb-12">
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Let's Work Together</p>
                    <h1 className="section-title mb-4">Get In Touch</h1>
                    <p className="text-slate-400">Have a project in mind? Fill out the form and I'll get back to you soon.</p>
                </div>

                {submitted ? (
                    <div className="card p-10 text-center animate-fade-in">
                        <CheckCircle size={52} className="text-green-400 mx-auto mb-4" />
                        <h2 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h2>
                        <p className="text-slate-400">Thanks for reaching out. I'll reply within 24–48 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card p-8 space-y-5" noValidate>
                        <div>
                            <label className="label">Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Your full name"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="label">Email <span className="text-red-400">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="label">Message <span className="text-red-400">*</span></label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={5}
                                className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                                placeholder="Tell me about your project..."
                            />
                            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                        </div>

                        <div>
                            <label className="label">Budget <span className="text-slate-500 text-xs font-normal">(optional)</span></label>
                            <select
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {BUDGET_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt} className="bg-surface-900">
                                        {opt || 'Select a budget range'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {serverError && (
                            <p className="text-red-400 text-sm text-center">{serverError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Sending...' : (
                                <><Send size={18} /> Send Message</>
                            )}
                        </button>
                    </form>
                )}
            </div>

            <Footer settings={settings} />
        </>
    );
}
