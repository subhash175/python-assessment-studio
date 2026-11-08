# Verification — 6 November 2026

Executed successfully:
- TypeScript type checking and Vite production build.
- Five Node automated tests: exact comparison, trim/CRLF, whitespace normalization, CSV quoting and spreadsheet formula escaping.
- Browser Pyodide diagnostics: Hello World, arithmetic, prompted input with Alice, function execution, ZeroDivisionError, 1-second infinite-loop timeout, state seed, fresh environment without the seeded variable, and virtual file read/write. All nine passed.
- Default grade-summary program executed in the browser and printed the expected class summary.
- Uploaded UTF-8 Python file loaded in lecturer workspace, original read-only display and SHA-256 metadata visible.

The browser diagnostic runner is available in Help & documentation and repeats the real Python checks in your environment. It reports actual outcomes, not pre-filled success states.

- Lecturer testing: imported square program passed all three cases (2 → 4, 3 → 9, -4 → 16).
- Manual mark and marking notes entered; JSON report download completed in the browser. CSV formatting covered by automated tests; CSV download not separately exercised.

## University deployment checklist

- Independently validate on your supported Chrome, Firefox and Safari versions and tablet sizes.
- Verify input exhaustion, oversized files/output, manual Stop, unavailable CDN, network disconnect, memory-heavy programs and recovery.
- Verify your GitHub Actions deployment at its real repository subdirectory URL, worker loading and Python execution. Actual GitHub deployment is not performed by the Sites deployment.
- Verify test comparisons, working-copy separation, notes, mark and CSV/JSON exports on your own representative submissions.
- Review the provisional-result wording and institutional privacy policy; never use client output alone to award authoritative grades.
- Approve the execution origin and security architecture before embedding in an LMS.
- Ensure no LMS secrets or confidential hidden tests are present in public assets.
- Confirm deadline, immutable submission versions, staff authorization and grade audit are enforced by your trusted university system.
- Confirm accessibility, contrast and keyboard use for your institutional requirements.

This is a working standalone implementation, not a certification of production university security or a completed penetration test.
