/* LanguWay English: "Cedar City" story player.
   One episode per level (data in stories.js). The app draws every scene itself as inline SVG with
   faceless flat avatars (men in long modest clothes, women in hijab and a long dress), reads the lines
   aloud with the browser's text-to-speech (a different pitch for every character), shows English subtitles
   (optional Arabic subtitles, off by default) and asks one quick question after each scene.
   There is no music and no sound other than the voices. Works offline once the page is cached.
   Uses globals from app.js: S, save, say helpers, esc, sh, ic, go, draw, needTest, lvOpen, sents, evid, nmS, cele, today, wrap. */

/* ---------- Characters: gender, size, colours, voice pitch ---------- */
const CAST={
 Omar:{g:'m',c:'#2f5d8a',h:'#2b2118',p:1.0},
 Yusuf:{g:'m',c:'#6b705c',h:'#d9d9d9',p:.65,o:1},
 Idris:{g:'m',c:'#a0522d',h:'#2b2118',p:.8,ap:1},
 Karim:{g:'m',c:'#3b3f4a',h:'#555',p:.75},
 Bilal:{g:'m',c:'#3a7d44',h:'#2b2118',p:.9},
 'Dr. Adel':{g:'m',c:'#eef2f7',h:'#2b2118',p:.7,coat:1},
 Hana:{g:'f',c:'#7b4b94',h:'#46305a',p:1.35},
 Mariam:{g:'f',c:'#556b2f',h:'#3b4a1d',p:1.15,s:.97},
 Sara:{g:'f',c:'#2a7f8e',h:'#1b4d57',p:1.5,s:.86},
 Nadia:{g:'f',c:'#8a5a44',h:'#4a2f22',p:1.25},
 Samir:{g:'m',c:'#c06b2b',h:'#2b2118',p:1.7,s:.7}
};
const SKIN=['#f1c9a5','#e0ac82','#c68e63','#a8714a'];

/* One avatar, drawn with its feet at (x, ground). sp = this person is speaking now: it bounces, one arm gestures
   and a speech bubble with moving dots appears above the head. */
function avatar(n,x,gy,sp,i){const c=CAST[n]||CAST.Omar,s=c.s||1,sk=SKIN[(n.length+i)%4];
 let b=`<g transform="translate(${x} ${gy}) scale(${s})"><g class=avo style="--dx:${x<180?-70:x>180?70:0}px;animation-delay:${(i*.18).toFixed(2)}s">`;
 b+=`<ellipse cx="0" cy="2" rx="${sp?36:30}" ry="${sp?8:6}" fill="${sp?'#c9a45c':'#000'}" opacity="${sp?.95:.18}"/>`;
 b+=`<g class="${sp?'a-sp':'a-idle'}" style="animation-delay:${(i*.45).toFixed(2)}s">`;
 const arm=(x0,cl)=>`<rect class="${cl}" x="${x0}" y="-78" width="9" height="46" rx="4" fill="${c.c}" stroke="#000" stroke-opacity=".15"/>`;
 if(c.g=='f'){/* long dress, hijab drapes over the shoulders, face left blank */
  b+=`<path d="M-21,-70 L-31,0 L31,0 L21,-70 Z" fill="${c.c}"/><path d="M-12,-72 L-14,-30 L14,-30 L12,-72 Z" fill="#000" opacity=".08"/>${arm(-27,'arm-l')}${arm(18,sp?'arm-r wave':'arm-r')}`;
  b+=`<path d="M-19,-98 Q-26,-74 -25,-62 L25,-62 Q26,-74 19,-98 Z" fill="${c.h}"/><circle cx="0" cy="-100" r="18" fill="${c.h}"/><ellipse cx="0" cy="-98" rx="10.5" ry="12" fill="${sk}"/>`}
 else{/* long tunic to the ankles, simple cap or hair, face left blank */
  b+=`<path d="M-19,-80 Q0,-90 19,-80 L27,0 L-27,0 Z" fill="${c.c}"/>`;
  if(c.coat)b+=`<path d="M-3,-84 L3,-84 L5,0 L-5,0 Z" fill="#9fb4c9"/>`;
  if(c.ap)b+=`<rect x="-13" y="-62" width="26" height="52" rx="4" fill="#fff" opacity=".85"/>`;
  b+=arm(-26,'arm-l')+arm(17,sp?'arm-r wave':'arm-r');
  b+=`<circle cx="0" cy="-100" r="14" fill="${sk}"/><path d="M-14,-102 A14,14 0 0 1 14,-102 Z" fill="${c.h}"/>`;
  if(c.o)b+=`<path d="M-9,-92 Q0,-80 9,-92 L8,-88 Q0,-78 -8,-88 Z" fill="${c.h}"/>`}
 b+='</g>';
 if(sp)b+=`<g transform="translate(${c.g=='f'?14:12} -138)"><path d="M0,0 h40 a8,8 0 0 1 8,8 v10 a8,8 0 0 1 -8,8 h-26 l-8,8 v-8 h-6 a8,8 0 0 1 -8,-8 v-10 a8,8 0 0 1 8,-8z" fill="#fff" stroke="#0b4aa8" stroke-width="2" transform="translate(-6 0) scale(.95)"/><circle class="dot d1" cx="12" cy="13" r="3" fill="#0b4aa8"/><circle class="dot d2" cx="24" cy="13" r="3" fill="#0b4aa8"/><circle class="dot d3" cx="36" cy="13" r="3" fill="#0b4aa8"/></g>`;
 return b+`<text x="0" y="17" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" stroke="#000" stroke-width="2.5" paint-order="stroke">${esc(n.replace('Dr. ','Dr '))}</text></g></g>`}

