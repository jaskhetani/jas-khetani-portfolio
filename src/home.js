requestAnimationFrame(()=>requestAnimationFrame(()=>import('./tree.js').catch(()=>document.documentElement.classList.add('tree-ready'))));
