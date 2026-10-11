import { rasterize } from './rasterize.js';

/* One document-space geometry. Every root/limb starts on its parent;
   the ground is measured from the REAL footer, never an isolated preview. */
(() => {
'use strict';
const NS='http://www.w3.org/2000/svg',svg=document.querySelector('#tree'),page=document.querySelector('.page'),ground=document.querySelector('.ground'),main=document.querySelector('.content'),air=document.querySelector('#petal-air'),airCtx=air.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches,seed=9127,geometry={},particles=[],sources=[],clock=0,last=0,stats={},raf=0,timer=0,viewY=scrollY,signature='',builds=0;
const petal=new Path2D('M0 0 C-6-2-9-8-5-12 Q-2-15 0-11 Q3-15 6-11 C10-6 5-1 0 0Z');
const leaf=new Path2D('M0-13 C9-11 12-2 1 12 C-10 2-10-9 0-13Z');
const palette=['#f7c7d8','#edabc5','#fbe1e9','#e693b4','#f4bed1'];
const leafPalette=['#718068','#8f7554','#b57a5f','#67745d'];
let painter=null, blobUrls=[];
function sizeAir(){const d=Math.min(devicePixelRatio||1,1.5);air.width=Math.round(innerWidth*d);air.height=Math.round(innerHeight*d);airCtx.setTransform(d,0,0,d,0,0)}
function layoutKey(){return [page.clientWidth,page.offsetHeight,ground.offsetTop,...[...main.querySelectorAll('.section')].map(e=>Math.round(e.offsetTop+e.offsetHeight))].join('|')}

function rng(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,v);if(parent)parent.appendChild(e);return e}
function pt(x,y){return{x,y}}
function bez(c,t){const u=1-t;return pt(u*u*u*c[0].x+3*u*u*t*c[1].x+3*u*t*t*c[2].x+t*t*t*c[3].x,u*u*u*c[0].y+3*u*u*t*c[1].y+3*u*t*t*c[2].y+t*t*t*c[3].y)}
function widthAt(w0,w1,t){return w1+(w0-w1)*Math.pow(1-t,1.25)}
function ribbon(c,w0,w1,parent,kind,fill){const a=[],b=[];for(let i=0;i<=36;i++){const t=i/36,p=bez(c,t),q=bez(c,Math.min(1,t+.001)),r=bez(c,Math.max(0,t-.001)),dx=q.x-r.x,dy=q.y-r.y,len=Math.hypot(dx,dy)||1,w=widthAt(w0,w1,t)/2;a.push([p.x-dy/len*w,p.y+dx/len*w]);b.push([p.x+dy/len*w,p.y-dx/len*w])}const d='M'+a.map(p=>p.join(',')).join(' L')+' L'+b.reverse().map(p=>p.join(',')).join(' L')+'Z';return el('path',{d,fill, 'data-kind':kind},parent)}
function curve(c){return `M${c[0].x},${c[0].y} C${c[1].x},${c[1].y} ${c[2].x},${c[2].y} ${c[3].x},${c[3].y}`}
function build(){
const buildStarted=performance.now();
const key=layoutKey();if(key===signature)return;signature=key;builds++;
seed=9127;svg.replaceChildren();sources=[];particles=[];stats={landed:0,exited:0,spawned:0,frames:0,maxStepMs:0,scrollBursts:0};clock=0;sizeAir();
const stamps=[],tileHeight=512;
if(painter){painter.terminate();painter=null;}
for(const url of blobUrls)URL.revokeObjectURL(url);blobUrls=[];

const W=page.clientWidth,H=page.offsetHeight,mobile=W<=700,rail=main.offsetLeft,G=ground.offsetTop+84,X=mobile?42:Math.min(180,W*.13),forkY=mobile?325:445,baseW=mobile?62:146,topW=mobile?23:44;
svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.style.height=H+'px';
const defs=el('defs',{},svg);
defs.innerHTML=`<linearGradient id="wood" gradientUnits="userSpaceOnUse" x1="${X-baseW/2}" x2="${X+baseW/2}" y1="0" y2="0"><stop stop-color="#251b17"/><stop offset=".42" stop-color="#493225"/><stop offset=".67" stop-color="#5b4030"/><stop offset="1" stop-color="#2d211b"/></linearGradient><linearGradient id="earthWood" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${G-58}" y2="${G+250}"><stop stop-color="#423025"/><stop offset=".19" stop-color="#62432c"/><stop offset=".5" stop-color="#a8753c"/><stop offset=".82" stop-color="#c29959"/><stop offset="1" stop-color="#b48b50"/></linearGradient><path id="petalShape" d="M0 0 C-6-2-9-8-5-12 Q-2-15 0-11 Q3-15 6-11 C10-6 5-1 0 0Z"/><g id="bloomShape">${[0,72,144,216,288].map(r=>`<use href="#petalShape" transform="rotate(${r})"/>`).join('')}<path d="M-2 0H2M0-2V2" stroke="#ac704b" stroke-width="1.4"/></g>`;
const roots=el('g',{id:'roots'},svg),trunks=el('g',{id:'trunk'},svg),limbs=el('g',{id:'limbs'},svg),flowers=el('g',{id:'flowers'},svg),litter=el('g',{id:'litter'},svg);
const trunk=[pt(X,G),pt(X-18,G-(G-forkY)*.30),pt(X+21,forkY+(G-forkY)*.24),pt(X+8,forkY)];
geometry={W,H,rail,builds,groundY:G,forkY,base:trunk[0],fork:trunk[3],baseWidth:baseW,topWidth:topW,trunk,connections:[],widthSamples:[],crownDirections:[],flowerCount:0};
for(let i=0;i<=10;i++)geometry.widthSamples.push(widthAt(baseW,topW,i/10));
const tp=ribbon(trunk,baseW,topW,trunks,'trunk','url(#earthWood)');tp.id='trunk-shape';
const clip=el('clipPath',{id:'barkClip'},defs);el('use',{href:'#trunk-shape'},clip);
const grain=el('g',{'clip-path':'url(#barkClip)'},trunks);
// restrained longitudinal grain, clipped inside the actual taper
for(let i=0;i<9;i++){const k=(i/8-.5)*.88,points=[];for(let n=0;n<=36;n++){const t=.035+(n/36)*.93,p=bez(trunk,t),w=widthAt(baseW,topW,t);points.push([p.x+k*w+Math.sin(n*.53+i)*1.7,p.y])}el('path',{d:'M'+points.map(p=>p.join(',')).join(' L'),fill:'none',stroke:i%3===0?'#513c2e':'#3c2b22','stroke-width':i%3===0?.65:.8},grain)}
// Same root point as trunk; overlapping tapered volumes form one flared base.
const rootEnds=mobile?[[-110,120],[-55,280],[22,420],[135,360],[235,205],[285,85]]:[[-270,75],[-240,255],[-115,400],[35,475],[245,430],[385,265],[470,110]];
function root(c,w,depth,parentPoint){ribbon(c,w,.45,roots,'root','url(#earthWood)');geometry.connections.push({kind:'root',start:c[0],parent:parentPoint,error:Math.hypot(c[0].x-parentPoint.x,c[0].y-parentPoint.y)});if(!depth)return;for(let j=0;j<2;j++){const t=.43+j*.27,p=bez(c,t),end=c[3],dx=end.x-c[0].x,dy=end.y-c[0].y,side=j?1:-1;const e=pt(Math.min(mobile?70-rng()*12:rail-45-rng()*65,p.x+dx*.48+side*(mobile?10:35)),Math.min(H-12,p.y+dy*.48+40));const cc=[p,pt(p.x+(e.x-p.x)*.36,p.y+22),pt(e.x-(e.x-p.x)*.20,e.y-28),e];root(cc,widthAt(w,.45,t)*.60,depth-1,p)}}
rootEnds.forEach(([dx,dy],i)=>{const start=pt(X+(i/(rootEnds.length-1)-.5)*baseW*.68,G-18),e=pt(Math.min(mobile?74:rail-35,X+dx),Math.min(H-15,G+dy)),c=[start,pt(start.x+dx*.16,G+36),pt(e.x-dx*.25,e.y-25),e];root(c,baseW*(i===3?.40:.33),3,start)});
// Opaque color interpolation ONLY at soil junction, no alpha hiding joins.
// Root shoulders overlap the trunk contour at ground level; no detached collar.
const branchColor='#423025';
el('circle',{cx:trunk[3].x,cy:trunk[3].y,r:topW/2,fill:branchColor},limbs);
function blossom(x,y,s,rotation){if(y<-24||y>H+24)return;const color=Math.floor(rng()*palette.length);stamps.push([x,y,s,rotation,color]);geometry.flowerCount++;}
function spray(c,n,radius){for(let i=0;i<n;i++){const t=.28+rng()*.72,p=bez(c,t),a=rng()*Math.PI*2,r=Math.sqrt(rng())*radius;const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(y<-32||x<-60||x>W+60||(y>(mobile?390:520)&&y<G-40&&x>(mobile?70:rail-35)))continue;blossom(x,y,.30+rng()*.36,rng()*360);if(x>0&&x<W&&y>0&&sources.length<1400)sources.push(pt(x,y))}}
function branch(c,w,depth,parentPoint,crown=true){ribbon(c,w,.45,limbs,'branch',branchColor);geometry.connections.push({kind:'branch',start:c[0],parent:parentPoint,error:Math.hypot(c[0].x-parentPoint.x,c[0].y-parentPoint.y)});if(depth<=1)spray(c,crown?(c[3].y<390?130:65):22,crown?34:(mobile?8:15));if(depth===0)return;for(let j=0;j<3;j++){const t=.40+j*.25,p=bez(c,t),v=pt(c[3].x-c[0].x,c[3].y-c[0].y),len=Math.hypot(v.x,v.y),rawAngle=Math.atan2(v.y,v.x)+(j===1?-.53:j===0?.65:.18),angle=crown?(v.x>=0?Math.max(-1.7,Math.min(-.14,rawAngle)):Math.max(-3.0,Math.min(-1.65,rawAngle))):rawAngle,L=len*(.38+rng()*.14),e=pt(p.x+Math.cos(angle)*L,p.y+Math.sin(angle)*L);const bend=(rng()-.5)*.70,reach=.29+rng()*.12;const cc=[p,pt(p.x+Math.cos(angle+bend)*L*reach,p.y+Math.sin(angle+bend)*L*reach),pt(e.x-Math.cos(angle-bend*.8)*L*(.22+rng()*.14),e.y-Math.sin(angle-bend*.8)*L*(.22+rng()*.14)),e];branch(cc,widthAt(w,.45,t)*.64,depth-1,p,crown)}}
const F=trunk[3],crownCurves=[];
const crownEnds=[pt(-140,105),pt(-75,-105),pt(X+5,-155),pt(W*.37,-95),pt(W*.66,-90),pt(W+105,38),pt(W*.91,165)];
[0,2,5,1,3,4,6].forEach(i=>{const e=crownEnds[i],parent=i===1?crownCurves[0]:[3,4,6].includes(i)?crownCurves[5]:trunk,t=i===1?.48:i===3?.27:i===4?.51:i===6?.73:i===0?.965:1,p=bez(parent,t);geometry.crownDirections.push(e.x<X-20?'left':e.x>X+80?'right':'up');const isLeader=[0,2,5].includes(i),w=topW*(isLeader?(i===5?.91:.64):(.48-t*.24)),lift=isLeader?220:105,c=[p,pt(p.x+(e.x-p.x)*(.045+rng()*.10),p.y-lift),pt(e.x-(e.x-p.x)*(.22+rng()*.15),e.y+(isLeader?145:80)+rng()*46),e];crownCurves[i]=c;branch(c,w,3,p)});
// Flower-bearing twigs across the entire header, attached along existing crown limbs.
// Reinforce only their outer tips, rather than filling empty space with circles.
for(let i=0;i<42;i++){const e=pt(W*(i/41),-22+rng()*155),parent=e.x<W*.27?crownCurves[0]:e.x<W*.45?crownCurves[2]:crownCurves[5];
let nearest=.18,best=Infinity;for(let k=4;k<=22;k++){const t=k/24,q=bez(parent,t),score=Math.abs(q.x-e.x)+Math.abs(q.y-e.y)*.3;if(score<best){best=score;nearest=t}}const p=bez(parent,nearest),dx=e.x-p.x,dy=e.y-p.y;
branch([p,pt(p.x+dx*.18,p.y-55-rng()*62),pt(e.x-dx*.27,e.y+Math.max(18,Math.abs(dy)*.24)+rng()*35),e],3.2+rng()*2.4,1,p)}
// Content-relative limbs: more side branches, redistributed when sections grow or move.
const anchors=[...main.querySelectorAll('.section:not(.hero)')].flatMap(section=>[section.offsetTop+Math.min(section.offsetHeight*.35,230),section.offsetTop+Math.min(section.offsetHeight*.78,480)]).filter(y=>y>forkY+230&&y<G-210).slice(0,18);
geometry.sideBranchCount=anchors.length;
anchors.forEach((y,i)=>{let lo=0,hi=1;for(let n=0;n<20;n++){const t=(lo+hi)/2;if(bez(trunk,t).y>y)lo=t;else hi=t}const p=bez(trunk,(lo+hi)/2),direction=i%3===1?-1:1,extent=mobile?12:Math.max(30,Math.min(rail-X-55,270)),e=pt(p.x+extent*direction,p.y-(mobile?80:110+i%3*25));branch([p,pt(p.x+extent*(.19+rng()*.11)*direction,p.y-68-rng()*25),pt(e.x-extent*(.15+rng()*.20)*direction,e.y+26+rng()*24),e],mobile?7:16,2,p,false)});
const generation=builds, rasterStarted=performance.now(), current=()=>generation===builds;
const commitTiles=tiles=>{if(!current())return;for(const {k,blob} of tiles){const url=URL.createObjectURL(blob);blobUrls.push(url);el('image',{x:0,y:k*tileHeight,width:W,height:tileHeight,href:url,preserveAspectRatio:'none'},flowers);}geometry.flowerTiles=tiles.length;geometry.rasterMs=Math.round(performance.now()-rasterStarted);geometry.ready=true;document.documentElement.classList.add('tree-ready');window.dispatchEvent(new Event('tree-ready'));};
const payload={width:W,tileHeight,stamps,palette};
// rasterize() walks stamps lazily, so a superseded main-thread fallback stops drawing at its next stamp (same stamps, same order otherwise).
const liveStamps=function*(){for(const stamp of stamps){if(!current())return;yield stamp;}};
const fallback=()=>{if(!current())return;rasterize({...payload,stamps:liveStamps()}).then(commitTiles).catch(()=>{if(!current())return;geometry.renderError=true;document.documentElement.classList.add('tree-ready');});};
if(typeof Worker!=='undefined'&&typeof OffscreenCanvas!=='undefined'){
 // Callbacks only touch their own worker; painter may already belong to a newer build.
 try{const worker=new Worker(new URL('./blossoms.worker.js',import.meta.url),{type:'module'});painter=worker;const done=()=>{worker.terminate();if(painter===worker)painter=null;};worker.onmessage=e=>{done();if(e.data.error)fallback();else commitTiles(e.data.tiles);};worker.onerror=()=>{done();fallback();};worker.postMessage(payload);}catch{fallback();}
}else fallback();
for(let i=0;i<150;i++){const x=X-95+rng()*(mobile?210:500),y=G-6+rng()*17;el('use',{href:'#petalShape',transform:`translate(${x} ${y}) rotate(${55+rng()*90}) scale(${.28+rng()*.32})`,fill:i%3?'#f0b1c9':'#f7d4e0'},litter)}
const poolSize=mobile?12:22;
function resetParticle(q,initial=false){const src=sources[Math.floor(rng()*sources.length)]||pt(X,100);Object.assign(q,{x:src.x,y:src.y,angle:rng()*360,s:.35+rng()*.26,vx:3+rng()*10,vy:60+rng()*30,phase:rng()*6.28,state:'fall',rest:0,kind:'petal',color:0,spin:20});if(initial){q.x=X+rng()*W*.18;q.y=180+rng()*Math.max(1,G-250)}stats.spawned++;return q}
for(let i=0;i<poolSize;i++)particles.push(resetParticle({},true));
geometry.flowerSources=sources.length;geometry.particleLimit=poolSize;geometry.buildMs=Math.round(performance.now()-buildStarted);
function burstLeaves(strength=1){if(paused)return;const count=Math.min(poolSize,Math.max(6,Math.round(8+strength*8))),nearby=sources.filter(source=>source.y>viewY-120&&source.y<viewY+innerHeight*.55);for(let i=0;i<count;i++){const p=particles[i],src=nearby.length?nearby[Math.floor(rng()*nearby.length)]:pt(rng()*W,viewY-15-rng()*90);Object.assign(p,{x:src.x+(rng()-.5)*34,y:Math.max(viewY-90,src.y),angle:rng()*360,s:.48+rng()*.40,vx:-28+rng()*74,vy:95+rng()*95,phase:rng()*6.28,state:'fall',rest:0,kind:'leaf',color:Math.floor(rng()*leafPalette.length),spin:(rng()>.5?1:-1)*(95+rng()*150)});}stats.scrollBursts++;}
function step(dt){const begin=performance.now();clock+=dt;for(let i=0;i<particles.length;i++){const p=particles[i];if(p.state==='fall'){p.x+=(p.vx+Math.sin(clock*(p.kind==='leaf'?2.1:.6)+p.phase)*(p.kind==='leaf'?18:9))*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;if(p.y>=G-3){p.y=G-3;p.state='rest';p.rest=.6+(i%5)*.3;stats.landed++}}else if(p.state==='rest'){p.rest-=dt;if(p.rest<=0){p.state='ground';p.vx=55+(i%7)*8}}else{p.x+=p.vx*dt;p.y=G-3-Math.abs(Math.sin(clock*1.8+p.phase))*7;p.angle+=75*dt}if(p.x>W+36||p.x<-60||p.y>H+30){stats.exited++;resetParticle(p)}}stats.maxStepMs=Math.max(stats.maxStepMs,performance.now()-begin)}
function draw(){airCtx.clearRect(0,0,innerWidth,innerHeight);if(paused)return;for(const p of particles){const y=p.y-viewY;if(y<-25||y>innerHeight+25)continue;airCtx.save();airCtx.translate(p.x,y);airCtx.rotate(p.angle*Math.PI/180);if(p.kind==='leaf'){const tumble=.55+.45*Math.abs(Math.cos((clock*4+p.phase)));airCtx.scale(p.s*tumble,p.s);airCtx.fillStyle=leafPalette[p.color%leafPalette.length];airCtx.fill(leaf);}else{airCtx.scale(p.s,p.s);airCtx.fillStyle='#edafc7';airCtx.fill(petal);}airCtx.restore()}}
window.treeStudy={geometry,stats,get particles(){return particles.map(p=>({...p}))},step,draw,burstLeaves,paused:()=>paused,pendingFrame:()=>Boolean(raf)};
draw();
}
// 20 fps maximum; no DOM writes or layout reads per animation frame.
// Stop requesting frames altogether in background tabs / reduced-motion mode.
function tick(t){raf=0;if(paused||document.hidden)return;if(!last)last=t;if(t-last>=50){const dt=Math.min(.1,(t-last)/1000);last=t;window.treeStudy.step(dt);window.treeStudy.draw();stats.frames++}raf=requestAnimationFrame(tick)}
function syncMotion(){paused=reduced.matches;cancelAnimationFrame(raf);raf=0;last=0;if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);else if(window.treeStudy)window.treeStudy.draw()}
function scheduleBuild(){clearTimeout(timer);timer=setTimeout(()=>{build();syncMotion()},180)}
build();syncMotion();
new ResizeObserver(scheduleBuild).observe(page);
new MutationObserver(scheduleBuild).observe(main,{childList:true,subtree:true,characterData:true,attributes:true});
new MutationObserver(scheduleBuild).observe(ground,{childList:true,subtree:true,characterData:true,attributes:true});
addEventListener('resize',()=>{sizeAir();scheduleBuild()},{passive:true});
let priorScrollY=scrollY,priorScrollAt=performance.now(),lastBurstAt=0,lastUserScrollAt=0;
addEventListener('wheel',event=>{const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);if(delta>70)lastUserScrollAt=performance.now();},{passive:true});
addEventListener('touchmove',()=>{lastUserScrollAt=performance.now();},{passive:true});
addEventListener('scroll',()=>{const now=performance.now(),nextY=scrollY,dy=nextY-priorScrollY,dt=Math.max(16,now-priorScrollAt);viewY=nextY;if(!paused&&now-lastUserScrollAt<240&&dy>90&&(dy/dt>1.35||dy>innerHeight*.72)&&now-lastBurstAt>180){window.treeStudy?.burstLeaves(Math.min(1.7,dy/innerHeight));lastBurstAt=now;}priorScrollY=nextY;priorScrollAt=now;},{passive:true});
document.addEventListener('visibilitychange',syncMotion);reduced.addEventListener('change',syncMotion);
if(document.fonts)document.fonts.ready.then(scheduleBuild);

})();