/* ---------- Eight settings ---------- */
const win=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bfe3ff" stroke="#8a6d3b" stroke-width="3"/><path d="M${x+w/2},${y}V${y+h}M${x},${y+h/2}H${x+w}" stroke="#8a6d3b" stroke-width="2"/>`;
const tree=(x,y,r)=>`<rect x="${x-4}" y="${y}" width="8" height="${r}" fill="#6b4a2b"/><circle cx="${x}" cy="${y}" r="${r}" fill="#3d8b4f"/><circle cx="${x-r*.5}" cy="${y+r*.3}" r="${r*.7}" fill="#2f7a43"/>`;
const CLOUD=(y,d)=>`<g class=cl style="animation-delay:-${d}s"><ellipse cx="60" cy="${y}" rx="26" ry="9" fill="#fff" opacity=".92"/><ellipse cx="78" cy="${y-6}" rx="18" ry="9" fill="#fff" opacity=".92"/><ellipse cx="44" cy="${y-4}" rx="14" ry="7" fill="#fff" opacity=".92"/></g>`;
const BIRD=(y,d)=>`<path class=bd style="animation-delay:-${d}s" d="M0,${y} q6,-7 12,0 q6,-7 12,0" fill="none" stroke="#33415c" stroke-width="2" stroke-linecap="round"/>`;
const SETS={
 home:()=>`<rect width="360" height="220" fill="#efe6d2"/><rect y="150" width="360" height="70" fill="#b88a5a"/>${win(30,30,70,60)}<rect x="130" y="28" width="60" height="40" fill="#cfe6d4" stroke="#8a6d3b" stroke-width="3"/><path d="M135,62l15-14 12 10 10-8 14 12z" fill="#6aa57a"/><rect x="230" y="60" width="100" height="90" fill="#8a5a3b"/>${[0,1,2].map(i=>`<rect x="236" y="${66+i*28}" width="88" height="22" fill="#a8764c"/>${[0,1,2,3,4,5].map(j=>`<rect x="${240+j*14}" y="${70+i*28}" width="10" height="14" fill="${['#c0392b','#2f5d8a','#e0b341','#3a7d44','#7b4b94','#d35400'][(i+j)%6]}"/>`).join('')}`).join('')}<rect x="60" y="150" width="120" height="14" fill="#7a4e2c"/><rect x="66" y="164" width="8" height="26" fill="#7a4e2c"/><rect x="166" y="164" width="8" height="26" fill="#7a4e2c"/>`,
 street:()=>`<rect width="360" height="220" fill="#bfe3ff"/><circle class=sun cx="310" cy="38" r="18" fill="#ffd966"/>${CLOUD(34,0)}${CLOUD(60,18)}${[0,1,2].map(i=>`<rect x="${10+i*118}" y="${50+i*14}" width="96" height="${120-i*14}" fill="${['#d9b88f','#c9a27a','#e3c9a2'][i]}"/>${[0,1].map(r=>[0,1,2].map(c=>`<rect x="${22+i*118+c*28}" y="${66+i*14+r*34}" width="16" height="22" fill="#8fc4e8" stroke="#7a5a3a"/>`).join('')).join('')}`).join('')}<rect y="170" width="360" height="12" fill="#cfc9bd"/><rect y="182" width="360" height="38" fill="#6b6f76"/><path d="M0,201H360" stroke="#fff" stroke-width="3" stroke-dasharray="18 14"/>${tree(330,110,22)}`,
 market:()=>`<rect width="360" height="220" fill="#fbe9c8"/><rect y="150" width="360" height="70" fill="#d9b88f"/>${[0,1,2].map(i=>`<g><path d="M${20+i*115},40h100l8,34h-116z" fill="#fff"/>${[0,1,2,3,4].map(k=>`<path d="M${20+i*115+k*21},40h10.5l3,34h-10.5z" fill="${['#c0392b','#2f7a43','#e0b341'][i]}"/>`).join('')}<rect x="${24+i*115}" y="74" width="4" height="76" fill="#6b4a2b"/><rect x="${112+i*115}" y="74" width="4" height="76" fill="#6b4a2b"/><rect x="${22+i*115}" y="124" width="104" height="26" fill="#a8764c"/>${[0,1,2,3,4,5].map(k=>`<circle cx="${34+i*115+k*16}" cy="118" r="7" fill="${['#e74c3c','#f39c12','#27ae60','#f1c40f','#e67e22','#c0392b'][(i*2+k)%6]}"/>`).join('')}</g>`).join('')}`,
 school:()=>`<rect width="360" height="220" fill="#e8f0e4"/><rect y="150" width="360" height="70" fill="#c9b08a"/><rect x="40" y="26" width="200" height="90" rx="4" fill="#2f4f3e" stroke="#8a6d3b" stroke-width="6"/><text x="140" y="82" text-anchor="middle" font-size="34" font-family="serif" fill="#f4f4f4" opacity=".85">A B C</text><circle cx="300" cy="50" r="24" fill="#fff" stroke="#555" stroke-width="4"/><path d="M300,50V34M300,50l12,6" stroke="#333" stroke-width="3"/>${win(270,92,70,50)}<rect x="30" y="150" width="70" height="10" fill="#8a5a3b"/><rect x="260" y="150" width="70" height="10" fill="#8a5a3b"/>`,
 office:()=>`<rect width="360" height="220" fill="#e9e4dc"/><rect y="150" width="360" height="70" fill="#8d7a63"/>${win(24,30,80,70)}<rect x="230" y="36" width="100" height="100" fill="#7a5a3b"/>${[0,1,2,3].map(i=>`<rect x="236" y="${42+i*24}" width="88" height="18" fill="#9a7650"/><rect x="242" y="${45+i*24}" width="${20+((i*17)%50)}" height="12" fill="${['#2f5d8a','#c0392b','#3a7d44','#e0b341'][i]}"/>`).join('')}<rect x="110" y="128" width="110" height="14" fill="#6b4a2b"/><rect x="118" y="142" width="8" height="40" fill="#6b4a2b"/><rect x="204" y="142" width="8" height="40" fill="#6b4a2b"/><rect x="140" y="104" width="44" height="24" fill="#333"/><rect x="144" y="108" width="36" height="16" fill="#8fc4e8"/>`,
 clinic:()=>`<rect width="360" height="220" fill="#f4f8fb"/><rect y="150" width="360" height="70" fill="#d6e4ec"/><rect x="150" y="26" width="60" height="60" rx="8" fill="#fff" stroke="#c0392b" stroke-width="4"/><path d="M180,38v36M162,56h36" stroke="#c0392b" stroke-width="10"/><rect x="30" y="100" width="110" height="40" rx="6" fill="#fff" stroke="#9fb4c9" stroke-width="3"/><rect x="30" y="140" width="6" height="30" fill="#9fb4c9"/><rect x="134" y="140" width="6" height="30" fill="#9fb4c9"/><rect x="250" y="70" width="80" height="80" fill="#fff" stroke="#9fb4c9" stroke-width="3"/><path d="M250,110H330M290,70V150" stroke="#9fb4c9" stroke-width="2"/>`,
 park:()=>`<rect width="360" height="220" fill="#bfe3ff"/><circle class=sun cx="60" cy="40" r="20" fill="#ffd966"/>${CLOUD(30,6)}${CLOUD(58,22)}${BIRD(50,0)}${BIRD(70,9)}<path d="M0,140Q90,100 180,135T360,125V220H0z" fill="#6fbf73"/><rect y="170" width="360" height="50" fill="#5aa862"/><path d="M130,220Q180,175 230,150" stroke="#e3d3a8" stroke-width="26" fill="none"/>${tree(40,100,26)}${tree(320,96,30)}<rect x="240" y="150" width="70" height="8" fill="#8a5a3b"/><rect x="244" y="158" width="6" height="18" fill="#8a5a3b"/><rect x="300" y="158" width="6" height="18" fill="#8a5a3b"/>`,
 station:()=>`<rect width="360" height="220" fill="#cfe6f7"/>${CLOUD(30,3)}<rect y="160" width="360" height="60" fill="#8f9399"/><rect y="150" width="360" height="12" fill="#cfc9bd"/><g class=busin><rect x="20" y="60" width="220" height="84" rx="14" fill="#e0b341"/>${[0,1,2,3,4].map(i=>`<rect x="${34+i*40}" y="72" width="30" height="30" rx="4" fill="#8fc4e8"/>`).join('')}<rect x="20" y="112" width="220" height="6" fill="#b88a1f"/><circle cx="64" cy="146" r="14" fill="#333"/><circle cx="64" cy="146" r="6" fill="#aaa"/><circle cx="196" cy="146" r="14" fill="#333"/><circle cx="196" cy="146" r="6" fill="#aaa"/></g><rect x="270" y="50" width="6" height="100" fill="#555"/><rect x="250" y="44" width="46" height="24" rx="4" fill="#2f5d8a"/><text x="273" y="61" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">BUS</text>`
};

