import './App.css';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useCartStore } from './stores/useCartStore';
import { useWishlistStore } from './stores/useWishlistStore';
import { useComparisonStore } from './stores/useComparisonStore';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Links from './components/layout/Links';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from "@/components/ui/sonner";

// Home stays a static import: it is the landing route, and lazy-loading it
// would cost an extra round trip before anything paints. Every other route is
// split out, so its code only downloads when someone navigates there.
import Home from './pages/Home';

const Register       = lazy(() => import('./pages/Register'));
const Login          = lazy(() => import('./pages/Login'));
const Products       = lazy(() => import('./pages/Products'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));
const SearchResults  = lazy(() => import('./pages/SearchResults'));
const Offers         = lazy(() => import('./pages/Offers'));
const OfferDetails   = lazy(() => import('./pages/OfferDetails'));
const Comparison     = lazy(() => import('./pages/Comparison'));
const Cart           = lazy(() => import('./pages/Cart'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const ProfileLayout  = lazy(() => import('./components/profile/ProfileLayout'));
const Profile        = lazy(() => import('./pages/Profile'));
const Orders         = lazy(() => import('./pages/Orders'));
const Address        = lazy(() => import('./pages/Address'));
const Wishlist       = lazy(() => import('./pages/Wishlist'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));
const AboutUs        = lazy(() => import('./pages/AboutUs'));
const Vision         = lazy(() => import('./pages/Vision'));
const ReturnPolicy   = lazy(() => import('./pages/ReturnPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const Posts          = lazy(() => import('./pages/Posts'));
const PostDetails    = lazy(() => import('./pages/PostDetails'));
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'));
import ScrollToTop from './components/layout/ScrollToTop';
import { trackPageView } from './lib/pixel';
import { useLocation } from 'react-router-dom';

function PixelTracker() {
  const location = useLocation();

  // Fires on mount too, so the initial page view is covered here and nowhere
  // else. See src/lib/pixel.js for why the pixel no longer loads at boot.
  useEffect(() => {
    trackPageView();
  }, [location]);

  return null;
}

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
      <PixelTracker />
      <ScrollToTop />
      <Header />
      <Links />
      {/* <main> is the document's main landmark. Without it, assistive tech has
          no way to skip the header and jump straight to page content. */}
      <main id="main">
      {/* min-h-[60vh] keeps the footer from jumping up while a route chunk is
          still downloading. */}
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
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
        <Route path='/offers' element={<Offers />} />
        <Route path='/offers/:id' element={<OfferDetails />} />
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
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/blog" element={<Posts />} />
        <Route path="/blog/:id" element={<PostDetails />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
