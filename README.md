# Python Assessment Studio

A browser-local React + TypeScript workspace for Python practice and provisional lecturer assessment. No Python backend, paid execution API, analytics, LMS credentials, or server storage. This repository is configured to publish at https://subhash175.github.io/python-assessment-studio/ once GitHub Pages is enabled with GitHub Actions. It does not require a ChatGPT account or login.

## Run locally

Node.js 22+ is recommended.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Open the URL printed by Vite. Do not open index.html using file://. `npm install` is also supported; `npm ci` reproduces the lockfile.

## Features

- CodeMirror Python highlighting, line numbers, indentation, bracket matching, upload/download, examples and theme switch.
- Pinned Pyodide 314.0.7, the stable release shown by official documentation when checked on 6 November 2026. Runtime import occurs asynchronously in a module Web Worker, never the UI thread.
- stdin lines, stdout/stderr, tracebacks, configurable 1–60 second execution deadline, Stop, reset, 60-second startup deadline, 100 KiB code limit and 64 KiB output limit.
- One worker per execution; termination after completion removes Python globals and virtual files. Runtime assets use normal browser HTTP caching. Startup time is separate from execution time.
- Read-only original imports with raw-file SHA-256, editable working copy, test comparisons, lecturer notes/marks, CSV and JSON exports.
- No automatic persistence. Reloading clears source, metadata, tests and notes. Export first. A mode is a workflow choice, not an authorization role.

## GitHub Pages deployment

1. Create a GitHub repository, e.g. `python-assessment-studio`.
2. Upload this source tree, including `.github/workflows/deploy.yml`, or push it with Git. Exclude `node_modules`, `dist` and `.openai` (Sites-specific metadata).
3. In repository Settings → Pages → Build and deployment, choose **GitHub Actions**.
4. Push to `main`, or run **Deploy to GitHub Pages** manually from Actions.
5. After deployment, visit `https://USERNAME.github.io/REPOSITORY/` with its trailing slash.

`vite.config.ts` uses `base: './'`; scripts and styles remain relative, and the worker resolves against `document.baseURI`. This works at the domain root and repository subdirectories. This app has no path-based client routing. The worker is copied from `public/python-worker.js` into the output root. Python's runtime assets use an absolute, pinned jsDelivr URL.

For a custom domain, add `public/CNAME` containing your domain, configure its DNS as GitHub documents, and enable HTTPS in Pages settings. The relative base also supports this setup. Free hosting depends on GitHub's applicable account and repository limits.

## Assessments

Download an official submission from the LMS, switch to Lecturer workspace and import its `.py` file. The original text cannot be edited through the app. A working copy is separate and never sent to the LMS. The original SHA-256 is calculated from uploaded bytes, not re-encoded editor text. Preserve LMS reference, timestamp, version and LMS hash in Reports & notes. An import time is not a submission time.

Add input and expected stdout for each test. Choose exact comparison, outer whitespace trimming (also normalizes CRLF), or whitespace collapsing. Prompts printed by `input('prompt')` are part of stdout and expected output. Empty stdin produces EOF; a single newline can provide an empty response. Each test uses a fresh worker. Failed execution cannot pass a test. Changing tested source or comparison clears stale outcomes. Record judgement and export JSON (includes source) or CSV (summary). CSV formula prefixes are escaped. Keep exports as confidential student records.

## Troubleshooting

- **Runtime fails to load:** allow HTTPS access to `cdn.jsdelivr.net`; check connectivity and then Reset environment. The app can render while this download is in progress. No runtime-ready claim means no execution has been verified.
- **Worker fails / wrong MIME / 404:** serve over HTTP(S), rebuild, confirm `dist/python-worker.js` exists, and use the trailing slash for a repository URL. Do not point the worker at `/python-worker.js` for project Pages sites.
- **CORS/CDN errors:** keep the official pinned runtime URL together with its matching indexURL. If self-hosting the runtime later, copy the complete release assets and update worker URL and CSP together.
- **Timeouts:** the selected duration covers Python execution, not first-time loading. Stop terminates the worker. Run again starts fresh. Startup is limited separately to 60 seconds.
- **Missing input:** enter one response per line before execution; no interactive mid-run prompt is displayed.
- **Packages:** standard library is supported where Pyodide supports it. This version does not automatically install arbitrary third-party packages. Native desktop GUI, sockets, subprocesses and OS-specific modules are not generally equivalent to desktop Python.
- **Memory exhaustion:** output and time limits help but do not impose an OS memory quota; a hostile or excessive allocation can still crash the browser tab.
- **Build:** use the checked-in lockfile, Node 22+ and `npm ci`. Vite's bundle-size advisory is nonfatal; runtime assets download separately.

## Dependencies and licences

Application source: MIT (LICENSE). React / ReactDOM: MIT. Vite: MIT. TypeScript: Apache-2.0. CodeMirror and its Python language package: MIT. Lucide: ISC. Pyodide: MPL-2.0; its bundled CPython and libraries retain their own licences. Runtime is loaded unchanged from the official versioned CDN distribution; do not remove upstream notices when self-hosting it. All direct npm versions and the Pyodide release are pinned; package-lock.json fixes transitive dependencies. No vendor execution subscription is needed.

## Source structure

- `src/App.tsx`: practice, assessment, reports and help UI.
- `src/Editor.tsx`: CodeMirror editor and read-only configuration.
- `src/runner.ts`: worker lifecycle, startup/execution deadlines and stale-message protection.
- `public/python-worker.js`: Pyodide initialization and standard stream adapters.
- `src/utils.mjs`: output normalization, downloads and safe CSV cells.
- `tests/utils.test.mjs`: automated comparison/export checks.
- `SECURITY.md`: remaining risks and future integration architecture.
- `VERIFICATION.md`: actual results and deployment checklist.

Official references consulted: https://pyodide.org/en/stable/usage/webworker.html , https://pyodide.org/en/stable/usage/streams.html , https://pyodide.org/en/stable/usage/index.html , https://vite.dev/guide/static-deploy.html#github-pages .