/* ---------- State ---------- */
let SY=null,SYK=0,SYslow=false;/* SY: {n episode, i scene, l line, ph 'scene'|'q'|'end', ok, pl playing, qa answered option, ord shuffled options, card title card, fresh scene just opened} */
const STD=()=>window.STORIES||{};
const epOf=n=>STD()[n];
const scOf=()=>epOf(SY.n).scenes[SY.i];
const CAP={home:'At home',street:'On the street',market:'At the market',school:'At school',office:'In the office',clinic:'At the clinic',park:'In the park',station:'At the bus station'};
/* Time of day changes with the scene: a soft colour overlay on the picture */
const TOD=[['Morning','#ffd9a0',.12],['Midday','#ffffff',0],['Afternoon','#ffb870',.14],['Evening','#1b2a6b',.24]];
const PRAISE=['Excellent!','Great listening!','Well done!','You understood it!','Perfect!'],TRY=['Good try. Listen once more!','Almost! Watch the scene again.','Keep going, you are learning!'];
/* The lower the level, the slower the voices (about 60% speed at level 1, full speed from level 25). */
const stRate=()=>{const lv=SY?SY.n:15,f=.6+.4*Math.min(1,(lv-1)/24);return Math.max(.5,Math.min(1.15,S.set.rate*f*(SYslow?.8:1)))};

