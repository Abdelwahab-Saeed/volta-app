import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import stabilizer from '../assets/home/stabilizer.png';
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function Cart() {
    const { cartItems, addToCart, removeFromCart, fetchCart, updateCartItemQuantity } = useCart();

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const total = subtotal;

    // Update quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateCartItemQuantity(id, newQuantity);
    }

    // Remove item
    const removeItem = (id) => {
        removeFromCart(id);
    };

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="container mx-auto py-4 md:py-8 lg:py-20">
            <div className="flex gap-20">
                {/* Cart Table */}
                {cartItems.length > 0 ? (
                    <div className="w-9/12 bg-white shadow-sm overflow-hidden mb-6">
                        <Table className={``}>
                            <TableHeader>
                                <TableRow className="bg-gray-100 text-xl">
                                    <TableHead className="text-right px-15 font-semibold text-primary py-4">المنتج</TableHead>
                                    <TableHead className="text-right font-semibold text-primary py-4">السعر</TableHead>
                                    <TableHead className="text-right px-10 font-semibold text-primary py-4">الكمية</TableHead>
                                    <TableHead className="text-right font-semibold text-primary py-4">الإجمالي</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    aria-label="حذف المنتج"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGES_URL}/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-contain"
                                                    />
                                                </div>
                                                <span className="font-medium text-primary">{item.product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-primary">
                                            EGP{item.product.price}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="inline-flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    aria-label="تقليل الكمية"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-2 min-w-[3rem] text-center border-x border-gray-300">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    aria-label="زيادة الكمية"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-primary">
                                            EGP{(item.product.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="w-9/12 flex justify-center items-center bg-white shadow-sm overflow-hidden mb-6">
                        <div className="p-6 ">
                            <p className="text-center text-xl font-semibold text-primary">السلة فارغة</p>
                        </div>
                    </div>
                )}

                {/* Totals Section */}
                <div className="w-3/12">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-primary">المجموع الفرعي</span>
                            <span className="text-lg font-bold text-gray-400">EGP{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
                            <span className="text-lg font-bold text-primary">الإجمالي</span>
                            <span className="text-lg font-bold text-gray-400">EGP{total.toFixed(2)}</span>
                        </div>
                        <div className="w-60 mx-auto">
                            <button className="w-full bg-primary text-white p-4 hover:bg-[#152a45] transition-colors text-md">
                                إتمام الشراء
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to='/' className="underline text-primary py-3 rounded hover:bg-gray-50 transition-colors">
                                تابع عملية الشراء
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* Cart Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                {/* Coupon Section */}
                <div className="w-full md:w-auto">
                    <label className="block text-xl text-right text-primary font-bold mb-2">
                        كود الكوبون:
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="ادخل كوبون الخصم"
                            className="border border-primary px-4 py-3 text-right w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-primary text-white font-bold px-10 py-2 hover:bg-[#152a45] transition-colors">
                            تطبيق
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}