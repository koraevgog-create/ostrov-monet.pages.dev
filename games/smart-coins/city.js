const CITY_ART=[
'<svg viewBox="0 0 150 120" aria-hidden="true"><path d="M12 53 75 9l63 44" fill="#e89978" stroke="#925f55" stroke-width="6" stroke-linejoin="round"/><rect x="27" y="49" width="96" height="61" rx="8" fill="#ffe4ad" stroke="#986c59" stroke-width="4"/><rect x="63" y="72" width="28" height="38" rx="5" fill="#9c7dd1"/><rect x="39" y="65" width="18" height="20" rx="4" fill="#85d4f5"/></svg>',
'<svg viewBox="0 0 150 120" aria-hidden="true"><path d="M12 42 75 10l63 32" fill="#ad8adf" stroke="#7562a3" stroke-width="5"/><rect x="25" y="41" width="100" height="69" rx="7" fill="#fad5a1" stroke="#ac795b" stroke-width="4"/><rect x="49" y="61" width="54" height="49" fill="#81b8c8"/><path d="M56 86h40M76 65v40" stroke="white" stroke-width="6"/></svg>',
'<svg viewBox="0 0 150 120" aria-hidden="true"><rect x="23" y="42" width="105" height="67" rx="8" fill="#ffdea4" stroke="#bc8c62" stroke-width="4"/><path d="M14 43 32 17h89l16 26" fill="#81c9a3" stroke="#4f9a78" stroke-width="5"/><circle cx="74" cy="77" r="23" fill="#fff3c8" stroke="#ddb56c" stroke-width="4"/><text x="74" y="87" font-size="30" text-anchor="middle">★</text></svg>',
'<svg viewBox="0 0 150 120" aria-hidden="true"><rect x="25" y="45" width="100" height="66" rx="7" fill="#f7c6b9" stroke="#ba877f" stroke-width="4"/><path d="M19 46 31 20h88l12 26" fill="#ffc77a" stroke="#c98867" stroke-width="5"/><path d="M35 45h80" stroke="white" stroke-width="9" stroke-dasharray="14 12"/><rect x="59" y="65" width="33" height="46" fill="#89b9ef"/></svg>',
'<svg viewBox="0 0 150 120" aria-hidden="true"><ellipse cx="75" cy="106" rx="52" ry="9" fill="#bde3a2"/><path d="M42 46Q31 16 57 18Q72 20 76 48Q88 18 109 25Q128 36 110 54L111 88Q110 106 75 107Q38 106 38 88Z" fill="#ffd5d9" stroke="#d48b97" stroke-width="5"/><circle cx="75" cy="68" r="20" fill="#fff5b6"/><text x="75" y="77" text-anchor="middle" font-size="26">★</text></svg>',
'<svg viewBox="0 0 150 120" aria-hidden="true"><path d="M27 100V42L76 13l48 29v58" fill="#d4c1ff" stroke="#9181bc" stroke-width="5"/><circle cx="75" cy="67" r="27" fill="#ffebae"/><path d="M63 67h24M75 55v24" stroke="#c18a75" stroke-width="7" stroke-linecap="round"/></svg>'
];
const CITY_PLACES=[['🏠','Дом','Отдых и забота'],['🛠️','Профессии','Полезный труд'],['💰','Бюджет','Распределяем монеты'],['🏪','Магазин','Разумные покупки'],['🐷','Копилка','Большая мечта'],['🎲','Событие дня','Выбирай с умом']];
let cityPlace=null,jobStage=0,selectedJob=-1,jobAttempt=false,cityMessage='',miniStep=0;
const WORK=[
{emoji:'🎨',name:'Художник',intro:'Нарисуем открытку для ярмарки. Что понадобится?',choices:['📄 Бумага и карандаши','🎈 Только шарики'],correct:0,explain:'Отлично! Открытка готова и приносит радость покупателю.'},
{emoji:'🌱',name:'Садовник',intro:'Растению нужно помочь вырасти. Что сделаем?',choices:['💧 Польём росток','🧸 Подарим ростку игрушку'],correct:0,explain:'Ты позаботился о ростке. Терпение и труд помогают ему расти.'},
{emoji:'📦',name:'Помощник магазина',intro:'Покупатель просит два яблока. Что положим в корзинку?',choices:['🍎 Одно яблоко','🍎🍎 Два яблока'],correct:1,explain:'Ты правильно собрал заказ и помог покупателю!'}
];
function workReady(){return state.energy>0}
function renderCity(v){
const d=state.day||1,e=state.energy??3;
const back='<div class="center"><button class="secondary" onclick="cityPlace=null;cityMessage=\'\';render()">← К городу</button></div>';
const top='<div class="daybar">📅 День '+d+' · '+(e===3?'☀️ Утро':e===2?'🌤️ День':e===1?'🌇 Вечер':'🌙 Время отдыхать')+' · ⚡ Дела: '+e+'/3</div>';
if(cityPlace===null){
v.innerHTML=top+'<div class="village"><div class="village-sun"></div><div class="village-cloud"></div><div class="village-title">🏘️ Добро пожаловать в город!</div><div class="village-path"></div><div class="village-buildings">'+CITY_PLACES.map((p,i)=>'<button class="village-building" onclick="enterCity('+i+')" aria-label="'+p[1]+'"><span class="building-picture">'+CITY_ART[i]+'</span><strong>'+p[1]+'</strong><small>'+p[2]+'</small></button>').join('')+'</div><div class="village-fox" aria-hidden="true">🦊</div></div><p>Выбери домик и отправляйся навстречу приключениям!</p><div class="center"><button class="primary" onclick="newDay()">🌙 Закончить день и отдохнуть</button></div><p class="notice">'+cityMessage+'</p>';return}
if(cityPlace===5){renderDailyEvent(v);return}
if(cityPlace===0){v.innerHTML=top+'<div class="big">🏠</div><h2>Уютный дом</h2><p>Помогать дома и отдыхать полезно. За заботу о близких не обязательно получать деньги.</p><div class="center"><button class="primary" onclick="homeKind()">💚 Помочь убрать игрушки</button></div><p id="homeMessage" class="notice">'+cityMessage+'</p>'+back;return}
if(cityPlace===1){if(selectedJob<0){v.innerHTML=top+'<h2>🛠️ Выбери профессию</h2><p>Сначала сделаем что-то полезное, а затем получим 5 монет.</p><div class="city-grid">'+WORK.map((w,i)=>'<button class="city-card" onclick="selectWork('+i+')" '+(!workReady()?'disabled':'')+'><span>'+w.emoji+'</span><strong>'+w.name+'</strong><small>5 🪙 · 1 дело</small></button>').join('')+'</div><p class="notice">'+(workReady()?'Выбирай дело, которое интересно.':'Сегодня дела закончились. Пора отдыхать!')+'</p>'+back;return}
const w=WORK[selectedJob];let stage=jobAttempt?'<div class="feedback">🎉 '+w.explain+' Ты заработал 5 монет!</div>':renderMiniTask(selectedJob);
v.innerHTML=top+'<div class="big">'+w.emoji+'</div><h2>'+w.name+'</h2><p>'+w.intro+'</p>'+stage+'<div class="center"><button class="secondary" onclick="selectedJob=-1;cityMessage=\'\';miniStep=0;render()">← Все профессии</button></div>';return}
if(cityPlace===2){
const b=state.budget||{saved:0,joy:0,giving:0,learning:0};
v.innerHTML=top+'<div class="big">💰</div><h2>Мой первый бюджет</h2><p>Сейчас свободно: '+state.coins+' 🪙. Выбери, куда положить 5 монет.</p><div class="city-grid">'+[['🐷','На мечту','saved'],['🎈','На радость','joy'],['💚','На добрые дела','giving'],['📚','На развитие','learning']].map(p=>'<button class="city-card" '+(state.coins<5?'disabled':'')+' onclick="budgetFive(\''+p[2]+'\')"><span>'+p[0]+'</span><strong>'+p[1]+'</strong><small>Отложить 5 🪙</small></button>').join('')+'</div><p class="budget-line">🐷 '+b.saved+' · 🎈 '+b.joy+' · 💚 '+b.giving+' · 📚 '+b.learning+'</p><p class="notice">'+(cityMessage||'Эти монеты теперь распределены по разным целям.')+'</p>'+back;return}
if(cityPlace===3){v.innerHTML=top+'<div class="big">🏪</div><h2>Магазин</h2><p>Перед покупкой проверь, хватит ли монет и останется ли что-нибудь на мечту.</p><div class="center"><button class="primary" onclick="show(\'shop\')">🛍️ Открыть магазин</button></div>'+back;return}
v.innerHTML=top+'<div class="big">🐷</div><h2>Копилка мечты</h2><p>В копилке уже '+state.savings+' монет!</p><div class="center"><button class="primary" onclick="show(\'dream\')">🐷 Открыть копилку</button></div>'+back;
}
function enterCity(i){if(!CITY_PLACES[i])return;cityPlace=i;selectedJob=-1;jobAttempt=false;cityMessage='';render();if(soundEnabled)speak(CITY_PLACES[i][1])}
function selectWork(i){if(!workReady())return;selectedJob=i;jobAttempt=false;miniStep=0;paintMarks=0;paintHistory=[];appleCount=0;cityMessage='';render();if(soundEnabled)speak(WORK[i].intro)}



