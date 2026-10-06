import {test,expect} from '@playwright/test';
const widths=[320,390,768,1024,1440];
async function waitForCanopyImages(page){await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('#flowers image')].map(async el=>{const image=new Image();image.src=el.getAttribute('href');await image.decode();}));});}

for(const width of widths){
 test(`homepage geometry and usable navigation at ${width}px`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('h1')).toHaveText('AI & SoftwareEngineering.');await page.waitForFunction(()=>window.treeStudy?.geometry.ready);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,connected:treeStudy.geometry.connections.every(c=>c.error===0),ground:treeStudy.geometry.groundY===document.querySelector('.ground').offsetTop+84,flowers:treeStudy.geometry.flowerCount,mainThreadMs:treeStudy.geometry.buildMs,rasterMs:treeStudy.geometry.rasterMs}));
  console.log(width,JSON.stringify(state));expect(state.overflow).toBe(false);expect(state.connected).toBe(true);expect(state.ground).toBe(true);expect(state.flowers).toBeGreaterThan(20000);
  await waitForCanopyImages(page);await page.screenshot({path:`test-results/home-${width}.png`});
  await expect(page.locator('#lab')).toHaveCount(0);await expect(page.getByText('Made with a strong helping hand from Vera Hermes')).toBeVisible();
  await page.locator('details summary').first().click();await expect(page.locator('details').first()).toHaveAttribute('open','');
  await page.waitForFunction(()=>treeStudy.geometry.groundY===document.querySelector('.ground').offsetTop+84);
  expect(errors).toEqual([]);
 });
 test(`journal and scroll reader at ${width}px`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});await page.goto('/journal');await expect.poll(()=>page.locator('.scroll-card').count()).toBeGreaterThanOrEqual(10);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.screenshot({path:`test-results/journal-${width}.png`});
  await page.getByRole('button',{name:'Lab notebooks',exact:true}).click();await expect(page.locator('.scroll-card')).toHaveCount(3);await page.locator('#search').fill('not-an-article');await expect(page.locator('#empty')).toBeVisible();await page.getByRole('button',{name:'Show all writing'}).click();await expect.poll(()=>page.locator('.scroll-card').count()).toBeGreaterThanOrEqual(10);
  await page.locator('.open-scroll').first().click();await expect(page.locator('#article-title')).not.toHaveText('Opening your scroll…');await expect(page.locator('#article-body')).not.toBeEmpty();
  expect(await page.locator('#article-body').innerText()).toMatch(/quantum/i);expect((await page.locator('#article-body').innerText()).length).toBeGreaterThan(5000);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  await page.getByRole('button',{name:'Larger text'}).click();await expect(page.locator('#article-body')).toHaveCSS('font-size','19px');await page.screenshot({path:`test-results/reader-${width}.png`});expect(errors).toEqual([]);
 });
}
test('reduced motion has no frames and the leaf does not spin',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.waitForFunction(()=>window.treeStudy?.geometry.ready);expect(await page.evaluate(()=>treeStudy.paused()&&!treeStudy.pendingFrame())).toBe(true);await expect(page.locator('.arrival')).toBeHidden();});
test('unknown scroll is a useful error and study remains locked',async({page})=>{await page.goto('/read?post=missing-article');await expect(page.locator('#reader-error')).toBeVisible();await page.goto('/study');await expect(page.locator('#auth-panel')).toBeVisible();await expect(page.locator('#editor')).toBeHidden();});
test('all ten imported articles render nonempty local full bodies',async({page})=>{const response=await page.request.get('/data/catalog.json');const articles=await response.json();const imported=articles.filter(a=>a.sourceUrl);expect(imported).toHaveLength(10);for(const a of imported){await page.goto('/read?post='+a.slug);await expect(page.locator('#article-title')).toHaveText(a.title);expect((await page.locator('#article-body').innerText()).length).toBeGreaterThan(5000);expect(await page.locator('#article-body script,#article-body iframe,img[src*="medium.com/_/stat"]').count()).toBe(0);}});
