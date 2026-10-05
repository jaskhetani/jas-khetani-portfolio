import test from 'node:test';import assert from 'node:assert/strict';import {readdirSync,readFileSync} from 'node:fs';
import {createHandler,NOTE_PREFIX} from '../api/author.js';
const env={APP_ORIGIN:'https://portfolio.example',GITHUB_CLIENT_ID:'test',GITHUB_CLIENT_SECRET:'test',SESSION_SECRET:'test-session-secret-with-at-least-32-characters'};
const REPO_URL='https://api.github.com/repos/jaskhetani/jas-khetani-portfolio',NOTES=REPO_URL+'/contents/content/notes';
const PRIVATE_REPO={full_name:'jaskhetani/jas-khetani-portfolio',private:true};
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=s}});
// Fake GitHub. Repository metadata is answered ONLY for the exact repo URL, so every note path must pass the privacy check explicitly.
function github({repo=PRIVATE_REPO,user={id:82095478,login:'jaskhetani'},revokeStatus=204}={}){
 const files=new Map(),calls=[];let n=0;
 const fetchImpl=async(url,init={})=>{url=String(url);const method=init.method||'GET';calls.push({url,method,init});
  if(url==='https://github.com/login/oauth/access_token')return Response.json({access_token:'test-token'});
  if(url==='https://api.github.com/user')return Response.json(user);
  if(url==='https://api.github.com/applications/test/token'&&method==='DELETE')return new Response(null,{status:revokeStatus});
  if(url===REPO_URL&&method==='GET')return typeof repo==='number'?Response.json({message:'error'},{status:repo}):Response.json(repo);
  if(url===NOTES+'?ref=main')return Response.json([...files].map(([slug,f])=>({type:'file',name:slug+'.json',sha:f.sha})));
  const m=url.match(/^.*\/contents\/content\/notes\/([a-z0-9-]+)\.json(?:\?ref=\w+)?$/);
  if(m&&method==='PUT'){const body=JSON.parse(init.body);const sha=String(++n).padStart(40,'a');files.set(m[1],{content:body.content,sha});return Response.json({content:{sha},commit:{sha:String(n).padStart(40,'b')}});}
  if(m&&method==='GET'){const f=files.get(m[1]);return f?Response.json({content:f.content,sha:f.sha,type:'file'}):Response.json({message:'missing'},{status:404});}
  throw Error('Unexpected GitHub call: '+method+' '+url);
 };
 return {fetchImpl,files,calls,contentCalls:()=>calls.filter(c=>c.url.startsWith(NOTES)),repoChecks:()=>calls.filter(c=>c.url===REPO_URL).length};
}
async function signIn(handler){const login=response();await handler({method:'GET',url:'/?action=login',headers:{}},login);const flow=login.headers['Set-Cookie'].split(';')[0];const cb=response();await handler({method:'GET',url:'/?action=callback&code=test&state='+new URL(login.headers.Location).searchParams.get('state'),headers:{cookie:flow}},cb);const cookie=cb.headers['Set-Cookie'].map(c=>c.split(';')[0]).join('; ');const me=response();await handler({method:'GET',url:'/?action=session',headers:{cookie}},me);return {cookie,origin:env.APP_ORIGIN,'x-csrf-token':JSON.parse(me.body).csrf};}
async function call(handler,method,url,headers,body){const res=response();await handler({method,url,headers,body},res);return {status:res.statusCode,data:JSON.parse(res.body||'{}'),headers:res.headers};}
const draft={slug:'note-small-project',title:'A small project',summary:'One real lesson.',body:'# Note\nA test note.',status:'draft',sha:null};

test('owner saves a validated note then reads it back; stale SHA and traversal fail',async()=>{
 const gh=github(),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
 const saved=await call(handler,'POST','/?action=save',headers,draft);assert.equal(saved.status,200);assert.equal(saved.data.note.status,'draft');assert.equal(saved.data.note.publishedAt,null);
 const puts=()=>gh.calls.filter(c=>c.method==='PUT').length;assert.equal(puts(),1);
 const read=await call(handler,'GET','/?action=note&slug=note-small-project',headers);assert.equal(read.status,200);assert.equal(read.data.note.body,draft.body);
 const listed=await call(handler,'GET','/?action=notes',headers);assert.deepEqual(listed.data.notes.map(n=>n.slug),['note-small-project']);
 const conflict=await call(handler,'POST','/?action=save',headers,draft);assert.equal(conflict.status,409);assert.equal(puts(),1);
 for(const body of [{...draft,slug:'../escape'},{...draft,status:'secret'},{...draft,title:''}])assert.equal((await call(handler,'POST','/?action=save',headers,body)).status,400);
 assert.equal((await call(handler,'POST','/?action=save',{...headers,'x-csrf-token':'bad'},draft)).status,403);
});

test('every note read, list, and save checks repository privacy before touching note content',async()=>{
 const gh=github(),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
 for(const [method,url,body] of [['GET','/?action=notes'],['POST','/?action=save',draft],['GET','/?action=note&slug=note-small-project']]){
  gh.calls.length=0;const r=await call(handler,method,url,headers,body);assert.equal(r.status,200,url);
  assert.equal(gh.calls[0].url,REPO_URL,'repo metadata is fetched first for '+url);assert.equal(gh.repoChecks(),1);assert.ok(gh.contentCalls().length>0);
 }
});

