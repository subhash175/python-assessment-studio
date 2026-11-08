# Security assessment and LMS integration

## Scope

This is a local review/practice tool, not a secure grading service. Client-side results, manual marks, hashes, read-only controls and modes are not independently trustworthy against a determined user. A student can alter browser code or forge worker messages; no client result is authoritative.

The app contains no submission-write endpoint, LMS integration, secrets, login simulation, analytics or automatic student-source upload. Editing a local working copy cannot change the university's official record because there is no connection back to that record. Import metadata preserves user-provided LMS information, not an authenticated assertion.

## Browser execution

A dedicated module worker prevents Python loops from blocking the main UI. The host terminates the worker on a timeout or stop and creates a fresh environment for every program/test. Stream capture and source/input limits reduce accidental resource abuse. Outputs render as React text and preformatted text, never HTML. No keyword blacklist is used.

A worker is not OS-level process isolation or a hardened sandbox. Pyodide's JavaScript interoperability can invoke fetch and other browser APIs available in the worker, access same-origin browser capabilities, import code, spoof messages, or consume memory. Do not execute actively hostile submissions in a browser profile containing sensitive credentials. This app does not impose a dependable memory quota. The host's output cap also cannot protect against every malicious program. Timing, grades and local restrictions can all be bypassed by a client.

The main document has a meta CSP restricting normal app scripts/connections to self and the runtime CDN, allows WebAssembly compilation and inline CSS required by CodeMirror, and blocks objects. GitHub Pages cannot provide arbitrary custom response security headers. In particular, do not assume the document meta CSP constrains the worker's network APIs: worker response policies require appropriate HTTP headers. This CSP is defense in depth, not a hostile-code boundary, and cannot supply frame-ancestors in a meta tag. CDN dependency trust and traffic are additional considerations; the CDN receives runtime asset requests, not student code from application logic. Python programs themselves can attempt network transmission.

## Recommended production integration

1. Keep the LMS and authenticated university backend authoritative. Authenticate staff there and enforce course-scoped authorization on every read/write, not by a browser mode switch.
2. Retrieve immutable submission versions through the trusted backend, retaining original bytes, server-enforced deadline, server timestamps, version and verified SHA-256. Never expose LMS tokens to this runner.
3. Host execution on a dedicated isolated origin, separate from the LMS, staff dashboard and sensitive storage. Use an iframe with a narrowly reviewed sandbox policy and narrowly scoped postMessage schema. Validate origin/source and message shape; never send secrets or confidential tests. Do not blindly combine sandbox permissions or trust worker output.
4. If integration needs persistent authoritative grades, the authenticated dashboard sends lecturer-confirmed results to a backend that validates identity, authorization, CSRF protection and audit records. Treat browser results as untrusted evidence only.
5. Execute hidden tests and high-stakes automated grading on trusted infrastructure with disposable OS/container isolation, resource quotas, no secrets, controlled egress and independently verified immutable source. Never bundle hidden tests in Pages assets.
6. Retain audit events for retrieval, source version/hash, authorized review, grade approval and later amendments. Enforce deadline and submission replacement policy on the server only.

A free static frontend can coexist with this architecture; the trusted backend and secure grader have their own operating/security costs. The current standalone application does not implement those future services.
