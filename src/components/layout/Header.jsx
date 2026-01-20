import { useState, useEffect } from "react";
import EGflag from "../../assets/Eg-flag.png";
import logo from "../../assets/site-logo.png";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  ChevronDown,
  ArrowLeftRight,
  Menu,
  X,
  PhoneCall,
  ArrowUpDown,
  Handbag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { getCategories } from "@/api/categories";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import i18n from '@/i18n';

export default function Header() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.cartItems?.length || 0);
  const wishlistCount = useWishlistStore((state) => state.wishlistItems?.length || 0);
  const comparisonCount = useComparisonStore((state) => state.comparisonItems?.length || 0);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsMenuOpen(false); // Close mobile menu if open
      setSearchQuery(""); // Optional: clear search after navigation
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success(t('header.logout_success'));
      setIsUserDropdownOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      toast.error(t('header.logout_error'));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="w-full font-sans border-b">
      {/* --- Top Bar (Hidden on Mobile) --- */}
      <div className="hidden md:flex justify-between items-center bg-[#1e2749] text-white px-4 lg:px-10 py-4 text-xs">
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
        <a href="#" className="hover:underline">{t('header.contact')}</a>
      </div>

      {/* --- Main Header --- */}
      <div className="flex items-center justify-between h-[117px] px-4 lg:px-10 py-4 bg-white gap-4 md:gap-8">

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Logo */}
        <div className="w-55">
          <Link to='/'>
            <img src={logo} alt="Volta" className="w-full h-auto" />
          </Link>
        </div>

        {/* Search Bar (Hidden on small mobile, visible on tablet+) */}
        <div className="hidden md:flex flex-1 ml-30 items-center border-2 border-secondary rounded-lg overflow-hidden h-10 lg:h-13">

          <Input
            type="text"
            placeholder={t('header.search_placeholder')}
            className="border-0 focus-visible:ring-0 text-right h-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {/* <div className="hidden lg:flex items-center gap-2 px-3 border-l border-gray-200 cursor-pointer text-primary">
            <span className="text-xs whitespace-nowrap">تسوق بالأقسام</span>
            <ChevronDown size={14} />
          </div> */}
          <button
            onClick={handleSearch}
            className="bg-secondary h-full px-4 flex items-center justify-center text-white"
          >
            <Search size={20} />
          </button>

        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Welcome/Login (Hidden on Mobile) */}
          <div className="hidden md:block  flex items-center gap-3">
            <div className="p-2 rounded-full">
              <User size={20} className="text-gray-600" />
            </div>
            {user ? (
              <div className="relative ">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="text-start flex items-center gap-2"
                >
                  <div>
                    <p className="text-sm text-primary">{t('header.welcome')}, {user.name}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full start-0 mt-2 bg-white border rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                    <Link
                      to='/profile'
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-primary hover:bg-gray-100 transition-colors"
                    >
                      {t('header.visit_profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-start block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-start">
                <p className="text-sm text-primary">{t('header.welcome_guest')}</p>
                <Link to='/login' className="text-sm text-secondary hover:underline">{t('header.login_prompt')}</Link>
              </div>
            )}

          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative cursor-pointer block">
              <Link to='/comparison'> <ArrowUpDown size={24} className="" /> </Link>
              <Badge count={comparisonCount} />
            </div>
            <div className="relative cursor-pointer">
              <Link to='/wishlist'> <Heart size={24} /> </Link>
              <Badge count={wishlistCount} />
            </div>
            <div className="relative cursor-pointer">
              <Link to='/cart'> <Handbag size={24} /> </Link>
              <Badge count={cartCount} />
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Search (Visible only on Mobile) --- */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center border-2 border-secondary rounded-lg overflow-hidden h-10">
          <Input
            type="text"
            placeholder={t('header.search_placeholder')}
            className="border-0 focus-visible:ring-0 text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-secondary h-full px-4 text-white"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* --- Desktop Navigation (Hidden on Mobile) --- */}
      <nav className="hidden md:block bg-[#1e2749] text-white px-4 py-2 lg:px-10">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-4 lg:gap-7 text-[12px] lg:text-[13px] font-medium py-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="cursor-pointer hover:text-secondary whitespace-nowrap">
                {cat.name} {cat.name_ar && i18n.language === 'ar' ? `(${cat.name})` : ''}
                {/* Note: Ideally categories should come translated from API */}
              </Link>
            ))}
          </ul>
          <div className="hidden lg:block text-[13px] whitespace-nowrap pe-4">
            <span className="text-white ms-2">{t('header.hotline')}:</span><br />
            <span className="font-bold">16105</span>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-72 max-w-[80%] bg-white h-full shadow-xl flex flex-col p-6 animate-in slide-in-from-inline-end">
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-6"><X /></button>

            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <div className="bg-gray-100 p-3 rounded-full"><User /></div>
              {user ? (
                <div>
                  <p className="text-xs text-gray-500">{t('header.welcome')}</p>
                  <p className="font-bold text-[#1e2749]">{user.name}</p>
                  <Link
                    to='/profile'
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs text-secondary mt-1 block"
                  >
                    {t('header.visit_profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 mt-2 block"
                  >
                    {t('header.logout')}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500">{t('header.welcome')}</p>
                  <Link
                    to='/login'
                    onClick={() => setIsMenuOpen(false)}
                    className="font-bold text-[#1e2749]"
                  >
                    {t('header.login')}
                  </Link>
                </div>
              )}
            </div>

            <ul className="space-y-4 overflow-y-auto">
              {categories.map((cat) => (
                <li key={cat.id} className="text-gray-700 font-medium hover:text-secondary cursor-pointer">
                  <Link to={`/products?category=${cat.id}`} onClick={() => setIsMenuOpen(false)}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t flex flex-col gap-4">
              <div className="flex justify-between items-center text-secondary">
                <div className="flex items-center gap-2">
                  <PhoneCall size={18} />
                  <span className="text-sm font-bold">16105</span>
                </div>
              </div>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Small helper component for the red/blue badges
function Badge({ count }) {
  return (
    <span className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
      {count}
    </span>
  );
}