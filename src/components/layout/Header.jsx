import { useState } from "react";
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
  PhoneCall
} from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  "كمبيوتر وموبايل",
  "إلكترونيات",
  "شاشات",
  "أجهزة منزلية",
  "كاميرات مراقبة",
  "أنظمة صوتية",
  "إنتركم",
  "أجهزة حضور وانصراف",
  "سمارت هوم",
  "تأمين الاسوار",
  "عروض",
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full font-sans border-b">
      {/* --- Top Bar (Hidden on Mobile) --- */}
      <div className="hidden md:flex justify-between items-center bg-[#1e2749] text-white px-4 lg:px-10 py-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 cursor-pointer">
            <img src={EGflag} alt="Egypt" className="w-4 h-3 object-cover" />
            <span>العربية</span>
            <ChevronDown size={14} />
          </div>
        </div>
        <a href="#" className="hover:underline">الدعم والمساعدة</a>
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
          <img src={logo} alt="Volta" className="w-full h-auto" />
        </div>

        {/* Search Bar (Hidden on small mobile, visible on tablet+) */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-[#33aadd] rounded-lg overflow-hidden h-10 lg:h-11">

          <Input
            type="text"
            placeholder="البحث..."
            className="border-0 focus-visible:ring-0 text-right h-full text-sm"
          />
          <div className="hidden lg:flex items-center gap-2 px-3 border-l border-gray-200 cursor-pointer text-gray-600">
            <span className="text-xs whitespace-nowrap">تسوق بالأقسام</span>
            <ChevronDown size={14} />
          </div>
          <button className="bg-[#33aadd] h-full px-4 flex items-center justify-center text-white">
            <Search size={20} />
          </button>

        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Welcome/Login (Hidden on Mobile) */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="p-2 rounded-full">
               <User size={20} className="text-gray-600" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">مرحباً، زائر</p>
              <button className="text-xs font-bold text-[#1e2749]">تسجيل الدخول إلى حسابك</button>
            </div>
            
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative cursor-pointer hidden sm:block">
              <ArrowLeftRight size={20} className="" />
              <Badge count={0} />
            </div>
            <div className="relative cursor-pointer">
              <Heart size={20} className="" />
              <Badge count={0} />
            </div>
            <div className="relative cursor-pointer">
              <ShoppingCart size={20} className="" />
              <Badge count={0} />
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Search (Visible only on Mobile) --- */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center border-2 border-[#33aadd] rounded-lg overflow-hidden h-10">
            <Input type="text" placeholder="البحث..." className="border-0 focus-visible:ring-0 text-right" />
            <button className="bg-[#33aadd] h-full px-4 text-white"><Search size={18}/></button>
        </div>
      </div>

      {/* --- Desktop Navigation (Hidden on Mobile) --- */}
      <nav className="hidden md:block bg-[#1e2749] text-white px-4 py-2 lg:px-10">
        <div className="flex items-center justify-between">
            <ul className="flex items-center gap-4 lg:gap-7 text-[12px] lg:text-[13px] font-medium py-3 overflow-x-auto no-scrollbar">
            {categories.map((cat, index) => (
                <li key={index} className="cursor-pointer hover:text-[#33aadd] whitespace-nowrap">
                {cat}
                </li>
            ))}
            </ul>
            <div className="hidden lg:block text-[13px] whitespace-nowrap border-r border-white/20 pr-4">
                <span className="text-gray-400 ml-2">الخط الساخن:</span>
                <span className="font-bold">16105</span>
            </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
            <div className="relative w-72 max-w-[80%] bg-white h-full shadow-xl flex flex-col p-6 animate-in slide-in-from-right">
                <button onClick={() => setIsMenuOpen(false)} className="self-end mb-6"><X /></button>
                
                <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                    <div className="bg-gray-100 p-3 rounded-full"><User /></div>
                    <div>
                        <p className="text-xs text-gray-500">مرحباً بك</p>
                        <p className="font-bold text-[#1e2749]">تسجيل الدخول</p>
                    </div>
                </div>

                <ul className="space-y-4 overflow-y-auto">
                    {categories.map((cat, index) => (
                        <li key={index} className="text-gray-700 font-medium hover:text-[#33aadd] cursor-pointer">
                            {cat}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-6 border-t flex items-center gap-2 text-[#33aadd]">
                    <PhoneCall size={18} />
                    <span className="text-sm font-bold">اتصل بنا: 16105</span>
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
    <span className="absolute -top-2 -right-2 bg-[#33aadd] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
      {count}
    </span>
  );
}