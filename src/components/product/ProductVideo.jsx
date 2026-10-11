import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Video } from 'lucide-react';

/* Product video under the gallery. Shows a poster with a play button and only loads the player
   iframe once the visitor asks for it, so the page doesn't download a video player up front.
   Remount it (key) when the video changes. */
export default function ProductVideo({ video, title }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);

  return (
    <section id="product-video" aria-labelledby="product-video-title" className="scroll-mt-28 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Video size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 id="product-video-title" className="text-lg font-bold leading-tight text-primary">
            {t('product.video_title')}
          </h2>
          <p className="text-sm text-slate-500">{t('product.video_subtitle')}</p>
        </div>
      </div>

      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-100 bg-primary shadow-sm ${
          video.portrait ? 'mx-auto aspect-[9/16] max-w-sm' : 'aspect-video'
        }`}
      >
        {playing ? (
          <iframe
            ref={(el) => el?.focus()}
            src={video.embedUrl}
            title={t('product.video_iframe_title', { name: title })}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t('product.play_video', { name: title })}
            className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-secondary"
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/60" />
            )}

            {/* Darken the bottom so the caption stays readable on any frame */}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-18 w-18 items-center justify-center rounded-full bg-white text-secondary shadow-xl ring-8 ring-white/25 transition-transform duration-300 motion-safe:group-hover:scale-110 group-active:scale-95">
                {/* Play glyphs point right in both languages; nudge it to look optically centred */}
                <Play size={28} fill="currentColor" className="translate-x-0.5" />
              </span>
            </span>

            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white md:p-5">
              <span className="text-sm font-bold md:text-base">{t('product.watch_video')}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm" dir="ltr">
                {video.provider}
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
