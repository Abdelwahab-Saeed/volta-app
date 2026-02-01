import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomeCarousel from '../components/home/HomeCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import SpecialProducts from '../components/home/SpecialProducts';
import Products from '../components/home/Products';
import { getCategories } from '@/api/categories';
import { getProducts } from '@/api/products.api';
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

  const [categories, setCategories] = useState([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories, products, and banners on mount
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Categories
        const response = await getCategories();
        const cats = response.data.data || response.data;
        setCategories(cats);

        // 2. Fetch products for first two categories
        const firstTwo = cats.slice(0, 2);
        const productsFetched = await Promise.all(
          firstTwo.map(async (cat) => {
            try {
              const prodRes = await getProducts({ category: cat.id, limit: 4 });
              const items = prodRes.data.data?.items || (Array.isArray(prodRes.data.data) ? prodRes.data.data : []);
              return { ...cat, products: items };
            } catch (err) {
              console.error(`Error fetching products for category ${cat.id}:`, err);
              return { ...cat, products: [] };
            }
          })
        );
        setCategoriesWithProducts(productsFetched);

        // 3. Keep other global fetches if needed for other parts (like SpecialProducts)
        fetchBestSellingProducts();
        fetchBanners();
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [fetchBestSellingProducts, fetchBanners]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <HomeCarousel banners={banners} loading={bannersLoading} />

      {/* Show products for first two categories */}
      {!loading && categoriesWithProducts.map((catGroup) => (
        catGroup.products.length > 0 && (
          <Products
            key={catGroup.id}
            title={catGroup.name}
            products={catGroup.products}
          />
        )
      ))}

      <CategoryCarousel categories={categories} />
      <FeaturesSection />
    </div>
  );
}
