import {test,expect} from '@playwright/test';
// The authoring API is mocked per test; gates let a test hold a response open to exercise in-flight states.
const published={slug:'note-live',title:'Live note',summary:'',body:'Public body',status:'published',publishedAt:'2026-01-01T00:00:00.000Z'};
const draft={slug:'note-draft',title:'Draft note',summary:'',body:'Draft body',status:'draft',publishedAt:null};
function gate(){let open;const promise=new Promise(r=>open=r);return {promise,open};}
async function mockApi(page){
 const files={'note-live':{note:{...published},sha:'1'.repeat(40)},'note-draft':{note:{...draft},sha:'2'.repeat(40)}},api={files,saves:[],gates:{},failList:false,failSavePartial:false,requireUnpublishOnce:false,staleLoad:false};let n=2;
 await page.route(url=>url.pathname==='/api/author',async route=>{
  const url=new URL(route.request().url()),action=url.searchParams.get('action');
  const held=api.gates[action];if(held){delete api.gates[action];await held.promise;}
  if(action==='session')return route.fulfill({json:{login:'jaskhetani',csrf:'csrf-token'}});
  if(action==='notes')return api.failList?route.fulfill({status:502,json:{error:'Unable to list notes'}}):route.fulfill({json:{notes:Object.entries(files).map(([slug,f])=>({slug,sha:f.sha}))}});
  if(action==='note'){const f=files[url.searchParams.get('slug')],publicPresent=f.note.status==='published';return route.fulfill({json:{note:f.note,sha:f.sha,publicPresent,publicSynced:!api.staleLoad}});}
  if(action==='save'){const body=route.request().postDataJSON();api.saves.push(body);if(api.requireUnpublishOnce&&!body.unpublish){api.requireUnpublishOnce=false;return route.fulfill({status:409,json:{error:'Public copy exists.',unpublishRequired:true,publicPresent:true}});}const sha=String(++n).repeat(40).slice(0,40);const note={...body,publishedAt:files[body.slug]?.note.publishedAt||null};delete note.sha;delete note.unpublish;files[body.slug]={note,sha};if(api.failSavePartial){api.failSavePartial=false;return route.fulfill({status:502,json:{error:'Private source saved; public sync failed. Retry.',saved:true,note,sha,publicState:'unknown',publicSynced:false}});}return route.fulfill({json:{note,sha,commit:'b'.repeat(40),publicPresent:note.status==='published',publicSynced:true}});}
  return route.fulfill({status:404,json:{error:'Unknown'}});
 });
 return api;
}
async function open(page){const api=await mockApi(page);await page.goto('/study');await expect(page.locator('#editor')).toBeVisible();await expect(page.locator('#note-picker option')).toHaveCount(3);return api;}
const dialogs=(page,answers)=>{const seen=[];page.on('dialog',d=>{seen.push(d.message());(answers.shift()??true)?d.accept():d.dismiss();});return seen;};

test('new notes get the note- namespace and the state line says nothing is saved',async({page})=>{
 await open(page);await page.locator('#note-title').fill('My Small Build!');await expect(page.locator('#note-slug')).toHaveValue('note-my-small-build');
 await expect(page.locator('#note-state')).toContainText('New note');
});

test('the visual editor formats prose while preserving Markdown storage and preview',async({page})=>{
 const api=await open(page);await page.locator('#note-title').fill('Rich field note');
 const editor=page.locator('#rich-editor');await expect(editor).toBeVisible();await expect(page.locator('#note-body')).toBeHidden();
 await editor.fill('A useful finding');await editor.selectText();await page.getByRole('button',{name:'Bold'}).click();
 await expect(page.locator('#note-preview strong')).toHaveText('A useful finding');await expect(page.locator('#editor-word-count')).toHaveText('3 words · 1 min read');
 await page.getByRole('button',{name:'Save draft'}).click();await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');
 expect(api.saves.at(-1).body).toContain('**A useful finding**');
});

test('changing metadata preserves untouched legacy Markdown byte for byte',async({page})=>{
 const api=await open(page),legacy='| A | B |\n| - | - |\n| one | two |\n\n~~kept~~ and [mail](mailto:jas@example.com)';api.files['note-draft'].note.body=legacy;
 await page.locator('#note-picker').selectOption('note-draft');await page.getByRole('button',{name:'Undo'}).click();await page.locator('#note-title').fill('Draft note, revised');await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');expect(api.saves.at(-1).body).toBe(legacy);
});

