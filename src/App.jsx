import './App.css';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useCartStore } from './stores/useCartStore';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Register from './pages/Register';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import NotFoundPage from './pages/NotFoundPage';
import Offers from './pages/Offers';
import Comparison from './pages/Comparison';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProfileLayout from './components/profile/ProfileLayout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Address from './pages/Address';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // We can fetch cart effectively after auth check or just call it. 
    // The store's fetchCart checks for isAuthenticated internally or we can rely on auth store causing re-render if we depended on it?
    // But safely, we can just let components trigger it or trigger it here if user is present.
    // Actually, useCartStore fetchCart logic checks isAuthenticated via getState().
    // So we can just call it once here, or listen to auth changes?
    // Better to listen to auth state changes to fetch cart.
    const unsub = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated) {
        fetchCart();
      } else {
        useCartStore.getState().clearCart();
      }
    });
    return () => unsub();
  }, [fetchCart]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/products' element={<Products />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/comparison' element={<Comparison />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route element={<ProfileLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addresses" element={<Address />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
