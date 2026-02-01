import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { useCartStore } from "@/stores/useCartStore";
import { useCheckoutStore } from "@/stores/useCheckoutStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAddressStore } from "@/stores/useAddressStore";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import SafeImage from "@/components/common/SafeImage";

import logo from '../assets/volta-logo-02.png';

export default function Checkout() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        cartItems,
        cartLoading,
        coupon,
        discountAmount,
        getCartTotal,
        getCartSubtotal,
        fetchCart,
        applyCoupon,
        removeCoupon
    } = useCartStore();

    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const { submitOrder, isLoading } = useCheckoutStore();
    const { user } = useAuthStore();

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

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            full_name: user?.name || "",
            phone_number: user?.phone || "",
            phone_number_backup: "",
            state: "",
            city: "",
            shipping_way: "home",
            payment_method: "cash",
            notes: "",
            coupon_code: coupon ? coupon.code : "",
            address_line: ""
        }
    });

    // Update form default values when user loads
    useEffect(() => {
        if (user) {
            setValue('full_name', user.name || "");
            setValue('phone_number', user.phone || "");
        }
    }, [user, setValue]);

    // Update coupon code in form if it changes in store
    useEffect(() => {
        if (coupon) {
            setValue('coupon_code', coupon.code);
        }
    }, [coupon, setValue]);

    // Fetch addresses and pre-fill
    const { addresses, fetchAddresses } = useAddressStore();

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user, fetchAddresses]);

    useEffect(() => {
        if (addresses && addresses.length > 0) {
            const firstAddress = addresses[0];
            setValue('state', firstAddress.state || "");
            setValue('city', firstAddress.city || "");
            const fullAddress = [firstAddress.address_line_1, firstAddress.address_line_2].filter(Boolean).join(' ');
            setValue('address_line', fullAddress || "");
            if (firstAddress.recipient_name) setValue('full_name', firstAddress.recipient_name);
            if (firstAddress.phone_number) setValue('phone_number', firstAddress.phone_number);
        }
    }, [addresses, setValue]);

    // Calculate totals
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const shippingFee = 30.00; // Fixed for now

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
                                {/* Full Name */}
                                <div>
                                    <Label htmlFor="full_name" className="text-start block mb-2">
                                        {t('checkout.full_name')}
                                    </Label>
                                    <Input
                                        id="full_name"
                                        placeholder={t('checkout.full_name_placeholder')}
                                        className="text-start"
                                        {...register("full_name", {
                                            required: t('checkout.full_name_required')
                                        })}
                                    />
                                    {errors.full_name && (
                                        <p className="text-red-500 text-sm mt-1 text-start">
                                            {errors.full_name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Numbers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone_number" className="text-start block mb-2">
                                            {t('checkout.phone')}
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            placeholder="01xxxxxxxxx"
                                            className="text-start"
                                            {...register("phone_number", {
                                                required: t('checkout.phone_required'),
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: t('checkout.phone_invalid')
                                                }
                                            })}
                                        />
                                        {errors.phone_number && (
                                            <p className="text-red-500 text-sm mt-1 text-start">
                                                {errors.phone_number.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_number_backup" className="text-start block mb-2">
                                            {t('checkout.phone_backup')}
                                        </Label>
                                        <Input
                                            id="phone_number_backup"
                                            placeholder="01xxxxxxxxx"
                                            className="text-start"
                                            {...register("phone_number_backup", {
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: t('checkout.phone_invalid')
                                                }
                                            })}
                                        />
                                        {errors.phone_number_backup && (
                                            <p className="text-red-500 text-sm mt-1 text-start">
                                                {errors.phone_number_backup.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Governorate and City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="state" className="text-start block mb-2">
                                            {t('checkout.state')}
                                        </Label>
                                        <Input
                                            id="state"
                                            placeholder={t('checkout.state_placeholder')}
                                            className="text-start"
                                            {...register("state", {
                                                required: t('checkout.state_required')
                                            })}
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1 text-start">
                                                {errors.state.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="city" className="text-start block mb-2">
                                            {t('checkout.city')}
                                        </Label>
                                        <Input
                                            id="city"
                                            placeholder={t('checkout.city_placeholder')}
                                            className="text-start"
                                            {...register("city", {
                                                required: t('checkout.city_required')
                                            })}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1 text-start">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address Line */}
                                <div>
                                    <Label htmlFor="address_line" className="text-start block mb-2">
                                        {t('checkout.address')}
                                    </Label>
                                    <Input
                                        id="address_line"
                                        placeholder={t('checkout.address_placeholder')}
                                        className="text-start"
                                        {...register("address_line", {
                                            required: t('checkout.address_required')
                                        })}
                                    />
                                    {errors.address_line && (
                                        <p className="text-red-500 text-sm mt-1 text-start">
                                            {errors.address_line.message}
                                        </p>
                                    )}
                                </div>

                                {/* Shipping Method */}
                                <div>
                                    <Label className="text-start block mb-3 font-semibold">
                                        {t('checkout.shipping_method')}
                                    </Label>
                                    <RadioGroup
                                        defaultValue="home"
                                        onValueChange={(value) => setValue("shipping_way", value)}
                                    >
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <Label htmlFor="shipping-home" className="flex-1 cursor-pointer text-start">
                                                {t('checkout.home_delivery')}
                                            </Label>
                                            <RadioGroupItem value="home" id="shipping-home" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
                                            <Label htmlFor="shipping-pickup" className="flex-1 cursor-pointer text-start">
                                                {t('checkout.pickup_from_branch')}
                                            </Label>
                                            <RadioGroupItem value="pickup" id="shipping-pickup" />
                                        </div>
                                    </RadioGroup>
                                    {errors.shipping_way && (
                                        <p className="text-red-500 text-sm mt-1 text-start">
                                            {errors.shipping_way.message}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="border-2 border-primary/20 rounded-lg p-4">
                                    <Label className="text-start block mb-3 font-semibold">
                                        {t('checkout.payment_method')}
                                    </Label>
                                    <RadioGroup
                                        defaultValue="cash"
                                        onValueChange={(value) => setValue("payment_method", value)}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-cash" className="flex-1 cursor-pointer text-start">
                                                    {t('checkout.cash_on_delivery')}
                                                </Label>
                                                <RadioGroupItem value="cash" id="payment-cash" />
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    {errors.payment_method && (
                                        <p className="text-red-500 text-sm mt-1 text-start">
                                            {errors.payment_method.message}
                                        </p>
                                    )}
                                </div>

                                {/* Order Notes */}
                                <div>
                                    <Label htmlFor="notes" className="text-start block mb-2 font-semibold">
                                        {t('checkout.order_notes')}
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder={t('checkout.order_notes_placeholder')}
                                        className="text-start min-h-[120px]"
                                        {...register("notes")}
                                    />
                                </div>

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
                                                alt={item.product?.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 text-start">
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.product?.name}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.quantity} x EGP{(useCartStore.getState().getItemPrice(item) / item.quantity).toFixed(2)}
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
                                    <span>EGP{subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="text-start">{t('cart.discount')}</span>
                                        <span>-EGP{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span className="text-start">{t('checkout.shipping_fee')}</span>
                                    <span>EGP{shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                    <span className="text-start">{t('cart.total')}</span>
                                    <span>EGP{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}