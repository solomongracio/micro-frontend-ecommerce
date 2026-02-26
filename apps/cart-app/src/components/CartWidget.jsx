import React, { useState, useEffect } from 'react';
import { subscribe, publish, getCartState, EVENTS } from '@mfe/event-bus';
import styles from './CartWidget.module.css';

const CartWidget = () => {
    const [cart, setCart] = useState(getCartState());
    const [checkoutState, setCheckoutState] = useState('idle'); // idle | processing | success

    useEffect(() => {
        const unsubscribe = subscribe(EVENTS.CART_UPDATED, (detail) => {
            setCart([...detail.cart]);
        });
        return unsubscribe;
    }, []);

    const handleRemove = (productId) => {
        publish(EVENTS.REMOVE_FROM_CART, { productId });
    };

    const handleCheckout = () => {
        setCheckoutState('processing');
        // Simulate payment processing
        setTimeout(() => {
            setCheckoutState('success');
        }, 2000);
    };

    const handleContinueShopping = () => {
        // Clear the cart
        cart.forEach((item) => {
            publish(EVENTS.REMOVE_FROM_CART, { productId: item.id });
        });
        setCheckoutState('idle');
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (checkoutState === 'success') {
        return (
            <div className={styles.successOverlay}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <span className={styles.checkmark}>✓</span>
                    </div>
                    <h2 className={styles.successTitle}>Order Confirmed!</h2>
                    <p className={styles.successText}>
                        Your order of <strong>${total.toFixed(2)}</strong> has been placed successfully.
                    </p>
                    <div className={styles.successDetails}>
                        <div className={styles.successRow}>
                            <span>Order ID</span>
                            <span className={styles.orderId}>
                                #MFE-{Date.now().toString(36).toUpperCase()}
                            </span>
                        </div>
                        <div className={styles.successRow}>
                            <span>Items</span>
                            <span>{cart.length} product{cart.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className={styles.successRow}>
                            <span>Estimated Delivery</span>
                            <span>3–5 Business Days</span>
                        </div>
                    </div>
                    <p className={styles.successNote}>
                        📧 A confirmation email has been sent to your inbox.
                    </p>
                    <button
                        className={styles.continueBtn}
                        onClick={handleContinueShopping}
                    >
                        Continue Shopping
                    </button>
                </div>
                <div className={styles.confetti} aria-hidden="true">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className={styles.confettiPiece} style={{
                            '--i': i,
                            '--x': `${Math.random() * 100}%`,
                            '--delay': `${Math.random() * 0.5}s`,
                            '--color': ['#7c3aed', '#c4b5fd', '#34d399', '#fbbf24', '#f472b6'][i % 5],
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className={styles.empty}>
                <span className={styles.emptyIcon}>🛒</span>
                <h2 className={styles.emptyTitle}>Your cart is empty</h2>
                <p className={styles.emptyText}>Browse products and add items to get started</p>
            </div>
        );
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Shopping Cart</h2>
            <p className={styles.subtitle}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

            <div className={styles.layout}>
                <div className={styles.items}>
                    {cart.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <img
                                src={item.image}
                                alt={item.name}
                                className={styles.itemImage}
                            />
                            <div className={styles.itemDetails}>
                                <h4 className={styles.itemName}>{item.name}</h4>
                                <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                                <span className={styles.itemQty}>Qty: {item.quantity}</span>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemove(item.id)}
                                id={`remove-item-${item.id}`}
                                title="Remove item"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <h3 className={styles.summaryTitle}>Order Summary</h3>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span className={styles.free}>Free</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        className={`${styles.checkoutBtn} ${checkoutState === 'processing' ? styles.processing : ''}`}
                        onClick={handleCheckout}
                        disabled={checkoutState === 'processing'}
                    >
                        {checkoutState === 'processing' ? (
                            <>
                                <span className={styles.spinner} />
                                Processing...
                            </>
                        ) : (
                            'Proceed to Checkout'
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CartWidget;
