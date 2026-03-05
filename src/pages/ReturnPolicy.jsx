import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Clock, Package, HelpCircle, CheckCircle2 } from 'lucide-react';

const ReturnPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('return_policy.title')}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed">
                        {t('return_policy.welcome')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Important Note */}
                    <div className="bg-secondary/10 border-s-4 border-secondary p-6 rounded-r-xl mb-12 shadow-sm">
                        <div className="flex items-start gap-4">
                            <Clock className="text-secondary flex-shrink-0 mt-1" size={24} />
                            <p className="text-gray-800 font-medium leading-relaxed">
                                {t('return_policy.important')}
                            </p>
                        </div>
                    </div>

                    {/* Section 1: General Conditions */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-secondary" size={28} />
                            {t('return_policy.general_conditions_title')}
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">{t('return_policy.condition_48h')}</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ps-4">
                                    <li>{t('return_policy.condition_48h_item')}</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">{t('return_policy.condition_opinion')}</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ps-4">
                                    <li>{t('return_policy.condition_opinion_item')}</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">{t('return_policy.condition_manufacturing')}</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ps-4">
                                    {t('return_policy.condition_manufacturing_items', { returnObjects: true }).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Return Periods */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Clock className="text-secondary" size={28} />
                            {t('return_policy.periods_title')}
                        </h2>
                        <p className="text-gray-700 mb-4">{t('return_policy.periods_desc')}</p>
                        <ul className="space-y-4 ps-4">
                            {t('return_policy.periods_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-800 font-medium">
                                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 3: Non-Returnable */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8 border-t-4 border-red-500">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Package className="text-red-500" size={28} />
                            {t('return_policy.non_returnable_title')}
                        </h2>
                        <p className="text-gray-700 mb-4">{t('return_policy.non_returnable_desc')}</p>
                        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-4 text-red-700">
                            <HelpCircle size={20} className="flex-shrink-0" />
                            <p className="font-semibold">{t('return_policy.non_returnable_item')}</p>
                        </div>
                    </section>

                    {/* Section 4: Process */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                            <CheckCircle2 className="text-secondary" size={28} />
                            {t('return_policy.how_to_start_title')}
                        </h2>
                        <p className="text-gray-700 mb-8">{t('return_policy.how_to_start_desc')}</p>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:md:left-8 before:w-0.5 before:bg-gray-100 before:z-0">
                            {t('return_policy.steps', { returnObjects: true }).map((step, index) => (
                                <div key={index} className="relative z-10 flex gap-6 md:gap-10">
                                    <div className="bg-primary text-white w-8 md:w-16 h-8 md:h-16 rounded-full flex items-center justify-center shrink-0 font-bold text-xl shadow-lg border-4 border-white">
                                        {index + 1}
                                    </div>
                                    <div className="pt-1 md:pt-4">
                                        <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                                        <p className="text-gray-700 leading-relaxed text-lg">{step.text}</p>
                                    </div>
                                </div>
                            ))}
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

export default ReturnPolicy;
