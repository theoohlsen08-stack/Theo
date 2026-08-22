# Shopify Admin (personal mock)

A private, self-contained clone of the Shopify Admin UI — the "Home" dashboard plus Orders,
Products, Customers, Analytics, and Settings — built from scratch in plain HTML/CSS/JS. It is not
connected to Shopify or any real store; every number is a local, editable mock.

## Use it

Just open `index.html` in a browser — no build step, no server, no dependencies. Everything
(charts included) is hand-rolled vanilla JS and CSS, so it also works offline.

```bash
open shopify-admin/index.html        # macOS
xdg-open shopify-admin/index.html    # Linux
# or serve it if you prefer a URL:
npx serve shopify-admin
```

## How the numbers stay consistent

Click any bold number on the Home dashboard to edit it. Under the hood, only four values are
truly independent state — everything else is computed from them on every render:

- **Sessions per day**
- **Conversion rate**
- **Average order value**
- **Returning customer rate**

`Orders = Sessions × Conversion rate` and `Total sales = Orders × Average order value`. Editing
one field solves for the field that's actually dependent on it (e.g. typing a new **Orders**
number keeps Sessions fixed and backs out the new Conversion rate), so the two are never allowed
to drift out of sync. The daily chart series, sparklines, funnel, top products, and the Orders/
Customers tables are all regenerated from the same state on every change, scaled so their totals
match the KPI cards exactly.

Switching the date range (Today / 7 / 30 / 90 days) keeps the underlying daily rate constant and
just re-sums that many days — so the numbers scale the way you'd expect rather than resetting.

Everything is saved to `localStorage` in your browser as you go. Settings → **Reset to sample
data** clears it back to the defaults; **Shuffle chart pattern** regenerates the day-to-day noise
in the charts without changing any totals.
