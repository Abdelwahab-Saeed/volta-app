import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomeCarousel from '../components/home/HomeCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import SpecialProducts from '../components/home/SpecialProducts';
import Products from '../components/home/Products';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useProductStore } from '@/stores/useProductStore';
import { useBannerStore } from '@/stores/useBannerStore';

export default function Home() {
  const { t } = useTranslation();
  // API data state
  const {
    fetchProducts,
    fetchBestSellingProducts,
  } = useProductStore();

  const {
    banners,
    fetchBanners,
    loading: bannersLoading
  } = useBannerStore();

  const categories = useCategoryStore((state) => state.categories);
  const categoriesLoading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  useEffect(() => {
    // All three fire together. fetchBanners used to run only after categories
    // and their products had resolved, which pushed the LCP banner image two
    // round trips later than it needed to be.
    fetchBanners();
    fetchCategories();
    fetchBestSellingProducts();

    // The per-category product fetch that used to live here has been removed:
    // it made one request per category and the block that rendered it (below)
    // is commented out, so the results were discarded. Restore both together.
  }, [fetchBanners, fetchCategories, fetchBestSellingProducts]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <HomeCarousel banners={banners} loading={bannersLoading} />

      {/* Show products for first two categories */}
      {/* {!loading && categoriesWithProducts.map((catGroup) => (
        catGroup.products.length > 0 && (
          <Products
            key={catGroup.id}
            title={catGroup.name}
            products={catGroup.products}
          />
        )
      ))} */}

      <CategoryCarousel categories={categories} loading={categoriesLoading} />
      <FeaturesSection />
    </div>
  );
}
