// Turns the product's `preview_url` (whatever link the admin pasted) into something we can embed.
// Returns null for links we can't embed; those keep opening in a new tab.

const YOUTUBE_ID = /^[\w-]{11}$/;

// `t=90`, `t=90s` or `start=90` — YouTube's `1m30s` form is ignored rather than misread.
function startSeconds(params) {
  const raw = params.get('t') || params.get('start') || '';
  return /^\d+s?$/.test(raw) ? parseInt(raw, 10) : 0;
}

export function parseVideoUrl(url, lang = 'ar') {
  if (!url) return null;

  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, '');

  // youtube.com/watch?v=, /shorts/, /embed/, /live/ and youtu.be/
  let id = null;
  if (host === 'youtu.be') id = u.pathname.split('/')[1];
  else if (['youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
    id = u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/)?.[1];
  }
  if (id && YOUTUBE_ID.test(id)) {
    const start = startSeconds(u.searchParams);
    return {
      provider: 'YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&hl=${lang}${start ? `&start=${start}` : ''}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      portrait: u.pathname.startsWith('/shorts/'),
    };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const vimeoId = u.pathname.match(/\/(\d+)/)?.[1];
    if (vimeoId) {
      return { provider: 'Vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`, thumbnail: null, portrait: false };
    }
  }

  if (host === 'facebook.com' || host === 'fb.watch') {
    return {
      provider: 'Facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`,
      thumbnail: null,
      portrait: u.pathname.includes('/reel/'),
    };
  }

  return null;
}