let paintMarks=0,painting=false,appleCount=0,paintHistory=[],brushSize=9,paintEraser=false;
function renderMiniTask(i){
if(i===0)return '<div class="mini-board"><div class="mini-count">🎨 Нарисуй открытку</div><p>Води пальцем или мышкой по листу и нарисуй цветок, солнце или подарок.</p><canvas id="paintCanvas" class="paint-canvas" width="600" height="330" aria-label="Поле для рисования" onpointerdown="startPaint(event)" onpointermove="movePaint(event)" onpointerup="endPaint()" onpointercancel="endPaint()"></canvas><div class="paint-controls"><button class="secondary" onclick="setPaintColor(0)">🩷</button><button class="secondary" onclick="setPaintColor(1)">💙</button><button class="secondary" onclick="setPaintColor(2)">💚</button><button class="secondary" onclick="setPaintColor(3)">💛</button><button class="secondary" onclick="setPaintSize(4)">Тонко</button><button class="secondary" onclick="setPaintSize(18)">Толсто</button><button class="secondary" onclick="toggleEraser()">🧽 Ластик</button><button class="secondary" onclick="undoPaint()">↶ Назад</button><button class="secondary" onclick="clearPaint()">🗑️ Очистить</button><button class="secondary" onclick="stampPaint(0)">🌸</button><button class="secondary" onclick="stampPaint(1)">⭐</button><button class="secondary" onclick="stampPaint(2)">❤️</button></div><p class="notice">Нарисуй несколько линий, затем нажми «Готово».</p><button class="primary" onclick="finishPainting()">✉️ Открытка готова!</button></div>';
if(i===1){
 const garden=state.garden||{stage:0,plantedDay:0};
 const labels=['🌰 Посади семечко в землю','💧 Полей посаженное семечко','🌻 Собери цветок'];
 const images=['🪴','🌱','🌿','🌻'];
 const stage=garden.stage||0,waiting=stage===2&&(state.day||1)<(garden.plantedDay||1)+1;
 return '<div class="mini-board"><div class="mini-count">🌱 Садовник</div><div class="mini-scene">'+images[stage]+'</div><p>'+ (waiting?'Растению нужно время! Отдохни и возвращайся в следующий игровой день.':labels[Math.min(stage,2)])+'</p><button class="primary" '+(waiting?'disabled':'')+' onclick="gardenAction()">'+(stage===0?'🌰 Посадить':stage===1?'💧 Полить':'🌻 Собрать урожай')+'</button><p class="notice">Росток растёт постепенно. За цветок получишь 5 монет только после полного цикла.</p></div>';
}
return '<div class="mini-board"><div class="mini-count">🍎 Помощник магазина</div><p>Покупатель заказал ровно два яблока. Нажимай на яблоки, чтобы положить их в корзину.</p><div class="mini-scene basket-scene">🧺 '+('🍎'.repeat(appleCount))+'</div><div class="apple-actions"><button class="secondary" onclick="addApple()">🍎 Добавить яблоко</button><button class="secondary" onclick="removeApple()" '+(appleCount===0?'disabled':'')+'>↩️ Убрать яблоко</button></div><p>В корзинке: '+appleCount+' из 2 яблок.</p><button class="primary" onclick="finishBasket()">📦 Передать заказ</button></div>';
}
let paintColor='#e55f82',paintLast=null;
function startPaint(e){if(selectedJob!==0||jobAttempt)return;painting=true;paintLast=null;savePaintSnapshot();e.currentTarget.setPointerCapture(e.pointerId);movePaint(e)}
function movePaint(e){if(!painting||selectedJob!==0)return;const canvas=e.currentTarget,rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;const c=canvas.getContext('2d');c.strokeStyle=paintEraser?'#fffdf6':paintColor;c.lineWidth=brushSize;c.lineJoin='round';c.lineCap='round';if(paintLast){c.beginPath();c.moveTo(paintLast.x,paintLast.y);c.lineTo(x,y);c.stroke();paintMarks++}else{c.beginPath();c.arc(x,y,brushSize/2,0,2*Math.PI);c.fillStyle=paintEraser?'#fffdf6':paintColor;c.fill();paintMarks++}paintLast={x,y}}
function endPaint(){painting=false;paintLast=null}
const PAINT_COLORS=['#e55f82','#4d9cdb','#63ac73','#f7bc4b'];
function setPaintColor(i){paintColor=PAINT_COLORS[i]||PAINT_COLORS[0];paintEraser=false}
function setPaintSize(n){brushSize=n}
function toggleEraser(){paintEraser=!paintEraser}
function savePaintSnapshot(){const c=document.getElementById('paintCanvas');if(c){paintHistory.push({image:c.getContext('2d').getImageData(0,0,c.width,c.height),marks:paintMarks});if(paintHistory.length>12)paintHistory.shift()}}
function undoPaint(){const c=document.getElementById('paintCanvas'),snap=paintHistory.pop();if(c&&snap){c.getContext('2d').putImageData(snap.image,0,0);paintMarks=snap.marks}}
function clearPaint(){const c=document.getElementById('paintCanvas');if(c){savePaintSnapshot();c.getContext('2d').clearRect(0,0,c.width,c.height);paintMarks=0}}
function stampPaint(i){const c=document.getElementById('paintCanvas');if(!c)return;savePaintSnapshot();const ctx=c.getContext('2d');ctx.font='74px sans-serif';ctx.textAlign='center';ctx.fillText(['🌸','⭐','❤️'][i]||'⭐',100+Math.random()*400,70+Math.random()*170);paintMarks+=8}
function finishPainting(){if(paintMarks<7){cityMessage='Нарисуй хотя бы несколько линий на открытке.';const p=document.querySelector('.mini-board .notice');if(p)p.textContent=cityMessage;return}completeMiniWork(0)}
function addApple(){if(selectedJob!==2||jobAttempt)return;appleCount=Math.min(4,appleCount+1);render()}
function removeApple(){if(selectedJob!==2||jobAttempt)return;appleCount=Math.max(0,appleCount-1);render()}
function finishBasket(){if(appleCount!==2){cityMessage='Нужно ровно два яблока. Поправь заказ!';const p=document.querySelector('.mini-board p:last-of-type');if(p)p.textContent=cityMessage;return}completeMiniWork(2)}
function gardenAction(){if(selectedJob!==1||jobAttempt||!workReady())return;let garden=state.garden||{stage:0,plantedDay:0};if(garden.stage===0){garden={stage:1,plantedDay:state.day||1}}else if(garden.stage===1){garden.stage=2}else if(garden.stage===2){if((state.day||1)<garden.plantedDay+1)return;state.garden={stage:0,plantedDay:0};completeMiniWork(1);return}state.garden=garden;save();render();tone()}
function completeMiniWork(i){if(selectedJob!==i||jobAttempt||!workReady())return;jobAttempt=true;state.energy=Math.max(0,state.energy-1);state.coins+=5;state.jobsDone=(state.jobsDone||0)+1;state.jobHistory=(state.jobHistory||[]).concat([{day:state.day,job:WORK[i].name}]).slice(-20);cityMessage='🎉 '+WORK[i].explain;save();tone();speak('Молодец! Ты закончил дело и заработал пять монет.');render()}
function newDay(){state.day=(state.day||1)+1;state.energy=3;selectedJob=-1;cityPlace=null;cityMessage='☀️ Новый день! Ты отдохнул и снова можешь помогать жителям.';save();tone();render();speak('Доброе утро! Новый день начинается!')}
function budgetFive(type){if(state.coins<5)return;const valid=['saved','joy','giving','learning'];if(!valid.includes(type))return;state.budget=state.budget||{saved:0,joy:0,giving:0,learning:0};state.coins-=5;state.budget[type]=(state.budget[type]||0)+5;if(type==='saved')state.savings+=5;cityMessage='Ты распределил 5 монет. Подумай, зачем нужен каждый конверт.';save();tone();render()}
function spendEnvelope(type){if(!['joy','giving','learning'].includes(type))return;const b=state.budget||{};if((b[type]||0)<5)return;b[type]-=5;if(type==='giving')state.kind++;cityMessage=type==='joy'?'🎈 Приятные впечатления тоже важны!':type==='learning'?'📚 Ты вложил время и монеты в новые знания!':'💚 Ты помог другим. Спасибо!';save();tone();render();speak(cityMessage)}
function homeKind(){cityMessage='💚 Спасибо! Забота о доме важна и без денежной награды.';render();speak('Помогать дома — доброе дело.')}

