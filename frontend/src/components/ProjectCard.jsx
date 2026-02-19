import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function ProjectCard({ project }) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

    const thumbnailUrl = project.thumbnail_url ||
        (project.cloudinary_thumbnail_id && cloudName
            ? `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/${project.cloudinary_thumbnail_id}.jpg`
            : null);

    return (
        <Link to={`/portfolio/${project.id}`} className="group block card-hover">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-surface-800 overflow-hidden">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
                        <Play size={40} className="text-slate-600" />
                    </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
                    <div className="w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-xl shadow-brand-900/50">
                        <Play size={22} className="text-white ml-1" fill="white" />
                    </div>
                </div>
                {/* Category badge */}
                {project.category && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white font-medium">
                            {project.category}
                        </span>
                    </div>
                )}
                {project.is_featured && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-brand-600/80 backdrop-blur-sm rounded-full text-xs text-white font-bold">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-display font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                    {project.title}
                </h3>
                {project.release_date && (
                    <p className="text-xs text-slate-500 mt-1">
                        {new Date(project.release_date).getFullYear()}
                    </p>
                )}
            </div>
        </Link>
    );
}
