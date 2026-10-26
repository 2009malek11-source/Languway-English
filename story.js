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
 Samir:{g:'m',c:'#c06b2b',h:'#2b2118',p:1.7,s:.7,k:'c'},
 Zaid:{g:'m',c:'#d98324',h:'#2b2118',p:1.75,s:.66,k:'c'},
 Lina:{g:'f',c:'#d6578f',h:'#5a2b44',p:1.85,s:.66,k:'c'},
 Tariq:{g:'m',c:'#1f8a70',h:'#2b2118',p:1.1,s:.88,k:'t'},
 Nour:{g:'f',c:'#3c6fd1',h:'#25356b',p:1.3,s:.92},
 'Hajj Salem':{g:'m',c:'#e8e4d8',h:'#f2f2f2',p:.55,s:.96,o:1,k:'o'}
};
/* Voice kinds: man = low and steady, woman = higher, child = very high and quick, elder = very low and slow */
const VK={m:{p:.78,r:1},f:{p:1.3,r:1},c:{p:1.85,r:1.08},t:{p:1.1,r:1.04},o:{p:.6,r:.88}};
function vKind(c){return c.k||c.g}
const SKIN=['#f1c9a5','#e0ac82','#c68e63','#a8714a'];

/* One avatar, drawn with its feet at (x, ground). sp = this person is speaking now: it bounces, one arm gestures
   and a speech bubble with moving dots appears above the head. */
