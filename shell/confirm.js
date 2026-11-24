/* Explicit Shell exit confirmation; native bridge authorization is unchanged. */
(()=>{'use strict';const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
let confirming=false;
function modal(title){const d=make('dialog',null,'rb-flow-dialog');const h=make('h2',title);h.id='rb-flow-title';d.setAttribute('aria-labelledby',h.id);d.append(h);d.addEventListener('keydown',e=>e.stopPropagation());document.body.append(d);const previous=document.activeElement;d.addEventListener('close',()=>{d.remove();if(previous?.isConnected)previous.focus();},{once:true});return d;}
function confirmAction({message,method='button'}){if(confirming)return Promise.resolve(false);confirming=true;return new Promise(resolve=>{
 const d=modal('Подтвердите действие'),text=make('p',message,'rb-confirm-message'),cancel=make('button','Отмена'),area=make('div',null,'rb-flow-actions');cancel.type='button';area.append(cancel);d.append(text,area);let done=false,timer=0,started=0,frame=0,holding=false;
 const reset=()=>{clearTimeout(timer);cancelAnimationFrame(frame);holding=false;area.style.setProperty('--hold','0%');};
 const finish=value=>{if(done)return;done=true;reset();confirming=false;d.close();resolve(value);};cancel.onclick=()=>finish(false);d.oncancel=e=>{e.preventDefault();finish(false);};d.addEventListener('close',()=>{if(!done)finish(false);},{once:true});
 if(method==='slide'){
  const label=make('label','Сдвиньте вправо до конца для отправки','rb-slide-label'),range=make('input');range.type='range';range.min='0';range.max='100';range.step='1';range.value='0';range.setAttribute('aria-label','Подтверждение массовой команды');const live=make('span','0%');label.append(range,live);d.insertBefore(label,area);range.oninput=()=>live.textContent=range.value+'%';range.onchange=()=>{if(Number(range.value)===100)finish(true);else{range.value='0';live.textContent='0%';}};
 }else{
  const yes=make('button',method==='hold'?'Удерживайте 1 секунду':'Подтвердить','rb-confirm-button');yes.type='button';area.append(yes);
  if(method==='hold'){
   const tick=()=>{if(!holding)return;area.style.setProperty('--hold',Math.min(100,(performance.now()-started)/10)+'%');frame=requestAnimationFrame(tick);};
   const begin=()=>{if(holding||done)return;holding=true;started=performance.now();timer=setTimeout(()=>finish(true),1000);tick();};
   yes.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();yes.focus();yes.setPointerCapture(e.pointerId);begin();};yes.onpointerup=reset;yes.onpointercancel=reset;yes.onlostpointercapture=reset;yes.onblur=reset;
   yes.onpointermove=e=>{if(!holding)return;const r=yes.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)reset();};
   yes.onkeydown=e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat)begin();}};yes.onkeyup=e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();reset();}};
  }else yes.onclick=()=>finish(true);
 }
 d.showModal();cancel.focus();
});}

window.Noth1ngShellConfirm=confirmAction;
})();
