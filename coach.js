/* LanguWay English: smart coach + bilingual helper brain + quick-access memory.
   Loaded BEFORE app.js; everything here runs lazily (after app.js has defined S, go, hBot, ...).
   What it does:
   1. Remembers which sections the learner opens (counts + last visit) in its own localStorage key `ef_use_<user>`.
      It never touches the progress object S, so saved progress and cloud sync are unaffected by this file.
   2. Coach: reads progress + usage and writes short reminders in English AND Arabic
      ("you have not opened Grammar for 6 days", "you practised Reading a lot but not Speaking", ...).
   3. Helper brain (hPre): understands Arabic and English questions about what to study, progress, weak points,
      stories, review, motivation, words (Arabic -> English), and answers in both languages.
   Everything works offline: rule-based, no AI service. */

/* ---------- Usage memory ---------- */
const UKEY=()=>'ef_use_'+((typeof USER=='string'&&USER)?USER:'guest');
function uLoad(){try{const o=JSON.parse(localStorage.getItem(UKEY())||'null');if(o&&typeof o=='object'&&o.c&&o.l)return o}catch(e){}return{c:{},l:{},f:Date.now(),n:0,d:{}}}
function uSave(o){try{localStorage.setItem(UKEY(),JSON.stringify(o))}catch(e){}}
/* Views are grouped into sections: a lesson belongs to Learn, a story to Stories, a grammar rule to Grammar */
const USEC={home:'home',learn:'learn',lesson:'learn',gram:'gram',review:'review',progress:'progress',settings:'settings',test:'test',cert:'cert',search:'search',help:'help',share:'share',stories:'stories',story:'stories',explore:'explore',translate:'translate'};
function uTrack(v){try{const s=USEC[v];if(!s||!USER)return;const o=uLoad();o.c[s]=(o.c[s]||0)+1;o.l[s]=Date.now();uSave(o)}catch(e){}}
function uSession(){try{if(!USER||sessionStorage.getItem('ef_us'))return;sessionStorage.setItem('ef_us','1');const o=uLoad();o.n=(o.n||0)+1;uSave(o)}catch(e){}}
function uCount(s){try{return uLoad().c[s]||0}catch(e){return 0}}
const dayN=ts=>Math.floor((Date.now()-ts)/864e5);

/* ---------- Names (English / Arabic) ---------- */
const SECN={learn:['Learn','التعلّم'],gram:['Grammar','القواعد'],review:['Review','المراجعة'],stories:['Stories','القصص'],explore:['Explore','الاستكشاف'],translate:['Translator','المترجم'],progress:['Progress','التقدّم']};
const SKN={Vocabulary:['Vocabulary','المفردات'],Reading:['Reading','القراءة'],Listening:['Listening','الاستماع'],Grammar:['Grammar','القواعد'],Writing:['Writing','الكتابة'],Speaking:['Speaking','التحدّث']};
/* Where each skill is best practised */
const SKGO={Vocabulary:'go:review',Reading:'next',Listening:'go:stories',Grammar:'gram',Writing:'go:explore',Speaking:'next'};
const ACTN={next:['Continue my lesson','أكمل درسي'],'go:review':['Review words','راجع الكلمات'],'go:stories':['Watch a story','شاهد قصة'],'go:explore':['Open Explore','افتح الاستكشاف'],'go:translate':['Open Translator','افتح المترجم'],gram:['Practise grammar','تدرّب على القواعد'],'go:progress':['See my progress','شاهد تقدمي'],'go:test':['Take the placement test','ابدأ اختبار تحديد المستوى'],'go:learn':['Open Learn','افتح التعلّم']};
function arDays(n){return n==1?'يومًا واحدًا':n==2?'يومين':n<=10?n+' أيام':n+' يومًا'}
function enDays(n){return n+' day'+(n==1?'':'s')}

/* ---------- Study facts used by the coach ---------- */
function lastStudyDay(){const ks=Object.keys(S.days||{}).filter(k=>S.days[k]>0).sort();return ks.length?ks[ks.length-1]:''}
function daysSince(ds){if(!ds)return 999;const p=ds.split('-').map(Number),t=new Date(p[0],p[1]-1,p[2]).getTime();return Math.max(0,Math.round((Date.parse(today())-t)/864e5))}
function skStats(){return Object.keys(SKN).map(k=>{const t=(S.sk||{})[k]||[0,0];return{k,ok:t[0],n:t[1],p:t[1]?Math.round(t[0]/t[1]*100):0}})}

