import { runUnitSelfVerification } from './unit-self-verification.js';

const result = await runUnitSelfVerification();
console.log(JSON.stringify(result));

if (result.status !== 'PASS') {
  process.exitCode = 1;
}
