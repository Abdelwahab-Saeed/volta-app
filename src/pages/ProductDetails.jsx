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
import { getProduct } from "@/api/products.api";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const addToCart = useCartStore(state => state.addToCart);
    const cartItems = useCartStore(state => state.cartItems);
    const isInCart = (productId) => cartItems.some(item => item.product_id === productId);
    const [addingStr, setAddingStr] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(id);
                const productData = response.data.data || response.data;
                setProduct(productData);
                setMainImage(productData.image);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("فشل تحميل تفاصيل المنتج");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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

    const isAdded = isInCart(product.id);

    const handleAddToCart = async () => {
        if (isAdded) return;
        setAddingStr(true);
        await addToCart(product, quantity);
        setAddingStr(false);
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="bg-white border rounded-2xl p-8 flex items-center justify-center aspect-square relative overflow-hidden group">
                        <img
                            src={import.meta.env.VITE_IMAGES_URL + '/' + mainImage}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.discount > 0 && (
                            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                -{product.discount}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e2749] mb-2 leading-relaxed">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <span className="text-gray-500">(4.5 تقييم)</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-green-600 font-medium">متوفر في المخزون</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 pb-6 border-b">
                        <span className="text-4xl font-bold text-secondary">
                            EGP {product.final_price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through mb-1">
                                EGP {product.oldPrice}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border rounded-lg h-12 w-fit">
                            <button
                                onClick={decrementQuantity}
                                className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                disabled={isAdded}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={incrementQuantity}
                                className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                disabled={isAdded}
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <Button
                            onClick={handleAddToCart}
                            disabled={addingStr || isAdded}
                            className={`flex-1 h-12 text-lg font-bold transition-all ${isAdded
                                ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
                                : "bg-[#31A0D3] hover:bg-[#2890C2] text-white"
                                }`}
                        >
                            {addingStr ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : isAdded ? (
                                <>
                                    <Check className="mr-2 h-5 w-5" />
                                    تم الإضافة للسلة
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    أضف إلى السلة
                                </>
                            )}
                        </Button>

                        {/* Wishlist */}
                        <button className="h-12 w-12 border rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                            <Heart size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
