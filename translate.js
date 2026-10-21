/* LanguWay English: Translator (Arabic <-> English). Works offline with the built-in dictionary; online services only add extra help. */
let T={p:'main',q:'',ctx:'',mode:'',on:null,busy:0};
const tAr=s=>String(s||'').replace(/[ً-ٰٟـ]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ة/g,'ه').trim();
const tIsAr=s=>/[؀-ۿ]/.test(s);
let TI=null;
function tIndex(){if(TI)return TI;TI={en:{},form:{},ar:{},irr:{},pr:{}};
 (window.DICT||[]).forEach(e=>{TI.en[e[0]]=e;String(e[1]).split(/\s+/).forEach(f=>{if(f&&!TI.form[f])TI.form[f]=e[0]});
  e[2].forEach((s,k)=>String(s[1]).split(/\s*\/\s*/).forEach(a=>{const key=tAr(a);if(key){(TI.ar[key]=TI.ar[key]||[]).push([e[0],k])}}))});
 (window.IRR||[]).forEach(r=>{TI.irr[r[0]]=r;String(r[1]).split(/\s*\/\s*/).forEach(f=>TI.irr[f]=TI.irr[f]||r);String(r[2]).split(/\s*\/\s*/).forEach(f=>TI.irr[f]=TI.irr[f]||r)});
 try{Object.keys(LEX).forEach(w=>{const key=tAr(LEX[w]);if(key){(TI.ar[key]=TI.ar[key]||[]).push([w,-1])}})}catch(e){}
 return TI}