test('the code-block tool preserves selected block boundaries in fenced Markdown',async({page})=>{
 const api=await open(page);await page.locator('#note-title').fill('Code note');const editor=page.locator('#rich-editor');await editor.evaluate(element=>{element.innerHTML='<p>const answer = 42;</p><p>return answer;</p>';element.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText'}));const range=document.createRange();range.selectNodeContents(element);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);});await page.getByRole('button',{name:'Code block'}).click();
 await page.getByRole('button',{name:'Save draft'}).click();const body=api.saves.at(-1).body;expect(body).toContain('```\nconst answer = 42;\nreturn answer;\n```');
});

test('cancelling a note switch restores the picker and keeps edits',async({page})=>{
 await open(page);const seen=dialogs(page,[false]);
 await page.locator('#note-picker').selectOption('note-draft');await expect(page.locator('#rich-editor')).toHaveText('Draft body');
 await page.locator('#rich-editor').fill('Edited draft');await page.locator('#note-picker').selectOption('note-live');
 expect(seen[0]).toMatch(/Discard unsaved changes/);await expect(page.locator('#note-picker')).toHaveValue('note-draft');await expect(page.locator('#rich-editor')).toHaveText('Edited draft');
 await expect(page.locator('#note-state')).toContainText('Unsaved changes');
});

test('controls are disabled while a note loads, and fields cannot be edited mid-load',async({page})=>{
 const api=await open(page);const held=gate();api.gates.note=held;
 await page.locator('#note-picker').selectOption('note-live');
 for(const id of ['#note-picker','#new-note','#sign-out','#export-note'])await expect(page.locator(id)).toBeDisabled();
 await expect(page.locator('#note-form button[type=submit]').first()).toBeDisabled();await expect(page.locator('#rich-editor')).toHaveAttribute('contenteditable','false');
 held.open();await expect(page.locator('#rich-editor')).toHaveText('Public body');await expect(page.locator('#note-picker')).toBeEnabled();
 await expect(page.locator('#rich-editor')).toHaveAttribute('contenteditable','true');await expect(page.locator('#note-state')).toContainText('PUBLISHED');
});

test('typing while a save is in flight keeps the new text and stays dirty',async({page})=>{
 const api=await open(page);await page.locator('#note-picker').selectOption('note-draft');await expect(page.locator('#rich-editor')).toHaveText('Draft body');
 const held=gate();api.gates.save=held;await page.locator('#rich-editor').fill('Version one');await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.locator('#editor-status')).toHaveText('Saving to GitHub…');for(const id of ['#note-picker','#new-note','#sign-out'])await expect(page.locator(id)).toBeDisabled();
 await page.locator('#rich-editor').pressSequentially(' plus more');held.open();
 await expect(page.locator('#editor-status')).toContainText('Edits typed while saving are not saved yet');
 await expect(page.locator('#rich-editor')).toHaveText('Version one plus more');expect(api.saves[0].body).toBe('Version one');
 await expect(page.locator('#note-state')).toContainText('Unsaved changes');await expect(page.locator('#note-picker')).toHaveValue('note-draft');
});

test('saving a published note as draft requires confirming the unpublish',async({page})=>{
 const api=await open(page);await page.locator('#note-picker').selectOption('note-live');await expect(page.locator('#note-state')).toContainText('PUBLISHED');
 const seen=dialogs(page,[false,true]);await page.locator('#rich-editor').fill('Changed');
 await page.getByRole('button',{name:'Save draft'}).click();expect(seen[0]).toMatch(/currently published/);expect(api.saves).toHaveLength(0);
 await page.getByRole('button',{name:'Save draft'}).click();await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');
 expect(api.saves[0]).toMatchObject({status:'draft',unpublish:true});await expect(page.locator('#note-state')).toContainText('a private draft');
 // Saving the (now) draft again needs no unpublish confirmation or flag.
 await page.locator('#rich-editor').fill('Changed again');await page.getByRole('button',{name:'Save draft'}).click();await expect(page.locator('#editor-status')).toContainText('Draft saved');
 expect(seen).toHaveLength(2);expect(api.saves[1].unpublish).toBeUndefined();
});

test('a list refresh failure after a verified save reports the save as successful',async({page})=>{
 const api=await open(page);await page.locator('#note-title').fill('Fresh idea');await page.locator('#rich-editor').fill('Body');api.failList=true;
 await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');await expect(page.locator('#editor-status')).toContainText('could not refresh');
 await expect(page.locator('#note-picker')).toHaveValue('note-fresh-idea');await expect(page.locator('#note-picker')).toBeEnabled();await expect(page.locator('#note-slug')).toHaveJSProperty('readOnly',true);
});

test('a partial unpublish failure stays honest and can be retried from the editor',async({page})=>{
 const api=await open(page);await page.locator('#note-picker').selectOption('note-live');await expect(page.locator('#note-state')).toContainText('PUBLISHED');
 const seen=dialogs(page,[true,true]);api.failSavePartial=true;await page.locator('#rich-editor').fill('Changed');await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.locator('#editor-status')).toContainText('public sync failed');await expect(page.locator('#note-state')).toContainText('needs reconciliation');expect(api.saves[0]).toMatchObject({status:'draft',unpublish:true});const partialSha=api.files['note-live'].sha;
 await page.getByRole('button',{name:'Save draft'}).click();await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');expect(seen[1]).toMatch(/unresolved public sync/);expect(api.saves[1]).toMatchObject({status:'draft',unpublish:true,sha:partialSha});await expect(page.locator('#note-state')).toContainText('a private draft');
});

test('loading a stale public copy reports reconciliation instead of claiming it is published',async({page})=>{
 const api=await open(page);api.staleLoad=true;await page.locator('#note-picker').selectOption('note-live');await expect(page.locator('#editor-status')).toContainText('needs reconciliation');await expect(page.locator('#note-state')).toContainText('public state needs reconciliation');await expect(page.locator('#note-state')).not.toContainText('PUBLISHED on the public journal');
});

test('an unexpected public copy can be confirmed and reconciled without publishing first',async({page})=>{
 const api=await open(page);api.requireUnpublishOnce=true;const seen=dialogs(page,[true]);await page.locator('#note-title').fill('Recovered draft');await page.locator('#rich-editor').fill('Private body');await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.locator('#editor-status')).toContainText('Draft saved and verified');expect(seen[0]).toMatch(/public copy.*already exists/i);expect(api.saves).toHaveLength(2);expect(api.saves[0].unpublish).toBeUndefined();expect(api.saves[1]).toMatchObject({status:'draft',unpublish:true});
});

test('a slug outside the note namespace is rejected before any request',async({page})=>{
 const api=await open(page);await page.locator('#note-title').fill('Collision');await page.locator('#note-slug').fill('majorana-1');await page.locator('#rich-editor').fill('Body');
 await page.getByRole('button',{name:'Save draft'}).click();await expect(page.locator('#editor-status')).toContainText('must start with "note-"');expect(api.saves).toHaveLength(0);
});
