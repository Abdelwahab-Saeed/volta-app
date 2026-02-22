import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '@/api/posts.api';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowLeft, Square } from 'lucide-react';

export default function PostDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true);
            try {
                const response = await getPost(id);
                const fetchedData = response.data.data || response.data;
                // Support both {data: {post: {...}}} and {data: {...}}
                setPost(fetchedData.post || fetchedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError(t('common.error_loading_data') || 'Error loading post details');
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id, t]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-40 px-4">
                <p className="text-red-500 text-lg mb-6">{error || 'Post not found'}</p>
                <Link
                    to="/blog"
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                    <ArrowLeft size={20} className="mr-2 rtl:hidden" />
                    <ArrowLeft size={20} className="ml-2 hidden rtl:block rotate-180" />
                    {t('blog.back_to_blog') || 'Back to Blog'}
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="bg-light-background px-4 md:px-10 lg:px-40 py-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 items-center text-primary text-sm md:text-base">
                        <Link to="/" className="hover:underline">{t('header.home')}</Link>
                        <Square fill='true' size={8} />
                        <Link to="/blog" className="hover:underline">{t('footer.blog') || 'Blog'}</Link>
                        <Square fill='true' size={8} />
                        <span className="text-slate-500 truncate max-w-[200px] md:max-w-md"> {post.title} </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-secondary font-semibold hover:text-blue-700 transition-colors mb-8"
                    >
                        <ArrowLeft size={20} className="mr-2 rtl:hidden" />
                        <ArrowLeft size={20} className="ml-2 hidden rtl:block rotate-180" />
                        {t('blog.back_to_blog') || 'Back to Blog'}
                    </Link>

                    <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 mb-10">
                        <img
                            src={`${import.meta.env.VITE_IMAGES_URL}/${post.image}`}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>

                    <article className="prose prose-lg max-w-none">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                            {post.title}
                        </h2>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                            {post.description}
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
