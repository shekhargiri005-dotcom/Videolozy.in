import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import PortfolioPage from './pages/public/PortfolioPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsListPage from './pages/admin/ProjectsListPage';
import ProjectFormPage from './pages/admin/ProjectFormPage';
import InquiriesPage from './pages/admin/InquiriesPage';
import SettingsPage from './pages/admin/SettingsPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/projects"
              element={<ProtectedRoute><ProjectsListPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/projects/new"
              element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/projects/:id/edit"
              element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/inquiries"
              element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/settings"
              element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
            />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
