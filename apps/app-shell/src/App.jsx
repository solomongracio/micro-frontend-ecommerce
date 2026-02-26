import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RemoteWrapper from './components/RemoteWrapper';

const ProductList = lazy(() => import('product_app/ProductList'));
const CartWidget = lazy(() => import('cart_app/CartWidget'));

const HomePage = () => (
    <RemoteWrapper remoteName="Product App">
        <ProductList />
    </RemoteWrapper>
);

const CartPage = () => (
    <RemoteWrapper remoteName="Cart App">
        <CartWidget />
    </RemoteWrapper>
);

const App = () => {
    return (
        <BrowserRouter>
            <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
                <Header />
                <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
