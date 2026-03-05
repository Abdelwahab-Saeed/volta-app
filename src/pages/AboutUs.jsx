import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';

const AboutUs = () => {
    const { t } = useTranslation();

    const iconMap = [
        <ShieldCheck className="text-secondary" size={40} />,
        <Zap className="text-secondary" size={40} />,
        <Users className="text-secondary" size={40} />,
        <TrendingUp className="text-secondary" size={40} />,
        <Zap className="text-secondary" size={40} />,
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('about_us.title')}
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 opacity-90">
                        {t('about_us.subtitle')}
                    </h2>
                    <p className="max-w-4xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed mb-8">
                        {t('about_us.description')}
                    </p>
                </div>
            </div>

            {/* Vision & Mission Summary */}
            <div className="container mx-auto px-4 -mt-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="bg-secondary/10 p-2 rounded-lg">
                                <TrendingUp className="text-secondary" size={24} />
                            </span>
                            {t('about_us.vision_title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {t('about_us.vision_text')}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="bg-secondary/10 p-2 rounded-lg">
                                <ShieldCheck className="text-secondary" size={24} />
                            </span>
                            {t('about_us.mission_title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {t('about_us.mission_text')}
                        </p>
                    </div>
                </div>
            </div>

            {/* What We Offer Section */}
            <div className="container mx-auto px-4 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                        {t('about_us.what_we_offer_title')}
                    </h2>
                    <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t('about_us.what_we_offer_items', { returnObjects: true }).map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex items-start gap-4">
                            <div className="bg-primary/5 p-3 rounded-full flex-shrink-0">
                                <Zap className="text-secondary" size={24} />
                            </div>
                            <p className="text-gray-800 font-medium pt-1">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Volta Section */}
            <div className="bg-primary text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            {t('about_us.why_volta_title')}
                        </h2>
                        <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t('about_us.why_volta_items', { returnObjects: true }).map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors">
                                <ShieldCheck className="text-secondary flex-shrink-0" size={32} />
                                <span className="text-xl font-semibold">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Clients Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-primary mb-6">
                        {t('about_us.our_clients_title')}
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        {t('about_us.our_clients_text')}
                    </p>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-primary text-white p-10 md:w-1/3 flex flex-col justify-center text-center">
                            <h3 className="text-2xl font-bold mb-4">{t('about_us.contact_us_title')}</h3>
                            <Users size={48} className="mx-auto text-secondary mb-4" />
                        </div>
                        <div className="p-10 md:w-2/3">
                            <p className="text-gray-700 mb-8 text-lg">
                                {t('about_us.contact_us_text')}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary font-bold text-xl">
                                    <Zap className="text-secondary" size={24} />
                                    <span>{t('about_us.hotline')}</span>
                                </div>
                                <div className="flex items-start gap-4 text-gray-700">
                                    <ShieldCheck className="text-secondary flex-shrink-0 mt-1" size={24} />
                                    <span className="leading-relaxed">{t('about_us.address')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