/* Voice: pick an English voice that matches the accent, prefer male/female names, then shift pitch per character */
function stVoice(g){try{if(typeof pickVoice=='function')return pickVoice(g)}catch(e){}try{const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));if(!vs.length)return null;
 const acc=vs.filter(v=>v.lang.replace('_','-')==S.set.acc),pool=acc.length?acc:vs,
  f=/female|samantha|zira|susan|hazel|karen|moira|tessa|fiona|victoria|aria|jenny|libby|sonia/i,m=/(^|[^a-z])male|david|mark|daniel|alex|fred|george|guy|ryan|james|thomas|oliver|arthur/i,
  want=g=='f'?f:m;return pool.find(v=>want.test(v.name)&&!(g!='f'&&f.test(v.name)))||pool[0]}catch(e){return null}}
/* Speak one line. onword(k) is called with the index of the word being spoken (real boundary events when the browser gives them, otherwise an estimate). */
function stSpeak(who,text,done,onword){let fin=0,gotB=0,tick=null;const words=text.split(' '),per=420/Math.max(.5,stRate()),ms=Math.max(1800,words.length*per*1.5+900),
 end=()=>{if(fin)return;fin=1;clearTimeout(tm);clearInterval(tick);done()},tm=setTimeout(end,ms*2.2);
 if(onword){let k=0;onword(0);tick=setInterval(()=>{if(gotB||fin)return clearInterval(tick);k++;if(k<words.length)onword(k)},per)}
 try{if(!window.speechSynthesis||typeof SpeechSynthesisUtterance=='undefined'){clearTimeout(tm);setTimeout(end,ms);return}
  speechSynthesis.cancel();const sp2=(typeof ttsText=='function'?ttsText(text):text),same=sp2.split(' ').length==words.length,u=new SpeechSynthesisUtterance(sp2),c=CAST[who]||CAST.Omar,v=stVoice(c.g);if(v)u.voice=v;u.lang=S.set.acc;u.pitch=Math.max(.8,Math.min(1.4,c.p));u.rate=stRate();
  u.onboundary=e=>{if(!same||(e.name&&e.name!='word'))return;gotB=1;if(onword)onword(Math.max(0,sp2.slice(0,e.charIndex).split(' ').length-1))};
  const t0=Date.now(),slow=()=>{const el=Date.now()-t0;el<500?setTimeout(end,ms-el):end()};u.onend=slow;u.onerror=slow;speechSynthesis.speak(u)}catch(e){clearTimeout(tm);setTimeout(end,ms)}}
