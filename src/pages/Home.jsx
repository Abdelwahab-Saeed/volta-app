import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomeCarousel from '../components/home/HomeCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import HomeOffersSection from '../components/home/HomeOffersSection';
import AboutSection from '../components/home/AboutSection';
import CertificatesSection from '../components/home/CertificatesSection';
import PartnersSection from '../components/home/PartnersSection';
import TeamSection from '../components/home/TeamSection';
import ContactCta from '../components/home/ContactCta';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBannerStore } from '@/stores/useBannerStore';
import useSeo from '@/hooks/useSeo';
import api from '@/api/axios';

// Every section sits in this container; full-width tinted bands wrap it from outside. Bands carry no
// padding of their own, so a section with no content (e.g. no partners yet) leaves no empty stripe.
const CONTAINER = 'container mx-auto px-4 md:px-6 lg:px-8';

export default function Home() {
  const { t } = useTranslation();
  useSeo({
    title: t('seo.home_title'),
    description: t('seo.home_description'),
  });

  const {
    banners,
    fetchBanners,
    loading: bannersLoading
  } = useBannerStore();

  const categories = useCategoryStore((state) => state.categories);
  const categoriesLoading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  useEffect(() => {
    // Both fire together. fetchBanners used to run only after categories and
    // their products had resolved, which pushed the LCP banner image two round
    // trips later than it needed to be.
    fetchBanners();
    fetchCategories();
  }, [fetchBanners, fetchCategories]);

  useEffect(() => {
    // Send Home PageView to the backend for Meta integration
    api.post('/track/pageview', { url: window.location.href }).catch(() => {});
  }, []);

  const hasBanner = bannersLoading || banners?.length > 0;

  return (
    <div className="overflow-x-clip">
      <div className={CONTAINER}>
        <HomeCarousel banners={banners} loading={bannersLoading} />
        <FeaturesSection overlap={hasBanner} />
        <CategoryCarousel categories={categories} loading={categoriesLoading} />
        <HomeOffersSection />
      </div>

      <div className="bg-light-background/60">
        <div className={CONTAINER}>
          <AboutSection />
        </div>
      </div>

      <div className={CONTAINER}>
        <CertificatesSection />
      </div>

      <div className="bg-light-background/60">
        <div className={CONTAINER}>
          <PartnersSection />
        </div>
      </div>

      <div className={CONTAINER}>
        <TeamSection />
        <ContactCta />
      </div>
    </div>
  );
}
