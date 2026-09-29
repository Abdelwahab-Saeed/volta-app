import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SafeImage from '../common/SafeImage';
import useApiList from '@/hooks/useApiList';
import { getPartners } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';
import { Handshake, Users, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── single logo tile ─────────────────────────────────────────── */
function LogoTile({ partner }) {
  const tr = useLocalize();
  const name = tr(partner, 'name');

  const inner = (
    <div className="partners-tile group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
      style={{ width: 160, minWidth: 160, height: 110 }}
    >
      <div className="flex h-14 w-full items-center justify-center">
        <SafeImage
          src={`${import.meta.env.VITE_IMAGES_URL}/${partner.logo}`}
          alt={name}
          title={name}
          className="max-h-full max-w-[80%] object-contain grayscale opacity-60 transition-all duration-400 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
        />
      </div>
      <p className="w-full text-center text-[11px] font-semibold text-slate-400 transition-colors duration-300 group-hover:text-primary line-clamp-1">
        {name}
      </p>
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
        className="block shrink-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {inner}
      </a>
    );
  }
  return <div className="shrink-0">{inner}</div>;
}

/* ─── scroll row with arrows ───────────────────────────────────── */
function LogoSlider({ partners }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="flex-none flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md active:scale-95"
        aria-label="scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth partners-track"
        style={{ scrollbarWidth: 'none' }}
      >
        {partners.map((partner) => (
          <LogoTile key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => scroll(1)}
        className="flex-none flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md active:scale-95"
        aria-label="scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ─── section ──────────────────────────────────────────────────── */
export default function PartnersSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getPartners);
  const [activeTab, setActiveTab] = useState('all');

  if (items.length === 0) return null;

  const partners = items.filter((item) => item.type !== 'client');
  const clients  = items.filter((item) => item.type === 'client');
  const showTabs = partners.length > 0 && clients.length > 0;

  const tabs = [
    { key: 'all',      label: t('home.partners.title'),          icon: Building2, list: items },
    { key: 'partners', label: t('home.partners.partners_label'), icon: Handshake, list: partners },
    { key: 'clients',  label: t('home.partners.clients_label'),  icon: Users,     list: clients },
  ].filter((tab) => tab.list.length > 0);

  const visible = tabs.find((tab) => tab.key === activeTab)?.list ?? items;

  return (
    <>
      <style>{`
        .partners-track::-webkit-scrollbar { display: none; }
        .partners-tile {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .partners-tile:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -12px rgba(35,48,116,0.18);
          border-color: rgba(35,48,116,0.25);
        }
      `}</style>

      <section
        aria-labelledby="home-partners"
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#f1f5f9 60%,#f8fafc 100%)' }}
      >
        {/* top stripe */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1"
          style={{ background: 'linear-gradient(to right,transparent,#233074 30%,#233074 70%,transparent)' }} />

        {/* ── Heading ── */}
        <div className="mb-10 md:mb-12 px-6 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
            style={{ background: 'linear-gradient(135deg,#233074,#3b5bdb)' }}>
            <Handshake className="h-7 w-7 text-white" />
          </div>
          <p className="mb-2 text-xs md:text-sm font-bold tracking-widest uppercase" style={{ color: '#233074' }}>
            {t('home.partners.eyebrow')}
          </p>
          <h2 id="home-partners" className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-primary">
            {t('home.partners.title')}
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {t('home.partners.subtitle')}
          </p>

          {/* stat pills */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3">
            {partners.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-bold text-primary">
                <Handshake className="h-3.5 w-3.5" /> {partners.length}+ {t('home.partners.partners_label')}
              </span>
            )}
            {clients.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-bold text-slate-600">
                <Users className="h-3.5 w-3.5" /> {clients.length}+ {t('home.partners.clients_label')}
              </span>
            )}
          </div>
        </div>

        {/* ── Tab bar ── */}
        {showTabs && (
          <div className="mb-6 flex items-center justify-center px-4">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm gap-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" onClick={() => setActiveTab(key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Single-line slider ── */}
        <div className="px-4 md:px-8">
          <LogoSlider key={activeTab} partners={visible} />
        </div>

        {/* bottom stripe */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-1"
          style={{ background: 'linear-gradient(to right,transparent,#233074 30%,#233074 70%,transparent)' }} />
      </section>
    </>
  );
}
