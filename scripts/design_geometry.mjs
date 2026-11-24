// Additive Playwright gate: explicit anchors and scroll policy; does not replace canonical verifier.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
export function evaluateGeometry(data, tolerance = 1) {
  const findings = [];
  if (data.documentOverflow > tolerance) findings.push({ kind: 'document-overflow', px: data.documentOverflow });
  if (data.viewportFit && data.documentVerticalOverflow > tolerance) findings.push({kind:'viewport-fit',px:data.documentVerticalOverflow});
  for (const x of data.scroll) if (!x.allowed && (x.x > tolerance || x.y > tolerance)) findings.push({kind:'nested-scroll-or-clipping', ...x});
  for (const a of data.anchors) {
    if (!a.values.length || a.missing) findings.push({kind:'missing-anchor',name:a.name});
    else if (Math.max(...a.values)-Math.min(...a.values)>tolerance) findings.push({kind:'alignment',name:a.name,values:a.values});
  }
  return findings;
}
export function validateSpec(spec) {
  if (!Array.isArray(spec.states) || !spec.states.length) throw Error('Explicit states required');
  const names = new Set();
  for (const s of spec.states) {
    if (!/^[a-zA-Z0-9_-]+$/.test(s.id || '') || names.has(s.id)) throw Error('Unique safe state id required');
    names.add(s.id);
    if (!Number.isInteger(s.width) || !Number.isInteger(s.height) || s.width<1 || s.height<1) throw Error('Explicit viewport required');
    if (!['reduce','no-preference'].includes(s.motion)) throw Error('Explicit motion preference required');
    if (!s.ready || !Array.isArray(s.anchors) || !s.anchors.length || !Array.isArray(s.containers) || !s.containers.length) throw Error('Ready selector, anchors and containers required');
    for(const a of s.anchors) if(!a.name || !['left','right','top','bottom','centerX','centerY'].includes(a.edge) || !Array.isArray(a.selectors) || a.selectors.length<2 || a.selectors.some(x=>typeof x!=='string'||!x.trim())) throw Error('Invalid anchor');
    if(!Array.isArray(s.gridlines)||!s.gridlines.length)throw Error('Explicit Gridlines targets required');
    for(const g of s.gridlines){
      if(!g.selector||!Array.isArray(g.exceptions||[]))throw Error('Invalid Gridlines target');
      for(const e of g.exceptions||[])if(!e.item||!e.edge||!Number.isFinite(e.y)||!Number.isFinite(e.px)||!Number.isFinite(e.line)||!e.reason||!e.approval)throw Error('Gridlines exception requires exact coordinates and approval');
    }
    for(const c of s.containers) if(!c.selector || (c.allowScroll && !c.reason)) throw Error('Scroll exception needs selector/reason');
  }
}
export function gridlineFindings(rows, exceptions=[]) {
  if(!Array.isArray(rows)||rows.length!==1||!Array.isArray(rows[0].rows)||!rows[0].rows.length||!Array.isArray(rows[0].outliers))throw Error('Gridlines target missing, ambiguous or unmeasurable');
  return rows[0].outliers.filter(o=>!exceptions.some(e=>['item','edge','y','px','line'].every(k=>o[k]===e[k]))).map(o=>({kind:'gridlines-review-required',...o}));
}
function approvedProbe(){
  const dir=process.env.GRIDLINES_DIR, sha=process.env.GRIDLINES_SHA;
  if(!dir||!sha||!/^[0-9a-f]{40}$/.test(sha))throw Error('GRIDLINES_DIR and reviewed GRIDLINES_SHA required');
  const git=(...args)=>execFileSync('git',args,{cwd:dir,encoding:'utf8',timeout:10000}).trim();
  if(git('rev-parse','HEAD')!==sha||git('status','--porcelain','--untracked-files=all')||git('remote','get-url','origin')!=='https://github.com/pritamux/gridlines.git')throw Error('Gridlines checkout identity or cleanliness mismatch');
  return readFileSync(join(dir,'probe.js'),'utf8');
}
async function run(specPath,outDir) {
  const spec=JSON.parse(readFileSync(specPath,'utf8')); validateSpec(spec);
  const url=new URL(spec.url); if(!['http:','https:'].includes(url.protocol)|| !['localhost','127.0.0.1','[::1]'].includes(url.hostname)) throw Error('Only local trusted preview allowed');
  const probe=approvedProbe();
  const require=createRequire(join(resolve(process.env.PW_DIR||process.cwd()),'noop.js'));
  const {chromium}=require('playwright');
  mkdirSync(outDir,{recursive:true});
  const browser=await chromium.launch();
  const results=[];
  try {
    for(const s of spec.states){
      const page=await browser.newPage({viewport:{width:s.width,height:s.height},reducedMotion:s.motion});
      try {
        await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:15000});
        if(s.prep){const {default:prepare}=await import(pathToFileURL(resolve(s.prep)).href); await prepare(page);}
        await page.locator(s.ready).first().waitFor({state:'visible',timeout:10000});
        // Wait for fonts and finite animations; no arbitrary sleep as proof.
        await page.evaluate(async()=>{
          await Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('fonts timeout')),8000))]);
          const end=performance.now()+8000;
          let stable=0;
          while(stable<2){
            const running=document.getAnimations().filter(a=>a.playState==='running' && Number.isFinite(a.effect?.getComputedTiming().endTime));
            stable=running.length?0:stable+1;
            if(performance.now()>end)throw Error('animation settle timeout');
            await new Promise(r=>requestAnimationFrame(r));
          }
        });
        if(new URL(page.url()).origin!==url.origin)throw Error('Preview redirected outside approved local origin');
        const data=await page.evaluate(s=>{
          const visible=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none';};
          const get=(r,edge)=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,centerX:(r.left+r.right)/2,centerY:(r.top+r.bottom)/2})[edge];
          const anchors=s.anchors.map(a=>{const groups=a.selectors.map(q=>[...document.querySelectorAll(q)].filter(visible));return{name:a.name,missing:groups.some(g=>g.length!==1),values:groups.flat().map(e=>get(e.getBoundingClientRect(),a.edge))};});
          const scroll=[];
          for(const c of s.containers){
            const nodes=[...document.querySelectorAll(c.selector)].filter(visible);
            if(!nodes.length)throw Error('Missing container '+c.selector);
            for(const e of nodes){
              const style=getComputedStyle(e);
              const x=Math.max(0,e.scrollWidth-e.clientWidth),y=Math.max(0,e.scrollHeight-e.clientHeight);
              const clips=v=>['hidden','clip','auto','scroll'].includes(v);
              scroll.push({selector:c.selector,x:clips(style.overflowX)?x:0,y:clips(style.overflowY)?y:0,allowed:!!c.allowScroll,reason:c.reason||null});
            }
          }
          const root=document.documentElement;
          return{documentOverflow:Math.max(0,root.scrollWidth-root.clientWidth),documentVerticalOverflow:Math.max(0,root.scrollHeight-root.clientHeight),viewportFit:!!s.viewportFit,anchors,scroll};
        },s);
        const findings=evaluateGeometry(data);
        await page.screenshot({path:join(outDir,s.id+'.png')});
        const gridlines=[];
        await page.addScriptTag({content:probe});
        for(const [index,g] of s.gridlines.entries()){
          if(await page.locator(g.selector).count()!==1)throw Error('Gridlines selector must resolve to one container: '+g.selector);
          const rows=await page.evaluate(selector=>window.__gridlines({containers:selector}),g.selector);
          findings.push(...gridlineFindings(rows,g.exceptions||[]).map(o=>({...o,selector:g.selector})));
          gridlines.push({selector:g.selector,rows,exceptions:g.exceptions||[]});
          await page.screenshot({path:join(outDir,s.id+'-guides-'+index+'.png')});
          await page.evaluate(()=>document.querySelectorAll('[data-gridline]').forEach(e=>e.remove()));
        }
        results.push({id:s.id,width:s.width,height:s.height,motion:s.motion,status:findings.length?'FAIL':'PASS',data,gridlines,findings});
      }catch(e){results.push({id:s.id,status:'BLOCKED',reason:String(e)});}
      finally{await page.close();}
    }
  }finally{await browser.close();}
  const status=results.some(x=>x.status==='BLOCKED')?'BLOCKED':results.some(x=>x.status==='FAIL')?'FAIL':'PASS';
  const result={status,scope:'explicit geometry and Gridlines (not full design verification)',gridlinesSha:process.env.GRIDLINES_SHA,states:results};
  writeFileSync(join(outDir,'geometry.json'),JSON.stringify(result,null,2)); console.log(JSON.stringify(result)); return status==='PASS'?0:1;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{if(!process.argv[2]||!process.argv[3])throw Error('Usage: node design_geometry.mjs spec.json evidence-dir');process.exitCode=await run(process.argv[2],process.argv[3]);}
  catch(e){console.error(JSON.stringify({status:'BLOCKED',reason:String(e)}));process.exitCode=1;}
}
