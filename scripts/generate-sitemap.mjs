// Writes public/sitemap.xml from the static routes plus every live product and
// category from the API.
//
//   node scripts/generate-sitemap.mjs
//
// Run it before a deploy whenever the catalogue changes. It is deliberately NOT
// wired into `npm run build`: a build should not fail or silently ship an empty
// sitemap because the API happened to be down.
//
// If the API is unreachable the existing public/sitemap.xml is left untouched
// and the script exits non-zero.

import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = 'https://www.volta-eg.com';
const API = process.env.VITE_API_URL || 'https://api.volta-eg.com/api';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = join(root, 'public', 'sitemap.xml');

// Public, indexable routes only. Cart, checkout, auth and the account area are
// excluded here and disallowed in robots.txt.
const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/products', priority: '0.9', changefreq: 'daily' },
    { path: '/about-us', priority: '0.6', changefreq: 'monthly' },
    { path: '/vision', priority: '0.5', changefreq: 'yearly' },
    { path: '/blog', priority: '0.6', changefreq: 'weekly' },
    { path: '/return-policy', priority: '0.3', changefreq: 'yearly' },
    { path: '/shipping-policy', priority: '0.3', changefreq: 'yearly' },
    { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
];

const getJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    return res.json();
};

const unwrap = (payload) => {
    const data = payload?.data;
    if (Array.isArray(data)) return data;
    return data?.items ?? [];
};

const fetchAllProducts = async () => {
    const all = [];
    let page = 1;
    let totalPages = 1;

    do {
        const payload = await getJson(`${API}/products?page=${page}&limit=100`);
        all.push(...unwrap(payload));
        totalPages = payload?.data?.pagination?.total_pages ?? 1;
        page += 1;
    } while (page <= totalPages && page < 100); // hard stop; never loop forever

    return all;
};

const xmlEscape = (s) =>
    String(s).replace(/[<>&'"]/g, (c) =>
        ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]
    );

const urlEntry = ({ loc, priority, changefreq, lastmod }) =>
    [
        '    <url>',
        `        <loc>${xmlEscape(loc)}</loc>`,
        lastmod ? `        <lastmod>${lastmod}</lastmod>` : null,
        changefreq ? `        <changefreq>${changefreq}</changefreq>` : null,
        priority ? `        <priority>${priority}</priority>` : null,
        '    </url>',
    ]
        .filter(Boolean)
        .join('\n');

try {
    const today = new Date().toISOString().slice(0, 10);

    const [products, categories] = await Promise.all([
        fetchAllProducts(),
        getJson(`${API}/categories`).then(unwrap),
    ]);

    const entries = [
        ...staticRoutes.map((r) => ({ loc: SITE + r.path, ...r, lastmod: today })),
        ...categories
            .filter((c) => c?.id != null)
            .map((c) => ({
                loc: `${SITE}/products?category=${c.id}`,
                priority: '0.7',
                changefreq: 'weekly',
                lastmod: today,
            })),
        ...products
            .filter((p) => p?.id != null)
            .map((p) => ({
                loc: `${SITE}/product/${p.id}`,
                priority: '0.8',
                changefreq: 'weekly',
                lastmod: today,
            })),
    ];

    const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        entries.map(urlEntry).join('\n') +
        '\n</urlset>\n';

    writeFileSync(outFile, xml, 'utf8');

    console.log(`wrote ${outFile}`);
    console.log(
        `  ${staticRoutes.length} static  ${categories.length} categories  ${products.length} products  = ${entries.length} URLs`
    );
} catch (error) {
    console.error('sitemap generation failed:', error.message);
    console.error(
        existsSync(outFile)
            ? '  existing public/sitemap.xml left unchanged'
            : '  no sitemap written'
    );
    process.exit(1);
}
