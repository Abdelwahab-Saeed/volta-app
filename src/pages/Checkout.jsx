import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import productImage from '../assets/home/stabilizer.png';
import logo from '../assets/volta-logo-02.png';
import { Link } from "react-router-dom";

export default function Checkout() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "منتج",
            price: 91.00,
            quantity: 1,
            image: productImage
        },
        {
            id: 2,
            name: "منتج",
            price: 91.00,
            quantity: 1,
            image: productImage
        }
    ]);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            alternativePhone: "",
            governorate: "",
            city: "",
            shippingMethod: "",
            paymentMethod: "",
            notes: ""
        }
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 30.00;
    const total = subtotal + shippingFee;

    // Update quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Form submission
    const onSubmit = (data) => {
        const orderData = {
            ...data,
            items: cartItems,
            subtotal,
            shippingFee,
            total
        };
        console.log("Order Data:", orderData);
        // Handle order submission here
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
                                    <Label htmlFor="fullName" className="text-right block mb-2">
                                        الاسم بالكامل
                                    </Label>
                                    <Input
                                        id="fullName"
                                        placeholder="ادخل اسمك الكامل"
                                        className="text-right"
                                        {...register("fullName", { 
                                            required: "الاسم بالكامل مطلوب" 
                                        })}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Numbers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone" className="text-right block mb-2">
                                            الهاتف
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="01144478657"
                                            className="text-right"
                                            {...register("phone", { 
                                                required: "رقم الهاتف مطلوب",
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: "رقم الهاتف غير صحيح"
                                                }
                                            })}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="alternativePhone" className="text-right block mb-2">
                                            الهاتف الاحتياطي
                                        </Label>
                                        <Input
                                            id="alternativePhone"
                                            placeholder="01278069759"
                                            className="text-right"
                                            {...register("alternativePhone", {
                                                pattern: {
                                                    value: /^01[0-9]{9}$/,
                                                    message: "رقم الهاتف غير صحيح"
                                                }
                                            })}
                                        />
                                        {errors.alternativePhone && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.alternativePhone.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Governorate and City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="governorate" className="text-right block mb-2">
                                            المحافظة
                                        </Label>
                                        <Input
                                            id="governorate"
                                            placeholder="اكتب المحافظة"
                                            className="text-right"
                                            {...register("governorate", { 
                                                required: "المحافظة مطلوبة" 
                                            })}
                                        />
                                        {errors.governorate && (
                                            <p className="text-red-500 text-sm mt-1 text-right">
                                                {errors.governorate.message}
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
                                        defaultValue=""
                                        onValueChange={(value) => {
                                            register("shippingMethod").onChange({ target: { value } });
                                        }}
                                    >
                                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <Label htmlFor="shipping-home" className="flex-1 cursor-pointer text-right">
                                                توصيل للمنزل
                                            </Label>
                                            <RadioGroupItem value="home" id="shipping-home" />
                                        </div>
                                    </RadioGroup>
                                    {errors.shippingMethod && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.shippingMethod.message}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="border-2 border-blue-400 rounded-lg p-4">
                                    <Label className="text-right block mb-3 font-semibold">
                                        طريقة الدفع
                                    </Label>
                                    <RadioGroup 
                                        defaultValue=""
                                        onValueChange={(value) => {
                                            register("paymentMethod").onChange({ target: { value } });
                                        }}
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
                                                <Label htmlFor="payment-mobile" className="flex-1 cursor-pointer text-right">
                                                    محفظة الكترونية
                                                </Label>
                                                <RadioGroupItem value="mobile" id="payment-mobile" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <Label htmlFor="payment-installment" className="flex-1 cursor-pointer text-right">
                                                    التقسيط
                                                </Label>
                                                <RadioGroupItem value="installment" id="payment-installment" />
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    {errors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-1 text-right">
                                            {errors.paymentMethod.message}
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

                                {/* Terms and Submit */}
                                <div className="flex gap-4 justify-between items-center pt-4">
                                    <p className="text-sm text-primary text-right">
                                        <Link to="/terms" className="text-primary underline">
                                            العودة إلى عربة التسوق
                                        </Link>
                                    </p>
                                    <Button 
                                        type="submit"
                                        className="px-5 py-7 bg-secondary rounded-xl hover:bg-[#0090c7] text-white text-lg"
                                    >
                                        إتمام عملية الشراء
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
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b">
                                        <div className="flex-1 text-right">
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-600">EGP{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 border rounded">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-100"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-3 font-medium">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-100"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-14 h-14 object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between text-gray-600">
                                    <span>EGP{subtotal.toFixed(2)}</span>
                                    <span>المجموع الفرعي</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>EGP{shippingFee.toFixed(2)}</span>
                                    <span>رسوم الشحن</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                                    <span>EGP{total.toFixed(2)}</span>
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