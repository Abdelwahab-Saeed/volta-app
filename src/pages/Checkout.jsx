import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { useCartStore } from "@/stores/useCartStore";
import { useCheckoutStore } from "@/stores/useCheckoutStore";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/common/SafeImage";
import DeliveryFields from "@/components/checkout/DeliveryFields";
import { useDeliveryForm } from "@/components/checkout/useDeliveryForm";
import { useLocalize } from "@/lib/localize";

import logo from '../assets/volta-logo-02.png';
import { trackEvent } from '@/lib/pixel';

export default function Checkout() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tr = useLocalize();
    const {
        cartItems,
        cartLoading,
        coupon,
        discountAmount,
        getCartTotal,
        getCartSubtotal,
        fetchCart,
        getShippingTotal,
        applyCoupon,
        removeCoupon
    } = useCartStore();

    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const { submitOrder, isLoading } = useCheckoutStore();

    // Fetch cart if empty
    useEffect(() => {
        if (cartItems.length === 0) {
            fetchCart();
        }
    }, [fetchCart, cartItems.length]);

    // Redirect to home if cart is empty after loading
    useEffect(() => {
        if (!cartLoading && cartItems.length === 0) {
            navigate('/');
        }
    }, [cartItems.length, cartLoading, navigate]);

    // Meta Pixel: Track InitiateCheckout
    // useEffect(() => {
    //     if (!cartLoading && cartItems.length > 0) {
    //         trackEvent('InitiateCheckout', {
    //             content_ids: cartItems.map(item => item.product_id),
    //             content_type: 'product',
    //             value: getCartTotal(),
    //             currency: 'EGP'
    //         });
    //     }
    // }, [cartLoading, cartItems.length]); // Track only once when cart is loaded and not empty

    const { register, handleSubmit, formState: { errors }, setValue } = useDeliveryForm({
        coupon_code: coupon ? coupon.code : ""
    });

    // Update coupon code in form if it changes in store
    useEffect(() => {
        if (coupon) {
            setValue('coupon_code', coupon.code);
        }
    }, [coupon, setValue]);

    // Calculate totals
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const shippingFee = getShippingTotal();

    const finalTotal = total + shippingFee;

    // Form submission
    const onSubmit = async (data) => {
        if (cartItems.length === 0) {
            toast.error(t('cart.empty'));
            return;
        }

        try {
            // Ensure coupon_code and items are sent as per API requirements
            const payload = {
                ...data,
                coupon_code: coupon ? coupon.code : (data.coupon_code || null),
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            };

            await submitOrder(payload, navigate);
        } catch (error) {
            // Errors handled in store (toast displayed), but we can handle form errors here if needed
            console.error("Submission failed", error);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        try {
            await applyCoupon(couponInput);
            setCouponInput('');
        } catch (error) {
            // Error handled in store
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponInput('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <div className="border-b border-gray-300 pb-6 mb-4">
                                    <SafeImage src={logo} alt="VOLTA" className="h-15" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 text-start">{t('checkout.shipping_info')}</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DeliveryFields register={register} errors={errors} setValue={setValue} />

                                {/* Hidden Coupon Field */}
                                <input type="hidden" {...register("coupon_code")} />

                                {/* Terms and Submit */}
                                <div className="flex gap-4 justify-between items-center pt-4">
                                    <p className="text-sm text-primary text-start">
                                        <Link to="/cart" className="text-primary underline">
                                            {t('checkout.back_to_cart')}
                                        </Link>
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-5 py-7 bg-secondary rounded-xl hover:bg-[#0090c7] text-white text-lg disabled:opacity-50 min-w-[200px]"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>{t('checkout.processing')}</span>
                                            </div>
                                        ) : (
                                            t('checkout.place_order')
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-start">
                                {t('cart.order_summary')}
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                            <SafeImage
                                                src={`${import.meta.env.VITE_IMAGES_URL}/${item.product?.image}`}
                                                alt={tr(item.product, 'name')}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <p className="font-medium text-gray-800 line-clamp-2">{tr(item.product, 'name')}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.quantity} x {(useCartStore.getState().getItemPrice(item) / item.quantity).toFixed(2)} {t('common.currency')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6 pt-4 border-t">
                                <Label className="text-start block mb-2 font-semibold">
                                    {t('cart.coupon_code')}
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            value={coupon ? coupon.code : couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            disabled={!!coupon}
                                            placeholder={t('cart.enter_code')}
                                            className="text-start disabled:bg-gray-100"
                                        />
                                        {coupon && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                            aria-label={t('a11y.remove_coupon')}
                                                className="absolute end-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !!coupon || !couponInput}
                                        className="bg-primary text-white hover:bg-[#152a45]"
                                    >
                                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : t('cart.apply')}
                                    </Button>
                                </div>
                                {coupon && (
                                    <p className="text-green-600 text-sm mt-2 text-start">
                                        {t('cart.coupon_applied', { code: coupon.code })}
                                    </p>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-start">{t('cart.subtotal')}</span>
                                    <span>{subtotal.toFixed(2)} {t('common.currency')}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="text-start">{t('cart.discount')}</span>
                                        <span><span dir="ltr">-{discountAmount.toFixed(2)}</span> {t('common.currency')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-start">{t('checkout.shipping_fee')}</span>
                                    <span>{shippingFee.toFixed(2)} {t('common.currency')}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                    <span className="text-start">{t('cart.total')}</span>
                                    <span>{finalTotal.toFixed(2)} {t('common.currency')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}