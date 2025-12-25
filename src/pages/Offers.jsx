import ProductCard from '@/components/ProductCard';
import stabilizer from '../assets/home/stabilizer.png';
import { ChevronDown, LayoutGrid, Search, Square, StretchHorizontal } from 'lucide-react';
import { SortDropdown } from '@/components/ui/SortDropdown';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import WideProductCard from '@/components/WideProductCard';

export default function Offers() {
  const [sort, setSort] = useState('price_asc');
  const [selectedCategory, setSelectedCategory] = useState('SVC 5-20 kVA');
  const [priceRange, setPriceRange] = useState([40136, 135900]);
  const [mode, setMode] = useState('grid');

  const categories = [
    'SVC 2 kVA',
    'SVC 2 kVA',
    'SVC 2 kVA',
    'SVC 5 kVA',
    'SVC 10 kVA',
    'SVC 5-20 kVA',
  ];

  const products = [
    {
      name: 'منتج 1',
      image: stabilizer,
      price: 1000,
      discount: 10,
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
      discount: 5,
    },
    {
      name: 'منتج 4',
      image: stabilizer,
      price: 1000,
      discount: 12,
    },
    {
      name: 'منتج 5',
      image: stabilizer,
      price: 1000,
      discount: 22,
    },
    {
      name: 'منتج 6',
      image: stabilizer,
      price: 1000,
      discount: 18,
    },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <>
        <div className="bg-light-background px-40 py-8">
            <div>
                <h1 className="text-4xl font-bold text-primary mb-4">SVC 5-20 kVA </h1>
                <div className="flex gap-2 items-baseline text-primary px-2 mx-6">
                    <Square fill='true' size={10}/>
                    <span> الرئيسية </span>
                    <Square fill='true' size={10}/>
                    <span> المنتجات عروض </span>
                </div>
            </div>
        </div>
        <div className="flex justify-center px-14 py-12" dir="rtl">
        {/* Filter Sidebar */}
        <aside className="w-3/12 ml-12">
            <div className="bg-white sticky top-4">
            {/* Search Bar */}
            <div className=" pb-4 border-slate-100">
                <div className="relative">
                <input
                    type="text"
                    placeholder="بحث"
                    className="w-full py-3 px-4 pr-11  border-1  text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-right"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                </div>
            </div>

            {/* Categories Section */}
            <div className="p-6 bg-light-background">
                <h3 className="text-xl font-bold text-primary border-b-2 pb-6 mb-4">
                الفئات
                </h3>
                <div className="space-y-1">
                {categories.map((category, index) => (
                    <label
                    key={index}
                    className="flex items-center justify-between py-3 px-3 rounded-lg cursor-pointer transition-all hover:bg-slate-50"
                    >
                    <span className={`text-lg font-medium transition-colors ${
                        selectedCategory === category
                        ? 'text-primary text-xl'
                        : 'text-slate-700'
                    }`}>
                        {category}
                    </span>
                    <Checkbox
                        checked={selectedCategory === category}
                        onCheckedChange={() => handleCategoryChange(category)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-slate-300 rounded h-5 w-5"
                    />
                    </label>
                ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div className="p-6 mt-6 bg-light-background">
                <h3 className="text-xl font-bold border-b-2 pb-6 text-primary mb-6">
                السعر
                </h3>
                <div className="px-1">
                <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={40136}
                    max={135900}
                    step={100}
                    className="mb-6"
                    
                />
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-center">
                    <span className="text-slate-800 font-semibold text-sm">
                        EGP{priceRange[1].toLocaleString()}
                    </span>
                    </div>
                    <div className="w-6 h-0.5 bg-slate-300"></div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-center">
                    <span className="text-slate-800 font-semibold text-sm">
                        EGP{priceRange[0].toLocaleString()}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </aside>

        {/* Main Content */}
        <div className="w-9/12">
            <h2 className="text-3xl mb-4 font-bold text-slate-800">SVC 5-20 kVA</h2>
            <hr className="border-slate-200 mb-4" />

            <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2 my-4">
                <button
                onClick={() => setMode('grid')}
                className={`p-2 border-2 rounded-lg transition-colors ${
                    mode === 'grid'
                    ? 'border-primary bg-blue-50'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
                >
                <LayoutGrid size={24} className={`${mode === 'grid' ? 'text-primary' : 'text-slate-400'}`} />
                </button>

                <button
                onClick={() => setMode('stretch')}
                className={`p-2 border-2 rounded-lg transition-colors ${
                    mode === 'stretch'
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
                <span className="font-medium text-slate-700">36</span>
                <ChevronDown size={18} className="text-slate-600" />
                </button>
            </div>
            </div>

            
            {mode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {products.map((product, index) => (
                <ProductCard key={index} product={product} />
                ))}
            </div>
            ) : (
            <div className="my-6">
                {products.map((product, index) => (
                <WideProductCard key={index} product={product} />
                ))}
            </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 my-8" dir='ltr'>
            <button className="w-10 h-10 rounded-lg bg-secondary text-white font-medium hover:bg-blue-600 transition-colors">
                1
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                2
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                3
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                4
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                5
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                6
            </button>
            <button className="w-10 h-10 rounded-lg border border-slate-300 text-primary font-medium hover:bg-slate-50 transition-colors">
                7
            </button>
            </div>
        </div>
        </div>
    </>
  );
}