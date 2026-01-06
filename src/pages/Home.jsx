import React, { useEffect, useState } from 'react';
import HomeCarousel from '../components/home/HomeCarousel';
import banner1 from '../assets/home/banner1.jpg';
import banner2 from '../assets/home/banner2.jpg';
import banner3 from '../assets/home/banner3.avif';
import camera from '../assets/home/camera.jpg';
import headphone from '../assets/home/headphone.jpg';
import phone from '../assets/home/phone.avif';
import securityCamera from '../assets/home/security-camera.jpg';
import tv from '../assets/home/tv.webp';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import SpecialProducts from '../components/home/SpecialProducts';
import Products from '../components/home/Products';
import stabilizer from '../assets/home/stabilizer.png';
import { getCategories } from '@/api/categories';
import { useProductStore } from '@/stores/useProductStore';

const banners = [banner3, banner2, banner1];

export default function Home() {
  // API data state
  const {
    products,
    bestSellingProducts,
    fetchProducts,
    fetchBestSellingProducts,
    loading: productsLoading
  } = useProductStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products on mount
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
    setLoading(false);
  }, [fetchProducts, fetchBestSellingProducts]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <HomeCarousel banners={banners} />
      <CategoryCarousel categories={categories} />
      <FeaturesSection />
      <SpecialProducts title="المنتجات المميزة" products={bestSellingProducts} />
      <Products products={products} />
    </div>
  );
}