/* ---------- The coach: returns reminders, most important first ---------- */
/* Each reminder: {id, pri, en, ar, act} where act is an action code understood by qDo() */
function coachList(){
 const out=[];if(!S||!USER)return out;
 const nm=S.set&&S.set.name?S.set.name:'',nE=nm?nm+', ':'',nA=nm?'يا '+nm+'، ':'';
 const u=uLoad(),done=doneN(),cl=curLevel(),T=skStats().reduce((a,x)=>a+x.n,0);
 const add=(id,pri,en,ar,act)=>out.push({id,pri,en,ar,act});
 if(!S.placed){add('placed',100,'Take the placement test first. It finds your exact level (1 to 30) so every lesson fits you.','ابدأ باختبار تحديد المستوى أولًا. فهو يحدّد مستواك بدقة (من 1 إلى 30) لتناسبك كل الدروس.','go:test');return out}
 const ls=daysSince(lastStudyDay()),hr=new Date().getHours(),studiedToday=S.days[today()]>0;
 if(done>0&&ls>=2)add('gap',92,nE+'it has been '+enDays(ls)+' since your last quiz. Ten minutes today will keep your memory fresh.',nA+'مرّت '+arDays(ls)+' منذ آخر اختبار لك. عشر دقائق اليوم تُبقي معلوماتك حاضرة.','next');
 else if(done>0&&!studiedToday&&hr>=17&&streak()>0)add('streak',88,'Your '+streak()+'-day streak ends tonight. One quiz is enough to keep it alive.','سلسلة أيامك ('+streak()+') ستنتهي الليلة. اختبار واحد يكفي للحفاظ عليها.','next');
 const due=dueN();
 if(due>=8)add('due',80,due+' words are waiting for review. Reviewing them now is the fastest way to remember them for good.','هناك '+due+' كلمة تنتظر المراجعة. مراجعتها الآن أسرع طريقة لتثبيتها في ذاكرتك.','go:review');
 if(S.mist&&S.mist.length>=5)add('mist',72,'You have '+S.mist.length+' words you got wrong. Practise them in Review before they fade.','لديك '+S.mist.length+' كلمات أخطأت فيها. تدرّب عليها في المراجعة قبل أن تنساها.','go:review');
 /* Sections that were not opened for a while (or never) */
 if(done>=3||u.n>=3){
  [['gram','gram'],['stories','go:stories'],['review','go:review'],['explore','go:explore'],['translate','go:translate']].forEach(p=>{
   const s=p[0],last=u.l[s],nv=!u.c[s],nmx=SECN[s];
   if(s=='review'&&Object.keys(S.vocab||{}).length<5)return;
   if(s=='gram'&&!(S.gr&&Object.keys(S.gr).length)&&done<6&&u.n<4)return;
   if(nv&&(dayN(u.f)>=2||u.n>=3))add('never-'+s,60-(s=='stories'?0:3),'You have not opened '+nmx[0]+' yet. It is a big part of learning English.','لم تفتح قسم «'+nmx[1]+'» بعد. وهو جزء مهم في تعلّم الإنجليزية.',p[1]);
   else if(!nv&&dayN(last)>=5)add('idle-'+s,58-Math.min(10,dayN(last)),nE+'you have not opened '+nmx[0]+' for '+enDays(dayN(last))+'.',nA+'لم تدخل قسم «'+nmx[1]+'» منذ '+arDays(dayN(last))+'.',p[1])})}
 /* Focus on one skill only */
 if(T>=40){const st=skStats().sort((a,b)=>b.n-a.n),hi=st[0],lo=st[st.length-1];
  if(hi.n>=3*(lo.n+8)){const a=SKN[hi.k],b=SKN[lo.k];add('skew-'+lo.k,66,'You have focused on '+a[0]+' ('+hi.n+' questions) but only '+lo.n+' on '+b[0]+'. Balance them to speak and understand better.','ركّزت على «'+a[1]+'» ('+hi.n+' سؤالًا) لكن «'+b[1]+'» لم تتدرّب عليه إلا '+lo.n+' مرة. وازِن بينهما لتتحسّن أسرع.',SKGO[lo.k])}
  const wk=skStats().filter(x=>x.n>=12&&x.p<60).sort((a,b)=>a.p-b.p)[0];
  if(wk){const b=SKN[wk.k];add('weak-'+wk.k,70,'Your '+b[0]+' accuracy is '+wk.p+'%. A few short practice sessions will lift it.','دقّتك في «'+b[1]+'» هي '+wk.p+'%. بضع جلسات قصيرة ستحسّنها.',SKGO[wk.k])}}
 if(done>=5&&!(S.ex&&S.ex.wr&&S.ex.wr.length))add('nowrite',50,'You have not practised free writing yet. Write 3 sentences in Explore and get feedback.','لم تتدرّب على الكتابة الحرة بعد. اكتب ٣ جمل في «الاستكشاف» واحصل على ملاحظات.','go:explore');
 {const d=lvDay(cl);if(d>PACE&&!(S.lt[cl]>=75))add('pace',55,'You are on day '+d+' of Level '+cl+'. The plan is '+PACE+' days, so push a little today.','أنت في اليوم '+d+' من المستوى '+cl+'، والخطة '+PACE+' يومًا. زِد جهدك قليلًا اليوم.','next')}
 if(!studiedToday&&done>0&&!out.some(x=>x.pri>=80))add('today',40,nE+'you have not finished a quiz today. Your daily goal is waiting.',nA+'لم تُنهِ أي اختبار اليوم. هدفك اليومي ينتظرك.','next');
 if(streak()>=3&&studiedToday)add('praise',20,'🔥 '+streak()+' days in a row'+(nm?', '+nm:'')+'! Wonderful consistency.','🔥 '+streak()+' أيام متتالية'+(nm?' يا '+nm:'')+'! استمراريتك رائعة.','');
 const dis=u.d||{};
 return out.filter(x=>dis[x.id]!==today()).sort((a,b)=>b.pri-a.pri)}
