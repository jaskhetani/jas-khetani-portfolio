import DOMPurify from 'dompurify';
const slug=new URLSearchParams(location.search).get('post'),title=document.querySelector('#article-title'),body=document.querySelector('#article-body');let size=18;
function setSize(delta){size=Math.max(16,Math.min(24,size+delta));body.style.setProperty('--reading-size',size+'px');document.querySelector('#smaller').disabled=size===16;document.querySelector('#larger').disabled=size===24;}
document.querySelector('#smaller').addEventListener('click',()=>setSize(-1));document.querySelector('#larger').addEventListener('click',()=>setSize(1));document.querySelector('#print').addEventListener('click',()=>print());
let ticking=false;function progress(){ticking=false;const article=document.querySelector('#article'),start=article.offsetTop,total=article.offsetHeight-innerHeight;const fraction=Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,total)));document.querySelector('.reading-progress span').style.transform=`scaleX(${fraction})`;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress,{passive:true});
try{
 if(!slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Choose an article from the journal to open a scroll.');
 const r=await fetch('/data/articles/'+slug+'.json');if(!r.ok)throw Error('This scroll was not found. It may be unpublished or the link may be outdated.');const article=await r.json();
 title.textContent=article.title;document.title=article.title+' — Jas Khetani';document.querySelector('meta[name=description]').content=article.summary||article.title;
 document.querySelector('#article-meta').textContent=`${article.category==='field'?'Project note':'Technical essay'} · ${new Date(article.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} · ${article.readingMinutes} min read`;
 const source=document.querySelector('#article-source');source.textContent=article.sourceUrl?'By Jas Khetani · Full article body imported from the author’s public Medium feed. ':'By Jas Khetani · Published in this journal. ';
 if(article.sourceUrl){const a=document.createElement('a');a.textContent='Original & attribution ↗';a.href=article.sourceUrl;source.append(a);}
 body.innerHTML=DOMPurify.sanitize(article.html,{ADD_ATTR:['loading','decoding','referrerpolicy'],FORBID_TAGS:['style','iframe','form','input','button']});
 const headings=[...body.querySelectorAll('h1,h2,h3,h4')];const toc=document.querySelector('#contents');headings.forEach((h,i)=>{h.id='section-'+i;const link=document.createElement('a');link.href='#'+h.id;link.textContent=h.textContent;toc.append(link);});if(!headings.length)toc.textContent='A short uninterrupted read.';
 for(const image of body.querySelectorAll('img')){image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';image.addEventListener('error',()=>{const note=document.createElement('p');note.className='fine-print';note.textContent='This source image is unavailable. The original article link above may still provide it.';image.replaceWith(note);});image.addEventListener('load',progress,{once:true});}
 progress();
}catch(error){title.textContent='Scroll unavailable';const e=document.querySelector('#reader-error');e.hidden=false;e.textContent=error.message||'Unable to load this article. Return to the journal and try again.';body.textContent='The reading shelf is still open. No missing article text has been substituted.';}
