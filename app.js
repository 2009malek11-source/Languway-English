/* LanguWay English: application logic (vanilla JS, no build step).
   Load order (see index.html): supabase-config.js, supabase SDK, levels.js + lv01-20.js (lesson content),
   grammar*.js (80 rules), videos.js, defs.js (English word definitions), stories.js (Cedar City episodes), story.js (story player), then this file.
   Sections, in order:
     1. Course layout     30 levels, units, lessons, content loader (OLDC -> CT, LS, LM)
     2. State             DEF, clean() validation + migration, mergeS() conflict-free merge, save/persist
     3. Accounts + cloud  Supabase auth (signup edge function), guest mode, sync
     4. Access rules      what is open: lvOpen, lessonOpen, utOpen, ltOpen, pacing (14 days/level)
     5. Home / Learn map  todo(), vHome, lvBody, vLearn
     6. Helper            offline rule-based assistant (hAns)
     7. Lessons + quizzes sections, quiz builders (mc, tw, dsq, lsq, rdq, ordQ), tutor(), unit/level/review tests
     8. Grammar           posters, parts, practice
     9. Placement test    adaptive Bayesian estimate over the 30-level scale
    10. Progress, certificates, settings, install/share, splash
   Tests: every release is checked with a node harness (6000+ assertions) and real-browser (Playwright) runs. */
const LV=[];[['Beginner',4],['Elementary',6],['Intermediate',8],['Upper-Intermediate',7],['Advanced',5]].forEach(b=>{for(let i=1;i<=b[1];i++)LV.push(b[0]+' '+i)});
/* Course layout: 30 levels. Levels 1-20 have 2 units, levels 21-30 have 4 units. Every unit has 3 lessons.
   'gu' is the global unit number (0-79) and never changes; lesson id = gu*3 + lesson index. */
const OLDC=window.CONTENT||{},DEFS=window.DEFS||{},NLV=30,PACE=14;
const lvFirst=n=>n<=20?(n-1)*2:40+(n-21)*4,lvCnt=n=>n<=20?2:4,lvOf=gu=>gu<40?(gu>>1)+1:21+((gu-40)>>2),unOf=gu=>gu-lvFirst(lvOf(gu));
const CT={};Object.keys(OLDC).forEach(k=>{const o=+k,u=OLDC[k];if(o<=10){CT[2*o-1]=u.slice(0,2);CT[2*o]=u.slice(2,4)}else CT[o+10]=u});
/* Placement bank: [level, question, options or '' for typed, answer, optional passage] */
const PB=[[1,'I ___ a student.','am|is|are|be','am'],[1,'Which word is a number?','three|house|blue|water','three'],[2,'She ___ coffee every morning.','drinks|drink|drinking|drank','drinks'],[2,'There ___ three books on the table.','are|is|am|be','are'],[3,'What time ___ you get up?','do|does|are|is','do'],[3,'This is ___ apple.','an|a|the|some','an'],[4,'Yesterday we ___ to the market.','went|go|goes|going','went'],[4,'My sister is ___ than me.','taller|tall|tallest|more tall','taller'],[5,'I ___ TV when the phone rang.','was watching|watched|am watching|watch','was watching'],[5,'How ___ water do you drink a day?','much|many|few|any','much'],[6,'If it rains, we ___ at home.','will stay|stay|stayed|would stay','will stay'],[6,'I have lived here ___ 2019.','since|for|during|from','since'],[7,'She has ___ finished her homework.','already|yet|since|ago','already'],[7,'The book ___ by millions of people.','was read|read|reading|has read','was read'],[8,'I wish I ___ more time.','had|have|has|will have','had'],[8,'He is used to ___ early.','getting up|get up|got up|gets up','getting up'],[9,'Why did Omar stop buying lunch?','To save money|He disliked the food|He was ill|His school closed','To save money','Omar wanted to save money, so he stopped buying lunch at school and brought food from home. After six months he had enough to buy a bicycle.'],[9,'By the time we arrived, the film ___.','had started|started|has started|was starting','had started'],[10,'Neither of the answers ___ correct.','is|are|were|be','is'],[10,'Write the past participle of “write”.','','written'],[11,'She suggested ___ a taxi.','taking|to take|take|took','taking'],[11,'Hardly ___ the door when the phone rang.','had he opened|he opened|did he open|he had opened','had he opened'],[12,'The meeting was cancelled ___ the manager’s illness.','owing to|despite|unless|whereas','owing to'],[12,'Choose the closest meaning of “reluctant”.','unwilling|eager|careful|tired','unwilling'],[13,'What do critics say about the policy?','It shifted the problem elsewhere|It removed traffic completely|It was never applied|It shortened commutes','It shifted the problem elsewhere','Although the new policy was meant to reduce traffic, critics argue that it merely moved congestion to neighbouring districts, where residents now face longer commutes.'],[13,'Had I known, I ___ differently.','would have acted|would act|had acted|acted','would have acted'],[14,'Choose the synonym of “meticulous”.','careful|careless|quick|rude','careful'],[14,'Not only ___ late, but he also forgot the files.','was he|he was|is he|he is','was he'],[15,'The evidence is ___; no one can deny it.','irrefutable|ambiguous|trivial|dubious','irrefutable'],[15,'She is said ___ in three languages.','to be fluent|being fluent|that fluent|be fluent','to be fluent'],[16,'His speech was full of ___: it said a lot but meant little.','platitudes|insights|statistics|anecdotes','platitudes'],[16,'By next year she ___ here for a decade.','will have worked|will work|has worked|works','will have worked'],[17,'What is the author’s real attitude?','Critical|Admiring|Neutral|Confused','Critical','The author’s irony is subtle: while ostensibly praising the committee’s diligence, each compliment exposes another failure of its judgement.'],[17,'Write the noun form of “persuade”.','','persuasion'],[18,'Were it not for his support, the project ___.','would have collapsed|collapsed|will collapse|has collapsed','would have collapsed'],[18,'Choose the closest meaning of “ephemeral”.','short-lived|ancient|valuable|hidden','short-lived'],[19,'The politician’s answer was deliberately ___, avoiding any firm commitment.','equivocal|candid|emphatic|forthright','equivocal'],[19,'Seldom ___ such dedication.','does one see|one sees|one does see|sees one','does one see'],[20,'The theory, though elegant, remains ___ by empirical evidence.','unsubstantiated|corroborated|exemplified|verified','unsubstantiated'],[20,'Write the adjective formed from “ubiquity”.','','ubiquitous']];
const G=[['He ___ to school every day.',['go','goes','going','gone'],'goes'],['She ___ a teacher.',['am','are','is','be'],'is'],['They ___ reading now.',['is','am','are','be'],'are'],['I ___ not understand.',['do','does','is','am'],'do'],['There ___ two books on the table.',['is','are','am','be'],'are'],['Yesterday I ___ to the market.',['go','goes','went','going'],'went']];

const MAXW={1:9,2:9,3:9,4:10,5:12,6:13,7:15,8:17,9:18,10:20};for(let i=11;i<=20;i++)MAXW[i]=20;
const wc=s=>s.split(/\s+/).filter(Boolean).length;
const sents=t=>(t.match(/[^.!?]+[.!?]+/g)||[]).map(s=>s.trim());
const parseL=s=>{const m=s.match(/\[([^\]]+)\]/),o=m[1].split('|');return{a:s.replace(m[0],o[0]),o:o.map(x=>s.replace(m[0],x))}};
const LS=[],LM={};
Object.keys(OLDC).forEach(k=>{const ok=+k;OLDC[k].forEach((u,uo)=>u[1].forEach((l,li)=>{const gu=(ok-1)*4+uo,n=lvOf(gu),ui=unOf(gu),ss=sents(l.r).map(s=>s.replace(/[.!?]+$/,'')),ds=ss.filter(s=>wc(s)>=4&&wc(s)<=(MAXW[ok]||20)),o={id:gu*3+li,lv:n,gu,ui,n:li+1,ut:u[0],t:l.t,w:l.v.split(';').map(x=>{const p=x.split('|');return{en:p[0],ar:p[1],d:DEFS[p[0]]||''}}),r:l.r,ss,ds,q:l.q,l:l.l.map(parseL),s:ds[0]||ss[0]};LS.push(o);LM[o.id]=o}))});
const ALL=LS.flatMap(l=>l.w);let POOL=ALL,OL=0;
const lvWords=n=>LS.filter(l=>l.lv==n).flatMap(l=>l.w);
/* ---------- State ---------- */
const DEF=()=>({cid:{},sec:{},gr:{},ver:3,ls:{},rv:0,sty:{},start:0,ut:{},lt:{},placed:0,sk:{},done:{},vocab:{},mist:[],days:{},fav:{},test:null,upd:0,rst:0,set:{theme:'system',acc:'en-US',rate:.9,name:'',goal:1,font:'normal',calm:false,auto:false,sa:false}});
let S=DEF(),INQ=0;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isO=o=>o&&typeof o=='object'&&!Array.isArray(o);
const num=(v,d)=>typeof v=='number'&&isFinite(v)?v:d;
const jx=o=>JSON.stringify(o,(k,v)=>isO(v)?Object.keys(v).sort().reduce((r,x)=>(r[x]=v[x],r),{}):v);
const LEX={};ALL.forEach(w=>LEX[w.en]=w.ar);
/* clean(): keep only known keys with the right types (protects against bad imports and tampered cloud data) */
function clean(o){const d=DEF();if(!isO(o))return d;
 const nm=(m,re,lo,hi)=>{const r={};if(isO(m))for(const k in m)if(re.test(k)){const v=num(m[k],null);if(v!==null)r[k]=Math.max(lo,Math.min(hi,v))}return r};
 d.done=nm(o.done,/^\d{1,4}$/,0,100);d.ut=nm(o.ut,/^\d{1,3}$/,0,100);d.lt=nm(o.lt,/^\d{1,2}$/,0,100);d.days=nm(o.days,/^\d{4}-\d\d-\d\d$/,0,1000);d.sec=nm(o.sec,/^\d{1,4}$/,0,15);for(const k in d.sec)d.sec[k]=d.sec[k]|0;d.gr=nm(o.gr,/^\d{1,3}$/,0,100);
 if(isO(o.fav))for(const k in o.fav)if(/^\d{1,4}$/.test(k)&&o.fav[k])d.fav[k]=1;
 if(isO(o.cid))for(const k in o.cid)if(/^\d{1,2}$/.test(k)&&/^EF-L\d+-[A-Z0-9]{3,12}$/.test(String(o.cid[k])))d.cid[k]=o.cid[k];
 if(isO(o.sk))for(const k in o.sk){const a=o.sk[k];if(/^[A-Za-z ]{1,20}$/.test(k)&&Array.isArray(a))d.sk[k]=[Math.max(0,num(a[0],0)),Math.max(0,num(a[1],0))]}
 if(isO(o.vocab))for(const k in o.vocab){const v=o.vocab[k];if(LEX[k]!==undefined&&isO(v))d.vocab[k]={ar:LEX[k],box:Math.max(0,Math.min(5,Math.round(num(v.box,0)))),due:num(v.due,0),t:num(v.t,0)}}
 if(Array.isArray(o.mist))o.mist.forEach(m=>{if(isO(m)&&LEX[m.en]!==undefined&&!d.mist.some(x=>x.en==m.en)&&d.mist.length<50)d.mist.push({en:m.en,ar:LEX[m.en]})});
 d.start=Math.max(0,Math.min(30,Math.round(num(o.start,0))));d.placed=o.placed?1:0;
 d.test=isO(o.test)?{pct:num(o.test.pct,0),lvl:Math.max(1,Math.min(30,Math.round(num(o.test.lvl,1)))),date:/^\d{4}-\d\d-\d\d$/.test(o.test.date)?o.test.date:''}:null;
 d.upd=num(o.upd,0);d.rst=num(o.rst,0);
 d.ls={};if(isO(o.ls))for(const k in o.ls)if(/^\d{1,2}$/.test(k)&&+k>=1&&+k<=30&&/^\d{4}-\d\d-\d\d$/.test(String(o.ls[k])))d.ls[k]=o.ls[k];
 d.rv=Math.max(0,Math.min(100,num(o.rv,0)));d.sty=nm(o.sty,/^\d{1,2}$/,0,100);
 if(num(o.ver,2)<3){/* migrate the old 20-level layout to 30 levels: old level k (1-10) became levels 2k-1 and 2k, old 11-20 became 21-30 */
  const m1=k=>k<=10?2*k-1:k+10,m2=k=>k<=10?2*k:k+10,lt={},cid={};
  for(const k in d.lt){const v=d.lt[k];[m1(+k),m2(+k)].forEach(x=>{lt[x]=Math.max(lt[x]||0,v)})}d.lt=lt;
  for(const k in d.cid)cid[m2(+k)]=d.cid[k];d.cid=cid;
  d.start=d.start?m1(d.start):0;if(d.test)d.test.lvl=m1(d.test.lvl)}
 const s=isO(o.set)?o.set:{};
 d.set={theme:['system','light','dark'].includes(s.theme)?s.theme:'system',acc:s.acc=='en-GB'?'en-GB':'en-US',rate:[.6,.9,1.15].includes(s.rate)?s.rate:.9,name:String(s.name||'').slice(0,30),goal:[1,2,3].includes(s.goal)?s.goal:1,font:['small','normal','large','xl'].includes(s.font)?s.font:'normal',calm:!!s.calm,auto:!!s.auto,sa:!!s.sa};
 return d}
/* mergeS(): combine two copies of the same learner's progress without losing anything (a reset wins over older progress) */
function mergeS(a,b){a=clean(a);b=clean(b);if(a.rst!==b.rst)return a.rst>b.rst?a:b;
 const nw=a.upd>=b.upd?a:b,ol=nw===a?b:a,r=clean(nw);
 const mx=k=>{const o={};[ol[k],nw[k]].forEach(m=>{for(const x in m)if(o[x]===undefined||m[x]>o[x])o[x]=m[x]});return o};
 r.done=mx('done');r.ut=mx('ut');r.lt=mx('lt');r.days=mx('days');r.cid=Object.assign({},ol.cid,nw.cid);r.gr=mx('gr');r.sec={};[ol.sec,nw.sec].forEach(m=>{for(const x in m)r.sec[x]=(r.sec[x]|0)|(m[x]|0)});
 r.vocab=Object.assign({},ol.vocab);for(const k in nw.vocab){const o=ol.vocab[k];if(!o||nw.vocab[k].t>=o.t)r.vocab[k]=nw.vocab[k]}
 r.sk={};[ol.sk,nw.sk].forEach(m=>{for(const k in m)if(!r.sk[k]||m[k][1]>r.sk[k][1])r.sk[k]=m[k]});
 r.mist=[...nw.mist,...ol.mist.filter(m=>!nw.mist.some(x=>x.en==m.en))].slice(0,50);
 r.ls={};[ol.ls,nw.ls].forEach(m=>{for(const x in m)if(!r.ls[x]||m[x]<r.ls[x])r.ls[x]=m[x]});r.rv=Math.max(ol.rv,nw.rv);r.sty=mx('sty');
 if(!nw.placed&&ol.placed){r.placed=1;r.start=ol.start;r.test=ol.test}
 r.upd=Math.max(a.upd,b.upd);return clean(r)}
