import { BadgeCheck, BadgePercent, DollarSign, Headset } from 'lucide-react';
import React from 'react';

export default function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full my-8" dir="rtl">
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <BadgeCheck color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">عروض وخصومات</h3>
          <p className="text-sm text-muted-foreground">عروض على بعض المنتجات</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <DollarSign color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">الاسترجاع والاسترداد</h3>
          <p className="text-sm text-muted-foreground">ضمان استرداد الأموال</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <BadgePercent color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">خصم للأعضاء المسجلين</h3>
          <p className="text-sm text-muted-foreground">خصم على كل طلب</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <Headset color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">24/7</h3>
          <p className="text-sm text-muted-foreground">تواصل معنا في أي وقت</p>
        </div>
      </div>
    </div>
  );
}
