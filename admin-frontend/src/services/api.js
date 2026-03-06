import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 1200000, // 20 minutes for large video uploads
});

// Attach stored JWT token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('videolozy_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const adminLogin = (credentials) => api.post('/admin/login', credentials);

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const fetchDashboard = () => api.get('/admin/dashboard');
export const fetchStorageStats = () => api.get('/admin/stats/storage');

// ── Projects ─────────────────────────────────────────────────────────────────
export const fetchAdminProjects = () => api.get('/admin/projects');
export const fetchAdminProject = (id) => api.get(`/admin/projects/${id}`);
export const createProject = (data) => api.post('/admin/projects', data);
export const updateProject = (id, data) => api.put(`/admin/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`);

// ── Inquiries ─────────────────────────────────────────────────────────────────
export const fetchInquiries = () => api.get('/admin/inquiries');
export const updateInquiryStatus = (id, status) => api.patch(`/admin/inquiries/${id}`, { status });
export const deleteInquiry = (id) => api.delete(`/admin/inquiries/${id}`);

// ── Settings ──────────────────────────────────────────────────────────────────
export const fetchAdminSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.put('/admin/settings', data);

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadFile = (file, resourceType = 'image', folder = '', onProgress = null) => {
    const form = new FormData();
    form.append('file', file);
    form.append('resource_type', resourceType);
    if (folder) form.append('folder', folder);

    const config = {};
    if (onProgress) {
        config.onUploadProgress = (evt) => {
            const pct = Math.round((evt.loaded * 100) / evt.total);
            onProgress(pct);
        };
    }
    return api.post('/admin/upload', form, config);
};

export default api;
