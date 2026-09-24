# Maintenance log

## 2026-09-24 — Document setup, ordering, and maintenance

- **Rationale:** The static site had no repository documentation or ignore rules, leaving its purpose, local preview workflow, WhatsApp ordering behaviour, content update points, and current limitations undocumented.
- **Files changed:** `README.md`, `.gitignore`, and `.github/maintenance-log.md`.
- **Validation performed:** Checked JavaScript syntax; verified local HTML asset references; checked internal navigation targets; confirmed the documented WhatsApp update locations and dependency-free project structure; reviewed the documentation against the current HTML, CSS, JavaScript, assets, and recent navigation change.
- **Risk level:** Low. This change affects documentation and repository hygiene only; production page behaviour and content are unchanged.
- **Rollback:** Revert the commit to remove the documentation and ignore rules. No application data or runtime behaviour is involved.
