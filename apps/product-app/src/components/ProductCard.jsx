import React, { useState } from 'react';
import { publish, EVENTS } from '@mfe/event-bus';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        publish(EVENTS.ADD_TO_CART, { product });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const renderStars = (rating) => '★'.repeat(rating);

    return (
        <article className={styles.card}>
            <div className={styles.imageWrap}>
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.image}
                    loading="lazy"
                />
                <span className={styles.category}>{product.category}</span>
            </div>
            <div className={styles.body}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.meta}>
                    <span className={styles.rating}>
                        <span className={styles.stars}>{renderStars(product.rating)}</span>
                        <span className={styles.ratingValue}>{product.rating}</span>
                    </span>
                </div>
                <div className={styles.footer}>
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                    <button
                        className={`${styles.addBtn} ${added ? styles.added : ''}`}
                        onClick={handleAddToCart}
                        id={`add-to-cart-${product.id}`}
                    >
                        {added ? '✓ Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
