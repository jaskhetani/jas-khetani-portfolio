import test from 'node:test';import assert from 'node:assert/strict';import {existsSync,readdirSync,readFileSync} from 'node:fs';
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
