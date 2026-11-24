import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGuide,guideSvg} from './design_canon_ui.mjs';
const sample='<line x1="50%" y1="0" x2="50%" y2="100%"/><line x1="0" y1="25%" x2="100%" y2="25%"/><line x1="0" y1="0" x2="100%" y2="100%"/>';
test('parse normalized source geometry',()=>{const g=parseGuide(sample);assert.deepEqual(g.counts,{vertical:1,horizontal:1,diagonal:1});assert.match(guideSvg(g,1440,900),/x1="720"/);});
test('reject invalid or incomplete source geometry',()=>{assert.throws(()=>parseGuide(''));assert.throws(()=>parseGuide(sample.replace('50%','150%')));assert.throws(()=>guideSvg(parseGuide(sample),0,900));});