test('drafts fail closed when the repository is public, not the exact repo, or unverifiable',async()=>{
 for(const [repo,expected] of [[{...PRIVATE_REPO,private:false},503],[{full_name:'someone-else/jas-khetani-portfolio',private:true},503],[{full_name:'jaskhetani/jas-khetani-portfolio'},503],[{full_name:'jaskhetani/jas-khetani-portfolio',private:'true'},503],[404,503],[500,503],[401,401]]){
  const gh=github({repo}),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
  for(const [method,url,body] of [['GET','/?action=notes'],['GET','/?action=note&slug=note-small-project'],['POST','/?action=save',draft]]){
   const r=await call(handler,method,url,headers,body);assert.equal(r.status,expected,JSON.stringify(repo)+' '+url);assert.ok(!r.data.notes&&!r.data.note,'no note data leaks');
  }
  assert.equal(gh.contentCalls().length,0,'no note content read or written: '+JSON.stringify(repo));
 }
});

test('note slugs are namespaced and can never take an imported article slug',async()=>{
 const gh=github(),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
 const medium=readdirSync(new URL('../content/medium/',import.meta.url)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(new URL('../content/medium/'+f,import.meta.url),'utf8')).slug);
 assert.ok(medium.length>0);
 for(const slug of [...medium,'small-project',NOTE_PREFIX.slice(0,-1),'note','notes-x']){const r=await call(handler,'POST','/?action=save',headers,{...draft,slug});assert.equal(r.status,400,slug);}
 assert.equal(gh.calls.filter(c=>c.method==='PUT').length,0);
 for(const slug of medium)assert.ok(!slug.startsWith(NOTE_PREFIX),'imported slug must stay outside the note namespace: '+slug);
});

test('saving a published note as a draft requires explicit unpublish and keeps the original publishedAt',async()=>{
 const gh=github(),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
 const pub=await call(handler,'POST','/?action=save',headers,{...draft,status:'published'});assert.equal(pub.status,200);const firstPublished=pub.data.note.publishedAt;assert.ok(firstPublished);
 const puts=()=>gh.calls.filter(c=>c.method==='PUT').length;
 const silent=await call(handler,'POST','/?action=save',headers,{...draft,sha:pub.data.sha});assert.equal(silent.status,409);assert.match(silent.data.error,/unpublish/i);assert.equal(puts(),1);
 await new Promise(r=>setTimeout(r,5));
 const unpub=await call(handler,'POST','/?action=save',headers,{...draft,sha:pub.data.sha,unpublish:true});assert.equal(unpub.status,200);assert.equal(unpub.data.note.status,'draft');assert.equal(unpub.data.note.publishedAt,firstPublished);
 const stored=JSON.parse(Buffer.from(gh.files.get('note-small-project').content,'base64').toString());assert.equal(stored.status,'draft');assert.equal(stored.publishedAt,firstPublished);
 const again=await call(handler,'POST','/?action=save',headers,{...draft,status:'published',sha:unpub.data.sha});assert.equal(again.status,200);assert.equal(again.data.note.publishedAt,firstPublished);
 // Drafts that were never published still save without any confirmation flag.
 const plain=await call(handler,'POST','/?action=save',headers,{...draft,slug:'note-other'});assert.equal(plain.status,200);assert.equal(plain.data.note.publishedAt,null);
});

test('logout clears the session and revokes the GitHub token, even if revocation fails',async()=>{
 for(const revokeStatus of [204,500]){
  const gh=github({revokeStatus}),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
  const out=await call(handler,'POST','/?action=logout',headers);assert.equal(out.status,200);assert.equal(out.data.revoked,revokeStatus===204);
  assert.match(out.headers['Set-Cookie'],/__Host-portfolio_session=;.*Max-Age=0/);
  const revoke=gh.calls.find(c=>c.method==='DELETE');assert.equal(revoke.url,'https://api.github.com/applications/test/token');
  assert.equal(revoke.init.headers.Authorization,'Basic '+Buffer.from('test:test').toString('base64'));assert.deepEqual(JSON.parse(revoke.init.body),{access_token:'test-token'});
 }
 const gh=github(),handler=createHandler({env,fetchImpl:gh.fetchImpl});const headers=await signIn(handler);
 assert.equal((await call(handler,'POST','/?action=logout',{...headers,'x-csrf-token':'bad'})).status,403);assert.equal(gh.calls.filter(c=>c.method==='DELETE').length,0,'no revoke without CSRF');
});

test('a different GitHub account cannot enter the room and its token is revoked',async()=>{
 const gh=github({user:{id:123,login:'not-owner'}}),handler=createHandler({env,fetchImpl:gh.fetchImpl});
 const login=response();await handler({method:'GET',url:'/?action=login',headers:{}},login);const cb=response();await handler({method:'GET',url:'/?action=callback&code=x&state='+new URL(login.headers.Location).searchParams.get('state'),headers:{cookie:login.headers['Set-Cookie'].split(';')[0]}},cb);
 assert.equal(cb.statusCode,403);assert.ok(!String(cb.headers['Set-Cookie']).includes('__Host-portfolio_session'),'no session issued');
 const revoke=gh.calls.find(c=>c.method==='DELETE');assert.ok(revoke,'non-owner token revoked');assert.deepEqual(JSON.parse(revoke.init.body),{access_token:'test-token'});
});
