import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

import { ShoppingCart, Trash2, ArrowLeftRight } from "lucide-react";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useCartStore } from "@/stores/useCartStore";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function Comparison() {
    const comparisonItems = useComparisonStore((state) => state.comparisonItems);
    const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
    const addToCart = useCartStore((state) => state.addToCart);
    const [loadingIds, setLoadingIds] = useState([]);

    const handleRemove = async (id) => {
        try {
            await removeFromComparison(id);
        } catch (error) {
            // Error handled in store
        }
    };

    const handleAddToCart = async (product) => {
        setLoadingIds(prev => [...prev, product.id]);
        try {
            await addToCart(product);
            toast.success('تمت إضافة المنتج للسلة');
        } catch (error) {
            toast.error('فشل إضافة المنتج للسلة');
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== product.id));
        }
    };

    const borderStyle = `border border-secondary`;

    if (comparisonItems?.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center" dir="rtl">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ArrowLeftRight size={40} className="text-secondary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">قائمة المقارنة فارغة</h1>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    لم تقم بإضافة أي منتجات للمقارنة بعد. يمكنك إضافة حتى منتجين للمقارنة بينهما.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                >
                    تصفح المنتجات
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 overflow-x-auto" dir="rtl">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-right underline decoration-secondary decoration-4 underline-offset-8">مقارنة المنتجات</h1>
            <Table className="border-collapse border border-secondary min-w-[700px]">
                <TableBody>
                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold w-32`}>المنتج</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle}`}>
                                <div className="max-w-[180px] md:max-w-[250px] mx-auto p-4 text-center">
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-auto object-contain transition-transform hover:scale-105"
                                    />
                                    <p className="mt-4 font-bold text-primary text-sm md:text-base">{product.name}</p>
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>وصف المنتج</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} p-4`}>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed text-right line-clamp-4">
                                    {product.description || 'لا يوجد وصف متوفر لهذا المنتج حالياً.'}
                                </p>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>سعر</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} font-bold text-secondary`}>
                                EGP {product.final_price?.toLocaleString()}
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>كود المنتج</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle}`}> {product.code || 'N/A'} </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>أضف إلى العربة</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} p-4 text-center`}>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={loadingIds.includes(product.id)}
                                    className="w-full max-w-[180px] h-12 bg-secondary hover:bg-[#0058AB] text-white rounded-lg transition-colors shadow-md active:scale-95 inline-flex gap-2 justify-center items-center disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} />
                                    <span className="text-sm md:text-base font-bold">
                                        {loadingIds.includes(product.id) ? 'جاري الإضافة...' : 'أضف للسلة'}
                                    </span>
                                </button>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>حذف</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} p-4 text-center`}>
                                <button
                                    onClick={() => handleRemove(product.id)}
                                    className="hover:bg-red-50 p-2 rounded-full transition-colors group"
                                >
                                    <Trash2 className="text-gray-400 group-hover:text-red-500 transition-colors" size={28} />
                                </button>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}