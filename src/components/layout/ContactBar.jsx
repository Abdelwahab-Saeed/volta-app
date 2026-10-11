import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, PhoneCall, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { TikTokIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useSettingsStore } from '@/stores/useSettingsStore';

const EMAIL = 'info@volta-eg.com';
const PHONE = '01222245464';
const WHATSAPP_URL = 'https://wa.me/+201025021518';

// Social networks set in the admin settings; each one only shows when it has a link.
const NETWORKS = [
  { key: 'facebook', name: 'Facebook', Icon: Facebook },
  { key: 'instagram', name: 'Instagram', Icon: Instagram },
  { key: 'twitter', name: 'X (Twitter)', Icon: Twitter },
  { key: 'youtube', name: 'YouTube', Icon: Youtube },
  { key: 'tiktok', name: 'TikTok', Icon: TikTokIcon },
];

const CONTACTS = [
  { key: 'email', href: `mailto:${EMAIL}`, label: EMAIL, Icon: Mail },
  { key: 'phone', href: `tel:+2${PHONE}`, label: PHONE, Icon: PhoneCall },
];

/* Email, phone and social links.
   - variant "bar": desktop strip under the main header (contacts at the start, socials at the end).
   - variant "menu": stacked block for the mobile hamburger menu. */
export default function ContactBar({ variant = 'bar' }) {
  const { t } = useTranslation();
  const settings = useSettingsStore((state) => state.settings);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const socials = [
    { key: 'whatsapp', name: 'WhatsApp', Icon: WhatsAppIcon, href: WHATSAPP_URL },
    ...NETWORKS.filter((n) => settings[n.key]).map((n) => ({ ...n, href: settings[n.key] })),
  ];

  const menu = variant === 'menu';

  const socialList = (
    <ul className={`flex flex-wrap items-center gap-2 ${menu ? 'min-h-10' : ''}`}>
      {socials.map((social) => {
        const Icon = social.Icon;
        return (
          <li key={social.key}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('header.social_link', { network: social.name })}
              title={social.name}
              className={`flex items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-secondary ${menu ? 'h-10 w-10' : 'h-9 w-9'}`}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (menu) {
    return (
      <div className="space-y-4">
        <ul className="space-y-1 text-sm text-primary">
          {CONTACTS.map(({ key, href, label, ...contact }) => {
            const Icon = contact.Icon;
            return (
              <li key={key}>
                <a href={href} className="flex items-center gap-3 rounded-xl py-1.5 transition-colors hover:text-secondary">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span dir="ltr">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        {socialList}
      </div>
    );
  }

  return (
    <nav aria-label={t('header.contact_bar')} className="hidden md:block border-t border-slate-200 bg-slate-50 px-4 lg:px-10">
      {/* min-h keeps the bar at its final height while the settings request is in flight */}
      <div className="flex min-h-14 items-center justify-between gap-6 py-2.5">
        <ul className="flex items-center gap-6 text-sm text-primary">
          {CONTACTS.map(({ key, href, label, ...contact }) => {
            const Icon = contact.Icon;
            return (
              <li key={key}>
                <a href={href} className="flex items-center gap-2 transition-colors hover:text-secondary">
                  <Icon size={16} className="text-secondary" aria-hidden="true" />
                  <span dir="ltr">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        {socialList}
      </div>
    </nav>
  );
}
