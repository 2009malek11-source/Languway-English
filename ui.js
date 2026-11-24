/* Languway-English: the new interface layer (loaded after app.js and coach.js).
   It replaces the old views with the CEFR design: Home, Learn path, a linear lesson, a Workbook for every
   lesson, My Progress (profile), Schedule, Tests, the sidebar and the bottom bar.
   Everything here uses globals from app.js (S, LS, LM, GR, go, draw, runQuiz, mc, tw, dsq, lsq, rdq, ordQ ...). */
const uI=(n,c)=>ART.ix(n,c);
const uGo=(v,a)=>{vLesson.last=null;go(v,a)};
const uXP=()=>doneN()*20+Object.keys(S.vocab).length*5+Object.values(S.ut).filter(v=>v>=PASS).length*100+Object.values(S.lt).filter(v=>v>=PASS).length*500+Object.keys(S.wb||{}).length*10;
const uPct=()=>Math.round(doneN()/LS.length*100);
const uLvDone=n=>LS.filter(l=>l.lv==n&&S.done[l.id]!=null).length;
const uLvPct=n=>Math.round(uLvDone(n)/(lvCnt(n)*LPU)*100);
const firstStep=id=>{for(let i=0;i<8;i++)if(!secBit(id,i))return i;return 8};
const stepName=i=>i>=8?'Lesson check':SEC[i][1];
/* what the learner should do next: the first lesson, unit test or level exam that is open and not finished */
function uNext(){const cl=curLevel();
 for(let u=lvFirst(cl);u<lvFirst(cl)+lvCnt(cl);u++){
  for(let li=0;li<LPU;li++){const l=LM[u*LPU+li];if(S.done[l.id]==null)return lessonOpen(l)?{k:'lesson',l,step:firstStep(l.id)}:{k:'wait'}}
  if(!(S.ut[u]>=PASS))return utOpen(u)?{k:'ut',gu:u}:{k:'wait'}}
 if(!(S.lt[cl]>=PASS))return ltOpen(cl)?{k:'lt',n:cl}:{k:'wait'};
 return cl>=NLV?{k:'all'}:{k:'next',n:cl+1}}
function uNextTxt(nx){if(nx.k=='lesson')return{t:nx.l.t,s:`Level ${CEFR(nx.l.lv)} · Unit ${nx.l.ui+1} · Lesson ${nx.l.n}`,b:nx.step==0&&!(S.sec[nx.l.id]|0)?'Start lesson':'Continue · '+stepName(nx.step),a:`uOpen(${nx.l.id})`};
 if(nx.k=='ut')return{t:'Unit '+(unOf(nx.gu)+1)+' test',s:CURR[nx.gu].t,b:'Start unit test',a:`startUT(${nx.gu})`};
 if(nx.k=='lt')return{t:'Final Level Exam',s:CEFR(nx.n)+' · '+CEFRL[nx.n-1].n,b:'Start the exam',a:`startLT(${nx.n})`};
 if(nx.k=='all')return{t:'You finished the course',s:'C1 · Advanced',b:'See my certificates',a:"go('cert')"};
 return{t:'Take the placement test',s:'We find your level first',b:'Start',a:"go('test')"}}
