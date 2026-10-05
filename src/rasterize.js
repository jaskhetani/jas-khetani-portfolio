// OffscreenCanvas: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
// Shared worker path + cooperatively scheduled fallback. No DOM needed in the worker.
export async function rasterize({width,tileHeight,stamps,palette}){
 const canvas=(w,h)=>{if(typeof OffscreenCanvas!=='undefined')return new OffscreenCanvas(w,h);const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 const petal=new Path2D('M0 0 C-6-2-9-8-5-12 Q-2-15 0-11 Q3-15 6-11 C10-6 5-1 0 0Z');
 const sprites=palette.map(color=>{const c=canvas(48,48),x=c.getContext('2d');x.translate(24,24);x.fillStyle=color;for(let i=0;i<5;i++){x.save();x.rotate(i*Math.PI*2/5);x.fill(petal);x.restore();}x.fillStyle='#ac704b';x.fillRect(-1,-1,2,2);return c;});
 const tiles=new Map();let count=0;
 for(const [x,y,s,rotation,color] of stamps){
  const first=Math.max(0,Math.floor((y-24)/tileHeight)),last=Math.floor((y+24)/tileHeight),a=rotation*Math.PI/180,ca=Math.cos(a)*s,sa=Math.sin(a)*s;
  for(let k=first;k<=last;k++){if(!tiles.has(k)){const c=canvas(width,tileHeight);tiles.set(k,{c,ctx:c.getContext('2d')});}const {ctx}=tiles.get(k);ctx.setTransform(ca,sa,-sa,ca,x,y-k*tileHeight);ctx.drawImage(sprites[color],-24,-24);}
  if(++count%400===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 const output=[];
 for(const [k,{c}] of tiles){const blob=c.convertToBlob?await c.convertToBlob({type:'image/png'}):await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('Unable to render blossom tile');output.push({k,blob});}
 return output;
}
