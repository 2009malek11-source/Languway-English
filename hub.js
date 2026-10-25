/* LanguWay hub: easier navigation and skill practice.
   Adds: Practice page, Listening lab, Grammar library, Wordbook, quick access, bottom tab bar, learning plan, placement can-do text.
   It adds NO new saved data: every progress key (S.*, localStorage, cloud) stays exactly as before, so updates never touch learner data.
   Loaded before app.js; everything here runs later, when the app calls it. */

/* ---------- Skills and where to practise each one ---------- */
const PSK={
 Listening:{ic:'🎧',t:'Listening lab',en:'Hear it, pick it, copy the sound',ar:'استماع ونطق',js:"go('listen')"},
 Speaking:{ic:'🗣️',t:'Speaking',en:'Talk with a partner',ar:'محادثة بالصوت',js:"goX('rp')"},
 Reading:{ic:'📖',t:'Reading and stories',en:'Cedar City episodes',ar:'قراءة وقصص',js:"go('stories')"},
 Writing:{ic:'✍️',t:'Writing studio',en:'Write and get corrections',ar:'كتابة وتصحيح',js:"goX('write')"},
 Grammar:{ic:'📘',t:'Grammar library',en:'All 80 rules in one place',ar:'مكتبة القواعد',js:"go('grammar')"},
 Vocabulary:{ic:'🧠',t:'Wordbook',en:'Words with sound and examples',ar:'كتاب المفردات',js:"go('review')"}};

/* Open an Explore page from anywhere (Explore keeps its own state in X). */
function goX(p,o){if(V=='explore'){xGo(p,o);return}go('explore');X=Object.assign({p:p},o||{});XR=null;draw()}
/* Run a quiz with the Explore quiz runner from anywhere. */
function pRun(items,title,back,done){if(V!='explore')go('explore');xRun(items,title,back,done)}

const pAr=t=>`<span class=ara lang=ar dir=rtl>${t}</span>`;
function pTile(js,ic,t,en,ar,bd){return`<button type=button class=xt onclick="${js}"><span class=xi aria-hidden=true>${ic}</span><b>${t}</b><small>${en}</small><small class=ara lang=ar dir=rtl>${ar}</small>${bd?`<i class=xb>${bd}</i>`:''}</button>`}

/* The skill that needs the most work: a skill with fewer than 5 answers counts as "not practised yet". */
function pWeak(){let best=null;Object.keys(PSK).forEach(k=>{const t=S.sk[k]||[0,0],n=t[1],acc=n?t[0]/n:0,sc=n<5?-1+n/100:acc;if(!best||sc<best.sc)best={k,sc,n,acc:Math.round(acc*100)}});return best}
function pRec(){const w=pWeak(),p=PSK[w.k];
 const why=w.n<5?`You have not practised <b>${w.k}</b> much yet. A few minutes will help.`:`<b>${w.k}</b> is your lowest skill right now (${w.acc}% correct). Extra practice here will lift your level fastest.`;
 const ar=w.n<5?`لم تتدرّب كثيرًا على مهارة ${({Listening:'الاستماع',Speaking:'المحادثة',Reading:'القراءة',Writing:'الكتابة',Grammar:'القواعد',Vocabulary:'المفردات'})[w.k]} بعد.`:`أضعف مهارة عندك الآن: ${({Listening:'الاستماع',Speaking:'المحادثة',Reading:'القراءة',Writing:'الكتابة',Grammar:'القواعد',Vocabulary:'المفردات'})[w.k]} (${w.acc}%).`;
 return`<div class="card note"><b>Your plan for today</b><p class=mut style="margin:6px 0">${why}</p><p class=ara lang=ar dir=rtl style="margin:0 0 10px">${ar}</p><button class=btn type=button onclick="${p.js}">${p.ic} Open ${p.t}</button></div>`}