function tLemma(w){const I=tIndex();w=w.toLowerCase().replace(/[’]/g,"'").replace(/^[^a-z]+|[^a-z']+$/g,'');if(!w)return'';
 if(I.en[w])return w;if(I.form[w])return I.form[w];if(I.irr[w]&&I.irr[w][0]!=w&&(I.en[I.irr[w][0]]||(typeof LEX!='undefined'&&LEX[I.irr[w][0]])))return I.irr[w][0];
 const c=[];if(/ies$/.test(w))c.push(w.slice(0,-3)+'y');if(/es$/.test(w))c.push(w.slice(0,-2));if(/s$/.test(w))c.push(w.slice(0,-1));if(/ied$/.test(w))c.push(w.slice(0,-3)+'y');if(/ed$/.test(w)){c.push(w.slice(0,-2));c.push(w.slice(0,-1));if(/(.)\1ed$/.test(w))c.push(w.slice(0,-3))}if(/ing$/.test(w)){c.push(w.slice(0,-3));c.push(w.slice(0,-3)+'e');if(/(.)\1ing$/.test(w))c.push(w.slice(0,-4))}if(/(er|est)$/.test(w)){c.push(w.replace(/(er|est)$/,''));c.push(w.replace(/(er|est)$/,'e'))}if(/ier$|iest$/.test(w))c.push(w.replace(/ier$|iest$/,'y'));
 for(const x of c){if(I.en[x]||(typeof LEX!='undefined'&&LEX[x]!==undefined))return x}
 return w}
function tForms(w,e){if(e&&e[1]){const f=e[1].split(/\s+/);if(f.length>=5)return{v:f};return{n:f}}
 const I=tIndex(),ir=I.irr[w];if(ir&&ir[0]==w)return{v:[w,tS3(w),String(ir[1]).split(' / ')[0],String(ir[2]).split(' / ')[0],tIng(w)],ir:ir};
 return null}
const tS3=w=>/(s|x|z|ch|sh|o)$/.test(w)?w+'es':/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':w+'s';
const tIng=w=>/ie$/.test(w)?w.slice(0,-2)+'ying':/[^e]e$/.test(w)?w.slice(0,-1)+'ing':/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w)&&w.length<=4?w+w.slice(-1)+'ing':w+'ing';
const tEd=w=>/e$/.test(w)?w+'d':/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ied':/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w)&&w.length<=4?w+w.slice(-1)+'ed':w+'ed';
const tPos={n:'noun',v:'verb',adj:'adjective',adv:'adverb',prep:'preposition'},tPosAr={n:'اسم',v:'فعل',adj:'صفة',adv:'ظرف',prep:'حرف جر'};
const tSay=(t,l)=>`<button type=button class=btn2 style="padding:6px 10px" data-t="${esc(t)}" onclick="say(this.dataset.t)">${l||'▶'}</button>`;

function vTranslate(){const p=T.p;
 if(p=='pairs')return tPairs();if(p=='saved')return tSaved();if(p=='irr')return tIrr();
 return`<h1>TRANSLATOR</h1><p class=mut>Arabic ⇄ English. Type a word or a sentence. Every meaning, with examples and how to choose the right one.</p>
 <div class=card><form onsubmit="tGo();return false"><textarea id=tq rows=3 maxlength=400 dir=auto aria-label="Type a word or a sentence" placeholder="Type English or Arabic here… (for example: run, ركض, I want to learn English)">${esc(T.q)}</textarea>
 <details style="margin:6px 0"><summary class=mut>Optional: the sentence where you saw the word (helps me pick the meaning)</summary><input id=tc dir=auto value="${esc(T.ctx)}" maxlength=200 placeholder="He runs a small shop." aria-label="Context sentence"></details>
 <button class=btn type=submit>Translate</button> <button type=button class=btn2 onclick="T.q='';T.ctx='';T.on=null;draw()">Clear</button></form></div>
 <div id=tout>${T.on?T.on:tHome()}</div>
 <div class=card><h3 style="margin-top:0">More tools</h3><button type=button class=chip onclick="T.p='saved';draw()">⭐ My saved words (${Object.keys(XS().sv).length})</button><button type=button class=chip onclick="T.p='pairs';draw()">🔀 Confusing words</button><button type=button class=chip onclick="T.p='irr';draw()">📋 Irregular verbs</button></div>`}
function tHome(){const ex=['run','light','kind','ركض','بنك','I want to learn English.'];return`<div class=card><b>Try one:</b><br>${ex.map(x=>`<button type=button class=chip onclick="T.q='${x.replace(/'/g,'')}';T.ctx='';tGoQ()">${esc(x)}</button>`).join('')}<p class=mut>Works without internet for the built-in words and phrases. With internet, I can also translate any sentence and find extra meanings.</p></div>`}
function tGo(){const q=$('#tq'),c=$('#tc');T.q=q?q.value.trim():T.q;T.ctx=c?c.value.trim():T.ctx;tGoQ()}
function tGoQ(){const q=T.q.trim();if(!q){T.on=null;return draw()}
 const words=q.split(/\s+/).filter(Boolean),isAr=tIsAr(q);
 if(words.length<=2&&!/[.!?؟]$/.test(q)){T.on=isAr?tArWord(q):tEnWord(q.toLowerCase().replace(/[^a-z' -]/g,'').trim())}
 else T.on=tSentence(q,isAr);
 draw();try{const o=$('#tout');o&&o.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}}
function tPick(entry,ctx){/* choose the most likely meaning from words around the target word */
 if(!ctx||entry[2].length<2)return -1;const cw=ctx.toLowerCase().match(/[a-z']+/g)||[];let best=-1,bs=0;
 entry[2].forEach((s,i)=>{const cue=String(s[5]||'').toLowerCase().split(/[^a-z]+/).filter(x=>x.length>2&&!['the','and','verb','noun','adjective'].includes(x));let sc=0;cue.forEach(w=>{if(cw.some(c=>c==w||c==w+'s'||c==w+'ing'||c==w+'ed'))sc+=2});
  String(s[3]||'').toLowerCase().split(/[^a-z]+/).filter(x=>x.length>3).forEach(w=>{if(cw.includes(w))sc+=.6});if(sc>bs){bs=sc;best=i}});return bs>=1.2?best:-1}
function tSense(s,i,hit){return`<div class=xfx style="${hit?'border-color:var(--ok);background:rgba(15,157,107,.08)':''}"><span class=chip style="cursor:default">${tPos[s[0]]||s[0]} · ${tPosAr[s[0]]||''}</span>${hit?' <b style="color:var(--ok)">← most likely in your sentence</b>':''}
 <div style="font-size:19px;margin:6px 0" dir=rtl lang=ar><b>${esc(s[1])}</b></div><p style="margin:2px 0">${esc(s[2])}</p>
 <p style="margin:6px 0">“${esc(s[3])}” ${tSay(s[3])}<br><span dir=rtl lang=ar class=mut>${esc(s[4])}</span></p>
 <p class=mut style="margin:4px 0">🔎 How to know: ${esc(s[5])}</p></div>`}
function tEnWord(w){if(!w)return'';const I=tIndex(),l=tLemma(w),e=I.en[l],sv=XS().sv,ctxPick=e?tPick(e,T.ctx):-1;let h='';
 const uk=(typeof XUK!='undefined'?XUK:[]).find(r=>r[0].replace(/ \(.*\)/,'')==l||r[1]==l);
 h+=`<div class=card><h2 style="margin:0">${esc(w)} ${tSay(w,'🔊')}</h2>${l!=w?`<p class=mut>Base form: <b>${esc(l)}</b></p>`:''}`;
 if(e){h+=`<p class=mut>${e[2].length} meaning${e[2].length>1?'s':''} found</p></div>`;e[2].forEach((s,i)=>h+=tSense(s,i,i==ctxPick));
  if(e[2].length>1)h+=`<div class=card><b>Which meaning?</b><p class=mut>Look at the words around it. Each meaning above has a “How to know” clue. You can also type the sentence in the optional box and translate again.</p></div>`}
 else{const ar=LEX[l],df=(typeof DEFS!='undefined'&&DEFS[l])||'';
  if(ar||df){h+=`</div><div class=card><div style="font-size:20px" dir=rtl lang=ar><b>${esc(ar||'')}</b></div>${df?`<p><b>Definition:</b> ${esc(df)}</p>`:''}<p class=mut>This word is in your lessons. For more meanings, use “More meanings online”.</p></div>`}
  else h+=`</div><div class=card><p>I do not have “${esc(w)}” in the offline dictionary.</p><p class=mut>Tap “More meanings online” (needs internet), or check the spelling.</p></div>`}
 const f=tForms(l,e);
 if(f&&f.v)h+=`<div class=card><h3 style="margin-top:0">Verb forms</h3><div class=xtab><span><small>base</small><b>${esc(f.v[0])}</b></span><span><small>he / she / it</small><b>${esc(f.v[1])}</b></span><span><small>past</small><b>${esc(f.v[2])}</b></span><span><small>past participle</small><b>${esc(f.v[3])}</b></span><span><small>-ing</small><b>${esc(f.v[4])}</b></span></div>${f.ir?'<p class=mut>This is an irregular verb.</p>':''}<p class=mut>Examples: I <b>${esc(f.v[0])}</b> · He <b>${esc(f.v[1])}</b> · Yesterday I <b>${esc(String(f.v[2]).split(' ')[0])}</b> · I have <b>${esc(String(f.v[3]).split(' ')[0])}</b> · I am <b>${esc(f.v[4])}</b></p></div>`;
 else if(f&&f.n)h+=`<div class=card><h3 style="margin-top:0">Word forms</h3><p>${f.n.map(x=>`<span class=chip style="cursor:default">${esc(x)}</span>`).join(' ')}</p></div>`;
 else if(/^[a-z]+$/.test(l)&&!e&&LEX[l]===undefined){}
 else if(!e&&/^[a-z]+$/.test(l)){h+=`<div class=card><h3 style="margin-top:0">Possible forms</h3><p class=mut>If it is a verb: ${esc(l)}, ${esc(tS3(l))}, ${esc(tEd(l))}, ${esc(tIng(l))}. If it is a noun: ${esc(l)}, ${esc(/(s|x|z|ch|sh)$/.test(l)?l+'es':/[^aeiou]y$/.test(l)?l.slice(0,-1)+'ies':l+'s')}.</p></div>`}
 if(uk)h+=`<div class=card><b>US ⇄ UK:</b> American <b>${esc(uk[0])}</b> · British <b>${esc(uk[1])}</b></div>`;
 const pr=(window.PAIRS||[]).filter(p=>p[0].toLowerCase().split(/[ \/’']+/).includes(l));pr.forEach(p=>h+=`<div class=card><b>⚠️ Often confused: ${esc(p[0])}</b><p style="margin:4px 0">${esc(p[1])}</p><p dir=rtl lang=ar class=mut>${esc(p[2])}</p><p class=mut>${esc(p[3])}</p></div>`);
 h+=`<div class=card><button type=button class="${sv[l]?'btn2':'btn'}" onclick="tSave('${esc(l).replace(/'/g,'')}')">${sv[l]?'✔ Saved':'⭐ Save this word'}</button> <button type=button class=btn2 onclick="tOnline('${esc(l).replace(/'/g,'')}')">🌐 More meanings online</button><div id=tmore></div></div>`;
 return h}
function tSave(w){const e=XS(),I=tIndex(),en=I.en[w],ar=en?String(en[2][0][1]).split(/\s*\/\s*/)[0]:(LEX[w]||'');if(e.sv[w])delete e.sv[w];else if(Object.keys(e.sv).length<300)e.sv[w]=ar||'—';save();T.on=tEnWord(w);draw()}
function tArWord(q){const I=tIndex(),k=tAr(q).replace(/^ال/,''),keys=[k,'ي'+k,k.replace(/^ي/,''),'ال'+k,tAr(q)];const hits=[],seen={};
 keys.forEach(x=>(I.ar[x]||[]).forEach(h=>{const id=h[0]+h[1];if(!seen[id]){seen[id]=1;hits.push(h)}}));
 if(!hits.length){Object.keys(I.ar).forEach(x=>{if(hits.length<12&&(x.split(/\s+/).includes(k)||x.split(/\s+/).includes('ال'+k)))I.ar[x].forEach(h=>{const id=h[0]+h[1];if(!seen[id]){seen[id]=1;hits.push(h)}})})}
 let h=`<div class=card><h2 style="margin:0" dir=rtl lang=ar>${esc(q)}</h2>`;
 if(!hits.length)return h+`<p>I could not find this Arabic word in the offline dictionary.</p><p class=mut>Tap the button to look for English equivalents online.</p><button type=button class=btn onclick="tOnlineAr()">🌐 Find English online</button><div id=tmore></div></div>`;
 for(let i=hits.length-1;i>=0;i--)if(hits[i][1]<0&&I.en[hits[i][0]])hits.splice(i,1);
 const words=[...new Set(hits.map(x=>x[0]))];h+=`<p class=mut>${words.length} English equivalent${words.length>1?'s':''}:</p><p>${words.map(w=>`<button type=button class=chip onclick="T.q='${esc(w).replace(/'/g,'')}';T.ctx='';tGoQ()">${esc(w)}</button>`).join('')}</p></div>`;
 hits.slice(0,10).forEach(([w,i])=>{const e=I.en[w];if(e&&i>=0){const s=e[2][i];h+=`<div class=card><h3 style="margin:0">${esc(w)} ${tSay(w,'🔊')} <span class=mut>(${tPos[s[0]]})</span></h3><p style="margin:4px 0"><b>Definition:</b> ${esc(s[2])}</p><p style="margin:4px 0">“${esc(s[3])}” ${tSay(s[3])}<br><span dir=rtl lang=ar class=mut>${esc(s[4])}</span></p><p class=mut>🔎 Use it when: ${esc(s[5])}</p></div>`}
  else{h+=`<div class=card><h3 style="margin:0">${esc(w)} ${tSay(w,'🔊')}</h3><p style="margin:4px 0"><b>Definition:</b> ${esc((typeof DEFS!='undefined'&&DEFS[w])||'In your lessons.')}</p></div>`}});
 return h}
function tSentence(q,isAr){const ph=(window.PHRASES||[]),norm=s=>s.toLowerCase().replace(/[’]/g,"'").replace(/[.!?؟,،]/g,'').trim(),n=isAr?tAr(q).replace(/[.!?؟,،]/g,''):norm(q);
 let hit=null;ph.forEach(p=>{const k=isAr?tAr(p[1]).replace(/[.!?؟,،]/g,''):norm(p[0]);if(k==n)hit=p});
 let h=`<div class=card><h2 style="margin:0">Sentence</h2><p style="font-size:18px" ${isAr?'dir=rtl lang=ar':''}>${esc(q)} ${isAr?'':tSay(q)}</p>`;
 if(hit){const en=hit[0],ar=hit[1];h+=`<p class=mut>Found in the phrase book (works offline):</p><p style="font-size:20px"><b>${esc(isAr?en:'')}</b>${isAr?tSay(en):''}</p><p style="font-size:20px" dir=rtl lang=ar><b>${isAr?'':esc(ar)}</b></p></div>`}
 else h+=`<p class=mut id=tst>${navigator.onLine===false?'You are offline. I can show a word-by-word help below.':'Translating online…'}</p><div id=tsr></div></div>`;
 /* word by word */
 const toks=isAr?q.split(/\s+/).filter(Boolean):q.replace(/[.!?,]/g,'').split(/\s+/).filter(Boolean),I=tIndex(),rows=[],multi=[];
 toks.forEach(t=>{if(isAr){const k=tAr(t).replace(/^ال/,''),a=I.ar[k]||I.ar['ي'+k]||I.ar[tAr(t)]||[];rows.push([t,a.length?[...new Set(a.map(x=>x[0]))].slice(0,3).join(' / '):'?'])}
  else{const l=tLemma(t),e=I.en[l];let ar=e?String(e[2][0][1]).split(/\s*\/\s*/)[0]:(LEX[l]||'?');rows.push([t,ar]);if(e&&e[2].length>1)multi.push([t,l,e])}});
 h+=`<div class=card><h3 style="margin-top:0">Word by word</h3><div class=xtab>${rows.map(r=>`<span><b ${isAr?'':'dir=rtl lang=ar'}>${esc(r[1])}</b><small>${esc(r[0])}</small></span>`).join('')}</div><p class=mut>This is a simple help. The order of words in the real translation can be different.</p></div>`;
 if(multi.length){h+=`<div class=card><h3 style="margin-top:0">🔎 Meaning detective</h3><p class=mut>These words have several meanings. Here is the most likely one in your sentence:</p>`;
  multi.slice(0,6).forEach(([t,l,e])=>{const i=tPick(e,q),s=e[2][i>=0?i:0];h+=`<p><b>${esc(t)}</b> → <b dir=rtl lang=ar>${esc(s[1])}</b> <small class=mut>(${i>=0?esc(s[2]):'not sure. First meaning shown: '+esc(s[2])})</small> <button type=button class=chip onclick="T.q='${esc(l).replace(/'/g,'')}';T.ctx=T.q0||'';tGoQ()">all meanings</button></p>`});T.q0=q;h+='</div>'}
 if(!hit&&navigator.onLine!==false)setTimeout(()=>tMM(q,isAr),30);
 return h}
async function tMM(q,isAr){const el=$('#tsr'),st=$('#tst');if(!el)return;
 try{const ct=new AbortController(),tm=setTimeout(()=>ct.abort(),10000),r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(q.slice(0,300))+'&langpair='+(isAr?'ar|en':'en|ar'),{signal:ct.signal});clearTimeout(tm);if(!r.ok)throw 0;const j=await r.json(),t=j.responseData&&j.responseData.translatedText;if(!t||/MYMEMORY WARNING|QUERY LENGTH/i.test(t))throw 0;
  const alt=[...new Set((j.matches||[]).map(m=>m.translation).filter(x=>x&&x!=t))].slice(0,3);
  if(st)st.textContent='Online translation:';
  el.innerHTML=`<p style="font-size:21px;margin:6px 0" ${isAr?'':'dir=rtl lang=ar'}><b>${esc(t)}</b> ${isAr?tSay(t):''}</p>${alt.length?`<p class=mut>Other versions:</p>${alt.map(a=>`<p ${isAr?'':'dir=rtl lang=ar'} class=mut>${esc(a)}</p>`).join('')}`:''}<p class=mut>Machine translation (MyMemory). Check important sentences with a teacher.</p>`}
 catch(e){if(st)st.textContent='The online translation is not available now. Use the word-by-word help below, or try again later.'}}
async function tOnline(w){const el=$('#tmore');if(!el)return;el.innerHTML='<p class=mut>Searching online…</p>';
 try{const ct=new AbortController(),tm=setTimeout(()=>ct.abort(),10000),r=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(w),{signal:ct.signal});clearTimeout(tm);if(!r.ok)throw 0;const j=await r.json();let h='';
  (j||[]).slice(0,1).forEach(en=>(en.meanings||[]).slice(0,5).forEach(m=>{h+=`<div class=xfx><span class=chip style="cursor:default">${esc(m.partOfSpeech)}</span>`+(m.definitions||[]).slice(0,3).map(d=>`<p style="margin:6px 0">${esc(d.definition)}${d.example?`<br><i>“${esc(d.example)}”</i> ${tSay(d.example)}`:''}</p>`).join('')+((m.synonyms||[]).length?`<p class=mut>Similar words: ${m.synonyms.slice(0,6).map(esc).join(', ')}</p>`:'')+'</div>'}));
  let ar='';try{const r2=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(w)+'&langpair=en|ar'),j2=await r2.json(),a=[...new Set([j2.responseData&&j2.responseData.translatedText,...(j2.matches||[]).map(m=>m.translation)].filter(Boolean))].slice(0,5);if(a.length)ar=`<p><b>Arabic:</b> <span dir=rtl lang=ar>${a.map(esc).join(' · ')}</span></p>`}catch(e){}
  el.innerHTML=(ar+h)||'<p class=mut>Nothing found online.</p>'+'<p class=mut>Source: dictionaryapi.dev and MyMemory (free online services).</p>'}
 catch(e){el.innerHTML='<p class="msg bad">Online search is not available now (no internet, or the word was not found).</p>'}}
async function tOnlineAr(){const el=$('#tmore'),q=T.q;if(!el)return;el.innerHTML='<p class=mut>Searching online…</p>';
 try{const r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(q)+'&langpair=ar|en'),j=await r.json(),a=[...new Set([j.responseData&&j.responseData.translatedText,...(j.matches||[]).map(m=>m.translation)].filter(x=>x&&!/MYMEMORY/i.test(x)))].slice(0,6);
  el.innerHTML=a.length?`<p>English equivalents:</p><p>${a.map(x=>`<button type=button class=chip onclick="T.q='${esc(String(x).toLowerCase()).replace(/'/g,'')}';T.ctx='';tGoQ()">${esc(x)}</button>`).join('')}</p><p class=mut>Tap a word to see its meanings, examples and forms.</p>`:'<p class=mut>Nothing found.</p>'}
 catch(e){el.innerHTML='<p class="msg bad">Online search is not available now.</p>'}}
function tSaved(){const e=XS(),ks=Object.keys(e.sv);return`<button class=btn2 type=button onclick="T.p='main';draw()">← Translator</button><h1>MY SAVED WORDS</h1>${ks.length?ks.map(k=>`<div class=card style="margin:8px 0"><b>${esc(k)}</b> ${tSay(k)} · <span dir=rtl lang=ar>${esc(e.sv[k])}</span> <button type=button class=chip onclick="T.q='${esc(k).replace(/'/g,'')}';T.ctx='';T.p='main';tGoQ()">open</button> <button type=button class=chip onclick="delete XS().sv['${esc(k).replace(/'/g,'')}'];save();draw()">remove</button></div>`).join('')+(ks.length>=4?'<button type=button class=btn onclick="tSavedQuiz()">Quiz me on my saved words</button>':'<p class=mut>Save 4 words to unlock the quiz.</p>'):'<div class=card><p>No saved words yet. Open a word and tap “Save this word”, or save the word of the day.</p></div>'}`}
function tSavedQuiz(){const e=XS(),ks=Object.keys(e.sv),ar=ks.map(k=>e.sv[k]);const it=sh(ks).slice(0,8).map(k=>({t:'mc',q:'What does “'+k+'” mean?',say:k,o:xDistract(e.sv[k],ar,4),a:e.sv[k],sk:'Vocabulary'}));V='explore';xRun(it,'My saved words','home')}
function tPairs(){return`<button class=btn2 type=button onclick="T.p='main';draw()">← Translator</button><h1>CONFUSING WORDS</h1>${(window.PAIRS||[]).map(p=>`<div class=card style="margin:8px 0"><h3 style="margin:0">${esc(p[0])}</h3><p style="margin:6px 0">${esc(p[1])}</p><p dir=rtl lang=ar class=mut>${esc(p[2])}</p><p>${esc(p[3])} ${tSay(p[3])}</p></div>`).join('')}`}
function tIrr(){const q=(T.iq||'').toLowerCase();const L=(window.IRR||[]).filter(r=>!q||r.join(' ').toLowerCase().includes(q)||r[3].includes(q));return`<button class=btn2 type=button onclick="T.p='main';draw()">← Translator</button><h1>IRREGULAR VERBS</h1><div class=card><input id=tiq type=search value="${esc(T.iq||'')}" placeholder="Search a verb (English or Arabic)" oninput="T.iq=this.value;tIrrDraw()" aria-label="Search irregular verbs"></div><div id=tirr>${tIrrRows(L)}</div>`}
function tIrrRows(L){return`<div class=card><div class=xirr><b>Base</b><b>Past</b><b>Participle</b><b>Arabic</b>${L.map(r=>`<span>${esc(r[0])} ${tSay(r[0],'▶')}</span><span>${esc(r[1])}</span><span>${esc(r[2])}</span><span dir=rtl lang=ar>${esc(r[3])}</span>`).join('')}</div></div>`}
function tIrrDraw(){const q=(T.iq||'').toLowerCase(),L=(window.IRR||[]).filter(r=>!q||r.join(' ').toLowerCase().includes(q)),e=$('#tirr');if(e)e.innerHTML=tIrrRows(L)}
