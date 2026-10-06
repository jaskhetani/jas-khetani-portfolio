import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createHandler,NOTE_PREFIX,PUBLIC_REPO,DRAFT_REPO} from '../api/author.js';

const env={APP_ORIGIN:'https://portfolio.example',GITHUB_CLIENT_ID:'test',GITHUB_CLIENT_SECRET:'test',SESSION_SECRET:'test-session-secret-with-at-least-32-characters',DRAFT_REPO};
const API='https://api.github.com/repos/';
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=s}});
function fakeGitHub({draftMeta={full_name:DRAFT_REPO,private:true},publicMeta={full_name:PUBLIC_REPO,private:false},user={id:82095478,login:'jaskhetani'},revokeStatus=204,failPublicWriteOnce=false,failPublicDeleteOnce=false}={}){
 const stores={[DRAFT_REPO]:new Map(),[PUBLIC_REPO]:new Map()},calls=[];let n=0,writeFailed=false,deleteFailed=false;
 const fetchImpl=async(input,init={})=>{const url=String(input),method=init.method||'GET';calls.push({url,method,init});
  if(url==='https://github.com/login/oauth/access_token')return Response.json({access_token:'test-token'});
  if(url==='https://api.github.com/user')return Response.json(user);
  if(url==='https://api.github.com/applications/test/token'&&method==='DELETE')return new Response(null,{status:revokeStatus});
  for(const [repo,meta] of [[DRAFT_REPO,draftMeta],[PUBLIC_REPO,publicMeta]]){
   if(url===API+repo&&method==='GET')return typeof meta==='number'?Response.json({message:'error'},{status:meta}):Response.json(meta);
   if(url===API+repo+'/contents/content/notes?ref=main'&&method==='GET')return Response.json([...stores[repo]].map(([slug,file])=>({type:'file',name:slug+'.json',sha:file.sha})));
   const escaped=repo.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const match=url.match(new RegExp('^'+API+escaped+'/contents/content/notes/([a-z0-9-]+)\\.json(?:\\?ref=[^&]+)?$'));
   if(match){const slug=match[1],store=stores[repo],current=store.get(slug);
    if(method==='GET')return current?Response.json({type:'file',content:current.content,sha:current.sha}):Response.json({message:'missing'},{status:404});
    if(method==='PUT'){
     if(repo===PUBLIC_REPO&&failPublicWriteOnce&&!writeFailed){writeFailed=true;return Response.json({message:'blocked'},{status:500});}
     const body=JSON.parse(init.body);if((current?.sha||null)!==(body.sha||null))return Response.json({message:'conflict'},{status:409});
     const bytes=Buffer.from(body.content,'base64'),sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),commit=(++n).toString(16).padStart(40,'b');store.set(slug,{content:body.content,sha});return Response.json({content:{sha},commit:{sha:commit}});
    }
    if(method==='DELETE'){
     if(repo===PUBLIC_REPO&&failPublicDeleteOnce&&!deleteFailed){deleteFailed=true;return Response.json({message:'blocked'},{status:500});}
     const body=JSON.parse(init.body);if(!current||body.sha!==current.sha)return Response.json({message:'conflict'},{status:409});store.delete(slug);return Response.json({commit:{sha:(++n).toString(16).padStart(40,'c')}});
    }
   }
  }
  throw Error('Unexpected GitHub call: '+method+' '+url);
 };
 return {fetchImpl,stores,calls};
}
async function signIn(handler){const login=response();await handler({method:'GET',url:'/?action=login',headers:{}},login);const flow=login.headers['Set-Cookie'].split(';')[0];const cb=response();await handler({method:'GET',url:'/?action=callback&code=test&state='+new URL(login.headers.Location).searchParams.get('state'),headers:{cookie:flow}},cb);const cookie=cb.headers['Set-Cookie'].map(c=>c.split(';')[0]).join('; ');const me=response();await handler({method:'GET',url:'/?action=session',headers:{cookie}},me);return {cookie,origin:env.APP_ORIGIN,'x-csrf-token':JSON.parse(me.body).csrf};}
async function call(handler,method,url,headers,body){const res=response();await handler({method,url,headers,body},res);return {status:res.statusCode,data:JSON.parse(res.body||'{}'),headers:res.headers};}
const draft={slug:'note-small-project',title:'A small project',summary:'One real lesson.',body:'# Note\nA test note.',status:'draft',sha:null};
const decode=file=>JSON.parse(Buffer.from(file.content,'base64').toString());

