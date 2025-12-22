import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import WhiteLogo from '../../assets/Logo-04 2.png';
import { Facebook, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className=" text-white">
      {/* Newsletter Section */}
      <div className="bg-secondary py-8">
        <div className="container px-4">
          {/* Input & Button Group */}
          <div className="flex justify-center max-w-2xl mx-auto overflow-hidden rounded-lg h-12">
            <button className="bg-primary hover:bg-primary/90 py-3 px-6 font-semibold whitespace-nowrap">
              اشترك الآن
            </button>
            <Input
              type="email"
              placeholder="ادخل بريدك الإلكتروني"
              className="bg-white text-black text-base! flex-1 h-full rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-base"
            />
          </div>
          <h3 className="text-2xl text-center mt-4">
            اشترك في نشرتنا البريدية
          </h3>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-primary py-12">
        <div className="container flex justify-around px-20">
          <div>
            <img src={WhiteLogo} alt="Volra White Logo" className="mb-4 w-56" />
            <p className="max-w-xs">
              زيروتك هي منصة رائدة في تقديم حلول تكنولوجيا المعلومات والخدمات
              الرقمية التي تلبي احتياجات الأفراد والشركات على حد سواء.
            </p>
            <div className="flex flex-row mt-4">
              <Facebook
                className="border rounded"
                fill="white"
                size="34"
                stroke="0.5"
              />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">حسابي</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  تتبع طلبك
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  إنشاء حساب
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  طلباتي
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  قائمة الأمنيات
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">حول زيروتك</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  كاميرات لاسلكية
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  شاشات
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  انتركم
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  تواصل معنا
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="hover:underline">
                  سياسية الإسترجاع والإستبدال
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">اتصل بنا</h4>
            <ul>
              <li>هل لديك أسئلة؟ اتصل بنا</li>
              <li className="mb-2">
                <a
                  href="tel:+201212240202"
                  className="hover:underline text-xl font-bold"
                >
                  01212240202
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="mailto:info@zerotechegypt.com"
                  className="hover:underline flex items-center gap-2"
                >
                  <Mail size="20" />
                  info@zerotechegypt.com
                </a>
              </li>
              <li className="mb-2 flex items-center gap-2">
                <MapPin size="20" />ش الخليفة الواثق من ش عباس
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
