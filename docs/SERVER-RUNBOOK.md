# Volta — Server Performance Runbook

Ordered, reversible steps to fix the Core Web Vitals failures on volta-eg.com.
Each step is independent. **Do them one at a time and verify before moving on.**

**Server facts (confirmed):** Apache on RHEL-family VPS · DocumentRoot
`/var/www/volta-app/dist` · `AllowOverride All` is set · `mod_brotli`,
`mod_deflate`, `mod_headers`, `mod_setenvif`, `mod_rewrite` all loaded ·
API DocumentRoot `/var/www/volta-back/public`.

---

## Ground rules

1. **One step at a time.** Verify each before starting the next.
2. **`apachectl configtest` does NOT check `.htaccess`.** A syntax error there
   returns 500 on every request with no warning. Always run the verify commands
   within seconds of writing the file.
3. **Every step has a one-command rollback.** Listed inline and collected at the end.
4. **`.htaccess` needs no Apache reload.** It is read per request, so both the
   change and the rollback are instant.

---

## Step 1 — Enable compression ⭐ biggest win, no code change

Right now every visitor downloads **926 KB of JavaScript and 102 KB of CSS
uncompressed** — there is no `Content-Encoding` header on the site at all.
This step alone removes roughly 750 KB from every first visit.

It writes directly into the live `dist/`. No rebuild, no code deploy.

### 1a. Back up

```bash
cp -a /var/www/volta-app/dist /root/dist-backup-$(date +%F)
```

### 1b. Write the file

Copy this whole block into the terminal at once:

```bash
cat > /var/www/volta-app/dist/.htaccess <<'HTACCESS'
# Compression -----------------------------------------------------------
# Brotli first; mod_deflate passes through untouched when Content-Encoding
# is already set, so the two do not stack. The explicit MIME allowlist keeps
# already-compressed formats (images, woff2) from being re-compressed.

<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/css text/xml
    AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
    AddOutputFilterByType BROTLI_COMPRESS application/xml image/svg+xml
    AddOutputFilterByType BROTLI_COMPRESS application/manifest+json
    # Do NOT add BrotliCompressionQuality here — mod_brotli tuning directives
    # are server-config/vhost context only and 500 the entire site from
    # .htaccess. Default quality 5 is within a couple of percent of 6.
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE application/xml image/svg+xml
    AddOutputFilterByType DEFLATE application/manifest+json
</IfModule>

# Caching ---------------------------------------------------------------
# mod_expires is deliberately unused; it would emit a competing max-age.

<IfModule mod_setenvif.c>
    SetEnvIf Request_URI "^/assets/" VITE_HASHED_ASSET
</IfModule>

<IfModule mod_headers.c>
    Header set Cache-Control "public, max-age=31536000, immutable" env=VITE_HASHED_ASSET

    <FilesMatch "\.(png|jpe?g|gif|svg|ico|webp|avif)$">
        Header set Cache-Control "public, max-age=604800" env=!VITE_HASHED_ASSET
    </FilesMatch>

    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>
</IfModule>
HTACCESS

chown apache:apache /var/www/volta-app/dist/.htaccess
chmod 644 /var/www/volta-app/dist/.htaccess
```

> **Why there is no `RewriteEngine` line here — do not add one.**
> Your React Router fallback lives in the vhost `<Directory>` block, and
> mod_rewrite rulesets are **not inherited** into `.htaccess`. Declaring
> `RewriteEngine On` in this file would disable that fallback and 404 every
> deep route (`/about-us`, `/product/12`).

### 1c. Verify — run all four

```bash
JS=$(grep -o '/assets/index-[^"]*\.js' /var/www/volta-app/dist/index.html)

# 1. exactly ONE content-encoding line, saying br
curl -sSI -H "Accept-Encoding: gzip, br" "https://www.volta-eg.com$JS" | grep -i content-encoding

# 2. bytes on the wire — expect ~260000, was 926632
curl -sS -o /dev/null -w "bytes=%{size_download}\n" -H "Accept-Encoding: gzip, br" "https://www.volta-eg.com$JS"

# 3. caching headers
curl -sSI "https://www.volta-eg.com$JS" | grep -i cache-control
curl -sSI https://www.volta-eg.com/    | grep -i cache-control

# 4. CRITICAL — deep routes must still work
curl -sS -o /dev/null -w "about-us=%{http_code}\n" https://www.volta-eg.com/about-us
curl -sS -o /dev/null -w "home=%{http_code}\n"     https://www.volta-eg.com/
```

