# Breadcrumb

## Purpose
Inline display of the current navigation path as `PATH: A > B > C`. A pure presentational component — it receives the path array and renders it. Navigation state is not read directly; the caller provides the path.

## Props
| prop | type | default | description |
|------|------|---------|-------------|
| `path` | `string[]` | `[]` | Ordered list of screen titles from root to current |

## Behavior
- Joins path entries with ` > ` separator
- Renders as a single `<span>` in `--bbs-secondary` color
- Empty array renders `PATH: ` with no entries
- No interactivity — display only

## Note
In practice, the `StatusBar` component already renders the breadcrumb inline using `navigationStore.breadcrumb`. This component exists for cases where you need the breadcrumb path somewhere other than the status bar.

## Acceptance Criteria
- [ ] `['MAIN', 'EXPERIENCE']` renders as `PATH: MAIN > EXPERIENCE`
- [ ] Empty array renders as `PATH: `
- [ ] Uses `--bbs-secondary` color
