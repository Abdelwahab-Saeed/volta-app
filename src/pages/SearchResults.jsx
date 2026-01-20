import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '@/components/ProductCard';
import { Loader2, Square, LayoutGrid, StretchHorizontal } from 'lucide-react';
import WideProductCard from '@/components/WideProductCard';
import { useTranslation } from 'react-i18next';

export default function SearchResults() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [currentPage, setCurrentPage] = useState(1);
    const [mode, setMode] = useState('grid');

    const { products, pagination, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        if (query) {
            fetchProducts({
                search: query,
                page: currentPage,
                limit: 12,
            });
        }
    }, [query, currentPage, fetchProducts]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        {t('search.results_for')}: "{query}"
                    </h1>
                    <div className="flex gap-2 items-center text-primary text-sm md:text-base">
                        <Link to="/" className="hover:underline">{t('header.home')}</Link>
                        <Square fill='true' size={8} />
                        <span> {t('search.page_title')} </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-10 lg:px-20 py-12">
                {/* Controls */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
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

                    <div className="text-slate-600 font-medium">
                        {pagination?.total_items || 0} {t('products_page.total_products')}
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
                        <p className="text-slate-500 text-lg">{t('search.no_results')}</p>
                    </div>
                )}

                {/* Products Grid/List */}
                {!loading && !error && products.length > 0 && (
                    <>
                        {mode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {products.map((product) => (
                                    <WideProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                    <div className="flex justify-center gap-2 mt-12" dir="ltr">
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
        </>
    );
}
