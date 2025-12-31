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
import { getProducts } from '@/api/products.api';

const banners = [banner3, banner2, banner1];

const categories = [
  {
    name: 'كاميرات',
    image: camera,
  },
  {
    name: 'سماعات',
    image: headphone,
  },
  {
    name: 'هواتف',
    image: phone,
  },
  {
    name: 'كاميرات المراقبة',
    image: securityCamera,
  },
  {
    name: 'شاشات',
    image: tv,
  },
];

const products = [
  {
    name: 'منتج 1',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 2',
    image: stabilizer,
    price: 1000,
    discount: 15,
  },
  {
    name: 'منتج 3',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 4',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 5',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 6',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 7',
    image: stabilizer,
    price: 1000,
  },
  {
    name: 'منتج 8',
    image: stabilizer,
    price: 1000,
    discount: 10,
  },
  {
    name: 'منتج 9',
    image: stabilizer,
    price: 1000,
  },
];

export default function Home() {
  // API data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts();
        const data = response.data;

        // Handle Laravel pagination response
        if (data.data) {
          setProducts(data.data);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('حدث خطأ في تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <HomeCarousel banners={banners} />
      <CategoryCarousel categories={categories} />
      <FeaturesSection />
      <SpecialProducts title="المنتجات المميزة" products={products} />
      <Products products={products} />
    </div>
  );
}
