export type SourceOwnership = 'authored' | 'vendor' | 'generated';

export function isProjectAuthored(ownership: SourceOwnership): boolean {
  return ownership === 'authored';
}
