import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCart as updateCartApi } from '@/api/cart.api';
import { toast } from 'sonner';

export const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    // Fetch cart when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        setCartLoading(true);
        try {
            const response = await getCart();
            // Handle different API response structures
            const items = response.data.items || response.data.data || response.data || [];
            setCartItems(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setCartLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            toast.error('يجب تسجيل الدخول لإضافة منتجات للسلة');
            return;
        }

        try {
            await addToCartApi({ product_id: product.id, quantity });
            toast.success('تم إضافة المنتج للسلة');
            await fetchCart();
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('فشل إضافة المنتج للسلة');
        }
    };

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            // Optimistic update
            const updatedItems = cartItems.map(i =>
                i.id === cartItemId ? { ...i, quantity: newQuantity } : i
            );
            setCartItems(updatedItems);

            // Call API with the absolute new quantity
            await updateCartApi(cartItemId, { quantity: newQuantity });

            // Refresh cart to ensure sync
            await fetchCart();

        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error('فشل تحديث الكمية');
            await fetchCart(); // Revert on failure
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await removeFromCartApi(cartItemId);
            // Optimistic update or refetch
            const newItems = cartItems.filter(item => item.id !== cartItemId && item.product_id !== cartItemId);
            setCartItems(newItems);
            toast.success('تم حذف المنتج من السلة');
            await fetchCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error('فشل حذف المنتج من السلة');
        }
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.product_id === productId || item.id === productId);
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            cartLoading,
            addToCart,
            updateCartItemQuantity,
            removeFromCart,
            isInCart,
            cartCount,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
}