/* ---------- Practice page ---------- */
function vPractice(){const d=dueN(),e=XS();
 return`<h1>PRACTICE</h1><p class=mut>Train one skill at a time. Everything here is open and does not change your level.</p>${pAr('تدرّب على مهارة واحدة في كل مرة. كل شيء هنا مفتوح ولا يغيّر مستواك.')}
 ${pRec()}
 <h2>Skills</h2><div class=xg>${Object.keys(PSK).map(k=>{const p=PSK[k];return pTile(p.js,p.ic,p.t,p.en,p.ar,k=='Vocabulary'&&d?d+' due':'')}).join('')}</div>
 <h2>Daily habits</h2><div class=xg>
 ${pTile("goX('wod')",'🌅','Word of the day','One new word','كلمة اليوم',e.wd&&e.wd[today()]?'✔':'New')}
 ${pTile("goX('week')",'📅','Rule of the week','One rule, six short steps','قاعدة الأسبوع')}
 ${pTile("goX('xl')",'🧩','Extra lessons','5 short lessons per level','دروس إضافية')}
 ${pTile("goX('fast')",'⚡','Fast speech','How people really talk','الكلام السريع')}
 ${pTile("goX('pic')",'🖼️','Picture questions','Look and answer','أسئلة بالصور')}
 ${pTile('pract()','🔁','My mistakes','Practise what went wrong','راجع أخطاءك',S.mist.length?String(S.mist.length):'')}</div>
 <div class=card><b>More</b><p class=mut style="margin:6px 0 10px">Career English, US or UK English, and the Translator.</p><button class=btn2 type=button onclick="go('explore')">Explore</button> <button class=btn2 type=button onclick="go('translate')">Translator</button></div>`}

/* ---------- Listening lab ---------- */
const PMP=[['ship','sheep'],['bit','beat'],['full','fool'],['live','leave'],['sit','seat'],['pull','pool'],['bed','bad'],['cut','cat'],['pen','pan'],['light','right'],['very','berry'],['think','sink'],['three','free'],['west','vest'],['chair','share'],['bat','pat']];
function pSents(){const cl=curLevel();let a=LS.filter(l=>l.lv<=cl).flatMap(l=>l.ds.length?l.ds:l.ss);if(a.length<12)a=LS.flatMap(l=>l.ds.length?l.ds:l.ss);return a.filter(s=>s&&s.length>=12&&s.length<=70)}
function pListenGo(n){const pool=pSents(),pick=sh(pool).slice(0,n||8);
 if(pick.length<4){alert('Not enough sentences yet.');return}
 pRun(pick.map(s=>({t:'lis',s,o:xDistract(s,sh(pool).filter(x=>Math.abs(x.length-s.length)<28),4),a:s,sk:'Listening',why:''})),'Hear it, pick it','@listen')}
function pPairQuiz(){const it=sh(PMP).slice(0,8).map(p=>{const w=p[Math.random()<.5?0:1];return{t:'mc',q:'Which word did you hear?',say:w,o:sh(p.slice()),a:w,sk:'Listening',why:p[0]+' and '+p[1]+' sound almost the same. Listen to both.'}});pRun(it,'Almost the same sounds','@listen')}
function pReadGo(){const pool=sh(pSents().filter(s=>s.length<=55)).slice(0,5);if(pool.length<3){alert('Not enough sentences yet.');return}pRun(pool.map(s=>({t:'spk',s,sk:'Speaking'})),'Read aloud','@listen')}
function vListen(){
 return`<button class=btn2 type=button onclick="go('practice')">← Practice</button><h1>LISTENING LAB</h1><p class=mut>Train your ear first, then your mouth. Sentences come from the levels you already opened.</p>${pAr('درّب أذنك أولًا ثم نطقك. الجمل من المستويات المفتوحة عندك.')}
 <div class=card><h2>🎧 Hear it, pick it</h2><p class=mut>You hear a sentence with no text. Choose what you heard. Use the slow button when it is too fast.</p>${pAr('تسمع الجملة دون نص ثم تختار ما سمعته. يوجد زر للسماع ببطء.')}<button class=btn type=button onclick="pListenGo(8)">Start 8 questions</button></div>
 <div class=card><h2>👂 Almost the same sounds</h2><p class=mut>Tap each word to hear the difference.</p>${pAr('كلمات متقاربة في النطق. اضغط لتسمع الفرق.')}
  <div class=pairs>${PMP.map(p=>`<div class=pair>${p.map(w=>`<button type=button class=chip data-t="${esc(w)}" onclick="say(this.dataset.t)">▶ ${esc(w)}</button>`).join('<span class=mut>·</span>')}</div>`).join('')}</div>
  <button class=btn type=button onclick="pPairQuiz()">Which word did you hear? (8 questions)</button></div>
 <div class=card><h2>🎤 Read aloud</h2><p class=mut>Listen, then read the sentence. Wrong words turn red. It works best in Chrome or Edge.</p>${pAr('اسمع الجملة ثم اقرأها بصوتك. الكلمات الخاطئة تظهر بالأحمر.')}<button class=btn type=button onclick="pReadGo()">Start 5 sentences</button></div>
 <div class=card><h2>⚡ Real-life speed</h2><p class=mut>People join and shorten words. Learn how it sounds.</p><button class=btn2 type=button onclick="goX('fast')">Fast speech</button> <button class=btn2 type=button onclick="go('stories')">Listen with a story</button></div>`}