const DAILY_EVENTS=[
{emoji:'🍎',title:'Яблоки на ярмарке',story:'У тебя есть монеты, а яблоко стоит 5. Можно купить его или сохранить деньги на мечту.',options:[['🍎 Купить яблоко',-5,'Ты выбрал небольшой перекус. Иногда тратить на приятное — нормально.'],['🐷 Сохранить монеты',0,'Ты сохранил монеты и можешь отложить их в копилку.']]},
{emoji:'🎁',title:'Подарок для друга',story:'Друг празднует день рождения. Ты можешь купить открытку за 5 монет или подарить рисунок, сделанный своими руками.',options:[['💌 Купить открытку',-5,'Ты решил купить открытку для друга.'],['🎨 Нарисовать подарок',0,'Друг обрадовался твоему рисунку! Внимание важнее цены.']]},
{emoji:'🎠',title:'Весёлая карусель',story:'Один билет на карусель стоит 5 монет. Ты можешь прокатиться или отложить эти деньги на свою мечту.',options:[['🎠 Прокатиться',-5,'Отличная прогулка! Ты выбрал радость сегодня.'],['⭐ Пока накопить',0,'Терпение помогает достигать больших целей.']]}
];
function renderDailyEvent(v){
 const event=DAILY_EVENTS[((state.day||1)-1)%DAILY_EVENTS.length],used=state.eventDay===state.day;
 v.innerHTML='<div class="big">'+event.emoji+'</div><h2>'+event.title+'</h2><p>'+event.story+'</p>'+(used?'<div class="feedback">Событие этого дня уже пройдено. Завтра будет новое приключение!</div>':'<div class="answers">'+event.options.map((o,i)=>'<button class="choice" '+(state.coins<5&&o[1]<0?'disabled':'')+' onclick="resolveDailyEvent('+i+')">'+o[0]+'</button>').join('')+'</div>')+'<p class="notice">'+(cityMessage||'Любое решение может быть разумным — важно понимать, почему ты его принял.')+'</p><div class="center"><button class="secondary" onclick="cityPlace=null;cityMessage=\'\';render()">← К городу</button></div>';
}
function resolveDailyEvent(i){if(state.eventDay===state.day)return;const e=DAILY_EVENTS[((state.day||1)-1)%DAILY_EVENTS.length],option=e.options[i];if(!option||state.coins+option[1]<0)return;state.coins+=option[1];state.eventDay=state.day;cityMessage=option[2];save();tone();speak(option[2]);render()}
