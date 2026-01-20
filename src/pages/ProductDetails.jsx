import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useProductStore } from "@/stores/useProductStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ProductView from "@/components/product/ProductView";
import SpecialProducts from "@/components/home/SpecialProducts";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectedProduct: product, fetchProductById, loading, error, clearSelectedProduct } = useProductStore();
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");

    const addToCart = useCartStore(state => state.addToCart);
    const cartItems = useCartStore(state => state.cartItems);
    const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
    const isInWishlist = useWishlistStore(state => state.isInWishlist(product?.id));
    const addToComparison = useComparisonStore(state => state.addToComparison);
    const isInComparison = useComparisonStore(state => state.isInComparison(product?.id));
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    const [addingStr, setAddingStr] = useState(false);
    const { products: allProducts, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const relatedProducts = allProducts.filter(p => p.category_id === product?.category_id && p.id !== product?.id).slice(0, 8);

    useEffect(() => {
        fetchProductById(id);
        return () => clearSelectedProduct();
    }, [id, fetchProductById, clearSelectedProduct]);

    useEffect(() => {
        if (product) {
            setMainImage(product.image);
            setQuantity(1); // Default to 1, not stock
        }
    }, [product]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-red-500 text-lg font-medium">{error || t('product.not_found')}</p>
                <Link to="/products" className="text-secondary hover:underline">
                    {t('product.back_to_products')}
                </Link>
            </div>
        );
    }

    const isAdded = cartItems.some(item => item.product_id === product.id);

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            toast.error(t('messages.login_required_wishlist'));
            navigate('/login');
            return;
        }
        try {
            await toggleWishlist(product);
        } catch (error) {
            // Handled in store
        }
    };

    const handleComparisonToggle = async () => {
        if (!isAuthenticated) {
            toast.error(t('messages.login_required_compare'));
            navigate('/login');
            return;
        }
        try {
            await addToComparison(product);
        } catch (error) {
            // Handled in store
        }
    };

    const handleAddToCart = async () => {
        if (isAdded) return;
        setAddingStr(true);
        try {
            await addToCart(product, quantity);
        } catch (error) {
            console.error(error);
        } finally {
            setAddingStr(false);
        }
    };

    const handleBuyNow = async () => {
        setAddingStr(true);
        try {
            await addToCart(product, quantity);
            navigate('/checkout');
        } catch (error) {
            console.error(error);
        } finally {
            setAddingStr(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 font-sans transition-all duration-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link to="/" className="hover:text-secondary">{t('header.home')}</Link>
                <ChevronRight size={14} className="flex-shrink-0 rtl:rotate-180" />
                <Link to="/products" className="hover:text-secondary">{t('header.products')}</Link>
                <ChevronRight size={14} className="flex-shrink-0 rtl:rotate-180" />
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </div>

            {/* Main Product View */}
            <ProductView
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleWishlistToggle}
                onToggleComparison={handleComparisonToggle}
                isInWishlist={isInWishlist}
                isInComparison={isInComparison}
                isAdded={isAdded}
                addingLoading={addingStr}
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20">
                    <SpecialProducts title={t('product.related_products')} products={relatedProducts} />
                </div>
            )}
        </div>
    );
}
