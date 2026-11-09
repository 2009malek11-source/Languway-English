/* LanguWay English: "Phrases & Idioms" section.
   Everyday expressions and idioms that cannot be translated word for word, phrasal verbs, and a quick "match the meaning" quiz.
   Data format: [English, Arabic (natural meaning, not literal), meaning in simple English, example].
   Works offline. Loaded after dict2.js (which defines IDIOMS and PHV) and before app.js. Each item has audio (the browser voice, see Settings). */

/* more idioms (only the ones not already in dict2.js are added) */
(function(){
 const more=[
  ['it is up to you','القرار لك','you decide','Pizza or rice? It is up to you.'],
  ['no worries','لا بأس','it is fine, do not worry','Sorry I am late. No worries!'],
  ['to be honest','بصراحة','to say the truth','To be honest, I did not like the film.'],
  ['by the way','بالمناسبة','to add something related','By the way, the shop opens at nine.'],
  ['how come?','كيف ذلك؟','why? (informal)','How come you are not at school?'],
  ['keep in touch','ابقَ على تواصل','stay in contact','Keep in touch when you move.'],
  ['take your time','خذ وقتك','do not hurry','Take your time with the form.'],
  ['make yourself at home','اعتبر نفسك في بيتك','feel comfortable in my house','Come in and make yourself at home.'],
  ['let me know','أخبرني','tell me (later)','Let me know when you arrive.'],
  ['I am all ears','أنا أصغي إليك تمامًا','I am listening carefully','Tell me the story. I am all ears.'],
  ['on the other hand','من ناحية أخرى','used to give a different point of view','It is cheap. On the other hand, it is slow.'],
  ['in a hurry','على عجل','needing to be quick','Sorry, I am in a hurry.'],
  ['out of order','معطّل','not working','The lift is out of order.'],
  ['a waste of time','مضيعة للوقت','not useful','That meeting was a waste of time.'],
  ['give me a hand','ساعدني','help me','Can you give me a hand with this bag?'],
  ['hang on','انتظر لحظة','wait a moment','Hang on, I will find my keys.'],
  ['call it a day','لنكتفِ بهذا اليوم','stop working for today','We are tired. Let us call it a day.'],
  ['get the hang of it','تعوّد عليه','learn how to do something','You will get the hang of it soon.'],
  ['the more, the merrier','كلما زاد العدد زادت المتعة','more people make it more fun','Come with us! The more, the merrier.'],
  ['sooner or later','عاجلًا أم آجلًا','at some time in the future','Sooner or later you will speak well.'],
  ['for the time being','في الوقت الحالي','for now, not forever','I am staying here for the time being.'],
  ['face to face','وجهًا لوجه','in person','I want to meet him face to face.'],
  ['over the moon','سعيد جدًا','very happy','She was over the moon about the news.'],
  ['a blessing in disguise','نعمة في ثوب نقمة','something good that seemed bad at first','Losing that job was a blessing in disguise.'],
  ['cost an arm and a leg','غالٍ جدًا','be very expensive','That phone cost an arm and a leg.'],
  ['hit the books','ذاكر بجد','study hard','I must hit the books tonight.'],
  ['bite off more than you can chew','تحمّل أكثر من طاقتك','try to do too much','Three jobs? You bit off more than you can chew.'],
  ['spill the beans','أفشى السر','tell a secret by mistake','Who spilled the beans about the party?'],
  ['the ball is in your court','الكرة في ملعبك','it is your turn to decide','I made my offer. The ball is in your court.'],
  ['actions speak louder than words','الأفعال أبلغ من الأقوال','what you do matters more than what you say','He helps every day. Actions speak louder than words.']
 ];
 const have=new Set((window.IDIOMS||[]).map(x=>x[0].toLowerCase()));
 window.IDIOMS=(window.IDIOMS||[]).concat(more.filter(x=>!have.has(x[0].toLowerCase())));
})();

