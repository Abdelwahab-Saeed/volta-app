import './App.css';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useCartStore } from './stores/useCartStore';
import { useWishlistStore } from './stores/useWishlistStore';
import { useComparisonStore } from './stores/useComparisonStore';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Register from './pages/Register';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import NotFoundPage from './pages/NotFoundPage';
import SearchResults from './pages/SearchResults';
import Offers from './pages/Offers';
import Comparison from './pages/Comparison';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProfileLayout from './components/profile/ProfileLayout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Address from './pages/Address';
import Wishlist from './pages/Wishlist';
import Links from './components/layout/Links';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutUs from './pages/AboutUs';
import Vision from './pages/Vision';
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const fetchComparison = useComparisonStore((state) => state.fetchComparison);

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
        fetchWishlist();
        fetchComparison();
      } else {
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
        useComparisonStore.getState().clearComparison();
      }
    });
    return () => unsub();
  }, [fetchCart]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <Links />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        {/* Protected Routes */}
        <Route path='/products' element={<Products />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/offers' element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path='/comparison' element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        <Route element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addresses" element={<Address />} />
        </Route>

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/vision" element={<Vision />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
