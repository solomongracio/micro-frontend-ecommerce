import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { subscribe, getCartCount } from '@mfe/event-bus';
import styles from './Header.module.css';

const Header = () => {
    const [cartCount, setCartCount] = useState(getCartCount());
    const [isAnimating, setIsAnimating] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = subscribe('mfe:cart-updated', (detail) => {
            setCartCount(detail.count);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        });
        return unsubscribe;
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>MFE Store</span>
                </Link>

                <nav className={styles.nav}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
                    >
                        Products
                    </Link>
                    <Link
                        to="/cart"
                        className={`${styles.navLink} ${location.pathname === '/cart' ? styles.active : ''}`}
                    >
                        <span className={styles.cartLink}>
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className={`${styles.badge} ${isAnimating ? styles.badgePop : ''}`}>
                                    {cartCount}
                                </span>
                            )}
                        </span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
