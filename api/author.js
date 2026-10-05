import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
// Source: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
const OWNER_ID=82095478;
const REPO='jaskhetani/jas-khetani-portfolio';
// Owner notes live in their own namespace so they can never collide with imported content/medium slugs.
export const NOTE_PREFIX='note-';
const SESSION='__Host-portfolio_session', FLOW='__Host-portfolio_flow';
const random=()=>randomBytes(32).toString('base64url');
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
function seal(value,secret){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',createHash('sha256').update(secret).digest(),iv);const data=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url');}
function open(value,secret){try{const b=Buffer.from(value||'','base64url');if(b.length<29)return null;const d=createDecipheriv('aes-256-gcm',createHash('sha256').update(secret).digest(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));const v=JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString());return v.exp>Date.now()?v:null;}catch{return null;}}
const cookie=(name,value,age)=>`${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
function cookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').map(s=>s.trim().split(/=(.*)/s)).filter(x=>x[0]));}
export function createHandler({env=process.env,fetchImpl=fetch}={}) {
 return async (req,res)=>{
  const json=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data));};
  const redirect=(url)=>{res.statusCode=302;res.setHeader('Location',url);res.end();};
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
  let origin;
  try{origin=new URL(env.APP_ORIGIN).origin;if(origin!==env.APP_ORIGIN||!origin.startsWith('https://'))throw Error();}catch{return json(503,{error:'Authoring is not configured. Set a canonical HTTPS APP_ORIGIN.'});}
  if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.SESSION_SECRET||env.SESSION_SECRET.length<32)return json(503,{error:'Authoring is not configured.'});
  // Token revocation: https://docs.github.com/en/rest/apps/oauth-applications#delete-an-app-token
  const revoke=token=>typeof token!=='string'||!token?Promise.resolve(false):fetchImpl(`https://api.github.com/applications/${encodeURIComponent(env.GITHUB_CLIENT_ID)}/token`,{method:'DELETE',headers:{Authorization:'Basic '+Buffer.from(env.GITHUB_CLIENT_ID+':'+env.GITHUB_CLIENT_SECRET).toString('base64'),Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify({access_token:token}),signal:AbortSignal.timeout(5000)}).then(r=>r.ok||r.status===404,()=>false);
  try{
   const url=new URL(req.url,origin),action=url.searchParams.get('action')||'session',jar=cookies(req);
   if(!['GET','POST'].includes(req.method))return json(405,{error:'Method not allowed'});
   if(req.method==='POST'&&req.headers.origin!==origin)return json(403,{error:'Origin denied'});
   if(action==='login'&&req.method==='GET'){
    const state=random(),verifier=random();res.setHeader('Set-Cookie',cookie(FLOW,seal({state,verifier,exp:Date.now()+600000},env.SESSION_SECRET),600));
    const u=new URL('https://github.com/login/oauth/authorize');u.search=new URLSearchParams({client_id:env.GITHUB_CLIENT_ID,redirect_uri:origin+'/api/author?action=callback',scope:'repo',state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}).toString();return redirect(u.href);
   }
   if(action==='callback'&&req.method==='GET'){
    const flow=open(jar[FLOW],env.SESSION_SECRET);res.setHeader('Set-Cookie',cookie(FLOW,'',0));
    if(!flow||!equal(flow.state,url.searchParams.get('state'))||!url.searchParams.get('code'))return json(400,{error:'Invalid or expired sign-in. Return to /study and try again.'});
    const r=await fetchImpl('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code:url.searchParams.get('code'),redirect_uri:origin+'/api/author?action=callback',code_verifier:flow.verifier}),signal:AbortSignal.timeout(15000)});
    if(!r.ok)return json(502,{error:'GitHub authentication unavailable'});const token=await r.json();if(!token.access_token)return json(401,{error:'GitHub did not authorize sign-in'});
    const me=await fetchImpl('https://api.github.com/user',{headers:{Authorization:`Bearer ${token.access_token}`,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(15000)});
    if(!me.ok){await revoke(token.access_token);return json(401,{error:'Unable to verify account'});}const user=await me.json();if(user.id!==OWNER_ID){await revoke(token.access_token);return json(403,{error:'This writing room is owner-only.'});}
    const session={id:user.id,login:user.login,token:token.access_token,csrf:random(),exp:Date.now()+7200000};
    res.setHeader('Set-Cookie',[cookie(FLOW,'',0),cookie(SESSION,seal(session,env.SESSION_SECRET),7200)]);return redirect(origin+'/study');
   }
   const session=open(jar[SESSION],env.SESSION_SECRET);
   if(!session||session.id!==OWNER_ID)return json(401,{error:'Sign in required'});
   if(req.method==='POST'&&!equal(session.csrf,req.headers['x-csrf-token']))return json(403,{error:'Invalid request token'});
   if(action==='session'&&req.method==='GET')return json(200,{login:session.login,csrf:session.csrf});
   if(action==='logout'&&req.method==='POST'){res.setHeader('Set-Cookie',cookie(SESSION,'',0));const revoked=await revoke(session.token);return json(200,{ok:true,revoked});}
   // Contents API: https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   const headers={Authorization:`Bearer ${session.token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
   const base=`https://api.github.com/repos/${REPO}/contents/content/notes`;
   const gh=(path,init={})=>fetchImpl(base+path,{...init,headers,signal:AbortSignal.timeout(15000)});
   // Drafts are only private while the repository is. Re-check before every note read/list/save and fail closed.
   // Repository metadata: https://docs.github.com/en/rest/repos/repos#get-a-repository
   const privateRepo=async()=>{const r=await fetchImpl(`https://api.github.com/repos/${REPO}`,{headers,signal:AbortSignal.timeout(15000)});if(!r.ok)return r.status===401?401:503;const meta=await r.json();return meta?.full_name===REPO&&meta.private===true?true:503;};
   const notPrivate=status=>json(status,{error:status===401?'GitHub session expired. Sign in again.':'Notes are locked: the notes repository could not be verified as private. Nothing was read or saved.'});
   const slugOK=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)&&s.length<=80;
   if(action==='notes'&&req.method==='GET'){
    const repo=await privateRepo();if(repo!==true)return notPrivate(repo);
    const r=await gh('?ref=main');if(r.status===404)return json(200,{notes:[]});if(!r.ok)return json(r.status===401?401:502,{error:'Unable to list notes'});
    const files=await r.json();return json(200,{notes:files.filter(f=>f.type==='file'&&f.name.endsWith('.json')).map(f=>({slug:f.name.slice(0,-5),sha:f.sha}))});
   }
   if(action==='note'&&req.method==='GET'){
    const slug=url.searchParams.get('slug');if(!slugOK(slug))return json(400,{error:'Invalid note identifier'});
    const repo=await privateRepo();if(repo!==true)return notPrivate(repo);
    const r=await gh('/'+slug+'.json?ref=main');if(!r.ok)return json(r.status===404?404:502,{error:'Unable to load note'});
    const file=await r.json();return json(200,{note:JSON.parse(Buffer.from(file.content,'base64').toString('utf8')),sha:file.sha});
   }
   if(action==='save'&&req.method==='POST'){
    let data;try{data=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return json(400,{error:'Invalid JSON'});}
    if(!data||JSON.stringify(data).length>100000||!slugOK(data.slug)||typeof data.title!=='string'||!data.title.trim()||data.title.length>160||typeof data.body!=='string'||!data.body.trim()||data.body.length>80000||typeof data.summary!=='string'||data.summary.length>400||!['draft','published'].includes(data.status)||(data.sha!=null&&!/^[0-9a-f]{40}$/.test(data.sha)))return json(400,{error:'Check the slug, title, summary, body, and publication status.'});
    if(!data.slug.startsWith(NOTE_PREFIX)||data.slug.length===NOTE_PREFIX.length)return json(400,{error:`Note URL identifiers must start with "${NOTE_PREFIX}" so they cannot collide with imported articles.`});
    const repo=await privateRepo();if(repo!==true)return notPrivate(repo);
    const path='/'+data.slug+'.json',current=await gh(path+'?ref=main');let previous=null,currentSHA=null;
    if(current.ok){const f=await current.json();currentSHA=f.sha;previous=JSON.parse(Buffer.from(f.content,'base64').toString('utf8'));}else if(current.status!==404)return json(502,{error:'Unable to check current note; nothing saved.'});
    if(currentSHA!==(data.sha||null))return json(409,{error:'This note changed elsewhere. Reload it before saving; your text is still in the editor.'});
    if(previous?.status==='published'&&data.status==='draft'&&data.unpublish!==true)return json(409,{error:'This note is published. Confirm that you want to unpublish it before saving as a draft; nothing was saved.'});
    // publishedAt survives a draft round-trip so republishing keeps the original date.
    const now=new Date().toISOString();const note={slug:data.slug,title:data.title.trim(),summary:data.summary.trim(),body:data.body,status:data.status,category:'field',createdAt:previous?.createdAt||now,updatedAt:now,publishedAt:previous?.publishedAt||(data.status==='published'?now:null)};
    const content=Buffer.from(JSON.stringify(note,null,2)+'\n').toString('base64');const payload={message:`${note.status==='published'?'publish':'draft'}: ${note.slug}`,content,branch:'main',...(currentSHA?{sha:currentSHA}:{})};
    const r=await gh(path,{method:'PUT',body:JSON.stringify(payload)});if(!r.ok)return json(r.status===409||r.status===422?409:502,{error:'GitHub did not confirm this save. Reload before retrying.'});
    const saved=await r.json();const check=await gh(path+'?ref='+saved.commit.sha);
    if(!check.ok)return json(502,{error:'GitHub accepted the write, but read-back failed. Reload before saving again.'});
    const verified=await check.json();if(verified.sha!==saved.content.sha)return json(502,{error:'Save verification mismatch. Reload before retrying.'});
    return json(200,{note,sha:saved.content.sha,commit:saved.commit.sha});
   }
   return json(404,{error:'Unknown authoring action'});
  }catch{return json(502,{error:'Authoring request failed. Nothing was confirmed saved; reload before retrying.'});}
 };
}
export default createHandler();
