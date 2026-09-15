export type ManagedOwnership = 'managed-file' | 'managed-block';

export type ManagedEntry =
  | {
      path: string;
      ownership: 'managed-file';
    }
  | {
      path: string;
      ownership: 'managed-block';
      blockId: string;
    };

export interface DesignManifest {
  schemaVersion: 1;
  contractVersion: string;
  managed: ManagedEntry[];
}

export interface ManagedBlockUpdate {
  id: string;
  content: string;
}

function startMarker(id: string): string {
  return `<!-- vaoferi-design:start:${id} -->`;
}

function endMarker(id: string): string {
  return `<!-- vaoferi-design:end:${id} -->`;
}

function countOccurrences(source: string, needle: string): number {
  if (needle.length === 0) {
    return 0;
  }

  let count = 0;
  let offset = 0;

  while (true) {
    const index = source.indexOf(needle, offset);
    if (index === -1) {
      return count;
    }

    count += 1;
    offset = index + needle.length;
  }
}

export function createManagedBlock(id: string, content: string): string {
  return [startMarker(id), content, endMarker(id)].join('\n');
}

export function updateManagedBlock(
  document: string,
  update: ManagedBlockUpdate
): string {
  const start = startMarker(update.id);
  const end = endMarker(update.id);
  const startCount = countOccurrences(document, start);
  const endCount = countOccurrences(document, end);

  if (startCount > 1 || endCount > 1) {
    throw new Error(`MANAGED_BLOCK_DUPLICATE:${update.id}`);
  }

  if (startCount === 0 || endCount === 0) {
    throw new Error(`MANAGED_BLOCK_MISSING:${update.id}`);
  }

  const startIndex = document.indexOf(start);
  const endIndex = document.indexOf(end, startIndex + start.length);

  if (endIndex < startIndex) {
    throw new Error(`MANAGED_BLOCK_MALFORMED:${update.id}`);
  }

  const replacement = createManagedBlock(update.id, update.content);

  return (
    document.slice(0, startIndex) +
    replacement +
    document.slice(endIndex + end.length)
  );
}
