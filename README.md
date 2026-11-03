# Share Slice

[日本語](README.ja.md) · [Educational site](https://filings.optmodel.com/)

A browser-local share-count scenario calculator. Add issuance, RSU vesting, full option exercise and buyback events; inspect each stage and save/reload a JSON scenario.

## Install and run

Requires Node 24+ and npm. Dependency installation needs a network connection.

```sh
git clone https://github.com/kolmo2026/share-slice.git
cd share-slice
npm ci
npm run build
npm run serve -- --port 4173
```

Open http://127.0.0.1:4173 after starting the local server. Stop it with Ctrl+C.

## Reproducible example

**Input:** 100,000,000 initial shares; 1,000,000 held; USD20,000,000 period income; issue 10,000,000; vest 5,000,000 RSUs.

**Output:** 115,000,000 ending shares; 0.869565% ownership; 15% share growth; 13.043478% relative ownership dilution; 0.130435 percentage-point ownership drop; USD0.173913 simple EPS.

Fixtures: examples/scenario.json. All supplied documents and numbers are synthetic.

## Tests and build sources

```sh
npm test
npm run build
```

Known dilution result, event sequencing, buyback bounds, invalid inputs and JSON roundtrip.

Source: `src/`, `test/`, `site/` and `scripts/`. The independent static site is built to `docs/`, with English/Japanese equivalents, canonical/hreflang links, sitemap, robots, CNAME and .nojekyll. Its hostname is https://filings.optmodel.com. Each repository is self-contained; no sibling directory is needed to build.

## Limits

Fixed holder shares and fixed period income. Period-end shares, not a weighted average. Full exercise is not treasury-stock accounting. No anti-dilution rules, tax effects or earnings adjustments: NOT statutory diluted EPS. Currency is a label, not FX conversion. Safe-integer share inputs; floating-point results. No market data or investment advice.

## Privacy and related products

No account, analytics, backend or document-upload endpoint. Calculations/file operations run locally. Public site assets still load over the network; browser dependencies are bundled rather than fetched from a runtime CDN. JSON exports are plain text; review filenames and assumptions before sharing.

[Eqvero](https://eqvero.com/) — public-disclosure research, separate from this arithmetic utility.

Maintained via GitHub account **kolmo2026**, by the same maintenance team developing tools for the Eqvero/KolmoPDF/KomoPDF ecosystem. This is not an independent review or third-party endorsement. KolmoPDF's cloud services upload documents and are distinct from these local tools.

## License

MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses; when dependencies are installed, the build collects their license texts in THIRD-PARTY-NOTICES.txt.