function coachDismiss(id){try{const o=uLoad();o.d=o.d||{};o.d[id]=today();uSave(o)}catch(e){}if(typeof V!='undefined'&&V=='home')draw();const t=document.getElementById('coachT');if(t)t.remove()}
const _lbl=(a,i)=>(ACTN[a]||['Open','افتح'])[i];
function coachItem(m,compact){return`<div class=cm><button class=cmx type=button aria-label="Hide for today / إخفاء لهذا اليوم" onclick="coachDismiss('${m.id}')">✕</button><p class=cme>${esc(m.en)}</p><p class=cma dir=rtl lang=ar>${esc(m.ar)}</p>${m.act?`<button class=cmb type=button onclick="qDo('${m.act}')">${esc(_lbl(m.act,0))}<span dir=rtl lang=ar> · ${esc(_lbl(m.act,1))}</span></button>`:''}</div>`}
/* Card on the Home page: top reminders */
function coachCard(max){const l=coachList().slice(0,max||2);if(!l.length)return'';return`<section class="card coach" aria-label="Coach / المدرّب"><h3 style="margin:0 0 4px">🎯 Your coach <span dir=rtl lang=ar class=mut>· مدرّبك</span></h3>${l.map(coachItem).join('')}</section>`}
/* One small banner when the app is opened (once per visit, only for important reminders) */
function coachToast(){try{if(!USER||V!='home'||sessionStorage.getItem('ef_ct'))return;const m=coachList().find(x=>x.pri>=60);if(!m)return;sessionStorage.setItem('ef_ct','1');if(document.getElementById('coachT'))return;
 const d=document.createElement('div');d.id='coachT';d.setAttribute('role','status');d.innerHTML=`<button class=cmx type=button aria-label="Close / إغلاق" onclick="this.parentNode.remove()">✕</button><b>🎯 Coach · المدرّب</b><p class=cme>${esc(m.en)}</p><p class=cma dir=rtl lang=ar>${esc(m.ar)}</p><div class=cmr>${m.act?`<button class=cmb type=button onclick="document.getElementById('coachT').remove();qDo('${m.act}')">${esc(_lbl(m.act,0))}<span dir=rtl lang=ar> · ${esc(_lbl(m.act,1))}</span></button>`:''}<button class=cmb2 type=button onclick="document.getElementById('coachT').remove();hOpen()">💬 Helper · المساعد</button></div>`;
 document.body.appendChild(d);setTimeout(()=>{try{d.classList.add('out');setTimeout(()=>d.remove(),500)}catch(e){}},9000)}catch(e){}}
/* Actions used by the quick tiles, the bottom bar and the coach */
function qDo(a){try{if(HO)hOpen()}catch(e){}
 if(a=='next')return hNext();if(a=='gram'){const d=grDue();return d.length?go('gram',d[0]):go('learn')}
 if(a=='helper')return hOpen();
 if(a.indexOf('go:')==0)return go(a.slice(3));
 if(a.indexOf('story:')==0)return storyOpen(+a.slice(6))}

