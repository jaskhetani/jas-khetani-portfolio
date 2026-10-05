import {rasterize} from './rasterize.js';
self.onmessage=async e=>{try{self.postMessage({tiles:await rasterize(e.data)});}catch{self.postMessage({error:true});}};
