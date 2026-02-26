import React from 'react';
import ProductCard from './ProductCard';
import products from '../data/products';
import styles from './ProductList.module.css';

const ProductList = () => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h1 className={styles.title}>Featured Products</h1>
                <p className={styles.subtitle}>Discover our curated collection of premium tech</p>
            </div>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductList;
