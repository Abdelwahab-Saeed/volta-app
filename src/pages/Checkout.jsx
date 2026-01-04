import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import logo from '../assets/volta-logo-02.png';
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { useCheckoutStore } from "@/stores/useCheckoutStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function Checkout() {
    const navigate = useNavigate();
    const {
        cartItems,
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
    }, []);

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
            coupon_code: coupon ? coupon.code : ""
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

    // Calculate totals
    const subtotal = getCartSubtotal();
    const total = getCartTotal();
    const shippingFee = 30.00; // Fixed for now

    const finalTotal = total + shippingFee;

    // Form submission
    const onSubmit = async (data) => {
        if (cartItems.length === 0) {
            toast.error("السلة فارغة");
            return;
        }

        try {
            // Ensure coupon_code is sent if present in store/form
            const payload = {
                ...data,
                coupon_code: coupon ? coupon.code : (data.coupon_code || null)
            };

            await submitOrder(payload, navigate);
        } catch (error) {
            // Errors handled in store (toast displayed), but we can handle form errors here if needed
            console.error("Submission failed", error);
        }
    };

    if (cartItems.length === 0 && !isLoading) {
        // Could render empty state here
    }

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <div className="border-b border-gray-300 pb-6 mb-4">
                                    <img src={logo} alt="VOLTA" className="h-15" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">معلومات الشحن</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <Label htmlFor="full_name" className="text-right block mb-2">
                                        الاسم بالكامل
                                    </Label>
                                    <Input
                                        id="full_name"
                                        placeholder="ادخل اسمك الكامل"
                                        className="text-right"
                                        {...register("full_name", {
                                            required: "الاسم بالكامل مطلوب"
                                        })}
                                    />
                                    {errors.full_name && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.full_name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Numbers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone_number" className="text-right block mb-2">
                                            الهاتف
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            placeholder="01xxxxxxxxx"
                                            className="text-right"
                                            {...register("phone_number", {
                                                required: "رقم الهاتف مطلوب",
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: "رقم الهاتف غير صحيح"
                                                }
                                            })}
                                        />
                                        {errors.phone_number && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.phone_number.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_number_backup" className="text-right block mb-2">
                                            الهاتف الاحتياطي (اختياري)
                                        </Label>
                                        <Input
                                            id="phone_number_backup"
                                            placeholder="01xxxxxxxxx"
                                            className="text-right"
                                            {...register("phone_number_backup", {
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: "رقم الهاتف غير صحيح"
                                                }
                                            })}
                                        />
                                        {errors.phone_number_backup && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.phone_number_backup.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Governorate and City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="state" className="text-right block mb-2">
                                            المحافظة
                                        </Label>
                                        <Input
                                            id="state"
                                            placeholder="اكتب المحافظة"
                                            className="text-right"
                                            {...register("state", {
                                                required: "المحافظة مطلوبة"
                                            })}
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.state.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="city" className="text-right block mb-2">
                                            المدينة
                                        </Label>
                                        <Input
                                            id="city"
                                            placeholder="اكتب المدينة"
                                            className="text-right"
                                            {...register("city", {
                                                required: "المدينة مطلوبة"
                                            })}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Method */}
                                <div>
                                    <Label className="text-right block mb-3 font-semibold">
                                        طريقة الشحن
                                    </Label>
                                    <RadioGroup
                                        defaultValue="home"
                                        onValueChange={(value) => setValue("shipping_way", value)}
                                    >
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <Label htmlFor="shipping-home" className="flex-1 cursor-pointer text-right">
                                                توصيل للمنزل
                                            </Label>
                                            <RadioGroupItem value="home" id="shipping-home" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
                                            <Label htmlFor="shipping-office" className="flex-1 cursor-pointer text-right">
                                                توصيل للمكتب
                                            </Label>
                                            <RadioGroupItem value="office" id="shipping-office" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mt-2">
                                            <Label htmlFor="shipping-pickup" className="flex-1 cursor-pointer text-right">
                                                استلام من الفرع
                                            </Label>
                                            <RadioGroupItem value="pickup" id="shipping-pickup" />
                                        </div>
                                    </RadioGroup>
                                    {errors.shipping_way && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.shipping_way.message}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="border-2 border-primary/20 rounded-lg p-4">
                                    <Label className="text-right block mb-3 font-semibold">
                                        طريقة الدفع
                                    </Label>
                                    <RadioGroup
                                        defaultValue="cash"
                                        onValueChange={(value) => setValue("payment_method", value)}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-cash" className="flex-1 cursor-pointer text-right">
                                                    الدفع نقدا عند الاستلام
                                                </Label>
                                                <RadioGroupItem value="cash" id="payment-cash" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-card" className="flex-1 cursor-pointer text-right">
                                                    بطاقة الائتمان/الخصم المباشر
                                                </Label>
                                                <RadioGroupItem value="card" id="payment-card" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-wallet" className="flex-1 cursor-pointer text-right">
                                                    محفظة الكترونية
                                                </Label>
                                                <RadioGroupItem value="wallet" id="payment-wallet" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-valu" className="flex-1 cursor-pointer text-right">
                                                    Valu
                                                </Label>
                                                <RadioGroupItem value="valu" id="payment-valu" />
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    {errors.payment_method && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.payment_method.message}
                                        </p>
                                    )}
                                </div>

                                {/* Order Notes */}
                                <div>
                                    <Label htmlFor="notes" className="text-right block mb-2 font-semibold">
                                        ملاحظات الطلب
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="ملاحظات بخصوص طلبك"
                                        className="text-right min-h-[120px]"
                                        {...register("notes")}
                                    />
                                </div>

                                {/* Hidden Coupon Field */}
                                <input type="hidden" {...register("coupon_code")} />

                                {/* Terms and Submit */}
                                <div className="flex gap-4 justify-between items-center pt-4">
                                    <p className="text-sm text-primary text-right">
                                        <Link to="/cart" className="text-primary underline">
                                            العودة إلى عربة التسوق
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
                                                <span>جاري المعالجة...</span>
                                            </div>
                                        ) : (
                                            "إتمام عملية الشراء"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">
                                ملخص الطلب
                            </h3>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b">
                                        <div className="flex-1 text-right">
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.quantity} x EGP{item.product.final_price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={`${import.meta.env.VITE_IMAGES_URL}/${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-14 h-14 object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6 pt-4 border-t">
                                <Label className="text-right block mb-2 font-semibold">
                                    كود الكوبون
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            value={coupon ? coupon.code : couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            disabled={!!coupon}
                                            placeholder="ادخل كود الكوبون"
                                            className="text-right disabled:bg-gray-100"
                                        />
                                        {coupon && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
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
                                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تطبيق'}
                                    </Button>
                                </div>
                                {coupon && (
                                    <p className="text-green-600 text-sm mt-2 text-right">
                                        تم تطبيق الكوبون {coupon.code} بنجاح
                                    </p>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between text-gray-600">
                                    <span>EGP{subtotal.toFixed(2)}</span>
                                    <span>المجموع الفرعي</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>-EGP{discountAmount.toFixed(2)}</span>
                                        <span>خصم ({coupon?.code})</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>EGP{shippingFee.toFixed(2)}</span>
                                    <span>رسوم الشحن</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                    <span>EGP{finalTotal.toFixed(2)}</span>
                                    <span>الإجمالي</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}