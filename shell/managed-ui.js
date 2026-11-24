/* Club-managed appearance and dedicated promotions. Native bridge retains authority. */
(()=>{'use strict';
const defaults={glass:true,tilt:true,motion:true,pixel:false,topography:true,bg:'fixed',intensity:5,speed:1,wallpaperBlur:12,wallpaperOpacity:65,panelOpacity:42};
let effectKey='',promotionItems=[];
const baseOpen=openDrawer;openDrawer=function(type){if(type==='effects'||type==='library')return;baseOpen(type);};
function paintPromotions(){
 const host=document.getElementById('shell-promotions');if(!host)return;
 if(!promotionItems.length){host.innerHTML='<div class="glass offer"><h2>Акций пока нет</h2><p>Здесь появятся предложения клуба.</p></div>';return;}
 host.innerHTML=promotionItems.map(p=>'<article class="glass offer promotion-section-card">'+(p.artwork?'<img src="'+E(p.artwork)+'" alt="" draggable="false">':'')+'<h2>'+E(p.title)+'</h2><p>'+E(p.text)+'</p><button type="button" class="primary" data-section-promotion="'+E(p.id)+'" '+(p.target==='game'&&!games.some(g=>g.id===p.gameId)?'disabled':'')+'>'+E(p.target==='game'?'К игре':({games:'В библиотеку',tariffs:'Тарифы',bar:'Бар',topup:'Пополнить'})[p.target]||'Подробнее')+'</button></article>').join('');
}
const basePage=renderPage;renderPage=function(){basePage();if(state.page==='promotions')paintPromotions();};
const baseStatus=status;status=function(data){
 if(data.context!==state.context){promotionItems=[];effectKey='';}
 const effects={...defaults,...data.shellEffects},key=JSON.stringify(effects);
 const changed=key!==effectKey;if(changed){Object.assign(state,effects);state.sort='catalog';state.availableOnly=false;effectKey=key;}
 baseStatus(data);
 const dim=Number.isFinite(Number(data.backgroundDim))?Math.max(0,Math.min(90,Number(data.backgroundDim))):0;
 document.documentElement.style.setProperty('--screen-background-dim',data.background?String(dim/100):'0');
 if(changed){applyEffects();state.bg==='game'?backgroundForGame():setBackground(state.background);}
};
window.chrome?.webview?.addEventListener('message',event=>{
 const m=event.data;if(m?.type==='promotions'&&m.context===state.context){promotionItems=(Array.isArray(m.items)?m.items:[]).filter(p=>p.enabled!==false).slice(0,8);if(state.page==='promotions')paintPromotions();}
});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-section-promotion]');if(!b||b.disabled)return;const p=promotionItems.find(p=>p.id===b.dataset.sectionPromotion);if(!p)return;
 if(p.target==='game'){if(!games.some(g=>g.id===p.gameId))return;state.filter='all';state.query='';state.availableOnly=false;state.selected=p.gameId;navigate('games');window.Noth1ngLibraryViewport?.reveal(p.gameId);return;}
 navigate(['games','tariffs','bar','topup'].includes(p.target)?p.target:'promotions');
});
motionQuery.addEventListener('change',()=>{Object.assign(state,{...defaults,...state.shellEffects});applyEffects();});
renderPage();
})();
