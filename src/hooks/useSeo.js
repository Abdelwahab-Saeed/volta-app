import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.volta-eg.com';
const SITE_NAME = 'Volta';

/**
 * Updates the document's SEO tags in place.
 *
 * Deliberately imperative rather than React 19's native <title>/<meta>
 * hoisting: index.html ships defaults so that crawlers which do not execute
 * JavaScript still get a title and description, and when two <title> elements
 * exist the browser uses the first one. Rewriting the existing tags avoids
 * that ambiguity entirely and never leaves duplicates behind.
 */
export default function useSeo({
    title,
    description,
    image,
    type = 'website',
    canonical,
    noindex = false,
} = {}) {
    const { pathname } = useLocation();

    useEffect(() => {
        const url = SITE_URL + (canonical ?? pathname);
        // Home passes no suffix; every other page reads "Page | Volta".
        const fullTitle = title
            ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
            : document.title;

        if (title) document.title = fullTitle;

        upsert('meta', 'name', 'description', 'content', description);
        upsert('meta', 'property', 'og:title', 'content', fullTitle);
        upsert('meta', 'property', 'og:description', 'content', description);
        upsert('meta', 'property', 'og:url', 'content', url);
        upsert('meta', 'property', 'og:type', 'content', type);
        upsert('meta', 'property', 'og:image', 'content', image);
        upsert('link', 'rel', 'canonical', 'href', url);

        if (noindex) {
            upsert('meta', 'name', 'robots', 'content', 'noindex, nofollow');
        } else {
            // Leaving a stale noindex behind would quietly deindex the site.
            document.head.querySelector('meta[name="robots"]')?.remove();
        }
    }, [pathname, canonical, title, description, image, type, noindex]);
}

function upsert(tagName, keyAttr, keyValue, valueAttr, value) {
    if (value == null || value === '') return;

    let el = document.head.querySelector(`${tagName}[${keyAttr}="${keyValue}"]`);
    if (!el) {
        el = document.createElement(tagName);
        el.setAttribute(keyAttr, keyValue);
        document.head.appendChild(el);
    }
    el.setAttribute(valueAttr, value);
}
