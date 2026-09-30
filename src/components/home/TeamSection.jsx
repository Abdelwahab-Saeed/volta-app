import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linkedin, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import useApiList from '@/hooks/useApiList';
import { getTeam } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';

function initials(name) {
  const words = name.trim().split(/\s+/);
  if (/[؀-ۿ]/.test(name)) return words[0].charAt(0);
  return words.slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase();
}

const AVATAR_COLORS = [
  ['#1e3a8a', '#3b82f6'],
  ['#1e3a5e', '#0ea5e9'],
  ['#312e81', '#6366f1'],
  ['#164e63', '#06b6d4'],
  ['#7c3aed', '#a78bfa'],
  ['#be123c', '#fb7185'],
];

/* ─── single member card ───────────────────────────────────────── */
function MemberCard({ member, colorIndex, active }) {
  const { t } = useTranslation();
  const tr = useLocalize();
  const name = tr(member, 'name');
  const role = tr(member, 'role');
  const bio  = tr(member, 'bio');
  const [from, to] = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <article
      className="team-card group relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white shadow-md pt-10 pb-6 px-6 text-center transition-all duration-500"
      style={{
        transform: active ? 'scale(1)' : 'scale(0.93)',
        opacity: active ? 1 : 0.55,
        boxShadow: active ? '0 24px 56px -16px rgba(30,39,73,0.22)' : 'none',
      }}
    >
      {/* Circle avatar with gradient ring */}
      <div
        className="relative mb-5 flex-none rounded-full"
        style={{
          width: 140,
          height: 140,
          padding: 4,
          background: `linear-gradient(135deg,${from},${to})`,
        }}
      >
        <div className="h-full w-full rounded-full overflow-hidden bg-slate-100">
          {member.photo ? (
            <SafeImage
              src={`${import.meta.env.VITE_IMAGES_URL}/${member.photo}`}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center"
              style={{ background: `linear-gradient(160deg,${from},${to})` }}
            >
              <span className="text-4xl font-black text-white/90 select-none">{initials(name)}</span>
            </div>
          )}
        </div>

        {/* LinkedIn badge on circle edge */}
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('home.team.linkedin', { name })}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-[#0077b5] hover:text-white"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-black text-primary leading-snug">{name}</h3>

      {/* Role pill */}
      {role && (
        <span
          className="mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
          style={{ background: `linear-gradient(90deg,${from},${to})` }}
        >
          {role}
        </span>
      )}

      {/* Bio */}
      {bio && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {bio}
        </p>
      )}

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 rounded-b-3xl"
        style={{ background: `linear-gradient(to right,${from},${to})` }}
      />
    </article>
  );
}

/* ─── section ──────────────────────────────────────────────────── */
export default function TeamSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getTeam);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const total = items.length;

  const go = useCallback((index) => {
    setCurrent((index + total) % total);
  }, [total]);

  const prev = () => go(current - 1);
  const next = useCallback(() => go(current + 1), [current, go]);

  // Auto-advance every 4 s
  useEffect(() => {
    if (total < 2) return;
    timerRef.current = setInterval(() => next(), 4000);
    return () => clearInterval(timerRef.current);
  }, [next, total]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => next(), 4000);
  };

  if (total === 0) return null;

  // Show at most 3 visible cards: prev (faded), active (center), next (faded)
  const getVisible = () => {
    if (total === 1) return [{ member: items[0], idx: 0, pos: 'center' }];
    if (total === 2) return [
      { member: items[current],                pos: 'center' },
      { member: items[(current + 1) % total],  pos: 'right'  },
    ];
    return [
      { member: items[(current - 1 + total) % total], pos: 'left'   },
      { member: items[current],                        pos: 'center' },
      { member: items[(current + 1) % total],          pos: 'right'  },
    ];
  };

  const visible = getVisible();

  return (
    <>
      <style>{`
        .team-card { transition: transform 0.5s cubic-bezier(.22,.68,0,1.2), opacity 0.5s ease, box-shadow 0.5s ease; }
      `}</style>

      <section aria-labelledby="home-team" className="bg-white py-16 md:py-24">

        {/* ── Heading ── */}
        <div className="mb-12 px-6 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm bg-primary/10">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <p className="mb-2 text-xs md:text-sm font-bold tracking-widest uppercase text-primary">
            {t('home.team.eyebrow')}
          </p>
          <h2 id="home-team" className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-primary">
            {t('home.team.title')}
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {t('home.team.subtitle')}
          </p>
        </div>

        {/* ── Carousel ── */}
        <div className="relative flex items-center justify-center gap-4 px-4 md:px-10">

          {/* Left arrow */}
          <button
            type="button"
            onClick={() => { prev(); resetTimer(); }}
            className="flex-none z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md active:scale-95"
            aria-label="previous member"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Cards row */}
          <div className="flex items-center justify-center gap-4 overflow-hidden" style={{ maxWidth: 820 }}>
            {visible.map(({ member, pos }) => (
              <div
                key={`${member.id}-${pos}`}
                className="flex-none"
                style={{
                  width: pos === 'center' ? 280 : 220,
                  transition: 'width 0.4s ease',
                }}
              >
                <MemberCard
                  member={member}
                  colorIndex={items.indexOf(member)}
                  active={pos === 'center'}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => { next(); resetTimer(); }}
            className="flex-none z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md active:scale-95"
            aria-label="next member"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* ── Dot indicators ── */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { go(i); resetTimer(); }}
                aria-label={`Go to member ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  i === current ? 28 : 8,
                  height: 8,
                  background: i === current ? '#233074' : '#cbd5e1',
                }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