/* ---------- Accounts: cloud (Supabase) when configured, otherwise this-device-only ---------- */
let USER=localStorage.getItem('ef_cur')||'';
const CFG=window.SUPABASE_CONFIG||{};
const CFGOK=!!(CFG.url&&CFG.anonKey&&!/YOUR-/i.test(CFG.url+CFG.anonKey));
const isC=u=>/^c_/.test(u||''),isG=u=>u==='guest';let AUTHV=0;
if(isC(USER)&&!CFGOK)USER='';if(CFGOK&&!isC(USER)&&USER!=='guest')USER='';
let sb=null,SESS=null,EMAIL='',PROV='',SYNC=CFGOK?'idle':'local',SERR='',REC=0,AM='in',AMSG='',pushT=0;
if(CFGOK&&window.supabase){try{sb=window.supabase.createClient(CFG.url,CFG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}catch(e){sb=null}}
const KEY=()=>'ef2_'+USER;
const RED=()=>location.origin+location.pathname;
const ACC=()=>{try{return JSON.parse(localStorage.getItem('ef_acc')||'{}')}catch(e){return{}}};
function loadS(){try{let raw=localStorage.getItem(KEY());if(!raw)raw=localStorage.getItem('ef_bak_'+USER);S=clean(JSON.parse(raw||'null'))}catch(e){S=DEF()}}
function persist(){if(USER)try{localStorage.setItem(KEY(),JSON.stringify(S))}catch(e){}}
function save(){if(!USER)return;S.upd=Date.now();persist();if(sb&&SESS){clearTimeout(pushT);pushT=setTimeout(push,1500);setSync('wait')}}
const SIC={ok:'cloud',busy:'refresh',wait:'cloud',off:'cloudoff',err:'alert',local:'device',idle:'cloud'};const SIH=s=>ic(SIC[s]||'cloud');const SI={ok:'☁️',busy:'🔄',wait:'☁️',off:'📴',err:'⚠️',local:'💾',idle:'☁️'};
const SL={ok:'Synced',busy:'Syncing…',wait:'Changes waiting to sync',off:'Offline. Changes will sync when you are back online',err:'Sync problem',local:'Saved on this device only',idle:'Not signed in'};
function setSync(s,e){SYNC=s;SERR=e?friendly(e):'';const a=$('#syn');if(a){a.innerHTML=SIH(s);a.title=SL[s]}const b=$('#sst');if(b)b.textContent=SL[s]+(SERR?': '+SERR:'')}
function friendly(e){const m=String((e&&e.message)||e||''),c=String((e&&(e.code||e.error_code))||''),st=e&&e.status;
 if(c=='over_email_send_rate_limit'||/email rate limit/i.test(m))return'The free email service has reached its hourly limit. If you already created the account, tap Sign in. Otherwise wait a while and try again.';
 if(c=='over_request_rate_limit'||c=='over_sms_send_rate_limit'||st==429||/rate limit|too many/i.test(m))return'Too many attempts from this network. Wait a few minutes and try again.';
 if(c=='invalid_credentials'||/invalid login/i.test(m))return'The email or password is not correct. Check the spelling, or tap “Forgot password?”. If you have no account yet, tap “Create account”: it signs you in straight away.';
 if(c=='email_not_confirmed'||/not confirmed/i.test(m))return'Please confirm your email first. Open the link we sent to your inbox (also check Spam), or resend it below.';
 if(c=='user_already_exists'||c=='email_exists'||/already registered|already been registered|already exists/i.test(m))return'This email already has an account. Tap Sign in and enter its password, or use “Forgot password?”.';
 if(c=='weak_password'||(/password/i.test(m)&&/(weak|at least|short|characters)/i.test(m)))return'Choose a stronger password: 8 or more characters with letters and numbers.';
 if(c=='email_address_invalid'||/email address.*invalid|invalid.*email/i.test(m))return'This email address is not accepted. Check it for typing mistakes.';
 if(c=='signup_disabled'||/signups? (not allowed|disabled)/i.test(m))return'New sign-ups are switched off in the cloud settings.';
 if(/failed to fetch|network|load failed/i.test(m))return'No connection. Check your internet and try again.';
 if(c=='otp_expired'||/token has expired|otp.*(expired|invalid)|invalid.*(otp|token)/i.test(m))return'That code is wrong or has expired. Check it, or ask for a new code.';
 if(c=='same_password'||/different from the old password/i.test(m))return'Choose a password that is different from your current one.';
 if(/provider is not enabled|unsupported provider/i.test(m))return'This sign-in method is not enabled yet.';
 if(/delete_my_account/i.test(m))return'Account deletion is not set up. Run the latest SUPABASE_SETUP.sql.';
 if(/progress/i.test(m)&&/(schema cache|exist|find)/i.test(m))return'The cloud database is not set up yet. Run SUPABASE_SETUP.sql.';
 return 'Something went wrong. Please try again.'}
let RS='';
async function resendMail(){if(!RS)return;try{const r=await sb.auth.resend({type:'signup',email:RS,options:{emailRedirectTo:RED()}});if(r.error)throw r.error;msg('Confirmation email sent again. Check your inbox and Spam.',1)}catch(e){msg(friendly(e))}}
async function push(){if(!sb||!SESS)return;if(!navigator.onLine){setSync('off');return}setSync('busy');
 try{const r=await sb.from('progress').upsert({user_id:SESS.user.id,data:S,updated_at:new Date().toISOString()});if(r.error)throw r.error;setSync('ok')}catch(e){setSync(navigator.onLine?'err':'off',e)}}
async function pull(){if(!sb||!SESS)return false;setSync('busy');
 const r=await sb.from('progress').select('data').eq('user_id',SESS.user.id).maybeSingle();if(r.error)throw r.error;
 const rc=clean(r.data&&r.data.data),m=mergeS(S,rc),chL=jx(m)!==jx(S),chR=!r.data||jx(m)!==jx(rc);S=m;persist();
 if(chR)await push();else setSync('ok');return chL}
async function syncNow(){if(!sb||!SESS)return;try{if(await pull()&&!INQ)draw()}catch(e){setSync(navigator.onLine?'err':'off',e)}}
function mergeGuest(){try{const g=localStorage.getItem('ef2_guest');if(!g)return;S=mergeS(S,clean(JSON.parse(g)));persist();localStorage.removeItem('ef2_guest');localStorage.removeItem('ef_bak_guest')}catch(e){}}
function guestGo(){AUTHV=0;USER='guest';EMAIL='';SESS=null;try{localStorage.setItem('ef_cur','guest')}catch(e){}loadS();setSync('local');theme();applyPrefs();go('home')}
function wantAuth(){AUTHV=1;AM='in';AMSG='';draw.force=1;draw();draw.force=0}
function backGuest(){AUTHV=0;go('home')}
const GBTN=()=>`<div class=sep>or</div><button class=btn2 type=button onclick="${AUTHV?'backGuest()':'guestGo()'}">${AUTHV?'← Back to the app':'Continue as guest'}</button><p class=mut>${AUTHV?'':'No account needed. Your progress stays on this device. You can sign in later from Settings or the top bar.'}</p>`;
function forget(){clearTimeout(pushT);SESS=null;USER='';EMAIL='';S=DEF();localStorage.removeItem('ef_cur');AM='in';AMSG='';INQ=0;draw()}
async function onSignedIn(ses){if(SESS&&SESS.user.id===ses.user.id){SESS=ses;return}
 SESS=ses;const u=ses.user;USER='c_'+u.id;EMAIL=u.email||'';PROV=(u.app_metadata&&u.app_metadata.provider)||'email';
 localStorage.setItem('ef_cur',USER);localStorage.setItem('ef_email_'+USER,EMAIL);AMSG='';
 loadS();mergeGuest();AUTHV=0;const nm=u.user_metadata&&(u.user_metadata.name||u.user_metadata.full_name);if(nm&&!S.set.name){S.set.name=String(nm).slice(0,30);persist()}
 try{await pull()}catch(e){setSync(navigator.onLine?'err':'off',e)}
 INQ=0;V='home';theme();applyPrefs();navFx(draw,VT.home)}
async function signOut(){if(sb&&SESS){clearTimeout(pushT);await push();if(SYNC!='ok'&&!confirm('Your latest progress has not synced yet. A copy stays on this device until you sign in again. Sign out anyway?'))return;if(SYNC=='ok')localStorage.removeItem(KEY())}
 try{if(sb)await sb.auth.signOut()}catch(e){}forget()}
async function delAcct(){if(!sb||!SESS)return alert('Connect to the internet and sign in first.');
 if(!confirm('Delete your account and all cloud data? This cannot be undone.')||!confirm('Are you sure? Your progress will be lost.'))return;
 try{const r=await sb.rpc('delete_my_account');if(r.error)throw r.error;localStorage.removeItem(KEY());try{await sb.auth.signOut({scope:'local'})}catch(e){}forget();alert('Your account was deleted.')}catch(e){alert('Could not delete the account: '+friendly(e))}}
function msg(t,ok){AMSG=t;const e=$('#ae');if(e){e.textContent=t;e.className='msg '+(ok?'ok':'bad')}if(t&&!ok)try{const c=$('#auc');if(c&&c.classList){c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')}}catch(x){}}
function busy(on){const b=$('#ago');if(b){b.disabled=on;if(b.classList)b.classList.toggle('is-busy',on)}}
/* Sign in, retrying a few times right after sign-up (the new account can take a moment to be readable everywhere). */
async function signInRetry(em,pw,n){let r;for(let i=0;i<n;i++){r=await sb.auth.signInWithPassword({email:em,password:pw});if(!r.error||r.error.code!='invalid_credentials')return r;if(i<n-1)await new Promise(z=>setTimeout(z,600))}return r}
async function cauth(){const g=id=>($(id)||{}).value||'',em=g('#au').trim(),pw=g('#ap'),nm=g('#an').trim();
 if(!/^\S+@\S+\.\S+$/.test(em))return msg('Enter a valid email address.');
 busy(true);try{
  if(AM=='fg'){const r=await sb.auth.resetPasswordForEmail(em,{redirectTo:RED()});if(r.error)throw r.error;auGo('rc');return msg('If this email has an account, a 6-digit code is on its way. Check Spam too.',1)}
  if(AM=='rc'){const code=g('#acd').replace(/\s/g,'');if(!/^\d{6,10}$/.test(code))return msg('Enter the 6-digit code from the email.');if(pw.length<8)return msg('Password must have at least 8 characters.');
   const ses=await pwApply(em.toLowerCase(),code,pw);await onSignedIn(ses);return}
  if(pw.length<8)return msg('Password must have at least 8 characters.');
  const em2=em.toLowerCase();let r;
  if(AM=='up'){
   /* 1) Instant sign-up through our cloud function (no email, no rate limit). */
   let code='';
   try{const fr=await sb.functions.invoke('signup',{body:{email:em2,password:pw,name:nm.slice(0,30)}});
    if(fr&&fr.error){const rs=fr.error.context;if(rs&&typeof rs.json=='function'){try{code=(await rs.json()).error||'failed'}catch(x){code='failed'}}else code='unavailable'}}catch(x){code='unavailable'}
   if(code=='invalid_email')throw{code:'email_address_invalid'};
   if(code=='weak_password')throw{code:'weak_password'};
   if(!code||code=='exists'){
    r=await signInRetry(em2,pw,code=='exists'?1:4);
    if(r.error){if(code=='exists'){auGo('in');const pe=$('#ap');if(pe)pe.value='';auHint();return msg('This email already has an account, and this is not its password. Enter the password you chose when you created it, or tap “Forgot password?”.')}throw r.error}
   }else{
    /* 2) Fallback: normal sign-up (needs “Confirm email” to be off in the cloud settings). */
    r=await sb.auth.signUp({email:em2,password:pw,options:{data:{name:nm.slice(0,30)},emailRedirectTo:RED()}});
    const dup=r.data&&r.data.user&&r.data.user.identities&&r.data.user.identities.length==0;
    if(r.error||dup||!r.data||!r.data.session){
     const t=await sb.auth.signInWithPassword({email:em2,password:pw});
     if(!t.error&&t.data&&t.data.session)r=t;
     else if(dup){auGo('in');auHint();return msg('This email already has an account. Sign in with your password, or use “Forgot password?”.')}
     else if(r.error)throw r.error;
     else{auGo('in');showResend(em2);return msg('Account created. Please confirm your email: open the link we sent (check Spam), then sign in.',1)}}}
  }
  else{r=await sb.auth.signInWithPassword({email:em2,password:pw});if(r.error){if(r.error.code=='email_not_confirmed'||/not confirmed/i.test(r.error.message||''))showResend(em2);throw r.error}}
  await onSignedIn(r.data.session)
 }catch(e){msg(friendly(e))}finally{busy(false)}}
async function resendCode(){const em=((($('#au')||{}).value)||'').trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(em))return msg('Enter your email first.');try{const r=await sb.auth.resetPasswordForEmail(em,{redirectTo:RED()});if(r.error)throw r.error;msg('A new code is on its way. Check Spam too.',1)}catch(e){msg(friendly(e))}}
/* Password change / reset with a code from the email: verify the code, then set the new password. */
let PWF=0,CP=0,CPM='',CPK=0,SO={};
async function pwApply(em,code,pw){PWF=1;try{const v=await sb.auth.verifyOtp({email:em,token:code,type:'recovery'});if(v.error)throw v.error;const u=await sb.auth.updateUser({password:pw});if(u.error)throw u.error;return(v.data&&v.data.session)||SESS}finally{setTimeout(()=>{PWF=0},1500)}}
async function cpSend(){if(!sb||!SESS||!EMAIL)return;CPM='';try{const r=await sb.auth.resetPasswordForEmail(EMAIL,{redirectTo:RED()});if(r.error)throw r.error;CP=1;CPK=1;CPM='Code sent. Check your inbox and Spam.'}catch(e){CPK=0;CPM=friendly(e)}SO.acct=true;draw.force=1;draw();draw.force=0}
async function cpDone(){const c=((($('#cpc')||{}).value)||'').trim().replace(/\s/g,''),pw=($('#cpn')||{}).value||'',st=(m,k)=>{CPM=m;CPK=k;const e=$('#cpm');if(e){e.textContent=m;e.className='msg '+(k?'ok':'bad')}};
 if(!/^\d{6,10}$/.test(c))return st('Enter the 6-digit code from the email.');if(pw.length<8)return st('Password must have at least 8 characters.');
 st('Saving…',1);try{const ses=await pwApply(EMAIL,c,pw);if(ses)SESS=ses;CP=0;CPM='Password changed.';CPK=1;draw.force=1;draw();draw.force=0}catch(e){st(friendly(e))}}
function cpHtml(){return`<div class=cpx><h3>Password</h3>${CP?`<p class=mut>We sent a 6-digit code to <b>${esc(EMAIL)}</b>. Enter it with your new password.</p><label class=cpl for=cpc>6-digit code</label><input id=cpc inputmode=numeric autocomplete=one-time-code maxlength=10 placeholder="123456"><label class=cpl for=cpn>New password</label><input id=cpn type=password autocomplete=new-password placeholder="8+ characters"><p id=cpm class="msg ${CPK?'ok':'bad'}" role=alert>${esc(CPM)}</p><button class=btn type=button onclick="cpDone()">Save new password</button> <button class=btn2 type=button onclick="cpSend()">Resend code</button> <button class=lnk type=button onclick="CP=0;CPM='';draw()">Cancel</button>`:`<p class=mut>We will email you a 6-digit code first.</p><p id=cpm class="msg ${CPK?'ok':'bad'}">${esc(CPM)}</p><button class=btn2 type=button onclick="cpSend()">Change password</button>`}</div>`}
async function mlink(){const em=(($('#au')||{}).value||'').trim();if(!/^\S+@\S+\.\S+$/.test(em))return msg('Enter your email first.');
 try{const r=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:RED()}});if(r.error)throw r.error;msg('Sign-in link sent. Check your email.',1)}catch(e){msg(friendly(e))}}
async function oauth(p){if(location.protocol=='file:')return msg('Social sign-in needs the site to be hosted on https.');
 try{const r=await sb.auth.signInWithOAuth({provider:p,options:{redirectTo:RED()}});if(r.error)throw r.error}catch(e){msg(friendly(e))}}
async function newPass(){const pw=(($('#ap')||{}).value)||'';if(pw.length<8)return msg('Password must have at least 8 characters.');
 try{const r=await sb.auth.updateUser({password:pw});if(r.error)throw r.error;REC=0;AMSG='';if(SESS)await onSignedIn(SESS);else draw()}catch(e){msg(friendly(e))}}
/* ---------- Auth page: ONE form with three modes (in / up / fg). Changing mode sweeps a blade across the card and swaps the mode while the blade covers it. ---------- */
const AUT={in:['Welcome <em>back.</em>','Sign in to keep learning.'],up:['Start <em>learning.</em>','Create your free account in a few seconds.'],fg:['Reset <em>password.</em>','Enter your email and we will email you a 6-digit code.'],rc:['Enter the <em>code.</em>','Type the 6-digit code from the email and choose a new password.']};
let AUB=0;
function auSet(m){AM=m;const r=$('#authx');if(!r||!r.dataset)return;r.dataset.mode=m;const t=AUT[m]||AUT.in,h=$('#aut'),s=$('#aus2');if(h)h.innerHTML=t[0];if(s)s.textContent=t[1];
 const p=$('#ap');if(p){p.setAttribute('autocomplete',m=='up'||m=='rc'?'new-password':'current-password');p.type='password';const e=$('#aey');if(e){e.textContent='Show';e.setAttribute('aria-pressed','false')}auStr(p.value)}}
const noFx=()=>document.documentElement.classList.contains('calm')||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
/* bladeRun(): one skewed band sweeps across an area of width W; swap() runs while it covers the area completely; done() runs at the end. */
function bladeRun(b,W,swap,done,D){
 const bw=Math.round(W*1.7+80),cov=-(bw-W)/2,from=-bw,set=v=>b.style.setProperty('--sweep',v+'px'),ez=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
 b.style.setProperty('--bw',bw+'px');b.style.setProperty('--w',W+'px');
 let sw=0,t0=0,dn=0;set(from);b.classList.add('go');
 const fin=()=>{if(dn)return;dn=1;if(!sw){sw=1;swap()}b.classList.remove('go');if(done)done()};
 const step=ts=>{if(dn)return;if(!t0)t0=ts;const p=Math.min(1,(ts-t0)/D),v=from+(W-from)*ez(p);set(v);if(!sw&&v>=cov){sw=1;swap()}if(p<1)requestAnimationFrame(step);else fin()};
 requestAnimationFrame(step);setTimeout(fin,D+600)}
function auGo(m,clr){if(AUB||m==AM)return;if(clr)msg('');
 const r=$('#authx'),st=$('#auss'),b=$('#aub');
 if(!r||!st||!st.getBoundingClientRect||!b||!window.requestAnimationFrame||noFx()){auSet(m);return}
 const t=AUT[m];$('#abt').innerHTML=t[0];$('#abs').textContent=t[1];AUB=1;
 bladeRun(b,st.getBoundingClientRect().width,()=>auSet(m),()=>{AUB=0;
  try{if(matchMedia('(pointer:fine)').matches){const f=m=='up'?'#an':m=='rc'?'#acd':'#au';const e=$(f);if(e&&!e.value)e.focus();else if(m!='fg'&&$('#ap'))$('#ap').focus()}}catch(x){}},950)}
