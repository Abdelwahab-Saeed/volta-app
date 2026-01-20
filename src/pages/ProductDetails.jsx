import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    ChevronRight,
    Loader2,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useProductStore } from "@/stores/useProductStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductView from "@/components/product/ProductView";
import SpecialProducts from "@/components/home/SpecialProducts";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
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
            setQuantity(product.stock);
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
                <p className="text-red-500 text-lg font-medium">{error || "المنتج غير موجود"}</p>
                <Link to="/products" className="text-secondary hover:underline">
                    العودة للمنتجات
                </Link>
            </div>
        );
    }

    const isAdded = cartItems.some(item => item.product_id === product.id);

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            toast.error('يرجى تسجيل الدخول أولاً');
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
            toast.error('يرجى تسجيل الدخول أولاً');
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

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="container mx-auto px-4 py-8 font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-secondary">الرئيسية</Link>
                <ChevronRight size={14} />
                <Link to="/products" className="hover:text-secondary">المنتجات</Link>
                <ChevronRight size={14} />
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
                    <SpecialProducts title="منتجات ذات صلة" products={relatedProducts} />
                </div>
            )}
        </div>
    );
}
