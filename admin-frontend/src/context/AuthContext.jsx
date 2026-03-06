import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'videolozy_admin_token';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    await api.get('/admin/verify_token');
                    setUser({ token });
                } catch {
                    localStorage.removeItem(TOKEN_KEY);
                    delete api.defaults.headers.common['Authorization'];
                    setToken(null);
                    setUser(null);
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };
        verify();
    }, [token]);

    const login = async (username, password) => {
        const res = await api.post('/admin/login', { username, password });
        const { access_token } = res.data;
        localStorage.setItem(TOKEN_KEY, access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setToken(access_token);
        setUser({ token: access_token });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