**Pass criteria**

| Check | Expected |
|---|---|
| 1 | one line, `content-encoding: br` |
| 2 | roughly `250000`–`290000` |
| 3 | `immutable` on the JS, `no-cache` on `/` |
| 4 | both `200` |

If check 1 shows **two** encodings or `br, gzip`, the filters stacked — stop and report it.
If check 4 is not `200`, roll back immediately.

### 1d. Rollback

```bash
rm /var/www/volta-app/dist/.htaccess
```

---

## Step 2 — Serve WebP images

Category images are **~1 MB PNGs, 14 of them**. They are referenced by filename
in the database, so converting them in place would break every row. Instead we
generate `foo.png.webp` **siblings** and let Apache serve those only to browsers
that accept WebP. Originals stay as the fallback. **The database is never touched.**

### 2a. Back up and check space

```bash
cp /var/www/volta-back/public/.htaccess /root/laravel-htaccess-backup-$(date +%F)
df -h /var/www          # siblings add roughly 10% on top of current usage
```

### 2b. Add the rewrite

Edit `/var/www/volta-back/public/.htaccess`, insert these four lines
**immediately after the existing `RewriteEngine On`**:

```apache
    # Serve pre-generated .webp siblings to browsers that accept them.
    RewriteCond %{HTTP_ACCEPT} image/webp
    RewriteCond %{REQUEST_FILENAME} \.(jpe?g|png)$ [NC]
    RewriteCond %{REQUEST_FILENAME}\.webp -f
    RewriteRule ^(.+)$ $1.webp [T=image/webp,END]
```

Then append at the end of the same file:

```apache
<IfModule mod_headers.c>
    <FilesMatch "\.(jpe?g|png|webp|gif|svg|ico|avif)$">
        Header append Vary Accept
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</IfModule>
```

`Vary: Accept` is required — without it a proxy could hand a WebP to a client
that cannot read it.

### 2c. Verify the API did not break — before anything else

```bash
curl -sS -o /dev/null -w "api=%{http_code}\n" https://api.volta-eg.com/api/categories
```

Must be `200`. If not, restore immediately:

```bash
cp /root/laravel-htaccess-backup-* /var/www/volta-back/public/.htaccess
```

The rewrite is inert until `.webp` files exist, so it is safe to leave in place
while you continue.

### 2d. Generate the images

```bash
dnf install -y ImageMagick libwebp-tools

# preview — writes nothing at all
sudo DRY_RUN=1 bash /var/www/volta-app/scripts/optimize-storage-images.sh

# one folder first, so you see real numbers before committing to everything
sudo nice -n 10 STORAGE_ROOT=/var/www/volta-back/storage/app/public/uploads/categories \
    bash /var/www/volta-app/scripts/optimize-storage-images.sh

# then all of it
sudo nice -n 10 bash /var/www/volta-app/scripts/optimize-storage-images.sh
```

`nice` matters — ImageMagick over hundreds of 1.5 MB PNGs will otherwise pin the
CPU while the site is serving live traffic.

**What the script does to your data:** writes new `.webp` files. It never
modifies or deletes an original. Deleting orphaned siblings is opt-in
(`PRUNE=1`) and off by default.

### 2e. Verify negotiation

```bash
IMG=/storage/uploads/categories/whLvRoWePV1OQ4f1HghSlJps5MQ9AfoqUTDwB1DL.png

# WebP-capable client — expect image/webp, ~40-80 KB
curl -sSI -H "Accept: image/webp" https://api.volta-eg.com$IMG | grep -iE "content-type|content-length|vary"

# old client — must still get the original PNG at 942 KB
curl -sSI https://api.volta-eg.com$IMG | grep -iE "content-type|content-length"
```

If the first still says `png`, the rewrite is not firing — most likely
`AllowOverride` on the api vhost.

### 2f. Rollback

