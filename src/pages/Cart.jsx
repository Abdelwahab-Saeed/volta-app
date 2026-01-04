import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Trash2, Minus, Plus, X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Cart() {
    const {
        cartItems,
        removeFromCart,
        fetchCart,
        updateCartItemQuantity,
        applyCoupon,
        removeCoupon,
        coupon,
        discountAmount,
        getCartTotal,
        getCartSubtotal
    } = useCartStore();

    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    // Update local coupon state when store updates (in case it matches)
    useEffect(() => {
        if (coupon) {
            setCouponCode(coupon.code);
        }
    }, [coupon]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        try {
            await applyCoupon(couponCode);
        } catch (error) {
            // Error handled in store
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode('');
    };

    // Calculate totals from store
    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    // Update quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateCartItemQuantity(id, newQuantity);
    }

    // Remove item
    const removeItem = (id) => {
        removeFromCart(id);
    };

    return (
        <div className="container mx-auto py-4 md:py-8 lg:py-20">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                {/* Cart Table */}
                {cartItems.length > 0 ? (
                    <div className="w-full lg:w-9/12 bg-white shadow-sm overflow-hidden mb-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 text-xl">
                                    <TableHead className="text-right px-4 md:px-15 font-semibold text-primary py-4">المنتج</TableHead>
                                    <TableHead className="text-right font-semibold text-primary py-4">السعر</TableHead>
                                    <TableHead className="text-right px-2 md:px-10 font-semibold text-primary py-4">الكمية</TableHead>
                                    <TableHead className="text-right font-semibold text-primary py-4">الإجمالي</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    aria-label="حذف المنتج"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGES_URL}/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                                                    />
                                                </div>
                                                <span className="font-medium text-base md:text-lg text-primary">{item.product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-primary text-base md:text-lg">
                                            EGP{item.product.final_price}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="text-lg px-2 py-1 md:px-3 md:py-2 hover:bg-gray-100 transition-colors"
                                                    aria-label="تقليل الكمية"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-lg px-2 md:px-4 py-1 md:py-2 min-w-[2rem] md:min-w-[3rem] text-center border-x border-gray-300">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-lg px-2 py-1 md:px-3 md:py-2 hover:bg-gray-100 transition-colors"
                                                    aria-label="زيادة الكمية"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-primary text-base md:text-lg">
                                            EGP{(item.product.final_price * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="w-full lg:w-9/12 flex justify-center items-center bg-white shadow-sm overflow-hidden mb-6 h-60">
                        <div className="p-6 text-center">
                            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-center text-xl font-semibold text-primary">السلة فارغة</p>
                            <Link to="/products" className="text-primary underline mt-2 inline-block">تصفح المنتجات</Link>
                        </div>
                    </div>
                )}

                {/* Totals Section */}
                <div className="w-full lg:w-3/12">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">ملخص الطلب</h3>

                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg text-gray-600">المجموع الفرعي</span>
                            <span className="text-lg font-bold text-primary">EGP{subtotal.toFixed(2)}</span>
                        </div>

                        {discountAmount > 0 && (
                            <div className="flex justify-between items-center mb-3 text-green-600">
                                <span className="text-lg">خصم الكوبون</span>
                                <span className="text-lg font-bold">-EGP{discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 pt-2">
                            <span className="text-xl font-bold text-primary">الإجمالي</span>
                            <span className="text-xl font-bold text-primary">EGP{total.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className={`block w-full ${cartItems.length === 0 ? 'pointer-events-none' : ''}`}>
                            <Button
                                disabled={cartItems.length === 0}
                                className="w-full h-12 text-lg bg-primary hover:bg-[#152a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                إتمام الشراء
                            </Button>
                        </Link>

                        <div className="mt-4 text-center">
                            <Link to='/' className="text-primary hover:underline transition-colors block py-2">
                                تابع عملية الشراء
                            </Link>
                        </div>
                    </div>

                    {/* Coupon Section directly under totals for mobile flow or separate but close */}
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                        <label className="block text-lg text-right text-primary font-bold mb-3">
                            كود الكوبون
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={!!coupon}
                                    placeholder="ادخل الكود"
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-right focus:outline-none focus:border-primary disabled:bg-gray-100"
                                />
                                {coupon && (
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <Button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !!coupon || !couponCode}
                                className="bg-primary text-white font-bold px-6 py-2 hover:bg-[#152a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isApplyingCoupon ? 'جاري...' : 'تطبيق'}
                            </Button>
                        </div>
                        {coupon && (
                            <p className="text-green-600 text-sm mt-2 text-right">
                                تم تطبيق الكوبون {coupon.code}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}