/* ---------- Grammar library: every rule, grouped by level ---------- */
function vGrammar(){const cl=curLevel(),by={};GR.forEach((g,gu)=>{(by[lvOf(gu)]=by[lvOf(gu)]||[]).push(gu)});
 let h=`<button class=btn2 type=button onclick="go('practice')">← Practice</button><h1>GRAMMAR LIBRARY</h1><p class=mut>${GR.length} rules, grouped by level. Open a level to see its rules. A rule opens after the 3 lessons of its unit.</p>${pAr('كل قواعد المنهج في مكان واحد، مرتبة حسب المستوى.')}`;
 Object.keys(by).map(Number).sort((a,b)=>a-b).forEach(n=>{const done=by[n].filter(grOK).length;
  h+=`<details class="card gl2" ${n==cl?'open':''}><summary><b>Level ${n} · ${LV[n-1]}</b> <span class=mut>${CEFR(n)} · ${done}/${by[n].length}</span></summary>${by[n].map(gu=>{const g=GR[gu],ok=grOK(gu),op=n<(S.start||1)||[0,1,2].every(i=>S.done[gu*3+i]!=null);
   return`<button class="row ${op?'':'lock'}" ${op?'':'disabled'} type=button onclick="go('gram',${gu})"><span>${ok?'✔':op?'📘':'🔒'} ${esc(g.t)}</span><b>${ok?S.gr[gu]+'%':''}</b></button>`}).join('')}</details>`});
 return h}

