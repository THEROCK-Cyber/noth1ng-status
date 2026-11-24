/* Presentation only: native actions are unchanged. */
(()=>{'use strict';
function decorate(){document.querySelectorAll('.game-card').forEach(card=>{if(card.querySelector('.card-shade'))return;const shade=document.createElement('span');shade.className='card-shade';shade.setAttribute('aria-hidden','true');card.prepend(shade);});}
const base=renderGrid;renderGrid=function(){base();decorate();};
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')document.body.classList.add('card-touch-input');else if(e.pointerType==='mouse')document.body.classList.remove('card-touch-input');},{passive:true,capture:true});
document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&(e.movementX||e.movementY))document.body.classList.remove('card-touch-input');},{passive:true});
document.addEventListener('keydown',e=>{if(['Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key))document.body.classList.remove('card-touch-input');});
decorate();
})();