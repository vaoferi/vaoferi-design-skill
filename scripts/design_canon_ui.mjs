// Reproduce the line geometry of the starred MIT UI reference, not an asserted original BONT template.
// Source HTML is parsed as data, never executed.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const source='https://github.com/Oleg-Kolosov/Golden-Canon-Grid-for-UI-Design';
export function parseGuide(html){
  const lines=[];
  const tag=/<line\b[^>]*>/gi;
  for(const m of html.matchAll(tag)){
    const get=k=>{const a=m[0].match(new RegExp('\\b'+k+'="([0-9]+(?:\\.[0-9]+)?)%?"'));if(!a)throw Error('Unexpected source coordinate');const x=Number(a[1]);if(x<0||x>100)throw Error('Coordinate outside artboard');return x/100;};
    const [x1,y1,x2,y2]=['x1','y1','x2','y2'].map(get);
    const kind=x1===x2?'vertical':y1===y2?'horizontal':'diagonal';
    lines.push({kind,x1,y1,x2,y2});
  }
  const counts=Object.fromEntries(['vertical','horizontal','diagonal'].map(k=>[k,lines.filter(l=>l.kind===k).length]));
  if(Object.values(counts).some(n=>n===0))throw Error('Incomplete Golden Canon template');
  return {lines,counts};
}
export function guideSvg(guide,width,height){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('Invalid artboard');
  const colors={vertical:'#e11d48',horizontal:'#2563eb',diagonal:'#a16207'};
  const lines=guide.lines.map(l=>'<line x1="'+l.x1*width+'" y1="'+l.y1*height+'" x2="'+l.x2*width+'" y2="'+l.y2*height+'" stroke="'+colors[l.kind]+'"/>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+'"><title>Golden Canon UI reference overlay</title><g opacity=".65" stroke-width="1">'+lines+'</g></svg>';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    const [,,dir,sha,w,h,out]=process.argv;
    if(!dir||!sha||!/^[0-9a-f]{40}$/.test(sha)||!out)throw Error('Usage: node design_canon_ui.mjs approved-checkout reviewed-sha width height output-prefix');
    const git=(...a)=>execFileSync('git',a,{cwd:dir,encoding:'utf8',timeout:10000}).trim();
    if(git('rev-parse','HEAD')!==sha||git('status','--porcelain','--untracked-files=all')||git('remote','get-url','origin')!==source+'.git')throw Error('Source checkout identity mismatch');
    const guide=parseGuide(readFileSync(join(dir,'index.html'),'utf8'));
    const width=Number(w),height=Number(h);
    const svg=guideSvg(guide,width,height);
    writeFileSync(out+'.svg',svg);writeFileSync(out+'.json',JSON.stringify({...guide,width,height,source:source+'/blob/'+sha+'/index.html',license:'MIT',attribution:'Copyright (c) 2020 Oleg Churilo'},null,2));
  }catch(e){console.error(String(e));process.exitCode=1;}
}
