import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { baseLanguage } from '@/i18n';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = baseLanguage(i18n.language) === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-2"
        >
            <Globe className="w-4 h-4" />
            <span className="font-medium">
                {baseLanguage(i18n.language) === 'ar' ? 'English' : 'العربية'}
            </span>
        </Button>
    );
}
