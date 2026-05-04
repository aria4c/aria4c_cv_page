You are working on a BBS-style SvelteKit CV site. Read CLAUDE.md first for full architecture context.

The user has stated a new requirement:

> $ARGUMENTS

Your job is to:

## Step 1 — Analyse scope

Read CLAUDE.md and identify all components, stores, and utilities that are touched by this requirement. List them explicitly before doing anything else. Consider:
- Which component renders the affected UI?
- Which store (if any) needs new state?
- Which spec files need updating?
- Does CLAUDE.md's conventions section need a new rule?

## Step 2 — Update spec files

For every affected spec file, add the requirement under the appropriate section:
- New prop → add a row to the Props table
- New behavior → add a bullet to the Behavior section
- Testable outcome → add a `- [ ]` line to Acceptance Criteria

Do not rewrite existing content — append or extend only. Keep the same format as the existing spec.

## Step 3 — Implement

Make the actual code changes. Follow all conventions in CLAUDE.md:
- No comments unless the WHY is non-obvious
- No new abstractions beyond what the requirement needs
- CSS custom properties only (no hardcoded colors)
- Keyboard bindings via `register()` with the correct priority

## Step 4 — Verify

After implementing, state clearly:
- Which files were changed (spec + implementation)
- What the user should test in the browser to confirm it works
- Any edge cases or follow-up considerations
