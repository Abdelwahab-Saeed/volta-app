import { BadgeCheck, BadgePercent, DollarSign, Headset } from 'lucide-react';
import React from 'react';

export default function FeaturesSection() {
  return (
    <div className="flex gap-2 w-full my-4">
      <div className="flex items-center gap-5 w-1/4 bg-[#F6F7F9] px-10 py-6">
        <BadgeCheck color="#31A0D3" size={30} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">عروض وخصومات</h3>
          <p className="text-sm text-muted-foreground">عروض على بعض المنتجات</p>
        </div>
      </div>
      <div className="flex items-center gap-5 w-1/4 bg-[#F6F7F9] px-10 py-6">
        <DollarSign color="#31A0D3" size={30} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">الاسترجاع والاسترداد</h3>
          <p className="text-sm text-muted-foreground">ضمان استرداد الأموال</p>
        </div>
      </div>
      <div className="flex items-center gap-5 w-1/4 bg-[#F6F7F9] px-10 py-6">
        <BadgePercent color="#31A0D3" size={30} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">خصم للأعضاء المسجلين</h3>
          <p className="text-sm text-muted-foreground">خصم على كل طلب</p>
        </div>
      </div>
      <div className="flex items-center gap-5 w-1/4 bg-[#F6F7F9] px-10 py-6">
        <Headset color="#31A0D3" size={30} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">24/7</h3>
          <p className="text-sm text-muted-foreground">تواصل معنا في أي وقت</p>
        </div>
      </div>
    </div>
  );
}