/* ---------- Quick access tiles for the Home page: always the same first three, the rest ordered by what YOU use most ---------- */
function quickTiles(){
 const d=dueN(),cl=curLevel(),ep=(typeof epOf=='function')&&epOf(cl);
 const base=[
  {id:'next',e:'Continue',a:'أكمل',ic:'learn',act:'next',fix:1,hint:'Lesson'},
  {id:'review',e:'Review',a:'مراجعة',ic:'review',act:'go:review',fix:1,badge:d,sec:'review'},
  {id:'stories',e:'Story',a:'قصة',ic:'stories',act:ep?'story:'+cl:'go:stories',fix:1,sec:'stories'},
  {id:'gram',e:'Grammar',a:'القواعد',ic:'pen',act:'gram',sec:'gram'},
  {id:'translate',e:'Translator',a:'المترجم',ic:'chat',act:'go:translate',sec:'translate'},
  {id:'explore',e:'Explore',a:'استكشف',ic:'cert',act:'go:explore',sec:'explore'},
  {id:'search',e:'Search',a:'بحث',ic:'search',act:'go:search',sec:'search'},
  {id:'progress',e:'Progress',a:'تقدّمي',ic:'progress',act:'go:progress',sec:'progress'},
  {id:'helper',e:'Helper',a:'المساعد',ic:'help',act:'helper',sec:'helper'}];
 const fx=base.filter(x=>x.fix),rest=base.filter(x=>!x.fix).map((x,i)=>({x,i,c:uCount(x.sec)})).sort((p,q)=>q.c-p.c||p.i-q.i).map(p=>p.x);
 return fx.concat(rest).map(t=>`<button type=button class=qt onclick="qDo('${t.act}')">${ic(t.ic)}${t.badge?`<b class=qb>${t.badge}</b>`:''}<span class=qe>${t.e}</span><span class=qa dir=rtl lang=ar>${t.a}</span></button>`).join('')}
function quickHtml(){return`<div class=qgrid role=navigation aria-label="Quick access / وصول سريع">${quickTiles()}</div>`}

/* ---------- Bottom bar (phones) + floating helper button ---------- */
function qnSync(){try{if(V!='home'){const t=document.getElementById('coachT');if(t)t.remove()}
 let n=document.getElementById('qn'),f=document.getElementById('fab');
 const show=!!USER&&!REC&&!AUTHV,dk=DT();
 if(!n){n=document.createElement('nav');n.id='qn';n.setAttribute('aria-label','Main');document.body.appendChild(n)}
 if(!f){f=document.createElement('button');f.id='fab';f.type='button';f.setAttribute('aria-label','Ask the helper / اسأل المساعد');f.onclick=()=>hOpen();f.innerHTML=ic('chat');document.body.appendChild(f)}
 n.hidden=!show||dk||MN;f.hidden=!show||MN;if(document.body&&document.body.classList)document.body.classList.toggle('qnb',show&&!dk);
 if(!show||dk)return;
 const on=v=>V==v||((V=='lesson'||V=='gram')&&v=='learn')||(V=='story'&&v=='stories'),d=dueN();
 const it=[['home','home','Home','الرئيسية'],['learn','learn','Learn','تعلّم'],['review','review','Review','مراجعة'],['stories','stories','Stories','قصص'],['__m','menu','More','المزيد']];
 n.innerHTML=it.map(x=>`<button type=button class="${on(x[0])?'on':''}" ${on(x[0])?'aria-current=page':''} onclick="${x[0]=='__m'?'mnToggle()':`go('${x[0]}')`}">${ic(x[1])}<span class=qne>${x[2]}</span><span class=qna dir=rtl lang=ar>${x[3]}</span>${x[0]=='review'&&d?`<b class=qb>${d>99?'99+':d}</b>`:''}</button>`).join('')}catch(e){}}

/* ---------- Arabic helpers ---------- */
const AR_RE=/[؀-ۿ]/;
const arNorm=s=>String(s||'').toLowerCase().replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^؀-ۿa-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
/* Arabic grammar names -> the English rule title the helper already knows */
const ARG=[['المضارع البسيط','present simple'],['المضارع المستمر','present continuous'],['المضارع التام المستمر','present perfect continuous'],['المضارع التام','present perfect'],['الماضي البسيط','past simple'],['الماضي المستمر','past continuous'],['الماضي التام المستمر','past perfect continuous'],['الماضي التام','past perfect'],['المستقبل','future'],['المبني للمجهول','passive'],['المبني للمعلوم','active'],['الشرط','conditional'],['الجمل الشرطيه','conditional'],['المقارنه','comparative'],['الصفات','adjectives'],['حروف الجر','prepositions'],['الاسئله','questions'],['الضمائر','pronouns'],['الافعال المساعده','modal'],['الافعال الناقصه','modal'],['الكلام المنقول','reported speech'],['الجمل الموصوله','relative clauses'],['المقادير','quantifiers'],['الاسماء','nouns'],['الافعال','verbs'],['الظروف','adverbs'],['المصدر','gerund'],['اداه التعريف','articles'],['الاداه','articles'],['النفي','negative']];
let _REV=null;
function revLex(){if(_REV)return _REV;_REV={};try{for(const en in LEX){const a=LEX[en];if(!a)continue;String(a).split(/[،,\/;؛]|\s+او\s+/).forEach(p=>{const k=arNorm(p);if(k&&k.length>=2&&!_REV[k])_REV[k]=en})}}catch(e){}return _REV}
function arWord(q){const R=revLex(),t=arNorm(q),stop=new Set(['ما','معني','معنى','كلمه','كيف','اقول','قول','بالانجليزي','بالانجليزيه','بالانكليزي','بالإنجليزي','ترجم','ترجمه','في','هو','هي','ماذا','تعني','انجليزي','الانجليزيه','باللغه','ل','لي','من','عن','كلمة']);
 if(R[t])return R[t];const toks=t.split(' ').filter(w=>w&&!stop.has(w));const j=toks.join(' ');if(R[j])return R[j];if(toks.length>2)return'';for(const w of toks){if(R[w])return R[w];if(w.length>3&&w[0]=='ا'&&w[1]=='ل'&&R[w.slice(2)])return R[w.slice(2)]}return''}