/* Page changes use the same blade over the whole screen. */
let NAVB=0,FXOFF=1;
const VT={home:'Welcome <em>home.</em>',learn:'Let’s <em>learn.</em>',lesson:'Lesson <em>time.</em>',gram:'Grammar <em>rules.</em>',review:'Review <em>words.</em>',progress:'Your <em>progress.</em>',settings:'Your <em>settings.</em>',test:'Take the <em>test.</em>',cert:'Your <em>certificate.</em>',search:'Find <em>anything.</em>',help:'Need <em>help?</em>',share:'Share <em>LanguWay.</em>',stories:'Story <em>time.</em>',story:'Story <em>time.</em>'};
function navFx(swap,title){const bl=$('#bl'),b=$('#blb');
 if(FXOFF||NAVB||!bl||!b||!bl.getBoundingClientRect||!window.requestAnimationFrame||noFx()){swap();return}
 const t=$('#blt');if(t)t.innerHTML=title||'';NAVB=1;
 bladeRun(b,Math.max(320,window.innerWidth||360),swap,()=>{NAVB=0},700)}
/* ---------- Menu (three dashes) ---------- */
let MN=0;
const MI=[['home','home','Home'],['learn','learn','Learn'],['stories','stories','Stories'],['review','review','Review'],['progress','progress','Progress'],['test','pen','Placement test'],['share','share','Install and share'],['help','help','Help'],['settings','gear','Settings']];
function mnHtml(){const on=v=>V==v||((V=='lesson'||V=='gram')&&v=='learn')||(V=='story'&&v=='stories'),C=isC(USER),d=dueN();
 const who=C?`<b>${esc(S.set.name||EMAIL||'Signed in')}</b><br><span id=mst>${esc(SL[SYNC])}</span>`:isG(USER)?'<b>Guest</b><br>Your progress is saved on this device only.':`<b>${esc(USER)}</b><br>Saved on this device.`;
 const act=C?`<button class=mn__b type=button onclick="mnDo(signOut,'See you <em>soon.</em>')">Sign out</button>`:isG(USER)?`<button class=mn__b type=button onclick="mnDo(wantAuth,'Welcome <em>back.</em>')">Sign in or create account</button>`:`<button class=mn__b type=button onclick="localStorage.removeItem('ef_cur');location.reload()">Log out</button>`;
 return`<div class=mn__in><div class=mn__hd><img class=mn__lg src=logo-light.png alt="LanguWay English" width=48 height=48><button class=mn__x type=button onclick="mnToggle()" aria-label="Close menu">✕</button></div>
 <form class=mn__s onsubmit="mnSearch();return false"><input id=msq type=search placeholder="Search lessons and words" aria-label=Search enterkeyhint=search></form>
 <div class=mn__l role=navigation aria-label="Main menu">${MI.map(x=>`<button type=button class="mn__i ${on(x[0])?'on':''}" onclick="go('${x[0]}')">${ic(x[1])}<span>${x[2]}</span>${x[0]=='review'&&d?`<b>${d}</b>`:''}</button>`).join('')}<button type=button class=mn__i onclick="mnDo(hOpen,'Ask the <em>helper.</em>')">${ic('chat')}<span>Ask the helper</span></button></div>
 <div class=mn__ft><p>${who}</p>${act}</div></div>`}
function mnShow(){MN=1;const m=$('#mn');if(!m)return;m.innerHTML=mnHtml();m.hidden=false;document.body.style.overflow='hidden'}
function mnHide(){if(!MN)return;MN=0;const m=$('#mn');if(m)m.hidden=true;document.body.style.overflow=HO?'hidden':''}
function mnToggle(){if(MN)navFx(mnHide,'Back to <em>learning.</em>');else navFx(mnShow,'The <em>menu.</em>')}
function mnDo(fn,title){navFx(()=>{mnHide();fn()},title)}
function mnSearch(){SQ=(($('#msq')||{}).value||'');go('search')}
function auEye(){const p=$('#ap'),b=$('#aey');if(!p)return;const s=p.type=='password';p.type=s?'text':'password';if(b){b.textContent=s?'Hide':'Show';b.setAttribute('aria-pressed',s?'true':'false')}}
function auStr(v){const m=$('#aum');if(!m||!m.dataset)return;v=v||'';let n=0;if(v.length>=8)n++;if(v.length>=12)n++;if(/[a-z]/i.test(v)&&/\d/.test(v))n++;if((/[A-Z]/.test(v)&&/[a-z]/.test(v))||/[^A-Za-z0-9]/.test(v))n++;
 m.dataset.s=!v?'':v.length<8?'0':String(Math.max(1,n));const h=$('#auh');if(h)h.textContent=!v?'Use 8 or more characters, with letters and numbers.':v.length<8?'Use at least 8 characters ('+v.length+'/8).':['','Weak. Add letters and numbers.','Okay. Add letters and numbers.','Good.','Strong.'][Math.max(1,n)]}
function auHint(){try{const f=$('#afg');if(f&&f.classList){f.classList.remove('pulse');void f.offsetWidth;f.classList.add('pulse')}}catch(e){}}
function showResend(em){RS=em;const x=$('#ars');if(x)x.hidden=false}
function authView(L){
 if(REC&&!L)return`<div class="auth au" id=authx data-mode=in><div class=au__card id=auc><div class=au__stage><div class=au__head><img class=au__logo src=logo-light.png alt="" width=46 height=46><h3 class=au__title>New <em>password.</em></h3><p class=au__sub>Choose a new password for your account.</p></div><form class=au__form onsubmit="newPass();return false" novalidate><div class=au__row><label for=ap>New password</label><input id=ap type=password autocomplete=new-password enterkeyhint=go placeholder="8+ characters"></div><p id=ae class="msg bad" role=alert>${esc(AMSG)}</p><button class=au__go id=ago type=submit>Save password<i class=au__spin></i></button></form></div></div></div>`;
 const Pv=CFG.providers||{},bt=(p,l)=>!L&&Pv[p]?`<button type=button class=au__soc onclick="oauth('${p}')">Continue with ${l}</button>`:'';
 const soc=bt('google','Google')+bt('apple','Apple (iCloud)'),m=L?(AM=='up'?'up':'in'):(AM=='up'||AM=='fg'||AM=='rc'?AM:'in'),t=AUT[m];
 return`<div class="auth au" id=authx data-mode="${m}"><div class=au__card id=auc><div class=au__stage id=auss>
 <div class=au__head><img class=au__logo src=logo-light.png alt="" width=46 height=46><h3 class=au__title id=aut>${t[0]}</h3><p class=au__sub id=aus2>${t[1]}</p></div>
 ${!L&&location.protocol=='file:'?'<p class="msg bad au__pad">Cloud sign-in works only when the site is hosted on https.</p>':''}
 <form class=au__form onsubmit="${L?'localAuth':'cauth'}();return false" novalidate>
  <div class=au__row data-m=up><label for=an>Your name</label><input id=an maxlength=30 autocomplete=name enterkeyhint=next placeholder="What should we call you?"></div>
  <div class=au__row><label for=au>${L?'Username':'Email'}</label><input id=au ${L?'maxlength=20':'type=email inputmode=email'} autocomplete=${L?'username':'email'} autocapitalize=none autocorrect=off spellcheck=false enterkeyhint=next placeholder="${L?'letters, numbers, _':'you@example.com'}"></div>
  <div class=au__row data-m=rc><label for=acd>6-digit code</label><input id=acd inputmode=numeric autocomplete=one-time-code maxlength=10 placeholder="123456" enterkeyhint=next><p class=au__hint>Use the code from the email, not the link.</p></div>
  <div class=au__row data-m="in up rc"><label for=ap><span data-m="in up">Password</span><span data-m=rc>New password</span></label><div class=au__pw><input id=ap type=password ${L?'':'oninput="auStr(this.value)"'} autocomplete="${m=='up'?'new-password':'current-password'}" enterkeyhint=go placeholder="${L?'6+':'8+'} characters"><button type=button class=au__eye id=aey onclick="auEye()" aria-pressed=false aria-label="Show or hide password">Show</button></div>
   ${L?'':'<div class=au__meter id=aum data-m="up rc"><i></i><i></i><i></i><i></i></div><p class="au__hint" id=auh data-m="up rc">Use 8 or more characters, with letters and numbers.</p>'}</div>
  <p id=ae class="msg bad" role=alert aria-live=polite>${esc(AMSG)}</p>
  <button class=au__go id=ago type=submit><span data-m=in>Sign in</span><span data-m=up>Create account</span><span data-m=fg>Send me a code</span><span data-m=rc>Save new password</span><i class=au__spin></i></button>
  ${L?'':`<div class=au__links data-m=in><button type=button class=lnk id=afg onclick="auGo('fg',1)">Forgot password?</button><button type=button class=lnk onclick="mlink()">Email me a sign-in link</button><button type=button class=lnk id=ars onclick="resendMail()" ${RS?'':'hidden'}>Resend confirmation email</button></div>`}
  <p class=au__sw data-m=in>${L?'':'New here? '}<button type=button class=lnk onclick="auGo('up',1)">Create an account</button></p>
  <p class=au__sw data-m=up>Already have an account? <button type=button class=lnk onclick="auGo('in',1)">Sign in</button></p>
  <p class=au__sw data-m=fg><button type=button class=lnk onclick="auGo('in',1)">← Back to sign in</button></p>
  <p class=au__sw data-m=rc><button type=button class=lnk onclick="resendCode()">Resend code</button> · <button type=button class=lnk onclick="auGo('in',1)">← Back to sign in</button></p>
 </form>
 <div class=au__foot data-m="in up">${soc}${GBTN()}${L?'<p class=mut>Cloud sign-in is not set up, so accounts are stored on this device only.</p>':''}</div>
 <div class=au__band id=aub aria-hidden=true><span class="band__edge band__edge--trail"></span><div class=band__inner><div class=band__page><div class="au__head au__head--band"><img class=au__logo src=logo-light.png alt="" width=46 height=46><h3 class=au__title id=abt></h3><p class=au__sub id=abs></p></div></div></div><span class="band__edge band__edge--lead"></span></div>
 </div></div></div>`}
function vCloudAuth(){return authView(0)}
async function hash(p,s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let x=5381;for(const c of s+p)x=(x*33^c.charCodeAt(0))>>>0;return'x'+x}}
function vLocalAuth(){return authView(1)}
async function localAuth(){const u=$('#au').value.trim().toLowerCase(),p=$('#ap').value,L=ACC(),e=m=>msg(m),nm=AM=='up'?$('#an').value.trim():'';
 if(!/^[a-z0-9_]{3,20}$/.test(u))return e('Username: 3 to 20 letters, numbers or _');if(p.length<6)return e('Password must have at least 6 characters.');
 if(AM=='up'){if(L[u])return e('This username is taken.');const s=Math.random().toString(36).slice(2);L[u]={s,h:await hash(p,s)};localStorage.setItem('ef_acc',JSON.stringify(L))}
 else{const a=L[u];if(!a||a.h!=await hash(p,a.s))return e('Wrong username or password.')}
 USER=u;localStorage.setItem('ef_cur',u);loadS();mergeGuest();AUTHV=0;if(nm)S.set.name=nm.slice(0,30);save();theme();applyPrefs();go('home')}
