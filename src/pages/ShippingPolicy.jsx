import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, Phone } from 'lucide-react';

const ShippingPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('shipping_policy.title')}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 mb-4">
                        {t('shipping_policy.last_updated')}
                    </p>
                    <p className="max-w-4xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed">
                        {t('shipping_policy.description')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Shipping Scope */}
                    <section className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <MapPin className="text-secondary" size={28} />
                            {t('shipping_policy.scope_title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {t('shipping_policy.scope_desc')}
                        </p>
                    </section>

                    {/* Order Processing Time */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Clock className="text-secondary" size={28} />
                            {t('shipping_policy.processing_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('shipping_policy.processing_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Delivery Time */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <Truck className="text-secondary" size={28} />
                            {t('shipping_policy.delivery_time_title')}
                        </h2>
                        <p className="text-gray-700 mb-6 text-lg">{t('shipping_policy.delivery_time_desc')}</p>
                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                            <p className="text-primary font-bold text-xl leading-relaxed">
                                {t('shipping_policy.delivery_time_estimate')}
                            </p>
                        </div>
                    </section>

                    {/* Shipping Fees */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-secondary" size={28} />
                            {t('shipping_policy.fees_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('shipping_policy.fees_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order Confirmation */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <Phone className="text-secondary" size={28} />
                            {t('shipping_policy.confirmation_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('shipping_policy.confirmation_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Receiving the Order */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-secondary" size={28} />
                            {t('shipping_policy.receiving_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('shipping_policy.receiving_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Shipping Delays */}
                    <section className="bg-white p-8 rounded-2xl shadow-md border-s-4 border-amber-500">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <AlertCircle className="text-amber-500" size={28} />
                            {t('shipping_policy.delays_title')}
                        </h2>
                        <p className="text-gray-700 mb-6 text-lg">{t('shipping_policy.delays_desc')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {t('shipping_policy.delays_items', { returnObjects: true }).map((item, index) => (
                                <div key={index} className="bg-amber-50 p-4 rounded-lg text-amber-900 font-medium">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600 italic">{t('shipping_policy.delays_footer')}</p>
                    </section>

                    {/* Shipping Address */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                            <MapPin className="text-secondary" size={28} />
                            {t('shipping_policy.address_title')}
                        </h2>
                        <ul className="space-y-4 ps-4">
                            {t('shipping_policy.address_items', { returnObjects: true }).map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Contact Section */}
                    <div className="bg-primary text-white p-10 rounded-2xl shadow-xl text-center">
                        <h3 className="text-2xl font-bold mb-4">{t('shipping_policy.contact_us_title')}</h3>
                        <p className="text-xl opacity-90 mb-8">{t('shipping_policy.contact_us_text')}</p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            <div className="flex items-center gap-3">
                                <Phone className="text-secondary" size={24} />
                                <span className="text-2xl font-bold">01222245464</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-secondary" size={24} />
                                <span className="text-lg opacity-80">{t('footer.location')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