const OLN='#241a2e';
/* Emotion of a line: shout, ask, happy, sad or calm (drives eyes, eyebrows, mouth and small effects) */
function stEm(t){t=String(t||'').trim();if(/(sorry|hurt|tired|sad|pain|worry|worried|problem|lost|missed|cancel|rejected|failed|difficult)/i.test(t))return'sad';if(/(thank|welcome|nice|great|wonderful|happy|congrat|well done|love|excellent|amazing|perfect|good morning|good evening|enjoy|celebrate)/i.test(t))return'happy';if(/!$/.test(t))return'shout';if(/\?$/.test(t))return'ask';return'calm'}
/* Colour helpers: mix a hex colour with white (p>0) or black (p<0) */
function shd(h,p){const n=parseInt(String(h).replace('#',''),16),t=p<0?0:255,k=Math.abs(p),r=n>>16&255,g=n>>8&255,b=n&255,m=v=>Math.round(v+(t-v)*k);return'#'+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
/* Anime style, faceless: smooth head, flowing clothes, cel shading, rim light. Feelings are shown by posture and small effects (no drawn faces). */
function avatar(n,x,gy,sp,i,em){em=em||'calm';const c=CAST[n]||CAST.Omar,s=c.s||1,sk=SKIN[(n.length+i)%4],kid=c.k=='c',hs=kid?1.2:1,out=`stroke="${OLN}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"`,u='a'+i+n.length+(c.c||'').slice(1,4);
 const cc=c.c,hc=c.h;
 let b=`<g transform="translate(${x} ${gy}) scale(${s})"><defs><linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shd(cc,.28)}"/><stop offset=".55" stop-color="${cc}"/><stop offset="1" stop-color="${shd(cc,-.3)}"/></linearGradient><linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shd(hc,.3)}"/><stop offset=".6" stop-color="${hc}"/><stop offset="1" stop-color="${shd(hc,-.28)}"/></linearGradient><radialGradient id="${u}s" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${shd(sk,.35)}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${shd(sk,-.22)}"/></radialGradient></defs><g class=avo style="--dx:${x<180?-70:x>180?70:0}px;animation-delay:${(i*.18).toFixed(2)}s">`;
 if(sp)b+=`<ellipse class=aura cx="0" cy="-60" rx="46" ry="74" fill="${cc}" opacity=".30"/><g class=spk><path d="M-40,-120l6,12M40,-120l-6,12M-48,-70h12M48,-70h-12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>`;
 b+=`<ellipse cx="0" cy="2" rx="${sp?36:30}" ry="${sp?8:6}" fill="${sp?'#c9a45c':'#000'}" opacity="${sp?.95:.18}"/>`;
 b+=`<g class="${sp?'a-sp':'a-idle'}" style="animation-delay:${(i*.45).toFixed(2)}s">`;
 const hand=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="4.8" fill="url(#${u}s)" ${out}/>`;
 const head=(inner)=>{const tilt=em=='ask'?6:em=='sad'?-4:em=='shout'?-3:0,dy=em=='sad'?2:0;return`<g class=hd transform="translate(0 ${dy}) rotate(${tilt} 0 -84)"><g transform="translate(0 -97) scale(${hs}) translate(0 97)">${inner}</g></g>`};
 if(c.g=='f'){
  const arm=(sx,cl)=>`<g class="${cl}"><path d="M${sx},-76 L${sx+9},-76 L${sx+(sx<0?5:7)+9},-33 L${sx-(sx<0?7:5)},-33 Z" fill="url(#${u}c)" ${out}/><path d="M${sx-(sx<0?7:5)},-33 L${sx+(sx<0?5:7)+9},-33" stroke="#e9c76a" stroke-width="3" stroke-linecap="round"/>${hand(sx+(sx<0?-1:8)+4.5,-29)}</g>`;
  b+=`<path d="M-17,-72 L-25,-38 Q-31,-14 -37,0 L37,0 Q31,-14 25,-38 L17,-72 Z" fill="url(#${u}c)" ${out}/><path d="M7,-70 L17,-72 L25,-38 Q31,-14 37,0 L14,0 Q12,-30 7,-70Z" fill="#000" opacity=".15"/><path d="M-9,-64 Q-13,-30 -21,0 M0,-60 Q0,-30 -2,0 M9,-62 Q13,-30 21,0" stroke="${shd(cc,-.35)}" stroke-opacity=".5" stroke-width="1.3" fill="none"/><path d="M-36,-3 Q0,3 36,-3" stroke="#e9c76a" stroke-width="2.4" fill="none"/><path d="M-19,-62 L-27,-6" stroke="#fff" stroke-opacity=".28" stroke-width="2.2" fill="none"/>`;
  b+=arm(-30,'arm-l')+arm(21,sp?'arm-r wave':'arm-r');
  b+=`<path d="M-19,-53 Q0,-47 19,-53 L18,-46 Q0,-40 -18,-46 Z" fill="#e9c76a" ${out}/><path d="M-3,-49 L3,-49 L4,-42 L-4,-42Z" fill="#f6dc8c" ${out}/>`;
  b+=head(`<path class=hair d="M-22,-97 Q-26,-124 0,-125 Q26,-124 22,-97 L28,-66 Q27,-54 17,-52 Q0,-47 -17,-52 Q-27,-54 -28,-66 Z" fill="url(#${u}h)" ${out}/><path d="M-19,-104 Q-24,-84 -27,-62" stroke="#fff" stroke-opacity=".32" stroke-width="2.6" fill="none"/><path d="M-8,-58 Q0,-53 9,-58" stroke="${shd(hc,-.4)}" stroke-opacity=".5" stroke-width="1.5" fill="none"/><path d="M9,-74 Q20,-72 26,-64" stroke="${shd(hc,-.4)}" stroke-opacity=".45" stroke-width="1.4" fill="none"/><ellipse cx="0" cy="-99" rx="13" ry="15" fill="url(#${u}s)" ${out}/><path d="M-13,-100 Q-14,-117 0,-117.5 Q14,-117 13,-100 Q12,-110 0,-111 Q-12,-110 -13,-100Z" fill="url(#${u}h)" ${out}/><path d="M-12.4,-91 Q0,-77 12.4,-91 L11,-84 Q0,-73 -11,-84Z" fill="url(#${u}h)" ${out}/><path d="M-8,-114 Q-2,-117 5,-115" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="8" cy="-78" r="2.3" fill="#f6dc8c" ${out}/>`)}
 else{
  const arm=(sx,cl)=>`<g class="${cl}"><path d="M${sx},-78 L${sx+9},-78 L${sx+10},-34 L${sx-1},-34 Z" fill="url(#${u}c)" ${out}/><rect x="${sx-1.5}" y="-37" width="12" height="4" rx="1.5" fill="${shd(cc,-.35)}" ${out}/>${hand(sx+4.5,-29)}</g>`;
  b+=`<path d="M-17,-83 Q0,-91 17,-83 L24,-30 L29,0 L-29,0 L-24,-30 Z" fill="url(#${u}c)" ${out}/><path d="M6,-84 L17,-83 L24,-30 L29,0 L9,0 Z" fill="#000" opacity=".15"/><path d="M-16,-78 L-23,-6" stroke="#fff" stroke-opacity=".25" stroke-width="2.2" fill="none"/><path d="M-6,-87 L0,-76 L6,-87" fill="${shd(cc,.4)}" ${out}/><path d="M0,-76 V-4" stroke="${shd(cc,-.4)}" stroke-opacity=".6" stroke-width="1.2"/>${[-66,-54,-42].map(y=>`<circle cx="0" cy="${y}" r="1.3" fill="${shd(cc,.6)}"/>`).join('')}<path d="M-29,-3 Q0,2 29,-3" stroke="${shd(cc,-.45)}" stroke-width="2" fill="none"/>`;
  if(!c.coat&&!c.o)b+=`<path d="M-17,-81 L-6,-78 L-9,-36 L-22,-40Z M17,-81 L6,-78 L9,-36 L22,-40Z" fill="${shd(cc,-.38)}" opacity=".85" ${out}/>`;
  if(c.coat)b+=`<path d="M-3,-84 L3,-84 L5,0 L-5,0 Z" fill="#9fb4c9" stroke="${OLN}" stroke-width="1"/><circle cx="0" cy="-60" r="1.4" fill="${OLN}"/><circle cx="0" cy="-45" r="1.4" fill="${OLN}"/>`;
  if(c.ap)b+=`<rect x="-13" y="-62" width="26" height="52" rx="4" fill="#fff" opacity=".85" stroke="${OLN}" stroke-width="1"/>`;
  b+=arm(-28,'arm-l')+arm(19,sp?'arm-r wave':'arm-r');
  b+=head(`<ellipse class=hair cx="0" cy="-102" rx="16.5" ry="17.5" fill="url(#${u}h)" ${out}/><rect x="-4.5" y="-88" width="9" height="9" fill="url(#${u}s)" ${out}/><ellipse cx="-14.8" cy="-97" rx="2.5" ry="3.8" fill="url(#${u}s)" ${out}/><ellipse cx="14.8" cy="-97" rx="2.5" ry="3.8" fill="url(#${u}s)" ${out}/><ellipse cx="0" cy="-98" rx="13.8" ry="15.4" fill="url(#${u}s)" ${out}/>${c.o?`<path d="M-13.5,-92 Q-12,-72 0,-70 Q12,-72 13.5,-92 Q9,-83 0,-82.5 Q-9,-83 -13.5,-92Z" fill="url(#${u}h)" ${out}/>`:''}<path class=hair d="M-16,-100 C-19,-127 19,-127 16,-100 L13,-109 L9.5,-101.5 L6,-112 L1.5,-103 L-3.5,-113.5 L-7.5,-103 L-12,-111 Z" fill="url(#${u}h)" ${out}/><path d="M-10,-117 Q-2,-121 8,-117.5" stroke="#fff" stroke-opacity=".45" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M-3.5,-110 L-1,-104 M5,-109 L6.5,-104" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>`)}
 if(sp&&em=='happy')b+=`<g class=twk><path d="M-26,-124 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2z" fill="#ffe27a" stroke="#fff" stroke-width=".8"/><path d="M26,-118 l1.6,4 4,1.6 -4,1.6 -1.6,4 -1.6,-4 -4,-1.6 4,-1.6z" fill="#fff6c2"/><path d="M-30,-96 l1.2,3 3,1.2 -3,1.2 -1.2,3 -1.2,-3 -3,-1.2 3,-1.2z" fill="#fff"/></g>`;
 if(sp&&em=='ask')b+=`<path class=swt d="M19,-112 q-4,6 0,9 q4,-3 0,-9z" fill="#8fd3ff" stroke="#3a86c8" stroke-width="1.1"/>`;
 if(sp&&em=='sad')b+=`<g class=gl><path d="M-9,-128 v9 M0,-130 v11 M9,-128 v9" stroke="#4a5a8a" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>`;
 b+='</g>';
 if(sp)b+=`<g transform="translate(${c.g=='f'?18:14} -146)"><path d="M0,0 h40 a8,8 0 0 1 8,8 v10 a8,8 0 0 1 -8,8 h-26 l-8,8 v-8 h-6 a8,8 0 0 1 -8,-8 v-10 a8,8 0 0 1 8,-8z" fill="#fff" stroke="#0b4aa8" stroke-width="2" transform="translate(-6 0) scale(.95)"/><circle class="dot d1" cx="12" cy="13" r="3" fill="#0b4aa8"/><circle class="dot d2" cx="24" cy="13" r="3" fill="#0b4aa8"/><circle class="dot d3" cx="36" cy="13" r="3" fill="#0b4aa8"/></g>`;
 return b+`<text x="0" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" stroke="#000" stroke-width="2.5" paint-order="stroke">${esc(n.replace('Dr. ','Dr '))}</text></g></g>`}

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
/* Every character gets its own voice: men, women and children are spread over the different English voices of the device (so two men never share one voice when the device has several). Pitch and speed add a second difference. */
const STF=/female|samantha|zira|susan|hazel|karen|moira|tessa|fiona|victoria|aria|jenny|libby|sonia|ava\b|allison|serena|emma|amy|joanna|kendra|kimberly|salli|ivy|nicole|olivia|natasha|clara|mia\b|heather|catherine|jane|linda|sara|lucy|zoe|eva|ellen|aditi|raveena/i,STM=/(^|[^a-z])male|david|mark\b|daniel|alex\b|george|guy\b|ryan|james|thomas|oliver|arthur|aaron|fred\b|brian|matthew|justin|joey|russell|liam|william|eric|davis|andrew|christopher|roger|steffan|ronnie|rishi|gordon|lee\b/i;
let STV={},STVK='';
function stVoiceMap(){let vs=[];try{vs=(typeof VOICES!='undefined'&&VOICES.length?VOICES:speechSynthesis.getVoices()).filter(v=>/^en/i.test(v.lang))}catch(e){}
 const key=vs.map(v=>v.name).join('|')+S.set.acc;if(key==STVK)return;STVK=key;STV={};if(!vs.length)return;
 const acc=vs.filter(v=>String(v.lang).replace('_','-')==S.set.acc),pool=(acc.length>=3?acc:vs.slice().sort((a,b)=>(String(b.lang).replace('_','-')==S.set.acc)-(String(a.lang).replace('_','-')==S.set.acc))),q=v=>typeof VQ=='function'?VQ(v):0,srt=a=>a.slice().sort((x,y)=>q(y)-q(x));
 const fem=srt(pool.filter(v=>STF.test(v.name))),mal=srt(pool.filter(v=>STM.test(v.name)&&!STF.test(v.name))),oth=srt(pool.filter(v=>!STF.test(v.name)&&!STM.test(v.name)));
 const cnt={m:0,f:0};
 Object.keys(CAST).forEach(n=>{const c=CAST[n],kind=c.g=='f'?'f':'m',L=kind=='f'?(fem.length?fem:oth.length?oth:pool):(mal.length?mal:oth.length?oth:pool),i=cnt[kind]++;STV[n]=L[i%L.length]||null})}
function stVoiceFor(who,c){try{stVoiceMap();return STV[who]||stVoice(c.g)}catch(e){return stVoice(c.g)}}
function stVoice(g){try{if(typeof pickVoice=='function')return pickVoice(g)}catch(e){}try{const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));if(!vs.length)return null;
 const acc=vs.filter(v=>v.lang.replace('_','-')==S.set.acc),pool=acc.length?acc:vs,
  f=/female|samantha|zira|susan|hazel|karen|moira|tessa|fiona|victoria|aria|jenny|libby|sonia/i,m=/(^|[^a-z])male|david|mark|daniel|alex|fred|george|guy|ryan|james|thomas|oliver|arthur/i,
  want=g=='f'?f:m;return pool.find(v=>want.test(v.name)&&!(g!='f'&&f.test(v.name)))||pool[0]}catch(e){return null}}
