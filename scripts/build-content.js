import {readdir,readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {compileNote,compileMedium} from './content.js';
const root=new URL('../',import.meta.url),out=new URL('public/data/',root);await rm(out,{recursive:true,force:true});await mkdir(new URL('articles/',out),{recursive:true});
const articles=[];
for(const [folder,compile] of [['medium',compileMedium],['notes',compileNote]]){
 const dir=new URL('content/'+folder+'/',root);await mkdir(dir,{recursive:true});
 for(const file of (await readdir(dir)).filter(f=>f.endsWith('.json'))){let article;try{article=compile(JSON.parse(await readFile(new URL(file,dir),'utf8')));}catch(error){throw Error(`content/${folder}/${file}: ${error.message}`);}if(!article)continue;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))throw Error('Invalid article slug');if(articles.some(a=>a.slug===article.slug))throw Error('Duplicate article slug: '+article.slug);const words=article.html.replace(/<[^>]+>/g,' ').trim().split(/\s+/).length;article.readingMinutes=Math.max(1,Math.ceil(words/220));articles.push(article);await writeFile(new URL('articles/'+article.slug+'.json',out),JSON.stringify(article));}
}
articles.sort((a,b)=>new Date(b.date)-new Date(a.date));const catalog=articles.map(({html,...meta})=>meta);await writeFile(new URL('catalog.json',out),JSON.stringify(catalog));console.log('Published articles:',catalog.length,'; drafts excluded; HTML sanitized.');
