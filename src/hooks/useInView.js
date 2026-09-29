import { useEffect, useRef, useState } from 'react';

/**
 * True once the element has come within `rootMargin` of the viewport (and stays true).
 * Used to reveal home sections as they scroll in and to delay below-the-fold requests
 * until the section is about to be seen. Without IntersectionObserver it is true at once.
 */
export default function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0 } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

    useEffect(() => {
        const node = ref.current;
        if (inView || !node) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [inView, rootMargin, threshold]);

    return [ref, inView];
}
