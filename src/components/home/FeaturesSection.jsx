import { BadgeCheck, BadgePercent, DollarSign, Headset } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full my-10">
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <BadgeCheck color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{t('home.features.offers_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('home.features.offers_desc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <DollarSign color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{t('home.features.returns_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('home.features.returns_desc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <BadgePercent color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{t('home.features.members_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('home.features.members_desc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 bg-[#F6F7F9] px-6 py-6 rounded-lg">
        <Headset color="#31A0D3" size={30} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{t('home.features.support_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('home.features.support_desc')}</p>
        </div>
      </div>
    </div>
  );
}
