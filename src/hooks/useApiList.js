import { useEffect, useState } from 'react';

/**
 * Loads a list once from `fetcher`, which must return an axios promise of `{ data: { data: [...] } }`
 * (the API's success envelope). Returns `{ items, loading }`; a failed request gives an empty list.
 * Keep `fetcher` stable (a module-level function), or it refetches on every render.
 */
export default function useApiList(fetcher) {
    const [state, setState] = useState({ items: [], loading: true });

    useEffect(() => {
        let cancelled = false;

        fetcher()
            .then((res) => {
                if (!cancelled) setState({ items: Array.isArray(res.data?.data) ? res.data.data : [], loading: false });
            })
            .catch(() => {
                if (!cancelled) setState({ items: [], loading: false });
            });

        return () => { cancelled = true; };
    }, [fetcher]);

    return state;
}
