requestAnimationFrame(()=>requestAnimationFrame(()=>import('./tree.js').catch(()=>document.documentElement.classList.add('tree-ready'))));

// An owner-only entrance gesture: reach the footer, then make two deliberate upward scrolls.
// /study remains protected by GitHub OAuth; the gesture is convenience, never authentication.
let upwardIntents=0,gestureDeadline=0,lastIntentAt=0,touchStartY=null,touchStartedAtBottom=false,wheelBurst=false,wheelStartedAtBottom=false,wheelTotal=0,wheelBurstTimer=0;
const atBottomEdge=()=>document.documentElement.scrollHeight>innerHeight+20&&scrollY+innerHeight>=document.documentElement.scrollHeight-20;
const wheelPixels=event=>event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
function resetGesture(){upwardIntents=0;gestureDeadline=0;lastIntentAt=0;}
function registerUpwardIntent(startedAtBottom){const now=performance.now();if(now>gestureDeadline)resetGesture();if(!startedAtBottom||upwardIntents>0&&now-lastIntentAt<600)return;upwardIntents++;lastIntentAt=now;gestureDeadline=now+5000;if(upwardIntents>=2)location.assign('/study');}
function finishWheelBurst(){wheelBurst=false;const total=wheelTotal,startedAtBottom=wheelStartedAtBottom;wheelTotal=0;wheelStartedAtBottom=false;if(total<=-360)registerUpwardIntent(startedAtBottom);}
addEventListener('wheel',event=>{if(event.ctrlKey)return;const delta=wheelPixels(event);if(delta<0){if(!wheelBurst){wheelBurst=true;wheelStartedAtBottom=atBottomEdge();wheelTotal=0;}wheelTotal+=delta;clearTimeout(wheelBurstTimer);wheelBurstTimer=setTimeout(finishWheelBurst,180);}else if(delta>0&&wheelBurst){clearTimeout(wheelBurstTimer);finishWheelBurst();}},{passive:true});
addEventListener('touchstart',event=>{if(event.touches.length!==1){touchStartY=null;touchStartedAtBottom=false;return;}touchStartY=event.touches[0]?.clientY??null;touchStartedAtBottom=atBottomEdge();},{passive:true});
addEventListener('touchend',event=>{const endY=event.changedTouches[0]?.clientY;if(touchStartY!==null&&endY-touchStartY>=140)registerUpwardIntent(touchStartedAtBottom);touchStartY=null;touchStartedAtBottom=false;},{passive:true});
