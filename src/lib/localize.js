import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { baseLanguage, SUPPORTED_LANGUAGES } from '@/i18n';

/**
 * Returns the current-language value of a bilingual API field.
 *
 * The API sends `name` (resolved from Accept-Language when the request was
 * made) plus `name_ar` and `name_en`. Reading the per-language key here means
 * text follows the language switcher immediately - including data cached in
 * stores or persisted in localStorage (guest cart) - without refetching.
 *
 * Falls back to the other language when the current one is empty, then to the
 * plain field for objects cached before the API sent per-language keys.
 */
export function localize(entity, field, lng = i18n.language) {
    if (!entity || typeof entity !== 'object') return '';

    const current = baseLanguage(lng);
    const languages = [current, ...SUPPORTED_LANGUAGES.filter((language) => language !== current)];

    for (const language of languages) {
        const value = entity[`${field}_${language}`];
        if (value) return value;
    }

    return entity[field] || '';
}

/**
 * Hook form of `localize`. Subscribes the component to language changes, so
 * use this in components; the returned function changes identity when the
 * language does, which makes it safe to list as an effect dependency.
 */
export function useLocalize() {
    const { i18n: instance } = useTranslation();
    const lng = instance.language;

    return useCallback((entity, field) => localize(entity, field, lng), [lng]);
}