function stHalt(){SYK++;try{speechSynthesis.cancel()}catch(e){}if(SY)SY.pl=0}
function stHi(k){document.querySelectorAll('#sub .wd').forEach((w,i)=>{w.classList.toggle('cur',i==k);w.classList.toggle('done',i<k)})}

/* ---------- Views ---------- */
function vStories(){const n0=Object.keys(STD()).length;
 let h=`<h1>STORIES</h1><p class=mut>Cedar City: a story in 30 episodes, one for each level. Watch the scenes, listen to the voices (slower in the early levels), read the subtitles and answer one quick question after each scene. Earn stars!</p>
 <div class=card><label class=set>Arabic subtitles (optional)<input type=checkbox ${S.set.sa?'checked':''} onchange="S.set.sa=this.checked;save()"></label></div>`;
 if(!n0)return h+'<div class=card><p>The stories are not available yet.</p></div>';
 for(let n=1;n<=NLV;n++){const e=epOf(n);if(!e)continue;const op=lvOpen(n),d=S.sty[n];
  h+=`<button class="row ${op?'':'lock'}" ${op?'':'disabled'} onclick="storyOpen(${n})"><span>${d!=null?(d>=75?'✔':'▶'):op?'▶':'🔒'} Episode ${n} · ${esc(e.t)}</span><b>${d!=null?'⭐'.repeat(Math.round(d/25))||'☆':''}</b></button>`}
 return h}