/* Bilingual message builder for the helper */
const BI=(en,ar)=>`<span class=bien>${en}</span><span class=biar dir=rtl lang=ar>${ar}</span>`;
function bi2(ar,en,arFirst){return arFirst?`<span class=biar dir=rtl lang=ar>${ar}</span><span class=bien>${en}</span>`:`<span class=bien>${en}</span><span class=biar dir=rtl lang=ar>${ar}</span>`}
function coachAsHelper(m){return`<div class=hcm><span class=bien>${esc(m.en)}</span><span class=biar dir=rtl lang=ar>${esc(m.ar)}</span></div>`}
function coachChips(l){const seen={},o=[];l.forEach(m=>{if(m.act&&!seen[m.act]){seen[m.act]=1;o.push([_lbl(m.act,0)+' · '+_lbl(m.act,1),'q:'+m.act])}});return o}
function hWelcome(){const nm=nmS(),l=coachList().slice(0,3);
 let h=BI('Hi'+nm+'! 👋 I am your helper and coach. Ask me in English or Arabic.','أهلًا'+(S.set.name?' يا '+esc(S.set.name):'')+'! 👋 أنا مساعدك ومدرّبك. اسألني بالإنجليزية أو العربية.');
 h+=`<div class=hcap>${BI('I can: explain grammar with pictures · find lessons and words (also from Arabic) · tell you what to study next · show your weak points · open any section.','أستطيع: شرح القواعد بالصور · إيجاد الدروس والكلمات (وحتى من العربية) · اقتراح ما تدرسه · كشف نقاط ضعفك · فتح أي قسم.')}</div>`;
 if(l.length)h+=`<div class=hnote><b>${BI('What I noticed','ما لاحظته')}</b>${l.map(coachAsHelper).join('')}</div>`;
 hBot(h,coachChips(l).concat([['What should I study? · ماذا أدرس؟','adv'],['My progress · تقدّمي','prog'],['All grammar rules · كل القواعد','rlist:0']]).slice(0,6))}

/* ---------- Helper answers ---------- */
function _prog(){const st=skStats(),cl=curLevel(),w=Object.keys(S.vocab||{}).length;
 const rows=st.map(x=>`<tr><td>${SKN[x.k][0]} · <span dir=rtl lang=ar>${SKN[x.k][1]}</span></td><td>${x.n?x.p+'%':'—'}</td><td>${x.n}</td></tr>`).join('');
 return BI(`You are on <b>Level ${cl}</b> (${LV[cl-1]}, about ${CEFR(cl)}). ${doneN()} of ${LS.length} lessons done · ${w} words learned · ${streak()}-day streak.`,`أنت في <b>المستوى ${cl}</b> (${CEFR(cl)} تقريبًا). أنجزت ${doneN()} من ${LS.length} درسًا · تعلّمت ${w} كلمة · سلسلة ${streak()} أيام.`)+`<table class=hsk><tr><th>Skill · المهارة</th><th>Accuracy · الدقة</th><th>Questions · الأسئلة</th></tr>${rows}</table>`}
