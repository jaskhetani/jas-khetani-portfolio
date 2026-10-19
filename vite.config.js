import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import author from './api/author.js';
// Multi-page build: https://vite.dev/guide/build.html#multi-page-app
function cleanArticleRoutes(server){
 server.middlewares.use((req,_res,next)=>{
  if(/^\/journal\/[a-z0-9]+(?:-[a-z0-9]+)*\/?(?:\?.*)?$/.test(req.url||'')) req.url='/read.html';
  next();
 });
}

export default defineConfig({
 build:{rollupOptions:{input:{
  home:resolve('index.html'),
  journal:resolve('journal.html'),
  read:resolve('read.html'),
  study:resolve('study.html')
 }}},
 plugins:[{
  name:'local-routes-and-author-api',
  configureServer(server){
   cleanArticleRoutes(server);
   server.middlewares.use('/api/author',async(req,res)=>{
    let body='';
    for await(const chunk of req){
     body+=chunk;
     if(body.length>100000){res.statusCode=413;res.end('Too large');return;}
    }
    try{req.body=body?JSON.parse(body):undefined;}
    catch{res.statusCode=400;res.end('Invalid JSON');return;}
    await author(req,res);
   });
  },
  configurePreviewServer:cleanArticleRoutes
 }]
});
