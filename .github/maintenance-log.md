# Maintenance log

## 2026-10-30 — Add persistent labels to the order form

- **Rationale:** The primary ordering form identified text fields only through
  placeholders and identified the meal selector only through its first option.
  Those prompts are not persistent once a customer enters a value, and the
  controls had no explicit label associations for assistive technology.
- **Files changed:** `index.html` groups each order field with a visible,
  programmatically associated label and adds appropriate name and address
  autocomplete hints; `style.css` preserves the two-column desktop and
  single-column mobile layouts while adding high-contrast field focus styles;
  `test/site-integrity.test.js` covers label associations and autocomplete
  metadata; `README.md` documents the form behavior; and this log records the
  work.
- **Validation performed:** Ran `npm run validate`, including JavaScript syntax
  checks and the complete dependency-free Node.js test suite; served the site
  locally; and reviewed the complete diff for form behavior, accessibility,
  responsive layout, security, backward compatibility, and repository
  conventions.
- **Risk level:** Low. Field IDs, required validation, meal values, WhatsApp
  destination, encoded message format, and submit behavior are unchanged. The
  change adds semantic markup, browser hints, and layout styling only.
- **Rollback:** Revert this pull request's squash commit to restore the
  placeholder-only form and its previous grid selectors.

## 2026-10-23 — Stop observing revealed sections

- **Rationale:** Scroll-reveal elements stayed registered with the shared
  `IntersectionObserver` after their one-time transition completed. Every later
  viewport crossing therefore kept invoking callbacks for content whose
  visible state could no longer change.
- **Files changed:** `script.js` now removes each visible element from the
  observer after adding its permanent `show` class;
  `test/motion-preference.test.js` verifies that visible entries are revealed
  and unobserved while non-visible entries remain pending; and
  `.github/maintenance-log.md` records the work.
- **Validation performed:** Ran `npm run validate`, including JavaScript syntax
  checks and the complete dependency-free Node.js test suite; reproduced the
  previous observer leak with the focused test before applying the fix; and
  reviewed the complete diff for reveal behavior, reduced-motion and fallback
  paths, browser compatibility, and repository conventions.
- **Risk level:** Low. The observer already reveals each section permanently.
  The change only stops tracking elements after that irreversible transition;
  unrevealed sections, reduced-motion visitors, unsupported-browser fallback,
  navigation, and ordering behavior are unchanged.
- **Rollback:** Revert this pull request's squash commit to keep revealed
  elements registered with the observer for the lifetime of the page.

## 2026-10-16 — Keep content visible without IntersectionObserver

- **Rationale:** Every major section, including the ordering interface, starts
  transparent and relied on `IntersectionObserver` to become visible. Browsers
  and embedded webviews without that API threw during startup, leaving the page
  blank and preventing the order form from initializing.
- **Files changed:** `script.js` now feature-detects the observer and reveals
  existing content immediately when it is unavailable;
  `test/motion-preference.test.js` covers the unsupported-browser path; and
  `.github/maintenance-log.md` records the work.
- **Validation performed:** Ran `npm run validate`, including JavaScript syntax
  checks and the complete dependency-free Node.js test suite; reviewed the
  complete diff for accessibility, security, mobile behavior, and backward
  compatibility. Browser plugin was unavailable, so the unsupported API path
  was exercised through the repository's VM-based browser harness.
- **Risk level:** Low. Browsers with `IntersectionObserver` retain the existing
  scroll-triggered animation. The fallback only makes already-rendered content
  visible and leaves navigation, ordering, contact details, and styling intact.
- **Rollback:** Revert this pull request's squash commit to restore the
  observer-only reveal path.

## 2026-10-09 — Respect reduced-motion preferences

- **Rationale:** The site documented reduced motion as an accessibility gap.
  Visitors who request less motion still received a delayed loading screen,
  continuous hero animation, smooth scrolling, and scroll-triggered entrance
  transitions.
- **Files changed:** `script.js` skips the loader delay and reveals content
  immediately for reduced-motion visitors; `style.css` disables motion and
  smooth scrolling under the operating-system preference;
  `test/motion-preference.test.js` covers both runtime paths; `package.json`
  and `.github/workflows/ci.yml` expose one shared validation command; `README.md`
  documents the behavior; and `.github/maintenance-log.md` records the work.
- **Validation performed:** `npm run validate`, workflow YAML parsing,
  `git diff --check`, and a complete diff review covering accessibility,
  unchanged default animation behavior, security, and backward compatibility.
- **Risk level:** Low. The default experience is unchanged. The alternate path
  activates only when the browser reports `prefers-reduced-motion: reduce`,
  adds no dependency, and leaves ordering and navigation behavior untouched.
- **Rollback:** Revert the pull request's squash commit to restore the delayed
  loader and animated reveal path for every visitor.

## 2026-10-06 — Add hosted validation and site integrity coverage

- **Rationale:** The repository had focused order-form tests, but no hosted
  workflow enforced them on pull requests or changes to `main`. Static resource
  paths, fragment links, and the duplicated WhatsApp destination were also
  maintained manually and could drift without a failing check.
- **Files changed:** `.github/workflows/ci.yml`,
  `test/site-integrity.test.js`, `README.md`, and
  `.github/maintenance-log.md`.
- **Validation performed:** Ran JavaScript syntax checks and all six
  dependency-free Node.js tests in hosted CI; reviewed workflow permissions,
  immutable action revisions, timeout, concurrency, path handling, and the
  complete diff.
- **Risk level:** Low. The workflow has read-only repository permission and
  does not install dependencies, publish artifacts, or change the static site.
  The tests only read committed files.
- **Rollback:** Revert the pull request's squash commit to remove the workflow,
  integrity tests, README note, and this maintenance entry.

## 2026-10-03 — Reject blank order details

- **Rationale:** Browser `required` validation accepts whitespace-only text. The order handler trimmed those values but still opened WhatsApp, allowing an order message with a blank customer name or pickup/delivery location.
- **Files changed:** `script.js`, `test/order-form.test.js`, `package.json`, `README.md`, and `.github/maintenance-log.md`.
- **Validation performed:** Ran `npm test` (three tests), `node --check script.js`, `node --check test/order-form.test.js`, README path and command checks, and `git diff --check`.
- **Risk level:** Low. Valid orders retain the same destination and message format; only whitespace-only fields are rejected with native validation feedback. New WhatsApp tabs no longer retain opener access.
- **Rollback:** Revert this change to restore the previous submit handler and remove the dependency-free regression harness.

## 2026-09-24 — Document setup, ordering, and maintenance

- **Rationale:** The static site had no repository documentation or ignore rules, leaving its purpose, local preview workflow, WhatsApp ordering behaviour, content update points, and current limitations undocumented.
- **Files changed:** `README.md`, `.gitignore`, and `.github/maintenance-log.md`.
- **Validation performed:** Checked JavaScript syntax; verified local HTML asset references; checked internal navigation targets; confirmed the documented WhatsApp update locations and dependency-free project structure; reviewed the documentation against the current HTML, CSS, JavaScript, assets, and recent navigation change.
- **Risk level:** Low. This change affects documentation and repository hygiene only; production page behaviour and content are unchanged.
- **Rollback:** Revert the commit to remove the documentation and ignore rules. No application data or runtime behaviour is involved.
