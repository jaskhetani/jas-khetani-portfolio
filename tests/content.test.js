import test from 'node:test';import assert from 'node:assert/strict';import {existsSync,readdirSync,readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('public content excludes drafts and strips executable HTML',async()=>{
 assert.ok(existsSync(new URL('../scripts/content.js',import.meta.url)),'content compiler exists');
 const {compileNote,cleanHtml}=await import('../scripts/content.js');
 assert.equal(compileNote({status:'draft',body:'PRIVATE_SENTINEL'}),null);
 const publicNote=compileNote({status:'published',slug:'note-test',title:'Test',body:'# Hello\n<script>alert(1)</script>\n[bad](javascript:alert(1))',publishedAt:'2026-01-01'});
 assert.ok(publicNote.html.includes('Hello'));assert.ok(!publicNote.html.includes('<script'));assert.ok(!publicNote.html.includes('javascript:'));
 const cleaned=cleanHtml('<p>Hello</p><img src="https://cdn-images-1.medium.com/max/1/image.jpg" onerror="alert(1)"><iframe src="https://evil.example"></iframe><pre><code>a &lt; b</code></pre>');
 const tracking=cleanHtml('<img src="https://medium.com/_/stat?event=post.clientViewed" width="1" height="1">');assert.equal(tracking,'');
 assert.ok(cleaned.includes('<code>'));assert.ok(!cleaned.includes('onerror'));assert.ok(!cleaned.includes('<iframe'));
});
test('sourceUrl must be HTTPS on compile',async()=>{
 const {compileMedium,httpsUrl}=await import('../scripts/content.js');
 const article={slug:'an-article',title:'T',summary:'S',category:'frontier',date:'2025-01-01',contentStatus:'full-feed',bodyHtml:'<p>x</p>'};
 assert.equal(compileMedium({...article,sourceUrl:'https://medium.com/@jaskhetani/x'}).sourceUrl,'https://medium.com/@jaskhetani/x');
 assert.equal(compileMedium({...article,sourceUrl:null}).sourceUrl,null);
 for(const bad of ['javascript:alert(1)','JavaScript:alert(1)',' javascript:alert(1)','data:text/html,<script>alert(1)</script>','http://medium.com/x','//medium.com/x','/relative','https://user:pass@medium.com/x','vbscript:msgbox(1)'])
  assert.throws(()=>compileMedium({...article,sourceUrl:bad}),/sourceUrl/,bad);
 assert.throws(()=>httpsUrl('not a url'),/sourceUrl/);
});
test('note and imported slugs live in disjoint namespaces shared with the authoring API',async()=>{
 const {compileMedium,compileNote,NOTE_PREFIX}=await import('../scripts/content.js');const api=await import('../api/author.js');
 assert.equal(NOTE_PREFIX,api.NOTE_PREFIX);
 assert.throws(()=>compileMedium({slug:NOTE_PREFIX+'x',sourceUrl:null,bodyHtml:''}),/namespace/);
 assert.throws(()=>compileNote({status:'published',slug:'majorana-1',body:'x'}),/must start with/);
 // Every committed imported article compiles (HTTPS sourceUrl, outside the note namespace).
 const dir=new URL('../content/medium/',import.meta.url);
 for(const f of readdirSync(dir).filter(f=>f.endsWith('.json'))){const a=compileMedium(JSON.parse(readFileSync(new URL(f,dir),'utf8')));assert.match(a.sourceUrl,/^https:\/\//,f);}
});

test('Blogger originals compile as a clearly attributed early-writing archive',async()=>{
 const {compileBlogger}=await import('../scripts/content.js');
 const dir=new URL('../content/blogger/',import.meta.url),files=readdirSync(dir).filter(f=>f.endsWith('.json'));
 const expected={
  'old-is-aurum':{title:'Old is Aurum',date:'2022-12-29T13:41:00.001-08:00',sourceUrl:'https://jaskhetani.blogspot.com/2022/12/old-is-aurum.html',bodyHash:'be79f582c871741a98390ec98244a77a0b696058e93faaab6ddcde125d85aa00'},
  'red-color-or-understanding':{title:'RED - A Color or an Understanding',date:'2022-12-29T13:52:00.003-08:00',sourceUrl:'https://jaskhetani.blogspot.com/2022/12/red-color-or-understanding.html',bodyHash:'df5af0c20868287dcbee40f8dc6f3dd5b713050d5287bc846833cc7cea7acbb1'},
  'time-travel-conjecture':{title:'Time Travel Conjecture',date:'2022-12-29T11:57:00.005-08:00',sourceUrl:'https://jaskhetani.blogspot.com/2022/12/time-travel-conjecture.html',bodyHash:'69a2c88f65286cc1bc4a7c8489f963ece2448c8a66174d248ff47738c98fab6a'}
 };
 assert.deepEqual(files.sort(),Object.keys(expected).map(slug=>slug+'.json').sort());
 const articles=files.map(file=>{
  const raw=JSON.parse(readFileSync(new URL(file,dir),'utf8')),identity=expected[raw.slug];
  assert.equal(file,raw.slug+'.json',`Blogger filename must match its canonical slug: ${file}`);
  assert.ok(identity,`unexpected Blogger slug: ${raw.slug}`);
  assert.deepEqual({title:raw.title,date:raw.date,sourceUrl:raw.sourceUrl},{title:identity.title,date:identity.date,sourceUrl:identity.sourceUrl});
  assert.equal(createHash('sha256').update(raw.bodyHtml).digest('hex'),identity.bodyHash,`${raw.slug} body changed from the verified Blogger snapshot`);
  return compileBlogger(raw);
 });
 for(const article of articles){
  assert.equal(article.category,'archive');
  assert.equal(article.sourcePlatform,'Blogger');
  assert.equal(article.contentStatus,'archived-original');
  assert.match(article.sourceUrl,/^https:\/\/jaskhetani\.blogspot\.com\/2022\/12\//);
  assert.ok(article.html.length>500);
  assert.ok(!article.html.includes('<img'),'third-party legacy images are not republished');
 }
 assert.match(articles.find(a=>a.slug==='red-color-or-understanding').html,/Vsauce/);
});