test('drafts live only in the private notes repository and retain concurrency protection',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);
 const saved=await call(handler,'POST','/?action=save',headers,draft);assert.equal(saved.status,200);assert.equal(saved.data.note.status,'draft');
 assert.equal(gh.stores[DRAFT_REPO].size,1);assert.equal(gh.stores[PUBLIC_REPO].size,0);assert.equal(decode(gh.stores[DRAFT_REPO].get(draft.slug)).status,'draft');
 const loaded=await call(handler,'GET','/?action=note&slug='+draft.slug,headers);assert.equal(loaded.data.note.body,draft.body);assert.equal(loaded.data.publicPresent,false);assert.equal(loaded.data.publicSynced,true);
 const listed=await call(handler,'GET','/?action=notes',headers);assert.deepEqual(listed.data.notes.map(n=>n.slug),[draft.slug]);
 const stale=await call(handler,'POST','/?action=save',headers,draft);assert.equal(stale.status,409);assert.equal(gh.stores[DRAFT_REPO].size,1);
});

test('private draft and public publication repositories are verified exactly and fail closed',async()=>{
 for(const draftMeta of [{full_name:DRAFT_REPO,private:false},{full_name:'other/repo',private:true},404]){
  const gh=fakeGitHub({draftMeta}),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const out=await call(handler,'POST','/?action=save',headers,draft);assert.equal(out.status,503);assert.equal(gh.stores[DRAFT_REPO].size,0);
 }
 for(const publicMeta of [{full_name:PUBLIC_REPO,private:true},{full_name:'other/repo',private:false},500]){
  const gh=fakeGitHub({publicMeta}),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const out=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});assert.equal(out.status,503);assert.equal(gh.stores[DRAFT_REPO].size,0);assert.equal(gh.stores[PUBLIC_REPO].size,0);
 }
});

test('publishing writes verified copies to private source and public portfolio repositories',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const out=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});
 assert.equal(out.status,200);assert.ok(out.data.publishedCommit);const privateNote=decode(gh.stores[DRAFT_REPO].get(draft.slug)),publicNote=decode(gh.stores[PUBLIC_REPO].get(draft.slug));assert.deepEqual(publicNote,privateNote);assert.equal(publicNote.status,'published');assert.ok(publicNote.publishedAt);
 const loaded=await call(handler,'GET','/?action=note&slug='+draft.slug,headers);assert.equal(loaded.data.publicPresent,true);assert.equal(loaded.data.publicSynced,true);
 const publicCalls=gh.calls.filter(c=>c.url.startsWith(API+PUBLIC_REPO));assert.ok(publicCalls.some(c=>c.method==='PUT'));assert.ok(publicCalls.some(c=>c.method==='GET'&&c.url.includes('?ref=')));
});

test('unpublishing requires confirmation, deletes the public copy, and preserves private history metadata',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const published=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});assert.equal(published.status,200);const publishedAt=published.data.note.publishedAt;
 const blocked=await call(handler,'POST','/?action=save',headers,{...draft,sha:published.data.sha});assert.equal(blocked.status,409);assert.ok(gh.stores[PUBLIC_REPO].has(draft.slug));
 const removed=await call(handler,'POST','/?action=save',headers,{...draft,sha:published.data.sha,unpublish:true});assert.equal(removed.status,200);assert.equal(removed.data.note.publishedAt,publishedAt);assert.equal(decode(gh.stores[DRAFT_REPO].get(draft.slug)).status,'draft');assert.ok(!gh.stores[PUBLIC_REPO].has(draft.slug));assert.ok(gh.calls.some(c=>c.method==='DELETE'&&c.url.startsWith(API+PUBLIC_REPO)));
});

test('a public sync failure is reported as a partial save, never as an unsaved draft',async()=>{
 const gh=fakeGitHub({failPublicWriteOnce:true}),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const out=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});
 assert.equal(out.status,502);assert.equal(out.data.saved,true);assert.match(out.data.error,/private draft source was saved.*publication failed/i);assert.equal(decode(gh.stores[DRAFT_REPO].get(draft.slug)).status,'published');assert.equal(gh.stores[PUBLIC_REPO].size,0);const drift=await call(handler,'GET','/?action=note&slug='+draft.slug,headers);assert.equal(drift.data.publicPresent,false);assert.equal(drift.data.publicSynced,false);
 const retry=await call(handler,'POST','/?action=save',headers,{...draft,status:'published',sha:out.data.sha});assert.equal(retry.status,200);assert.equal(decode(gh.stores[PUBLIC_REPO].get(draft.slug)).status,'published');assert.equal(retry.data.publicSynced,true);
});

