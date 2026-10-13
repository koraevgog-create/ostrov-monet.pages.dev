/* Level 10: residents and meaningful achievements. Uses existing localStorage state. */
const RESIDENTS=[
 {emoji:'🐰',name:'Зайка Лапа',title:'Открытка другу',story:'Зайка хочет подарить открытку. Попробуй профессию художника.',target:'Художник',need:1,reward:3},
 {emoji:'🐻',name:'Медвежонок Тима',title:'Фрукты для пикника',story:'Тима готовит пикник. Помоги покупателю в магазине!',target:'Помощник магазина',need:1,reward:3},
 {emoji:'🦔',name:'Ёжик Шуршик',title:'Наш цветочный сад',story:'Выращенный цветок украсит наш общий сад.',target:'Садовник',need:1,reward:3},
 {emoji:'🦉',name:'Сова Соня',title:'Мастер на все руки',story:'Попробуй все три профессии и узнай, чем они отличаются.',target:'Все профессии',need:3,reward:5}
];
function jobsOf(name){const log=Array.isArray(state.jobHistory)?state.jobHistory:[];return log.filter(x=>x&&x.job===name).length}
function residentProgress(i){const r=RESIDENTS[i];if(!r)return 0;if(i===3)return ['Художник','Помощник магазина','Садовник'].filter(n=>jobsOf(n)>0).length;return Math.min(r.need,jobsOf(r.target))}
function residentDone(i){return Array.isArray(state.residentRewards)&&state.residentRewards.includes(i)}
function renderResidents(v){
 const back='<div class="center"><button class="secondary" onclick="cityPlace=null;render()">← К городу</button></div>';
 v.innerHTML='<div class="resident-hero">🦊 <strong>Друзья нашего города</strong></div><h2>Кому помочь сегодня?</h2><p>Выполняй полезные дела в профессиях. Жители заметят твои старания!</p><div class="resident-grid">'+RESIDENTS.map((r,i)=>{const count=residentProgress(i),ready=count>=r.need,done=residentDone(i);return '<div class="resident-card"><div class="resident-face">'+r.emoji+'</div><h3>'+r.name+'</h3><strong>'+r.title+'</strong><p>'+r.story+'</p><div class="mini-count">'+count+' / '+r.need+' ⭐</div><button class="primary" '+(!ready||done?'disabled':'')+' onclick="claimResident('+i+')">'+(done?'✅ Спасибо за помощь':ready?'🎁 Получить '+r.reward+' монеты':'⏳ Нужно выполнить дело')+'</button></div>'}).join('')+'</div><p class="notice">Каждый житель благодарит наградой только один раз. Добрые дела ценны и без монет.</p>'+back;
}
function claimResident(i){const r=RESIDENTS[i];if(!r||residentDone(i)||residentProgress(i)<r.need)return;state.residentRewards=Array.isArray(state.residentRewards)?state.residentRewards:[];state.residentRewards.push(i);state.coins+=r.reward;save();tone();speak(r.name+' благодарит тебя!');render()}
function renderCollection(v){
 const logs=Array.isArray(state.jobHistory)?state.jobHistory:[],done=Array.isArray(state.residentRewards)?state.residentRewards.length:0;
 const stats=[['🎨','Открытки',jobsOf('Художник')],['🌻','Выращенные цветы',jobsOf('Садовник')],['🛒','Заказы',jobsOf('Помощник магазина')],['🤝','Благодарности жителей',done],['⭐','Звёзды',state.stars||0],['🐷','Накоплено',state.savings||0]];
 v.innerHTML='<div class="big">🏆✨</div><h2>Моя коллекция достижений</h2><p>Здесь видно, скольким людям ты помог и что научился делать.</p><div class="resident-grid">'+stats.map(a=>'<div class="achievement"><span>'+a[0]+'</span><strong>'+a[2]+'</strong><small>'+a[1]+'</small></div>').join('')+'</div><p class="notice">Твои достижения сохраняются на этом устройстве. Главное — не количество монет, а знания, забота и умение выбирать.</p><div class="center"><button class="secondary" onclick="cityPlace=null;render()">← К городу</button></div>';
}
