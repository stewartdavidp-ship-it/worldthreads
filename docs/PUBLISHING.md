# First public release

GitHub Pages publishes the root of the `gh-pages` release branch. The release is a snapshot of the prototype; research work continues on its development branch and draft pull request.

Live URL: https://stewartdavidp-ship-it.github.io/worldthreads/

For subsequent releases, check the graph audit, contribution tests and live browser behavior, then update the release branch with the intended snapshot. Changes elsewhere do not automatically deploy. The `.nojekyll` file serves the static assets directly.

The v0.4 release includes direct account-free submissions, a Cloudflare Worker/D1 review service, factual supporting/counterevidence forms, private receipts, review history and live community graph overlays. Routine review is automatic. The baseline historical research retains its legacy provenance; the new service does not retrospectively mark those claims reviewed.

Deploy the API with `npm run deploy:api` before advancing `gh-pages`. Run `npm test` and the graph audit. See `COMMUNITY_SERVICE.md` for deployment, limits and source-access constraints.
