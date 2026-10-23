## Summary

<!-- Briefly describe what this PR changes and why. -->

## Related Issue

<!-- Link the issue this PR resolves, e.g. "Closes #123". -->

Closes #

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactor
- [ ] Test improvement
- [ ] Dependency / maintenance

## Components Affected

- [ ] Backend
- [ ] Web
- [ ] Mobile
- [ ] Docs
- [ ] Infrastructure / CI

## Testing Performed

<!-- Tick everything you ran for the components you changed. See CONTRIBUTING.md for per-component commands. -->

- [ ] `npm test`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run openapi:generate` (backend API changes; commit the updated `docs/public/openapi/openapi.json`)
- [ ] `flutter analyze`
- [ ] `melos run test`
- [ ] Manual testing

<!-- Describe manual testing steps, devices, or browsers used, if applicable. -->

## Database Changes

<!-- Delete this section if the PR has no database changes. -->

- **Migration included?** Yes / No
- **Existing data affected?** Yes / No — <!-- describe any backfill or data transformation -->
- **Rollback plan:** <!-- how to revert, e.g. `npm run migration:revert` -->

## Screenshots / Recordings

<!-- For UI changes, add before/after screenshots or a short recording. Remove all personal, health, and location data. -->

## Deployment Notes

<!-- Delete this section if there is nothing to note. -->

- **New environment variables:** <!-- list them and add placeholders to .env.example -->
- **Infrastructure changes:** <!-- Docker Compose, nginx, CI, storage, etc. -->
- **Breaking changes:** <!-- API contract changes, mobile app compatibility, required upgrade steps -->

## Checklist

- [ ] Code follows project standards (see `CONTRIBUTING.md`)
- [ ] Tests added or updated where appropriate
- [ ] Documentation updated
- [ ] No secrets, credentials, OTPs, or production data included
- [ ] Migration included for schema changes
- [ ] OpenAPI spec regenerated and committed for API changes
- [ ] Sensitive data removed from screenshots and logs