function storyOpen(n){if(needTest())return;if(!epOf(n))return;stHalt();SY={n,i:0,l:0,ph:'scene',ok:0,pl:0,qa:-1,card:1,fresh:1,rep:1};go('story',n)}
function svgHtml(){const sc=scOf(),ln=sc.lines[Math.min(SY.l,sc.lines.length-1)],on=SY.pl||SY.l>0,sp=on?ln[0]:'',k=sc.cast.length,xs=k==1?[180]:k==2?[110,250]:[70,180,290],t=TOD[SY.i%4];
 const fx=sp&&sc.cast.indexOf(sp)>=0?Math.round(xs[sc.cast.indexOf(sp)]/3.6):50;
 return `<svg style="transform-origin:${fx}% 66%" viewBox="0 0 360 220" role="img" aria-label="Scene: ${esc(CAP[sc.set]||sc.set)} with ${esc(sc.cast.join(', '))}">${(SETS[sc.set]||SETS.home)()}${t[2]?`<rect width="360" height="220" fill="${t[1]}" opacity="${t[2]}"/>`:''}${sc.cast.map((n,i)=>avatar(n,xs[i],196,n==sp&&on,i)).join('')}</svg>`}
function subHtml(){const sc=scOf(),ln=sc.lines[Math.min(SY.l,sc.lines.length-1)],on=SY.ph=='scene'&&(SY.pl||SY.l>0);
 return on?`<div class=sub id=sub aria-live=polite><b>${esc(ln[0])}</b><br><span class=en>${ln[1].split(' ').map(w=>`<span class=wd>${esc(w)}</span>`).join(' ')}</span>${S.set.sa&&ln[2]?`<br><span class=ar>${esc(ln[2])}</span>`:''}</div>`:`<div class=sub id=sub><span class=mut>${SY.ph=='scene'?'Press Play to watch this scene.':'Which answer is right?'}</span></div>`}
function cardHtml(){const e=epOf(SY.n);return `<div class="stg tcard enter"><div class=tc><small>CEDAR CITY · LEVEL ${SY.n}</small><h2>Episode ${SY.n}</h2><p>${esc(e.t)}</p></div></div><div class=sub id=sub><span class=mut>Press Play to start the episode.</span></div>`}
function stageHtml(){if(SY.card&&SY.ph=='scene')return cardHtml();const sc=scOf();
 return `<div class="stg ${SY.fresh?'enter':''} ${SY.pl?'kb':''}" id=stg>${svgHtml()}<div class=cap>${esc(CAP[sc.set]||'')} · ${TOD[SY.i%4][0]}${(S.set.rp||1)>1&&SY.pl?' · Play '+(SY.rep||1)+' of '+S.set.rp:''}</div></div>`+subHtml()}
function transHtml(){const sc=scOf(),upto=SY.ph=='scene'?(SY.pl||SY.l>0?SY.l:-1):sc.lines.length-1;
 return sc.lines.map((l,i)=>i>upto?'':`<button class=stl onclick="stLineGo(${i})"><b>${esc(l[0])}:</b> ${esc(l[1])}${S.set.sa&&l[2]?`<br><span class=ar>${esc(l[2])}</span>`:''}</button>`).join('')}
