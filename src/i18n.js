import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGUAGES = ['ar', 'en'];
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/** Strip any region suffix: "ar-EG" -> "ar". */
export const baseLanguage = (lng) =>
    String(lng || '').split('-')[0].toLowerCase();

export const isRTL = (lng) => RTL_LANGUAGES.includes(baseLanguage(lng));

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        fallbackLng: 'en',
        // Browsers report regional tags - an Egyptian visitor sends "ar-EG",
        // not "ar". Without these three options i18n.language stayed "ar-EG",
        // and every `language === 'ar'` check in the app silently evaluated
        // false, flipping Arabic users to LTR.
        supportedLngs: SUPPORTED_LANGUAGES,
        load: 'languageOnly',
        nonExplicitSupportedLngs: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// Centralized Direction Handling
const applyDirection = (lng) => {
    const base = baseLanguage(lng) || 'en';
    document.documentElement.setAttribute('dir', isRTL(base) ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', base);
};

// Run once for the language resolved during init. The bootstrap script in
// index.html has already set this before first paint; this keeps the two in
// agreement if the detector resolved something different.
applyDirection(i18n.resolvedLanguage || i18n.language);

i18n.on('languageChanged', applyDirection);

export default i18n;
