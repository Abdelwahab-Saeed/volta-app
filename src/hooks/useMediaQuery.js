import { useEffect, useState } from 'react';

/** True while the CSS media query matches; updates when the screen changes (rotation, resize). */
export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches,
    );

    useEffect(() => {
        const media = window.matchMedia?.(query);
        if (!media) return undefined;
        const onChange = () => setMatches(media.matches);
        onChange();
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, [query]);

    return matches;
}