/* everyday expressions: natural things people say (not word for word) */
window.EXPR=[
 ['What is up?','ما الأخبار؟ (عامية)','a friendly hello','Hi Sam! What is up?'],
 ['Long time no see.','مضى وقت طويل منذ آخر لقاء!','I have not seen you for a long time','Long time no see! How are you?'],
 ['I am sorry to hear that.','يؤسفني سماع ذلك','I feel sad about your bad news','I am sorry to hear that. Can I help?'],
 ['Good luck!','بالتوفيق!','I hope it goes well','Good luck with your test!'],
 ['Cheers!','بصحتك!','a toast, or thank you (British)','Cheers, mate! That was kind.'],
 ['Bless you!','يرحمك الله (عند العطاس)','what you say when someone sneezes','Achoo! — Bless you!'],
 ['Help yourself.','تفضّل، خذ ما تشاء','take what you want','There is cake. Help yourself.'],
 ['That makes sense.','هذا منطقي','I understand the reason','You were tired. That makes sense.'],
 ['I could not agree more.','أوافقك تمامًا','I fully agree','Learning daily is best. I could not agree more.'],
 ['I have no idea.','ليست لدي أدنى فكرة','I do not know','Where is the bank? I have no idea.'],
 ['It does not matter.','لا يهم','it is not important','Red or blue? It does not matter.'],
 ['Fingers crossed.','أتمنى لك الحظ','I hope for good luck','The result is tomorrow. Fingers crossed!'],
 ['You are kidding!','أنت تمزح!','I cannot believe it','You won? You are kidding!'],
 ['I am dying to know.','أتحرّق شوقًا لمعرفة ذلك','I want to know very much','Tell me the result! I am dying to know.'],
 ['That rings a bell.','هذا يذكّرني بشيء','I think I know it','Ahmed Ali? That rings a bell.'],
 ['I am on my way.','أنا في الطريق','I am coming now','Wait there, I am on my way.'],
 ['Could you do me a favour?','هل تسدي لي معروفًا؟','a polite way to ask for help','Could you do me a favour and open the door?'],
 ['Would you mind…?','هل تمانع…؟','a very polite request','Would you mind closing the window?'],
 ['Excuse me, where is…?','عذرًا، أين…؟','asking the way politely','Excuse me, where is the station?'],
 ['I beg your pardon?','عفوًا، ماذا قلت؟','polite way to ask someone to repeat','I beg your pardon? I did not hear you.'],
 ['Pardon me.','أستسمحك عذرًا','a polite way to say sorry','Pardon me, I did not see you.'],
 ['Make yourself understood.','اجعل نفسك مفهومًا','to explain so others understand you','I can make myself understood in English.'],
 ['I am afraid not.','للأسف لا','a soft, polite no','Is it free? I am afraid not.'],
 ['That is a good point.','هذه نقطة جيدة','I agree it is a useful idea','That is a good point. Let us try it.'],
 ['I will get back to you.','سأعاود الاتصال بك','I will answer you later','I will get back to you tomorrow.'],
 ['Can I take a message?','هل أترك رسالة؟','on the phone, offering to write a message','He is out. Can I take a message?'],
 ['Hold the line, please.','ابقَ على الخط من فضلك','wait on the phone','Hold the line, please. I will find him.'],
 ['Could I have the bill, please?','هل أستطيع الحصول على الفاتورة؟','asking for the bill in a restaurant','Could I have the bill, please?'],
 ['Keep the change.','احتفظ بالباقي','you can keep the extra money','That is ten. Keep the change.'],
 ['It is on me.','عليّ أنا (الحساب)','I will pay','Dinner is on me tonight.']
];

/* ---------- The view ---------- */
let PHS={p:'idioms',q:'',n:30,qz:null};
const PHT={idioms:['Idioms',()=>window.IDIOMS||[]],expr:['Everyday expressions',()=>window.EXPR||[]],phv:['Phrasal verbs',()=>window.PHV||[]]};
function phSet(k,v){PHS[k]=v;if(k=='p'||k=='q')PHS.n=30;if(k=='p'){PHS.qz=null}draw()}
function phCards(list){const q=PHS.q.trim().toLowerCase(),ar=/[؀-ۿ]/.test(q);
 const f=!q?list:list.filter(x=>ar?x[1].includes(q):(x[0].toLowerCase().includes(q)||x[2].toLowerCase().includes(q)));
 if(!f.length)return'<div class=card><p>No result. Try another word.</p></div>';
 return f.slice(0,PHS.n).map(x=>`<div class="card phc"><div class=phh><b class=phe>${esc(x[0])}</b>${tSay(x[0],'🔊')}</div><p class=mut style="margin:4px 0">${esc(x[2])}</p><p style="margin:4px 0"><i>${esc(x[3])}</i> ${tSay(x[3],'🔊')}</p></div>`).join('')+(f.length>PHS.n?`<button class=btn2 type=button onclick="phSet('n',PHS.n+30)">Show more (${f.length-PHS.n})</button>`:'')}