function hPre(q){
 const raw=String(q||'').trim(),ar=AR_RE.test(raw),t=ar?arNorm(raw):raw.toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim(),B=(h,a)=>{hBot(h,a);return true};
 if(!t)return false;
 /* Arabic: grammar names -> let the existing English rule finder do the work */
 if(ar){const g=ARG.find(p=>t.indexOf(p[0])>=0);if(g&&/اشرح|شرح|قاعده|قواعد|كيف|وضح|ما هو|ما هي|مثال|\bال/.test(t)||g&&t.split(' ').length<=4){hAns('explain '+g[1]);return true}}
 const wordQ=/\b(mean|meaning|define|definition|synonym|opposite)\b/.test(t)||/معني|تعني|اقول|بالانجليزي|بالانجليزيه|بالانكليزي|ترجم/.test(t);
 const arLookup=()=>{const en=arWord(raw);if(!en)return false;const a=LEX[en],ex=(LS.find(l=>l.w.some(w=>w.en==en))||{}),sn=(ex.ss||[]).find(s=>s.toLowerCase().includes(en.toLowerCase()));
  return B(BI('In English: <b>'+esc(en)+'</b>'+(DEFS[en]?' — '+esc(DEFS[en]):'')+(sn?'<br><i>'+esc(sn)+'.</i>':''),'بالإنجليزية: <b>'+esc(en)+'</b> ← '+esc(a||'')),[['🔊 '+en,'say:'+en],...(ex.id!=null?[['Open the lesson · افتح الدرس','lesson:'+ex.id]]:[])].concat([['Open Translator · المترجم','q:go:translate']]))};
 if(ar&&wordQ&&arLookup())return true;
 if(!ar&&wordQ)return false;
 /* Greetings and thanks */
 if(/^(hi|hello|hey|hola|salam|good (morning|evening|afternoon))\b/.test(t)||/^(مرحبا|اهلا|هلا|السلام عليكم|سلام|صباح الخير|مساء الخير)/.test(t))return hWelcome(),true;
 if(/\b(thanks|thank you|thx)\b/.test(t)||/^(شكرا|شكرا لك|مشكور|يعطيك العافيه)/.test(t))return B(BI('You are welcome! Keep going, you are doing great. 🌟','العفو! استمر، أنت تقوم بعمل رائع. 🌟'),[['What should I study? · ماذا أدرس؟','adv']]);
 /* What to study / plan / advice */
 if(/(what (should|can|do) i (study|learn|do|practi[sc]e)|what next|what now|recommend|suggest|my plan|study plan|where (do|should) i (start|begin))/.test(t)||/(ماذا|ماذا) (ادرس|افعل|اتعلم|اتدرب)|(ايش|شو|وش) (ادرس|افعل|اسوي)|اقترح|انصحني|خطتي|خطه|من اين ابدا|بماذا ابدا/.test(t)){
  const l=coachList().slice(0,4);return B(BI('Here is what I recommend today:','هذا ما أنصحك به اليوم:')+(l.length?l.map(coachAsHelper).join(''):BI('You are on track! Continue your next lesson.','أنت على المسار الصحيح! تابع درسك التالي.')),coachChips(l).concat([['Continue my lesson · أكمل درسي','q:next']]).slice(0,5))}
 /* Progress and statistics */
 if(/\b(my )?(progress|stats|statistics|how am i doing|my level|what is my level)\b/.test(t)||/تقدمي|تقدم|مستواي|احصائيات|انجازي|كيف حالي|كيف مستواي/.test(t))return B(_prog(),[['Open Progress page · صفحة التقدّم','q:go:progress'],['My weak points · نقاط ضعفي','weak']]);
 /* Weak points / mistakes */
 if(/\b(weak|mistake|mistakes|struggl|wrong answers|improve)/.test(t)||/ضعف|ضعيف|اخطائي|نقاط ضعفي|اخطاء|اتحسن|احسن مستواي/.test(t))return hWeak();
 /* Motivation */
 if(/\b(motivat|tired|bored|boring|give up|too hard|difficult|stuck|i hate)/.test(t)||/تعبت|زهقت|ملل|مللت|صعب|احبطت|ما اقدر|لن استطيع|محبط/.test(t))return B(BI('Learning a language is a marathon, not a sprint. Even <b>5 minutes</b> today counts. Try one short quiz, you can stop right after it. 💪','تعلّم اللغة ماراثون وليس سباق سرعة. حتى <b>٥ دقائق</b> اليوم تُحسب. جرّب اختبارًا قصيرًا واحدًا، ويمكنك التوقف بعده. 💪'),[['One short quiz · اختبار قصير','q:next'],['A fun story · قصة ممتعة','q:go:stories']]);
 /* Stories */
 if(/\b(story|stories|cedar|video|videos|episode|cartoon|anime)\b/.test(t)||/قصه|قصص|فيديو|فيديوهات|حلقه|حلقات|مسلسل|انمي|كرتون/.test(t)){const cl=curLevel(),e=epOf(cl);return B(BI('The <b>Cedar City</b> stories teach English through short animated scenes with voices, subtitles and a quick question. '+(e?'Episode '+cl+' ("'+esc(e.t)+'") is ready for you.':''),'قصص <b>مدينة الأرز</b> تعلّمك الإنجليزية عبر مشاهد متحركة قصيرة بأصوات وترجمة وسؤال سريع. '+(e?'الحلقة '+cl+' («'+esc(e.t)+'») جاهزة لك.':'')),[[e?'▶ Watch episode '+cl+' · شاهد الحلقة':'Open Stories · القصص',e?'q:story:'+cl:'q:go:stories'],['All episodes · كل الحلقات','q:go:stories']])}
 /* Review / words */
 if(/\b(review|flashcard|flash cards|my words|learned words|spaced)\b/.test(t)||/مراجعه|بطاقات|كلماتي|الكلمات التي/.test(t)){const d=dueN();return B(BI(d?'You have <b>'+d+'</b> words due for review right now.':'No words are due right now. New words appear here after you finish lessons.',d?'لديك <b>'+d+'</b> كلمة تنتظر المراجعة الآن.':'لا توجد كلمات للمراجعة الآن. تظهر الكلمات الجديدة بعد إنهاء الدروس.'),[['Open Review · افتح المراجعة','q:go:review']])}
 /* Translator */
 if(/\b(translat|how (do|can) (you|i) say|in arabic|in english)\b/.test(t)||/ترجم|ترجمه|مترجم|كيف اقول|بالانجليزي|بالعربي/.test(t)&&!arWord(raw)){return B(BI('The Translator turns Arabic into English and English into Arabic, with phrases, idioms and phrasal verbs.','المترجم يحوّل من العربية إلى الإنجليزية ومن الإنجليزية إلى العربية، مع العبارات والتعابير والأفعال المركّبة.'),[['Open Translator · افتح المترجم','q:go:translate']])}
 /* This lesson (context aware) */
 if(/\b(this lesson|this page|help me here|where am i)\b/.test(t)||/هذا الدرس|هذه الصفحه|ساعدني هنا|اين انا/.test(t)){
  if(V=='lesson'&&LM[A]){const l=LM[A];return B(BI('You are in <b>'+esc(l.t)+'</b> (Level '+l.lv+', Unit '+(l.ui+1)+', Lesson '+l.n+'). Key words: '+l.w.slice(0,6).map(w=>'<b>'+esc(w.en)+'</b>').join(', ')+'. Order: Reading → Writing → Listening → Speaking → Quiz.','أنت في درس <b>'+esc(l.t)+'</b> (المستوى '+l.lv+'، الوحدة '+(l.ui+1)+'، الدرس '+l.n+'). كلمات مهمة: '+l.w.slice(0,6).map(w=>'<b>'+esc(w.en)+'</b> ('+esc(w.ar)+')').join('، ')+'. الترتيب: قراءة ← كتابة ← استماع ← تحدّث ← اختبار.'),l.w.slice(0,3).map(w=>['🔊 '+w.en,'say:'+w.en]))}
  return B(BI('You are on the <b>'+esc((SECN[USEC[V]]||[V])[0])+'</b> page. Tell me what you need and I will take you there.','أنت الآن في صفحة <b>'+esc((SECN[USEC[V]]||[0,V])[1])+'</b>. أخبرني بما تحتاجه وسآخذك إليه.'),[['What should I study? · ماذا أدرس؟','adv']])}
 if(ar&&arLookup())return true;
 /* Answers about the app (bilingual) */
 if(/\b(test|exam|placement)\b/.test(t)&&!/explain|rule|grammar/.test(t)||/اختبار|امتحان|تحديد المستوي/.test(t))return B(BI('The <b>placement test</b> finds your level (1 to 30) and opens everything below it. A unit test has 15 questions and a level test has 30. You need <b>75%</b> to pass.','<b>اختبار تحديد المستوى</b> يحدّد مستواك (من 1 إلى 30) ويفتح كل ما دونه. اختبار الوحدة 15 سؤالًا واختبار المستوى 30 سؤالًا. تحتاج <b>75%</b> للنجاح.'),[['Open placement test · اختبار المستوى','q:go:test']]);
 if(/\b(locked|unlock|why can t i)\b|\bopen (the |my )?(next )?(lesson|unit|level)/.test(t)&&!/explain|rule|grammar/.test(t)||/مقفل|مغلق|قفل|كيف افتح|لا يفتح|لماذا لا استطيع/.test(t))return B(BI('A lesson opens after the previous lesson quiz. A unit test opens after the 3 lessons and the grammar rule. A level opens after the previous level test, or after a higher placement result.','يُفتح الدرس بعد اختبار الدرس السابق. ويُفتح اختبار الوحدة بعد الدروس الثلاثة وقاعدة القواعد. ويُفتح المستوى بعد اختبار المستوى السابق أو بنتيجة أعلى في اختبار تحديد المستوى.'),[['Open my next lesson · درسي التالي','q:next']]);
 if(/\b(sync|cloud|backup)\b|lost my progress|progress (is )?(lost|gone)|(save|saved) my progress|update (the )?app/.test(t)&&!/explain|rule|grammar/.test(t)||/مزامنه|حساب|حسابي|تحديث|حفظ|ضاع|فقدت|بياناتي|تقدمي ضاع/.test(t))return B(BI('Your progress is saved on this device and in your account (when signed in). Updates are never installed without asking you, and your progress is always kept.','يُحفظ تقدمك على هذا الجهاز وفي حسابك (عند تسجيل الدخول). لا يتم تثبيت أي تحديث دون سؤالك، ويبقى تقدمك محفوظًا دائمًا.'),[['Open settings · الإعدادات','q:go:settings']]);
 if(/\b(speak|speaking|mic|microphone|pronounc|pronunciation)\b/.test(t)||/نطق|تحدث|ميكروفون|المايك|اتكلم/.test(t))return B(BI('In the Speaking section the browser listens while you read a sentence and marks wrong words in red. It works best in Chrome or Edge. Use the slow button (🐢) to hear it slowly first.','في قسم التحدّث يستمع المتصفح أثناء قراءتك للجملة ويُظهر الكلمات الخاطئة بالأحمر. يعمل بشكل أفضل في Chrome أو Edge. استخدم زر السلحفاة (🐢) لسماع الجملة ببطء أولًا.'),[['Practise speaking · تدرّب','q:next']]);
 if(/\b(install|offline)\b|share (the )?app/.test(t)&&!/explain|rule|grammar/.test(t)||/تثبيت|نزل التطبيق|مشاركه|بدون انترنت|اوفلاين/.test(t))return B(BI('You can install LanguWay like an app and use it offline after the first visit. Open <b>Install and share</b>.','يمكنك تثبيت LanguWay كتطبيق واستخدامه دون إنترنت بعد الزيارة الأولى. افتح <b>التثبيت والمشاركة</b>.'),[['Install and share · التثبيت والمشاركة','q:go:share']]);
 if(/قواعد|جرامر|قاعده/.test(t)&&!ARG.some(p=>t.indexOf(p[0])>=0)){hRList(curLevel());return true}
 if(/\b(open|go to|take me to|show me)\b/.test(t)||/افتح|خذني|اذهب|وريني|اعرض/.test(t)){const m=[[/learn|lesson|درس|تعلم/,'go:learn'],[/progress|تقدم/,'go:progress'],[/setting|اعداد/,'go:settings'],[/explore|استكشاف/,'go:explore'],[/certif|شهاد/,'go:cert'],[/search|بحث/,'go:search'],[/help|مساعد|مساعده/,'go:help']].find(p=>p[0].test(t));if(m)return B(BI('Opening it now…','جارٍ الفتح…'),[]),qDo(m[1]),true}
 return false}
