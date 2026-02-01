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
import { useTranslation } from "react-i18next";
import SafeImage from "@/components/common/SafeImage";

export default function Comparison() {
    const { t } = useTranslation();
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
            toast.success(t('messages.cart_add_success', { defaultValue: 'Product added to cart' }));
        } catch (error) {
            toast.error(t('messages.cart_add_error', { defaultValue: 'Failed to add product to cart' }));
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== product.id));
        }
    };

    const borderStyle = `border border-secondary`;

    if (comparisonItems?.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ArrowLeftRight size={40} className="text-secondary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">{t('comparison.empty_title')}</h1>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {t('comparison.empty_desc')}
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                >
                    {t('comparison.browse_products')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 overflow-x-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-8 underline decoration-secondary decoration-4 underline-offset-8">
                {t('comparison.title')}
            </h1>
            <Table className="border-collapse border border-secondary min-w-[700px]">
                <TableBody>
                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold w-32`}>{t('comparison.product_label')}</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle}`}>
                                <div className="max-w-[180px] md:max-w-[250px] mx-auto p-4 text-center">
                                    <SafeImage
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
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>{t('comparison.description_label')}</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} p-4`}>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed text-right line-clamp-4">
                                    {product.description || t('comparison.no_description')}
                                </p>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>{t('comparison.price_label')}</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} font-bold text-secondary`}>
                                <span dir="ltr">{t('common.currency')} {product.final_price?.toLocaleString()}</span>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>{t('comparison.code_label')}</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle}`}> {product.code || 'N/A'} </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>{t('comparison.add_to_cart')}</TableCell>
                        {comparisonItems.map((product) => (
                            <TableCell key={product.id} className={`${borderStyle} p-4 text-center`}>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={loadingIds.includes(product.id)}
                                    className="w-full max-w-[180px] h-12 bg-secondary hover:bg-[#0058AB] text-white rounded-lg transition-colors shadow-md active:scale-95 inline-flex gap-2 justify-center items-center disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} />
                                    <span className="text-sm md:text-base font-bold">
                                        {loadingIds.includes(product.id) ? t('comparison.adding') : t('comparison.add_to_cart')}
                                    </span>
                                </button>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className={`text-center text-lg md:text-xl`}>
                        <TableCell className={`${borderStyle} bg-slate-50 font-bold`}>{t('comparison.remove')}</TableCell>
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