// Meta Pixel, loaded off the critical path.
//
// Previously `ReactPixel.init(...)` ran at module scope in App.jsx, so
// Facebook's fbevents.js was fetched and executed during app boot - a
// third-party script on the critical path, competing with React for the main
// thread before anything had painted.
//
// Every pixel call in the app must go through this module. A single static
// `import ReactPixel from 'react-facebook-pixel'` anywhere in the graph pulls
// the package back into the entry chunk and undoes the deferral - and because
// init() no longer runs at boot, a direct .track() call would fire before the
// pixel exists.
//
// Calls made before the pixel loads are queued and replayed on init.

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let pixelPromise = null;
let scheduled = false;
/** @type {Array<['pageView'] | ['track', string, object|undefined]>} */
const queue = [];

const loadPixel = () =>
    import('react-facebook-pixel')
        .then(({ default: ReactPixel }) => {
            ReactPixel.init(PIXEL_ID, {}, { autoConfig: true, debug: false });
            for (const call of queue.splice(0)) {
                if (call[0] === 'pageView') ReactPixel.pageView();
                else ReactPixel.track(call[1], call[2]);
            }
            return ReactPixel;
        })
        .catch((error) => {
            // An ad blocker refusing fbevents.js is routine and must never take
            // the page down with it.
            console.warn('Meta Pixel failed to load:', error?.message);
            queue.length = 0;
            return null;
        });

const scheduleLoad = () => {
    if (scheduled) return;
    scheduled = true;

    const start = () => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => { pixelPromise = loadPixel(); }, { timeout: 3000 });
        } else {
            setTimeout(() => { pixelPromise = loadPixel(); }, 1500);
        }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
};

const send = (call) => {
    // No pixel configured (local dev has no VITE_META_PIXEL_ID) - never pull
    // Facebook's script at all.
    if (!PIXEL_ID) return;

    if (pixelPromise) {
        pixelPromise.then((ReactPixel) => {
            if (!ReactPixel) return;
            if (call[0] === 'pageView') ReactPixel.pageView();
            else ReactPixel.track(call[1], call[2]);
        });
        return;
    }

    queue.push(call);
    scheduleLoad();
};

/** Record a page view. Safe to call before the pixel has loaded. */
export const trackPageView = () => send(['pageView']);

/** Record a standard Meta event, e.g. trackEvent('AddToCart', { value, currency }). */
export const trackEvent = (event, data) => send(['track', event, data]);
