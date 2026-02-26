import React, { useState, useEffect } from 'react';
import { subscribe, publish, getCartState, EVENTS } from '@mfe/event-bus';
import styles from './CartWidget.module.css';

const CartWidget = () => {
    const [cart, setCart] = useState(getCartState());

    useEffect(() => {
        const unsubscribe = subscribe(EVENTS.CART_UPDATED, (detail) => {
            setCart([...detail.cart]);
        });
        return unsubscribe;
    }, []);

    const handleRemove = (productId) => {
        publish(EVENTS.REMOVE_FROM_CART, { productId });
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                    <button className={styles.checkoutBtn}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CartWidget;
