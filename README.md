# Lolly Food Box

A responsive, single-page website for Lolly Food Box in Oke-Aro, Ogun State. The site presents the food menu, popular items, gallery, contact details, and a lightweight WhatsApp ordering flow.

## What the site does

- Presents menu categories, selected prices, gallery images, and store details.
- Provides responsive desktop and mobile navigation.
- Reveals page sections as they enter the viewport.
- Builds a prefilled WhatsApp message from the customer's name, meal choice, and pickup or delivery location.
- Provides a separate floating WhatsApp shortcut.

The site does not contain a cart, payment processing, inventory management, account system, or server-side order storage. Menu information, prices, reviews, and contact details are static page content.

The current stylesheet does not provide a reduced-motion override, so motion-sensitive visitors may still see the loader, floating artwork, and reveal animations.

## Project structure

```text
.
├── assets/       Local logo and food photography
├── index.html    Page content, navigation, order form, and metadata
├── script.js     Loader, navigation, reveal effects, and WhatsApp ordering
└── style.css     Visual design and responsive layouts
```

## Run locally

No package installation or build step is required. Serve the repository root with any static file server. For example, with Python 3:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Opening `index.html` directly also renders the page, but a local HTTP server more closely matches production hosting.

## Updating content

- Edit menu items, visible prices, reviews, address, and contact copy in `index.html`.
- Replace images in `assets/` while keeping the referenced filenames, or update the matching `src` attributes.
- Update colours, spacing, layout, and responsive breakpoints in `style.css`.
- Update interaction behaviour in `script.js`.

The WhatsApp destination appears in both `script.js` and `index.html`. When the business number changes, update:

1. The order-form URL constructed in `script.js`.
2. The floating WhatsApp link and visible contact copy in `index.html`.

Keeping all three values aligned prevents orders from being sent to an outdated destination.

## Ordering and privacy

Submitting the order form does not send data to this repository or a custom backend. JavaScript converts the entered name, meal, and location into a WhatsApp URL and opens WhatsApp in a new tab. WhatsApp then handles the message according to its own service and privacy terms.

The page also requests the Fredoka and Poppins fonts from Google Fonts when it loads.

## Validation

Run the JavaScript syntax check:

```bash
node --check script.js
```

Before publishing a content change:

- Confirm every local image reference exists.
- Test the navigation at desktop and mobile widths.
- Submit a sample order and verify the generated WhatsApp message and destination.
- Check keyboard focus and visible focus states when changing interactions.
- Add and test a reduced-motion alternative before expanding the animation system.

## Deployment

Deploy the repository root to any static hosting provider. The host should serve `index.html` at the site root and preserve the relative `style.css`, `script.js`, and `assets/` paths.

## Contributing

Keep changes focused and preserve the dependency-free structure unless a new dependency has a clear, documented need. Do not publish private customer information, credentials, or unverified business claims. Include validation notes with changes that affect ordering, navigation, accessibility, or responsive layout.
