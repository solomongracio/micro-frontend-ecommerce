import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error(`[MFE Error Boundary] ${this.props.remoteName || 'Remote'}:`, error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={errorStyles.container}>
                    <div style={errorStyles.card}>
                        <span style={errorStyles.icon}>⚠️</span>
                        <h3 style={errorStyles.title}>
                            {this.props.remoteName || 'Module'} Unavailable
                        </h3>
                        <p style={errorStyles.message}>
                            This micro frontend could not be loaded. It may be offline or experiencing issues.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={errorStyles.button}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const errorStyles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
    },
    card: {
        textAlign: 'center',
        padding: '48px 40px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        maxWidth: '420px',
    },
    icon: {
        fontSize: '48px',
        display: 'block',
        marginBottom: '16px',
    },
    title: {
        color: '#e4e4e7',
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
    },
    message: {
        color: '#71717a',
        fontSize: '14px',
        lineHeight: 1.6,
        marginBottom: '24px',
    },
    button: {
        padding: '10px 24px',
        borderRadius: '10px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#c4b5fd',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default ErrorBoundary;