function starsHtml(e){const t=e.scenes.length;return `<span class=stars aria-label="${SY.ok} of ${t} stars">${'⭐'.repeat(SY.ok)}${'☆'.repeat(Math.max(0,t-SY.ok))}</span>`}
function vStory(){const e=epOf(SY&&SY.n);if(!SY||!e)return'<h1>STORIES</h1><div class=card><button class=btn onclick="go(\'stories\')">Choose an episode</button></div>';
 const tot=e.scenes.length,head=`<button class=btn2 onclick="stHalt();go('stories')">← All episodes</button><h1>EPISODE ${SY.n}</h1><p class=mut>${esc(e.t)} · Scene ${Math.min(SY.i+1,tot)} of ${tot} · ${starsHtml(e)}</p><div class=bar><i style="width:${Math.round((SY.ph=='end'?tot:SY.i+(SY.ph=='q'?.6:SY.l/Math.max(1,scOf().lines.length)*.5))/tot*100)}%"></i></div>`;
 if(SY.ph=='end'){const pct=Math.round(SY.ok/tot*100);
  return head+`${pct>=75?cele('Episode complete'+nmS()+'!','You earned '+SY.ok+' of '+tot+' stars.'):''}<div class=card><h2>${starsHtml(e)}</h2><p>${pct>=75?'Well done. You understood the story. Your English is growing!':'Watch the scenes again and listen for the key words. Every replay makes it easier.'}</p><button class=btn onclick="storyOpen(${SY.n})">Watch again</button> ${SY.n<NLV&&epOf(SY.n+1)&&lvOpen(SY.n+1)?`<button class=btn2 onclick="storyOpen(${SY.n+1})">Next episode</button>`:''} <button class=btn2 onclick="go('stories')">All episodes</button></div>`}
 const fresh=SY.fresh;SY.fresh=0;
 if(SY.ph=='q')return head+`<div id=stage>${stageHtml()}</div>`+stQ();
 return head+`<div id=stage>${stageHtml()}</div><div class=stc><button class=btn onclick="stPlay()">${SY.pl?'⏸ Pause':SY.l>0?'▶ Resume':'▶ Play scene'}</button> <button class=btn2 onclick="stRestart()">↺ Replay</button> <button class=btn2 onclick="S.set.rp=(S.set.rp%3)+1;save();draw()">🔁 Play ${S.set.rp||1}×</button> <button class=btn2 onclick="SYslow=!SYslow;draw()">🐢 Slower: ${SYslow?'on':'off'}</button> <button class=btn2 onclick="stSkip()">Skip to question</button></div><label class=set>Arabic subtitles<input type=checkbox ${S.set.sa?'checked':''} onchange="S.set.sa=this.checked;save();stRefresh()"></label><div id=trans>${transHtml()}</div>`}
function stQ(){const sc=scOf(),q=sc.q;if(!SY.ord)SY.ord=sh(q.slice(1));
 const a=SY.qa>=0,ok=a&&SY.ord[SY.qa]==q[1];return`<div class="card ${a&&!ok?'shake':''}"><h2>${esc(q[0])}</h2>${SY.ord.map((o,j)=>`<button class="opt ${a?(o==q[1]?'ok pop':j==SY.qa?'no':''):''}" ${a?'disabled':''} onclick="stAnswer(${j})">${esc(o)}</button>`).join('')}${a?stTutor():''}${a?`<button class=btn style="margin-top:10px" onclick="stAfter()">${SY.i+1>=epOf(SY.n).scenes.length?'Finish':'Next scene'}</button> <button class=btn2 onclick="stBack()">Watch this scene again</button>`:''}</div><div id=trans style="margin-top:10px">${transHtml()}</div>`}
