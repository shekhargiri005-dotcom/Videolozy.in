import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { error: null }; }
    static getDerivedStateFromError(error) { return { error }; }
    render() {
        if (this.state.error) {
            return (
                <div style={{
                    minHeight: '100vh', background: '#080a09', color: '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', padding: '2rem',
                }}>
                    <div style={{ maxWidth: 600, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                        <h1 style={{ fontSize: 20, marginBottom: 8, color: '#f87171' }}>Admin App Crashed</h1>
                        <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14 }}>
                            An error occurred during rendering. Check the browser console for details.
                        </p>
                        <pre style={{
                            background: '#0f172a', padding: '1rem', borderRadius: 8,
                            fontSize: 12, textAlign: 'left', color: '#fca5a5',
                            overflowX: 'auto', border: '1px solid #1e293b',
                        }}>
                            {this.state.error.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: 16, padding: '8px 20px', background: '#266d4f',
                                color: 'white', border: 'none', borderRadius: 8,
                                cursor: 'pointer', fontSize: 14,
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
