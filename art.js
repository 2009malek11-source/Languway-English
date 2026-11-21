/* LanguWay English: SVG art library (loaded before ui.js).
   Everything here is hand-coded SVG: gradients and filters live in one hidden sprite (#sprite) so every
   inline SVG can use url(#id). No emoji, no raster art except the real brand mark (logo-mark*.png).
   Exposed on window.ART:  ART.sprite(), ART.ix(name), ART.hero(), ART.bridge(), ART.trophy(), ART.shield(n),
                           ART.scroll(), ART.crown(), ART.avatar(letter), ART.brand(cls) */
(function(){
const E=s=>s;
/* ---------- gradients and filters ---------- */
const SPRITE=`<svg id=sprite width=0 height=0 style="position:absolute;pointer-events:none" aria-hidden=true focusable=false><defs>
<linearGradient id=gV x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#8f6bff /><stop offset=1 stop-color=#3d4bf0 /></linearGradient>
<linearGradient id=gB x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#59c2ff /><stop offset=1 stop-color=#2556e8 /></linearGradient>
<linearGradient id=gG x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#5fe0a2 /><stop offset=1 stop-color=#0a9a62 /></linearGradient>
<linearGradient id=gO x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#ffe27a /><stop offset=.55 stop-color=#ffb02e /><stop offset=1 stop-color=#e8791a /></linearGradient>
<linearGradient id=gR x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#ff8aa0 /><stop offset=1 stop-color=#e0344f /></linearGradient>
<linearGradient id=gN x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#1d3fa6 /><stop offset=1 stop-color=#0a1b66 /></linearGradient>
<linearGradient id=gS x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#1b43c9 /><stop offset=.55 stop-color=#5d8cff /><stop offset=1 stop-color=#cfe0ff /></linearGradient>
<linearGradient id=gD x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#241a8f /><stop offset=1 stop-color=#4b2bd6 /></linearGradient>
<linearGradient id=gStone x1=0 y1=0 x2=1 y2=0><stop offset=0 stop-color=#c9b184 /><stop offset=.5 stop-color=#e9d8ae /><stop offset=1 stop-color=#b79c6c /></linearGradient>
<linearGradient id=gGlass x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#fff stop-opacity=.55 /><stop offset=1 stop-color=#fff stop-opacity=0 /></linearGradient>
<radialGradient id=rGlow><stop offset=0 stop-color=#fff stop-opacity=.9 /><stop offset=1 stop-color=#7fa8ff stop-opacity=0 /></radialGradient>
<radialGradient id=rGold><stop offset=0 stop-color=#ffe9a0 stop-opacity=.95 /><stop offset=1 stop-color=#ffb02e stop-opacity=0 /></radialGradient>
<filter id=fGlow x=-40% y=-40% width=180% height=180%><feGaussianBlur stdDeviation=2.4 result=b /><feMerge><feMergeNode in=b /><feMergeNode in=SourceGraphic /></feMerge></filter>
<filter id=fSoft x=-30% y=-30% width=160% height=160%><feGaussianBlur stdDeviation=6 /></filter>
</defs></svg>`;

/* ---------- rich icons (24x24 grid, gradient fills, a little glow) ---------- */
const IX={
rocket:`<path d="M12 2.2c3.6 1.7 5.4 5.3 5 9.4l-2 2.2H9l-2-2.2c-.4-4.1 1.4-7.7 5-9.4z" fill="url(#gV)"/><circle cx="12" cy="9" r="1.9" fill="#fff"/><path d="M7.2 12.5 4 15.4l.6 3.2 3.4-2zM16.8 12.5l3.2 2.9-.6 3.2-3.4-2z" fill="url(#gB)"/><path d="M10 15.5h4l-.8 4.8c-.1.7-1.3.7-1.4 0z" fill="url(#gO)"/>`,
book:`<path d="M3 6.2c3-1.2 6-1 9 .9v12.8c-3-1.9-6-2.1-9-.9z" fill="url(#gG)"/><path d="M21 6.2c-3-1.2-6-1-9 .9v12.8c3-1.9 6-2.1 9-.9z" fill="#17b97a"/><path d="M5.2 9.2c1.8-.3 3.4 0 4.8.8M5.2 12.2c1.8-.3 3.4 0 4.8.8M14 10c1.4-.8 3-1.1 4.8-.8M14 13c1.4-.8 3-1.1 4.8-.8" stroke="#fff" stroke-width="1.1" stroke-linecap="round" fill="none" opacity=".9"/>`,
trophy:`<path d="M7 3.5h10v5.2a5 5 0 0 1-10 0z" fill="url(#gO)"/><path d="M7 5H4.2v1.6A3.4 3.4 0 0 0 7.5 10M17 5h2.8v1.6A3.4 3.4 0 0 1 16.5 10" fill="none" stroke="#f3a21e" stroke-width="1.6" stroke-linecap="round"/><path d="M10.6 13.2h2.8v3h-2.8z" fill="#f3a21e"/><path d="M8 20.5v-2.2a1.2 1.2 0 0 1 1.2-1.2h5.6a1.2 1.2 0 0 1 1.2 1.2v2.2z" fill="url(#gV)"/><path d="m12 5.3.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="#fff" opacity=".9"/>`,
star:`<path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.3l-5.8 3.1 1.1-6.4L2.6 9.4l6.5-.9z" fill="url(#gO)" stroke="#ffcf5a" stroke-width=".8" stroke-linejoin="round"/><path d="m12 5.4 1.8 3.7" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round" fill="none"/>`,
bars:`<rect x="3.5" y="12.5" width="4.4" height="8" rx="1.6" fill="url(#gV)"/><rect x="9.8" y="7" width="4.4" height="13.5" rx="1.6" fill="url(#gB)"/><rect x="16.1" y="3.5" width="4.4" height="17" rx="1.6" fill="url(#gV)"/>`,
play:`<circle cx="12" cy="12" r="9.5" fill="url(#gV)"/><path d="m10 7.6 6 4.4-6 4.4z" fill="#fff"/><circle cx="12" cy="12" r="9.5" fill="url(#gGlass)" opacity=".5"/>`,
playb:`<circle cx="12" cy="12" r="9.5" fill="url(#gB)"/><path d="m10 7.6 6 4.4-6 4.4z" fill="#fff"/>`,
vocab:`<circle cx="12" cy="12" r="9.5" fill="url(#gG)"/><path d="M6.6 8.4c1.9-.7 3.7-.5 5.4.6v7.6c-1.7-1.1-3.5-1.3-5.4-.6zM17.4 8.4c-1.9-.7-3.7-.5-5.4.6v7.6c1.7-1.1 3.5-1.3 5.4-.6z" fill="#fff"/>`,
gram:`<circle cx="12" cy="12" r="9.5" fill="url(#gO)"/><path d="m8 17 4-10 4 10M9.3 13.8h5.4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
check:`<circle cx="12" cy="12" r="9.5" fill="url(#gV)"/><path d="m7.6 12.4 3 3 5.8-6.4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
headset:`<path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" fill="none" stroke="url(#gB)" stroke-width="2.2" stroke-linecap="round"/><rect x="3" y="13" width="4.6" height="7" rx="2.2" fill="url(#gB)"/><rect x="16.4" y="13" width="4.6" height="7" rx="2.2" fill="url(#gB)"/><path d="M5.3 15h1M17.7 15h1" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>`,
tests:`<rect x="3.5" y="3.5" width="17" height="17" rx="4.6" fill="url(#gB)"/><path d="m7.6 12.2 3 3 5.8-6.6" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
wordbook:`<path d="M2.8 5.8c3.2-1.3 6.4-1 9.2 1v13.4c-2.8-2-6-2.3-9.2-1z" fill="url(#gB)"/><path d="M21.2 5.8c-3.2-1.3-6.4-1-9.2 1v13.4c2.8-2 6-2.3 9.2-1z" fill="#2f6af2"/><path d="M5 9c1.6-.2 3.2.1 5 .9M5 12c1.6-.2 3.2.1 5 .9M14 9.9c1.8-.8 3.4-1.1 5-.9M14 12.9c1.8-.8 3.4-1.1 5-.9" stroke="#fff" stroke-width="1.1" stroke-linecap="round" fill="none"/>`,
calendar:`<rect x="3.5" y="5" width="17" height="15.5" rx="3.4" fill="url(#gV)"/><path d="M3.5 9.6h17" stroke="#fff" stroke-opacity=".5"/><path d="M8 3.2v3.4M16 3.2v3.4" stroke="#b9a6ff" stroke-width="2" stroke-linecap="round"/><g fill="#fff"><circle cx="8" cy="12.6" r="1"/><circle cx="12" cy="12.6" r="1"/><circle cx="16" cy="12.6" r="1"/><circle cx="8" cy="16.4" r="1"/><circle cx="12" cy="16.4" r="1"/><circle cx="16" cy="16.4" r="1"/></g>`,
bolt:`<path d="M13.6 2 5 13.4h6L9.8 22 19 10h-6z" fill="url(#gO)" stroke="#ffcf5a" stroke-width=".7" stroke-linejoin="round"/>`,
pin:`<path d="M12 2.6a5.5 5.5 0 0 1 3 10.1L12 21l-3-8.3a5.5 5.5 0 0 1 3-10.1z" fill="url(#gV)"/><circle cx="12" cy="8.4" r="2" fill="#fff"/>`,
cert:`<rect x="3" y="4" width="18" height="12.5" rx="2.4" fill="url(#gO)"/><path d="M6.6 8h10.8M6.6 11h7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="m9 15.5-1.2 5 3.4-1.8 3.4 1.8-1.2-5z" fill="url(#gR)"/>`,
chat:`<path d="M4.5 4h15a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.6 3.6V17H4.5A2.5 2.5 0 0 1 2 14.5v-8A2.5 2.5 0 0 1 4.5 4z" fill="url(#gB)"/><circle cx="8" cy="10.5" r="1.2" fill="#fff"/><circle cx="12" cy="10.5" r="1.2" fill="#fff"/><circle cx="16" cy="10.5" r="1.2" fill="#fff"/>`,
globe:`<circle cx="12" cy="12" r="9.5" fill="url(#gB)"/><path d="M2.8 12h18.4M12 2.6c3.4 3.6 3.4 14.2 0 18.8M12 2.6c-3.4 3.6-3.4 14.2 0 18.8" stroke="#fff" stroke-opacity=".75" stroke-width="1.2" fill="none"/>`,
story:`<rect x="2.8" y="4.6" width="18.4" height="14.8" rx="3.4" fill="url(#gR)"/><path d="m10 8.8 5.6 3.2-5.6 3.2z" fill="#fff"/>`,
review:`<rect x="4" y="3" width="13" height="17" rx="3" fill="url(#gG)"/><rect x="7" y="6" width="13" height="16" rx="3" fill="#13b57a" opacity=".85"/><path d="m10 14 2.4 2.4 4-4.6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
search:`<circle cx="10.5" cy="10.5" r="6.4" fill="none" stroke="url(#gV)" stroke-width="2.6"/><path d="m15.4 15.4 5 5" stroke="url(#gO)" stroke-width="3" stroke-linecap="round"/>`,
helper:`<circle cx="12" cy="12" r="9.5" fill="url(#gV)"/><path d="M9.2 9.6a2.9 2.9 0 1 1 4.2 2.6c-.9.5-1.4 1-1.4 2" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="12" cy="17.2" r="1.2" fill="#fff"/>`,
pen:`<path d="m4 20 1-4.6L16.6 3.8a2.3 2.3 0 0 1 3.2 3.2L8.2 18.6z" fill="url(#gO)"/><path d="m14.6 5.8 3.6 3.6" stroke="#fff" stroke-opacity=".8" stroke-width="1.4"/><path d="m4 20 1-4.6 3.6 3.6z" fill="#3d4bf0"/>`,
sound:`<path d="M3.5 9.6h3.4l4.6-4v13.2l-4.6-4H3.5z" fill="url(#gB)"/><path d="M15 8.6a4.8 4.8 0 0 1 0 6.8M17.8 6a8.4 8.4 0 0 1 0 12" stroke="url(#gV)" stroke-width="2" stroke-linecap="round" fill="none"/>`,
mic:`<rect x="8.6" y="2.6" width="6.8" height="12" rx="3.4" fill="url(#gV)"/><path d="M5.4 11.5a6.6 6.6 0 0 0 13.2 0M12 18.2v3" stroke="url(#gB)" stroke-width="2" stroke-linecap="round" fill="none"/>`,
fire:`<path d="M12 2.4c.8 3.2 4.6 5 4.6 9.4a4.6 4.6 0 0 1-9.2 0c0-1.8.8-3 1.8-4 .1 1.4.8 2.2 1.6 2.4C10.2 7.4 10.6 4.6 12 2.4z" fill="url(#gO)"/><path d="M12 12.6c1.6 1.2 2.4 2.2 2.4 3.4a2.4 2.4 0 0 1-4.8 0c0-1.2.8-2.2 2.4-3.4z" fill="#fff" opacity=".85"/>`,
shield:`<path d="M12 2.4 20 5.4v6.2c0 4.8-3.2 8.2-8 10-4.8-1.8-8-5.2-8-10V5.4z" fill="url(#gV)"/><path d="M12 4.8 18 7v4.6c0 3.6-2.3 6.3-6 7.8-3.7-1.5-6-4.2-6-7.8V7z" fill="none" stroke="#fff" stroke-opacity=".45"/>`,
bell:`<path d="M5.8 17v-6a6.2 6.2 0 0 1 12.4 0v6l1.8 2.2H4z" fill="url(#gB)"/><path d="M9.8 20.6h4.4a2.2 2.2 0 0 1-4.4 0z" fill="url(#gO)"/>`,
spark:`<path d="M12 2.5c.9 4.6 2.9 6.6 7.5 7.5-4.6.9-6.6 2.9-7.5 7.5-.9-4.6-2.9-6.6-7.5-7.5 4.6-.9 6.6-2.9 7.5-7.5z" fill="url(#gO)"/><circle cx="19" cy="18.6" r="1.7" fill="url(#gV)"/><circle cx="5" cy="19.4" r="1.1" fill="url(#gB)"/>`,
idiom:`<path d="M4 4.5h12.5a2.5 2.5 0 0 1 2.5 2.5v6.5A2.5 2.5 0 0 1 16.5 16H10l-4 3.6V16H4z" fill="url(#gR)"/><path d="M8 8.4h7M8 11.4h4.4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M17 9.5h2.5A2.5 2.5 0 0 1 22 12v5.2a2.5 2.5 0 0 1-2.5 2.5H19v2.4l-2.8-2.4H13" fill="#e0344f" opacity=".55"/>`,
translate:`<rect x="2.6" y="3.4" width="12.6" height="12.6" rx="3.2" fill="url(#gB)"/><path d="M5.6 7h6.6M8.9 5.4V7M7 7c.4 2.2 1.8 3.6 3.8 4.4M11.2 7c-.6 2.2-2 3.6-4 4.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" fill="none"/><rect x="9" y="8.6" width="12.4" height="12.4" rx="3.2" fill="url(#gV)"/><path d="m12.4 18.4 2.8-6.2 2.8 6.2M13.4 16.4h3.6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
explore:`<circle cx="12" cy="12" r="9.5" fill="url(#gD)"/><path d="m15.8 8.2-2 5.6-5.6 2 2-5.6z" fill="url(#gO)"/><circle cx="12" cy="12" r="1.2" fill="#fff"/>`,
download:`<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" fill="url(#gG)"/><path d="M12 7v7.2M8.6 11l3.4 3.4 3.4-3.4M8 17.2h8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
gear:`<circle cx="12" cy="12" r="9" fill="url(#gV)"/><circle cx="12" cy="12" r="3.3" fill="#fff"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M12 3.4v2M12 18.6v2M3.4 12h2M18.6 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/></g>`,
lock:`<rect x="4.6" y="10.4" width="14.8" height="10.6" rx="3" fill="url(#gV)"/><path d="M8 10.4V8a4 4 0 0 1 8 0v2.4" fill="none" stroke="url(#gB)" stroke-width="2.2"/><circle cx="12" cy="15.6" r="1.6" fill="#fff"/>`,
alert:`<path d="M12 3 22 20.4H2z" fill="url(#gO)" stroke="#ffcf5a" stroke-width=".8" stroke-linejoin="round"/><path d="M12 9.4v5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.2" fill="#fff"/>`,
turtle:`<path d="M5 16.5c0-4 3-7 7.2-7s7.2 3 7.2 7z" fill="url(#gG)"/><path d="M9 16.5 10.2 11M14 16.5 13 11M6.6 14h11.2" stroke="#fff" stroke-opacity=".6" fill="none"/><circle cx="20.4" cy="14.6" r="2" fill="#13b57a"/><path d="M6.4 18.6h2.4M15.6 18.6H18" stroke="#13b57a" stroke-width="2.2" stroke-linecap="round"/>`,
ok:`<circle cx="12" cy="12" r="9.5" fill="url(#gG)"/><path d="m7.6 12.4 3 3 5.8-6.4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
no:`<circle cx="12" cy="12" r="9.5" fill="url(#gR)"/><path d="m8.4 8.4 7.2 7.2M15.6 8.4l-7.2 7.2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
close:`<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,
arrow:`<path d="M5 12h13M13 6.6 18.4 12 13 17.4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
tri:`<path d="M8 5.4v13.2L19 12z" fill="currentColor"/>`,
copyb:`<rect x="8" y="8" width="12" height="12" rx="3" fill="url(#gB)"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="url(#gV)" stroke-width="2"/>`,
phone:`<rect x="6.6" y="2.4" width="10.8" height="19.2" rx="3" fill="url(#gD)"/><rect x="8.4" y="5" width="7.2" height="11.6" rx="1.2" fill="url(#gB)"/><circle cx="12" cy="19" r="1" fill="#fff"/>`,
offline:`<path d="M2.4 9.2a14 14 0 0 1 19.2 0M5.6 12.6a9.4 9.4 0 0 1 12.8 0M9 16a4.8 4.8 0 0 1 6 0" stroke="url(#gB)" stroke-width="2.2" stroke-linecap="round" fill="none"/><circle cx="12" cy="19.4" r="1.5" fill="url(#gO)"/><path d="m4 3.6 16 16" stroke="#e0344f" stroke-width="2.2" stroke-linecap="round"/>`,
flag:`<path d="M5.4 21V3.6" stroke="#8f6bff" stroke-width="2.2" stroke-linecap="round"/><path d="M5.4 4.4c4-1.8 6 1.6 10 0v8c-4 1.8-6-1.6-10 0z" fill="url(#gO)"/>`,
medal:`<path d="M8 2.6h3.2L12 6l.8-3.4H16L14 8.4H10z" fill="url(#gR)"/><circle cx="12" cy="14.4" r="6.4" fill="url(#gO)"/><circle cx="12" cy="14.4" r="4.4" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/><path d="m12 11.6.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="#fff"/>`,
brain:`<circle cx="12" cy="12" r="9.5" fill="url(#gR)"/><path d="M9 8.6c-1.6 0-2.6 1.2-2.4 2.6-.9.6-1 2.2 0 3 .1 1.4 1.4 2.4 2.8 2.1M15 8.6c1.6 0 2.6 1.2 2.4 2.6.9.6 1 2.2 0 3-.1 1.4-1.4 2.4-2.8 2.1M12 7.6v9" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/>`
};

/* aliases: old emoji meanings -> icon names (also used by the emoji sanitiser in ui.js) */
const ALIAS={target:'flag',wave:'spark',muscle:'bolt',stats:'bars',abc:'gram',ear:'headset',cloud:'download',write:'pen',trophy2:'trophy',share:'copyb',snail:'turtle',pc:'phone',save:'download',unlock:'lock',robot:'helper',party:'spark',briefcase:'cert',handshake:'chat',puzzle:'brain',hospital:'cert',picture:'explore',pin:'pin'};
const ix=(n,c)=>{n=ALIAS[n]||n;return`<svg class="ix ix-${n} ${c||''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${IX[n]||IX.spark}</svg>`};

/* ---------- Level shield with laurels ---------- */
function shield(n,cls){return`<svg class="shd ${cls||''}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
<g fill="url(#gO)" opacity=".95"><path d="M24 78c-9-10-12-24-6-38 3 9 8 15 15 19-4 6-5 12-9 19zM18 66c-6-6-8-14-6-22 3 5 6 8 10 10zM34 92c-8-3-14-10-15-18 5 4 10 6 16 6zM96 78c9-10 12-24 6-38-3 9-8 15-15 19 4 6 5 12 9 19zM102 66c6-6 8-14 6-22-3 5-6 8-10 10zM86 92c8-3 14-10 15-18-5 4-10 6-16 6z"/></g>
<path d="M60 14 92 26v30c0 22-14 38-32 46-18-8-32-24-32-46V26z" fill="url(#gV)" stroke="#ffcf5a" stroke-width="3"/>
<path d="M60 22 85 31v25c0 17-11 30-25 37-14-7-25-20-25-37V31z" fill="#2a2a9c" opacity=".55"/>
<path d="M60 14 92 26v14L60 28 28 40V26z" fill="#fff" opacity=".16"/>
<text x="60" y="76" text-anchor="middle" font-size="46" font-weight="800" fill="#fff" font-family="inherit">${n}</text></svg>`}

/* ---------- Trophy (gold cup on a glowing pedestal) ---------- */
function trophy(cls){return`<svg class="trp ${cls||''}" viewBox="0 0 160 190" aria-hidden="true" focusable="false">
<ellipse cx="80" cy="168" rx="70" ry="16" fill="url(#gV)" opacity=".9"/><ellipse cx="80" cy="162" rx="58" ry="11" fill="#6a4cff"/><ellipse cx="80" cy="158" rx="48" ry="8" fill="#9a86ff"/>
<ellipse cx="80" cy="150" rx="46" ry="26" fill="url(#rGlow)" opacity=".8"/>
<path d="M66 128h28l4 22H62z" fill="url(#gO)"/><rect x="52" y="146" width="56" height="12" rx="4" fill="#f09a1f"/>
<path d="M36 36H20c-2 24 8 44 32 48l2-14c-12-3-17-14-18-24zM124 36h16c2 24-8 44-32 48l-2-14c12-3 17-14 18-24z" fill="none" stroke="#f3a21e" stroke-width="9" stroke-linejoin="round"/>
<path d="M36 22h88v38c0 30-20 52-44 52S36 90 36 60z" fill="url(#gO)"/><path d="M44 28h20c-4 30-2 60 8 78-18-4-28-24-28-46z" fill="#fff" opacity=".4"/>
<path d="m80 42 7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff" opacity=".85"/>
<g fill="#ffd45a"><path d="M20 12 22 18 28 20 22 22 20 28 18 22 12 20 18 18z"/><path d="M138 96 140 101 145 103 140 105 138 110 136 105 131 103 136 101z"/><path d="M118 8 119 12 123 13 119 15 118 19 117 15 113 13 117 12z"/></g></svg>`}

/* ---------- Crown + scroll for the "Reach Higher" card ---------- */
function crown(cls){return`<svg class="crn ${cls||''}" viewBox="0 0 90 70" aria-hidden="true" focusable="false"><path d="M8 58 4 20l22 18 19-30 19 30 22-18-4 38z" fill="url(#gO)" stroke="#ffcf5a" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="56" width="74" height="9" rx="3" fill="#f09a1f"/><circle cx="4" cy="19" r="5" fill="#ffe27a"/><circle cx="45" cy="8" r="5.4" fill="#ffe27a"/><circle cx="86" cy="19" r="5" fill="#ffe27a"/><circle cx="26" cy="46" r="3.4" fill="#e0344f"/><circle cx="45" cy="46" r="3.4" fill="#59c2ff"/><circle cx="64" cy="46" r="3.4" fill="#e0344f"/></svg>`}
function scroll(cls){return`<svg class="scr ${cls||''}" viewBox="0 0 140 100" aria-hidden="true" focusable="false"><g transform="rotate(-24 70 50)"><rect x="14" y="26" width="108" height="48" rx="6" fill="#f6ead0"/><rect x="14" y="26" width="108" height="48" rx="6" fill="url(#gStone)" opacity=".35"/><ellipse cx="14" cy="50" rx="10" ry="25" fill="#eadbb6"/><ellipse cx="14" cy="50" rx="5" ry="13" fill="#c9b184"/><ellipse cx="122" cy="50" rx="10" ry="25" fill="#eadbb6"/><path d="M30 40h74M30 50h74M30 60h50" stroke="#c9b184" stroke-width="3" stroke-linecap="round"/><path d="M66 26h14v48H66z" fill="#e0344f"/><path d="M68 74 62 96l9-6 9 6-6-22z" fill="#c42a43"/><circle cx="73" cy="50" r="9" fill="#e0344f" stroke="#ff8aa0" stroke-width="2"/></g></svg>`}

/* ---------- Tower Bridge thumbnail (current lesson card) ---------- */
function bridge(){return`<svg class="brg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs><linearGradient id=bSky x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#3d8bff /><stop offset=.7 stop-color=#a9d0ff /><stop offset=1 stop-color=#ffe6c4 /></linearGradient><linearGradient id=bWater x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#4a86c8 /><stop offset=1 stop-color=#27508f /></linearGradient><linearGradient id=bTower x1=0 y1=0 x2=1 y2=0><stop offset=0 stop-color=#a9966f /><stop offset=.5 stop-color=#d9c79b /><stop offset=1 stop-color=#9a8559 /></linearGradient></defs>
<rect width="400" height="260" fill="url(#bSky)"/>
<g fill="#fff" opacity=".9"><ellipse cx="70" cy="46" rx="46" ry="13"/><ellipse cx="102" cy="40" rx="30" ry="12"/><ellipse cx="318" cy="70" rx="52" ry="14"/><ellipse cx="350" cy="62" rx="30" ry="11"/></g>
<rect y="190" width="400" height="70" fill="url(#bWater)"/>
<g opacity=".35" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M20 210h60M120 224h90M250 212h70M330 232h50M60 240h80"/></g>
<path d="M0 142 52 142C98 142 120 188 150 188L250 188C280 188 302 142 348 142L400 142" fill="none" stroke="#1f3f8f" stroke-width="5"/>
<path d="M52 142C98 142 120 186 150 186M250 186C280 186 302 142 348 142" fill="none" stroke="#2f56c2" stroke-width="3" opacity=".8"/>
<g stroke="#1f3f8f" stroke-width="2" opacity=".8"><path d="M70 146v30M90 156v24M110 168v14M290 168v14M310 156v24M330 146v30"/></g>
<rect x="0" y="176" width="400" height="14" fill="#2a4aa8"/><rect x="0" y="176" width="400" height="4" fill="#5d86e6"/>
${[[128,"L"],[248,"R"]].map(t=>`<g transform="translate(${t[0]} 0)"><rect x="0" y="86" width="24" height="104" fill="url(#bTower)"/><rect x="26" y="86" width="24" height="104" fill="url(#bTower)"/><rect x="-6" y="132" width="62" height="12" fill="#b9a478"/><path d="M-4 86 12 52 28 86zM22 86 38 52 54 86z" fill="#3d58b8"/><path d="M12 52 12 36M38 52 38 36" stroke="#3d58b8" stroke-width="3"/><circle cx="12" cy="34" r="3" fill="#ffcf5a"/><circle cx="38" cy="34" r="3" fill="#ffcf5a"/><path d="M8 100v14M16 100v14M34 100v14M42 100v14" stroke="#6b5a38" stroke-width="3" stroke-linecap="round"/><rect x="-3" y="190" width="56" height="8" fill="#8f7b52"/></g>`).join('')}
<rect x="152" y="132" width="96" height="10" fill="#2a4aa8"/><rect x="152" y="132" width="96" height="3" fill="#5d86e6"/>
<g fill="#9a8559" opacity=".55"><rect x="0" y="150" width="46" height="40"/><rect x="354" y="150" width="46" height="40"/></g>
</svg>`}

/* ---------- Hero scene: Elizabeth Tower, Parliament, London Eye, and our faceless mascot ---------- */
function hero(){return`<svg class="hsc" viewBox="0 0 620 440" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
<defs><linearGradient id=hSky x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#2f6df2 stop-opacity=0 /><stop offset=1 stop-color=#9cc2ff stop-opacity=.55 /></linearGradient>
<linearGradient id=hTw x1=0 y1=0 x2=1 y2=0><stop offset=0 stop-color=#a89466 /><stop offset=.45 stop-color=#e8d6a6 /><stop offset=1 stop-color=#9b865a /></linearGradient>
<linearGradient id=hHood x1=0 y1=0 x2=0 y2=1><stop offset=0 stop-color=#2147c9 /><stop offset=1 stop-color=#10287f /></linearGradient>
<linearGradient id=hHair x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#8a4a24 /><stop offset=1 stop-color=#4a2410 /></linearGradient>
<linearGradient id=hSkin x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#ffd9bd /><stop offset=1 stop-color=#f2b48c /></linearGradient>
<linearGradient id=hBook x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#1d3aa8 /><stop offset=1 stop-color=#0b1c63 /></linearGradient></defs>
<g opacity=".55" fill="#fff"><ellipse cx="120" cy="70" rx="70" ry="16"/><ellipse cx="170" cy="58" rx="40" ry="14"/><ellipse cx="520" cy="130" rx="70" ry="16"/></g>
<!-- London Eye -->
<g transform="translate(560 300)" fill="none" stroke="#e9f1ff" stroke-width="3" opacity=".8"><circle r="92"/><circle r="84" opacity=".5"/><path d="M0-92V92M-92 0H92M-65-65 65 65M65-65-65 65" stroke-width="1.4"/><g fill="#cfe3ff" stroke="none"><circle cx="0" cy="-92" r="4"/><circle cx="92" cy="0" r="4"/><circle cx="0" cy="92" r="4"/><circle cx="-92" cy="0" r="4"/><circle cx="65" cy="-65" r="4"/><circle cx="65" cy="65" r="4"/><circle cx="-65" cy="65" r="4"/><circle cx="-65" cy="-65" r="4"/></g></g>
<!-- Parliament -->
<g><rect x="60" y="318" width="420" height="82" fill="#cdb98a"/><rect x="60" y="318" width="420" height="82" fill="url(#hTw)" opacity=".55"/>
<g fill="#7d6b45" opacity=".7">${Array.from({length:22}).map((_,i)=>`<rect x="${72+i*19}" y="${336}" width="7" height="22" rx="3"/><rect x="${72+i*19}" y="${368}" width="7" height="22" rx="3"/>`).join('')}</g>
<g fill="#b5a173"><path d="M140 318 150 270 160 318zM300 318l10-50 10 50zM220 318l8-34 8 34z"/></g><g fill="#3d58b8"><path d="M146 270 150 240 154 270zM306 268 310 236 314 268zM224 284 228 262 232 284z"/></g></g>
<!-- Elizabeth Tower -->
<g transform="translate(402 0)"><rect x="12" y="150" width="76" height="260" fill="url(#hTw)"/><rect x="18" y="230" width="64" height="12" fill="#b9a478"/><rect x="6" y="150" width="88" height="14" fill="#b9a478"/>
<rect x="4" y="96" width="92" height="56" fill="#d9c79b"/><rect x="4" y="96" width="92" height="56" fill="url(#hTw)" opacity=".5"/>
<circle cx="50" cy="124" r="25" fill="#fff8e6" stroke="#caa84e" stroke-width="5"/><g stroke="#35312b" stroke-width="2.2" stroke-linecap="round"><path d="M50 124V108M50 124l11 6"/></g><g fill="#35312b">${Array.from({length:12}).map((_,i)=>`<circle cx="${50+20*Math.sin(i*Math.PI/6)}" cy="${124-20*Math.cos(i*Math.PI/6)}" r="1.4"/>`).join('')}</g>
<path d="M14 96 50 22 86 96z" fill="#2f4fb4"/><path d="M14 96 50 22V96z" fill="#223d94"/><path d="M50 22V6" stroke="#caa84e" stroke-width="3"/><circle cx="50" cy="5" r="3.6" fill="#ffcf5a"/>
<g fill="#7d6b45" opacity=".7">${[0,1,2,3].map(r=>`<rect x="26" y="${174+r*46}" width="8" height="22" rx="3"/><rect x="46" y="${174+r*46}" width="8" height="22" rx="3"/><rect x="66" y="${174+r*46}" width="8" height="22" rx="3"/>`).join('')}</g></g>
<!-- mascot -->
<g transform="translate(150 40)">
<ellipse cx="150" cy="372" rx="130" ry="14" fill="#0a1b66" opacity=".25"/>
<path d="M44 392c-8-72 8-132 50-160l112 0c46 26 62 88 54 160z" fill="url(#hHood)"/>
<path d="M120 232c0 28 12 44 44 44s44-16 44-44z" fill="#0c2271" opacity=".55"/>
<path d="M46 392c-6-56-2-104 26-140l22 6c-20 40-22 92-14 134z" fill="#0f2a85" opacity=".6"/>
<path d="M258 250c34 26 40 80 26 142h-30c8-48 4-92-18-130z" fill="#0f2a85"/>
<!-- backpack strap -->
<path d="M96 248c-6 38-4 84 4 140" stroke="#243b86" stroke-width="16" stroke-linecap="round" opacity=".9" fill="none"/>
<!-- neck + head -->
<rect x="138" y="206" width="52" height="40" rx="18" fill="url(#hSkin)"/>
<ellipse cx="164" cy="150" rx="68" ry="74" fill="url(#hSkin)"/>
<ellipse cx="97" cy="156" rx="11" ry="17" fill="#f2b48c"/><ellipse cx="231" cy="156" rx="11" ry="17" fill="#f2b48c"/>
<!-- hair -->
<path d="M92 142c-10-60 28-100 76-98 52 0 86 40 72 100-8-26-20-44-46-50-26 14-64 14-84 20-8 8-14 18-18 28z" fill="url(#hHair)"/>
<path d="M110 70c14-30 54-38 82-22 26-14 54 2 58 30-20-14-40-14-60-6-26-14-56-8-80-2z" fill="#6a3517"/>
<path d="M92 112c10-34 40-46 70-40-26 8-46 22-52 52z" fill="#a8602f" opacity=".7"/>
<path d="M206 66c24 6 40 24 42 50-12-16-26-24-42-26z" fill="#4a2410"/>
<!-- hoodie logo patch -->
<g transform="translate(206 300)"><circle r="20" fill="#fff" opacity=".1"/><path d="m-9-10 8 12 4-6 6 10 4-14" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
<!-- book -->
<g transform="rotate(-14 150 330)"><rect x="72" y="262" width="150" height="168" rx="8" fill="url(#hBook)"/><rect x="72" y="262" width="12" height="168" rx="4" fill="#0a1b66"/><rect x="216" y="270" width="8" height="152" rx="3" fill="#f6efe0"/>
<text x="152" y="338" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="inherit">LanguWay</text><text x="152" y="366" text-anchor="middle" font-size="20" font-weight="700" fill="#ffcf5a" font-family="inherit">English</text></g>
<!-- hands -->
<ellipse cx="86" cy="392" rx="30" ry="22" fill="url(#hSkin)"/>
<g transform="translate(268 300)"><rect x="-24" y="-8" width="62" height="52" rx="22" fill="url(#hSkin)"/><rect x="-6" y="-58" width="26" height="62" rx="13" fill="url(#hSkin)" transform="rotate(8)"/><path d="M-22 4h40M-22 18h40M-18 32h34" stroke="#e0a27a" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>
</g>
<rect width="620" height="440" fill="url(#hSky)"/>
</svg>`}

/* ---------- Brand: the real LanguWay mark (white on dark, colour on light) + wordmark ---------- */
const brand=(cls,dark)=>`<span class="brand ${cls||''}"><img class=brand__m src="${dark?'logo-mark-white.png':'logo-mark.png'}" alt="" width=48 height=50><span class=brand__t><b>Languway</b><i>English</i></span></span>`;
const avatar=(l)=>`<svg class="avt" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="24" fill="url(#gV)"/><circle cx="24" cy="20" r="8.5" fill="#ffe1c8"/><path d="M12 42c1-8 6-12 12-12s11 4 12 12z" fill="#fff" opacity=".92"/><path d="M15 18c0-7 5-11 10-10 6 0 9 4 8 10-3-4-6-5-9-5-4 0-7 2-9 5z" fill="#4a2410"/></svg>`;

window.ART={sprite:()=>SPRITE,ix,IX,hero,bridge,trophy,shield,scroll,crown,brand,avatar,ALIAS};
document.addEventListener('DOMContentLoaded',()=>{if(!document.getElementById('sprite'))document.body.insertAdjacentHTML('afterbegin',SPRITE)});
if(document.body&&!document.getElementById('sprite'))document.body.insertAdjacentHTML('afterbegin',SPRITE);
})();
