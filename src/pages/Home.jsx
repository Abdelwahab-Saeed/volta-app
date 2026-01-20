import React, { useEffect, useState } from 'react';
import HomeCarousel from '../components/home/HomeCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import SpecialProducts from '../components/home/SpecialProducts';
import Products from '../components/home/Products';
import { getCategories } from '@/api/categories';
import { useProductStore } from '@/stores/useProductStore';
import { useBannerStore } from '@/stores/useBannerStore';

export default function Home() {
  // API data state
  const {
    products,
    bestSellingProducts,
    fetchProducts,
    fetchBestSellingProducts,
    loading: productsLoading
  } = useProductStore();

  const {
    banners,
    fetchBanners,
    loading: bannersLoading
  } = useBannerStore();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories, products, and banners on mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategoriesData();
    fetchProducts();
    fetchBestSellingProducts();
    fetchBanners();
    setLoading(false);
  }, [fetchProducts, fetchBestSellingProducts, fetchBanners]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <HomeCarousel banners={banners} loading={bannersLoading} />
      <SpecialProducts title="المنتجات المميزة" products={bestSellingProducts} />
      <Products products={products} />
      <CategoryCarousel categories={categories} />
      <FeaturesSection />
    </div>
  );
}
