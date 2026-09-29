import { useTranslation } from 'react-i18next';
import { Linkedin } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import useApiList from '@/hooks/useApiList';
import { getTeam } from '@/api/company.api';
import { useLocalize } from '@/lib/localize';

/**
 * Avatar letters when there is no photo: "Ahmed Mohamed" -> "AM". Arabic names get only the first
 * letter, because two isolated Arabic letters side by side read badly.
 */
function initials(name) {
  const words = name.trim().split(/\s+/);
  if (/[؀-ۿ]/.test(name)) return words[0].charAt(0);
  return words.slice(0, 2).map((word) => word.charAt(0)).join('').toUpperCase();
}

function MemberCard({ member }) {
  const { t } = useTranslation();
  const tr = useLocalize();
  const name = tr(member, 'name');
  const role = tr(member, 'role');
  const bio = tr(member, 'bio');

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-24px_rgba(30,39,73,0.5)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary">
        {member.photo ? (
          <SafeImage
            src={`${import.meta.env.VITE_IMAGES_URL}/${member.photo}`}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Same navy + blue glow as OfferPlaceholder, with the person's initials.
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-1/4 -end-1/4 h-3/4 w-3/4 rounded-full bg-secondary-on-dark/25 blur-3xl" />
            <div className="absolute -bottom-1/4 -start-1/4 h-2/3 w-2/3 rounded-full bg-secondary/20 blur-3xl" />
            <span className="relative text-5xl md:text-6xl font-black text-white/90">{initials(name)}</span>
          </div>
        )}
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('home.team.linkedin', { name })}
            className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition-colors hover:bg-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="p-4 md:p-5 text-center">
        <h3 className="text-base md:text-lg font-black text-primary leading-snug">{name}</h3>
        {role && <p className="mt-1 text-sm font-bold text-secondary">{role}</p>}
        {bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{bio}</p>}
      </div>
    </article>
  );
}

export default function TeamSection() {
  const { t } = useTranslation();
  const { items } = useApiList(getTeam);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="home-team" className="py-10 md:py-14">
      <SectionHeading
        id="home-team"
        align="center"
        eyebrow={t('home.team.eyebrow')}
        title={t('home.team.title')}
        subtitle={t('home.team.subtitle')}
      />

      {/* Centred rows so 1-3 people don't hug one side */}
      <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
        {items.map((member, index) => (
          <Reveal
            as="li"
            key={member.id}
            delay={Math.min(index, 3) * 80}
            className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <MemberCard member={member} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
