import { useEffect } from 'react';
import { useLocalize } from '@/lib/localize';

const SITE_URL = 'https://www.volta-eg.com';
const SCRIPT_ID = 'product-jsonld';

/**
 * Emits Product structured data for a product page, which is what makes Google
 * eligible to show price, availability and stock in the search result itself.
 *
 * The static Organization/WebSite graph lives in index.html; this one is
 * per-product, so it has to be injected at runtime and removed on unmount -
 * otherwise a stale product would still be described on the next page.
 */
export default function useProductJsonLd(product) {
    // Changes identity with the language, so the data is re-emitted in the
    // language the visitor switched to.
    const tr = useLocalize();

    useEffect(() => {
        if (!product?.id) return undefined;

        const price = product.final_price ?? product.price;
        const image = product.image
            ? `${import.meta.env.VITE_IMAGES_URL}/${product.image}`
            : undefined;

        const data = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: tr(product, 'name'),
            description: tr(product, 'description') || undefined,
            image: image ? [image] : undefined,
            sku: String(product.id),
            brand: { '@type': 'Brand', name: 'Volta' },
            offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/product/${product.id}`,
                priceCurrency: 'EGP',
                price: price != null ? String(price) : undefined,
                availability:
                    product.stock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                seller: { '@id': `${SITE_URL}/#organization` },
            },
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = SCRIPT_ID;
        // JSON.stringify drops the undefined values above rather than emitting
        // nulls, which schema.org validators flag.
        script.textContent = JSON.stringify(data);

        document.getElementById(SCRIPT_ID)?.remove();
        document.head.appendChild(script);

        return () => script.remove();
    }, [product, tr]);
}