function vAuth(){if(CFGOK&&!sb)return`<div class="card auth"><h1>LanguWay English</h1><p>Cloud sign-in needs an internet connection. Check your connection and try again.</p><button class=btn onclick="location.reload()">Try again</button>${GBTN()}</div>`;return sb?vCloudAuth():vLocalAuth()}
function applyPrefs(){const f={small:'14px',normal:'16px',large:'18px',xl:'20px'}[S.set.font]||'16px';document.documentElement.style.fontSize=f;document.documentElement.classList.toggle('calm',!!S.set.calm)}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const $=s=>document.querySelector(s);
const doneN=()=>Object.keys(S.done).length;
const avg=()=>{const v=Object.values(S.done);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0};
const dueN=()=>Object.values(S.vocab).filter(v=>v.due<=Date.now()).length;
/* ---------- Audio: browser speech only (no music, no sound effects) ---------- */
function say(t,r){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=S.set.acc;u.rate=r||S.set.rate;speechSynthesis.speak(u)}catch(e){}}
function theme(){const t=S.set.theme,d=t=='dark'||(t=='system'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.toggleAttribute('data-d',d)}

/* ---------- Access rules ---------- */
const lvOpen=n=>n==1||n<=(S.start||1)||S.lt[n-1]>=75;
/* Pacing: each level is planned for 14 days, counted from the day its first lesson is opened */
const lvDay=n=>S.ls[n]?Math.max(1,Math.round((Date.parse(today())-Date.parse(S.ls[n]))/864e5)+1):0;
const dayLbl=n=>{const d=lvDay(n);return d?(d<=PACE?'Day '+d+' of '+PACE:'Day '+d+' · '+(d-PACE)+' over the '+PACE+'-day plan'):''};
const paceTxt=n=>{const d=lvDay(n);if(!d)return'';const u=d+' day'+(d>1?'s':'');return d<=10?'Excellent pace'+nmS()+'! You finished Level '+n+' in '+u+', well ahead of the '+PACE+'-day plan. Keep it up!':d<=PACE?'Good job'+nmS()+'! You finished Level '+n+' in '+u+', right on the '+PACE+'-day plan.':'You finished Level '+n+' in '+u+'. The plan is '+PACE+' days per level, so push yourself a little more on the next one.'};
const lessonOpen=l=>{if(!lvOpen(l.lv))return false;if(l.lv<(S.start||1)||(l.gu==lvFirst(l.lv)&&l.n==1))return true;if(l.n==1)return S.ut[l.gu-1]>=75;return S.done[l.id-1]!=null};
const utOpen=gu=>{const n=lvOf(gu);return !!CT[n]&&lvOpen(n)&&(n<(S.start||1)||([0,1,2].every(i=>S.done[gu*3+i]!=null)&&(!(window.GRAMMAR||[])[gu]||grOK(gu))))};
const ltOpen=n=>!!CT[n]&&lvOpen(n)&&(n<(S.start||1)||Array.from({length:lvCnt(n)},(_,i)=>S.ut[lvFirst(n)+i]).every(v=>v>=75));
function curLevel(){let n=Math.max(1,S.start||1);while(n<NLV&&S.lt[n]>=75)n++;return n}
/* ---------- Router ---------- */
let V='home',A=0,P=0;
function needTest(){if(S.placed)return false;GATE=1;INQ=0;V='test';A=0;scrollTo(0,0);draw();return true}
let GATE=0;
function go(v,a){if((v=='lesson'||v=='gram')&&needTest())return;if(V=='story'&&v!='story'&&typeof stLeave=='function')stLeave();const ch=v!=V||MN;INQ=0;V=v;A=a||0;P=0;
 if(ch)navFx(()=>{mnHide();scrollTo(0,0);draw()},VT[v]);else{scrollTo(0,0);draw()}}
let SQ='',TD='Lessons';
function tgl(){S.set.theme=document.documentElement.hasAttribute('data-d')?'light':'dark';save();theme();draw()}

const ICP={
home:'<path d="M3 11.2 12 3.8l9 7.4"/><path d="M5.5 9.8v10.4h13V9.8"/><rect class=f x="10" y="13.6" width="4" height="6.6" rx="1.2"/>',
learn:'<circle cx="12" cy="12" r="9.2"/><path class=f d="m16 8-2.1 5.9L8 16l2.1-5.9z"/><circle class=g cx="12" cy="12" r="1.1"/>',
review:'<rect x="3.5" y="6.5" width="13" height="14" rx="2.2"/><path d="M7.5 3.5h11a2 2 0 0 1 2 2V16"/><path class=f d="M7 11h6v2H7z"/><path d="M7 16.5h4"/>',
progress:'<path d="M4 20.5h16"/><rect class=f x="5" y="12" width="3.4" height="8.5" rx="1"/><rect x="10.3" y="6" width="3.4" height="14.5" rx="1"/><rect class=f x="15.6" y="9.5" width="3.4" height="11" rx="1"/>',
gear:'<mask id=gm><rect width="24" height="24" fill="#fff"/><circle cx="12" cy="12" r="3.1" fill="#000"/></mask><g class=g mask="url(#gm)"><rect x="10.4" y="1.6" width="3.2" height="20.8" rx="1.2"/><rect x="10.4" y="1.6" width="3.2" height="20.8" rx="1.2" transform="rotate(45 12 12)"/><rect x="10.4" y="1.6" width="3.2" height="20.8" rx="1.2" transform="rotate(90 12 12)"/><rect x="10.4" y="1.6" width="3.2" height="20.8" rx="1.2" transform="rotate(135 12 12)"/><circle cx="12" cy="12" r="7.2"/></g><circle class=f cx="12" cy="12" r="1.5"/>',
bell:'<path d="M6 17V11a6 6 0 0 1 12 0v6l1.6 2H4.4z"/><path class=f d="M10 21h4a2 2 0 0 1-4 0z"/>',
moon:'<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/><circle class=f cx="17" cy="6" r="1.6"/>',
share:'<circle cx="6" cy="12" r="2.6"/><circle class=f cx="18" cy="5.5" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.7 7.4-4M8.3 13.3l7.4 4"/>',
chat:'<path d="M4 5.5h16v10.5H11l-5 4v-4H4z"/><path class=f d="M8 9h8v1.8H8z"/>',
pen:'<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5z"/><path class=f d="m14.5 6 3.5 3.5"/>',
dl:'<path d="M12 4v11"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path class=f d="M5 19h14v1.8H5z"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2.2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
stories:'<rect x="3.5" y="5" width="17" height="14" rx="2.4"/><path class=f d="m10.3 9.2 4.8 2.8-4.8 2.8z"/>',
user:'<circle cx="12" cy="8.5" r="3.6"/><path class=f d="M4.5 20c.8-4 3.9-6 7.5-6s6.7 2 7.5 6z"/>',
doc:'<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path class=f d="M9 12h6v1.8H9z"/><path d="M9 16.5h4"/>'};
ICP.cloud='<path d="M7 18.5h10a4 4 0 0 0 .6-7.95A5.6 5.6 0 0 0 7 9.2 4.7 4.7 0 0 0 7 18.5z"/><path class=f d="m9.6 14 1.8 1.8 3.2-3.4" style="fill:none;stroke:var(--ac2);stroke-width:2"/>';ICP.cloudoff='<path d="M7 18.5h10a4 4 0 0 0 1.6-7.7A5.6 5.6 0 0 0 9 6.8"/><path d="M5.2 9.7A4.6 4.6 0 0 0 7 18.5"/><path d="m4 4 16 16" style="stroke:var(--bad)"/>';ICP.refresh='<path d="M20 12a8 8 0 0 1-14 5.3"/><path d="M4 12a8 8 0 0 1 14-5.3"/><path class=g d="M18.5 3v4.5H14z M5.5 21v-4.5H10z"/>';ICP.alert='<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5"/><circle class=g cx="12" cy="17.2" r="1"/>';ICP.device='<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path class=f d="M10.5 18h3v1.6h-3z"/>';
ICP.menu='<path d="M4 7h16M4 12h16M4 17h16"/>';ICP.help='<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.4-1 .9-1 1.6"/><circle class=g cx="12" cy="16.9" r="1"/>';
const ic=(n,x)=>`<svg class="ic ic-${n} ${x||''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICP[n]}</svg>`;
function draw(){
 const ae=document.activeElement;if((!USER||REC||AUTHV)&&ae&&ae.closest&&ae.closest('.auth')&&/INPUT/.test(ae.tagName)&&$('#app').contains(ae)&&!draw.force)return;
 if(!USER||REC||AUTHV){mnHide();$('#app').innerHTML=vAuth();return}
 if(V=='settings'&&ae&&ae.closest&&ae.closest('.cpx')&&/INPUT/.test(ae.tagName)&&!draw.force)return;
 const top=`<div class=top><button class=ib id=mnb type=button aria-label="Open menu" aria-haspopup=dialog onclick="mnToggle()">${ic('menu')}</button><button class=ib type=button aria-label="Switch theme" onclick="tgl()">${ic('moon')}</button></div>`;
 $('#app').innerHTML=top+({home:vHome,learn:vLearn,lesson:vLesson,gram:vGram,review:vReview,progress:vProgress,settings:vSet,test:vTest,cert:vCert,search:vSearch,help:vHelp,share:vShare,stories:vStories,story:vStory})[V]();
}

function sk(k,c){const t=S.sk[k]||[0,0],p=t[1]?Math.round(t[0]/t[1]*100):0,a=Math.min(100,t[1]);return`<div class="sk ${c}"><div class=st>${k}</div><div class=sb><span>Questions answered<br><big>${t[1]}</big></span><div class=ring style="--p:${a}"><i>${a}%</i></div></div><div class=sb><span>Correct answers<br><big>${t[0]}</big> / ${t[1]}</span><div class=ring style="--p:${p}"><i>${p}%</i></div></div><div class=fl><b style="min-width:${Math.max(p,16)}%">${p}%</b></div></div>`}
function cal(){const d=new Date(),y=d.getFullYear(),m=d.getMonth(),f=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();let c=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<i class=dh>${x}</i>`).join('');for(let i=0;i<f;i++)c+='<i></i>';for(let k=1;k<=n;k++){const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(k).padStart(2,'0');c+=`<i class="${S.days[ds]?'st':''} ${k==d.getDate()?'td':''}">${k}</i>`}return`<div class=card><h2>Planned events</h2><p class=mut>${d.toLocaleString('en',{month:'long',year:'numeric'})} · green days are days you studied</p><div class=cal>${c}</div></div>`}

const popc=n=>{let c=0;for(;n;n>>=1)c+=n&1;return c};
const grDue=()=>{const st=Math.max(1,S.start||1),o=[];for(let gu=0;gu<GR.length;gu++){if(grOK(gu))continue;const n=lvOf(gu);if(n<st||[0,1,2].every(i=>S.done[gu*3+i]!=null))o.push(gu)}return o};
function todo(){const cl=curLevel();let r='';const tr=(pc,t,s,a,l)=>`<div class=tr><div class=pc>${pc}</div><div class=mid><b>${t}</b><br><small>${s}</small></div><button class=go onclick="${a}">▶<br>${l||'Start'}</button></div>`;
 if(TD=='Lessons'){if(CT[cl])LS.filter(l=>l.lv==cl&&S.done[l.id]==null).slice(0,3).forEach(l=>r+=tr(popc(S.sec[l.id]||0)*25+'%',esc(l.t),`Level ${cl} · Unit ${l.ui+1} · Lesson ${l.n}`,`P=0;go('lesson',${l.id})`));if(!r)r='<p class=mut>'+(CT[cl]?'All lessons of this level are finished. Take the tests.':'Lessons for Level '+cl+' are being written.')+'</p>'}
 else if(TD=='Grammar'){const d=grDue(),old=d.filter(g=>lvOf(g)<Math.max(1,S.start||1)).length;if(old)r+=`<p class=mut>${old} grammar rule${old>1?'s':''} from earlier levels still to cover. Every rule counts toward C1.</p>`;d.slice(0,3).forEach(gu=>r+=tr('L'+lvOf(gu),esc(GR[gu].t),'Grammar rule · Unit '+(unOf(gu)+1),`go('gram',${gu})`));if(!r)r='<p class=mut>No grammar rule is waiting. New rules open when you finish the three lessons of a unit.</p>'}
 else if(TD=='Review'){const d=dueN();r=tr(d,'Words due for review',d?'Spaced repetition':'Nothing due now',"go('review')")}
 else{if(CT[cl]){for(let ui=0;ui<lvCnt(cl);ui++){const gu=lvFirst(cl)+ui;if(utOpen(gu)&&!(S.ut[gu]>=75))r+=tr(S.ut[gu]!=null?S.ut[gu]+'%':'0%','Unit '+(ui+1)+' test','15 questions',`startUT(${gu})`)}if(ltOpen(cl)&&!(S.lt[cl]>=75))r+=tr('0%','Level '+cl+' test','30 questions',`startLT(${cl})`)}r+=tr(S.test?'L'+S.test.lvl:'—','Placement test','Find your exact level',"go('test')",'Retake')}
 return`<div class=card><h2>To do list</h2><div class=tabsl>${['Lessons','Grammar','Review','Tests'].map(t=>`<button class="${TD==t?'on':''}" onclick="TD='${t}';draw()">${t}</button>`).join('')}</div>${r}</div>`}
/* ---------- Helper: finds things in the app, answers questions, explains rules (works offline) ---------- */
let HL=[],HO=0;
function hOpen(){HO=!HO;const p=$('#hp');if(!p)return;p.hidden=!HO;const fb=$('#fab');if(fb)fb.style.visibility=HO?'hidden':'';document.body.style.overflow=HO?'hidden':'';if(HO){hDraw();if(!HL.length)hBot('Hi'+nmS()+'! I can find lessons and words, explain a grammar rule, and answer questions about the app. Try: “explain present simple”, “explain past perfect”, “where is my next lesson?”, “meaning of hospital”.',[['Next lesson','next'],['Grammar to do','gram'],['How do tests work?','tests']])}}
function hBot(t,acts){HL.push({b:1,t,acts:acts||[]});hDraw()}
function hDraw(){const l=$('#hl');if(!l)return;l.innerHTML=HL.slice(-12).map(m=>m.b?`<div class=hb>${m.t}${(m.acts||[]).map(a=>`<br><button class=chip onclick="hAct('${a[1]}')">${esc(a[0])}</button>`).join('')}</div>`:`<div class=hu>${esc(m.t)}</div>`).join('');l.scrollTop=l.scrollHeight}
function hSend(){const i=$('#hi'),q=i.value.trim();if(!q)return;i.value='';HL.push({t:q});hDraw();hAns(q)}
function hClose(){if(HO)hOpen()}
function hAct(a){if(a=='close')return hOpen();if(a.indexOf('part:')==0){const p=a.split(':');return hBot(gPart(+p[1],p[2])+'<br>Is it clearer now?',[['Yes, thanks','say:Great']].slice(0,0).concat([['Another part','part:'+p[1]+':'+(p[2]=='f'?'x':p[2]=='x'?'m':'f')],['Open the full lesson','gram:'+p[1]]]))}hClose();if(a=='next')return hNext();if(a=='gram'){const d=grDue();return d.length?go('gram',d[0]):go('learn')}if(a=='tests')return hBot2('Unit test: 15 questions after the 3 lessons and the grammar rule of a unit (75% to pass). Level test: 30 questions after the 4 unit tests. The placement test finds your level and opens all levels below it.');
 const i=a.indexOf(':'),k=a.slice(0,i),v=a.slice(i+1);if(k=='gram')go('gram',+v);else if(k=='lesson'){P=0;go('lesson',+v)}else if(k=='go')go(v);else if(k=='say')say(v)}
function hBot2(t){if(!HO)hOpen();hBot(t)}
function hNext(){const cl=curLevel(),l=LS.filter(x=>x.lv==cl&&S.done[x.id]==null&&lessonOpen(x))[0];if(l){P=0;go('lesson',l.id)}else go('learn')}
function hAns(q){const t=q.toLowerCase();let tx=t;
 const tok=tx.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!['the','and','how','what','does','explain','rule','grammar','about','tell','can','you','with','for','use','when','why','meaning','mean','word','lesson','where','find','show','please'].includes(w));
 const gi=GR.map((g,i)=>{const tl=g.t.toLowerCase().replace(/[^a-z ]/g,' '),tw=tl.split(/\s+/).filter(w=>w.length>2&&!['and','the'].includes(w)),hit=tw.filter(w=>tok.includes(w)).length,body=tok.reduce((s,w)=>s+((g.f+' '+g.e).toLowerCase().includes(w)?.2:0),0);return[i,(hit?hit*4-(tw.length-hit)*1.5:0)+(tx.replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').includes(tl.trim().replace(/\s+/g,' '))?20:0)+body]}).filter(x=>x[1]>0.3).sort((a,b)=>b[1]-a[1]||a[0]-b[0]);
 if(gi.length&&(/explain|rule|grammar/.test(tx)||(gi[0][1]>=1&&tok.length<=3))){const g=GR[gi[0][0]];return hBot(`I found this rule: <b>${esc(g.t)}</b> (Level ${lvOf(gi[0][0])}, Unit ${unOf(gi[0][0])+1}). ${esc(g.e)}<br>Do you want the step-by-step explanation with practice?`,[['Explain it to me','gram:'+gi[0][0]],...PARTS.concat(GP[gi[0][0]]?[['p','Negative and questions (picture)']]:[]).map(a=>['I did not understand: '+a[1],'part:'+gi[0][0]+':'+a[0]]),...(gi[1]?[['Also: '+GR[gi[1][0]].t,'gram:'+gi[1][0]]]:[])])}
 if(/next|continue|start/.test(tx))return hBot('Your next lesson is ready.',[['Open my next lesson','next']]);
 if(/test|exam|placement/.test(tx))return hBot('The placement test finds your level (1 to 30) and opens everything below it. Unit tests have 15 questions and level tests 30 questions. You need 75% to pass.',[['Open placement test','go:test']]);
 if(/lock|unlock|open|locked/.test(tx))return hBot('A lesson opens after the previous lesson quiz. Inside a lesson you finish Reading, Writing, Listening and Speaking, then the quiz. A unit test opens after the 3 lessons and the grammar rule. A level opens after the previous level test or a higher placement result.');
 if(/update|sync|account|cloud/.test(tx))return hBot('Your progress is saved on this device and in your account (when you are signed in). Updates are never installed without asking you, and your progress is kept.',[['Open settings','go:settings']]);
 if(/speak|mic|microphone|pronounc/.test(tx))return hBot('In the Speaking section the browser listens while you read a sentence and shows wrong words in red. It works best in Chrome or Edge. If your browser cannot listen, you can read aloud and confirm yourself.');
 if(gi.length&&gi[0][1]>=2){const g=GR[gi[0][0]];return hBot(`This rule may help: <b>${esc(g.t)}</b> (Level ${lvOf(gi[0][0])}, Unit ${unOf(gi[0][0])+1}). ${esc(g.e)}<br>Do you want the step-by-step explanation with practice?`,[['Explain it to me','gram:'+gi[0][0]]])}
 const wd=tok.map(w=>w).find(w=>LEX[w])||Object.keys(LEX).find(w=>q.toLowerCase().includes(w)&&w.length>3);
 if(wd){const ls=LS.filter(l=>l.w.some(x=>x.en==wd));return hBot(`<b>${esc(wd)}</b> means “${esc(DEFS[wd]||'')}”${ls[0]?`<br>Found in: ${esc(ls[0].t)} (Level ${ls[0].lv})`:''}`,[['Listen','say:'+wd],...(ls[0]?[['Open the lesson','lesson:'+ls[0].id]]:[])])}
 const lz=LS.filter(l=>tok.some(w=>l.t.toLowerCase().includes(w)||l.ut.toLowerCase().includes(w))).slice(0,3);
 if(lz.length)return hBot('I found these lessons:',lz.map(l=>[l.t+' · L'+l.lv,'lesson:'+l.id]));
 hBot('I did not find that. I can explain a grammar rule (for example “explain passive”), find a lesson or word, or tell you how tests and levels work.',[['Next lesson','next'],['Grammar to do','gram']])}
/* ---------- Updates only with your permission; progress is kept ---------- */
let UPD=null;
function showUpd(){if($('#upd'))return;const d=document.createElement('div');d.id='upd';d.setAttribute('role','alertdialog');d.innerHTML='<b>A new version is ready</b><p>Your progress is saved and will not be lost. Update now?</p><button class=btn onclick="doUpd()">Update now</button> <button class=btn2 onclick="this.parentNode.remove()">Later</button>';document.body.appendChild(d)}
function doUpd(){try{if(USER)localStorage.setItem('ef_bak_'+USER,JSON.stringify(S))}catch(e){}const sw=()=>{if(UPD)UPD.postMessage('skip');else location.reload()};if(sb&&SESS)push().then(sw,sw);else sw()}
function regSW(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('sw.js').then(reg=>{
 const chk=w=>{if(w&&w.state=='installed'&&navigator.serviceWorker.controller){UPD=w;showUpd()}};
 if(reg.waiting)chk(reg.waiting);reg.addEventListener('updatefound',()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>chk(w))});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible')reg.update().catch(()=>{})})}).catch(()=>{});
 let rl=0;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(rl||!UPD)return;rl=1;location.reload()})}
function streak(){let n=0;const d=new Date(),k=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');if(!S.days[k(d)])d.setDate(d.getDate()-1);while(S.days[k(d)]){n++;d.setDate(d.getDate()-1)}return n}
function vHome(){const cl=curLevel(),nm=S.set.name?', '+esc(S.set.name):'',rv=Math.max(...Object.keys(CT).filter(k=>+k<=cl).map(Number));
 return`<h1>HOME</h1>${S.placed?'':`<div class=card style="border-color:var(--ac2)"><b>Take the placement test to start studying</b><p class=mut>You can look around the app now. To study lessons you first need your level.</p><button class=btn type=button onclick="go('test')">Take the placement test</button></div>`}<p class=mut>Welcome${nm}. Your level: <b>Level ${cl} · ${LV[cl-1]}</b> · ${doneN()} of ${LS.length} lessons finished · about ${CEFR(cl)}.${S.ls[cl]&&!(S.lt[cl]>=75)?' · <b>'+dayLbl(cl)+'</b>':''}</p>
 ${CT[cl]?'':`<div class=card><b>Lessons for Level ${cl} are still being written.</b><p class=mut>Your level is saved and open. Until the lessons arrive you can review Level ${rv}.</p><button class=btn2 onclick="OL=${rv};go('learn')">Open Level ${rv}</button></div>`}
 <div class=card><b>Daily goal</b> <span class=mut>${Math.min(S.days[today()]||0,S.set.goal)} of ${S.set.goal} quiz${S.set.goal>1?'zes':''} passed today · 🔥 ${streak()}-day streak</span><div class=bar><i style="width:${Math.min(100,(S.days[today()]||0)/S.set.goal*100)}%"></i></div></div>
 ${epOf(cl)?`<div class=card><b>Story time</b> <span class=mut>Episode ${cl}: ${esc(epOf(cl).t)}${S.sty[cl]!=null?' · best '+S.sty[cl]+'%':''}</span><br><button class=btn2 style="margin-top:8px" onclick="storyOpen(${cl})">▶ Watch the story</button></div>`:''}
 <div class=sks>${sk('Vocabulary','')}${sk('Reading','c3')}${sk('Listening','c2')}${sk('Grammar','c4')}${sk('Writing','')}${sk('Speaking','c2')}</div><div class=two>${todo()}${cal()}</div>`}
/* ---------- Learn map ---------- */
function lvBody(n){let h='';const ct=CT[n];
 if(S.ls[n]&&!(S.lt[n]>=75))h+=`<p class=mut><b>${dayLbl(n)}</b> · plan: finish each level in about ${PACE} days</p>`;
 if(n==21)h+=`<button class=row onclick="startRV()"><span>🔁 Review checkpoint · levels 1 to 20 · 30 questions</span><b>${S.rv?S.rv+'%':''}</b></button><p class=mut>Recommended before you start Level 21. It is not required.</p>`;
 for(let ui=0;ui<lvCnt(n);ui++){const gu=lvFirst(n)+ui;h+=`<h3>Unit ${ui+1} · ${ct?ct[ui][0]:''}</h3>`;if(!ct){h+='<p class=mut>Lessons are being written.</p>';continue}
  [0,1,2].forEach(li=>{const l=LM[gu*3+li],op=lessonOpen(l),dn=S.done[l.id]!=null;h+=`<button class="row ${op?'':'lock'}" ${op?'':'disabled'} onclick="go('lesson',${l.id})"><span>${dn?'✔':op?'○':'🔒'} Lesson ${li+1} · ${esc(l.t)}${!dn&&op&&S.sec[l.id]?' · '+popc(S.sec[l.id])+'/4 sections':''}</span><b>${dn?S.done[l.id]+'%':''}</b></button>`});
  if(GR[gu]){const gok=grOK(gu),gop=n<(S.start||1)||[0,1,2].every(i=>S.done[gu*3+i]!=null);h+=`<button class="row ${gop?'':'lock'}" ${gop?'':'disabled'} onclick="go('gram',${gu})"><span>${gok?'✔':gop?'📘':'🔒'} Grammar · ${esc(GR[gu].t)}</span><b>${gok?S.gr[gu]+'%':''}</b></button>`}
  const ok=utOpen(gu);h+=`<button class="row ${ok?'':'lock'}" ${ok?'':'disabled'} onclick="startUT(${gu})"><span>${S.ut[gu]>=75?'✔':ok?'📝':'🔒'} Unit ${ui+1} test · 15 questions</span><b>${S.ut[gu]!=null?S.ut[gu]+'%':''}</b></button>`}
 if(ct){const ok=ltOpen(n);h+=`<button class="row ${ok?'':'lock'}" ${ok?'':'disabled'} onclick="startLT(${n})"><span>${S.lt[n]>=75?'✔':ok?'🏁':'🔒'} Level ${n} test · 30 questions</span><b>${S.lt[n]!=null?S.lt[n]+'%':''}</b></button>`}
 return h}
function vLearn(){OL=OL||curLevel();let h='<h1>LEARN</h1><p class=mut>30 levels · each level takes about 2 weeks · 3 lessons per unit. Tap a level to open it.</p>';
 LV.forEach((nm,i)=>{const n=i+1,op=lvOpen(n),ct=!!CT[n],pc=ct?Math.round(LS.filter(l=>l.lv==n&&S.done[l.id]!=null).length/(lvCnt(n)*3)*100):0;
  h+=`<div class="card ${op?'':'dim'}"><button class=row style="border:0;padding:0" ${op?'':'disabled'} onclick="OL=${OL==n?-1:n};draw()"><span><b>${op?'🔓':'🔒'} Level ${n} · ${nm}</b>${n==S.start?' · your level':''}${S.lt[n]>=75?' ✔':''}</span><b>${ct?pc+'%':'soon'}</b></button>${OL==n?lvBody(n):''}</div>`});return h}
function vid(id,k){const v=((window.VIDEOS||{})[id]||[])[k]||{};return`<div class=vid>${v.yt?`<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?rel=0" title="${v.t||'Lesson video'}" allowfullscreen loading=lazy></iframe>`:v.src?`<video controls preload=none src="${v.src}"></video>`:`<span>Video ${k+1} for this lesson has not been added yet.</span>`}</div>${v.t?`<p class=mut>${v.t}</p>`:''}`}

/* ---------- Lesson: 4 sections, then the quiz ---------- */
const SEC=[['📖','Reading'],['✍️','Writing'],['🎧','Listening'],['🎤','Speaking']];
const secBit=(id,i)=>S.done[id]!=null||((S.sec[id]||0)>>i&1);
const secAll=id=>S.done[id]!=null||(S.sec[id]||0)==15;
function setSec(id,i){S.sec[id]=(S.sec[id]||0)|(1<<i);save()}
const secOpen=(id,i)=>i==0||secBit(id,i-1);
function vLesson(){const l=LM[A];if(!S.ls[l.lv]){S.ls[l.lv]=today();save()}const fv=S.fav[l.id],id=l.id,tabs=SEC.map((s,i)=>{const op=secOpen(id,i),dn=secBit(id,i);return`<button class="${P==i?'btn':'btn2'}" ${op?'':'disabled'} onclick="P=${i};draw()">${dn?'✔':op?s[0]:'🔒'} ${s[1]}</button>`}).join('')+`<button class="${P==4?'btn':'btn2'}" ${secAll(id)?'':'disabled'} onclick="P=4;draw()">${secAll(id)?'📝':'🔒'} Quiz</button>`;
 let body='';
 if(P==0)body=`${vid(id,0)}<div class=card><h2>Read</h2><p style="font-size:19px;line-height:1.7">${esc(l.r)}</p><button class=btn2 onclick="say(${esc(JSON.stringify(l.r)).replace(/&quot;/g,'&#34;')})">▶ Listen to the text</button> <button class=btn2 onclick="say(${esc(JSON.stringify(l.r)).replace(/&quot;/g,'&#34;')},.6)">🐢 Slowly</button></div><div class=card><h2>Key words</h2>${l.w.map(w=>`<div class=w><b>${esc(w.en)}</b><span class=dfn>${esc(w.d)}</span><button class=btn2 aria-label="Listen to ${esc(w.en)}" onclick="say(${esc(JSON.stringify(w.en)).replace(/&quot;/g,'&#34;')})">▶</button></div>`).join('')}</div><button class=btn onclick="startSec(${id},0)">${secBit(id,0)?'Answer the questions again':'Now answer 3 questions about the text'}</button>`;
 else if(P==1)body=`<div class=card><h2>Listen and write</h2><p>${l.lv<=2?'You will hear a word. Write it.':'You will hear a sentence. Write it exactly.'} You can play it again, or slowly.</p></div><button class=btn onclick="startSec(${id},1)">${secBit(id,1)?'Practise again':'Start writing'}</button>`;
 else if(P==2)body=`<div class=card><h2>Listen and choose</h2><p>You will hear a sentence. Choose the sentence you heard.</p></div><button class=btn onclick="startSec(${id},2)">${secBit(id,2)?'Practise again':'Start listening'}</button>`;
 else if(P==3)body=vSpeak(l);
 else body=`<div class=card><h2>Final quiz</h2><p>Pass the quiz with 75% or more to finish the lesson.</p><button class=btn onclick="startLesson(${id})">Start quiz</button> <button class=btn2 onclick="S.fav[${id}]=${fv?0:1};save();draw()">${fv?'★ Saved':'☆ Save lesson'}</button></div>`;
 return`<button class=btn2 onclick="OL=${l.lv};go('learn')">← Back to Level ${l.lv}</button><h1>${esc(l.t)}</h1><p class=mut>Level ${l.lv} · Unit ${l.ui+1} · ${esc(l.ut)} · Lesson ${l.n}</p><div class=tabs style="flex-wrap:wrap">${tabs}</div>${body}`}
/* ---------- Word diff (dictation and reading aloud) ---------- */
const nw=s=>String(s).toLowerCase().replace(/[’]/g,"'").replace(/\bcan't\b/g,'can not').replace(/\bwon't\b/g,'will not').replace(/n't\b/g,' not').replace(/\b(it|he|she|that|there|what|here|who|where)'s\b/g,'$1 is').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'ll\b/g,' will').replace(/'ve\b/g,' have').replace(/'d\b/g,' would').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean);
function wdiff(user,ans){const A=nw(user),B=nw(ans),dp=Array.from({length:A.length+1},()=>Array(B.length+1).fill(0));
 for(let i=1;i<=A.length;i++)for(let j=1;j<=B.length;j++)dp[i][j]=A[i-1]==B[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
 const hit=new Set();let i=A.length,j=B.length;while(i>0&&j>0){if(A[i-1]==B[j-1]){hit.add(j-1);i--;j--}else if(dp[i-1][j]>=dp[i][j-1])i--;else j--}
 const raw=String(ans).split(/\s+/).filter(Boolean);let k=0;
 const html=raw.map(w=>{const n=nw(w);if(!n.length)return esc(w);const ok=hit.has(k);k+=n.length;return`<span style="color:var(--${ok?'ok':'bad'});font-weight:700;${ok?'':'text-decoration:underline'}">${esc(w)}</span>`}).join(' ');
 return{acc:B.length?Math.round(hit.size/B.length*100):0,html,exact:nw(user).join(' ')==B.join(' ')}}
/* ---------- Speaking: read aloud, the browser listens, we correct ---------- */
const SRC=window.SpeechRecognition||window.webkitSpeechRecognition;
let SPK=null;
function vSpeak(l){const id=l.id;if(!SPK||SPK.id!=id)SPK={id,i:0,tries:0,res:null,items:(l.ds.length>=2?l.ds:l.ss).slice(0,2),busy:0};
 if(SPK.i>=SPK.items.length){setSec(id,3);return`<div class=card>${cele('Reading aloud finished','You can now take the final quiz.')}<button class=btn onclick="P=4;draw()">Go to the quiz</button></div>`}
 const s=SPK.items[SPK.i],r=SPK.res,js=esc(JSON.stringify(s)).replace(/&quot;/g,'&#34;');
 return`<div class=card><h2>Read aloud · ${SPK.i+1} of ${SPK.items.length}</h2><p style="font-size:21px;line-height:1.7">${r?r.html:esc(s)}</p>
 <button class=btn2 onclick="say(${js})">▶ Listen first</button> <button class=btn2 onclick="say(${js},.6)">🐢 Slowly</button><br>
 ${SRC?`<button class=btn id=mic onclick="micGo()" ${SPK.busy?'disabled':''}>${SPK.busy?'🎤 Listening…':'🎤 Tap and read the sentence'}</button>`:`<p class=mut>This browser cannot listen to your voice. Listen to the model, read the sentence aloud yourself, then tap the button.</p><button class=btn onclick="spkDone()">✔ I read it aloud</button>`}
 <p id=sm class=msg>${r?(r.acc>=70?`<b style="color:var(--ok)">Well done! ${r.acc}% correct.</b>`:`<b style="color:var(--bad)">${r.acc}% correct.</b> Red words need practice. Listen again and retry.${r.heard?` <span class=mut>I heard: “${esc(r.heard)}”</span>`:''}`):''}</p>
 ${r&&r.acc>=70?`<button class=btn onclick="spkDone()">Next</button>`:SPK.tries>=3?`<button class=btn2 onclick="spkDone()">Continue anyway</button>`:''}</div>`}
function micGo(){if(!SRC||SPK.busy)return;const s=SPK.items[SPK.i];let got=0;const r=new SRC();r.lang=S.set.acc;r.interimResults=false;r.maxAlternatives=3;SPK.busy=1;
 r.onresult=e=>{got=1;let best=null;for(let k=0;k<e.results[0].length;k++){const t=e.results[0][k].transcript,d=wdiff(t,s);if(!best||d.acc>best.acc)best={acc:d.acc,html:d.html,heard:t}}SPK.res=best;SPK.tries++;const t=S.sk.Speaking=S.sk.Speaking||[0,0];t[1]++;if(best.acc>=70)t[0]++;save()};
 r.onerror=e=>{got=1;SPK.busy=0;const m=e.error=='not-allowed'||e.error=='service-not-allowed'?'The microphone is blocked. Allow it in your browser settings, then try again.':e.error=='no-speech'?'I did not hear anything. Try again.':'Could not listen ('+e.error+').';SPK.res=null;draw();const x=$('#sm');if(x){x.textContent=m;x.className='msg bad'}};
 r.onend=()=>{SPK.busy=0;if(!got){const x=$('#sm');if(x)x.textContent='I did not hear anything. Try again.'}else draw()};
 try{r.start();const b=$('#mic');if(b){b.disabled=true;b.textContent='🎤 Listening…'}}catch(e){SPK.busy=0}}
function spkDone(){SPK.i++;SPK.res=null;SPK.tries=0;draw()}
/* ---------- Celebration (no sound) ---------- */
function confetti(){if(S.set.calm||(matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
 const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const x=c.getContext('2d'),cols=['#14284f','#c9a45c','#58c4e6','#ef7f5a','#0f9d6b','#a51fcb'],
 P=Array.from({length:140},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,w:6+Math.random()*7,h:9+Math.random()*9,vx:-2+Math.random()*4,vy:2+Math.random()*4,r:Math.random()*6,vr:-.2+Math.random()*.4,c:cols[Math.random()*cols.length|0]}));let t=0;
 (function f(){t++;x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});if(t<170)requestAnimationFrame(f);else c.remove()})()}
const nmS=()=>S.set.name?', '+esc(S.set.name):'';
function cele(t,s){setTimeout(()=>{try{confetti()}catch(e){}},60);return`<div class=cele><div style="font-size:54px" aria-hidden=true>🎉</div><h1>${t}</h1><p>${s}</p></div>`}
/* ---------- Quiz engine ---------- */
let Q=null;
const others=(k,v,n)=>{const u=new Set([v]),o=[];for(const w of sh(POOL.filter(w=>w[k]!=v))){if(u.has(w[k]))continue;u.add(w[k]);o.push(w[k]);if(o.length>=n)break}return o};
const mc=w=>({q:`What does “${w.en}” mean?`,k:'Vocabulary',say:w.en,o:sh([w.d,...others('d',w.d,3)]),a:w.d,w});
const tw=w=>({q:`Which word matches this meaning? “${w.d}” (${w.en.length} letters, starts with “${w.en[0]}”)`,k:'Writing',type:1,a:w.en,w});
const dict=w=>({q:'Listen and type the word.',k:'Writing',say:w.en,type:1,a:w.en,w,dict:1});
const dsq=s=>({q:'Listen and type the sentence.',k:'Writing',say:s,type:1,a:s,dict:1});
const lsq=it=>({q:'Listen and choose the sentence you hear.',k:'Listening',say:it.a,o:sh(it.o.slice()),a:it.a});
const rdq=(l,i)=>({q:l.q[i][0],k:'Reading',r:l.r,p:esc(l.r),o:sh(l.q[i].slice(1)),a:l.q[i][1]});
const ordQ=s=>({q:'Put the words in order.',k:'Sentences',ord:sh(s.split(' ')),a:s});
const rnd=a=>a[Math.random()*a.length|0];
const dsOf=l=>rnd(l.ds.length?l.ds:l.ss);
function runQuiz(qs,title,fin){INQ=1;Q={qs,i:0,s:0,title,fin,lock:0,pick:[]};showQ()}
function showQ(){const q=Q.qs[Q.i];Q.lock=0;Q.pick=[];
 let h=`<p class=mut>${Q.title} · ${Q.i+1} of ${Q.ad?Q.ad.n:Q.qs.length}</p><div class=bar><i style="width:${Q.i/(Q.ad?Q.ad.n:Q.qs.length)*100}%"></i></div><h2>${q.q}</h2>${q.p?`<div class=card style="font-size:18px;line-height:1.7">${q.p}</div>`:''}`;
 if(q.say)h+=`<button class=btn2 onclick="say(Q.qs[Q.i].say)">▶ Listen</button> <button class=btn2 onclick="say(Q.qs[Q.i].say,.6)">🐢 Slowly</button>`;
 if(q.ord)h+=`<div class=line id=ln></div><div id=bank></div><button class=btn id=chk onclick="chkOrd()" disabled>Check</button>`;
 else if(q.type)h+=`<input id=ti autocomplete=off autocapitalize=none spellcheck=false placeholder="Type your answer" style="width:100%" onkeydown="if(event.key=='Enter')chkType()"><br><button class=btn style="margin-top:10px" onclick="chkType()">Check</button>`;else h+=q.o.map((o,j)=>`<button class=opt ${q.ar?'dir=rtl':''} onclick="pick(${j})">${esc(o)}</button>`).join('');
 $('#app').innerHTML=h+'<div id=fb></div>';if(q.ord)ordDraw();if(q.say&&S.set.auto&&!q.type)say(q.say);const t=$('#ti');if(t)t.focus()}
function ordDraw(){const q=Q.qs[Q.i];$('#ln').innerHTML=Q.pick.map((t,k)=>`<button class=chip onclick="Q.pick.splice(${k},1);ordDraw()">${esc(q.ord[t])}</button>`).join('');
 $('#bank').innerHTML=q.ord.map((t,k)=>Q.pick.includes(k)?'':`<button class=chip onclick="ordAdd(${k})">${esc(t)}</button>`).join('');$('#chk').disabled=Q.pick.length!=q.ord.length}
function ordAdd(k){Q.pick.push(k);ordDraw()}
function chkType(){if(Q.lock)return;Q.lock=1;const q=Q.qs[Q.i],u=$('#ti').value,d=wdiff(u,q.a);q.diff=d.html;q.acc=d.acc;fin1(d.exact,q,u)}
function chkOrd(){if(Q.lock)return;Q.lock=1;const q=Q.qs[Q.i],ans=Q.pick.map(k=>q.ord[k]).join(' ');fin1(ans==q.a,q,ans)}
function pick(j){if(Q.lock)return;Q.lock=1;const q=Q.qs[Q.i];document.querySelectorAll('.opt').forEach((b,k)=>{if(q.o[k]==q.a)b.classList.add('ok');else if(k==j)b.classList.add('no')});fin1(q.o[j]==q.a,q,q.o[j])}
/* ---------- Built-in tutor: explains why an answer is right or wrong. Rule-based, works offline, no AI service or internet needed ---------- */
const tk=t=>String(t).toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).filter(Boolean);
const evid=(raw,q,a)=>{const want=new Set(tk(q+' '+a).filter(w=>w.length>2));let best='',bs=0;sents(raw).forEach(x=>{const n=tk(x).filter(w=>want.has(w)).length;if(n>bs){bs=n;best=x}});return best};
/* An example sentence from the lessons that contains the word (shortest one that fits). */
const exOf=en=>{const re=new RegExp('\\b'+en.replace(/[^a-z' ]/gi,'')+'\\b','i');let b='';for(const l of LS){for(const x of l.ss)if(re.test(x)&&(!b||x.length<b.length)&&wc(x)>=3)b=x}return b};
const lev=(a,b)=>{const m=[...Array(a.length+1)].map((_,i)=>[i]);for(let j=1;j<=b.length;j++)m[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]==b[j-1]?0:1));return m[a.length][b.length]};
/* Finds a grammar rule whose examples contain the answer and share words with the sentence. */
const ruleFor=(sentence,ans)=>{const t=new Set(tk(sentence)),a=tk(ans).join(' ');let best=null,bs=0;GR.forEach(g=>{const ex=g.x.map(x=>tk(x).join(' '));if(!ex.some(x=>(' '+x+' ').includes(' '+a+' ')))return;const sc=tk(g.x.join(' ')+' '+g.t+' '+g.f).filter(w=>t.has(w)).length;if(sc>bs){bs=sc;best=g}});return bs>=2?best:null};
function tutor(q,ok,g){
 const em=t=>t?`<div class=tutor><b>Tutor</b><br>${t}</div>`:'',q1=t=>'“'+esc(t)+'”',ex=en=>{const e=exOf(en);return e?`<br><i>Example:</i> ${q1(e)}`:''};
 try{
  if(q.w&&q.k=='Vocabulary'){const w=q.w,o=g!=null?ALL.find(x=>x.d==g):0;
   if(ok)return em(`<b>Yes.</b> <b>${esc(w.en)}</b> means ${q1(w.d)}.${ex(w.en)}<br><i>Tip:</i> say the word aloud once, then use it in your own sentence.`);
   const others=(q.o||[]).filter(x=>x!=q.a&&x!=g).map(x=>ALL.find(y=>y.d==x)).filter(Boolean).slice(0,2);
   return em(`<b>${esc(w.en)}</b> means ${q1(w.d)}.${ex(w.en)}`+(o&&o.en!=w.en?`<br><b>Why not that one?</b> You chose ${q1(g)}. That is the meaning of <b>${esc(o.en)}</b>, not of <b>${esc(w.en)}</b>.`:'')+(others.length?`<br><b>The other choices:</b> `+others.map(x=>`${q1(x.d)} is <b>${esc(x.en)}</b>`).join('; ')+'.':'')+`<br><i>Tip:</i> link <b>${esc(w.en)}</b> to its meaning and make a sentence with it.`)}
  if(q.w&&q.type){const w=q.w,u=String(g||'').trim().toLowerCase(),o=u?ALL.find(x=>x.en==u):0;
   if(ok)return em(`<b>Correct.</b> ${q1(w.d)} is <b>${esc(w.en)}</b>.${ex(w.en)}`);
   const d=u?lev(u,w.en):9;
   return em(`${q1(w.d)} is <b>${esc(w.en)}</b>.`+(o&&o.en!=w.en?`<br>You typed <b>${esc(o.en)}</b>. That is a real word, but it means ${q1(o.d)}.`:d<=2?`<br><b>Very close!</b> Only the spelling is different. You wrote <b>${esc(u)}</b>; the word has ${w.en.length} letters.`:`<br>The word has ${w.en.length} letters and starts with “${esc(w.en[0])}”.`)+ex(w.en)+`<br><i>Tip:</i> spell it letter by letter: ${esc(w.en.split('').join(' - '))}.`)}
  if(q.dict){if(ok)return em('<b>Perfect.</b> You heard every word.');const A=tk(q.a),B=tk(g||''),miss=A.filter(x=>!B.includes(x)),ext=B.filter(x=>!A.includes(x));
   return em(`You got ${q.acc!=null?q.acc+'%':'part'} of the words.`+(miss.length?`<br><b>Missing or misspelled:</b> ${miss.map(esc).join(', ')}.`:'')+(ext.length?`<br><b>Not in the sentence:</b> ${ext.map(esc).join(', ')}.`:'')+`<br><i>Tip:</i> press “Slowly”, listen again and write one word at a time.`)}
  if(q.ord){if(ok)return em('<b>Good word order.</b>');const gw=String(g||'').split(' '),aw=q.a.split(' ');let i=0;while(i<aw.length&&gw[i]==aw[i])i++;
   return em(`Your sentence goes wrong at word ${i+1}: you put ${q1(gw[i]||'…')} but the sentence needs ${q1(aw[i]||'')}.<br>The full sentence is: ${q1(q.a)}<br><i>Tip:</i> in English the usual order is <b>who</b> (subject), then <b>what they do</b> (verb), then the rest.`)}
  if(q.k=='Listening'&&q.o){if(ok)return em('<b>Good listening.</b> You caught the exact words.');const A=tk(q.a),B=tk(g||''),miss=A.filter(x=>!B.includes(x)),ext=B.filter(x=>!A.includes(x));
   return em(`You heard: ${q1(q.a)}`+(ext.length||miss.length?`<br>Your choice has ${ext.length?q1(ext.join(' ')):'different words'} where the sentence has ${miss.length?q1(miss.join(' ')):'other words'}. Those words sound similar, so listen to them again.`:'')+`<br><i>Tip:</i> use “Slowly” and focus on the small words.`)}
  if(q.k=='Reading'&&q.r){const e=evid(q.r,q.q,q.a);if(!e)return '';const kw=[...new Set(tk(q.q).filter(w=>w.length>3&&tk(q.r).includes(w)))].slice(0,3);
   return em(ok?`<b>Right.</b> The text says: ${q1(e)}`:`The answer is ${q1(q.a)}.<br>Look at this sentence in the text: ${q1(e)}`+(g?`<br>${q1(g)} is not what the text says.`:'')+(kw.length?`<br><i>Tip:</i> find the key words (${kw.map(esc).join(', ')}) from the question in the text, then read that sentence slowly.`:''))}
  if(q.gr){const r=q.gr;return em(ok?`<b>Right.</b> ${esc(r.e)}<br><i>Example:</i> ${q1(r.x[0])}`:`<b>Rule:</b> ${esc(r.t)}<br>${esc(r.e)}<br><b>Pattern:</b> ${esc(r.f)}<br><b>Common mistake:</b> <span style="color:var(--bad)">✘ ${esc(r.m[0])}</span> <span style="color:var(--ok)">✔ ${esc(r.m[1])}</span><br><i>Example:</i> ${q1(r.x[0])}`)}
  if(q.k=='Grammar'&&q.o&&/___/.test(q.q)){const full=q.q.replace('___',q.a),r=ruleFor(full,q.a);
   return em((ok?`<b>Right.</b> `:'')+`The full sentence is: ${q1(full)}`+(!ok&&g?`<br>${q1(q.q.replace('___',g))} does not sound right in English.`:'')+(r?`<br><b>Related rule:</b> ${esc(r.t)}. ${esc(r.e)}<br><b>Pattern:</b> ${esc(r.f)}`:''))}
 }catch(e){}
 return ''}
function fin1(ok,q,g){Q.last=ok;const k=q.k||'Other',t=S.sk[k]=S.sk[k]||[0,0];t[1]++;if(ok)t[0]++;if(ok)Q.s++;else if(q.w){const w=q.w;S.mist=[w,...S.mist.filter(m=>m.en!=w.en)].slice(0,50);if(S.vocab[w.en]){S.vocab[w.en].box=0;S.vocab[w.en].due=Date.now();S.vocab[w.en].t=Date.now()}}save();
 $('#fb').innerHTML=`<p style="color:var(--${ok?'ok':'bad'})"><b>${ok?'Correct!':'Not quite.'}</b></p>${ok?'':q.diff?`<p>The correct answer, with your mistakes marked:<br><span style="font-size:19px">${q.diff}</span></p>`:`<p>Answer: <b>${esc(q.a)}</b></p>`}${tutor(q,ok,g)}<button class=btn onclick="nextQ()">${Q.i+1==Q.qs.length?'Finish':'Next'}</button>`;const n=$('#fb .btn');if(n)n.focus()}
const ST=[5,4,4,3,3,2,2,2,1,1,1,1,1,1];
function nextQ(){if(Q.ad){const a=Q.ad,i=Q.i,b=a.h[i],ty=a.k[i]==0;a.r.push([b,Q.last]);a.post=a.post.map((v,j)=>{const p=pLike(PTH[j],b,ty);return v*(Q.last?p:1-p)});const z=Math.max(...a.post);a.post=a.post.map(v=>v/z);if(i+1<a.n)Q.qs.push(pickQ(a))}
 Q.i++;if(Q.i>=Q.qs.length){const p=Math.round(Q.s/Q.qs.length*100);INQ=0;$('#app').innerHTML=Q.fin(p);scrollTo(0,0)}else showQ()}
const wrap=(msg,ok,nx)=>`<p>${ok?'Passed! ':'You need 75% to pass. '}${msg}</p>${nx}`;
const pbQ=c=>c[2]?{q:c[1],k:c[4]?'Reading':c[5]?'Listening':'Grammar',r:c[4]||'',p:c[4]?esc(c[4]):'',say:c[5]||'',o:sh(c[2].split('|')),a:c[3]}:{q:c[1],k:'Writing',type:1,a:c[3]};
function startSec(id,i){const l=LM[id];POOL=lvWords(l.lv);let qs;
 if(i==0)qs=[0,1,2].map(k=>rdq(l,k));
 else if(i==1)qs=l.lv<=2?sh(l.w).slice(0,3).map(dict):sh(l.ds.length>=3?l.ds:l.ss).slice(0,3).map(dsq);
 else qs=sh(l.l).slice(0,4).map(lsq);
 runQuiz(qs,SEC[i][1]+' · '+l.t,pct=>{const ok=pct>=67;if(ok){setSec(id,i);S.days[today()]=S.days[today()]||0}
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!',SEC[i][1]+' complete.'):'<p>You need 2 correct answers out of 3. Look at the mistakes and try again.</p>'}<button class=btn onclick="P=${ok?i+1:i};go('lesson',${id});P=${ok?i+1:i};draw()">${ok?(i<3?'Next: '+SEC[i+1][1]:'Go on'):'Try again'}</button> <button class=btn2 onclick="OL=${l.lv};go('learn')">Learning map</button>`})}
function startLesson(id){const l=LM[id];POOL=lvWords(l.lv);
 runQuiz(sh([...sh(l.w).map(mc),lsq(rnd(l.l)),lsq(rnd(l.l)),tw(l.w[2]),dsq(dsOf(l)),ordQ(l.s),rdq(l,Math.random()*3|0)]),l.t,pct=>{const ok=pct>=75;if(ok){S.done[id]=Math.max(S.done[id]||0,pct);S.days[today()]=(S.days[today()]||0)+1;l.w.forEach(w=>{if(!S.vocab[w.en])S.vocab[w.en]={ar:w.ar,box:0,due:Date.now(),t:Date.now()}});save()}
  const nx=ok&&l.n<3?`<button class=btn onclick="P=0;go('lesson',${id+1})">Next lesson</button> `:ok&&l.n==3?`<button class=btn onclick="go('gram',${l.gu})">Next: Grammar rule</button> `:'';
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!','Lesson passed. The words were added to your Review list.'):'<p>You need 75% to pass. Review the lesson and try again.</p>'}${nx}<button class=btn2 onclick="P=0;go('lesson',${id})">Back to lesson</button> <button class=btn2 onclick="OL=${l.lv};go('learn')">Learning map</button>`})}
function startUT(gu){if(needTest())return;const n=lvOf(gu);POOL=lvWords(n);const lz=LS.filter(l=>l.gu==gu),ws=sh(lz.flatMap(l=>l.w));
 runQuiz(sh([...ws.slice(0,5).map(mc),...ws.slice(5,7).map(tw),...sh(lz).slice(0,2).map(l=>dsq(dsOf(l))),...lz.map(l=>lsq(rnd(l.l))),...lz.map(l=>rdq(l,Math.random()*3|0))]),'Unit '+(unOf(gu)+1)+' test',pct=>{const ok=pct>=75;S.ut[gu]=Math.max(S.ut[gu]||0,pct);if(ok)S.days[today()]=(S.days[today()]||0)+1;save();
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!','Unit '+(unOf(gu)+1)+' complete. '+(unOf(gu)<lvCnt(n)-1?'The next unit is open now.':'The level test is open now.')):''}`+wrap(ok?'':'Review this unit and try again.',ok,`<button class=btn onclick="OL=${n};go('learn')">Learning map</button>`)})}
function startRV(){if(needTest())return;const lz=LS.filter(l=>l.lv<=20);POOL=lz.flatMap(l=>l.w);const ws=sh(POOL),R=()=>rnd(lz);
 runQuiz(sh([...ws.slice(0,8).map(mc),...ws.slice(8,11).map(tw),...Array.from({length:4},()=>dsq(dsOf(R()))),...Array.from({length:6},()=>lsq(rnd(R().l))),...Array.from({length:5},()=>rdq(R(),Math.random()*3|0)),...Array.from({length:4},()=>ordQ(R().s))]),'Review checkpoint',pct=>{const ok=pct>=75;S.rv=Math.max(S.rv||0,pct);if(ok)S.days[today()]=(S.days[today()]||0)+1;save();
  return`<h1>${pct}%</h1>${ok?cele('Great memory'+nmS()+'!','You remember Levels 1 to 20 well. Level 21 is waiting.'):''}<p>${ok?'Your review is strong.':'Some earlier material needs another look. Open the Review tab and the Mistakes list, then try again whenever you like.'}</p><button class=btn onclick="OL=21;go('learn')">Learning map</button>`})}
function startLT(n){if(needTest())return;POOL=lvWords(n);const lz=LS.filter(l=>l.lv==n),ws=sh(POOL),pb=[...PB].sort((a,b)=>Math.abs(a[0]-n)-Math.abs(b[0]-n)||Math.random()-.5).slice(0,2).map(pbQ),R=()=>rnd(lz);
 runQuiz(sh([...ws.slice(0,6).map(mc),...ws.slice(6,9).map(tw),...Array.from({length:4},()=>dsq(dsOf(R()))),...sh(lz).slice(0,6).map(l=>lsq(rnd(l.l))),...sh(lz).slice(0,6).map(l=>rdq(l,Math.random()*3|0)),...sh(lz).slice(0,3).map(l=>ordQ(l.s)),...pb]),'Level '+n+' test',pct=>{const ok=pct>=75;S.lt[n]=Math.max(S.lt[n]||0,pct);save();
  const nxt=n<NLV?(CT[n+1]?'Level '+(n+1)+' is open now.':'Level '+(n+1)+' is open (lessons are being written).'):'';
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!','You finished Level '+n+(n<NLV?' and moved to Level '+(n+1)+' now.':'.')):''}`+wrap(ok?'You finished Level '+n+'. '+nxt+(paceTxt(n)?'<br><b>'+paceTxt(n)+'</b>':''):'Review the units that felt hard and try again.',ok,ok?`<button class=btn onclick="go('cert',${n})">Get certificate</button> <button class=btn2 onclick="go('learn')">Learning map</button>`:`<button class=btn onclick="OL=${n};go('learn')">Learning map</button>`)})}
/* ---------- Grammar: one rule per unit, explained step by step ---------- */
let GN=0;
const GR=window.GRAMMAR||[];
const grOK=gu=>S.gr[gu]!=null;
function narrate(gu,slow){const g=GR[gu];if(!g)return;try{speechSynthesis.cancel()}catch(e){}
 const parts=[['n0','Today’s rule: '+g.t+'.'],['n1',g.e],['n2','The pattern is: '+g.f.replace(/·/g,', ').replace(/\+/g,' plus ')],...g.x.map((x,i)=>['x'+i,(i?'':'Examples. ')+x]),['n3','A common mistake: '+g.m[0]+' Say it like this: '+g.m[1]]];
 let k=0;const nxt=()=>{document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));if(k>=parts.length)return;const p=parts[k++],el=document.getElementById(p[0]);if(el)el.classList.add('hl');try{const u=new SpeechSynthesisUtterance(p[1]);u.lang=S.set.acc;u.rate=slow?.7:Math.min(S.set.rate,.95);u.onend=()=>setTimeout(nxt,350);u.onerror=()=>{};speechSynthesis.speak(u)}catch(e){}};nxt()}
function startGram(gu){const g=GR[gu];POOL=ALL;runQuiz(g.q.map(q=>({q:q[0],k:'Grammar',gr:g,o:sh(q.slice(1)),a:q[1]})),'Grammar · '+g.t,pct=>{const ok=pct>=67;if(ok){S.gr[gu]=Math.max(S.gr[gu]||0,pct);S.days[today()]=S.days[today()]||0;save()}
  return`<h1>${pct}%</h1>${ok?cele('Well done'+nmS()+'!','You learned a new rule: '+esc(g.t)):'<p>You need 2 correct answers out of 3. Listen to the explanation again and retry.</p>'}${ok?`<div class=card><b>Did you understand this rule?</b><p><button class=btn onclick="OL=${lvOf(gu)};go('learn')">Yes, I understood</button> <button class=btn2 onclick="GN=1;go('gram',${gu})">Not completely. Explain again</button></p></div>`:`<button class=btn onclick="go('gram',${gu})">Back to the explanation</button>`}`})}

/* ---------- Grammar posters (picture explanations), part chooser, share/install ---------- */
const GP={3:['pressimple'],6:['prescont'],12:['pastsimple'],13:['pastsimple'],15:['pastcont'],16:['presperf','presperfs'],24:['presperf'],19:['future'],32:['pastperf'],40:['pastperfcont']};
const gpSrc=n=>'g-'+n+'.jpg';
function zoomImg(n){const d=document.createElement('div');d.id='zm';d.setAttribute('role','dialog');d.innerHTML='<button class=btn type=button onclick="this.parentNode.remove()">✕ Close</button><p>Scroll sideways and up or down to read the picture</p><div class=zs><img alt="Grammar poster" src="'+gpSrc(String(n).replace(/[^a-z]/g,''))+'"></div>';document.body.appendChild(d)}
const pImg=gu=>(GP[gu]||[]).map(n=>`<img class=pimg src="${gpSrc(n)}" alt="Poster: ${esc(GR[gu].t)}" loading=lazy onclick="zoomImg('${n}')">`).join('');
const PARTS=[['f','Pattern'],['u','When to use it'],['x','Examples'],['m','Common mistake']];
function gPart(gu,k){const g=GR[gu];if(!g)return'';let h='';
 if(k=='f'){const bits=g.f.split(/\s*[+·]\s*/).filter(Boolean);h=`<b>The pattern, step by step</b><br>`+bits.map((b,i)=>`<div class=stp><b class=n>${i+1}</b><span>${esc(b)}${i==0?' (comes first)':''}</span></div>`).join('')+`<div>Put them in this order: <b style="color:var(--ac)">${esc(g.f)}</b><br>Example: <b>${esc(g.x[0])}</b></div>`}
 else if(k=='u')h=`<b>When do we use it?</b><br>${esc(g.e)}`;
 else if(k=='x')h=`<b>Examples</b>`+g.x.map(x=>`<div class=stp><span>• <b>${esc(x)}</b></span></div>`).join('')+`<div class=mut>Read each one aloud. Change one word and make your own sentence.</div>`;
 else if(k=='m')h=`<b>A common mistake</b><br><span style="color:var(--bad)">✘ ${esc(g.m[0])}</span><br><span style="color:var(--ok)">✔ ${esc(g.m[1])}</span>`;
 if(k=='p'||k=='f'||k=='u'||k=='x')h+=((GP[gu]&&(k=='p'||k=='f'))?'<br>'+(k=='p'?'<span class=mut>See the negative and question forms in the picture. Tap it to enlarge.</span>':'<span class=mut>Here is the same idea as a picture:</span>')+pImg(gu):'');
 if(k=='p'&&!GP[gu])h='This rule has no picture yet. Use the pattern and examples.';
 return h}
function gPartsRow(gu,hlp){const ks=PARTS.concat(GP[gu]?[['p','Negative and questions (picture)']]:[]);return ks.map(a=>`<button type=button class=chip onclick="${hlp?`hAct('part:${gu}:${a[0]}')`:`gShow(${gu},'${a[0]}')`}">${a[1]}</button>`).join('')}
function gShow(gu,k){const e=$('#gp');if(e)e.innerHTML='<div class=card style="margin:8px 0">'+gPart(gu,k)+'<p class=mut>Better now?</p><button type=button class=btn2 onclick="gShow('+gu+',\'x\')">Show examples</button></div>'}
function vShare(){const url=appUrl(),ios=/iphone|ipad|ipod/i.test(navigator.userAgent||'');
 const st=(n,t)=>`<div class=stp><b class=n>${n}</b><span>${t}</span></div>`;
 return`<h1>INSTALL AND SHARE</h1><p class=mut>Install the app on your home screen and share it with your friends.</p>
 ${isApp()?'<div class=card><b>✔ The app is installed on this device.</b></div>':''}
 <div class=card><h2>How to install</h2>${DIP?'<button class=btn type=button onclick="DIP.prompt();DIP.userChoice.finally(()=>{DIP=null;draw()})">'+ic('dl')+' Install now</button>':''}
 <h3>📱 iPhone / iPad (Safari)</h3>${st(1,'Open this site in <b>Safari</b>.')}${st(2,'Tap the <b>Share</b> button ⎘ at the bottom of the screen.')}${st(3,'Choose <b>Add to Home Screen</b> ➕.')}${st(4,'Tap <b>Add</b>. The app opens full screen with its own icon.')}
 <h3>🤖 Samsung / Android (Chrome)</h3>${st(1,'Open this site in <b>Chrome</b>.')}${st(2,'Tap the <b>three dots</b> ⋮ at the top of the browser.')}${st(3,'Choose <b>Install app</b> or <b>Add to Home screen</b>.')}${st(4,'Tap <b>Install</b>.')}
 <h3>💻 Computer (PC / Mac)</h3>${st(1,'Open this site in <b>Chrome</b> or <b>Edge</b>.')}${st(2,'Click the <b>install icon</b> ⬇️ at the right of the address bar.')}${st(3,'Click <b>Install</b>.')}${ios?'<p class=mut>You are on an iPhone or iPad: use the first guide.</p>':''}</div>
 <div class=card><h2>Share the app</h2><p class=mut>Send the link on WhatsApp, Telegram or any app.</p><button class=btn type=button onclick="shareApp()">${ic('share')} Share the app</button> <button class=btn2 type=button onclick="copyLink()">${ic('copy')} Copy link</button><p id=shm class=mut role=status></p><p class=mut dir=ltr style="word-break:break-all">${esc(url)}</p></div>
 <div class=card style="text-align:center"><h2>QR code</h2><img class=qr src="qr.png" alt="QR code of the app" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><p class=mut hidden>qr.png was not found. Put your QR image in the app folder with the name qr.png.</p><p class=mut>Scan the code with your phone camera to open the app directly.</p></div>`}
function appUrl(){try{return location.origin+location.pathname.replace(/index\.html$/,'')}catch(e){return location.href}}
function sm(t){const e=$('#shm');if(e)e.textContent=t}
async function shareApp(){const d={title:'LanguWay English',text:'Learn English free from A1 to C1 with LanguWay English.',url:appUrl()};
 try{if(navigator.share){await navigator.share(d);return}}catch(e){if(e&&e.name=='AbortError')return}
 copyLink()}
function copyLink(){const u=appUrl(),ok=()=>sm('Link copied.');
 try{if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(u).then(ok,fb)}catch(e){}
 fb();function fb(){const t=document.createElement('textarea');t.value=u;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(e){sm(u)}t.remove()}}
function vGram(){const gu=A,g=GR[gu];if(!g)return'<h1>GRAMMAR</h1><div class=card><p>This rule is not ready yet.</p></div>';const n=lvOf(gu),ui=unOf(gu),again=GN==1;
 const q=encodeURIComponent(g.t+' English grammar lesson for learners');
 return`<button class=btn2 onclick="OL=${n};go('learn')">← Back to Level ${n}</button><h1>GRAMMAR</h1><p class=mut>Level ${n} · Unit ${ui+1} · ${esc((CT[n]?CT[n][ui][0]:'')||'')}</p>
 <div class=card><div id=n0 class=gl><h2>${esc(g.t)}</h2></div><div id=n1 class=gl><p style="font-size:18px">${esc(g.e)}</p></div><div id=n2 class=gl><p><b>Pattern:</b> <span style="color:var(--ac)">${esc(g.f)}</span></p></div>
 <h3>Examples</h3>${g.x.map((x,i)=>`<div id=x${i} class="gl w"><b>${esc(x)}</b><button class=btn2 aria-label=Listen onclick="say(${esc(JSON.stringify(x)).replace(/&quot;/g,'&#34;')})">▶</button></div>`).join('')}
 <div id=n3 class=gl style="margin-top:10px"><p><span style="color:var(--bad)">✘ ${esc(g.m[0])}</span><br><span style="color:var(--ok)">✔ ${esc(g.m[1])}</span></p></div>
 <button class=btn onclick="narrate(${gu},${again})">▶ Explain it to me${again?' slowly':''}</button> <button class=btn2 onclick="try{speechSynthesis.cancel()}catch(e){}">■ Stop</button></div>
 ${GP[gu]?`<div class=card><b>Picture explanation</b><p class=mut>Tap the picture to enlarge it.</p>${pImg(gu)}</div>`:''}
 <div class=card><b>Which part is not clear?</b><p class=mut>Choose it and you get a deeper explanation.</p><div class=chips>${gPartsRow(gu,0)}</div><div id=gp></div></div>
 <div class=card><b>Practice</b><p class=mut>3 short questions. You need 2 correct answers.</p><button class=btn onclick="startGram(${gu})">Practise this rule</button> ${grOK(gu)?`<span class=mut>✔ Done · ${S.gr[gu]}%</span>`:''}</div>
 <div class=card><b>Want a teacher video?</b><p class=mut>Search for a teacher who explains this rule. Watch it yourself first and choose a clip that suits you (no music, suitable for your values). We have not checked outside videos.</p>${(window.GVIDEOS||{})[gu]?`<div class=vid><iframe src="https://www.youtube-nocookie.com/embed/${esc(window.GVIDEOS[gu])}?rel=0" title="Grammar video" allowfullscreen loading=lazy></iframe></div>`:''}<a class=btn2 style="display:inline-block;text-decoration:none" target=_blank rel="noopener noreferrer" href="https://www.youtube.com/results?search_query=${q}">Search on YouTube</a></div>`}
/* ---------- Placement test: adaptive, Bayesian estimate, every learner sees different items ---------- */
const CEFR=n=>n<=4?'A1':n<=10?'A2':n<=18?'B1':n<=25?'B2':'C1';
const PB2=[
[1,'Listen and choose the sentence.','My name is Omar.|My name is Ali.|My game is Omar.|My name is Omer.','My name is Omar.','','My name is Omar.'],
[1,'What is the plural of “book”?','books|bookes|bookies|book','books'],
[1,'He ___ my brother.','is|am|are|be','is'],
[2,'Listen and choose the sentence.','The bank is next to the school.|The bank is next to the pool.|The tank is next to the school.|The bank is near the school.','The bank is next to the school.','','The bank is next to the school.'],
[2,'What is the opposite of “cheap”?','expensive|small|early|slow','expensive'],
[2,'I ___ playing football now.','am|do|have|go','am'],
[3,'You ___ drink water. It is good for you.','should|are|did|have','should'],
[3,'Listen and choose the sentence.','She is always late for work.|She is always late for school.|He is always late for work.|She is often late for work.','She is always late for work.','','She is always late for work.'],
[3,'We ___ at the airport yesterday.','were|are|was|be','were'],
[4,'My uncle ___ in a village when he was young.','lived|lives|living|live','lived'],
[4,'This is the ___ book I have read.','best|good|better|well','best'],
[4,'What did Hana carry home?','The bag|The fruit|Her mother|A book','The bag','Last Friday Hana went to the market with her mother. They bought fruit and a blue bag. Hana carried the bag home.'],
[5,'If you ___ hard, you will pass.','study|studied|will study|studying','study'],
[5,'I have ___ finished my work.','just|yesterday|ago|last','just'],
[5,'Listen and choose the sentence.','We are going to travel next week.|We are going to travel next weekend.|We were going to travel next week.|We are going to travel last week.','We are going to travel next week.','','We are going to travel next week.'],
[6,'You ___ see a doctor. You look ill.','should|would|did|are','should'],
[6,'Cars ___ in this factory.','are made|make|is made|made','are made'],
[6,'What does the headmaster say the garden teaches?','Science and kindness|Cooking and sport|History and art|Maths only','Science and kindness','The village school is small, but it has a large garden. Every spring the students plant vegetables and share them with poor families. The headmaster says the garden teaches both science and kindness.'],
[7,'The man ___ lives next door is a doctor.','who|which|whose|what','who'],
[7,'If I ___ rich, I would build a school.','were|am|will be|would be','were'],
[7,'Listen and choose the sentence.','He said that he would come tomorrow.|He said that he will come tomorrow.|He says that he would come tomorrow.|He said that he would came tomorrow.','He said that he would come tomorrow.','','He said that he would come tomorrow.'],
[8,'I have been learning English ___ 2022.','since|for|from|during','since'],
[8,'He enjoys ___ stories.','reading|to read|read|reads','reading'],
[8,'The bridge ___ last year.','was built|built|is built|has built','was built'],
[9,'By the time I arrived, they ___ left.','had|have|has|were','had'],
[9,'If he had studied, he ___ the exam.','would have passed|would pass|will pass|had passed','would have passed'],
[9,'What improves memory more than extra hours?','Regular breaks and sleep|Longer lessons|Extra homework|Private lessons','Regular breaks and sleep','Many students believe that long study hours guarantee success. However, research suggests that regular breaks and enough sleep improve memory far more than extra hours at the desk. Schools are therefore starting to shorten lessons and add rest periods.'],
[10,'He asked me where I ___.','lived|did live|live|was lived','lived'],
[10,'By next June she ___ here for ten years.','will have worked|works|will work|has worked','will have worked'],
[10,'The report, ___ was published last week, caused debate.','which|that|who|what','which'],
[11,'I wish I ___ more patient.','were|am|will be|had','were'],
[11,'She had the documents ___.','translated|translate|translating|to translate','translated'],
[11,'Listen and choose the sentence.','Hardly had she arrived when it started to rain.|Hardly she had arrived when it started to rain.|Hardly had she arrive when it started to rain.|Hardly had she arrived when it start to rain.','Hardly had she arrived when it started to rain.','','Hardly had she arrived when it started to rain.'],
[12,'Despite ___ tired, he finished the work.','being|to be|be|been','being'],
[12,'The plan was approved, ___ surprised everyone.','which|what|that|who','which'],
[13,'Choose the closest meaning of “mitigate”.','reduce|increase|ignore|measure','reduce'],
[13,'Not until he left ___ the truth.','did she learn|she learned|she did learn|learned she','did she learn'],
[14,'The CEO was reluctant to ___ the merger.','endorse|erode|elude|enable','endorse'],
[14,'Choose the word closest to “scrutinise”.','examine|ignore|admire|avoid','examine'],
[15,'The results were ___; they contradicted every earlier study.','anomalous|typical|predictable|routine','anomalous'],
[15,'The committee, ___ members were elected, met on Friday.','whose|who|which|whom','whose'],
[16,'Her argument was ___, leaving no room for doubt.','compelling|tenuous|vague|trivial','compelling'],
[16,'Had they ___ earlier, the disaster would have been avoided.','acted|act|acting|been act','acted'],
[17,'Choose the closest meaning of “pragmatic”.','practical|idealistic|careless|emotional','practical'],
[17,'So ___ was the noise that nobody could sleep.','loud|loudly|louder|loudness','loud'],
[18,'The minister’s remarks were ___, deliberately vague.','oblique|explicit|blunt|forthright','oblique'],
[18,'Write the noun form of “ambiguous”.','','ambiguity'],
[19,'The policy’s consequences were ___: no one had predicted them.','unforeseen|foreseen|expected|planned','unforeseen'],
[19,'Rarely ___ such a complete failure.','has anyone witnessed|anyone has witnessed|did anyone witnessed|anyone witnessed','has anyone witnessed'],
[20,'The argument is persuasive but ultimately ___ on a false premise.','predicated|prevailing|presumed|pervaded','predicated'],
[20,'Write the verb related to “simple”.','','simplify']];
PB.push(...PB2);PB.forEach(c=>{c[0]=c[0]<=10?2*c[0]-.5:c[0]+10});/* bank levels were written for 20 levels: map them onto the 30-level scale */
const PTH=Array.from({length:59},(_,i)=>1+i*.5);
function pLike(th,b,typed){const g=typed?.03:.25;return g+(1-g)/(1+Math.exp(-.7*(th-b)))}
const pMean=p=>{let s=0,z=0;p.forEach((v,i)=>{s+=v*PTH[i];z+=v});return s/z};
const pMed=p=>{let z=p.reduce((a,b)=>a+b,0),c=0;for(let i=0;i<p.length;i++){c+=p[i];if(c>=z/2)return PTH[i]}return 30};
function pickQ(a){const th=pMean(a.post),free=PB.filter(x=>!a.u[x[1]]);free.sort((x,y)=>Math.abs(x[0]-th)-Math.abs(y[0]-th));
 const c=rnd(free.slice(0,Math.min(4,free.length)));a.u[c[1]]=1;a.h.push(c[0]);a.k.push(c[2]?1:0);return pbQ(c)}
function vTest(){const t=S.test;return`<h1>PLACEMENT TEST</h1>${S.placed?'':GATE?'<div class=card style="border-color:var(--ac2)"><b>Take the placement test first</b><p>To start studying we need to know your level. It takes a few minutes. After it, the levels below yours open for study.</p></div>':'<p>Welcome'+nmS()+'! Take this test first so we can find your exact level.</p>'}<div class=card><p>24 adaptive questions across 30 levels: grammar, vocabulary, reading, listening and writing. A correct answer makes the next question harder. A wrong answer makes it easier. The questions are different for every learner. At the end you get your exact level and every level up to it opens. Take your time and do not guess. It is an estimate, not an official exam, and it does not test speaking.</p>
${t?`<p class=mut>Last result: Level ${t.lvl||'?'} (${CEFR(t.lvl||1)}) on ${t.date}</p>`:''}<button class=btn onclick="startTest()">${S.placed?'Retake the test':'Start the test'}</button></div>`}
function placeLevel(a){const med=pMed(a.post),hc=Math.max(0,...a.r.filter(x=>x[1]).map(x=>x[0]));let lvl=Math.round(med-.25);lvl=Math.max(1,Math.min(NLV,Math.min(lvl,hc+3)));if(!hc)lvl=1;return lvl}
function startTest(){const a={h:[],k:[],u:{},r:[],n:24,post:PTH.map(()=>1)};const first=pickQ(a);
 runQuiz([first],'Placement',pct=>{const lvl=placeLevel(a),old=S.start||0;S.test={pct,lvl,date:today()};S.start=lvl;S.placed=1;save();
  const gc=lvFirst(lvl);
  return`${cele('Well done'+nmS()+'!','You moved to Level '+lvl+' now')}<h1>Level ${lvl}</h1><p>You are in <b>Level ${lvl} · ${LV[lvl-1]}</b> (about ${CEFR(lvl)}). Levels 1 to ${lvl} are now open.</p>${gc?`<p class=mut>Grammar rules from the earlier levels are not skipped: ${gc} short grammar lessons wait for you in your to-do list, so no rule is missed.</p>`:''}<p class=mut>${CT[lvl]?'Your lessons are ready.':'Lessons for this level are still being written. You can review Level '+Math.max(...Object.keys(CT).map(Number))+' meanwhile.'}</p><button class=btn onclick="go('home')">Go to Home</button> <button class=btn2 onclick="go('learn')">Open learning map</button>`});Q.ad=a;
 showQ()}

function vSearch(){const q=SQ.toLowerCase().trim(),r=LS.filter(l=>l.t.toLowerCase().includes(q)||l.w.some(w=>w.en.toLowerCase().includes(q)||(w.d||'').toLowerCase().includes(q)));
 return`<h1>SEARCH</h1><form class=card onsubmit="SQ=this.q.value;draw();return false"><input name=q id=sq value="${SQ.replace(/"/g,'')}" placeholder="Search lessons and words" aria-label=Search></form><p class=mut>${r.length} result${r.length==1?'':'s'} for “${SQ.replace(/</g,'')}”</p><div class=card>${r.map(l=>`<button class=row onclick="go('lesson',${l.id})"><span>${l.t}</span><b>L${l.lv} · U${l.ui+1}</b></button>`).join('')||'<p>No lessons found.</p>'}</div>`}
/* ---------- Review (spaced repetition) ---------- */
let R=null;
function vReview(){const due=Object.entries(S.vocab).filter(x=>x[1].due<=Date.now());
 if(!Object.keys(S.vocab).length)return'<h1>Review</h1><div class=card><p>Your notebook is empty. Finish a lesson and its words will appear here.</p></div>';
 if(!due.length)return`<h1>Review</h1><div class=card><p>Nothing is due now. ${Object.keys(S.vocab).length} words are in your notebook.</p></div>${notebook()}`;
 const [en,v]=due[0];return`<h1>Review</h1><p class=mut>${due.length} due</p><div class=card style="text-align:center"><h2>${en}</h2><button class=btn2 onclick="say('${en}')">▶ Listen</button>
 <p id=ans style="visibility:hidden;font-size:19px">${esc(DEFS[en]||'')}</p><button class=btn2 onclick="$('#ans').style.visibility='visible'">Show meaning</button>
 <p>Did you remember it?</p><button class=btn onclick="rate('${en}',1)">Yes</button> <button class=btn2 onclick="rate('${en}',0)">No</button></div>`}
function notebook(){return'<div class=card><h2>Notebook</h2>'+Object.entries(S.vocab).map(([e,v])=>`<div class=w><b>${e}</b><span class=dfn>${esc(DEFS[e]||'')}</span><span class=mut>Box ${v.box+1}/6</span></div>`).join('')+'</div>'}
function rate(en,ok){const v=S.vocab[en],gap=[0,1,2,4,8,16];v.box=ok?Math.min(5,v.box+1):0;v.due=Date.now()+(ok?gap[v.box]*864e5:6e5);v.t=Date.now();save();draw()}

function vProgress(){const b=[['First Lesson',doneN()>=1],['Vocabulary Builder',Object.keys(S.vocab).length>=25],['Unit Champion',Object.values(S.ut).some(v=>v>=75)],['Level Graduate',Object.values(S.lt).some(v=>v>=75)]];
 return`<h1>PROGRESS</h1><div class=grid><div class=stat><b>${doneN()}/${LS.length}</b>Lessons</div><div class=stat><b>${avg()}%</b>Average score</div><div class=stat><b>${Object.keys(S.vocab).length}</b>Words learned</div><div class=stat><b>${Object.keys(S.days).length}</b>Days studied</div></div>
 <div class=card><h2>Skills</h2>${Object.keys(S.sk).map(k=>{const t=S.sk[k],q=t[1]?Math.round(t[0]/t[1]*100):0;return`<div class=w><b>${k}</b><span>${q}%</span></div><div class=bar><i style="width:${q}%"></i></div>`}).join('')||'<p class=mut>Answer some questions to see your skills.</p>'}</div>
 <div class=card><h2>Achievements</h2>${b.map(x=>`<p>${x[1]?'🏅':'🔒'} ${x[0]}</p>`).join('')}</div>
 <div class=card><h2>Lesson scores</h2>${LS.filter(l=>S.done[l.id]!=null).map(l=>`<div class=w><b>L${l.lv} · ${l.t}</b><span>${S.done[l.id]}%</span></div>`).join('')||'<p class=mut>No lessons finished yet.</p>'}</div>
 <div class=card><h2>Mistakes</h2>${S.mist.length?S.mist.slice(0,10).map(m=>`<div class=w><b>${m.en}</b><span class=dfn>${esc(DEFS[m.en]||'')}</span></div>`).join('')+'<button class=btn onclick="pract()">Practise mistakes</button>':'<p class=mut>No mistakes yet.</p>'}</div>`}
function pract(){POOL=ALL;runQuiz(S.mist.slice(0,8).map(mc),'Mistakes',p=>`<h1>${p}%</h1><button class=btn onclick="go('progress')">Back</button>`)}
function vCert(){const n=A,dn=Object.keys(S.lt).filter(k=>S.lt[k]>=75);
 if(!n||!(S.lt[n]>=75))return'<h1>CERTIFICATES</h1>'+(dn.length?dn.map(k=>`<div class=card><b>Level ${k} · ${LV[k-1]}</b><br><button class=btn onclick="go('cert',${k})">View certificate</button></div>`).join(''):'<div class=card><p>Finish a level to earn its certificate: all its lessons, its unit tests and the level test, each with 75% or more.</p></div>');
 const id='EF-L'+n+'-'+(S.cid[n]=S.cid[n]||Math.random().toString(36).slice(2,8).toUpperCase());save();
 return`<div class=cert><h2>LanguWay English</h2><p>Certificate of Completion</p><h1>${esc(S.set.name)||'Learner'}</h1><p>has completed Level ${n} · ${LV[n-1]}<br>Level test score ${S.lt[n]}% · ${today()}</p><p class=mut>${id}<br>Issued by the platform. Not an official or externally accredited certificate.</p></div><p class=noprint><button class=btn onclick="print()">Print or save as PDF</button></p>`}
function sel(lbl,opts,cur,fn){return`<div class=set>${lbl}<select onchange="${fn}">${opts.map(o=>`<option value="${o[0]}" ${String(o[0])==String(cur)?'selected':''}>${o[1]}</option>`).join('')}</select></div>`}
const acc=(k,t,ico,body)=>`<details class="acc card" ${SO[k]?'open':''} ontoggle="SO['${k}']=this.open"><summary><span>${ic(ico)}${t}</span><i class=acc__c></i></summary><div class=acc__b>${body}</div></details>`;
function vSet(){const s=S.set,C=isC(USER);
 const acct=C?`<div class=set><span>Signed in as<br><b>${esc(EMAIL||'—')}</b><br><span class=mut>${esc(PROV||'email')}</span></span></div><div class=set><span>Cloud sync<br><span class=mut id=sst>${SL[SYNC]}${SERR?': '+esc(SERR):''}</span></span><button class=btn2 onclick="syncNow().then(draw)">Sync now</button></div>${cpHtml()}<button class=btn2 onclick="signOut()">Sign out</button> <button class=btn2 style="border-color:var(--bad);color:var(--bad)" onclick="delAcct()">Delete account</button>`
 :isG(USER)?`<p>You are using the app as a <b>guest</b>. Your progress is saved on this device only.</p><button class=btn type=button onclick="wantAuth()">Sign in or create an account</button><p class=mut>Your guest progress will be added to your account.</p>`
 :`<p>Signed in as <b>${esc(USER)}</b> on this device.</p><p class=mut>${CFGOK?'Cloud sign-in is unavailable right now.':'Cloud sync is not set up, so your progress stays on this device only. See SETUP-CLOUD.md to turn on email, Google and Apple sign-in.'}</p><button class=btn2 onclick="localStorage.removeItem('ef_cur');location.reload()">Log out</button>`;
 const learn=`<div class=set>Display name<input value="${esc(s.name)}" maxlength=30 onchange="S.set.name=this.value.trim().slice(0,30);save();draw()"></div>
 ${sel('Daily goal',[[1,'1 quiz'],[2,'2 quizzes'],[3,'3 quizzes']],s.goal,'S.set.goal=+this.value;save()')}
 ${sel('Accent',[['en-US','American'],['en-GB','British']],s.acc,'S.set.acc=this.value;save()')}
 <div class=set>Play audio automatically<input type=checkbox ${s.auto?'checked':''} onchange="S.set.auto=this.checked;save()"></div>
 ${sel('Speech speed',[['.6','Slow'],['.9','Normal'],['1.15','Fast']],s.rate,'S.set.rate=+this.value;save()')}
 <div class=set>Arabic subtitles in stories<input type=checkbox ${s.sa?'checked':''} onchange="S.set.sa=this.checked;save()"></div>
 <p class=mut>Pronunciation uses your browser's voices, which differ by device.</p>`;
 const look=`${sel('Theme',[['system','System'],['light','Light'],['dark','Dark']],s.theme,'S.set.theme=this.value;save();theme()')}
 ${sel('Text size',[['small','Small'],['normal','Normal'],['large','Large'],['xl','Extra large']],s.font,'S.set.font=this.value;save();applyPrefs()')}
 <div class=set>Reduce motion<input type=checkbox ${s.calm?'checked':''} onchange="S.set.calm=this.checked;save();applyPrefs()"></div>`;
 const data=`<p class=mut>${C?'Your progress is saved in your account. You can also keep a backup file.':'Your progress is stored in this browser only. Export a backup to move it to another device.'}</p>
 <button class=btn2 onclick="exp()">Export backup</button> <label class=btn2 style="display:inline-block">Import backup<input type=file accept=.json hidden onchange="imp(this.files[0])"></label> <button class=btn2 onclick="resetProg()">Reset progress</button> <button class=btn2 onclick="go('help')">Help</button>`;
 return`<h1>SETTINGS</h1>${acc('acct','Account','user',acct)}${acc('inst','Install and share','share','<p class=mut>Install the app, share it with friends, or show the QR code.</p><button class=btn type=button onclick="go(\'share\')">Open install and share</button>')}${acc('learn','Learning','learn',learn)}${acc('look','Appearance','gear',look)}${acc('data','Your data','doc',data)}`}
let DIP=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();DIP=e;if((V=='settings'||V=='share')&&!INQ)draw()});
addEventListener('appinstalled',()=>{DIP=null;if((V=='settings'||V=='share')&&!INQ)draw()});
const isApp=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
function instCard(){return`<div class=card><h2>Install and share</h2><p class=mut>Install the app, share it with friends, or show the QR code.</p><button class=btn type=button onclick="go('share')">${ic('share')} Open install and share</button></div>`}
function instCardOld(){if(isApp())return'';const ios=/iphone|ipad|ipod/i.test(navigator.userAgent||'');
 return`<div class=card><h2>Install the app</h2><p class=mut>Install LanguWay English on your phone or computer. It opens like an app, works offline, and keeps your progress.</p>${DIP?'<button class=btn onclick="DIP.prompt();DIP.userChoice.finally(()=>{DIP=null;draw()})">Install now</button>':ios?'<p>On iPhone or iPad: tap the Share button in Safari, then <b>Add to Home Screen</b>.</p>':'<p class=mut>In Chrome or Edge, open the browser menu and choose <b>Install app</b> (or <b>Add to Home screen</b> on Android).</p>'}</div>`}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(clean(S))],{type:'application/json'}));a.download='english-first-backup.json';a.click()}
function imp(f){if(!f||f.size>500000)return alert('This file could not be read.');f.text().then(t=>{try{const o=JSON.parse(t);if(!isO(o))throw 0;S=mergeS(S,clean(o));save();theme();applyPrefs();go('home')}catch(e){alert('This file could not be read.')}})}
function resetProg(){if(!confirm('Reset all your learning progress? Your account stays.'))return;const st=S.set;S=DEF();S.set=st;S.rst=Date.now();save();go('home')}
function vHelp(){const q=[['How do I start?','Create an account, take the placement test, then open Learn.'],['How do I unlock the next unit?','Pass each lesson quiz with 75%, then pass the unit test with 75%.'],['Why is a level locked?','A level opens when you pass the level test of the level before it, or when your placement result puts you higher.'],['What are the 4 sections of a lesson?','Reading (then 3 questions), Writing (listen and write), Listening (choose the sentence you hear) and Speaking (read aloud and the browser corrects you). Finish them in order, then pass the quiz.'],['Where is grammar?','Each unit has one grammar rule with a step-by-step explanation and practice. If you were placed in a higher level, earlier rules wait in your to-do list so that none is missed.'],['The sound does not play','Pronunciation uses your browser voices. Check the volume, try Chrome or Safari, and make sure an English voice is installed on your device.'],['My progress is missing on my phone','Sign in with the same account on both devices. Progress syncs when you are online. The cloud icon at the top shows the sync state.'],['How do I retake the placement test?','Open Home, then the Tests tab in the to do list, and tap Retake.']];
 return`<h1>HELP</h1>${q.map(x=>`<div class=card><b>${x[0]}</b><p class=mut>${x[1]}</p></div>`).join('')}<button class=btn2 onclick="go('settings')">Back to Settings</button>`}
(async function boot(){
 if(sb){
  $('#app').innerHTML='<div class="card auth"><p class=mut>Loading…</p></div>';
  sb.auth.onAuthStateChange((ev,ses)=>{setTimeout(()=>{if(PWF)return;if(ev=='PASSWORD_RECOVERY'){REC=1;if(ses)SESS=ses;draw()}else if(ev=='SIGNED_IN'&&ses)onSignedIn(ses);else if(ev=='SIGNED_OUT'&&SESS)forget();else if(ev=='TOKEN_REFRESHED'&&ses)SESS=ses},0)});
  let ses=null;try{ses=(await sb.auth.getSession()).data.session}catch(e){}
  if(ses)await onSignedIn(ses);
  else if(isC(USER)&&!navigator.onLine){EMAIL=localStorage.getItem('ef_email_'+USER)||'';loadS();setSync('off')}
  else if(isG(USER))loadS();
  else USER='';
 }else if(isC(USER)){EMAIL=localStorage.getItem('ef_email_'+USER)||'';loadS();setSync('off')}
 else if(USER)loadS();
 theme();applyPrefs();draw();FXOFF=0;
})();
document.addEventListener('visibilitychange',()=>{if(sb&&SESS){if(document.visibilityState=='visible')syncNow();else{clearTimeout(pushT);push()}}});
addEventListener('online',async()=>{if(!sb)return;if(!SESS&&isC(USER)){try{const r=await sb.auth.getSession();if(r.data.session)await onSignedIn(r.data.session);else forget()}catch(e){}}else syncNow()});
addEventListener('offline',()=>{if(SESS)setSync('off')});
addEventListener('load',regSW);
addEventListener('keydown',e=>{if(e.key=='Escape'){if($('#zm'))$('#zm').remove();else hClose()}});
document.addEventListener('focusin',e=>{const t=e.target;if(t&&/INPUT|TEXTAREA/.test(t.tagName))setTimeout(()=>{try{t.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}},320)});
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
(function(){const sp=$('#splash');if(!sp)return;let seen=0;try{seen=sessionStorage.getItem('ef_sp')}catch(e){}const end=()=>{sp.classList.add('out');setTimeout(()=>sp.remove(),600)};if(seen){sp.remove();return}try{sessionStorage.setItem('ef_sp','1')}catch(e){}sp.onclick=end;sp.addEventListener('touchstart',end,{passive:true});setTimeout(end,matchMedia('(prefers-reduced-motion:reduce)').matches||S.set.calm?1200:3900)})();