test('a failed unpublish and a stale public copy are both recoverable on the next draft save',async()=>{
 const gh=fakeGitHub({failPublicDeleteOnce:true}),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const published=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});assert.equal(published.status,200);
 const partial=await call(handler,'POST','/?action=save',headers,{...draft,sha:published.data.sha,unpublish:true});assert.equal(partial.status,502);assert.equal(partial.data.saved,true);assert.equal(decode(gh.stores[DRAFT_REPO].get(draft.slug)).status,'draft');assert.ok(gh.stores[PUBLIC_REPO].has(draft.slug));
 const retry=await call(handler,'POST','/?action=save',headers,{...draft,sha:partial.data.sha,unpublish:true});assert.equal(retry.status,200);assert.equal(retry.data.publicSynced,true);assert.ok(!gh.stores[PUBLIC_REPO].has(draft.slug));

 const fresh=await call(handler,'POST','/?action=save',headers,{...draft,slug:'note-stale'});assert.equal(fresh.status,200);const stale={...decode(gh.stores[DRAFT_REPO].get('note-stale')),status:'published',publishedAt:new Date().toISOString()};gh.stores[PUBLIC_REPO].set('note-stale',{content:Buffer.from(JSON.stringify(stale)).toString('base64'),sha:'f'.repeat(40)});const drift=await call(handler,'GET','/?action=note&slug=note-stale',headers);assert.equal(drift.status,200);assert.equal(drift.data.publicPresent,true);assert.equal(drift.data.publicSynced,false);
 const blocked=await call(handler,'POST','/?action=save',headers,{...draft,slug:'note-stale',sha:fresh.data.sha});assert.equal(blocked.status,409);assert.match(blocked.data.error,/public copy|unpublish/i);assert.equal(blocked.data.unpublishRequired,true);
 const healed=await call(handler,'POST','/?action=save',headers,{...draft,slug:'note-stale',sha:fresh.data.sha,unpublish:true});assert.equal(healed.status,200);assert.ok(!gh.stores[PUBLIC_REPO].has('note-stale'));
});

test('note slugs remain namespaced away from imported articles',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const medium=readdirSync(new URL('../content/medium/',import.meta.url)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(new URL('../content/medium/'+f,import.meta.url),'utf8')).slug);
 for(const slug of [...medium,'small-project',NOTE_PREFIX.slice(0,-1),'note'])assert.equal((await call(handler,'POST','/?action=save',headers,{...draft,slug})).status,400,slug);assert.equal(gh.stores[DRAFT_REPO].size,0);
});

test('validation, CSRF, metadata ordering, and expired GitHub sessions fail before content writes',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);
 for(const body of [{...draft,slug:'../escape'},{...draft,status:'secret'},{...draft,title:''}])assert.equal((await call(handler,'POST','/?action=save',headers,body)).status,400);
 assert.equal((await call(handler,'POST','/?action=save',{...headers,'x-csrf-token':'bad'},draft)).status,403);assert.equal(gh.stores[DRAFT_REPO].size,0);
 gh.calls.length=0;const listed=await call(handler,'GET','/?action=notes',headers);assert.equal(listed.status,200);assert.equal(gh.calls[0].url,API+DRAFT_REPO,'privacy metadata must be checked before note paths');
 const expired=fakeGitHub({draftMeta:401}),expiredHandler=createHandler({env,fetchImpl:expired.fetchImpl}),expiredHeaders=await signIn(expiredHandler);const denied=await call(expiredHandler,'GET','/?action=notes',expiredHeaders);assert.equal(denied.status,401);assert.equal(expired.calls.filter(c=>c.url.includes('/contents/content/notes')).length,0);
});

test('logout revokes tokens and a different GitHub account is refused',async()=>{
 const gh=fakeGitHub(),handler=createHandler({env,fetchImpl:gh.fetchImpl}),headers=await signIn(handler);const bad=await call(handler,'POST','/?action=logout',{...headers,'x-csrf-token':'bad'});assert.equal(bad.status,403);assert.equal(gh.calls.filter(c=>c.url==='https://api.github.com/applications/test/token').length,0);
 const out=await call(handler,'POST','/?action=logout',headers);assert.equal(out.status,200);assert.equal(out.data.revoked,true);assert.ok(gh.calls.some(c=>c.url==='https://api.github.com/applications/test/token'&&c.method==='DELETE'));
 const intruder=fakeGitHub({user:{id:123,login:'not-owner'}}),blocked=createHandler({env,fetchImpl:intruder.fetchImpl});const login=response();await blocked({method:'GET',url:'/?action=login',headers:{}},login);const cb=response();await blocked({method:'GET',url:'/?action=callback&code=x&state='+new URL(login.headers.Location).searchParams.get('state'),headers:{cookie:login.headers['Set-Cookie'].split(';')[0]}},cb);assert.equal(cb.statusCode,403);assert.ok(!String(cb.headers['Set-Cookie']).includes('__Host-portfolio_session'));assert.ok(intruder.calls.some(c=>c.url==='https://api.github.com/applications/test/token'&&c.method==='DELETE'));
});
