// Source-based macro guides. A guide is a planning artifact, not a browser PASS.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const canonColumns=[1,1,2,1.33,1,1.58,4.83,3.167,3.167,4.83,1.58,1,1.33,2,1,1];
const canonRows=[1,3.03,1.33,2.7,2.7,1.33,1.57,1.45,1];
const source='https://github.com/niktariy/CSS-Golden-Canon-Grid/blob/6fec51d0f15ac11597f5c40b52575ea74a058f11/styles/all.css';
export function plan(profile,width,height,{gutter=0,inset=0,columns,rows=4}={}){
  if(![width,height,gutter,inset].every(Number.isFinite)||width<=0||height<=0||gutter<0||inset<0||inset*2>=Math.min(width,height))throw Error('Invalid geometry');
  if(!['columns-12','modular','golden-canon-inspired'].includes(profile))throw Error('Unknown profile; exact BONT requires its actual template');
  if(columns!==undefined&&(!Number.isInteger(columns)||columns<1||columns>24))throw Error('Invalid columns');
  if(!Number.isInteger(rows)||rows<1||rows>40)throw Error('Invalid rows');
  const weights=profile==='golden-canon-inspired'?canonColumns:Array(columns??(profile==='columns-12'?12:4)).fill(1);
  const heights=profile==='golden-canon-inspired'?canonRows:profile==='modular'?Array(rows).fill(1):[1];
  function tracks(size,weights,gap){
    const usable=size-2*inset-gap*(weights.length-1);if(usable<=0)throw Error('Gutters exceed available area');
    const sum=weights.reduce((a,b)=>a+b,0);let pos=inset;
    return weights.map((w,i)=>{const start=pos,end=start+usable*w/sum;pos=end+gap;return {index:i+1,start,end};});
  }
  return {profile,width,height,gutter,inset,source:profile==='golden-canon-inspired'?source:null,columns:tracks(width,weights,gutter),rows:tracks(height,heights,profile==='columns-12'?0:gutter)};
}
export function svg(p){
  const lines=[];
  for(const c of p.columns)for(const x of [c.start,c.end])lines.push('<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+p.height+'" stroke="#e11d48"/>');
  for(const r of p.rows)for(const y of [r.start,r.end])lines.push('<line x1="0" y1="'+y+'" x2="'+p.width+'" y2="'+y+'" stroke="#2563eb"/>');
  if(p.profile==='golden-canon-inspired')lines.push('<path d="M0 0 L'+p.width+' '+p.height+' M0 '+p.height+' L'+p.width+' 0" stroke="#a16207" stroke-dasharray="6 5" fill="none"/>');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+p.width+' '+p.height+'" width="'+p.width+'" height="'+p.height+'"><title>'+p.profile+' planning guide</title><g stroke-width="1" opacity=".65">'+lines.join('')+'</g></svg>';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{const [, ,profile,w,h,out,opts]=process.argv;if(!out)throw Error('Usage: node design_grid_plan.mjs profile width height output-prefix [JSON-options]');const p=plan(profile,Number(w),Number(h),opts?JSON.parse(opts):{});writeFileSync(out+'.json',JSON.stringify(p,null,2));writeFileSync(out+'.svg',svg(p));}
  catch(e){console.error(String(e));process.exitCode=1;}
}
