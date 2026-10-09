import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check, Heart, ArrowLeftRight } from 'lucide-react';
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLocalize } from '@/lib/localize';
import SafeImage from './common/SafeImage';
import { trackEvent } from '@/lib/pixel';

const NAME_PREVIEW_LENGTH = 30;

export default function SmallProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
  const isInComparison = useComparisonStore((state) => state.isInComparison(product.id));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdded = cartItems.some(item => item.product_id === product.id);
  const [addingStr, setAddingStr] = useState(false);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const tr = useLocalize();
  // Long names are cut so every card in a row keeps the same height; "show more" reveals the rest.
  const [nameExpanded, setNameExpanded] = useState(false);
  const name = tr(product, 'name') || '';
  const isLongName = name.length > NAME_PREVIEW_LENGTH;
  const shownName = isLongName && !nameExpanded ? `${name.slice(0, NAME_PREVIEW_LENGTH).trimEnd()}…` : name;
  // final_price is the selling price the API resolved (discount_price is 0, not null, when there is no discount).
  const hasDiscount = product.final_price < product.price;
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t('messages.login_required_wishlist'));
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product);
    } catch (error) {
      // Handled in store
    }
  };

  const handleComparisonToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t('messages.login_required_compare'));
      navigate('/login');
      return;
    }
    try {
      if (isInComparison) {
        await removeFromComparison(product.id);
      } else {
        await addToComparison(product);
      }
    } catch (error) {
      // Errors handled in store
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAdded) return;

    setAddingStr(true);
    await addToCart(product);
    trackEvent('AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'EGP'
    });
    setAddingStr(false);
  };

  return (
    <Card className="h-full overflow-hidden border">
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="relative mb-4 overflow-hidden border-b">
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <button
              onClick={handleWishlistToggle}
              aria-label={t(isInWishlist ? 'a11y.remove_from_wishlist' : 'a11y.add_to_wishlist')}
              aria-pressed={isInWishlist}
              className={`p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isInWishlist ? 'text-red-500' : 'hover:text-red-500'
                }`}
            >
              <Heart size={14} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleComparisonToggle}
              aria-label={t(isInComparison ? 'a11y.remove_from_compare' : 'a11y.add_to_compare')}
              aria-pressed={isInComparison}
              className={`p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isInComparison ? 'text-primary' : 'hover:text-primary'
                }`}
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>
          <Link to={`/product/${product.id}`}>
            <SafeImage
              src={`${import.meta.env.VITE_IMAGES_URL}/${product.image}`}
              alt={tr(product, 'name')}
              className="w-full h-full object-contain transition-transform hover:scale-110 duration-500"
            />
          </Link>
        </div>
        {/* The carousel forces dir="ltr", so the name takes the page direction back. min-h keeps two lines reserved. */}
        <h3 dir={i18n.dir()} className="text-sm font-medium mb-2 min-h-10 text-start">
          <Link to={`/product/${product.id}`} className="hover:text-secondary transition-colors">
            {shownName}
          </Link>
          {isLongName && (
            <button
              type="button"
              onClick={() => setNameExpanded((expanded) => !expanded)}
              aria-expanded={nameExpanded}
              className="ms-1 text-xs font-semibold text-secondary hover:underline"
            >
              {t(nameExpanded ? 'product.show_less' : 'product.show_more')}
            </button>
          )}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-red-600">
            {product.final_price?.toLocaleString()} {t('common.currency')}
          </p>
          {hasDiscount ? (
            <p className="text-md text-slate-400 line-through mr-2">{product.price?.toLocaleString()} {t('common.currency')}</p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={addingStr || isAdded}
            className={`w-full h-10 text-white ${isAdded
              ? "bg-green-500 hover:bg-green-600 cursor-default"
              : "bg-[#31A0D3] hover:bg-[#0058AB]"
              }`}
          >
            <div className="flex gap-2 justify-center items-center">
              {addingStr ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isAdded ? (
                <>
                  <p className="text-lg">{t('product.added')}</p>
                  <Check />
                </>
              ) : (
                <>
                  <p className="text-lg">{t('product.add_to_cart')}</p>
                  <ShoppingCart />
                </>
              )}
            </div>
          </Button>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              setAddingStr(true);
              try {
                await addToCart(product);
                // trackEvent('InitiateCheckout', {
                //   content_ids: [product.id],
                //   content_type: 'product',
                //   value: product.price,
                //   currency: 'EGP'
                // });
                navigate('/checkout');
              } catch (error) {
                console.error(error);
              } finally {
                setAddingStr(false);
              }
            }}
            disabled={addingStr}
            className="w-full h-10 text-white bg-secondary hover:bg-[#0090c7]"
          >
            <span className="text-lg">{t('product.buy_now')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
