import { writeCiEvidenceFile } from './write-ci-evidence.js';
import { serializeEvidenceReport } from './evidence.js';

const outputPath = process.env.EVIDENCE_PATH ?? 'artifacts/evidence.json';
const unitResult = process.env.UNIT_RESULT ?? 'unknown';
const browserResult = process.env.BROWSER_RESULT ?? 'unknown';
const generatedAt = process.env.EVIDENCE_GENERATED_AT ?? new Date().toISOString();

const report = await writeCiEvidenceFile(outputPath, {
  unitResult,
  browserResult,
  generatedAt
});

process.stdout.write(serializeEvidenceReport(report));
