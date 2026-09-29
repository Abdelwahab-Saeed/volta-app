# Volta frontend

React 19 + Vite 7 + Tailwind 4 storefront for Volta, Arabic (RTL) and English. State in zustand stores
(`src/stores`), forms with react-hook-form, translations with i18next (`src/locales/{ar,en}.json`).
The API is the separate `volta-back` repo; its `docs/offers-and-money.md` explains money, offers and checkout.

## Commands
- Setup: `npm ci && cp .env.example .env` (point `VITE_API_URL` at a running backend)
- Dev: `npm run dev` · Build: `npx vite build` · Lint: `npx eslint <files>`
- `src/pages/Checkout.jsx` has two known lint errors from before (unused `trackEvent`, `error`).

## Rules that are easy to break
- **Never compute offer prices or write offer texts here.** Offers come display-ready from the API
  (`offer.display.summary`, `display.type_label`, prices, `offer.purchase`) and prices for a selection come from
  `GET /offers/{id}/quote`. Pages that show offer texts refetch when the language changes.
- **Offers are bought directly** on `/checkout/offer/:id?sets=&product_id=` (`OfferCheckout.jsx`), never through the
  cart. The selection lives in the URL so back/refresh keep it. The offer checkout sends `expected_total` (handle 409 by
  showing the new quote) and an `Idempotency-Key` kept in sessionStorage.
- Cart prices use `product.final_price` (the API sends `discount_price: 0`, not null, when there is no discount).
  Shipping mirrors the backend: product shipping × quantity, or 30 EGP when that is 0.
- Guest cart items have `local-` ids; on login `fetchCart` merges them into the account cart (`POST /cart/merge`)
  instead of replacing them. Logout clears the cart (App.jsx auth subscription).
- Colours: brand only — `primary` (navy), `secondary` (blue), `secondary-on-dark` (blue on navy). Green only for
  savings/free, red only for problems. Offers without an image use `OfferPlaceholder`.
- Layout must work in RTL and LTR: use `start`/`end`/`ms`/`me` utilities and `rtl:`/`ltr:` variants, not left/right.
- Every user-facing string goes through `t()` with keys in both `ar.json` and `en.json`.

## Git
Don't push to `main` directly; work on a branch and open a PR. Offers/cart/checkout changes must ship together with
the matching `volta-back` branch.
