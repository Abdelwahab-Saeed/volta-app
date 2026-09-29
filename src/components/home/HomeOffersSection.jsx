import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowLeft } from 'lucide-react';
import { getAllOffers } from '@/api/offers.api';
import SafeImage from '@/components/common/SafeImage';
import { OFFER_BADGE, imageUrl, useCountdown, shortCountdownLabel } from '@/components/offers/offerUtils';
import OfferPlaceholder from '@/components/offers/OfferPlaceholder';

function Countdown({ expiresAt }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(expiresAt, 60000);
    const label = shortCountdownLabel(timeLeft, t);
    if (!label) return null;
    return (
        <span className="flex items-center gap-1 text-secondary-on-dark text-xs font-bold">
            <Clock className="w-3 h-3" />{label}
        </span>
    );
}

export default function HomeOffersSection() {
    const { t, i18n } = useTranslation();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Offer texts come localized from the API, so refetch when the language changes
    // (the current cards stay on screen until the new ones arrive).
    useEffect(() => {
        let cancelled = false;
        getAllOffers()
            .then(res => { if (!cancelled) setOffers(res.data?.data?.slice(0, 4) || []); })
            .catch(() => { if (!cancelled) setOffers([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [i18n.language]);

    if (!loading && offers.length === 0) return null;

    return (
        <section className="py-10">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary">
                        {t('offers.title')}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{t('offers.home_subtitle')}</p>
                </div>
                <Link
                    to="/offers"
                    className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:underline"
                >
                    {t('offers.view_all')}
                    <ArrowLeft className="w-4 h-4 ltr:rotate-180" />
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {offers.map(offer => {
                        return (
                            <Link
                                key={offer.id}
                                to={`/offers/${offer.id}`}
                                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[180px] flex flex-col"
                            >
                                {/* Background */}
                                {offer.image ? (
                                    <SafeImage
                                        src={imageUrl(offer.image)}
                                        alt={offer.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <OfferPlaceholder />
                                )}

                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full p-4">
                                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold ${OFFER_BADGE} mb-auto`}>
                                        {offer.display.type_label}
                                    </span>

                                    <div className="mt-auto">
                                        <h3 className="text-white font-black text-base leading-tight mb-1 line-clamp-2">
                                            {offer.name}
                                        </h3>
                                        <p className="text-white/80 text-xs mb-2 line-clamp-2">
                                            {offer.display.summary}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Countdown expiresAt={offer.expires_at} />
                                            <span className="text-white text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                                {t('offers.explore')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
