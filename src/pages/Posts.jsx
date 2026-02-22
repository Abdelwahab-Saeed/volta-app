import { useState, useEffect } from 'react';
import { getPosts } from '@/api/posts.api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Square, ChevronRight } from 'lucide-react';

export default function Posts() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setLoading(true);
            try {
                const response = await getPosts({ page: currentPage });
                const fetchedData = response.data.data || response.data;
                setPosts(fetchedData.posts || []);
                setPagination(fetchedData.pagination || null);
                setError(null);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(t('common.error_loading_data') || 'Error loading posts');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogPosts();
    }, [currentPage, t]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        {t('footer.blog') || 'Blog'}
                    </h1>
                    <div className="flex gap-2 items-center text-primary text-sm md:text-base">
                        <Link to="/" className="hover:underline">{t('header.home')}</Link>
                        <Square fill='true' size={8} />
                        <span> {t('footer.blog') || 'Blog'} </span>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-10 lg:px-40 py-12">
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-20">
                        <p className="text-red-500 text-lg">{error}</p>
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">{t('blog.no_posts') || 'No posts available'}</p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={`${import.meta.env.VITE_IMAGES_URL}/${post.image}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-1">
                                            {post.description}
                                        </p>
                                        <Link
                                            to={`/blog/${post.id}`}
                                            className="inline-flex items-center text-secondary font-semibold hover:text-blue-700 transition-colors"
                                        >
                                            {t('blog.read_more') || 'Read More'}
                                            <ChevronRight size={18} className="ml-1 rtl:rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

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
                    </>
                )}
            </div>
        </>
    );
}
