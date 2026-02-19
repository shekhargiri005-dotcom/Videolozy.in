import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-14 h-14 border-4',
    };
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeMap[size]} rounded-full border-brand-600 border-t-transparent animate-spin`}
            />
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading..." />
        </div>
    );
}
