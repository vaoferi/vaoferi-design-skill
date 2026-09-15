import { runBrowserSelfVerification } from './browser-self-verification.js';

const result = await runBrowserSelfVerification();
console.log(JSON.stringify(result));

if (result.status !== 'PASS') {
  process.exitCode = 1;
}