/* ---------- Wordbook (spaced review + notebook + saved + mistakes) ---------- */
let WT='due',WEX={};
function wExample(en){if(en in WEX)return WEX[en];let r='';try{const re=new RegExp('\\b'+en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');for(const l of LS){if(!l.w.some(w=>w.en==en))continue;const s=l.ss.find(x=>re.test(x));if(s){r=s;break}}}catch(e){}WEX[en]=r;return r}
const wSay=en=>`<button type=button class="btn2 wsp" data-t="${esc(en)}" onclick="say(this.dataset.t)" aria-label="Listen">▶</button>`;
function wShow(){const a=$('#ans');if(a)a.style.display='block';const b=$('#wsh');if(b)b.style.display='none';const r=$('#wrt');if(r)r.style.display='block'}
function wFilter(v){v=String(v||'').toLowerCase().trim();document.querySelectorAll('.wr').forEach(r=>{r.style.display=!v||r.dataset.k.indexOf(v)>-1?'':'none'})}
function wTab(t){WT=t;draw()}
function wAdd(en){if(LEX[en]===undefined||S.vocab[en])return;S.vocab[en]={ar:LEX[en],box:0,due:Date.now(),t:Date.now()};save();draw()}
function vWords(){const v=S.vocab,keys=Object.keys(v),due=Object.entries(v).filter(x=>x[1].due<=Date.now()),sv=Object.entries(XS().sv||{});
 const tabs=[['due','To review',due.length],['all','My words',keys.length],['saved','Saved',sv.length],['mist','Mistakes',S.mist.length]];
 if(!tabs.some(t=>t[0]==WT))WT='due';
 let h=`<h1>WORDBOOK</h1><p class=mut>Your words, with sound and examples.</p>${pAr('كتاب مفرداتك: نطق وأمثلة ومراجعة ذكية.')}<div class=wtabs role=tablist>${tabs.map(t=>`<button type=button role=tab aria-selected="${WT==t[0]}" class="chip ${WT==t[0]?'on':''}" onclick="wTab('${t[0]}')">${t[1]}${t[2]?` <b>${t[2]}</b>`:''}</button>`).join('')}</div>`;
 if(WT=='due'){
  if(!keys.length)return h+'<div class=card><p>Your wordbook is empty. Finish a lesson and its words will appear here.</p>'+pAr('أكمل درسًا وستظهر كلماته هنا.')+'<button class=btn type=button onclick="hNext()">Open my next lesson</button></div>';
  if(!due.length)return h+`<div class=card><p>Nothing to review now. ${keys.length} word${keys.length>1?'s':''} in your wordbook.</p>${pAr('لا توجد كلمات للمراجعة الآن. عد لاحقًا.')}<button class=btn2 type=button onclick="wTab('all')">See my words</button></div>`;
  const [en]=due[0],ex=wExample(en);
  return h+`<div class=card style="text-align:center"><p class=mut>${due.length} to review</p><h2 style="font-size:30px">${esc(en)}</h2>${wSay(en)}
   <div id=ans style="display:none;margin:10px 0"><p class=ara lang=ar dir=rtl style="font-size:24px;margin:4px 0">${esc(LEX[en]||'')}</p><p style="font-size:17px;margin:4px 0">${esc(DEFS[en]||'')}</p>${ex?`<p class=mut style="margin:8px 0"><i>${esc(ex)}</i> <button type=button class="btn2 wsp" data-t="${esc(ex)}" onclick="say(this.dataset.t)" aria-label="Listen to the example">▶</button></p>`:''}</div>
   <button id=wsh class=btn2 type=button onclick="wShow()">Show meaning</button>
   <div id=wrt style="display:none"><p>Did you remember it?</p><button class=btn type=button data-w="${esc(en)}" onclick="rate(this.dataset.w,1)">Yes</button> <button class=btn2 type=button data-w="${esc(en)}" onclick="rate(this.dataset.w,0)">No</button></div></div>`}
 if(WT=='all'){
  if(!keys.length)return h+'<div class=card><p>No words yet.</p></div>';
  return h+`<div class=card><input class=wfl type=search placeholder="Search my words" aria-label="Search my words" oninput="wFilter(this.value)" autocomplete=off>${keys.sort().map(en=>{const b=v[en].box,ar=LEX[en]||'';return`<div class="w wr" data-k="${esc((en+' '+ar).toLowerCase())}"><b>${esc(en)}<br><span class=ara lang=ar dir=rtl>${esc(ar)}</span></b><span class=dfn>${esc(DEFS[en]||'')}</span><span class=boxes title="Box ${b+1} of 6" aria-label="Box ${b+1} of 6">${'●'.repeat(b+1)}${'○'.repeat(5-b)}</span>${wSay(en)}</div>`}).join('')}</div>`}
 if(WT=='saved'){
  if(!sv.length)return h+'<div class=card><p>No saved words yet. Save the Word of the day and it will appear here.</p>'+pAr('احفظ كلمة اليوم لتظهر هنا.')+'<button class=btn type=button onclick="goX(\'wod\')">Word of the day</button></div>';
  return h+`<div class=card>${sv.map(([en,ar])=>`<div class=w><b>${esc(en)}<br><span class=ara lang=ar dir=rtl>${esc(ar)}</span></b>${wSay(en)}${LEX[en]!==undefined&&!v[en]?`<button type=button class=btn2 data-w="${esc(en)}" onclick="wAdd(this.dataset.w)">+ Review</button>`:''}</div>`).join('')}</div>`}
 if(!S.mist.length)return h+'<div class=card><p>No mistakes yet. Words you miss in quizzes will appear here.</p>'+pAr('الكلمات التي تخطئ فيها تظهر هنا لتراجعها.')+'</div>';
 return h+`<div class=card>${S.mist.map(m=>`<div class=w><b>${esc(m.en)}<br><span class=ara lang=ar dir=rtl>${esc(m.ar||LEX[m.en]||'')}</span></b><span class=dfn>${esc(DEFS[m.en]||'')}</span>${wSay(m.en)}</div>`).join('')}<button class=btn type=button onclick="pract()">Practise my mistakes</button></div>`}

/* ---------- Quick access on Home ---------- */
function qaHtml(){const d=dueN();
 return`<div class=qa>${[['practice','🎯','Practice',''],['review','🧠','Wordbook',d],['stories','🎬','Stories',''],['translate','🌐','Translator',''],['grammar','📘','Grammar',''],['progress','📊','Progress','']].map(x=>`<button type=button class=qa__i onclick="go('${x[0]}')"><span aria-hidden=true>${x[1]}</span>${x[2]}${x[3]?`<b>${x[3]}</b>`:''}</button>`).join('')}</div>`}

/* ---------- Bottom tab bar (phones and tablets; the docked sidebar replaces it on wide screens) ---------- */
function hubIcons(){
ICP.practice='<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle class=g cx="12" cy="12" r="1.8"/>';
ICP.listen='<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect class=f x="3.5" y="13.5" width="4" height="6.5" rx="1.6"/><rect class=f x="16.5" y="13.5" width="4" height="6.5" rx="1.6"/>';
ICP.words='<rect x="4" y="3.5" width="16" height="17" rx="2.4"/><path d="M8 8.5h8M8 12h8"/><path class=f d="M8 15.5h5v1.8H8z"/>';
ICP.grid='<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect class=f x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect class=f x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>';
}
function tabsHtml(){const on=(!USER||REC||AUTHV)?0:1,hide=!on||['lesson','story','test'].includes(V)||(V=='explore'&&['run','rps'].includes(X&&X.p));
 try{document.body.classList.toggle('tb',!hide)}catch(e){}
 if(hide)return'';const d=dueN(),act=t=>({home:['home'],learn:['learn','lesson','gram'],practice:['practice','listen','grammar','explore','stories','translate'],review:['review']})[t].includes(V);
 const it=[['home','home','Home'],['learn','learn','Learn'],['practice','practice','Practice'],['review','words','Words']];
 return`<div class=tabs role=navigation aria-label="Main">${it.map(x=>`<button type=button class="${act(x[0])?'on':''}" ${act(x[0])?'aria-current=page':''} onclick="go('${x[0]}')">${ic(x[1])}<span>${x[2]}</span>${x[0]=='review'&&d?`<b>${d>99?'99+':d}</b>`:''}</button>`).join('')}<button type=button onclick="mnToggle()" aria-label="Open menu">${ic('grid')}<span>Menu</span></button></div>`}

/* ---------- Placement result: what the learner can do now, and the next step ---------- */
const CANDO={
 A1:['You can understand and use familiar everyday expressions and very basic phrases, introduce yourself and ask simple questions.','يمكنك فهم واستخدام العبارات اليومية البسيطة والتعريف بنفسك وطرح أسئلة بسيطة.','Next: finish the first lessons, then practise listening a little every day.'],
 A2:['You can handle simple, routine situations: shopping, directions, family, work and talking about your day.','يمكنك التعامل مع مواقف يومية بسيطة: التسوق والاتجاهات والعائلة والعمل والحديث عن يومك.','Next: learn the past and future forms and practise short conversations.'],
 B1:['You can follow the main points of clear speech, travel, describe experiences and give simple reasons and opinions.','يمكنك فهم النقاط الرئيسية في الكلام الواضح والسفر ووصف التجارب وذكر الأسباب والآراء.','Next: read short stories and write a few sentences every day.'],
 B2:['You can understand longer texts and talk about many topics with good fluency, with some mistakes.','يمكنك فهم نصوص أطول والحديث في موضوعات كثيرة بطلاقة جيدة مع بعض الأخطاء.','Next: work on writing clearly and on natural, fast speech.'],
 C1:['You can use English flexibly for study and work and understand demanding texts.','يمكنك استخدام الإنجليزية بمرونة في الدراسة والعمل وفهم النصوص الصعبة.','Next: polish style, precision and idioms.']};
function canDo(lvl){const c=CANDO[CEFR(lvl)];if(!c)return'';const w=pWeak(),p=PSK[w.k];
 return`<div class=card><h3 style="margin-top:0">What this level means · ${CEFR(lvl)}</h3><p>${c[0]}</p><p class=ara lang=ar dir=rtl>${c[1]}</p><p class=mut>${c[2]}</p>${w.n<5?'':`<p class=mut>Your weakest skill so far: <b>${w.k}</b>.</p>`}</div>`}