/* quiz: "What does it mean?" with 4 choices, 8 questions per round */
function phQuizStart(){const pool=((window.IDIOMS||[]).concat(window.EXPR||[],window.PHV||[])).filter(x=>x[2]);const pick=sh(pool.slice()).slice(0,8);
 PHS.qz={i:0,ok:0,qs:pick.map(x=>{const wrong=sh(pool.filter(y=>y[2]!=x[2])).slice(0,3).map(y=>y[2]);return{x,o:sh([x[2]].concat(wrong)),a:null}})};draw()}
function phAns(j){const z=PHS.qz;if(!z||z.qs[z.i].a!=null)return;const q=z.qs[z.i];q.a=j;if(q.o[j]==q.x[2])z.ok++;draw()}
function phNext(){const z=PHS.qz;z.i++;draw()}
function phQuiz(){const z=PHS.qz;if(!z)return`<div class=card><h3 style="margin-top:0">Quick quiz</h3><p>8 questions: choose the meaning of each phrase.</p><button class=btn type=button onclick="phQuizStart()">Start</button></div>`;
 if(z.i>=z.qs.length)return`<div class=card><h2>${z.ok} / ${z.qs.length}</h2><p>${z.ok>=7?'Excellent!':z.ok>=5?'Good job. Practise a little more.':'Keep practising: read the cards again.'}</p><button class=btn type=button onclick="phQuizStart()">Try again</button> <button class=btn2 type=button onclick="phSet('p','idioms')">Back to the cards</button></div>`;
 const q=z.qs[z.i],d=q.a!=null;
 return`<div class=card><p class=mut>Question ${z.i+1} of ${z.qs.length}</p><h2 style="margin:4px 0">${esc(q.x[0])} ${tSay(q.x[0],'🔊')}</h2><p class=mut>What does it mean?</p>${q.o.map((o,j)=>`<button type=button class="row phq ${d?(o==q.x[2]?'ok':j==q.a?'no':''):''}" ${d?'disabled':''} onclick="phAns(${j})">${esc(o)}</button>`).join('')}${d?`<div class=card style="margin-top:8px"><b>${q.o[q.a]==q.x[2]?'Correct! ✔':'Not quite.'}</b><i>${esc(q.x[3])}</i> ${tSay(q.x[3],'🔊')}</div><button class=btn type=button style="margin-top:8px" onclick="phNext()">${z.i+1>=z.qs.length?'See my score':'Next'}</button>`:''}</div>`}
function vPhrases(){const p=PHS.p,tabs=Object.keys(PHT).map(k=>`<button type=button class="chip ${p==k?'on':''}" onclick="phSet('p','${k}')">${PHT[k][0]} (${PHT[k][1]().length})</button>`).join('')+`<button type=button class="chip ${p=='quiz'?'on':''}" onclick="PHS.p='quiz';PHS.qz=null;draw()">🎯 Quiz</button>`;
 return`<h1>PHRASES AND IDIOMS</h1><p class=mut>Things people really say. Many cannot be translated word for word.</p>
 <div class=card>${tabs}${p!='quiz'?`<form class=srch onsubmit="return false"><input id=phq type=search value="${esc(PHS.q)}" placeholder="Search" aria-label="Search phrases" autocomplete=off oninput="PHS.q=this.value;phRefresh()"></form>`:''}</div>
 <div id=phl>${p=='quiz'?phQuiz():phCards(PHT[p][1]())}</div>`}
/* typing in the search box refreshes only the list (the box keeps focus) */
function phRefresh(){const l=document.getElementById('phl');if(l&&PHS.p!='quiz')l.innerHTML=phCards(PHT[PHS.p][1]())}
