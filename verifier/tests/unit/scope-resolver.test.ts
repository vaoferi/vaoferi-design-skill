import { describe, expect, it } from 'vitest';
import {
  resolveDesignScopes,
  type DesignScope
} from '../../src/scopes/scope-resolver.js';

const scopes: DesignScope[] = [
  {
    id: 'frontend',
    profile: 'public-content',
    paths: ['frontend/**', 'views/public/**'],
    routes: ['/**'],
    excludeRoutes: ['/admin/**'],
    contractPath: '.design/scopes/frontend/contract.json'
  },
  {
    id: 'admin',
    profile: 'admin-dense',
    paths: ['backend/**', 'views/admin/**'],
    routes: ['/admin/**'],
    contractPath: '.design/scopes/admin/contract.json'
  },
  {
    id: 'shared-ui',
    profile: 'application-standard',
    paths: ['packages/shared-ui/**'],
    routes: [],
    sharedWith: ['frontend', 'admin'],
    contractPath: '.design/scopes/shared-ui/contract.json'
  }
];

describe('resolveDesignScopes', () => {
  it('uses explicit scope selection before path and route inference', () => {
    const result = resolveDesignScopes({
      explicitScopeId: 'admin',
      touchedFiles: ['frontend/pages/home.tsx'],
      routes: ['/'],
      scopes
    });

    expect(result).toEqual({
      status: 'RESOLVED',
      scopeIds: ['admin'],
      resolution: 'explicit'
    });
  });

  it('resolves independent frontend and admin files as a legal multi-scope task', () => {
    const result = resolveDesignScopes({
      touchedFiles: ['frontend/pages/home.tsx', 'backend/views/user/update.php'],
      routes: [],
      scopes
    });

    expect(result).toEqual({
      status: 'RESOLVED',
      scopeIds: ['admin', 'frontend'],
      resolution: 'path'
    });
  });

  it('uses route mapping only when path mapping did not resolve the surface', () => {
    const result = resolveDesignScopes({
      touchedFiles: [],
      routes: ['/admin/users/42'],
      scopes
    });

    expect(result).toEqual({
      status: 'RESOLVED',
      scopeIds: ['admin'],
      resolution: 'route'
    });
  });

  it('prefers a dedicated shared scope path over broad route matches', () => {
    const result = resolveDesignScopes({
      touchedFiles: ['packages/shared-ui/Button.tsx'],
      routes: ['/'],
      scopes
    });

    expect(result).toEqual({
      status: 'RESOLVED',
      scopeIds: ['shared-ui'],
      resolution: 'path'
    });
  });

  it('blocks when one touched UI file matches multiple unrelated scopes', () => {
    const overlapping: DesignScope[] = [
      {
        id: 'frontend',
        profile: 'public-content',
        paths: ['src/ui/**'],
        routes: [],
        contractPath: '.design/scopes/frontend/contract.json'
      },
      {
        id: 'admin',
        profile: 'admin-dense',
        paths: ['src/ui/**'],
        routes: [],
        contractPath: '.design/scopes/admin/contract.json'
      }
    ];

    const result = resolveDesignScopes({
      touchedFiles: ['src/ui/Button.tsx'],
      routes: [],
      scopes: overlapping
    });

    expect(result).toEqual({
      status: 'AMBIGUOUS',
      candidates: ['admin', 'frontend'],
      subject: 'src/ui/Button.tsx'
    });
  });

  it('blocks when a touched UI file cannot be mapped', () => {
    const result = resolveDesignScopes({
      touchedFiles: ['unknown/widget.tsx'],
      routes: [],
      scopes
    });

    expect(result).toEqual({
      status: 'UNMAPPED',
      subject: 'unknown/widget.tsx'
    });
  });
});