function hWeak(){const st=skStats().filter(x=>x.n>=5).sort((a,b)=>a.p-b.p),m=S.mist||[];
 if(!st.length&&!m.length)return hBot(BI('I need a little more practice data first. Finish a few quizzes and I will show your weak points.','أحتاج إلى بيانات تدريب أكثر أولًا. أنهِ بضعة اختبارات وسأُظهر لك نقاط ضعفك.'),[['Continue my lesson · أكمل درسي','q:next']]),true;
 let h=st.length?BI('Your weakest skill is <b>'+SKN[st[0].k][0]+'</b> ('+st[0].p+'% correct). Your strongest is <b>'+SKN[st[st.length-1].k][0]+'</b> ('+st[st.length-1].p+'%).','أضعف مهاراتك هي <b>'+SKN[st[0].k][1]+'</b> ('+st[0].p+'% إجابات صحيحة). وأقواها <b>'+SKN[st[st.length-1].k][1]+'</b> ('+st[st.length-1].p+'%).'):'';
 if(m.length)h+=`<div class=hnote><b>${BI('Words you got wrong','كلمات أخطأت فيها')}</b><br>`+m.slice(0,6).map(x=>`<button type=button class=chip onclick="say('${esc(x.en).replace(/'/g,'')}')">🔊 ${esc(x.en)} · <span dir=rtl lang=ar>${esc(x.ar)}</span></button>`).join('')+'</div>';
 hBot(h,[[st[0]?'Practise '+SKN[st[0].k][0]+' · تدرّب':'Open Review','q:'+(SKGO[st[0]&&st[0].k]||'go:review')],['Open Review · المراجعة','q:go:review']]);return true}

/* Extra helper action codes (q:<action>, adv, prog, weak) */
function hAct2(a){if(a.indexOf('q:')==0){qDo(a.slice(2));return true}
 if(a=='adv'){hPre('what should i study');return true}if(a=='prog'){hPre('my progress');return true}if(a=='weak'){hWeak();return true}return false}
