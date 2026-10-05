import {marked} from 'marked';import DOMPurify from 'dompurify';
const $=s=>document.querySelector(s),status=$('#editor-status'),form=$('#note-form'),picker=$('#note-picker');
// loadedSlug/loadedStatus describe what GitHub holds for the note in the editor; revision counts keystrokes so a save never clears edits typed while it was in flight.
let csrf='',sha=null,dirty=false,busy=false,loadedSlug='',loadedStatus=null,revision=0,request=0;
const NOTE_PREFIX='note-';
const fields={title:$('#note-title'),slug:$('#note-slug'),summary:$('#note-summary'),body:$('#note-body')};
const controls=()=>[picker,$('#new-note'),$('#sign-out'),...form.querySelectorAll('button')];
const state=document.createElement('p');state.id='note-state';state.className='fine-print';state.setAttribute('aria-live','polite');$('#editor .button-row').after(state);
function message(text,error=false){status.textContent=text;status.classList.toggle('error',error);}
function renderState(){state.dataset.status=loadedStatus||'new';state.textContent=(loadedSlug?`Editing ${loadedSlug}: currently ${loadedStatus==='published'?'PUBLISHED on the public journal':'a private draft'}.`:'New note: not saved to GitHub yet.')+(dirty?' Unsaved changes.':'');}
// Loading replaces every field, so fields lock too; saving only locks the slug so typing can continue.
function setBusy(on,lockFields=false){busy=on;for(const c of controls())c.disabled=on;fields.slug.readOnly=on||Boolean(loadedSlug);for(const k of ['title','summary','body'])fields[k].readOnly=on&&lockFields;}
async function api(action,options={}){const r=await fetch('/api/author?action='+action,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json','X-CSRF-Token':csrf,...options.headers}});let data;try{data=await r.json();}catch{throw Error('Authoring API is unavailable. Deploy on Vercel with the documented server configuration.');}if(!r.ok)throw Error(data.error||'Request failed');return data;}
function preview(){$('#note-preview').innerHTML=DOMPurify.sanitize(marked.parse(fields.body.value),{FORBID_TAGS:['style','iframe','form','input','button']});}
function ensureOption(slug){if(slug&&![...picker.options].some(o=>o.value===slug))picker.add(new Option(slug,slug));picker.value=loadedSlug;}
function clear(){request++;sha=null;loadedSlug='';loadedStatus=null;for(const field of Object.values(fields))field.value='';delete fields.slug.dataset.edited;fields.slug.readOnly=false;picker.value='';dirty=false;revision++;preview();renderState();message('New note. Nothing saved yet.');}
async function list(){const data=await api('notes');picker.replaceChildren(new Option('New note',''));for(const note of data.notes)picker.add(new Option(note.slug,note.slug));ensureOption(loadedSlug);}
async function load(slug){const ticket=++request;setBusy(true,true);message('Loading '+slug+'…');try{const data=await api('note&slug='+encodeURIComponent(slug));if(ticket!==request)return;for(const [k,f] of Object.entries(fields))f.value=data.note[k]||'';sha=data.sha;loadedSlug=slug;loadedStatus=data.note.status;dirty=false;revision++;preview();message('Loaded '+data.note.status+' from GitHub.');}catch(e){if(ticket!==request)return;picker.value=loadedSlug;message(e.message,true);}finally{if(ticket===request){setBusy(false);renderState();}}}
for(const field of Object.values(fields))field.addEventListener('input',()=>{revision++;dirty=true;preview();renderState();});
fields.title.addEventListener('input',()=>{if(!loadedSlug&&!busy&&!fields.slug.dataset.edited){const words=fields.title.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80-NOTE_PREFIX.length).replace(/-$/,'');fields.slug.value=words?NOTE_PREFIX+words:'';}});fields.slug.addEventListener('input',()=>fields.slug.dataset.edited='true');
$('#new-note').addEventListener('click',()=>{if(busy)return;if(!dirty||confirm('Discard unsaved changes?'))clear();});
picker.addEventListener('change',async()=>{const slug=picker.value;if(busy||(dirty&&!confirm('Discard unsaved changes and load this note?'))){picker.value=loadedSlug;return;}if(!slug){clear();return;}await load(slug);});
form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const publish=e.submitter?.dataset.status==='published';const note=Object.fromEntries(Object.entries(fields).map(([k,f])=>[k,f.value]));
 if(!note.slug.startsWith(NOTE_PREFIX)){message(`The URL identifier must start with "${NOTE_PREFIX}" so it cannot collide with imported articles.`,true);return;}
 if(publish&&!confirm('Publish this note to the public journal on the next successful deployment?'))return;
 const unpublish=!publish&&loadedStatus==='published';
 if(unpublish&&!confirm('This note is currently published. Saving it as a draft removes it from the public journal on the next deployment. Unpublish it?'))return;
 const rev=revision;let data;setBusy(true);message('Saving to GitHub…');
 try{data=await api('save',{method:'POST',body:JSON.stringify({...note,status:publish?'published':'draft',sha,...(unpublish?{unpublish:true}:{})})});}catch(error){setBusy(false);renderState();message(error.message,true);return;}
 sha=data.sha;loadedSlug=data.note.slug;loadedStatus=data.note.status;dirty=revision!==rev;
 const saved=(publish?'Published commit verified in GitHub. The public page updates after Vercel finishes its build.':'Draft saved and verified in the private repository. It is not included in the public build.')+(dirty?' Edits typed while saving are not saved yet.':'');
 try{await list();message(saved);}catch(error){ensureOption(loadedSlug);message(saved+' However, the saved-notes list could not refresh ('+error.message+'). Reload to see the full list.',true);}
 finally{setBusy(false);renderState();}
});
$('#export-note').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(Object.fromEntries(Object.entries(fields).map(([k,f])=>[k,f.value])),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(fields.slug.value||'note')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#sign-out').addEventListener('click',async()=>{if(busy)return;if(dirty&&!confirm('Sign out and discard unsaved edits?'))return;try{await api('logout',{method:'POST'});dirty=false;location.reload();}catch(e){message(e.message,true);}});
addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
renderState();
try{const session=await api('session');csrf=session.csrf;$('#auth-panel').hidden=true;$('#editor').hidden=false;await list();message('Signed in as '+session.login+'.');}catch(e){$('#auth-message').textContent=e.message;$('#sign-in').hidden=/not configured|unavailable/.test(e.message);}
