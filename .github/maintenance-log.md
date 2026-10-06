# Maintenance log

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
