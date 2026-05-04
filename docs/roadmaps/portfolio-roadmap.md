# cc-beaten portfolio roadmap

## Snapshot
- 90-day evidence: 11 commits, 31 files touched
- Last signal: `887ee69`
- Top modified areas: `src` (13), `docs` (8), `00_agile` (6)
- Stack: Node
- Docs folder: yes
- Roadmap folder: no
- Features docs: yes
- Tests indexed: yes

## Implemented now (V1 baseline)
- Game browsing and listing UI/filters are documented in `filter-search-filter-games-by-platform-search-by-title-and-sort-by-various-criteria.md`.
- HLTB links and data enrichment documented through `hltb-integration-each-game-entry-includes-a-link-to-its-corresponding-how-long-to-beat-page.md`.
- Data input paths include custom sheet and CSV workflows.
- Responsive behavior and Angular-style interface goals are captured in `responsive-design-works-on-both-desktop-and-mobile-devices.md`.

## Gaps identified
- Source churn is stronger than test signal, so hidden regressions are possible.
- External sheet parsing and remote configuration behavior need explicit error/timeout handling docs.
- No clear deployment checklist exists for Node build/package changes.
- Feature-level ownership is visible but not versioned by milestones.

## V1 (stability and quality)
- [ ] Add automated tests for filter/search/sort permutations.
- [ ] Add contract tests for sheet and CSV imports.
- [ ] Add runtime checks for HLTB/API failures and fallback messaging.
- [ ] Add concise release checklist for `package-lock` and deployment steps.

## V2 (confidence and discoverability)
- [ ] Add feature flags for optional integrations to reduce runtime fragility.
- [ ] Add performance checks for large game catalogs.
- [ ] Add an API contract section in docs describing sheet and CSV schemas.
- [ ] Improve accessibility and keyboard navigation details in responsive docs.

## V10 (platform maturity)
- [ ] Add reusable client module for additional list sources.
- [ ] Build plugin hooks for user-specific scoring and filtering logic.
- [ ] Add observability hooks for data freshness and ingest failures.
- [ ] Publish a long-term operating model with SLA for update cadence.

## Delivery checklist
- [ ] New list source change has validation tests.
- [ ] UI feature change includes responsive and empty-state checks.
- [ ] Release owner confirms post-publish smoke flow.
