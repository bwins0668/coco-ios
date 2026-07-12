# Python Shard Architecture

## Scope

R8.PYTHON-SHARD-TRAIN1-AUTO introduces a second Python subpackage:

- legacy package: `packages/python-course`
- new shard: `packages/python-course-foundations-b`

The legacy package keeps the accepted Python home route, current six lessons,
khaki visual contract, and old direct-entry routes. The new shard is only for
new Train1 lesson data and shard-local chapter / lesson routes.

## Dependency Boundary

- Main package may read `utils/python-public-course-summary.js`.
- Main package must not require `packages/python-course/**`.
- Main package must not require `packages/python-course-foundations-b/**`.
- `packages/python-course/**` must not require the new shard lesson data.
- The new shard may own its manifest, chapter data, loader, pages, and styles.

## Public Projection

Main-package projection remains a small public summary: published lesson IDs,
route labels, home route, and availability. Lesson bodies, code examples,
source mapping, EPUB metadata, and candidate lists stay out of the main package.

## Route Model

`app.json` declares the new shard with:

- `/packages/python-course-foundations-b/pages/chapter/chapter`
- `/packages/python-course-foundations-b/pages/lesson/lesson`

The shard loader is fail-closed: unknown `chapterId` or `sectionId` returns
`null`, and the page renders the existing controlled error state.

## Package Scale

`tools/audit_miniprogram_package_size.js` already reports every declared
subpackage separately. `tools/check_python_package_scale_contract.js` verifies
that both the legacy package and the new shard stay below the Python package
thresholds.
