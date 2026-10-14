/* Story adventures: connected quests, no repeat rewards. */
const STORIES=[
 {emoji:'🐰',title:'Праздник Зайки',character:'Зайка Лапа',text:'Зайка хочет порадовать друзей открытками. Что сделаем сначала?',choices:['🎨 Нарисуем открытку сами','🛍️ Купим много ненужных игрушек'],correct:0,lesson:'Подарок, созданный с заботой, особенно приятен.',next:'Художник'},
 {emoji:'🐻',title:'Пикник Медвежонка',character:'Тима',text:'На пикник нужны фрукты. Как поступить?',choices:['🛒 Соберём заказ по списку','🎈 Потратим все монеты на шарики'],correct:0,lesson:'Полезно заранее решить, что действительно понадобится.',next:'Помощник магазина'},
 {emoji:'🦔',title:'Цветущий двор',character:'Ёжик Шуршик',text:'Ёжик мечтает о цветах у дома. Что поможет?',choices:['🌱 Посадим семечко и будем заботиться','⏩ Будем ждать, ничего не делая'],correct:0,lesson:'Хорошие результаты требуют заботы и терпения.',next:'Садовник'}
];
let storyFeedback='';
function storyReady(i){const key=STORIES[i].next;return Array.isArray(state.jobHistory)&&state.jobHistory.some(x=>x.job===key)}
function storyCompleted(i){return Array.isArray(state.storyDone)&&state.storyDone.includes(i)}
function renderStory(v){
 const completed=STORIES.filter((s,i)=>storyCompleted(i)).length;
 v.innerHTML='<div class="big">📖🦊</div><h2>Истории нашего города</h2><p>Помоги трём друзьям — у каждой истории есть начало, полезное дело и счастливый финал.</p><div class="story-rail">'+STORIES.map((s,i)=>'<button class="story-chapter" onclick="openStory('+i+')"><span>'+s.emoji+'</span><strong>'+s.title+'</strong><small>'+(storyCompleted(i)?'✅ Пройдена':storyReady(i)?'🌟 Можно завершить':'📖 Новая история')+'</small></button>').join('')+'</div><p class="notice">Историй завершено: '+completed+' / '+STORIES.length+'</p>'+(storyFeedback?'<div class="feedback">'+storyFeedback+'</div>':'')+'<div class="center"><button class="secondary" onclick="cityPlace=null;render()">← К городу</button></div>';
}
let storyIndex=null,storyChoice=null;
function openStory(i){if(!STORIES[i])return;storyIndex=i;storyChoice=null;renderStoryChapter();speak(STORIES[i].text)}
function renderStoryChapter(){
 const s=STORIES[storyIndex],v=document.getElementById('view');
 if(!s)return;
 const completed=storyCompleted(storyIndex),worked=storyReady(storyIndex),correct=storyChoice===s.correct;
 v.innerHTML='<div class="big">'+s.emoji+'</div><h2>'+s.title+'</h2><p><strong>'+s.character+':</strong> '+s.text+'</p>'+
 (storyChoice===null?'<div class="answers">'+s.choices.map((c,i)=>'<button class="choice" onclick="chooseStory('+i+')">'+c+'</button>').join('')+'</div>':
 '<div class="feedback '+(!correct?'try':'')+'">'+(correct?s.lesson:'Подумай, что поможет друзьям больше. Можно попробовать снова!')+'</div>'+
 '<div class="center">'+(!correct?'<button class="primary" onclick="storyChoice=null;renderStoryChapter()">↻ Попробовать снова</button>':
 completed?'<button class="secondary" onclick="cityPlace=8;render()">✅ История уже пройдена</button>':
 !worked?'<button class="primary" onclick="goStoryWork()">🛠️ Помочь делом: '+s.next+'</button>':
 '<button class="primary" onclick="finishStory()">🎉 Завершить историю</button>')+'</div>')+
 '<div class="center"><button class="secondary" onclick="cityPlace=8;storyIndex=null;storyFeedback=\'\';render()">← Все истории</button></div>';
}
function chooseStory(i){if(storyChoice!==null||!STORIES[storyIndex]||![0,1].includes(i))return;storyChoice=i;renderStoryChapter();tone(i===STORIES[storyIndex].correct)}
function goStoryWork(){const s=STORIES[storyIndex];if(!s)return;cityPlace=1;storyFeedback='Вернись к истории после выполнения работы.';selectedJob=['Художник','Садовник','Помощник магазина'].indexOf(s.next);if(selectedJob<0)selectedJob=-1;jobAttempt=false;render()}
function finishStory(){const i=storyIndex,s=STORIES[i];if(!s||storyChoice!==s.correct||!storyReady(i)||storyCompleted(i))return;state.storyDone=Array.isArray(state.storyDone)?state.storyDone:[];state.storyDone.push(i);state.stars=(state.stars||0)+1;save();tone();speak('Спасибо за помощь! Ты настоящий друг!');storyFeedback='🎉 '+s.character+' благодарит тебя! Ты получил звезду за помощь.';cityPlace=8;storyIndex=null;render()}
