import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import WhiteLogo from '../../assets/Logo-04 2.png';
import { Facebook, Mail, MapPin } from 'lucide-react';
import { getCategories } from '@/api/categories';

export default function Footer() {
  const [categories, setCategories] = useState([]);

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
    <footer className="text-white">
      {/* Newsletter Section */}
      <div className="bg-secondary py-8">
        <div className="container px-4">
          {/* Input & Button Group */}
          <div className="flex flex-col sm:flex-row justify-center max-w-2xl mx-auto overflow-hidden rounded-lg sm:h-12 gap-0">
            <button className="bg-primary hover:bg-primary/90 py-3 px-6 font-semibold whitespace-nowrap h-12 sm:h-full order-2 sm:order-1">
              اشترك الآن
            </button>
            <Input
              type="email"
              placeholder="ادخل بريدك الإلكتروني"
              className="bg-white text-black text-base! flex-1 h-12 sm:h-full rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-base order-1 sm:order-2 text-right"
            />
          </div>
          <h3 className="text-xl md:text-2xl text-center mt-4">
            اشترك في نشرتنا البريدية
          </h3>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-right" dir="rtl">
            {/* Logo and Description */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <img src={WhiteLogo} alt="Volra White Logo" className="mb-4 w-48 md:w-56" />
              <p className="max-w-xs text-sm md:text-base opacity-90 leading-relaxed">
                فولتا هي منصة يمكنك من خلالها شراء المنتجات بسهولة وسرعة مع ضمان سرعة التوصيل وخدمات متميزة
              </p>
              <div className="flex flex-row mt-6">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <Facebook
                    className="border rounded cursor-pointer hover:bg-white/10 transition-colors"
                    fill="white"
                    size="34"
                    strokeWidth="0.5"
                  />
                </a>
              </div>
            </div>

            {/* Account Links */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <h4 className="text-lg md:text-xl font-semibold mb-6">حسابي</h4>
              <ul className="space-y-3 opacity-80">
                <li>
                  <Link to="/orders" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    تتبع طلبك
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    إنشاء حساب
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    طلباتي
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    قائمة الأمنيات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information Links */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <h4 className="text-lg md:text-xl font-semibold mb-6">حول فولتا</h4>
              <ul className="space-y-3 opacity-80">
                {categories.slice(0, 3).map((category, index) => (
                  <li key={category.id || index}>
                    <Link
                      to={`/products?category=${category.id}`}
                      className="hover:underline hover:text-secondary transition-colors text-sm md:text-base"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/contact" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:underline hover:text-secondary transition-colors text-sm md:text-base">
                    سياسية الإسترجاع والإستبدال
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <h4 className="text-lg md:text-xl font-semibold mb-6">اتصل بنا</h4>
              <ul className="space-y-4 text-sm md:text-base opacity-90">
                <li>هل لديك أسئلة؟ اتصل بنا</li>
                <li className="!mt-2">
                  <a
                    href="tel:+201212240202"
                    className="hover:text-secondary transition-colors text-xl font-bold block"
                  >
                    01212240202
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@volta-eg.com"
                    className="hover:text-secondary transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    <Mail size="20" />
                    info@volta-eg.com
                  </a>
                </li>
                <li className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin size="20" className="flex-shrink-0" />
                  <span>بني سويف - مصر</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
