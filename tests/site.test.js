import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('homepage positions Jas through shipped forward-deployed proof',()=>{
 const s=read('index.html');
 for(const heading of ['Agentic AI &amp; Forward-Deployed','Selected Deployments','Forward-Deployed Technical Stack','Deployment Methodology','Experience &amp; Deployment Timeline','Verified Credentials &amp; Honors','The Human in the Loop','Technical Writing','Common Ground'])assert.ok(s.includes(heading),heading);
 for(const id of ['work','capabilities','approach','experience','credentials','story','writing','contact'])assert.ok(s.includes(`id="${id}"`),id);
 assert.ok(s.includes('Data Science &amp; AI/ML Intern'));assert.ok(s.includes('Jul 15 – Aug 15, 2026'));assert.ok(s.includes('40% faster retrieval'));assert.ok(!s.includes('45% faster retrieval'));
 assert.ok(s.includes('AI engineer building forward-deployed agentic systems'));assert.ok(!s.includes('Zero Third-Party Cloud Agent Lock-In'));
 assert.ok(s.includes('id="tree"'));assert.ok(s.includes('arrival-leaf'));
});

test('homepage uses only verified live recognition and direct contact links',()=>{
 const s=read('index.html');
 assert.ok(s.includes('https://indianexpress.com/article/entertainment/bollywood/he-starred-in-100-ads-a-hrithik-roshan-film-then-chose-quantum-physics-meet-jas-khetani-10918063/'));
 assert.ok(!/loksatta|ekids/i.test(s));assert.ok(!s.includes('3.97'));assert.ok(s.includes('GPA: 3.7'));
 assert.ok(s.includes('mailto:jaskhetani@outlook.com'));assert.ok(!s.includes('j.khetani@student.fdu.edu'));
 assert.ok(!s.includes('Jas_Khetani_FDE_Resume.pdf'),'no dead résumé action before Jas supplies the PDF');
 assert.ok(s.includes('Made with a strong helping hand from Vera Hermes, my Hermes Agent.'));
});

test('credentials and commercial proof use direct artifact URLs without channel links',()=>{
 const s=read('index.html');
 for(const url of [
  'https://certificates.codepath.org/1301ac00-9a2d-45c4-aa23-8719d0e878ac.pdf',
  'https://www.credly.com/badges/0da9e185-4136-4075-806a-751189c24795/public_url',
  'https://www.credly.com/badges/d35d856e-67e0-4571-9c66-b06dfeae76b5/public_url',
  'https://black.q-ctrl.com/certificate/8c155062-a021-445a-aa2b-4245620db049',
  'https://www.linkedin.com/learning/certificates/c25d72f1c72e30195f62c461efb4300ed12051143b894600f21f5a073eb316a5',
  'https://bitcoinsv.academy/student/certificate/6d98e78fc02e40d38aeabfc690361271',
  'https://www.credly.com/badges/17ca5824-889d-4703-91f9-7acc162df7dc/public_url'
 ])assert.ok(s.includes(url),url);
 for(const id of ['U0Fskq62ct0','A4TYz9omuX8','uvZ1i9qC87Y','PKZ2y1PJdns','FV5JlgiqnbI','51b8NgR8hWU'])assert.ok(s.includes(id),id);
 assert.ok(!/youtube\.com\/(?:@|channel\/|c\/|user\/)/i.test(s));
});

test('static SEO assets and structured data expose canonical crawlable routes',()=>{
 for(const f of ['public/robots.txt','public/sitemap.xml','public/og-cover.svg'])assert.ok(existsSync(new URL('../'+f,import.meta.url)),f);
 const robots=read('public/robots.txt'),sitemap=read('public/sitemap.xml');assert.match(robots,/Sitemap: https:\/\/jaskhetani\.vercel\.app\/sitemap\.xml/);for(const route of ['/','/journal','/journal/majorana-1'])assert.ok(sitemap.includes(`<loc>https://jaskhetani.vercel.app${route}</loc>`),route);
 const html=read('index.html'),match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);assert.ok(match,'JSON-LD');const schema=JSON.parse(match[1]);assert.equal(schema['@type'],'ProfilePage');assert.equal(schema.mainEntity.email,'mailto:jaskhetani@outlook.com');assert.equal(schema.mainEntity.hasCredential.length,7);
});

test('journal and on-site reader remain separate routes with clean article URLs',()=>{for(const f of ['journal.html','read.html','study.html'])assert.ok(existsSync(new URL('../'+f,import.meta.url)),f);const j=read('src/journal.js'),r=read('src/reader.js'),v=JSON.parse(read('vercel.json'));assert.ok(j.includes("'/journal/'"));assert.ok(r.includes('location.pathname'));assert.ok(v.rewrites.some(x=>x.source==='/journal/:slug'&&x.destination==='/read.html'));});