function stTutor(){const sc=scOf(),q=sc.q,g=SY.ord[SY.qa],ok=g==q[1],raw=sc.lines.map(l=>l[1]).join(' '),ev=evid(raw,q[0],q[1]),who=(sc.lines.find(l=>l[1]==ev)||[])[0];
 return`<p style="color:var(--${ok?'ok':'bad'})"><b>${ok?PRAISE[(SY.i+SY.n)%PRAISE.length]+' ⭐':TRY[(SY.i+SY.n)%TRY.length]}</b></p><div class=tutor><b>Tutor</b><br>${ok?'Right.':'The answer is “'+esc(q[1])+'”.'}${ev?'<br>'+(who?esc(who)+' says: ':'The scene says: ')+'“'+esc(ev)+'”':''}${ok?'':'<br><i>Tip:</i> listen for the key words of the question, then replay the scene.'}</div>`}

/* ---------- Actions ---------- */
function stRefresh(){const g=$('#stg');if(g&&g.querySelector){const sv=g.querySelector('svg');if(sv){const t=document.createElement('div');t.innerHTML=svgHtml();sv.replaceWith(t.firstChild)}}const b=$('#sub');if(b&&b.replaceWith){const t=document.createElement('div');t.innerHTML=subHtml();b.replaceWith(t.firstChild)}const t=$('#trans');if(t)t.innerHTML=transHtml()}
function stPlay(){if(!SY||SY.ph!='scene')return;if(SY.pl){stHalt();return draw()}const tok=++SYK;SY.pl=1;SY.card=0;if(SY.l>=scOf().lines.length)SY.l=0;if(SY.l==0)SY.rep=1;draw();stLine(tok)}
function stLine(tok){if(tok!=SYK||!SY)return;const sc=scOf();if(SY.l>=sc.lines.length){SY.pl=0;return stSkip()}
 stRefresh();const[sp,en]=sc.lines[SY.l];stSpeak(sp,en,()=>{if(tok!=SYK||!SY)return;SY.l++;if(SY.l>=sc.lines.length){const rp=S.set.rp||1;if((SY.rep||1)<rp){SY.rep=(SY.rep||1)+1;SY.l=0;stRefresh();return setTimeout(()=>stLine(tok),1100)}SY.pl=0;SYK++;SY.l=sc.lines.length-1;return stSkip()}setTimeout(()=>stLine(tok),520)},k=>{if(tok==SYK)stHi(k)})}
function stLineGo(i){if(!SY)return;stHalt();SY.l=i;SY.card=0;const sc=scOf(),tok=++SYK;SY.pl=1;stRefresh();stSpeak(sc.lines[i][0],sc.lines[i][1],()=>{if(tok==SYK&&SY){SY.pl=0;draw()}},k=>{if(tok==SYK)stHi(k)})}
function stRestart(){if(!SY)return;stHalt();SY.l=0;SY.rep=1;SY.card=0;draw();stPlay()}
function stSkip(){if(!SY)return;stHalt();SY.ph='q';SY.qa=-1;SY.ord=null;SY.card=0;draw()}
function stBack(){if(!SY)return;stHalt();SY.ph='scene';SY.l=0;SY.rep=1;SY.qa=-1;SY.ord=null;SY.card=0;draw()}
function stFx(t){try{const d=document.createElement('div');d.className='fx';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}catch(e){}}
function stAnswer(j){if(!SY||SY.qa>=0)return;SY.qa=j;const ok=SY.ord[j]==scOf().q[1];if(ok){SY.ok++;try{confetti()}catch(e){}stFx('+1 ⭐')}const t=S.sk.Listening=S.sk.Listening||[0,0];t[1]++;if(ok)t[0]++;save();draw()}
function stAfter(){const e=epOf(SY.n);if(SY.i+1>=e.scenes.length){const pct=Math.round(SY.ok/e.scenes.length*100);S.sty[SY.n]=Math.max(S.sty[SY.n]||0,pct);if(pct>=75)S.days[today()]=(S.days[today()]||0)+1;save();SY.ph='end';return draw()}
 SY.i++;SY.l=0;SY.ph='scene';SY.qa=-1;SY.ord=null;SY.fresh=1;SY.card=0;draw();scrollTo(0,0);stPlay()}
function stLeave(){stHalt()}
