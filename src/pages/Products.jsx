import ProductCard from '@/components/ProductCard';
import { ChevronDown, LayoutGrid, Search, Square, StretchHorizontal, Loader2 } from 'lucide-react';
import { SortDropdown } from '@/components/ui/SortDropdown';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import WideProductCard from '@/components/WideProductCard';
import { getCategories } from '@/api/categories';
import { Link, useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { useProductStore } from '@/stores/useProductStore';
import { useTranslation } from 'react-i18next';

export default function Products() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('price_asc');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [mode, setMode] = useState('grid');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Store
  const { products, pagination, loading, error, fetchProducts } = useProductStore();
  const [categories, setCategories] = useState([]);

  // Local state for page to control fetch
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories on mount and set initial category from URL
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        const cats = response.data.data || response.data;
        setCategories(cats);

        // Sync with URL param
        const categoryId = searchParams.get('category');
        if (categoryId) {
          const cat = cats.find(c => c.id.toString() === categoryId);
          if (cat) setSelectedCategory(cat);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []); // Run once

  // Update URL when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams(params => {
        params.set('category', selectedCategory.id);
        return params;
      });
    } else {
      setSearchParams(params => {
        params.delete('category');
        return params;
      });
    }
  }, [selectedCategory, setSearchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12, // Fixed limit or make it dynamic
      sort: sort === 'price_asc' ? 'asc' : 'desc', // Mapping sort to API expectation
      min_price: priceRange[0],
      max_price: priceRange[1],
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (selectedCategory) {
      params.category = selectedCategory.id;
    }

    fetchProducts(params);
  }, [currentPage, selectedCategory, sort, priceRange, debouncedSearch, fetchProducts]);


  const handleCategoryChange = (category) => {
    setSelectedCategory(prev => prev?.id === category.id ? null : category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {selectedCategory?.name || t('products_page.all_products')}
          </h1>
          <div className="flex gap-2 items-center text-primary text-sm md:text-base">
            <Link to="/" className="hover:underline">{t('header.home')}</Link>
            <Square fill='true' size={8} />
            <span> {t('products_page.all_products')} </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-center px-4 md:px-10 lg:px-20 py-12 gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-3/12">
          <div className="bg-white sticky top-4">
            {/* Search Bar */}
            <div className=" pb-4 border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('products_page.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-3 px-4 pr-11 border rounded-lg border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all rtl:pr-4 rtl:pl-11"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary rtl:left-auto rtl:right-3" />
              </div>
            </div>

            {/* Categories Section */}
            <div className="p-4 md:p-6 bg-light-background rounded-xl">
              <h3 className="text-lg md:text-xl font-bold text-primary border-b-2 pb-4 mb-4">
                {t('products_page.categories')}
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50"
                  >
                    <span className={`text-base md:text-lg font-medium transition-colors ${selectedCategory?.id === category.id
                      ? 'text-primary text-lg md:text-xl'
                      : 'text-slate-700'
                      }`}>
                      {category.name}
                    </span>
                    <Checkbox
                      checked={selectedCategory?.id === category.id}
                      onCheckedChange={() => handleCategoryChange(category)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-slate-300 rounded h-5 w-5"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="p-4 md:p-6 mt-6 bg-light-background rounded-xl">
              <h3 className="text-lg md:text-xl font-bold border-b-2 pb-4 text-primary mb-6">
                {t('products_page.price')}
              </h3>
              <div className="px-1">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={setPriceRange}
                  min={0}
                  max={100000}
                  step={100}
                  dir="rtl"
                  className="mb-6"
                />
                <div className="flex items-center justify-between mt-2 text-slate-600 font-medium text-sm md:text-base">
                  <span dir="ltr">{t('common.currency')} {priceRange[0].toLocaleString()}</span>
                  <span>—</span>
                  <span dir="ltr">{t('common.currency')} {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full lg:w-9/12">
          <h2 className="text-2xl md:text-3xl mb-4 font-bold text-slate-800">
            {selectedCategory?.name || t('products_page.all_products')}
          </h2>
          <hr className="border-slate-200 mb-4" />

          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2 my-4">
              <button
                onClick={() => setMode('grid')}
                className={`p-2 border-2 rounded-lg transition-colors ${mode === 'grid'
                  ? 'border-primary bg-blue-50'
                  : 'border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <LayoutGrid size={24} className={`${mode === 'grid' ? 'text-primary' : 'text-slate-400'}`} />
              </button>

              <button
                onClick={() => setMode('stretch')}
                className={`p-2 border-2 rounded-lg transition-colors ${mode === 'stretch'
                  ? 'border-primary bg-blue-50'
                  : 'border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <StretchHorizontal size={24} className={`${mode === 'stretch' ? 'text-primary' : 'text-slate-400'}`} />
              </button>
            </div>

            <div className="flex gap-4">
              <SortDropdown onChange={setSort} />
              <button className="px-4 py-2 border border-slate-300 bg-slate-50 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <span className="font-medium text-slate-700">{pagination?.total_items || 0}</span>
                <span className="text-slate-500 text-sm">{t('products_page.total_products')}</span>
              </button>
            </div>
          </div>


          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">{t('products_page.no_products')}</p>
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && !error && products.length > 0 && (
            <>
              {mode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="my-6">
                  {products.map((product) => (
                    <WideProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages >= 1 && (
            <div className="flex justify-center gap-2 my-8" dir="ltr">
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagination.current_page === page
                    ? 'bg-secondary text-white hover:bg-blue-600'
                    : 'border border-slate-300 text-primary hover:bg-slate-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}