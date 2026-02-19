import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
});

// Attach stored token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('videolozy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Public ────────────────────────────────────────────────────────────────────
export const fetchProjects = (category) =>
    api.get('/projects', { params: category ? { category } : {} });

export const fetchProject = (id) => api.get(`/projects/${id}`);

export const fetchSiteSettings = () => api.get('/site-settings');

export const submitContact = (data) => api.post('/contact', data);

// ── Admin: Auth ───────────────────────────────────────────────────────────────
export const adminLogin = (credentials) => api.post('/admin/login', credentials);

// ── Admin: Dashboard ─────────────────────────────────────────────────────────
export const fetchDashboard = () => api.get('/admin/dashboard');

// ── Admin: Projects ───────────────────────────────────────────────────────────
export const fetchAdminProjects = () => api.get('/admin/projects');
export const fetchAdminProject = (id) => api.get(`/admin/projects/${id}`);
export const createProject = (data) => api.post('/admin/projects', data);
export const updateProject = (id, data) => api.put(`/admin/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`);

// ── Admin: Inquiries ─────────────────────────────────────────────────────────
export const fetchInquiries = () => api.get('/admin/inquiries');
export const updateInquiryStatus = (id, status) =>
    api.patch(`/admin/inquiries/${id}`, { status });
export const deleteInquiry = (id) => api.delete(`/admin/inquiries/${id}`);

// ── Admin: Settings ───────────────────────────────────────────────────────────
export const fetchAdminSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.put('/admin/settings', data);

// ── Admin: Upload ─────────────────────────────────────────────────────────────
export const uploadFile = (file, resourceType = 'image') => {
    const form = new FormData();
    form.append('file', file);
    form.append('resource_type', resourceType);
    return api.post('/admin/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export default api;
