import { ALL_PROJECTS, shouldScopeToProject } from './sample-scope.util';

describe('sample-scope util', () => {
  it('exposes the "all" sentinel', () => {
    expect(ALL_PROJECTS).toBe('all');
  });

  it('scopes to a project for a real project id', () => {
    expect(shouldScopeToProject('a1b2c3d4-0000-0000-0000-000000000000')).toBe(
      true,
    );
  });

  it('does NOT scope when the id is the "all" sentinel', () => {
    expect(shouldScopeToProject('all')).toBe(false);
  });

  it('does NOT scope when the id is missing', () => {
    expect(shouldScopeToProject(undefined)).toBe(false);
    expect(shouldScopeToProject(null)).toBe(false);
    expect(shouldScopeToProject('')).toBe(false);
  });
});
