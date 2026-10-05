import test,{mock} from 'node:test';import assert from 'node:assert/strict';
// Minimal DOM so src/tree.js can run its real build() in Node. Timers are mocked so rebuilds are deterministic.
let loads=0;
function setup({worker}){
 const workers=[],canvases=[],listeners={};let sprites=0;
 const node=extra=>({style:{},dataset:{},children:[],classList:{add(){}},setAttribute(){},appendChild(c){this.children.push(c);return c},replaceChildren(){this.children=[]},set innerHTML(v){},querySelectorAll:()=>[],...extra});
 const ctx2d={setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){},scale(){},fill(){},fillRect(){}};
 const page=node({clientWidth:1024,offsetHeight:3000}),ground=node({offsetTop:2600}),main=node({offsetLeft:300}),air=node({getContext:()=>ctx2d});
 const parts={'#tree':node(),'.page':page,'.ground':ground,'.content':main,'#petal-air':air};
 Object.assign(globalThis,{window:globalThis,innerWidth:1024,innerHeight:900,scrollY:0,devicePixelRatio:1,
  document:{querySelector:s=>parts[s],createElementNS:()=>node(),documentElement:node(),addEventListener(){},hidden:false},
  matchMedia:()=>({matches:true,addEventListener(){}}),Path2D:class{},
  ResizeObserver:class{observe(){}},MutationObserver:class{observe(){}},
  addEventListener:(type,fn)=>{listeners[type]=fn},dispatchEvent(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){},
  // Canvases created by one rasterize() call share a batch number (5 sprites are made first in every call).
  OffscreenCanvas:class{constructor(w,h){if(w===48&&h===48)sprites++;this.batch=Math.ceil(sprites/5);this.draws=0;const self=this;canvases.push(this);this.ctx={...ctx2d,translate(){},drawImage(){self.draws++}}}getContext(){return this.ctx}convertToBlob(){return Promise.resolve(new Blob(['png']))}}});
 if(worker)globalThis.Worker=class{constructor(){this.terminated=false;workers.push(this)}postMessage(p){this.payload=p}terminate(){this.terminated=true}};else delete globalThis.Worker;
 const draws=batch=>canvases.filter(c=>c.batch===batch).reduce((n,c)=>n+c.draws,0);
 const rebuild=()=>{page.clientWidth-=10;listeners.resize();mock.timers.tick(180);};
 return {workers,canvases,draws,rebuild,load:()=>import('../src/tree.js?case='+(++loads))};
}
const flush=()=>new Promise(r=>setImmediate(r));
test('stale worker callbacks never terminate a newer worker, start a fallback, or commit tiles',async t=>{
 mock.timers.enable({apis:['setTimeout']});t.after(()=>mock.timers.reset());
 const dom=setup({worker:true});await dom.load();
 assert.equal(dom.workers.length,1);const first=treeStudy.geometry.flowerCount;assert.ok(first>1000);
 dom.rebuild();assert.equal(dom.workers.length,2);const [old,current]=dom.workers;assert.equal(old.terminated,true,'build retires the old generation');
 old.onerror();old.onmessage({data:{error:true}});old.onmessage({data:{tiles:[{k:0,blob:new Blob(['old'])}]}});await flush();
 assert.equal(current.terminated,false,'newer worker survives stale callbacks');assert.equal(dom.canvases.length,0,'no fallback for a superseded generation');assert.notEqual(treeStudy.geometry.ready,true,'stale tiles not committed');
 current.onmessage({data:{tiles:[{k:0,blob:new Blob(['new'])}]}});
 assert.equal(treeStudy.geometry.ready,true);assert.equal(treeStudy.geometry.flowerTiles,1);assert.equal(current.terminated,true);
});
test('a superseded main-thread fallback stops drawing early and the newest one completes',async t=>{
 mock.timers.enable({apis:['setTimeout']});t.after(()=>mock.timers.reset());
 const dom=setup({worker:false});await dom.load();await flush();
 const stamps=treeStudy.geometry.flowerCount;assert.ok(dom.draws(1)>0&&dom.draws(1)<=800,'first batch paused at its first cooperative yield');
 dom.rebuild();for(let i=0;i<500&&!treeStudy.geometry.ready;i++){mock.timers.tick(1);await flush();}
 assert.equal(treeStudy.geometry.ready,true,'newest generation completes');
 assert.ok(dom.draws(1)<=800,`superseded fallback cancelled (drew ${dom.draws(1)} of ~${stamps})`);assert.ok(dom.draws(2)>=treeStudy.geometry.flowerCount,'current generation drew every stamp');
});
