export type SurfaceProfile =
  | 'public-content'
  | 'marketing-editorial'
  | 'application-standard'
  | 'admin-standard'
  | 'admin-dense'
  | 'custom-approved';

export interface DesignScope {
  id: string;
  profile: SurfaceProfile;
  paths: string[];
  routes: string[];
  excludeRoutes?: string[];
  entrypoints?: string[];
  sharedWith?: string[];
  contractPath: string;
}

export interface ScopeResolutionInput {
  explicitScopeId?: string;
  touchedFiles: string[];
  routes: string[];
  scopes: DesignScope[];
}

export type ScopeResolutionResult =
  | {
      status: 'RESOLVED';
      scopeIds: string[];
      resolution: 'explicit' | 'path' | 'route';
    }
  | {
      status: 'AMBIGUOUS';
      candidates: string[];
      subject: string;
    }
  | {
      status: 'UNMAPPED';
      subject: string;
    };

function globToRegExp(pattern: string): RegExp {
  let source = '';

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];

    if (char === '*') {
      if (pattern[index + 1] === '*') {
        source += '.*';
        index += 1;
      } else {
        source += '[^/]*';
      }
      continue;
    }

    if ('\\^$+?.()|{}[]'.includes(char)) {
      source += `\\${char}`;
    } else {
      source += char;
    }
  }

  return new RegExp(`^${source}$`, 'u');
}

function matchesAny(value: string, patterns: string[] | undefined): boolean {
  return (patterns ?? []).some((pattern) => globToRegExp(pattern).test(value));
}

function sortedUnique(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function matchingScopesForPath(file: string, scopes: DesignScope[]): DesignScope[] {
  return scopes.filter((scope) => matchesAny(file, scope.paths));
}

function matchingScopesForRoute(route: string, scopes: DesignScope[]): DesignScope[] {
  return scopes.filter((scope) => {
    const included = matchesAny(route, scope.routes);
    const excluded = matchesAny(route, scope.excludeRoutes);
    return included && !excluded;
  });
}

export function resolveDesignScopes(input: ScopeResolutionInput): ScopeResolutionResult {
  if (input.explicitScopeId) {
    const explicit = input.scopes.find((scope) => scope.id === input.explicitScopeId);
    if (!explicit) {
      return {
        status: 'UNMAPPED',
        subject: `scope:${input.explicitScopeId}`
      };
    }

    return {
      status: 'RESOLVED',
      scopeIds: [explicit.id],
      resolution: 'explicit'
    };
  }

  const pathScopeIds = new Set<string>();
  let hasPathResolution = false;

  for (const file of input.touchedFiles) {
    const matches = matchingScopesForPath(file, input.scopes);

    if (matches.length > 1) {
      return {
        status: 'AMBIGUOUS',
        candidates: sortedUnique(matches.map((scope) => scope.id)),
        subject: file
      };
    }

    if (matches.length === 1) {
      hasPathResolution = true;
      pathScopeIds.add(matches[0]!.id);
      continue;
    }

    if (input.routes.length === 0) {
      return {
        status: 'UNMAPPED',
        subject: file
      };
    }
  }

  if (hasPathResolution) {
    return {
      status: 'RESOLVED',
      scopeIds: sortedUnique(pathScopeIds),
      resolution: 'path'
    };
  }

  const routeScopeIds = new Set<string>();

  for (const route of input.routes) {
    const matches = matchingScopesForRoute(route, input.scopes);

    if (matches.length > 1) {
      return {
        status: 'AMBIGUOUS',
        candidates: sortedUnique(matches.map((scope) => scope.id)),
        subject: route
      };
    }

    if (matches.length === 0) {
      return {
        status: 'UNMAPPED',
        subject: route
      };
    }

    routeScopeIds.add(matches[0]!.id);
  }

  if (routeScopeIds.size > 0) {
    return {
      status: 'RESOLVED',
      scopeIds: sortedUnique(routeScopeIds),
      resolution: 'route'
    };
  }

  return {
    status: 'UNMAPPED',
    subject: input.touchedFiles[0] ?? input.routes[0] ?? 'task'
  };
}
