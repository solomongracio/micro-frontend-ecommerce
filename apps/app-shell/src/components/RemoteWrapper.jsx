import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Loader = () => (
    <div style={loaderStyles.container}>
        <div style={loaderStyles.card}>
            <div style={loaderStyles.shimmer} />
            <div style={{ ...loaderStyles.shimmer, width: '60%', height: '16px' }} />
            <div style={{ ...loaderStyles.shimmer, width: '40%', height: '16px' }} />
        </div>
    </div>
);

const loaderStyles = {
    container: {
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        maxWidth: '600px',
        padding: '32px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    shimmer: {
        height: '20px',
        borderRadius: '8px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    },
};

// Inject shimmer keyframes globally once
if (typeof document !== 'undefined' && !document.getElementById('mfe-shimmer-style')) {
    const style = document.createElement('style');
    style.id = 'mfe-shimmer-style';
    style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
    document.head.appendChild(style);
}

const RemoteWrapper = ({ children, remoteName }) => (
    <ErrorBoundary remoteName={remoteName}>
        <Suspense fallback={<Loader />}>
            {children}
        </Suspense>
    </ErrorBoundary>
);

export default RemoteWrapper;
