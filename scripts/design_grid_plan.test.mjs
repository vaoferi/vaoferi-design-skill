import test from 'node:test';
import assert from 'node:assert/strict';
import {plan,svg} from './design_grid_plan.mjs';
test('12-column plan has gutters and correct boundary',()=>{const p=plan('columns-12',1440,900,{gutter:16,inset:32});assert.equal(p.columns.length,12);assert.equal(p.columns[0].start,32);assert.ok(Math.abs(p.columns.at(-1).end-1408)<1e-8);});
test('source-based canon has 16 asymmetric-weight tracks and 9 rows',()=>{const p=plan('golden-canon-inspired',1440,900);assert.equal(p.columns.length,16);assert.equal(p.rows.length,9);assert.notEqual(p.columns[0].end-p.columns[0].start,p.columns[6].end-p.columns[6].start);assert.match(p.source,/CSS-Golden-Canon-Grid/);assert.match(svg(p),/planning guide/);});
test('unknown exact template and impossible dimensions fail',()=>{assert.throws(()=>plan('golden-canon',100,100));assert.throws(()=>plan('columns-12',100,100,{gutter:20}));});
test('mobile and modular profiles are explicit',()=>{assert.equal(plan('columns-12',390,844,{columns:4}).columns.length,4);assert.equal(plan('modular',390,844,{columns:2,rows:3}).rows.length,3);});
