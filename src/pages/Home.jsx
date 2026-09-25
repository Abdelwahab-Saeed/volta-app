import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomeCarousel from '../components/home/HomeCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import HomeOffersSection from '../components/home/HomeOffersSection';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBannerStore } from '@/stores/useBannerStore';
import useSeo from '@/hooks/useSeo';
import api from '@/api/axios';

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

    // Removed, because nothing on this page renders their results:
    //   fetchBestSellingProducts()  - only SpecialProducts uses it, and that
    //                                 component is not rendered here
    //   the per-category product fetch - one request per category, feeding the
    //                                 commented-out <Products> block below
    // Restore each alongside the component that displays it.
  }, [fetchBanners, fetchCategories]);

  useEffect(() => {
    // Send Home PageView to the backend for Meta integration
    api.post('/track/pageview', { url: window.location.href }).catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <HomeCarousel banners={banners} loading={bannersLoading} />
      <HomeOffersSection />
      <CategoryCarousel categories={categories} loading={categoriesLoading} />
      <FeaturesSection />
    </div>
  );
}
