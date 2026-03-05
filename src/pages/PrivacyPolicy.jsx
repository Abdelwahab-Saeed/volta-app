import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Database, Eye, Share2, Lock, UserCheck, PhoneCall } from 'lucide-react';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('privacy_policy.title')}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed">
                        {t('privacy_policy.welcome')}
                    </p>
                    <p className="mt-4 text-sm opacity-75">
                        {t('privacy_policy.last_updated')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Section 1: Data Collection */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Database className="text-secondary" size={28} />
                            {t('privacy_policy.collect_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('privacy_policy.collect_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-800">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 2: Data Usage */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Eye className="text-secondary" size={28} />
                            {t('privacy_policy.use_title')}
                        </h2>
                        <p className="text-gray-700 mb-4">{t('privacy_policy.use_desc')}</p>
                        <ul className="space-y-4 ps-4">
                            {t('privacy_policy.use_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-800">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 3: Data Sharing */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Share2 className="text-secondary" size={28} />
                            {t('privacy_policy.share_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('privacy_policy.share_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-800">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 4: Data Security */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Lock className="text-secondary" size={28} />
                            {t('privacy_policy.security_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('privacy_policy.security_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-800">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 5: Your Rights */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <UserCheck className="text-secondary" size={28} />
                            {t('privacy_policy.rights_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('privacy_policy.rights_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-800">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Contact Us */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <PhoneCall className="text-secondary" size={28} />
                            {t('privacy_policy.contact_us_title')}
                        </h2>
                        <p className="text-gray-700 mb-6">{t('privacy_policy.contact_us_text')}</p>
                        <div className="space-y-4 text-lg">
                            <div className="flex items-center gap-3 text-primary font-semibold">
                                <PhoneCall className="text-secondary" size={24} />
                                <span>{t('privacy_policy.hotline')}</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-700">
                                <div className="mt-1">
                                    {/* Location icon placeholder if needed */}
                                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                    </div>
                                </div>
                                <span>{t('privacy_policy.address')}</span>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="text-center py-10 bg-primary text-white rounded-2xl shadow-xl">
                        <ShieldCheck className="mx-auto text-secondary mb-4" size={48} />
                        <h3 className="text-2xl font-bold italic">
                            {t('return_policy.footer_note')}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
