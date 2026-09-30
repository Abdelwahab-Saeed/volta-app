import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowLeft } from 'lucide-react';
import SectionHeading from './SectionHeading';
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
        <section aria-labelledby="home-offers" className="py-10 md:py-14">
            <SectionHeading
                id="home-offers"
                eyebrow={t('home.offers.eyebrow')}
                title={t('offers.title')}
                subtitle={t('offers.home_subtitle')}
                action={{ to: '/offers', label: t('offers.view_all') }}
            />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[4/3] sm:aspect-[3/4] rounded-2xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {offers.map(offer => {
                        return (
                            <Link
                                key={offer.id}
                                to={`/offers/${offer.id}`}
                                className="group relative aspect-[4/3] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_14px_40px_-22px_rgba(30,39,73,0.55)] hover:shadow-[0_24px_50px_-20px_rgba(30,39,73,0.6)] transition-all duration-300 hover:-translate-y-1 flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
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

                                {/* Navy fade from the bottom keeps the text readable on any image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/5 opacity-95 transition-opacity group-hover:opacity-100" />

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full p-4 md:p-5">
                                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold ${OFFER_BADGE} mb-auto`}>
                                        {offer.display.type_label}
                                    </span>

                                    <div className="mt-auto">
                                        <h3 className="text-white font-black text-lg leading-tight mb-1.5 line-clamp-2">
                                            {offer.name}
                                        </h3>
                                        <p className="text-white/85 text-sm mb-3 line-clamp-2">
                                            {offer.display.summary}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Countdown expiresAt={offer.expires_at} />
                                            <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary transition-colors group-hover:bg-secondary-on-dark group-hover:text-white">
                                                {t('offers.explore')}
                                                <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5 ltr:rotate-180" />
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