```bash
cp /root/laravel-htaccess-backup-* /var/www/volta-back/public/.htaccess
find /var/www/volta-back/storage/app/public/uploads -name '*.png.webp' -delete
find /var/www/volta-back/storage/app/public/uploads -name '*.jpg.webp' -delete
```

---

## Step 3 — Deploy the frontend code changes

Lazy-loading for the category carousel, `fetchpriority` on the LCP banner.
Currently **all 14 category images (~9 MB) download on page load** while only
about 4 are visible, starving the banner that is your LCP element.

### 3a. Check what you would actually be shipping

Your `dist/` was built **April 8**. A `git pull` deploys every commit since
then, not only the performance changes.

```bash
cd /var/www/volta-app
git log -1 --oneline
git status
git log --oneline HEAD..origin/main     # read this list before pulling
```

**If that list contains work you were not planning to ship, stop.**
Deploy the performance work on its own branch instead.

### 3b. Deploy

```bash
cd /var/www/volta-app
git pull
npm run build
```

`vite build` empties `dist/` and regenerates it — including `.htaccess`, which
now comes from `public/.htaccess` in the repo. The hand-written copy from Step 1
is replaced by an identical tracked one.

### 3c. Verify

```bash
test -f /var/www/volta-app/dist/.htaccess && echo "htaccess survived build" || echo "MISSING - re-run step 1b"
curl -sS -o /dev/null -w "home=%{http_code}\n"     https://www.volta-eg.com/
curl -sS -o /dev/null -w "about-us=%{http_code}\n" https://www.volta-eg.com/about-us
```

### 3d. Rollback

```bash
rm -rf /var/www/volta-app/dist
cp -a /root/dist-backup-$(date +%F) /var/www/volta-app/dist
```

---

## Step 4 — Automate for future uploads (only after Step 2 ran cleanly by hand)

New admin uploads arrive as unoptimized PNGs. They still work — Apache falls
back to the original — they are just slow until converted.

```bash
sudo cp /var/www/volta-app/scripts/volta-image-optimizer.cron \
        /etc/cron.d/volta-image-optimizer

# watch one cycle before walking away
tail -f /var/log/volta-image-optimizer.log
```

Runs every 10 minutes. Idempotent — it only touches images whose `.webp` is
missing or stale, so a pass over already-converted files is just a stat sweep.

Add a logrotate entry for `/var/log/volta-image-optimizer.log` eventually.

**Rollback:** `rm /etc/cron.d/volta-image-optimizer`

---

## Rollback cheat sheet

| Step | Undo |
|---|---|
| 1 | `rm /var/www/volta-app/dist/.htaccess` |
| 2 | restore `/root/laravel-htaccess-backup-*`, then `find .../uploads -name '*.png.webp' -delete` |
| 3 | `rm -rf dist && cp -a /root/dist-backup-* /var/www/volta-app/dist` |
| 4 | `rm /etc/cron.d/volta-image-optimizer` |

---

## Verified vs. unverified

**Verified locally:** the frontend builds clean; Vite copies `.htaccess` from
`public/` into `dist/`; both scripts pass `bash -n`; the live site currently
serves zero compression and no cache headers (measured with curl).

**Not verified — must be tested on the server:** the image encoding (no
ImageMagick available on the dev machine), the WebP rewrite, and the compression
config against your specific Apache build. That is exactly why each step is
isolated and carries its own rollback.

---

## Still outstanding after this runbook

Code-side work, not covered here:

- **CLS 0.46** — the header nav, category carousel and banner all render as empty
  containers that grow when the API responds. Needs skeletons reserving the final
  height. This is the worst metric on the site.
- **926 KB single JS bundle** — needs `React.lazy` per route plus `manualChunks`.
- **`getCategories()` fires twice** — once in `Header.jsx`, once in `Home.jsx`.
- **Banner request waterfall** — `fetchBanners()` only starts after the categories
  request resolves, delaying the LCP image by a full round trip.
- **`ar-EG` direction bug** — `i18n.js` compares `lng === 'ar'`, but browsers report
  `ar-EG`, flipping Arabic users to LTR after JS loads.
- **Upload size cap** — the admin panel still accepts 1.5 MB PNGs.