/* Speak one line. onword(k) is called with the index of the word being spoken (real boundary events when the browser gives them, otherwise an estimate). */
function stSpeak(who,text,done,onword){let fin=0,gotB=0,tick=null;const words=text.split(' '),per=420/Math.max(.5,stRate()),ms=Math.max(1800,words.length*per*1.5+900),
 end=()=>{if(fin)return;fin=1;clearTimeout(tm);clearInterval(tick);done()},tm=setTimeout(end,ms*2.2);
 if(onword){let k=0;onword(0);tick=setInterval(()=>{if(gotB||fin)return clearInterval(tick);k++;if(k<words.length)onword(k)},per)}
 try{if(!window.speechSynthesis||typeof SpeechSynthesisUtterance=='undefined'){clearTimeout(tm);setTimeout(end,ms);return}
  speechSynthesis.cancel();const sp2=(typeof ttsText=='function'?ttsText(text):text),same=sp2.split(' ').length==words.length,u=new SpeechSynthesisUtterance(sp2),c=CAST[who]||CAST.Omar,v=stVoiceFor(who,c);if(v)u.voice=v;u.lang=S.set.acc;const vk=VK[vKind(c)]||VK.m,base=c.g=='f'?1.25:.8;u.pitch=Math.max(.5,Math.min(2,c.k=='c'||c.k=='o'?c.p:vk.p+(c.p-base)*.3));const hh=[...who].reduce((a,ch)=>a+ch.charCodeAt(0),0);u.pitch=Math.max(.5,Math.min(2,u.pitch+((hh%7)-3)*.035));u.rate=Math.max(.5,Math.min(1.3,stRate()*vk.r*(1+((hh%5)-2)*.025)));if(/!$/.test(text.trim())){u.pitch=Math.min(2,u.pitch+.15);u.rate=Math.min(1.3,u.rate*1.06)}else if(/\?$/.test(text.trim()))u.pitch=Math.min(2,u.pitch+.1);
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
/* Anime atmosphere over the picture: soft light rays, drifting petals or dust, and a dark vignette */
function atm(set){const out=['street','market','park','station'].includes(set),pt=Array.from({length:9},(_,k)=>`<ellipse class=ptl style="animation-delay:-${(k*1.3).toFixed(1)}s;animation-duration:${(7+k%4*2)}s" cx="${20+k*38}" cy="-10" rx="3.2" ry="1.9" fill="${out?'#ffd1dc':'#fff'}" opacity=".75"/>`).join('');
 return`<rect width="360" height="120" fill="url(#sg)"/><rect y="140" width="360" height="80" fill="url(#gg)"/><g class=bok>${[[40,40,16],[300,30,22],[330,90,12],[120,24,10]].map((q,k)=>`<circle cx="${q[0]}" cy="${q[1]}" r="${q[2]}" fill="#fff" opacity=".14" style="animation-delay:-${k*1.7}s"/>`).join('')}</g><g class=rays2 opacity=".16"><polygon points="250,0 300,0 150,220 70,220" fill="#fff"/><polygon points="320,0 350,0 270,220 220,220" fill="#fff"/></g><g class=ptls>${pt}</g><rect width="360" height="220" fill="url(#vg)"/>`}
function svgHtml(){const sc=scOf(),ln=sc.lines[Math.min(SY.l,sc.lines.length-1)],on=SY.pl||SY.l>0,sp=on?ln[0]:'',k=sc.cast.length,xs=k==1?[180]:k==2?[110,250]:[70,180,290],t=TOD[SY.i%4];
 const si=sc.cast.indexOf(sp),sx=si>=0?xs[si]:180,fx=sp&&si>=0?Math.round(sx/3.6):50,tx=ln[1].trim(),sh=on&&/!$/.test(tx),qm=on&&/\?$/.test(tx);
 const spd=sh?`<g class=spd>${Array.from({length:30},(_,k)=>{const an=k/30*Math.PI*2,r1=62+(k%3)*14,r2=240;return`<line x1="${(sx+Math.cos(an)*r1).toFixed(1)}" y1="${(110+Math.sin(an)*r1*.7).toFixed(1)}" x2="${(sx+Math.cos(an)*r2).toFixed(1)}" y2="${(110+Math.sin(an)*r2*.7).toFixed(1)}" stroke="#fff" stroke-width="${k%2?1.4:2.6}" opacity=".55"/>`}).join('')}</g>`:'',qmk=qm?`<text class=qm x="${sx+30}" y="78" font-size="44" font-weight="900" fill="#ffd84a" stroke="#06183a" stroke-width="3" paint-order="stroke">?</text>`:'',bang=sh?`<text class=bang x="${sx+30}" y="74" font-size="46" font-weight="900" fill="#ff5a4a" stroke="#fff" stroke-width="3" paint-order="stroke">!</text>`:'';
 return `<svg style="transform-origin:${fx}% 66%" viewBox="0 0 360 220" role="img" aria-label="Scene: ${esc(CAP[sc.set]||sc.set)} with ${esc(sc.cast.join(', '))}"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d6" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a1230" stop-opacity=".32"/></linearGradient><radialGradient id="vg" cx="50%" cy="48%" r="75%"><stop offset="62%" stop-color="#0a1230" stop-opacity="0"/><stop offset="100%" stop-color="#0a1230" stop-opacity=".55"/></radialGradient></defs><g class="shk${sh?' shout':''}">${((window.SETS2&&SETS2[sc.set])?SETS2[sc.set](SY.i%4):(SETS[sc.set]||SETS.home)())}${t[2]?`<rect width="360" height="220" fill="${t[1]}" opacity="${t[2]}"/>`:''}${spd}${sc.cast.map((n,i)=>avatar(n,xs[i],184,n==sp&&on,i,n==sp&&on?stEm(tx):'calm')).join('')}${qmk}${bang}${atm(sc.set)}</g></svg>`}
function subHtml(){const sc=scOf(),ln=sc.lines[Math.min(SY.l,sc.lines.length-1)],on=SY.ph=='scene'&&(SY.pl||SY.l>0);
 return on?`<div class="sub${/!$/.test(ln[1].trim())?' shout':''}" id=sub aria-live=polite><b>${esc(ln[0])}</b><br><span class=en>${ln[1].split(' ').map(w=>`<span class=wd>${esc(w)}</span>`).join(' ')}</span>${S.set.sa&&ln[2]?`<br><span class=ar>${esc(ln[2])}</span>`:''}</div>`:`<div class=sub id=sub><span class=mut>${SY.ph=='scene'?'Press Play to watch this scene.':'Which answer is right?'}</span></div>`}
function cardHtml(){const e=epOf(SY.n);return `<div class="stg tcard enter"><div class=rays></div><div class=tc><small>CEDAR CITY · LEVEL ${SY.n}</small><h2>EPISODE ${SY.n}</h2><i class=cut></i><p>${esc(e.t)}</p></div></div><div class=sub id=sub><span class=mut>Press Play to start the episode.</span></div>`}
function stageHtml(f){if(SY.card&&SY.ph=='scene')return cardHtml();const sc=scOf();
 return `<div class="stg cine ${f?'enter':''} ${SY.pl?'kb':''}" id=stg>${svgHtml()}${f?`<div class=slam>SCENE ${SY.i+1}</div><i class=slash></i>`:''}<div class=cap>${esc(CAP[sc.set]||'')} · ${TOD[SY.i%4][0]}${(S.set.rp||1)>1&&SY.pl?' · Play '+(SY.rep||1)+' of '+S.set.rp:''}</div></div>`+subHtml()}
function transHtml(){const sc=scOf(),upto=SY.ph=='scene'?(SY.pl||SY.l>0?SY.l:-1):sc.lines.length-1;
 return sc.lines.map((l,i)=>i>upto?'':`<button class=stl onclick="stLineGo(${i})"><b>${esc(l[0])}:</b> ${esc(l[1])}${S.set.sa&&l[2]?`<br><span class=ar>${esc(l[2])}</span>`:''}</button>`).join('')}
function starsHtml(e){const t=e.scenes.length;return `<span class=stars aria-label="${SY.ok} of ${t} stars">${'⭐'.repeat(SY.ok)}${'☆'.repeat(Math.max(0,t-SY.ok))}</span>`}
function vStory(){const e=epOf(SY&&SY.n);if(!SY||!e)return'<h1>STORIES</h1><div class=card><button class=btn onclick="go(\'stories\')">Choose an episode</button></div>';
 const tot=e.scenes.length,head=`<button class=btn2 onclick="stHalt();go('stories')">← All episodes</button><h1>EPISODE ${SY.n}</h1><p class=mut>${esc(e.t)} · Scene ${Math.min(SY.i+1,tot)} of ${tot} · ${starsHtml(e)}</p><div class=bar><i style="width:${Math.round((SY.ph=='end'?tot:SY.i+(SY.ph=='q'?.6:SY.l/Math.max(1,scOf().lines.length)*.5))/tot*100)}%"></i></div>`;
 if(SY.ph=='end'){const pct=Math.round(SY.ok/tot*100);
  const nx=epOf(SY.n+1);return head+`${pct>=75?`<div class=tbc>TO BE CONTINUED<b>▶</b></div>${nx?`<p class=mut style="text-align:center">Next time: <b>${esc(nx.t)}</b></p>`:''}`:''}${pct>=75?cele('Episode complete'+nmS()+'!','You earned '+SY.ok+' of '+tot+' stars.'):''}<div class=card><h2>${starsHtml(e)}</h2><p>${pct>=75?'Well done. You understood the story. Your English is growing!':'Watch the scenes again and listen for the key words. Every replay makes it easier.'}</p><button class=btn onclick="storyOpen(${SY.n})">Watch again</button> ${SY.n<NLV&&epOf(SY.n+1)&&lvOpen(SY.n+1)?`<button class=btn2 onclick="storyOpen(${SY.n+1})">Next episode</button>`:''} <button class=btn2 onclick="go('stories')">All episodes</button></div>`}
 const fresh=SY.fresh;SY.fresh=0;
 if(SY.ph=='q')return head+`<div id=stage>${stageHtml(fresh)}</div>`+stQ();
 return head+`<div id=stage>${stageHtml(fresh)}</div><div class=stc><button class=btn onclick="stPlay()">${SY.pl?'⏸ Pause':SY.l>0?'▶ Resume':'▶ Play scene'}</button> <button class=btn2 onclick="stRestart()">↺ Replay</button> <button class=btn2 onclick="S.set.rp=(S.set.rp%3)+1;save();draw()">🔁 Play ${S.set.rp||1}×</button> <button class=btn2 onclick="SYslow=!SYslow;draw()">🐢 Slower: ${SYslow?'on':'off'}</button> <button class=btn2 onclick="stSkip()">Skip to question</button></div><label class=set>Arabic subtitles<input type=checkbox ${S.set.sa?'checked':''} onchange="S.set.sa=this.checked;save();stRefresh()"></label><div id=trans>${transHtml()}</div>`}
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
function stAnswer(j){if(!SY||SY.qa>=0)return;SY.qa=j;const ok=SY.ord[j]==scOf().q[1];if(ok){SY.ok++;SY.cmb=(SY.cmb||0)+1;try{confetti()}catch(e){}stFx(SY.cmb>1?'COMBO ×'+SY.cmb+'!':'+1 ⭐')}else SY.cmb=0;const t=S.sk.Listening=S.sk.Listening||[0,0];t[1]++;if(ok)t[0]++;save();draw()}
function stAfter(){const e=epOf(SY.n);if(SY.i+1>=e.scenes.length){const pct=Math.round(SY.ok/e.scenes.length*100);S.sty[SY.n]=Math.max(S.sty[SY.n]||0,pct);if(pct>=75)S.days[today()]=(S.days[today()]||0)+1;save();SY.ph='end';return draw()}
 SY.i++;SY.l=0;SY.ph='scene';SY.qa=-1;SY.ord=null;SY.fresh=1;SY.card=0;draw();scrollTo(0,0);stPlay()}
function stLeave(){stHalt()}
