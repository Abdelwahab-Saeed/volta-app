#!/usr/bin/env bash
#
# Generate resized WebP siblings for the Laravel storage images.
#
# Run on the server:
#     sudo bash optimize-storage-images.sh
#     sudo DRY_RUN=1 bash optimize-storage-images.sh    # preview only
#
# For every foo.png it writes foo.png.webp alongside it. Originals are never
# modified or deleted and the database is never touched - Apache serves the
# .webp only to browsers sending "Accept: image/webp", falling back to the
# original otherwise (see the rewrite block in volta-back/public/.htaccess).
#
# Safe to re-run: a .webp is rebuilt only when missing or older than its
# source, so this can be cron'd or hooked after admin uploads.
#
set -euo pipefail

STORAGE_ROOT="${STORAGE_ROOT:-/var/www/volta-back/storage/app/public/uploads}"
QUALITY="${QUALITY:-82}"
DRY_RUN="${DRY_RUN:-0}"
OWNER="${OWNER:-apache:apache}"
# Deleting orphaned siblings is the only destructive thing this script does,
# so it is opt-in. Enable it only once you have seen a normal run behave.
PRUNE="${PRUNE:-0}"

have() { command -v "$1" >/dev/null 2>&1; }

IM=""
if   have magick;  then IM=magick
elif have convert; then IM=convert
fi

if [ -z "$IM" ] && ! have cwebp; then
    echo "ERROR: need ImageMagick or cwebp." >&2
    echo "  dnf install -y ImageMagick libwebp-tools" >&2
    exit 1
fi

IM_HAS_WEBP=0
if [ -n "$IM" ] && $IM -list format 2>/dev/null | grep -qiE '^ *WEBP'; then
    IM_HAS_WEBP=1
fi

# Display sizes doubled for high-DPI screens. Category cards render at roughly
# 300 CSS px, banners at roughly 1200.
max_width_for() {
    case "$1" in
        */banners/*)    echo 1600 ;;
        */categories/*) echo 800  ;;
        *)              echo 1000 ;;
    esac
}

encode() {
    local src="$1" dst="$2" w="$3"
    if [ "$IM_HAS_WEBP" = "1" ]; then
        $IM "$src" -resize "${w}x${w}>" -quality "$QUALITY" -strip "$dst"
    elif [ -n "$IM" ] && have cwebp; then
        local tmp
        tmp="$(mktemp --suffix=.png)"
        $IM "$src" -resize "${w}x${w}>" -strip "$tmp"
        cwebp -quiet -q "$QUALITY" "$tmp" -o "$dst"
        rm -f "$tmp"
    else
        # cwebp alone cannot "shrink only", so this may upscale small sources.
        cwebp -quiet -q "$QUALITY" -resize "$w" 0 "$src" -o "$dst"
    fi
}

if [ ! -d "$STORAGE_ROOT" ]; then
    echo "ERROR: $STORAGE_ROOT does not exist." >&2
    exit 1
fi

echo "Source:  $STORAGE_ROOT"
echo "Encoder: ${IM:-cwebp}$([ "$IM_HAS_WEBP" = 1 ] && echo ' (native webp)')  quality=$QUALITY"
[ "$DRY_RUN" = "1" ] && echo "MODE:    dry run, nothing will be written"
echo

before_total=0
after_total=0
converted=0
skipped=0

while IFS= read -r -d '' src; do
    dst="${src}.webp"
    if [ -f "$dst" ] && [ "$dst" -nt "$src" ]; then
        skipped=$((skipped + 1))
        continue
    fi

    width="$(max_width_for "$src")"
    before=$(stat -c%s "$src")

    if [ "$DRY_RUN" = "1" ]; then
        printf '%8.0f KB  would convert  %s\n' "$((before / 1024))" "${src#$STORAGE_ROOT/}"
        converted=$((converted + 1))
        before_total=$((before_total + before))
        continue
    fi

    if ! encode "$src" "$dst" "$width"; then
        echo "  FAILED: $src" >&2
        rm -f "$dst"
        continue
    fi

    chown "$OWNER" "$dst" 2>/dev/null || true
    chmod 644 "$dst"

    after=$(stat -c%s "$dst")
    before_total=$((before_total + before))
    after_total=$((after_total + after))
    converted=$((converted + 1))
    printf '%8s KB -> %7s KB  %s\n' \
        "$((before / 1024))" "$((after / 1024))" "${src#$STORAGE_ROOT/}"
done < <(find "$STORAGE_ROOT" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)

# Drop siblings whose source image was deleted, so removed uploads do not leave
# orphans behind. Only *.jpg.webp / *.jpeg.webp / *.png.webp are considered -
# matching bare *.webp would delete images that were genuinely uploaded as WebP.
pruned=0
while IFS= read -r -d '' orphan; do
    [ "$PRUNE" = "1" ] || break
    [ -f "${orphan%.webp}" ] && continue
    if [ "$DRY_RUN" = "1" ]; then
        echo "would prune  ${orphan#$STORAGE_ROOT/}"
    else
        rm -f "$orphan"
    fi
    pruned=$((pruned + 1))
done < <(find "$STORAGE_ROOT" -type f \
    \( -iname '*.jpg.webp' -o -iname '*.jpeg.webp' -o -iname '*.png.webp' \) -print0)

echo
echo "converted: $converted   already current: $skipped   pruned: $pruned"
if [ "$DRY_RUN" != "1" ] && [ "$before_total" -gt 0 ]; then
    echo "before: $((before_total / 1024 / 1024)) MB   after: $((after_total / 1024 / 1024)) MB"
    echo "saved:  $(( (before_total - after_total) * 100 / before_total ))%"
fi
