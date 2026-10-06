import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
const env={APP_ORIGIN:'https://portfolio.example',GITHUB_CLIENT_ID:'test-client',GITHUB_CLIENT_SECRET:'test-client-secret',SESSION_SECRET:'test-session-secret-with-at-least-32-characters',DRAFT_REPO:'jaskhetani/jas-khetani-portfolio-notes'};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=s}}}
test('OAuth verifies state and only admits the exact owner account',async()=>{
 const {createHandler}=await import('../api/author.js');
 const handler=createHandler({env,fetchImpl:async(url)=>new Response(JSON.stringify(String(url).includes('access_token')?{access_token:'test-token'}:{id:82095478,login:'jaskhetani'}),{status:200})});
 const login=response();await handler({method:'GET',url:'/api/author?action=login',headers:{}},login);
 assert.equal(login.statusCode,302);const location=new URL(login.headers.Location);assert.equal(location.hostname,'github.com');assert.ok(location.searchParams.get('code_challenge'));
 const cookies=login.headers['Set-Cookie'];const cookie=(Array.isArray(cookies)?cookies[0]:cookies).split(';')[0];
 const bad=response();await handler({method:'GET',url:'/api/author?action=callback&code=test&state=wrong',headers:{cookie}},bad);assert.equal(bad.statusCode,400);
 const good=response();await handler({method:'GET',url:'/api/author?action=callback&code=test&state='+location.searchParams.get('state'),headers:{cookie}},good);
 assert.equal(good.statusCode,302);assert.equal(good.headers.Location,'https://portfolio.example/study');
 const sessionCookies=good.headers['Set-Cookie'];assert.ok(sessionCookies.some(c=>c.includes('HttpOnly')&&c.includes('Secure')));assert.ok(!sessionCookies.join('').includes('test-token'));
 const owner=response();await handler({method:'GET',url:'/api/author?action=session',headers:{cookie:sessionCookies.map(c=>c.split(';')[0]).join('; ')}},owner);assert.equal(owner.statusCode,200);assert.equal(JSON.parse(owner.body).login,'jaskhetani');
});
test('private notes reject anonymous reads and cross-origin writes',async()=>{
 const {createHandler}=await import('../api/author.js');
 for(const req of [{method:'GET',url:'/api/author?action=notes',headers:{}},{method:'POST',url:'/api/author?action=save',headers:{origin:'https://evil.example'},body:{}}]){
  const res=response();await createHandler({env})(req,res);assert.ok([401,403].includes(res.statusCode));
 }
});
test('authoring endpoint exists and fails closed without configuration', async () => {
 assert.ok(existsSync(new URL('../api/author.js', import.meta.url)), 'secure authoring endpoint must exist');
 const { createHandler } = await import('../api/author.js');
 const res={headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=s}};
 await createHandler({env:{}})({method:'GET',url:'/api/author?action=session',headers:{}},res);
 assert.equal(res.statusCode,503); assert.match(res.body,/not configured/); assert.equal(res.headers['Cache-Control'],'no-store');
});