function uOpen(id){if(needTest())return;vLesson.last=null;V='lesson';A=id;P=firstStep(id);INQ=0;scrollTo(0,0);draw()}
function uStep(id,i){vLesson.last=id;V='lesson';A=id;P=i;INQ=0;scrollTo(0,0);draw()}
function uDone(id,i){setSec(id,i);uStep(id,i+1)}
function uContinue(){if(needTest())return;const nx=uNext();if(nx.k=='lesson')uOpen(nx.l.id);else if(nx.k=='ut')startUT(nx.gu);else if(nx.k=='lt')startLT(nx.n);else go(nx.k=='all'?'cert':'learn')}
const jsq=s=>esc(JSON.stringify(String(s))).replace(/&quot;/g,'&#34;');
const sayB=(t,l)=>`<button type=button class=sayb onclick="say(${jsq(t)})" aria-label="Listen">${uI('sound')}${l||''}</button><button type=button class=sayb onclick="say(${jsq(t)},.6)" aria-label="Listen slowly">${uI('turtle')}</button>`;
const exFor=(w,l)=>{const re=new RegExp('\\b'+w.en.replace(/[^a-z' ]/gi,'').replace(/ +/g,'\\s+')+'\\b','i');return l.ss.find(x=>re.test(x)&&wc(x)>=3)||(typeof exOf=='function'?exOf(w.en):'')||''};

/* ---------------- chrome: header, sidebar, bottom bar ---------------- */
function uBellN(){let n=dueN();const nx=uNext();if(nx.k!='all'&&nx.k!='wait')n++;return n}
function uBell(){const nx=uNext(),t=uNextTxt(nx),d=dueN(),dayN=S.days[today()]||0,g=S.set.goal||1;
 const h=`<div class=bellp id=bellp><b>Today</b><button type=button class=bp onclick="uBellX();${t.a}">${uI('play')}<span><b>${esc(t.t)}</b><small>${esc(t.s)}</small></span></button>${d?`<button type=button class=bp onclick="uBellX();go('review')">${uI('review')}<span><b>${d} word${d>1?'s':''} to review</b><small>Keep them fresh</small></span></button>`:''}<button type=button class=bp onclick="uBellX();go('schedule')">${uI('calendar')}<span><b>Daily goal: ${Math.min(dayN,g)} of ${g}</b><small>Quizzes finished today</small></span></button></div>`;
 const o=$('#bellp');if(o){o.remove();return}document.body.insertAdjacentHTML('beforeend',h);setTimeout(()=>document.addEventListener('click',uBellAway,true),0)}
function uBellAway(e){if(!e.target.closest||e.target.closest('#bellp')||e.target.closest('.bellb'))return;uBellX()}
function uBellX(){const o=$('#bellp');if(o)o.remove();document.removeEventListener('click',uBellAway,true)}
const uBellBtn=()=>{const n=uBellN();return`<button type=button class="ib bellb" onclick="uBell()" aria-label="Notifications">${uI('bell')}${n?`<i class=bdg>${n>9?'9+':n}</i>`:''}</button>`};
const uGearBtn=()=>`<button type=button class="ib gearb" onclick="go('settings')" aria-label="Settings">${uI('gear')}</button>`;
const uName=()=>esc(S.set.name||(isC(USER)?UNAME():'')||'Learner');
function uTop(){const wide=DT();
 if(wide)return`<div class="top2"><form class=tsearch onsubmit="SQ=this.q.value;go('search');return false">${uI('search')}<input name=q placeholder="Search lessons, words..." autocomplete=off></form><div class=top2__r>${uBellBtn()}<button type=button class=avb onclick="go('progress')" aria-label="My progress"><img src=avatar.jpg alt="" width=44 height=44><span>${uName()}</span></button></div></div>`;
 if(V=='home')return'';
 return`<div class="top2 m"><button type=button class=brandb onclick="go('home')" aria-label="Home">${ART.brand('sm',true)}</button><div class=top2__r>${uBellBtn()}${uGearBtn()}</div></div>`}
function mnHtml(){const on=v=>V==v||((V=='lesson'||V=='gram')&&v=='learn')||(V=='story'&&v=='stories'),d=dueN(),C=isC(USER);
 const it=(v,i,t,b)=>`<button type=button class="sb__i ${on(v)?'on':''}" title="${t}" onclick="uGo('${v}')">${ART.ix(i)}<span class=sb__t>${t}</span>${b?`<b>${b}</b>`:''}</button>`;
 const act=C?`<button class=sb__a type=button onclick="mnDo(signOut,'See you <em>soon.</em>')">${uI('arrow')}<span class=sb__t>Sign out</span></button>`:isG(USER)?`<button class=sb__a type=button onclick="mnDo(wantAuth,'Welcome <em>back.</em>')">${uI('arrow')}<span class=sb__t>Sign in or create account</span></button>`:'';
 const night=document.documentElement.hasAttribute('data-d'),nx=uNextTxt(uNext());
 return`<div class=sb__bd onclick="mnToggle()"></div><aside class=side aria-label="Menu"><div class=sb__hd>${ART.brand('',true)}${DT()?'':`<button class=sb__x type=button onclick="mnToggle()" aria-label="Close menu">${uI('close')}</button>`}</div>
 <div class=sb__nav>${it('home','tri','Home')}${it('progress','bars','My Progress')}${it('learn','play','Lessons')}${it('workbooks','wordbook','Wordbook')}${it('tests','tests','Tests')}${it('cert','trophy','Certificates')}${it('schedule','calendar','Schedule')}${it('settings','gear','Settings')}${it('help','helper','Help')}
 <details class=sb__more><summary>${uI('spark')}<span class=sb__t>More</span></summary>${it('review','review','Review',d||'')}${it('translate','translate','Translator')}${it('stories','story','Stories')}${it('phrases','idiom','Phrases and idioms')}${it('explore','explore','Explore')}${it('search','search','Search')}${it('share','download','Install and share')}</details></div>
 <div class=sb__dn><span>${uI('spark')}</span><button class="dn ${night?'night':''}" type=button role=switch aria-checked="${night}" aria-label="Day or night mode" onclick="tgl()"><i class=dn__st></i><i class=dn__cl></i><i class=dn__k></i></button></div>
 <button type=button class=sb__tr onclick="uGo('home')"><img src=card-trophy.jpg alt=""></button>
 <div class=sb__ft>${act}</div></aside>`}
function qnSync(){try{if(V!='home'){const t=document.getElementById('coachT');if(t)t.remove()}
 let n=document.getElementById('qn'),f=document.getElementById('fab');const show=!!USER&&!REC&&!AUTHV,dk=DT();
 if(!n){n=document.createElement('nav');n.id='qn';n.setAttribute('aria-label','Main');document.body.appendChild(n)}
 if(!f){f=document.createElement('button');f.id='fab';f.type='button';f.setAttribute('aria-label','Ask the helper');f.onclick=()=>hOpen();f.innerHTML=uI('helper');document.body.appendChild(f)}
 n.hidden=!show||dk||MN;f.hidden=!show||MN||INQ;document.body.classList.toggle('qnb',show&&!dk);
 if(!show||dk)return;const nx=uNextTxt(uNext()),inP=V=='progress';
 n.innerHTML=`<button type=button class="${V=='home'?'on':''}" onclick="uGo('home')" ${V=='home'?'aria-current=page':''}>${ART.ix('tri')}<span class=qne>Home</span></button><button type=button class=qgo onclick="uContinue()" aria-label="Continue: ${esc(nx.t)}"><i>${uI('play')}</i><span class=qne>Continue</span></button><button type=button class="${inP?'on':''}" onclick="uGo('progress')" ${inP?'aria-current=page':''}>${ART.ix('bars')}<span class=qne>My Progress</span></button>`}catch(e){}}

/* ---------------- draw(): same job as before, new chrome ---------------- */
function draw(){
 const ae=document.activeElement;if((!USER||REC||AUTHV)&&ae&&ae.closest&&ae.closest('.auth')&&/INPUT/.test(ae.tagName)&&$('#app').contains(ae)&&!draw.force)return;
 if(!USER||REC||AUTHV){mnHide();$('#app').innerHTML=vAuth();mnSync();return}
 if(V=='settings'&&ae&&ae.closest&&ae.closest('.cpx')&&/INPUT/.test(ae.tagName)&&!draw.force)return;
 uBellX();
 const views={home:vHome,learn:vLearn,lesson:vLesson,gram:vGram,review:vReview,progress:vProgress,settings:vSet,test:vTest,tests:vTests,workbooks:vWorkbooks,schedule:vSchedule,cert:vCert,search:vSearch,help:vHelp,share:vShare,stories:vStories,story:vStory,explore:vExplore,translate:vTranslate,phrases:vPhrases};
 $('#app').innerHTML=uTop()+`<div class="vw vw-${V}">`+(views[V]||vHome)()+'</div>';
 document.body.dataset.v=V;mnSync();wlSync();qnSync();try{uSession();setTimeout(coachToast,1800)}catch(e){}
 if(window.uPost)uPost()}
Object.assign(VT,{tests:'Your <em>tests.</em>',workbooks:'Your <em>workbooks.</em>',schedule:'Your <em>plan.</em>'});

/* ---------------- Home ---------------- */
function vHome(){const nx=uNext(),t=uNextTxt(nx),cl=curLevel(),pc=uPct(),lp=uLvPct(cl),xp=uXP();
 const l=nx.k=='lesson'?nx.l:null,desc=l?`${l.ut}. Learn ${l.w.length} new words and practise: ${GR[l.gu].rules[0].t.split(':')[0]}.`:'Open your path to see what is next.';
 const greet=S.set.name?`<p class=hm-hi>Welcome back, ${uName()}</p>`:'';
 const stat=(img,n,l2,x)=>`<div class=hm-st><img src="${img}" alt="" width=52 height=52><div><b>${n}</b><span>${l2}</span></div>${x||''}</div>`;
 return`<section class=hm>
 <header class=hm-hero><div class="hm-bar m-only">${ART.brand('',true)}<span class=hm-bar__r>${uBellBtn()}${uGearBtn()}</span></div>
  <div class=hm-copy>${greet}<h1>Learn English<br>with <em>Confidence</em></h1><p>A smarter way to learn,<br>a brighter future!</p><button type=button class=cta onclick="uContinue()">${uI('tri')}<span>${nx.k=='lesson'&&(S.sec[l.id]|0)?'Continue Learning':'Start Learning'}</span>${uI('arrow')}</button></div>
  <img class=hm-boy src=hero.jpg alt="" width=1000 height=714><span class=hm-dots><i class=on></i><i></i><i></i><i></i></span></header>
 <div class=hm-stats>${stat('ic-levels.png',NLV,'Levels')}${stat('ic-units.png',CURR.length,'Units')}${stat('ic-trophy.png',pc+'%','Your Progress',`<span class="ring2" style="--p:${pc}"></span>`)}${stat('ic-star.png',xp,'XP Points')}</div>
 <div class="card hm-cur"><div class=hm-cur__h><span class=hm-cur__ic>${uI('play')}</span><h2>My Current Lesson</h2><button type=button class=lnk onclick="go('learn')">View All ${uI('arrow')}</button></div>
  <div class=hm-cur__b><button type=button class=hm-thumb onclick="${t.a}" aria-label="${esc(t.b)}"><img src=thumb.jpg alt="" width=722 height=484></button>
  <div class=hm-cur__t><p class=hm-tag>${esc(t.s)}</p><h3>${esc(t.t)}</h3><p class=mut>${esc(desc)}</p><button type=button class=btnp onclick="${t.a}">${uI('tri')} ${esc(t.b)}</button></div>
  <ul class=hm-parts>${['Video|playb|Warm-up and words','Vocabulary|vocab|Words, pictures, audio','Grammar|gram|The rule, step by step','Lesson Test|check|Pass with 80%'].map(x=>{const p=x.split('|');return`<li>${uI(p[1])}<span>${p[0]}</span></li>`}).join('')}</ul></div></div>
 <div class="hm-grid"><div class="card hm-lvl"><h3>${uI('shield')} Your Level</h3><div class=shd><img src=shield-violet.png alt=""><b>${cl}</b></div><p class=hm-lvn>${CEFR(cl)} · ${CEFRL[cl-1].n}</p><p class=mut>Keep going to unlock new levels!</p><div class=bar><i style="width:${lp}%"></i></div><small class=pcs>${lp}%</small></div>
  <div class="card hm-qa"><h3>${uI('bolt')} Quick Access</h3><div class=qa4>${[['q-listen.png','Listening',"go('stories')"],['q-tests.png','Tests',"go('tests')"],['q-wordbook.png','Wordbook',"go('workbooks')"],['q-schedule.png','Schedule',"go('schedule')"]].map(x=>`<button type=button onclick="${x[2]}"><img src="${x[0]}" alt=""><span>${x[1]}</span></button>`).join('')}</div></div>
  <div class="card hm-reach"><div><h3>Reach Higher!</h3><p>Complete more lessons<br>and earn your certificate.</p><button type=button class=btng onclick="go('cert')">View Certificates ${uI('arrow')}</button></div><img src=crown-scroll.jpg alt=""></div></div>
 <div class="hm-qrow m-only">${[['m-level.png','Your Level',"go('progress')"],['m-bolt.png','Quick Access',"go('review')"],['m-cal.png','Schedule',"go('schedule')"],['svg:translate','Translator',"go('translate')"]].map(x=>`<button type=button class=qtile onclick="${x[2]}">${x[0].startsWith('svg:')?uI(x[0].slice(4)):`<img src="${x[0]}" alt="">`}<span>${x[1]}</span></button>`).join('')}</div>
 <div class="hm-banner m-only" onclick="go('learn')"><img class=hb-t src=banner-trophy.jpg alt=""><div><h3>Great Progress!</h3><p>Keep going to unlock<br>new levels!</p><div class=hb-bar><div class=bar><i style="width:${lp}%"></i></div><b>${lp}%</b></div></div><div class=shg><img src=shield-gold.jpg alt=""><b>${cl}</b></div></div>
 <h2 class=hm-h2>More ways to learn</h2><div class=hm-more>${[['review','Review','Words to refresh'],['translate','Translator','Explains any word'],['stories','Stories','Listen and watch'],['phrases','Phrases and idioms','Real expressions'],['explore','Explore','Games and writing'],['workbooks','Workbooks','One for every lesson']].map(x=>`<button type=button onclick="go('${x[0]}')">${uI({review:'review',translate:'translate',stories:'story',phrases:'idiom',explore:'explore',workbooks:'wordbook'}[x[0]])}<b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div>
 ${todoHome()}</section>`}
function todoHome(){try{return typeof coachHome=='function'?coachHome():''}catch(e){return''}}

/* ---------------- Learn: a clear path ---------------- */
let UOPEN={};
function vLearn(){const cl=curLevel();OL=OL||cl;if(OL<1||OL>NLV)OL=cl;let h=`<h1>YOUR PATH</h1><p class=mut>One lesson at a time. Finish a lesson to open the next one. After each unit you take a test, and after the last unit a Final Level Exam.</p><div class=lvs>`;
 for(let n=1;n<=NLV;n++){const op=lvOpen(n),pc=uLvPct(n),L=CEFRL[n-1];h+=`<button type=button class="lvc ${n==OL?'on':''} ${op?'':'lock'}" ${op?'':'disabled'} onclick="OL=${n};draw()"><b>${L.c}</b><span>${L.n}</span><small>${op?pc+'%':'Locked'}</small>${op?'':uI('lock')}</button>`}
 h+='</div>';const n=OL,L=CEFRL[n-1],nx=uNext();
 h+=`<div class="card lvh"><div><h2>${L.c} · ${L.n}</h2><p class=mut>${L.d}</p></div><div class=bar><i style="width:${uLvPct(n)}%"></i></div><small class=mut>${uLvDone(n)} of ${lvCnt(n)*LPU} lessons · ${[...Array(lvCnt(n))].filter((_,i)=>S.ut[lvFirst(n)+i]>=PASS).length} of ${lvCnt(n)} unit tests</small></div>`;
 for(let ui=0;ui<lvCnt(n);ui++){const gu=lvFirst(n)+ui,done=LIDX.filter(i=>S.done[gu*LPU+i]!=null).length,cur=nx.k=='lesson'&&nx.l.gu==gu||nx.k=='ut'&&nx.gu==gu,open=UOPEN[gu]!==undefined?UOPEN[gu]:cur,allOK=S.ut[gu]>=PASS;
  h+=`<div class="card unit ${allOK?'ok':''}"><button type=button class=unit__h onclick="UOPEN[${gu}]=${open?0:1};draw()"><span class=unit__n>${allOK?uI('ok'):ui+1}</span><span class=unit__t><b>${esc(CURR[gu].t)}</b><small>${done} of ${LPU} lessons${S.ut[gu]!=null?' · test '+S.ut[gu]+'%':''}</small></span><i class="chev ${open?'up':''}"></i></button>`;
  if(open){h+='<div class=unit__b>';LIDX.forEach(li=>{const l=LM[gu*LPU+li],op=lessonOpen(l),dn=S.done[l.id]!=null,cu=nx.k=='lesson'&&nx.l.id==l.id,w=S.wb[l.id];
    h+=`<div class="ls ${dn?'dn':''} ${cu?'cu':''} ${op?'':'lock'}"><button type=button class=ls__m ${op?'':'disabled'} onclick="uOpen(${l.id})"><span class=ls__i>${dn?uI('ok'):op?uI('play'):uI('lock')}</span><span><b>Lesson ${l.n} · ${esc(l.t)}</b><small>${dn?'Passed '+S.done[l.id]+'%':op?(S.sec[l.id]?'Next: '+stepName(firstStep(l.id)):'Ready to start'):'Locked'}</small></span></button><button type=button class=ls__w ${dn?'':'disabled'} onclick="startWB(${l.id})" title="Workbook for Lesson ${l.n}">${uI('wordbook')}<span>Workbook${w!=null?' '+w+'%':''}</span></button></div>`});
   const ok=utOpen(gu);h+=`<div class="ls ut ${ok?'':'lock'} ${allOK?'dn':''}"><button type=button class=ls__m ${ok?'':'disabled'} onclick="startUT(${gu})"><span class=ls__i>${allOK?uI('ok'):ok?uI('tests'):uI('lock')}</span><span><b>Unit ${ui+1} Test</b><small>${allOK?'Passed '+S.ut[gu]+'%':ok?'20 questions · pass with 80%':'Finish the 5 lessons first'}</small></span></button></div></div>`}
  h+='</div>'}
 const ok=ltOpen(n);h+=`<div class="card exam ${ok?'':'lock'}"><button type=button class=ls__m ${ok?'':'disabled'} onclick="startLT(${n})"><span class=ls__i>${S.lt[n]>=PASS?uI('ok'):ok?uI('flag'):uI('lock')}</span><span><b>Final Level Exam · ${L.c}</b><small>${S.lt[n]>=PASS?'Passed '+S.lt[n]+'%':ok?'40 questions · pass with 80% to open the next level':'Pass all '+lvCnt(n)+' unit tests to unlock'}</small></span></button></div>`;
 return h}

/* ---------------- Lesson: one step at a time ---------------- */
const STEPIC=['spark','vocab','gram','headset','book','mic','pen','bolt','tests'];
const gRule=l=>{const rs=GR[l.gu].rules||[GR[l.gu]],i=rs.length==3?[0,0,1,2,2][l.n-1]:rs.length==2?[0,0,1,1,1][l.n-1]:0;return rs[i]||rs[0]};
function vLesson(){const l=LM[A];if(!l)return vLearn();const id=l.id,fs=firstStep(id);if(vLesson.last!==id){vLesson.last=id;P=fs}if(P>fs)P=fs;if(P<0)P=0;
 const dots=STEPIC.map((ic,i)=>{const dn=i<8?secBit(id,i):S.done[id]!=null,ok=i<=fs||S.done[id]!=null;return`<button type=button class="sd ${P==i?'on':''} ${dn?'dn':''}" ${ok?'':'disabled'} onclick="uStep(${id},${i})" aria-label="${stepName(i)}" ${P==i?'aria-current=step':''}>${dn?uI('ok'):uI(ic)}<small>${stepName(i)}</small></button>`}).join('<i class=sl></i>');
 const body=[lzIntro,lzWords,lzGram,lzListen,lzRead,lzSpeak,lzWrite,lzPractice,lzCheck][P](l);
 return`<button class=btn2 type=button onclick="OL=${l.lv};go('learn')">${uI('arrow','flip')} Back to my path</button><div class=lz-h><p class=hm-tag>Level ${CEFR(l.lv)} · Unit ${l.ui+1} · Lesson ${l.n} of ${LPU}</p><h1>${esc(l.t)}</h1></div><div class=steps>${dots}</div><div class=lz-b>${body}</div>`}
const nxtBtn=(id,i,t)=>`<button type=button class=btnp onclick="uDone(${id},${i})">${t||'Next'} ${uI('arrow')}</button>`;
function lzIntro(l){const r=gRule(l),first=l.w.slice(0,4).map(w=>`<b>${esc(w.en)}</b>`).join(', ');
 return`<div class="card lz-card"><h2>What you will do today</h2><ul class=goals><li>${uI('vocab')}<span>Learn <b>${l.w.length} new words</b>: ${first} and more.</span></li><li>${uI('gram')}<span>Understand the grammar: <b>${esc(r.t)}</b>.</span></li><li>${uI('headset')}<span>Listen, read, speak and write about <b>${esc(l.t.toLowerCase())}</b>.</span></li><li>${uI('tests')}<span>Finish with a short check. You need <b>80%</b>.</span></li></ul><p class=mut>About 15 to 20 minutes. Your progress is saved after every step.</p>${nxtBtn(l.id,0,"Let's start")}</div>`}
function lzWords(l){const id=l.id;
 return`<div class=wgrid>${l.w.map(w=>{const ex=exFor(w,l);return`<div class="card wcard">${typeof wpic=='function'?wpic(w.en,1):''}<h2>${esc(w.en)}</h2><div class=wsay>${sayB(w.en)}</div><p class=wa dir=rtl lang=ar>${esc(w.ar||'')}</p>${w.d?`<p class=wd>${esc(w.d)}</p>`:''}${ex?`<p class=wex><small>Example</small>“${esc(ex)}”<span>${sayB(ex)}</span></p>`:''}</div>`}).join('')}</div>
 <div class="card lz-card"><p class=mut>Listen to every word, then check what you learned.</p><button type=button class=btnp onclick="startSec(${id},1)">${secBit(id,1)?'Check again':'Check my words'} ${uI('arrow')}</button>${secBit(id,1)?`<button type=button class=btn2 onclick="uStep(${id},2)">Go to grammar</button>`:''}</div>`}
function lzGram(l){const id=l.id,r=gRule(l),n=l.n;let b='';
 const exs=r.x.map(x=>`<li>${esc(x)}${sayB(x)}</li>`).join(''),mis=r.m?`<div class=mis><p class=no>${uI('no')} ${esc(r.m[0])}</p><p class=yes>${uI('ok')} ${esc(r.m[1])}</p></div>`:'';
 const rule=`<h2>${esc(r.t)}</h2><p class=formula>${esc(r.f)}</p><p>${esc(r.e)}</p>${r.a?`<p class=wa dir=rtl lang=ar>${esc(r.a)}</p>`:''}`;
 if(n==1)b=`<div class="card lz-card">${rule}</div>`;
 else if(n==2)b=`<div class="card lz-card">${rule}<h3>Examples</h3><ul class=exs>${exs}</ul></div>`;
 else if(n==3)b=`<div class="card lz-card"><h2>${esc(r.t)}</h2><p class=formula>${esc(r.f)}</p><h3>A common mistake</h3>${mis}<h3>Examples</h3><ul class=exs>${exs}</ul></div>`;
 else if(n==4)b=`<div class="card lz-card">${rule}<h3>See it in your lesson</h3><p>${esc(l.ss[0]||'')}${l.ss[0]?sayB(l.ss[0]):''}</p></div>`;
 else b=`<div class="card lz-card">${rule}<h3>Examples</h3><ul class=exs>${exs}</ul>${mis}</div>`;
 return b+`<div class="card lz-card"><p class=mut>Try three short questions about this rule.</p><button type=button class=btnp onclick="startSec(${id},2)">${secBit(id,2)?'Practise again':'Practise the rule'} ${uI('arrow')}</button>${secBit(id,2)?`<button type=button class=btn2 onclick="uStep(${id},3)">Go to listening</button>`:''}</div>`}
function lzListen(l){const id=l.id;return`<div class="card lz-card"><h2>Listening</h2><p>You will hear sentences about <b>${esc(l.t.toLowerCase())}</b>. Choose what you hear, then write one sentence.</p><p>${l.ds[0]||l.ss[0]?sayB(l.ds[0]||l.ss[0],' Sample'):''}</p><button type=button class=btnp onclick="startSec(${id},3)">${secBit(id,3)?'Listen again':'Start listening'} ${uI('arrow')}</button>${secBit(id,3)?`<button type=button class=btn2 onclick="uStep(${id},4)">Go to reading</button>`:''}</div>`}
function lzRead(l){const id=l.id;return`<div class="card lz-card"><h2>Reading</h2><p class=rd>${esc(l.r)}</p><div class=rdb>${sayB(l.r,' Listen')}</div>${typeof nlLine=='function'?nlLine(l.r):''}<button type=button class=btnp onclick="startSec(${id},4)">${secBit(id,4)?'Answer again':'Answer 3 questions'} ${uI('arrow')}</button>${secBit(id,4)?`<button type=button class=btn2 onclick="uStep(${id},5)">Go to speaking</button>`:''}</div>`}
function lzSpeak(l){if(secBit(l.id,5))return`<div class="card lz-card"><h2>Speaking done</h2><p>Well done. You spoke about this lesson.</p><button type=button class=btnp onclick="uStep(${l.id},6)">Go to writing ${uI('arrow')}</button><button type=button class=btn2 onclick="SPK=null;setSecOff(${l.id},5);uStep(${l.id},5)">Speak again</button></div>`;return vSpeak(l)}
const setSecOff=(id,i)=>{S.sec[id]=(S.sec[id]||0)&~(1<<i);save()};
function spkEnd(l){const id=l.id,qs=l.q.slice(0,3);
 return`<div class="card lz-card"><h2>Now answer aloud</h2><p class=mut>Say each answer in a full sentence. Then open the model answer to compare.</p>${qs.map((q,i)=>`<div class=ans><p><b>${i+1}. ${esc(q[0])}</b></p><button type=button class=btn2 onclick="this.nextElementSibling.hidden=false;this.hidden=true">Show a model answer</button><p hidden class=model>${esc(q[1])}.${sayB(q[1])}</p></div>`).join('')}<button type=button class=btnp onclick="uDone(${id},5)">I spoke my answers ${uI('arrow')}</button></div>`}
const WMIN=[12,28,55,90,140],WSENT=[2,3,4,6,8];
function lzWrite(l){const id=l.id,n=l.lv-1,ws=l.w.slice(0,4).map(w=>w.en).join(', ');
 if(secBit(id,6))return`<div class="card lz-card"><h2>Writing done</h2><p>Compare your idea with this model text:</p><p class=rd>${esc(l.r)}</p><button type=button class=btnp onclick="uStep(${id},7)">Go to practice ${uI('arrow')}</button><button type=button class=btn2 onclick="setSecOff(${id},6);uStep(${id},6)">Write again</button></div>`;
 return`<div class="card lz-card"><h2>Writing</h2><p>${l.lv==1?'Write short sentences':'Write a short text'} about <b>${esc(l.t.toLowerCase())}</b>. Use at least <b>2</b> of these words: <b>${esc(ws)}</b>.</p><p class=mut>Write at least ${WMIN[n]} words in ${WSENT[n]} or more sentences. Start each sentence with a capital letter and end it with a full stop.</p><textarea id=wt rows=6 placeholder="Write here..." maxlength=1500 oninput="uWC()"></textarea><p class=mut id=wc>0 words</p><div id=wfb></div><button type=button class=btnp onclick="uWrite(${id})">Check my writing ${uI('arrow')}</button></div>`}
function uWC(){const t=$('#wt').value,n=(t.match(/[A-Za-z']+/g)||[]).length;$('#wc').textContent=n+' word'+(n==1?'':'s')}
function uWrite(id){const l=LM[id],t=($('#wt').value||'').trim(),words=t.match(/[A-Za-z']+/g)||[],n=l.lv-1,low=t.toLowerCase();
 const used=l.w.filter(w=>{const b=w.en.toLowerCase().split(' ')[0].replace(/(ing|ed|es|s|e)$/,'');return b.length>2&&new RegExp('\\b'+b).test(low)||low.includes(w.en.toLowerCase())}).length,sn=(t.match(/[.!?](\s|$)/g)||[]).length,caps=t.split(/(?<=[.!?])\s+/).filter(Boolean).every(s=>/^[A-Z]/.test(s));
 const ck=[[words.length>=WMIN[n],`At least ${WMIN[n]} words (you wrote ${words.length})`],[sn>=WSENT[n],`At least ${WSENT[n]} sentences (you wrote ${sn})`],[used>=2,`Use 2 or more words from the lesson (you used ${used})`],[caps&&words.length>0,'Every sentence starts with a capital letter']],ok=ck.every(x=>x[0]);
 const t2=S.sk.Writing=S.sk.Writing||[0,0];t2[1]++;if(ok)t2[0]++;
 if(ok){const e=XS();e.wr.unshift({k:l.t.slice(0,30),t:t.slice(0,700),d:today(),n:100});e.wr=e.wr.slice(0,15)}save();
 $('#wfb').innerHTML=`<ul class=ck>${ck.map(x=>`<li class="${x[0]?'ok':'no'}">${x[0]?uI('ok'):uI('no')}<span>${x[1]}</span></li>`).join('')}</ul>${ok?`<p class=okp>${uI('ok')} Great writing!</p><button type=button class=btnp onclick="uDone(${id},6)">Next ${uI('arrow')}</button>`:'<p class=mut>Fix the red points and check again.</p>'}`}
function lzPractice(l){const id=l.id;return`<div class="card lz-card"><h2>Practice</h2><p>Eight mixed questions: words, grammar, listening and sentences. They are made from this lesson only.</p><button type=button class=btnp onclick="startSec(${id},7)">${secBit(id,7)?'Practise again':'Start practice'} ${uI('arrow')}</button>${secBit(id,7)?`<button type=button class=btn2 onclick="uStep(${id},8)">Go to the lesson check</button>`:''}</div>`}
function lzCheck(l){const id=l.id,fs=firstStep(id),dn=S.done[id]!=null;
 return`<div class="card lz-card"><h2>Lesson check</h2><p>Answer 14 questions about this lesson. You need <b>80%</b> to finish it and open the next lesson.</p>${dn?`<p class=okp>${uI('ok')} Passed with ${S.done[id]}%</p>`:''}<button type=button class=btnp onclick="startLesson(${id})">${dn?'Take it again':'Start the check'} ${uI('arrow')}</button><button type=button class=btn2 onclick="S.fav[${id}]=${S.fav[id]?0:1};save();draw()">${S.fav[id]?'Saved':'Save lesson'}</button></div>${dn?wbCard(l):''}`}
const wbCard=l=>`<div class="card lz-card wbc"><h2>${uI('wordbook')} Workbook for Lesson ${l.n}</h2><p class=mut>Fun exercises made only for this lesson. ${S.wb[l.id]!=null?'Your best score: '+S.wb[l.id]+'%':'Try it now or later from your path.'}</p><button type=button class=btng onclick="startWB(${l.id})">Open the workbook ${uI('arrow')}</button></div>`;

/* ---------------- quiz runners for the new steps ---------------- */
const clz=(l,k)=>{const ws=sh(l.w.filter(w=>!/\s/.test(w.en)));for(const w of ws){const re=new RegExp('\\b'+w.en.replace(/[^a-z']/gi,'')+'\\b','i'),s=l.ss.find(x=>re.test(x)&&wc(x)>=4);if(s){const o=sh([w.en,...sh(ALL.filter(a=>a.en!=w.en&&!/\s/.test(a.en)&&a.en.length>2)).slice(0,3).map(a=>a.en)]);return{q:'Fill the blank: '+s.replace(re,'___')+'.',k:'Vocabulary',o,a:w.en,say:s}}}return null};
const gq=(l,k)=>{const r=gRule(l);return r.q.slice(0,k||3).map(q=>({q:q[0],k:'Grammar',gr:r,o:sh(q.slice(1)),a:q[1]}))};
function startSec(id,i){const l=LM[id];POOL=lvWords(l.lv);let qs;
 if(i==1)qs=sh(l.w).map(mc);
 else if(i==2)qs=gq(l,3);
 else if(i==3)qs=[...sh(l.l).slice(0,3).map(lsq),dsq(dsOf(l))];
 else if(i==4)qs=[0,1,2].map(k=>rdq(l,k));
 else qs=sh([...sh(l.w).slice(0,3).map(mc),clz(l)||mc(l.w[0]),...gq(l,2),lsq(rnd(l.l)),ordQ(l.s),rdq(l,Math.random()*3|0)]);
 const need=i==7?60:67;
 runQuiz(qs,SEC[i][1]+' · '+l.t,pct=>{const ok=pct>=need;if(ok){setSec(id,i);S.days[today()]=S.days[today()]||0;save()}
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!',SEC[i][1]+' complete.'):'<p>Not yet. Look at the tutor notes, then try again. You can do it.</p>'}<button class=btnp onclick="uStep(${id},${ok?i+1:i})">${ok?'Next: '+stepName(i+1):'Try again'} ${uI('arrow')}</button> <button class=btn2 onclick="uStep(${id},${i})">Back to the step</button>`})}
function startLesson(id){const l=LM[id];POOL=lvWords(l.lv);
 const qs=sh([...sh(l.w).map(mc),tw(l.w[2]),lsq(rnd(l.l)),lsq(rnd(l.l)),dsq(dsOf(l)),ordQ(l.s),rdq(l,0),rdq(l,1),...gq(l,2)]);
 runQuiz(qs,'Lesson check · '+l.t,pct=>{const ok=pct>=PASS;if(ok){S.done[id]=Math.max(S.done[id]||0,pct);S.sec[id]=255;S.days[today()]=(S.days[today()]||0)+1;l.w.forEach(w=>{if(!S.vocab[w.en])S.vocab[w.en]={ar:w.ar,box:0,due:Date.now(),t:Date.now()}});save()}
  const last=l.n==LPU,nx=ok?(last?`<button class=btnp onclick="startUT(${l.gu})">Take the Unit ${l.ui+1} test ${uI('arrow')}</button>`:`<button class=btnp onclick="uOpen(${id+1})">Next lesson ${uI('arrow')}</button>`):'';
  return`<h1>${pct}%</h1>${ok?cele('Lesson passed'+nmS()+'!','The next part is open. Your words were added to Review.'):`<p>You need 80% to pass. Read the tutor notes and try again. Your steps are saved.</p>`}${nx}${ok?`<button class=btng onclick="startWB(${id})">${uI('wordbook')} Workbook for Lesson ${l.n}</button>`:''} <button class=btn2 onclick="uStep(${id},${ok?8:0})">Back to lesson</button> <button class=btn2 onclick="OL=${l.lv};go('learn')">My path</button>`})}
function startUT(gu){if(needTest())return;const n=lvOf(gu),lz=LS.filter(l=>l.gu==gu);POOL=lvWords(n);const ws=sh(lz.flatMap(l=>l.w)),r=GR[gu];
 runQuiz(sh([...ws.slice(0,6).map(mc),...ws.slice(6,8).map(tw),...lz.map(l=>lsq(rnd(l.l))),...lz.map(l=>rdq(l,Math.random()*3|0)),...sh(lz).slice(0,2).map(l=>dsq(dsOf(l))),...sh(lz).slice(0,2).map(l=>ordQ(l.s)),...gq(lz[0],3)]).slice(0,20),'Unit '+(unOf(gu)+1)+' test',pct=>{const ok=pct>=PASS;S.ut[gu]=Math.max(S.ut[gu]||0,pct);if(ok)S.days[today()]=(S.days[today()]||0)+1;save();
  return`<h1>${pct}%</h1>${ok?cele('Unit complete'+nmS()+'!','Unit '+(unOf(gu)+1)+' passed. '+(unOf(gu)<lvCnt(n)-1?'The next unit is open.':'The Final Level Exam is open.')):`<p>You need 80%. Review your mistakes (the tutor explained each one), then take the test again.</p>`}<button class=btnp onclick="${ok?"OL="+n+";go('learn')":'startUT('+gu+')'}">${ok?'My path':'Try again after review'}</button> <button class=btn2 onclick="OL=${n};go('learn')">My path</button>`})}
function startLT(n){if(needTest())return;POOL=lvWords(n);const lz=LS.filter(l=>l.lv==n),ws=sh(POOL),pb=[...PB].sort((a,b)=>Math.abs(a[0]-fineOf(n))-Math.abs(b[0]-fineOf(n))||Math.random()-.5).slice(0,4).map(pbQ),R=()=>rnd(lz),G=()=>{const gu=lvFirst(n)+(Math.random()*lvCnt(n)|0);return gq(LS.find(l=>l.gu==gu&&l.n==1+(Math.random()*LPU|0))||LS.find(l=>l.gu==gu),1)[0]};
 runQuiz(sh([...ws.slice(0,10).map(mc),...ws.slice(10,14).map(tw),...Array.from({length:6},()=>lsq(rnd(R().l))),...Array.from({length:6},()=>rdq(R(),Math.random()*3|0)),...Array.from({length:4},()=>dsq(dsOf(R()))),...Array.from({length:4},()=>ordQ(R().s)),...Array.from({length:6},G),...pb]).slice(0,40),'Final Level Exam · '+CEFR(n),pct=>{const ok=pct>=PASS;S.lt[n]=Math.max(S.lt[n]||0,pct);if(ok){S.days[today()]=(S.days[today()]||0)+1;if(!S.cid[n])S.cid[n]='EF-L'+n+'-'+Math.random().toString(36).slice(2,8).toUpperCase()}save();
  return`<h1>${pct}%</h1>${ok?cele('Level complete'+nmS()+'!',n<NLV?'You finished '+CEFR(n)+'. '+CEFR(n+1)+' is open now.':'You finished the whole course!'):`<p>You need 80%. Review the units you found hard, then try again.</p>`}${ok?`<button class=btnp onclick="go('cert',${n})">View my certificate</button>`:''} <button class=btn2 onclick="OL=${ok&&n<NLV?n+1:n};go('learn')">My path</button>`})}

/* ---------------- Workbook for every lesson ---------------- */
function wbQs(l){POOL=lvWords(l.lv);const ws=sh(l.w),sn=sh(l.ss.filter(s=>wc(s)>=4)),tf=l.q.map((q,i)=>{const t=i%2==0;const claim=t?q[1]:q[2+(i%3)];return{q:`True or false?  “${q[0]}”  Answer: ${claim}.`,k:'Reading',r:l.r,p:esc(l.r),o:['True','False'],a:t?'True':'False'}});
 return sh([...ws.slice(0,3).map(mc),...ws.slice(3,5).map(tw),clz(l)||mc(ws[0]),clz(l)||mc(ws[1]),...sn.slice(0,2).map(ordQ),dsq(dsOf(l)),...tf.slice(0,2)]).filter(Boolean)}
function startWB(id){const l=LM[id];if(S.done[id]==null){return}
 runQuiz(wbQs(l),'Workbook · Lesson '+l.n,pct=>{S.wb[id]=Math.max(S.wb[id]||0,pct);S.days[today()]=S.days[today()]||0;save();
  return`<h1>${pct}%</h1>${cele(pct>=60?'Nice work'+nmS()+'!':'Good practice'+nmS()+'!',pct>=60?'Workbook for Lesson '+l.n+' complete.':'Try the workbook again to improve your score.')}<button class=btnp onclick="startWB(${id})">${uI('wordbook')} Do it again</button> <button class=btn2 onclick="OL=${l.lv};go('learn')">My path</button> <button class=btn2 onclick="go('workbooks')">All workbooks</button>`})}
function vWorkbooks(){const cl=curLevel();let h='<h1>WORKBOOKS</h1><p class=mut>Every lesson has its own workbook. It opens when you pass the lesson check.</p>';
 for(let n=1;n<=NLV;n++){if(!lvOpen(n))continue;h+=`<h2 class=wbh>${CEFR(n)} · ${CEFRL[n-1].n}</h2>`;
  for(let ui=0;ui<lvCnt(n);ui++){const gu=lvFirst(n)+ui;h+=`<div class="card"><b>Unit ${ui+1} · ${esc(CURR[gu].t)}</b>`+LIDX.map(li=>{const l=LM[gu*LPU+li],dn=S.done[l.id]!=null,w=S.wb[l.id];return`<button type=button class="row ${dn?'':'lock'}" ${dn?'':'disabled'} onclick="startWB(${l.id})"><span>${dn?uI('wordbook'):uI('lock')} Workbook for Lesson ${l.n} · ${esc(l.t)}</span><b>${w!=null?w+'%':dn?'Open':''}</b></button>`}).join('')+'</div>'}}
 return h}

/* ---------------- Tests, schedule ---------------- */
function vTests(){const cl=curLevel();let h='<h1>TESTS</h1>';
 h+=`<div class=card><h2>${uI('flag')} Placement test</h2><p class=mut>${S.test?'Your last result: '+CEFR(S.test.lvl)+' on '+S.test.date+'.':'Finds your real level from A1 to C1.'}</p><button class=btnp type=button onclick="go('test')">${S.placed?'Retake the placement test':'Start the placement test'}</button></div>`;
 h+=`<h2 class=wbh>Unit tests · ${CEFR(cl)}</h2><div class=card>`+Array.from({length:lvCnt(cl)},(_,ui)=>{const gu=lvFirst(cl)+ui,ok=utOpen(gu),p=S.ut[gu];return`<button type=button class="row ${ok?'':'lock'}" ${ok?'':'disabled'} onclick="startUT(${gu})"><span>${p>=PASS?uI('ok'):ok?uI('tests'):uI('lock')} Unit ${ui+1} · ${esc(CURR[gu].t)}</span><b>${p!=null?p+'%':''}</b></button>`}).join('')+'</div>';
 const ok=ltOpen(cl);h+=`<div class="card"><button type=button class="row ${ok?'':'lock'}" ${ok?'':'disabled'} onclick="startLT(${cl})"><span>${S.lt[cl]>=PASS?uI('ok'):ok?uI('flag'):uI('lock')} Final Level Exam · ${CEFR(cl)}</span><b>${S.lt[cl]!=null?S.lt[cl]+'%':''}</b></button></div>`;return h}
function vSchedule(){const d=lvDay(curLevel()),g=S.set.goal||1,t=S.days[today()]||0,wk=Object.keys(S.days).filter(k=>Date.parse(today())-Date.parse(k)<7*864e5&&S.days[k]).length;
 return`<h1>SCHEDULE</h1><div class=card><h2>${uI('calendar')} Your plan</h2><p>Plan: finish each level in about <b>${PACE} days</b>${d?` · you are on <b>day ${d}</b>`:''}. That is about two lessons every three days.</p><p class=mut>Daily goal: ${Math.min(t,g)} of ${g} quizzes today · ${wk} study day${wk==1?'':'s'} in the last 7 days.</p><button class=btn2 type=button onclick="SETP='tools';go('settings')">Change goals and reminders</button></div>${cal()}`}

/* ---------------- My Progress = profile + where you are + what is next ---------------- */
function vProgress(){const cl=curLevel(),nx=uNext(),t=uNextTxt(nx),pc=uPct(),C=isC(USER);
 const tests=[...Object.values(S.ut),...Object.values(S.lt)],avg=tests.length?Math.round(tests.reduce((a,b)=>a+b,0)/tests.length):0,
 d=lvDay(cl),exp=Math.min(100,Math.round(((d||1)/PACE)*100)),lp=uLvPct(cl),
 verdict=!doneN()?{c:'ok',t:'Welcome! Your first lesson is waiting.',s:'Start today and keep a small daily habit.'}:lp>=exp+10?{c:'ok',t:'You are ahead of the plan. Excellent!',s:'Keep this pace and you will finish early.'}:lp>=exp-10?{c:'ok',t:'You are on track.',s:'A little every day is the secret.'}:{c:'no',t:'You need more study time.',s:'Try one extra lesson each day to catch up with the plan.'},
 lvl=pc>=75?'Very advanced':pc>=40?'Good progress':pc>=10?'Getting started':'Just beginning';
 const skill=(n,k)=>{const x=S.sk[k]||[0,0],p=x[1]?Math.round(x[0]/x[1]*100):0;return`<div class=skm><span>${n}</span><div class=bar><i style="width:${p}%"></i></div><b>${x[1]?p+'%':'–'}</b></div>`};
 const gm=Object.entries(S.gw||{}).sort((a,b)=>b[1]-a[1]).slice(0,3),weak=[['Listening',S.sk.Listening],['Speaking',S.sk.Speaking],['Reading',S.sk.Reading],['Writing',S.sk.Writing]].filter(x=>x[1]&&x[1][1]>=4&&x[1][0]/x[1][1]<.7).map(x=>x[0]);
 const earned=Array.from({length:NLV},(_,i)=>i+1).filter(n=>S.lt[n]>=PASS),gr=Object.keys(S.gr).length,
 ach=[['First lesson',doneN()>=1],['10 lessons',doneN()>=10],['25 lessons',doneN()>=25],['First unit test',Object.values(S.ut).some(v=>v>=PASS)],['25 words learned',Object.keys(S.vocab).length>=25],['100 words learned',Object.keys(S.vocab).length>=100],['First workbook',Object.keys(S.wb).length>=1],['A level finished',earned.length>=1]];
 return`<h1>MY PROGRESS</h1>
 <div class="card prof"><img src=avatar.jpg alt="" width=72 height=72><div class=prof__i><h2>${uName()}</h2><p class=mut>Username: <b>@${esc(C?UNAME():USER||'guest')}</b></p>${C?`<p class=mut>Email: <b>${esc(EMAIL||'')}</b></p><p class=mut>Password: <b>••••••••</b> <button type=button class=lnk onclick="SETP='acct';go('settings')">Change</button></p>`:`<p class=mut>${isG(USER)?'Guest: progress is saved on this device.':'Saved on this device.'}</p>`}</div><button type=button class=btn2 onclick="go('settings')">${uI('gear')} Settings</button></div>
 <div class="card nextc"><p class=hm-tag>Study next</p><h2>${esc(t.t)}</h2><p class=mut>${esc(t.s)}</p><button type=button class=btnp onclick="${t.a}">${uI('tri')} ${esc(t.b)}</button></div>
 <div class="card verd ${verdict.c}"><h2>${uI(verdict.c=='ok'?'ok':'alert')} ${verdict.t}</h2><p>${verdict.s}</p><p class=mut>Your stage: <b>${lvl}</b> · ${CEFR(cl)} ${CEFRL[cl-1].n}${d?' · day '+d+' of '+PACE:''}</p></div>
 <div class=pgrid><div class=card><h3>Overall</h3><div class=ring3 style="--p:${pc}"><b>${pc}%</b></div><p class=mut>${doneN()} of ${LS.length} lessons</p></div>
 <div class=card><h3>Numbers</h3><ul class=nums><li><b>${CEFR(cl)}</b><span>Current level</span></li><li><b>${LS.filter(l=>S.ut[l.gu]>=PASS&&l.n==1).length}</b><span>Units completed</span></li><li><b>${doneN()}</b><span>Lessons completed</span></li><li><b>${avg}%</b><span>Average test score</span></li><li><b>${Object.keys(S.vocab).length}</b><span>Words learned</span></li><li><b>${gr}</b><span>Grammar rules practised</span></li></ul></div></div>
 <div class=card><h3>Your four skills</h3>${skill('Listening','Listening')}${skill('Speaking','Speaking')}${skill('Reading','Reading')}${skill('Writing','Writing')}${weak.length?`<p class=mut>To improve: <b>${weak.join(', ')}</b>.</p>`:''}${gm.length?`<p class=mut>Grammar to review: ${gm.map(x=>'<b>'+esc(x[0].split(':')[0])+'</b>').join(', ')}.</p>`:''}<button type=button class=btn2 onclick="go('review')">${uI('review')} Smart review</button>${gm.length?`<button type=button class=btn2 onclick="startGW()">${uI('gram')} Practise weak grammar</button>`:''}${doneN()>=5?`<button type=button class=btn2 onclick="startRV()">${uI('flag')} Review checkpoint</button>`:''}</div>
 <div class=card><h3>Levels and certificates</h3>${Array.from({length:NLV},(_,i)=>{const n=i+1,ok=S.lt[n]>=PASS;return`<div class=lvr><span class=lvr__c>${CEFR(n)}</span><div><b>${CEFRL[n-1].n}</b><div class=bar><i style="width:${uLvPct(n)}%"></i></div></div>${ok?`<button type=button class=btng onclick="go('cert',${n})">${uI('cert')} Certificate</button>`:`<small class=mut>${lvOpen(n)?uLvPct(n)+'%':'Locked'}</small>`}</div>`}).join('')}<p class=mut>${earned.length} of ${NLV} certificates earned · ${NLV-earned.length} still to go.</p></div>
 <div class=card><h3>Achievements</h3><div class=achs>${ach.map(a=>`<span class="ach ${a[1]?'on':''}">${a[1]?uI('medal'):uI('lock')}${a[0]}</span>`).join('')}</div></div>`}

/* ---------------- smart review: weak grammar + checkpoints ---------------- */
function startGW(){const ent=Object.entries(S.gw||{}).sort((a,b)=>b[1]-a[1]).slice(0,3),rules=GR.flatMap(g=>g.rules||[]);let qs=[];
 ent.forEach(e=>{const r=rules.find(x=>String(x.t).slice(0,90)==e[0]);if(r)qs=qs.concat(r.q.map(q=>({q:q[0],k:'Grammar',gr:r,o:sh(q.slice(1)),a:q[1]})))});
 if(!qs.length){go('review');return}
 runQuiz(sh(qs).slice(0,9),'Weak grammar practice',pct=>{if(pct>=80)ent.forEach(e=>{S.gw[e[0]]=Math.max(0,(S.gw[e[0]]||0)-2);if(!S.gw[e[0]])delete S.gw[e[0]]});save();return`<h1>${pct}%</h1>${pct>=80?cele('Better'+nmS()+'!','These rules are getting stronger.'):'<p>Keep practising. The tutor notes explain each rule.</p>'}<button class=btnp onclick="go('progress')">My progress</button>`})}
