import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import {
  createCiEvidenceReport,
  type CiEvidenceInput
} from './ci-evidence.js';
import {
  serializeEvidenceReport,
  type EvidenceReport
} from './evidence.js';

export async function writeCiEvidenceFile(
  outputPath: string,
  input: CiEvidenceInput
): Promise<EvidenceReport> {
  const report = createCiEvidenceReport(input);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serializeEvidenceReport(report), 'utf8');

  return report;
}
