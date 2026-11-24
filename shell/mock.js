/* Демо-мост: имитирует ответы нативного Shell (WebView2). Все данные — примерные. */
(()=>{'use strict';
const listeners=[];const ctx='demo-ctx';const nonce='demo-nonce';
const art=(t,h)=>{const ini=t.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},55%,34%)"/><stop offset="1" stop-color="hsl(${(h+50)%360},45%,12%)"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="470" cy="110" r="150" fill="hsl(${h},70%,60%)" opacity=".13"/><circle cx="120" cy="320" r="120" fill="#fff" opacity=".05"/><text x="320" y="215" text-anchor="middle" font-family="Unbounded,Arial" font-weight="700" font-size="96" fill="#fff" opacity=".88">${ini}</text></svg>`;
 return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg)};
const raw=[['Counter-Strike 2',8,'Steam'],['Dota 2',0,'Steam'],['Valorant',350,'Riot'],['Fortnite',265,'Epic Games'],['Apex Legends',12,'Steam'],['PUBG',40,'Steam'],['GTA V',130,'Epic Games'],['Rust',22,'Steam'],['Minecraft',140,'Minecraft Launcher'],['Cyberpunk 2077',55,'Steam'],['Rocket League',205,'Epic Games'],['Overwatch 2',215,'Battle.net']];
let games=raw.map(([n,h,l],i)=>({id:'g'+i,name:n,launcher:false,application:false,launcherName:l,favorite:i===0||i===3,recent:i<4?'2026-11-2'+(4-i)+'T12:00:00Z':null,available:true,artwork:art(n,h),description:i===0?'Командный тактический шутер. Запуск через Steam на этом компьютере.':''}));
games.push({id:'a1',name:'Steam',launcher:true,application:false,launchername:'',launcherName:'',favorite:false,recent:null,available:true,artwork:art('Steam',210)},{id:'a2',name:'Discord',launcher:false,application:true,favorite:false,recent:null,available:true,artwork:art('Discord',235)},{id:'a3',name:'OBS Studio',launcher:false,application:true,favorite:false,recent:null,available:true,artwork:art('OBS Studio',0)});
const S={type:'status',nonce,context:ctx,active:true,owner:false,busy:false,cash:850000,bonus:120000,timer:'01:42:10',timerLabel:'Осталось времени',package:'Пакет «3 часа»',pc:'PC133',zone:'Stream',name:'player_01',club:'Noth1ng',connection:'Библиотека клуба',announcement:'',accent:'#fa6262',canPurchaseTime:true,guest:false,effectsActive:true,logo:'assets/logo.png',background:null};
let secs=1*3600+42*60+10;
const post=m=>listeners.forEach(f=>f({data:m}));
const later=(f,ms)=>setTimeout(f,ms);
const pages={
 tariffs:()=>({tariffs:[{id:'t1',name:'Час',zoneId:'Stream',kind:'HOURLY',priceMinor:150000,basePriceMinor:150000,discountPercent:0,benefitsText:'Поминутная оплата по часовому тарифу'},{id:'t2',name:'Пакет «3 часа»',zoneId:'Stream',durationMinutes:180,kind:'PACKAGE',priceMinor:400000,basePriceMinor:450000,discountPercent:11,benefitsText:'Скидка на время, бонусы за пополнение'},{id:'t3',name:'Ночь',zoneId:'Stream',durationMinutes:480,kind:'PACKAGE',priceMinor:900000,basePriceMinor:900000,discountPercent:0,benefitsText:'С 23:00 до 07:00'}],packages:[{id:'p1',name:'Пакет «3 часа»',availableMinutes:102,zoneId:'Stream',status:'ACTIVE'}],purchasePending:false}),
 bar:()=>({products:[['Coca-Cola 0,5',' Напитки',24,60000],['Energy Drink','Напитки',12,90000],['Вода 0,5','Напитки',40,30000],['Чипсы','Снеки',18,70000],['Сэндвич','Еда',6,160000],['Шоколад','Снеки',0,80000]].map(([name,category,available,priceMinor],i)=>({id:'b'+i,name,category:category.trim(),available,priceMinor}))}),
 history:()=>({walletEntries:[{createdUtc:'2026-11-24T08:10:00Z',entryType:'CASH_TOPUP',balanceType:'CASH',deltaMinor:500000},{createdUtc:'2026-11-24T08:10:05Z',entryType:'BONUS',balanceType:'BONUS',deltaMinor:50000},{createdUtc:'2026-11-23T19:40:00Z',entryType:'PURCHASE',balanceType:'CASH',deltaMinor:-400000},{createdUtc:'2026-11-22T21:05:00Z',entryType:'METERED_MINUTE',balanceType:'CASH',deltaMinor:-75000}],topups:[]})
};
function sendPage(p){if(pages[p])later(()=>post({type:'page',page:p,data:pages[p]()}),350)}
function onMessage(m){
 if(m.command==='ready'){later(()=>{post(S);post({type:'catalog',items:games});post({type:'promotions',context:ctx,items:[{id:'pr1',title:'Счастливые часы',text:'С 12:00 до 16:00 — бонус +20% к пополнению.',target:'topup',enabled:true},{id:'pr2',title:'Ночной пакет',text:'8 часов игры по специальной цене.',target:'tariffs',enabled:true}]})},60);}
 else if(m.command==='navigate')sendPage(m.page);
 else if(m.command==='favorite'){const g=games.find(g=>g.id===m.id);if(g){g.favorite=!g.favorite;post({type:'catalog',items:games})}}
 else if(m.command==='launch'){later(()=>{post({type:'commandResult',context:ctx,command:'launch',outcome:'accepted',message:'Команда запуска передана игре или лаунчеру.'});},700)}
 else if(m.command==='hardware'){later(()=>post({type:'hardware',data:{cpu:'Intel Core i5-13400F',gpu:'NVIDIA GeForce RTX 4060',ram:'16 ГБ DDR5',ramDetail:'5600 МГц',board:'MSI PRO B760M-P',monitor:'Alienware 25"',monitorDetail:'240 Гц'}}),500)}
 else if(m.command==='loyalty'){later(()=>post({type:'loyalty',data:{visible:true,levels:[{level:0,thresholdMinor:0},{level:1,thresholdMinor:1000000},{level:2,thresholdMinor:3000000}],loyalty:{level:1,levelName:'Серебро',percent:5,experienceMinor:1800000,nextThresholdMinor:3000000,nextLevel:2,nextLevelName:'Золото',remainingMinor:1200000}}}),400)}
 else if(m.command==='topup'){later(()=>{post({type:'commandResult',context:ctx,command:'topup',outcome:'accepted',message:'Заявка создана. Подойдите к кассе.'});later(()=>{S.cash+=300000;post({...S});post({type:'topupNotice',context:ctx,amount:300000,cash:S.cash,bonus:S.bonus})},2500)},600)}
 else if(['purchase','startPackage','metered','barAdd'].includes(m.command)){later(()=>post({type:'commandResult',context:ctx,command:m.command,id:m.id,outcome:'success',message:'Готово (демо).'}),600)}
 else if(m.command==='desktop'||m.command==='logout'){post({type:'notice',message:m.command==='desktop'?'Рабочий стол (в демо не переключается)':'Выход (в демо недоступен)'})}
 else if(['systemMouse','systemSound','barTools','help','recovery','reservations','transfer','extension','purchaseTime','checkPurchase'].includes(m.command)){post({type:'notice',message:'В боевом Shell откроется нативное окно.'})}
}
window.chrome={webview:{addEventListener:(t,f)=>{if(t==='message')listeners.push(f)},postMessage:m=>{if(m&&m.command==='ready')onMessage(m);else if(m&&m.nonce===nonce)onMessage(m)}}};
setInterval(()=>{secs=Math.max(0,secs-1);const h=String(secs/3600|0).padStart(2,'0'),mi=String((secs%3600)/60|0).padStart(2,'0'),s=String(secs%60).padStart(2,'0');S.timer=`${h}:${mi}:${s}`;post({...S})},1000);
later(()=>{sendPage('tariffs');sendPage('bar');sendPage('history')},900);
})();
