/* =====================================================================
   화면
   ===================================================================== */
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function seasonOf(){return {title:'',prologue:'',notice:'새해',spring:'봄',summer:'여름',autumn:'가을',seollal:'설',inherit:'장례',chooseRep:'대표',genpage:'족보',ending:'족보'}[S.phase]||''}

/* ---------- 살림 현황판 ---------- */
function snap(){return S?{m:S.money,nw:netWorth(),f:S.face,d:S.gap.d,g:S.gap.f,s:S.gap.s,h:S.house,l:S.land,r:S.repu}:null}
function diffSnap(a,b){if(!a||!b)return null;const r={};if(Math.abs(b.m-a.m)>=.05)r.m=b.m-a.m;if(Math.abs(b.f-a.f)>=.05)r.f=b.f-a.f;
  for(const k of ['d','g','s'])if(b[k]!==a[k])r[k]=b[k]-a[k];if(b.h!==a.h)r.h=b.h;if(b.l!==a.l)r.l=b.l-a.l;if(Math.abs(b.r-a.r)>=.5)r.r=b.r-a.r;return Object.keys(r).length?r:null}
const FACE_GRADES=[[0,'동네 사람'],[20,'성실한 집'],[40,'알아주는 집'],[60,'번듯한 집'],[80,'명문']];
function faceGrade(f){let g=FACE_GRADES[0];for(const x of FACE_GRADES)if(f>=x[0])g=x;const nx=FACE_GRADES.find(x=>x[0]>f);return {name:g[1],next:nx?nx[1]:null,gap:nx?Math.ceil(nx[0]-f):0}}
function dlt(v,fmt){if(!v)return '';return `<span class="delta ${v>0?'up':'down'}">${fmt?fmt(v):(v>0?'+':'−')+Math.abs(Math.round(v*10)/10)}</span>`}
function dial(v,a,b,dv,tip){const pos=(5-v)*10;return `<div class="dial" title="${esc(tip)}"><span class="${v>0?'on':''}">${a}</span><span class="track"><i style="left:${pos}%"></i></span><span class="${v<0?'on':''}">${b}</span>${dv?`<b class="dmini">${dv>0?'◀':'▶'}</b>`:'<b></b>'}</div>`}
function hud(){
  const d=UI.d||{};const fg=faceGrade(S.face);const pi=Math.round(inflation(S.year)*1000)/10;const sav=S.flags.savings?Math.round(savRate(S.year)*1000)/10:0;
  const nw=netWorth();
  return `<div class="hud" aria-label="살림 현황">
   <div class="hud-box"><span class="lbl">재산 · 그해 물가 기준</span><span class="v ${S.money<0?'neg':''}">${nw<0?'빚 ':''}${wonY(nw)}</span>
     <span class="small muted">지금 돈 ${wonNow(nw)}</span>
     <span class="cashline">현금 <b class="num" style="color:${S.money<0?'var(--warn)':'inherit'}">${S.money<0?'빚 ':''}${wonY(S.money)}</b> <span class="small muted">${S.flags.savings?'통장 이자 '+sav+'%':'장롱 보관'}</span></span>
     <span class="small muted">물가지수 ${priceIdx(S.year)} (1978=100) · 올해 물가 +${pi}%</span>${dlt(d.m,v=>sgW(v))}</div>
   ${monthBox()}
   <div class="hud-box"><span class="lbl">체면 · <b class="grade">${fg.name}</b></span><div class="facebar big"><i style="width:${clamp(S.face,0,100)}%"></i></div>
     <span class="small muted">${Math.floor(S.face)}/100${fg.next?` · '${fg.next}'까지 ${fg.gap}`:''}</span><span class="small muted">가만두면 조금씩 내려간다</span>${dlt(d.f)}</div>
   <div class="hud-box"><span class="lbl">가풍 <span class="muted">— 아이들 성격과 재능에 스민다</span></span>
     ${dial(S.gap.d,'근면','여유',d.d,'근면: 아이들 성실·끈기·몸 한계↑ / 여유: 느긋한 아이')}
     ${dial(S.gap.f,'체면','실속',d.g,'체면: 야심·사교 / 실속: 낙천')}
     ${dial(S.gap.s,'엄격','다정',d.s,'엄격: 순종·글 한계↑ / 다정: 온화·마음씨 한계↑')}</div>
   <div class="hud-box"><span class="lbl">집 · ${esc(placeName())}</span><span class="v house">${houseName()}</span>
     <span class="small muted">집값 ${wonY(houseVal())}</span>
     <span class="small">${S.land?'땅 '+S.land+'필지 ('+wonY(landTotal())+')'+((S.lands||[]).some(p=>p.bld)?' · 건물':''):'땅 없음'}${S.year>=2000&&S.tradeSt>=2?' · 가게 평판 '+Math.round(S.repu):''}</span>
     ${d.h?`<span class="delta up">${{own:'내 집!',apt:'아파트!',shack:'집을 잃음'}[d.h]}</span>`:d.l?dlt(d.l,v=>(v>0?'+':'−')+Math.abs(v)+'필지'):''}</div>
  </div>
  ${S.goal?`<div class="goalbar"><span class="lbl">집안 목표</span> <b>${esc(GOALS[S.goal].t)}</b> <span class="small muted">— ${esc(GOALS[S.goal].d)}</span></div>`:''}`;
}
function monthBox(){const L=S.lastY;const it=incomeTier();const wt=wealthTier();
  return `<div class="hud-box month"><span class="lbl">한 달 살림 · ${L?L.y+'년 기준':'첫해'}</span>
   ${L?`<span class="v">${wonY(L.inc/12)}</span><span class="small muted">지금 돈 ${wonNow(L.inc/12)} · 그해 보통 집의 ${Math.round(L.inc/RI(L.y)*100)}%</span>
   <span class="small">쓰는 돈 ${wonY(L.out/12)} · 남는 돈 <b style="color:${L.inc>=L.out?'var(--ok)':'var(--warn)'}">${sgW((L.inc-L.out)/12)}</b></span>`:'<span class="small muted">한 해를 보내면 나온다</span>'}
   <span class="small">벌이 ${it==null?'—':'<b>'+WEALTH[it]+'</b>'} · 모아 둔 돈 <b>${WEALTH[wt]}</b></span></div>`}
function wonS(u,y){y=y??S.year;const hw=y<1962;let n=Math.abs(nominal(u,y))*(hw?10:1);const neg=u<0?'−':'';
  if(n>=1e12)return neg+(n/1e12).toFixed(n>=1e13?0:1)+'조';if(n>=1e8)return neg+(n/1e8).toFixed(n>=1e9?0:1).replace(/\.0$/,'')+'억';if(n>=1e4)return neg+Math.round(n/1e4).toLocaleString()+'만';return neg+Math.round(n).toLocaleString()+(hw?'환':'원')}
function assetsView(){const y=S.year,nw=netWorth(),hv=houseVal(),lt=landTotal(),debt=S.landDebt||0;
  const pc=(x,b)=>b>0?Math.round(x/b*100):0;
  const row=(lbl,val,sub,cls)=>`<div class="as-row ${cls||''}"><div><b>${lbl}</b>${sub?`<div class="small muted">${sub}</div>`:''}</div><div class="num r">${val}</div></div>`;
  const parts=[['현금',Math.max(0,S.money),'var(--ok)'],['집',hv,'var(--accent, #6b8f71)'],['땅·건물',lt,'#b08a4f']].filter(x=>x[1]>0);const tot=parts.reduce((a,x)=>a+x[1],0)||1;
  const b=bizOf();
  const lands=(S.lands||[]).map((p,i)=>{const K=LAND_KINDS[p.kind];const now=parcelVal(p);const gain=p.paid?now/p.paid-1:null;const rent=p.bld?bldVal()*.055:p.lease?now*K.lease:0;
    return `<div class="land-card"><div class="lc-top"><b>${esc(p.nm||K.name)}</b><span class="chip">${K.name}</span>${p.bld?'<span class="chip">상가 건물</span>':''}${p.lease&&!p.bld?'<span class="chip">세놓음</span>':''}</div>
     <div class="small">${p.py?p.py.toLocaleString()+'평 · ':''}${esc(p.at||'')} · ${p.since}년에 ${p.paid?wonY(p.paid,p.since)+'에 삼':'물려받음'}</div>
     <div class="lc-val"><span>지금 값 <b>${wonY(now+(p.bld?bldVal():0))}</b></span>${gain!=null?`<span style="color:${gain>=0?'var(--ok)':'var(--warn)'}">${gain>=0?'▲':'▼'} 실제 가치 ${Math.abs(Math.round(gain*100))}%</span>`:''}</div>
     <div class="small muted">${rent?'해마다 세 '+wonY(rent)+' · ':''}${K.desc}</div></div>`}).join('');
  const bought=Object.entries(S.bought||{}).map(([k,yy])=>{const it=BUY_ITEMS.find(x=>x.id===k);return it?`<span class="chip">${esc(it.n(yy))} <span class="muted">${yy}</span></span>`:''}).join(' ');
  return `<div class="assets">
   <div class="as-total"><div class="lbl">총재산 (${y}년 돈)</div><div class="as-big num ${nw<0?'neg':''}">${nw<0?'빚 ':''}${wonY(nw)}</div><div class="small muted">지금 돈 ${wonNow(nw)}</div>
    <div class="as-bar">${parts.map(([l,x,c])=>`<span style="width:${x/tot*100}%;background:${c}" title="${l}"></span>`).join('')}</div>
    <div class="as-leg small">${parts.map(([l,x,c])=>`<span><i style="background:${c}"></i>${l} ${pc(x,tot)}%</span>`).join('')}</div></div>
   <div class="lbl">돈</div>
   ${row(S.money>=0?'현금':'빚',(S.money<0?'−':'')+wonY(S.money),S.money<0?'이자가 붙는다 (해마다 '+Math.round((savRate(y)+.04)*100)+'%)':S.flags.savings?'통장에 넣어 둠 · 이자 '+(savRate(y)*100).toFixed(1)+'%':'장롱에 보관 · 물가가 오르면 가치가 깎인다',S.money<0?'neg':'')}
   ${debt?row('땅 빚','−'+wonY(debt),'땅을 사며 진 빚','neg'):''}
   ${S.lastY?row('한 달 벌이',wonY(S.lastY.inc/12),'쓰는 돈 '+wonY(S.lastY.out/12)+' · 남는 돈 '+sgW((S.lastY.inc-S.lastY.out)/12)):''}
   <div class="lbl">집</div>
   ${row(houseName(),wonY(hv),placeName()+(S.house==='shack'?' · 남의 땅에 지은 집이라 값이 거의 없다':S.house==='apt'?' · 아파트 값은 시세를 탄다':' · 우리 집'))}
   <div class="lbl">장사·일터</div>
   ${S.tradeY>0||S.tradeSt>1?row((S.tradeSt>=3?b.big:b.n(y)),['처음','점포','큰 가게'][S.tradeSt-1],'장사 '+Math.floor(S.tradeY)+'년 · '+b.d+(bizFade()<1?' · <b style="color:var(--warn)">손님이 줄고 있다 (벌이 '+Math.round(bizFade()*100)+'%)</b>':'')+(S.tradeSt>=2&&y>=2000?' · 평판 '+Math.round(S.repu||0):'')):'<div class="small muted">아직 장사를 하지 않는다.</div>'}
   ${S.craftY>0?row(['기술','숙련 기술','우리 공장'][S.craftSt-1],'기술 '+Math.floor(S.craftY)+'년',''):''}
   <div class="lbl">땅 ${S.lands&&S.lands.length?S.lands.length+'필지 · '+wonY(lt):''}</div>
   ${lands||'<div class="small muted">가진 땅이 없다. 설 가족회의에 땅이 나오면 살 수 있다.</div>'}
   ${bought?`<div class="lbl">장만한 살림</div><div class="as-bought">${bought}</div>`:''}
  </div>`}
function mhud(){const nw=netWorth(),fg=faceGrade(S.face),d=UI.d||{};
  const yr=S.phase==='prologue'?String(PRO[Math.min(S.pro,PRO.length-1)].y).replace(/년.*$/,''):S.year;
  return `<button class="mhud" data-act="hudToggle" aria-expanded="${!!UI.hudOpen}" aria-label="살림 현황 ${UI.hudOpen?'접기':'펼치기'}">
   <span class="m-yr"><b class="num">${esc(String(yr))}</b><i>${seasonOf()||''}</i></span>
   <span class="m-it"><small>현금</small><b class="num ${S.money<0?'neg':''}">${wonS(S.money)}</b>${d.m?`<em class="${d.m>0?'up':'dn'}">${d.m>0?'▲':'▼'}</em>`:''}</span>
   <span class="m-it"><small>총재산</small><b class="num ${nw<0?'neg':''}">${wonS(nw)}</b></span>
   <span class="m-it"><small>한 달</small><b class="num">${S.lastY?wonS(S.lastY.inc/12):'—'}</b></span>
   <span class="m-it"><small>체면 ${Math.floor(S.face)}</small><b>${fg.name}</b>${d.f?`<em class="${d.f>0?'up':'dn'}">${d.f>0?'▲':'▼'}</em>`:''}</span>
   <span class="m-it"><small>집</small><b>${houseName()}</b></span>
   <span class="m-ar">${UI.hudOpen?'▴':'▾'}</span></button>`}
function hdr(){
  const yr=S.phase==='prologue'?PRO[Math.min(S.pro,PRO.length-1)].y:(S.phase==='autumn'&&S.report?(S.report.y0===S.report.yEnd?S.report.y0+'년':S.report.y0+'~'+S.report.yEnd):S.year+'년');
  const r=rep();
  return `<header class="top">
   <div class="brand"><h1>족보 없는 집</h1><div class="sub">${esc(S.sur)}씨네 · ${S.curGen}세대${r?' · 대표 '+esc(r.name):''}</div></div>
   ${S.phase==='title'?'':`<div class="date"><span class="yr num">${esc(yr)}</span><span class="season">${seasonOf()}</span><span class="lbl">턴 ${S.turn}</span></div>`}
   <span style="margin-left:auto;display:flex;gap:6px">${S.phase!=="title"?'<button class="btn small-btn" data-act="treeBig">가계도</button>':''}${typeof cloudOn==='function'&&cloudOn()?`<button class="btn small-btn" data-act="cloudOpen">${CLOUD.user?'저장':'로그인'}</button>`:''}<button class="btn small-btn" data-act="help">도움말</button></span>
  </header>${['title','ending'].includes(S.phase)?'':mhud()+`<div class="hud-wrap ${UI.hudOpen?'open':''}">${hud()}</div>`}`;
}

/* ---------- 인물 카드 ---------- */
function statRow(p,k){const rv=revealTal(p,k);const cap=revealCap(p,k);const a=age(p);
  const known=rv.lo===rv.hi;
  const gr=Math.round((p.grow[k]||0)*10);
  return `<span class="sk" title="${esc(TAL_DESC[k])}">${k}</span><span class="num sv">${rv.txt}${cap&&!(p.inlaw||a>=16)?`<small>${cap}</small>`:''}${gr>0&&known?`<em>+${gr}</em>`:''}</span><span class="bar">${known?`<i style="width:${rv.lo}%"></i>`:`<i class="range" style="left:${rv.lo}%;width:${rv.hi-rv.lo}%"></i>`}${(p.inlaw||a>=16)?`<b style="left:${pt(p.cap[k])}%" title="한계 ${pt(p.cap[k])}"></b>`:''}</span>`}
function persRow(p,k){const rv=revealPers(p,k);const known=rv.lo===rv.hi;
  return `<span class="sk" title="${esc(PERS_DESC[k])}">${k}</span><span class="num sv">${rv.txt}</span><span class="bar pers">${known?`<i style="width:${rv.lo}%"></i>`:`<i class="range" style="left:${rv.lo}%;width:${rv.hi-rv.lo}%"></i>`}</span>`}
function moodChip(p){if(p.id===S.repId)return '';if(p.grudge>=5)return '<span class="chip warn">표정이 어둡다</span>';if(p.grudge>=3)return '<span class="chip warn">말수가 줄었다</span>';if(p.aff>=6)return '<span class="chip ok">살갑다</span>';return ''}
function statusChip(p){if(!p.alive)return `<span class="chip dim">故 ${p.death}</span>`;if(p.f.retired&&p.status==='home')return '<span class="chip dim">은퇴</span>';if(p.status==='away')return `<span class="chip dim">${esc(p.away?p.away.why:'떠남')}${p.away&&p.away.until?' ~'+p.away.until:''}</span>`;return ''}
function desireLine(p){return desireLine0(p)+(p.inlaw&&p.f.bg?`<br><span class="small">${p.sex==='f'?'친정':'본가'} <b>${esc(p.f.bg)}</b>${p.f.job&&p.f.job!=='집안일'?' · '+(p.f.jobQuit?'하던 일':'일')+' <b>'+esc(p.f.job)+'</b>':''}</span>`:'')+(p.f.dream&&!p.f.artsDone||p.f.artsPro||p.f.artsHobby?` · 꿈 <b>${ARTS[p.f.dream]?ARTS[p.f.dream].dream:''}</b>${p.f.artsPro?' (그 길로 감)':p.f.artsHobby?' (취미)':''}`:'')}
function desireLine0(p){const a=age(p);if(p.inlaw||p.f.desireKnown)return `바라는 것 <b>${p.desire}</b>`;if(a>=10)return `<span class="muted">${DESIRE_HINT[p.desire]}</span>`;return '<span class="muted">바라는 것 ?</span>'}
function personCard(p,full){
  const a=age(p);const gone=!p.alive||p.status!=='home';
  const top=TALENTS.slice().sort((x,y)=>p.tal[y]-p.tal[x]).slice(0,3);
  if(!full)return `<button class="pcard ${gone?'gone':''}" data-act="openP" data-a="${p.id}" aria-label="${esc(p.name)} 카드 열기">
     ${portraitView(p)}<span class="pc-body"><span class="prow"><span class="pname">${esc(p.name)}</span><span class="chip ${p.id===S.repId?'rep':''}">${relLabel(p)}</span>${statusChip(p)}${moodChip(p)}</span>
     <span class="small muted">${p.alive?a+'세 · ':''}${p.sex==='m'?'남':'여'}${p.alive&&p.status==='home'&&a>=7?' · '+esc(slotLabel(p,p.slot)):''}</span>
     ${p.alive&&a>=4?`<span class="topstats">${top.map(k=>{const rv=revealTal(p,k);return `<span>${k} <b class="num">${rv.txt}</b></span>`}).join('')}</span>`:''}</span></button>`;
  return `<div class="pcard-full">
   <div class="pcf-head">${portraitView(p)}<div><div class="pname big">${esc(p.name)} <span class="small muted">${p.inlaw?esc(p.sur)+'씨':esc(S.sur)+'씨'}</span></div>
    <div class="prow"><span class="chip ${p.id===S.repId?'rep':''}">${relLabel(p)}</span><span class="chip">${p.gen}세대</span>${statusChip(p)}${moodChip(p)}</div>
    <div class="small">${p.alive?a+'세':p.birth+'~'+p.death}${p.sex==='m'?' · 남':' · 여'}${p.edu?' · '+['','국졸','고졸','대졸'][p.edu]:''}${p.f.official?' · 공직':''}</div>
    <div class="small">${desireLine(p)}</div>
    <div class="prow">${p.traits.map(t=>`<span class="chip">${t}</span>`).join('')}</div></div></div>
   <div class="pcf-cols"><div><div class="lbl">능력치 <span class="muted">(0~100 · ${p.inlaw||a>=16?'정확한 값 · 막대 위 금색 표시는 타고난 한계':a<4?'아직 알 수 없음':a<10?'어림짐작 ±20':'거의 보임 ±10'})</span></div><div class="tal">${TALENTS.map(k=>statRow(p,k)).join('')}</div></div>
    <div><div class="lbl">성격 <span class="muted">(0~100 · ${p.inlaw||a>=13?'정확한 값':a<6?'아직 알 수 없음':'어림짐작 ±20'})</span></div><div class="tal">${PERS.map(k=>persRow(p,k)).join('')}</div>
     <div class="lbl" style="margin-top:10px">마음</div><div class="small">애정 <b class="num">${p.aff}</b>${p.id===S.repId?'':(p.grudge>=3?' · 쌓인 게 있어 보인다':'')}</div>
     ${p.recs.length?`<div class="lbl" style="margin-top:10px">지나온 일</div><ul class="notes small">${p.recs.slice(-5).map(r=>`<li>${r.y} ${esc(r.t)}</li>`).join('')}</ul>`:''}</div></div>
   <div class="small muted">능력치 뜻: ${TALENTS.map(k=>k+'='+TAL_DESC[k]).join(' · ')}</div>
  </div>`;
}
function familyView(){
  const all=S.people.filter(p=>UI.famAll?true:(p.alive&&p.status==='home'));
  const gens=[...new Set(all.map(p=>p.gen))].sort((a,b)=>a-b);
  const nAway=S.people.filter(p=>p.alive&&p.status!=='home').length,nDead=S.people.filter(p=>!p.alive).length;
  return `<div class="famtools"><span class="small muted">카드를 누르면 능력치와 성격이 자세히 나온다.</span>
     <button class="btn small-btn" data-act="famAll">${UI.famAll?'집에 사는 식구만':'모두 보기 (떠난 식구 '+nAway+' · 故 '+nDead+')'}</button></div>
   ${gens.map(g=>{const L=all.filter(p=>p.gen===g).sort((a,b)=>(b.alive-a.alive)||(a.inlaw-b.inlaw)||(a.birth-b.birth));
     return `<div class="famgen"><div class="lbl">${g}세대 <span class="muted">${L.length}명</span></div><div class="people grid2">${L.map(p=>personCard(p,false)).join('')}</div></div>`}).join('')}`;
}
/* ---------- 지도 ---------- */
const MAPS=[
 ["..T..W.Y","========",".G.O.P.M","D.C...MM","========","S..J.F.."],
 ["..T..W.S","========","YG.O.P.M","D.C.MMMM","========","F.F.J..."],
 ["A.T..B.S","========","YG.O.P.X","H.C.MMXX","========","F.DJA.A."],
 ["AAT.KB.S","========","YG.O.P.X","H.C.MMXX","========","AADJA.A."],
 ["AAT.KB.L","========","YG.O.PRX","H.C.EMXX","========","AADJA.AA"],
 ["AAT.KV.L","========","YG.O.PRX","N.C.EMXX","========","AADJA.NA"]];
const MAP_APT=["AAAAAAAA","========","AT.O.PGA","AY.D.J.A","========","SXXB.HAA"];
const MAP_RURAL=["..T..W..","========","YG.O.P..","D.C.....","========","..J....."];
const TILE={'.':['',''],'=':['road',''],'M':['place','장'],'S':['place','학교'],'F':['place','공장'],'W':['place','우물'],'C':['place','교회'],'A':['place','아파트'],'B':['place','은행'],
  'H':['place','학원'],'X':['place','상가'],'K':['place','편의점'],'L':['place','복지관'],'R':['place','로봇'],'E':['place','노포'],'V':['place','기록관'],'N':['place','쉼터']};
function mapView(){
  const y=S.year;const st=y<1960?0:y<1980?1:y<1995?2:y<2015?3:y<2040?4:5;
  const M=S.place.kind==='apt'?MAP_APT:S.place.kind==='rural'?MAP_RURAL:MAPS[st];let h='';
  for(const row of M)for(const ch of row){
    if(ch==='O'){h+=`<div class="tile ours ${S.house!=='shack'?'own':''}" title="우리 집"><canvas width="32" height="32" data-tile="O"></canvas><span class="tile-label">${esc(S.sur)}씨네</span></div>`;continue}
    const n=S.nbs.find(x=>x.ch===ch);
    if(n){h+=`<div class="tile nb" title="${esc(nbName(n)+' · '+nbTitle(n)+' · 정 '+n.j)}"><canvas width="32" height="32" data-tile="${ch}"></canvas><span class="tile-label">${esc(n.sur)}씨네</span></div>`;continue}
    const [cls,l]=TILE[ch]||['',''];h+=`<div class="tile ${cls}"><canvas width="32" height="32" data-tile="${ch}"></canvas>${l?`<span class="tile-label">${l}</span>`:''}</div>`;
  }
  return `<div class="map-caption">${esc(placeName())} · ${y}년</div><div class="map" role="img" aria-label="동네 지도">${h}</div>
  <div class="legend">${S.nbs.map(n=>`<span><b>${esc(n.sur)}</b> ${esc(nbName(n))} · ${esc(nbTitle(n))} · 정 ${n.j}</span>`).join('')}</div>
  ${S.moves.length?`<div class="small muted" style="margin-top:8px">이사 기록: ${S.moves.map(m=>m.y+' '+esc(m.to)).join(' → ')}</div>`:''}`;
}
function ledgerView(){
  const jp=Math.round(jeongPow(S.year)*100);
  return `<div class="ledger"><div class="small muted">지금 시대에 정이 쌓이는 정도: <b>${jp}%</b> ${S.year>=2030?'· 돌봄 시간 빚 '+S.timeDebt:''}</div>
   <details class="jobinfo"><summary class="lbl">정이 돌려주는 것</summary><div class="tbl"><table><thead><tr><th>정</th><th>사이</th><th>덕</th></tr></thead><tbody>${NB_LEVELS.slice().reverse().map(([j,n,p])=>`<tr><td class="num">${j}↑</td><td>${n}</td><td>${p}</td></tr>`).join('')}</tbody></table></div><div class="small muted">그 밖에: 조문객이 많으면 체면이 오르고, 정의 길 별이 쌓인다. 보릿고개에 나눈 쌀 같은 큰 은혜는 몇십 년 뒤 그 집 자손이 갚으러 온다.</div></details>${S.nbs.map(n=>{const w=Math.abs(n.j)*2.5;
    const lv=nbLevel(n.j);
    return `<div class="nbrow"><div><div class="pname" style="font-size:17px">${esc(nbName(n))} <span class="chip ${n.j>=11?'ok':n.j<=-10?'warn':''}">${lv.name}</span></div><div class="small muted">${esc(nbTitle(n))} · 어른 ${esc(n.head)}</div>${lv.perk!=='—'?`<div class="small">${esc(lv.perk)}</div>`:''}</div>
     <div><div class="jbar"><i class="${n.j<0?'neg':''}" style="${n.j>=0?`left:50%;width:${w}%`:`right:50%;width:${w}%`}"></i></div><div class="small num" style="text-align:right">정 ${n.j>0?'+':''}${n.j}</div></div></div>`}).join('')}
   ${S.oldNbs?`<div class="small muted">옛 동네 이웃: ${S.oldNbs.map(n=>esc(nbName(n))+' 정 '+n.j).join(', ')}</div>`:''}
   <div><div class="lbl" style="margin:4px 0">장부 기록</div><div class="entries">${S.ledger.length?S.ledger.slice(0,50).map(e=>`<div class="entry"><span class="num muted">${e.y}</span><span>${esc(e.nb)} — ${esc(e.t)}</span><span class="num" style="text-align:right">${e.d?(e.d>0?'+':'')+e.d:''}</span></div>`).join(''):'<div class="small muted" style="padding:8px 0">아직 주고받은 것이 없다.</div>'}</div></div></div>`;
}
/* 가계도: 세대마다 한 줄, 부부는 한 칸, 부모 칸 아래 자녀들을 선으로 잇는다 */
function treeLayout(){
  const blood=S.people.filter(p=>!p.inlaw);
  const kidsOf=p=>blood.filter(c=>c.parents.includes(p.id)||(p.spouse&&c.parents.includes(p.spouse))).sort((a,b)=>a.birth-b.birth);
  const roots=blood.filter(p=>!p.parents.length||!p.parents.some(id=>blood.some(q=>q.id===id))).sort((a,b)=>a.gen-b.gen||a.birth-b.birth);
  const seen=new Set();const W=150,GAP=14,H=74,VG=46;let nodes=[],edges=[];
  function lay(p,depth,x0){
    seen.add(p.id);const sp=p.spouse?P(p.spouse):null;if(sp)seen.add(sp.id);
    const kids=kidsOf(p).filter(c=>!seen.has(c.id));const w0=sp?W*2+6:W;
    let x=x0,cx=[];
    for(const c of kids){const r=lay(c,depth+1,x);cx.push(r.mid);x=r.right+GAP}
    const span=kids.length?Math.max(x-GAP-x0,w0):w0;
    const left=x0+(span-w0)/2;const y=depth*(H+VG);
    nodes.push({p,x:left,y,w:W});if(sp)nodes.push({p:sp,x:left+W+6,y,w:W,spouse:true});
    const mid=left+w0/2;for(const m of cx)edges.push({x1:mid,y1:y+H,x2:m,y2:y+H+VG});
    return {mid,right:x0+span};
  }
  let x=0;for(const r of roots){if(seen.has(r.id))continue;const res=lay(r,r.gen-1,x);x=res.right+GAP*3}
  const width=Math.max(320,x),height=Math.max(...nodes.map(n=>n.y))+H+10;
  return {nodes,edges,width,height,H};
}
function treeSVG(){
  const L=treeLayout();const H=L.H;
  const box=n=>{const p=n.p;const dead=!p.alive,away=p.alive&&p.status!=='home';const rep=p.id===S.repId;
    const st=dead?'故 '+p.birth+'–'+p.death:p.birth+'년생 · '+age(p)+'세';
    const tag=rep?'대표':away?(p.away?p.away.why:'떠남'):p.inlaw?(p.sur+'씨'):'';
    return `<g class="tn ${dead?'dead':''} ${away?'away':''} ${rep?'rep':''}" data-act="openP" data-a="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}">
     <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${H}" rx="2"/>
     <text x="${n.x+10}" y="${n.y+24}" class="tn-name">${esc(p.name)}${p.sex==='m'?' ♂':' ♀'}</text>
     <text x="${n.x+10}" y="${n.y+43}" class="tn-sub">${esc(st)}</text>
     ${tag?`<text x="${n.x+10}" y="${n.y+61}" class="tn-tag">${esc(tag)}</text>`:''}</g>`};
  const gens=[...new Set(L.nodes.map(n=>n.y))].sort((a,b)=>a-b);
  return `<svg class="treesvg" viewBox="-60 -10 ${L.width+70} ${L.height+20}" width="${L.width+70}" height="${L.height+20}" role="img" aria-label="가계도">
    ${gens.map((y,i)=>`<text x="-54" y="${y+H/2+5}" class="tn-gen">${i+1}세대</text>`).join('')}
    ${L.edges.map(e=>{const my=e.y1+(e.y2-e.y1)/2;return `<path class="te" d="M${e.x1} ${e.y1} V${my} H${e.x2} V${e.y2}"/>`}).join('')}
    ${L.nodes.filter(n=>n.p.spouse&&!n.spouse).map(n=>{const s=L.nodes.find(m=>m.p.id===n.p.spouse);return s?`<line class="tm" x1="${n.x+n.w}" y1="${n.y+H/2}" x2="${s.x}" y2="${s.y+H/2}"/>`:''}).join('')}
    ${L.nodes.map(box).join('')}</svg>`;
}
function treeView(){
  return `<div class="small muted" style="margin-bottom:8px">세대마다 한 줄, 부부는 나란히. 이름을 누르면 인물 카드가 열린다.</div>
   <button class="btn" data-act="treeBig" style="margin-bottom:10px">가계도 크게 보기</button>
   <div class="treewrap">${treeSVG()}</div>
   <div class="tree-legend small"><span class="lg rep"></span>대표 <span class="lg"></span>집에 사는 식구 <span class="lg away"></span>떠나 사는 식구 <span class="lg dead"></span>세상을 떠난 식구</div>
   ${S.pages.length?`<div class="lbl" style="margin-top:12px">완성된 족보</div>${S.pages.map(pg=>`<details class="pagebox"><summary>${pg.gen}세대 (${pg.year}년 정리)</summary>${pg.lines.map(l=>`<div class="small"><b>${esc(l.name)}</b> ${l.birth}–${l.death||''} — ${esc(l.line)}</div>`).join('')}</details>`).join('')}`:''}`;
}
function treeModal(){return `<div class="modal" role="dialog" aria-label="가계도"><div class="modal-box wide"><button class="btn close" data-act="treeBig">닫기</button><h2>${esc(S.sur)}씨네 가계도</h2>
  <div class="tree-legend small"><span class="lg rep"></span>대표 <span class="lg"></span>집에 사는 식구 <span class="lg away"></span>떠나 사는 식구 <span class="lg dead"></span>세상을 떠난 식구</div>
  <div class="treewrap big">${treeSVG()}</div></div></div>`}
function stars(n){return '★'.repeat(n)+'☆'.repeat(5-n)}
function jokboPanel(){const j=S.jb;if(!j)return '';return `<div class="jbpanel"><div class="lbl">우리 집 족보</div><div class="jb-title">${esc(jbBonText())}</div>
   <div class="small">${esc(jbKindText())} · ${j.pages}쪽${j.women?' · 딸·며느리 이름도 올림':''}${j.adopted?' · 입양·다문화 식구도 올림':''}</div>
   <div class="small muted">고향 기억 조각 ${S.frag}/5 · 기억하는 고향: ${esc(j.hometown)}${j.preface?' · 서문: "'+esc(j.preface)+'"':''}</div></div>`}
function routeView(){const rs=routeScores();
  return jokboPanel()+`<div class="small muted" style="margin-bottom:10px">돈이 전부가 아니다. 집안을 일으키는 길은 여섯 갈래이고, 엔딩에서 별 셋 이상인 길이 집안의 칭호가 된다. 설 가족 회의의 안건(공부, 잔치, 공방, 집안 기록, 자식의 길)으로 각 길을 키울 수 있다.</div>
   <div class="routes">${Object.entries(ROUTES).map(([k,o])=>`<div class="route"><div class="rt-head"><b>${o.name}</b><span class="stars">${stars(rs[k])}</span></div><div class="small muted">${o.desc}</div><div class="small">지금: <b>${rs[k]?esc(o.titles[rs[k]]):'아직 없음'}</b>${rs[k]<5?' · 다음: '+esc(o.titles[rs[k]+1]):''}</div></div>`).join('')}</div>`}
function logView(){return `<div class="log entries">${S.log.slice(0,80).map(e=>`<div class="entry"><span class="num muted">${e.y}</span><span>${esc(e.t)}</span></div>`).join('')||'<div class="small muted">기록이 없다.</div>'}</div>`}
function asideView(){
  const tabs=[['family','가족'],['assets','재산'],['route','가문의 길'],['map','동네'],['ledger','정 장부'],['tree','가계도'],['log','연대기']];
  const body={assets:assetsView,family:familyView,route:routeView,map:mapView,ledger:ledgerView,tree:treeView,log:logView}[UI.tab]();
  return `<aside class="aside"><div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${UI.tab===k}" data-act="tab" data-a="${k}">${l}</button>`).join('')}</div>${body}</aside>`;
}

/* ---------- 무대 ---------- */
function titleView(){
  const h=S.people[0],w=S.people[1];const m=META;
  const opt=(group,obj,cur)=>Object.entries(obj).map(([k,o])=>{const lock=(o.unlock||0)>m.clears;
    return `<button class="optc ${cur===k?'on':''}" ${lock?'disabled':''} data-act="setOpt" data-a="${group}" data-b="${k}"><b>${esc(o.name||o.full)}</b><small>${lock?'완주 '+o.unlock+'번 뒤 열림':esc(o.desc)}</small></button>`}).join('');
  return `<div class="title-screen">${sceneView(true)}
   <div class="big">족보 없는 집</div>
   <p class="lead">1950년 전쟁에서 3대가 모두 세상을 떠날 때까지. 이름 없는 한 집안이 한국 현대사를 지나며 족보를 써 내려간다. 2021년 이후는 이 게임이 그리는 가상의 미래다.</p>
   <div class="panel">
    <div class="lbl">이번 회차의 집안</div><div class="title-couple">${portraitView(h)}${portraitView(w)}</div>
    <div style="font-family:var(--f-disp);font-size:24px;margin:6px 0">${esc(S.sur)}씨네 — ${esc(h.name)} · ${esc(w.name)} 부부</div>
    <div class="lbl" style="margin-top:12px">출발 동네</div><div class="opts3">${opt('town',TOWNS,S.town)}</div>
    <div class="lbl" style="margin-top:12px">가문 내력</div><div class="opts3">${opt('lineage',LINEAGES,S.lineage)}</div>
    ${m.huns.length?`<div class="lbl" style="margin-top:12px">물려받은 가훈 (앞선 회차에서 남긴 것)</div><div class="opts3"><button class="optc ${!S.hun?'on':''}" data-act="setOpt" data-a="hun" data-b=""><b>없음</b><small>가훈 없이 시작</small></button>${m.huns.map(k=>`<button class="optc ${S.hun===k?'on':''}" data-act="setOpt" data-a="hun" data-b="${k}"><b>${esc(HUNS[k].name)}</b><small>${esc(HUNS[k].desc)}</small></button>`).join('')}</div>`:''}
    <div class="actions"><button class="btn go" data-act="start">시작한다</button><button class="btn" data-act="reroll">다른 집안으로</button>${hasSave?'<button class="btn" data-act="resume">이어하기</button>':''}${typeof cloudOn==='function'&&cloudOn()?`<button class="btn" data-act="cloudOpen">${CLOUD.user?'클라우드에서 불러오기':'로그인해서 이어하기'}</button>`:''}</div>
   </div>
   <p class="small muted">완주 ${m.clears}번${m.titles.length?' · 얻은 칭호: '+m.titles.slice(-6).map(esc).join(', '):''}</p>
  </div>`;
}
function prologueView(){
  const d=PRO[S.pro];let def=d;if(d.variant){if(!S.proVar)S.proVar=pick(['A','B','C']);def=d.v[S.proVar]}
  const ctx={nb:NB('pirani'),subj:rep()};
  return `<div class="stage-head"><h2>${esc(d.title)}</h2><span class="lbl">서장 ${S.pro+1}/${PRO.length}${d.variant?' · 변형 '+S.proVar:''}</span></div>
  <div class="panel"><p class="lead">${esc(fill(def.text||d.text,ctx))}</p>
  ${S.proOut?`<div class="out"><b>${esc(S.proOut.t)}</b><ul>${S.proOut.msgs.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>
   <div class="actions"><button class="btn go" data-act="proNext">${S.pro===PRO.length-1?'1953년, 첫 봄':'다음'}</button></div>`
  :`<div class="actions">${def.ch.map((c,i)=>`<button class="btn" data-act="pro" data-a="${i}">${esc(fill(c.t,ctx))}${c.hint?` <span class="small muted">· ${c.hint}</span>`:''}</button>`).join('')}</div>`}
  </div>`;
}
function noticeView(){
  const n=S.notices[0];if(!n)return '';
  if(n.kind==='chapter')return `<div class="chapter"><div class="ch-no">${esc(n.no)}</div><h2 class="ch-title">${esc(n.title)}</h2><div class="ch-sub">${esc(n.sub)}</div><p class="lead">${esc(n.text)}</p>
     <div class="small muted">우리 집: 대표 ${esc(rep()?rep().name:'')} · 식구 ${homeAlive().length}명 · 재산 ${wonBoth(netWorth())} · 체면 ${faceGrade(S.face).name}</div>
     <div class="actions" style="justify-content:center"><button class="btn go" data-act="noticeNext">이 시대로 들어간다</button></div></div>`;
  if(n.kind==='era')return `<div class="paper"><div class="paper-mast"><span>버드내 소식</span><span>${n.year}년</span></div>
     <div class="paper-kicker">${esc(n.kicker)} · 시대 이벤트 · 변형 ${n.variant}</div>
     ${n.headline?`<h2 class="paper-head">${esc(n.headline)}</h2>`:''}<h3 class="paper-title">${esc(n.title)}</h3>
     <p class="lead">${esc(n.text)}</p>
     <div class="out"><b>우리 집에 미친 일</b><ul>${n.msgs.map(m=>`<li>${esc(m)}</li>`).join('')||'<li>당장 달라진 것은 없다. 올해 일로 이어질 수 있다.</li>'}</ul></div>
     <div class="small muted">신문 제목은 이 게임이 쓴 요약이다.</div>
     <div class="actions"><button class="btn go" data-act="noticeNext">${S.notices.length>1?'다음 소식':'봄 일 나누기'}</button></div></div>`;
  if(n.kind==='goal')return `<div class="stage-head"><h2>${S.curGen}세대 집안 목표</h2><span class="lbl">이루면 체면 +3, 식구들 애정 +2</span></div>
     <div class="panel"><p class="lead">이번 세대에 무엇을 이루고 싶은가? 하나를 고르자. 이루면 다음 목표를 또 고를 수 있다.</p>
     <div class="opts3">${n.opts.map(k=>`<button class="optc" data-act="goal" data-a="${k}"><b>${esc(GOALS[k].t)}</b><small>${esc(GOALS[k].d)}</small></button>`).join('')}</div>
     <div class="actions"><button class="btn" data-act="goal" data-a="">정하지 않는다</button></div></div>`;
  if(n.kind==='genpage'){const pg=S.pages.find(x=>x.gen===n.gen);const ph=S.photos[S.photos.length-1];
    return `<div class="scroll"><h2>${esc(S.jb&&S.jb.bon?jbBonText():S.sur+'씨')} 족보 — ${n.gen}세대</h2><div class="small muted" style="text-align:center">${esc(jbKindText())}</div><div class="small muted" style="text-align:center">${n.gen}세대가 모두 세상을 떠났다. ${pg.year}년에 정리한 기록.</div>
      ${photoView(ph,n.gen+'세대를 보내며')}
      <div class="lines">${pg.lines.map(l=>lineView(l)).join('')}</div>
      ${pg.goals.length?`<div class="stamps">${pg.goals.map(g=>`<span class="stamp">${esc(GOALS[g].t)}</span>`).join('')}</div>`:''}
      <p class="lead" style="text-align:center">이제 ${n.gen+1}세대의 이야기다.</p>
      <div class="actions" style="justify-content:center"><button class="btn go" data-act="genNext">${n.gen+1}세대로</button></div></div>`}
  if(n.kind==='finale'){const f=S.finaleV||(S.finaleV=finaleVariant());return `<div class="chapter"><div class="ch-no">종장</div><h2 class="ch-title">마지막 명절</h2><div class="ch-sub">${S.year}년 · 3대가 모두 떠나다</div><p class="lead">${esc(f.text)}</p>
     <div class="actions" style="justify-content:center"><button class="btn go" data-act="finale">족보를 펼친다</button></div></div>`}
  return '';
}
function budgetBox(F){const row=(t,x,neg)=>Math.abs(x)<.005?'':`<tr><td>${t}</td><td class="num" style="text-align:right;color:${neg?'var(--warn)':'var(--ok)'}">${neg?'−':'+'}${wonY(Math.abs(x))}</td></tr>`;
  return `<details class="jobinfo budget"><summary class="lbl">한 해 살림 예상 자세히 (가을 정산과 같은 셈법)</summary><div class="tbl"><table><tbody>
   ${row('일해서 버는 돈',F.work)}${row('연금',F.pension)}${row('품앗이 답례 (평균)',F.help)}${row('땅·건물 세',F.rent)}${row('이웃이 돌려주는 것 (평균)',F.nb)}${row('따로 사는 식구 용돈 (평균)',F.kin)}
   <tr><td><b>들어오는 돈</b></td><td class="num" style="text-align:right"><b>${wonY(F.inc)}</b></td></tr>
   ${row('기본 생활비',F.base,1)}${row('집 관리',F.house,1)}${row('씀씀이 (버는 만큼, 모은 만큼 는다)',F.spend,1)}${row('세금',F.tax,1)}${row('가게·공장 유지비',F.upkeep,1)}${row('학비 등',F.fee,1)}${row('어르신 돌봄',F.care,1)}${row('비좁은 집',F.crowd,1)}
   <tr><td><b>나가는 돈</b></td><td class="num" style="text-align:right"><b>${wonY(F.out)}</b></td></tr></tbody></table></div>
   <div class="small muted">${F.kept>0?'다 큰 자식이 제 살림으로 쓰는 몫 '+wonY(F.kept)+'은 빠져 있다. ':''}${F.overCap>0?'가게 일손이 한도('+(S.tradeSt+1)+'명)를 넘어 '+wonY(F.overCap)+'이 덜 벌린다. ':''}실제로는 장사 운(해마다 ±), 여름에 생기는 일, 물가(장롱 돈은 깎이고 통장 돈은 이자가 붙는다)에 따라 달라진다.</div></details>`}
function springView(){
  const H=homeAlive().filter(p=>age(p)>=7).sort((a,b)=>a.gen-b.gen||a.birth-b.birth);
  const y1=S.year+S.step-1;const F=forecast();
  return `<div class="stage-head"><h2>봄 — 일 나누기</h2><span class="lbl">이번 턴 ${S.year}${S.step>1?'~'+y1:''}년 (${S.step}년)</span></div>
  ${S.banner?`<div class="banner">${esc(S.banner)}</div>`:''}
  <div class="panel">
   <p class="small muted" style="margin-top:0">가족마다 올해 할 일을 정한다. 일마다 오르는 능력치가 다르고(끈기·성실이 높으면 빨리, 같은 일을 잘하는 식구가 있으면 더 빨리 큰다), 바라는 것과 맞는 일을 하면 애정이 오른다.</p>
   <details class="jobinfo"><summary class="lbl">일마다 다른 점 보기</summary><div class="tbl"><table><thead><tr><th>일</th><th>좋은 점</th><th>나쁜 점</th><th>잘 맞는 사람</th></tr></thead><tbody>${['trade','craft','study','care','help','home','rest'].map(k=>`<tr><td>${JOB_INFO[k].name}</td><td>${JOB_INFO[k].good}</td><td>${JOB_INFO[k].bad}</td><td>${JOB_INFO[k].stat}</td></tr>`).join('')}</tbody></table></div><div class="small muted">정년: 회사·공장 월급쟁이 ${retAge(S.year)}세, 장사·내 공장은 70세, 누구나 75세. 은퇴한 식구는 쉼·집안일·품앗이만 할 수 있다. 가게 일손 한도: ${S.tradeSt+1}명. 그보다 많으면 남는 사람은 절반도 못 번다. ${S.tradeSt>=2?'가게 유지비 '+wonY([0,3,8][S.tradeSt-1]*prod(S.year)*PAY)+'/년. ':''}${S.craftSt>=3?'공장 유지비 '+wonY(9*prod(S.year)*PAY)+'/년. ':''}</div></details>
   <div class="assign">${H.map(p=>`<div class="arow"><button class="aname" data-act="openP" data-a="${p.id}">${portraitView(p)}<span><span class="pname" style="font-size:18px">${esc(p.name)}</span> <span class="small muted">${age(p)}세</span><br><span class="small muted">${p.f.desireKnown?'바라는 것: '+p.desire:relLabel(p)}</span></span></button>
     <div class="seg">${SLOT_ORDER.map(s=>{const why=slotOK(p,s);if(why==='1990년부터')return '';const v=incomeOf(p,s,S.year)*contribRate(p)-feeOf(p,s,S.year);const gr=growList(p,s).slice(0,2).map(x=>x[0]).join('·');
       return `<button aria-pressed="${p.slot===s}" ${why?'disabled':''} data-act="assign" data-a="${p.id}" data-b="${s}" title="${esc(why||('오르는 능력치: '+gr))}">${esc(slotLabel(p,s))}<small>${why?esc(why):(Math.abs(v)>=.05?sgW(v)+'/년':'0원')}</small><small class="gr">${gr}</small></button>`}).join('')}</div></div>`).join('')}</div>
   ${budgetBox(F)}
   <div class="actions"><span class="small">한 해 예상 <b class="num" style="color:${F.net>=0?'var(--ok)':'var(--warn)'}">${sgW(F.net)}</b> <span class="muted">(지금 돈 ${wonNow(F.net)})${S.step>1?' · '+S.step+'년이면 대략 '+sgW(F.net*S.step):''}</span></span><button class="btn go" data-act="springGo" style="margin-left:auto">여름으로</button></div>
  </div>`;
}
function cardFull(h,i){
  const def=defOf(h);const sj=h.subj?P(h.subj):null;const nb=h.nb?S.nbs.find(n=>n.key===h.nb):null;
  return `<article class="card ${h.major?'major':''} ${h.done?'done':''}">
   ${h.major?'<span class="seal">중요</span>':''}
   <div class="card-art"><canvas width="32" height="32" data-icon="${h.slot}"></canvas>${sj?portraitView(sj):''}</div>
   <div class="slot"><span>${h.slot}</span>${h.chainTag?'<span class="tag">이어진 일</span>':''}</div>
   <h3>${esc(h.title)}</h3>
   <div class="prow">${sj?`<span class="chip">${esc(sj.name)} · ${age(sj)}세</span>`:''}${nb?`<span class="chip">${esc(nbName(nb))} · 정 ${nb.j}</span>`:''}</div>
   <p>${esc(h.text)}</p>
   ${h.done?`<div class="out"><b>${esc(h.out.choice)}</b><ul>${h.out.msgs.map(m=>`<li>${esc(m)}</li>`).join('')||'<li>별일 없었다</li>'}</ul></div>`
    :`<div class="ch">${h.ch.map((c,ci)=>{if(chHide(h,ci))return '';const why=chNeed(h,ci);return `<button ${why?'disabled':''} data-act="choose" data-a="${i}" data-b="${ci}">${esc(moneyText(chShow(h,ci)))}${chDebt(h,ci)&&S.money<cm(def.ch[ci].need&&def.ch[ci].need.money||0)?'<div class="why">모자란 만큼 빚이 된다</div>':''}${why?`<div class="why">${esc(why)}</div>`:''}</button>`}).join('')}
     ${def.ch.every((x,k)=>chNeed(h,k))?`<button data-act="choose" data-a="${i}" data-b="-1">형편이 안 돼 넘긴다</button>`:''}</div>`}
  </article>`;
}
function summerView(){
  const total=S.hand.length;const cur=curCard();const done=S.hand.filter(h=>h.done).length;const past=S.hand.filter(h=>h.done);
  const majors=S.hand.filter(h=>h.major&&!h.done).length;
  return `<div class="stage-head"><h2>여름 — 올해 생긴 일 ${total}가지</h2><span class="lbl">생기는 대로 하나씩 답한다 · ${done}/${total}${majors?' · 중요한 일 '+majors+'개':''}</span></div>
  ${cur>=0?`<div class="cards one">${cardFull(S.hand[cur],cur)}</div>
    <div class="actions" style="margin-top:10px"><span class="small muted">남은 일 ${total-done-1}가지 ${S.hand.slice(cur+1).map(h=>`<span class="chip ${h.major?'rep':''}">${h.major?'중요 · ':''}${h.slot}</span>`).join(' ')}</span>${total-done>1?'<button class="btn small-btn" data-act="autoRest" style="margin-left:auto" title="남은 일은 돈 안 드는 첫 선택지로 정한다">남은 일 알아서 정하기</button>':''}</div>`
   :`<div class="actions" style="margin-top:0;margin-bottom:14px"><button class="btn go" data-act="summerEnd">가을로</button><span class="small muted">올해 일에 모두 답했다</span></div>`}
  ${past.length?`<div class="lbl" style="margin:18px 0 8px">올해 있었던 일 <span class="muted">(최근 것부터)</span></div>
   <div class="cards">${past.slice().reverse().map((h,pi)=>`<article class="card done ${h.major?'major':''}">${h.major?'<span class="seal sm">중요</span>':''}<div class="slot"><span>${h.slot}</span>${pi===0?'<span class="chip ok" style="margin-left:6px">방금</span>':''}</div><h3 style="font-size:17px">${esc(h.title)}</h3><div class="out" style="border-top:0;padding-top:0"><b>${esc(h.out.choice)}</b><ul>${h.out.msgs.map(m=>`<li>${esc(m)}</li>`).join('')||'<li>별일 없었다</li>'}</ul></div></article>`).join('')}</div>`:''}`;
}
function autumnView(){
  const rp=S.report;const ids=Object.keys(rp.inc).map(Number);const my=Math.round((rp.y0+rp.yEnd)/2);const tot=ids.reduce((s,id)=>s+rp.inc[id],0);
  return `<div class="stage-head"><h2>가을 — 결산</h2><span class="lbl">${rp.y0}${rp.yEnd>rp.y0?'~'+rp.yEnd:''}년</span></div>
  ${rp.major.length?`<div class="bignews">${rp.major.map(m=>`<div class="bn ${m.death?'death':''}">${m.major?'<span class="seal sm">중요</span>':''}${esc(m.t)}</div>`).join('')}</div>`:''}
  <div class="panel report">
   ${rp.births.length?`<div><div class="lbl">새로 태어난 아이 — 이름을 지어 주세요</div><div class="births">${rp.births.map(b=>{const c=P(b.id);return `<div class="birth">${portraitView(c)}<div class="bform"><div class="small muted">${b.y}년 · ${esc(b.parents)} 부부의 ${c.sex==='m'?'아들':'딸'}</div>
     <div class="brow"><label class="sr" for="nm-${c.id}">이름</label><input id="nm-${c.id}" data-name="${c.id}" value="${esc(c.name)}" maxlength="5" autocomplete="off"><button class="btn" data-act="reName" data-a="${c.id}">다른 이름</button></div></div></div>`}).join('')}</div><div class="small muted" style="margin-top:6px">한글 1~5자. 그대로 두면 지금 이름으로 정해진다.</div></div>`:''}
   <div class="tbl"><table><thead><tr><th>누가</th><th>한 일</th><th class="r">벌이</th></tr></thead><tbody>
   ${ids.filter(id=>rp.slotName[id]).map(id=>{const p=P(id);return `<tr><td>${esc(p.name)}</td><td>${esc(rp.slotName[id]||'')}</td><td class="r">${wonY(rp.inc[id],my)}</td></tr>`}).join('')}
   <tr><td colspan="2">식구들 벌이 합계${ids.some(id=>{const p=P(id);return p&&contribRate(p)<1})?' <span class="muted small">(다 큰 자식은 제 살림 몫을 빼고 보탠 돈)</span>':''}</td><td class="r">${wonY(tot,my)}</td></tr>
   ${rp.rent?`<tr><td colspan="2">땅·건물 세</td><td class="r">+${wonY(rp.rent,my)}</td></tr>`:''}
   ${rp.kin?`<tr><td colspan="2">따로 사는 식구가 부친 돈</td><td class="r">+${wonY(rp.kin,my)}</td></tr>`:''}
   ${rp.nbGain?`<tr><td colspan="2">이웃이 돌려준 것 (단골·선물)</td><td class="r">+${wonY(rp.nbGain,my)}</td></tr>`:''}
   ${rp.gift?`<tr><td colspan="2">품앗이 답례</td><td class="r">+${wonY(rp.gift,my)}</td></tr>`:''}
   <tr><td colspan="2">학비 등</td><td class="r">−${wonY(rp.fee,my)}</td></tr>
   <tr><td colspan="2">생활비 <span class="muted small">(${[rp.care?'어르신 돌봄 '+wonY(rp.care,my):'',rp.upkeep?'가게·공장 유지비 '+wonY(rp.upkeep,my):'',rp.tax?'세금 '+wonY(rp.tax,my):''].filter(Boolean).join(' · ')||'먹고 쓰는 돈'} 포함)</span></td><td class="r">−${wonY(rp.live,my)}</td></tr>
   ${(()=>{const net=(rp.incTot??tot)-rp.fee-rp.live;return `<tr><th colspan="2">한 해 살림 ${rp.yEnd>rp.y0?'('+(rp.yEnd-rp.y0+1)+'년) ':''}남은 돈</th><th class="r" style="color:${net>=0?'var(--ok)':'var(--warn)'}">${sgW(net)}</th></tr>
   ${rp.fcNet!=null?`<tr><td colspan="2" class="small">봄에 본 예상 ${sgW(rp.fcNet)} · 차이 ${sgW(net-rp.fcNet)} <span class="muted">${rp.luck?'(주로 장사 운 '+rp.luck.map(l=>l+'%').join(', ')+')':'(품앗이·이웃·용돈은 해마다 들쭉날쭉)'}</span></td><td></td></tr>`:''}`})()}
   ${rp.summer?`<tr><td colspan="2">여름에 생긴 일로 쓰고 번 돈</td><td class="r">${sgW(rp.summer)}</td></tr>`:''}
   ${rp.erosion?`<tr><td colspan="2">물가가 올라 장롱 돈 가치가 깎임</td><td class="r">−${wonY(rp.erosion,my)}</td></tr>`:''}
   ${rp.interest?`<tr><td colspan="2">통장 이자 (물가를 뺀 몫)</td><td class="r">+${wonY(rp.interest,my)}</td></tr>`:''}
   <tr><th colspan="2">현금</th><th class="r">${wonY(rp.start-rp.summer,rp.y0)} → ${rp.end<0?'빚 ':''}${wonY(rp.end,rp.yEnd)}</th></tr>
   <tr><th colspan="2">재산 (집·땅 포함)</th><th class="r">${wonY(rp.endNW,rp.yEnd)} <span class="muted small">지금 돈 ${wonNow(rp.endNW)}</span></th></tr></tbody></table></div>
   ${Object.keys(rp.grow).length?`<div><div class="lbl">능력치가 자랐다</div><ul class="notes">${Object.entries(rp.grow).map(([id,g])=>{const p=P(+id);if(!p)return '';const a=age(p);return `<li><b>${esc(p.name)}</b> ${g.map(([k,v])=>k+' +'+Math.round(v*10)).join(', ')}${a<16&&!p.inlaw?' <span class="muted small">(아직 정확한 값은 안 보임)</span>':''}</li>`}).join('')}</ul></div>`:''}
   ${rp.notes.length?`<div><div class="lbl">집안 소식</div><ul class="notes">${rp.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div>`:''}
   <div class="small muted">장사 경력 ${Math.floor(S.tradeY)}년 (${['','처음','점포','큰 가게'][S.tradeSt]}) · 기술 경력 ${Math.floor(S.craftY)}년 (${['','처음','숙련','내 사업'][S.craftSt]})</div>
   <div class="actions"><button class="btn go" data-act="autumnNext">${S.repDied?'장례를 치른다':'설을 맞는다'}</button></div>
  </div>`;
}
function seollalView(){
  const H=homeAlive();const r=rep();
  const others=H.filter(p=>p.id!==S.repId).sort((a,b)=>(S.lastInc[b.id]||0)-(S.lastInc[a.id]||0)||a.birth-b.birth);
  const vis=(S.visitors||[]).map(P).filter(Boolean);
  const empties=S.people.filter(p=>!p.inlaw&&!(S.visitors||[]).includes(p.id)&&(p.status==='away'&&p.alive||(!p.alive&&p.death>=S.year-6)));
  const nDone=Object.values(S.agendaRes).filter(x=>!x.partial).length;
  return `<div class="stage-head"><h2>설 — 가족 회의</h2><span class="lbl">${S.year}년 설 · 안건 ${S.agendas.length}개 중 ${nDone}개 정함</span></div>
  ${S.banner?`<div class="banner">${esc(S.banner)}</div>`:''}
  <div class="panel">
   <div class="table-wrap"><div class="sang">
    ${r&&r.status==='home'?`<div class="seat"><div class="cushion rep">${portraitView(r)}</div>${esc(r.name)}<span class="muted">대표</span></div>`:''}
    ${others.map(p=>`<div class="seat"><div class="cushion">${portraitView(p)}</div>${esc(p.name)}<span class="muted">${age(p)}세</span></div>`).join('')}
    ${vis.map(p=>`<div class="seat"><div class="cushion visit">${portraitView(p)}</div>${esc(p.name)}<span class="muted">${esc(p.away?p.away.why:'')} · 왔다</span></div>`).join('')}
    ${empties.map(p=>`<div class="seat"><div class="cushion empty">${p.alive?'·':'故'}</div>${esc(p.name)}<span class="muted">${p.alive?esc(p.away?p.away.why:''):'빈자리'}</span></div>`).join('')}
   </div></div>
   <p class="quote">${esc(S.relLine||(S.relLine=relativeLine()))}</p>
   <p class="small muted" style="text-align:center;margin:4px 0 0">자리 순서는 지난 결산에서 많이 번 사람부터. 안건은 여러 개를 정해도 되고, 하나도 안 정해도 된다.</p>
   <div class="agendas">${S.agendas.length?S.agendas.map((a,ai)=>{const res=S.agendaRes[ai];
     if(res&&!res.partial)return `<div class="agenda done"><div class="pname" style="font-size:17px">${esc(res.title)} <span class="chip">정함</span></div><ul class="notes small">${res.msgs.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>`;
     const v=agendaView(a);
     return `<div class="agenda">${res&&res.partial?`<div class="small"><b>${esc(res.title)}</b> — ${res.msgs.map(esc).join(' · ')}</div>`:''}<div class="pname" style="font-size:18px">${esc(v.title)}</div><div class="small">${esc(v.text)}</div>
      <div class="opts">${v.opts.map(o=>{const why=optNeed(o);return `<button ${why?'disabled':''} data-act="agenda" data-a="${ai}" data-b="${o.k}" title="${esc(why)}">${esc(o.t)}${why?` <span class="small" style="color:var(--warn)">· ${esc(why)}</span>`:''}</button>`}).join('')}</div></div>`}).join('')
     :'<div class="small muted">올해는 큰 안건이 없다. 떡국만 먹는다.</div>'}</div>
   <div class="actions"><button class="btn go" data-act="seollalNext" ${S.agendaStep?'disabled':''}>봄으로</button>${S.agendaStep?'<span class="small muted">신혼살림을 먼저 정해야 한다</span>':''}</div>
  </div>`;
}
function inheritView(){
  migrate();const I=S.inh;const kids=inheritKids();const from=S.genPass&&S.genPass.from?P(S.genPass.from):null;
  const val={};for(const c of kids)val[c.id]=0;for(const a of I.assets){if(a.jesa)continue;const L=I.asg[a.k]||[];for(const id of L)val[id]+=a.v/L.length}
  const tot=Object.values(val).reduce((x,y)=>x+y,0);const PR=inhPredict();
  return `<div class="stage-head"><h2>장례와 유산</h2><span class="lbl">${S.year}년 · ${S.curGen}세대를 보내며</span></div>
  <div class="banner">${from?esc(from.name)+josa(from.name,'이/가')+' 세상을 떠나 '+S.curGen+'세대가 모두 졌다. ':''}조문객: ${esc(mourners())}.</div>
  <div class="panel">
   <p class="small muted" style="margin-top:0">재산마다 받을 자녀를 고른다. 여러 명을 고르면 똑같이 나눠 갖는다. 몫이 적은 자녀, 마음에 쌓인 것이 많은 자녀는 서운해하거나 제 몫을 들고 집을 떠날 수 있다. 제사는 한 명만 맡는다.</p>
   <div class="assets">${I.assets.map(a=>{const L=I.asg[a.k]||[];return `<div class="asset"><div><div class="pname" style="font-size:17px">${esc(a.l)}</div><div class="small muted">${a.jesa?'한 명만':wonY(a.v)}</div></div><div class="seg">
     ${kids.map(c=>`<button aria-pressed="${L.includes(c.id)}" ${I.done?'disabled':''} data-act="inhSet" data-a="${a.k}" data-b="${c.id}">${esc(c.name)}<small>${age(c)}세${c.status!=='home'?' · '+esc(c.away?c.away.why:''):''}</small></button>`).join('')}
     ${!a.jesa&&kids.length>1?`<button ${I.done?'disabled':''} data-act="inhSet" data-a="${a.k}" data-b="all">모두 똑같이<small>${kids.length}명</small></button>`:''}
   </div></div>`}).join('')}</div>
   <div class="tbl" style="margin-top:12px"><table><thead><tr><th>자녀</th><th class="r">받을 몫</th><th class="r">비율</th><th>예상</th></tr></thead><tbody>${kids.map(c=>`<tr><td>${esc(c.name)}${c.grudge>=4?' <span class="chip warn">표정이 어둡다</span>':''}</td><td class="r">${wonY(val[c.id])}</td><td class="r">${tot?Math.round(val[c.id]/tot*100):0}%</td><td>${(()=>{const q=PR.by[c.id];return q?`<span class="chip ${q.t==='화목'?'ok':q.t==='서운함'?'':'warn'}">${q.t}</span>${q.take?' <span class="small">'+wonY(q.take)+' 들고 나감</span>':''}`:''})()}</td></tr>`).join('')}</tbody></table></div>
   ${I.done?'':`<div class="banner small" style="margin-top:8px">이대로 나누면 집에 남는 재산 <b>${wonY(PR.stay)}</b> / 전체 ${wonY(PR.all)}${PR.out>0?` · 갈라서는 자녀가 <b style="color:var(--warn)">${wonY(PR.out)}</b>을 들고 나간다`:''}. 집과 가게는 남는다. 예상은 지금 마음 기준이다.</div>`}
   ${I.done?`<div class="out" style="margin-top:14px"><b>자녀들의 반응</b><ul>${I.res.map(r=>{const c=P(r.id);return `<li><b>${esc(c.name)}</b> (${r.share}%) — ${r.tier}: ${esc(r.txt)}</li>`}).join('')}</ul></div>
     <div class="actions"><button class="btn go" data-act="inhNext">다음</button></div>`
   :`<div class="actions"><button class="btn go" data-act="inhConfirm" ${I.assets.every(a=>(I.asg[a.k]||[]).length)?'':'disabled'}>이대로 나눈다</button></div>`}
  </div>`;
}
function chooseRepView(){
  const c=repCands().filter(p=>!S.genPass||p.gen>S.curGen||!repCands().some(q=>q.gen>S.curGen));const old=S.repPick?P(S.repPick.from):null;
  const head=S.genPass?'장례를 마쳤다. 집안을 이끌 사람을 고른다.':(old?old.name+josa(old.name,'이/가')+' 세상을 떠났다. 집안을 이끌 사람을 고른다.':'집안을 이끌 사람을 고른다.');
  return `<div class="stage-head"><h2>다음 대표</h2></div><div class="panel"><p class="lead">${esc(head)}${S.year<2000?' 맏이가 아니면 친척들이 수군거린다.':''}</p>
   <div class="people">${c.map(p=>`<div class="pick">${personCard(p,false)}<button class="btn go" data-act="chooseRep" data-a="${p.id}">${esc(p.name)}에게 맡긴다</button></div>`).join('')}</div></div>`;
}
function lineView(l){return `<div class="line"><div><div class="who">${esc(l.name)}${l.inlaw&&l.sur?` <span class="small muted">${esc(l.sur)}씨</span>`:''}</div><div class="small muted num">${l.birth} – ${l.death||''}</div></div><div>${esc(l.line)}</div></div>`}
function photoView(ph,cap){if(!ph)return '';return `<div><div class="lbl" style="text-align:center;margin-bottom:6px">${ph.year}년 가족사진${cap?' · '+esc(cap):''}</div>
  <div class="photo era${ph.year<1970?0:ph.year<1995?1:ph.year<2030?2:3}">${ph.people.map(q=>{const p=P(q.id);return `<div class="fig ${q.ghost?'ghost':''}">${p?portraitView(p):''}<span>${esc(q.name)}${q.note?' ('+esc(q.note)+')':''}</span></div>`}).join('')}</div></div>`}
function endingView(){
  const E=S.ending;const main=E.titles[0];
  const reason={finale:'3대가 모두 세상을 떠나고, 마지막 명절을 맞았다.',line:'대를 이을 자손이 없어 집안 이야기가 여기서 끝난다.',scatter:'집에 남은 사람이 없어 식구들이 흩어졌다.'}[E.reason]||'';
  return `<div class="scroll">
   <h2>${esc(S.jb&&S.jb.bon?jbBonText():S.sur+'씨')} 족보</h2><div class="small muted" style="text-align:center">${esc(reason)} 1950–${E.year} · ${esc(jbKindText())} · ${S.jb?S.jb.pages:0}쪽</div>
   ${S.jb&&S.jb.preface?`<p class="lead" style="text-align:center;font-family:var(--f-disp)">「${esc(S.jb.preface)}」</p>`:''}
   <div class="stamps"><span class="stamp main">${esc(main)}</span>${E.titles.slice(1).map(t=>`<span class="stamp">${esc(t)}</span>`).join('')}</div>
   ${E.routes?`<div class="routes">${Object.entries(ROUTES).map(([k,o])=>`<div class="route"><div class="rt-head"><b>${o.name}</b><span class="stars">${stars(E.routes[k])}</span></div><div class="small">${E.routes[k]?esc(o.titles[E.routes[k]]):'—'}</div></div>`).join('')}</div>`:''}
   ${S.photos.map((ph,i)=>photoView(ph,(i+1)+'번째 사진')).join('')}
   ${S.pages.map(pg=>`<div><h3 class="pg-title">${pg.gen}세대</h3><div class="lines">${pg.lines.map(l=>lineView(l)).join('')}</div></div>`).join('')}
   <div class="small muted" style="text-align:center">재산 ${wonBoth(E.nw)} · 체면 ${Math.round(S.face)} (${faceGrade(S.face).name}) · 이룬 목표 ${S.goalsDone.length}개 · 이사 ${S.moves.length}번</div>
   ${S.hunPicked?`<p class="lead" style="text-align:center">남긴 가훈: 「${esc(HUNS[S.hunPicked].name)}」</p><div class="actions" style="justify-content:center"><button class="btn go" data-act="newRun">새 회차</button></div>`
   :`<div class="lbl" style="text-align:center">후손에게 남길 가훈 (다음 회차에서 고를 수 있다)</div><div class="opts3">${Object.entries(HUNS).map(([k,h])=>`<button class="optc" data-act="endHun" data-a="${k}"><b>${esc(h.name)}</b><small>${esc(h.desc)}</small></button>`).join('')}</div>`}
  </div>`;
}
function helpView(){
  return `<div class="modal" role="dialog" aria-label="도움말"><div class="modal-box"><button class="btn close" data-act="help">닫기</button>
   <h2>어떻게 하나요</h2>
   <ul class="notes">
    <li><b>한 턴</b>: 새해 소식(시대 이벤트) → 봄 일 나누기 → 여름 올해 생긴 일 4~9가지 → 가을 결산 → 설 가족 회의. 큰일이 있는 해는 1년, 조용한 해는 2년씩 흐른다.</li>
    <li><b>돈</b>: 그해 물가로 보여 주고, 옆에 지금 돈으로 바꾼 값을 붙인다. 물가지수는 1978년을 100으로 둔 근사치다. 장롱에 둔 돈은 물가가 오르는 만큼 가치가 깎인다. 설에 통장을 만들면 이자가 붙는다. 땅과 집은 시대에 따라 값이 오르내린다.</li>
    <li><b>체면</b>: 혼사·자리·안건에 필요하다. 가만두면 조금씩 내려가니, 유지하려면 계속 애써야 한다.</li>
    <li><b>능력치 8가지·성격 5가지</b>: 일마다 오르는 능력치가 다르다. 끈기와 성실이 높을수록, 어릴수록, 같은 일을 잘하는 식구가 곁에 있을수록 빨리 큰다. 아이 능력치는 자라면서 ? → 범위 → 정확한 값(0~100)으로 보인다.</li>
    <li><b>바라는 것</b>: 맞는 일을 시키면 애정이, 어긋나면 원한이 쌓인다. 원한은 유산 분배 때 터진다.</li>
    <li><b>세대</b>: 대표는 언제든 다른 어른에게 넘길 수 있다. 윗세대가 모두 세상을 떠나야 장례와 유산 분배를 거쳐 다음 세대로 넘어간다. 3세대가 모두 세상을 떠나면 마지막 명절을 맞고 이야기가 끝난다.</li>
    <li><b>이웃과 정</b>: 정은 세대를 넘어 갚아진다. 1990년대부터 이웃이 이사를 가고 새 이웃이 온다. 정의 힘은 2010년대에 가장 약하고, 늙어 가는 미래에 다시 강해진다.</li>
    <li><b>이사</b>: 설 회의에서 강 건너 아파트, 신도시, 시골로 이사할 수 있다. 이웃과 단골을 잃는 대신 집값과 벌이가 바뀐다. 옛 동네로 돌아올 수도 있다.</li>
    <li><b>집안 목표</b>: 세대마다 목표를 골라 이루면 체면과 애정이 오른다.</li>
    <li><b>다회차</b>: 완주하면 새 출발 동네와 가문 내력이 열리고, 남긴 가훈을 다음 집안이 물려받는다.</li>
    <li>2021년 이후는 이 게임이 그리는 가상의 미래다. 시대 이벤트의 신문 제목은 이 게임이 쓴 요약이다.</li>
   </ul></div></div>`;
}
function personModal(){const p=P(UI.open);if(!p)return '';return `<div class="modal" role="dialog" aria-label="${esc(p.name)} 카드"><div class="modal-box"><button class="btn close" data-act="closeP">닫기</button>${personCard(p,true)}</div></div>`}
function stageView(){
  switch(S.phase){
    case 'notice':return noticeView();case 'prologue':return prologueView();case 'spring':return springView();case 'summer':return summerView();
    case 'autumn':return autumnView();case 'seollal':return seollalView();case 'inherit':return inheritView();case 'chooseRep':return chooseRepView();
    case 'genpage':return noticeView();
  }return '';
}
/* ---------- 자동 진행 ----------
   한 번에 한 걸음씩, 무난한 선택으로 진행한다. 직접 정해야 하는 순간(장례·유산, 대표 고르기, 세대 교체, 엔딩)에는 멈춘다.
   설정에 따라 '중요' 카드나 시대 이벤트에서도 멈춘다. */
function autoPickCard(i){const h=S.hand[i];const def=defOf(h);
  const ok=def.ch.map((c,ci)=>ci).filter(ci=>!chNeed(h,ci)&&!chHide(h,ci));if(!ok.length)return -1;
  // 돈이 넉넉하면 앞쪽(대개 정성 들이는) 선택, 빠듯하면 돈 안 드는 선택
  const free=ok.filter(ci=>!(def.ch[ci].need&&def.ch[ci].need.money));
  if(S.money<cm(15)&&free.length)return free[0];return ok[0]}
function autoSeollal(){
  for(let t=0;t<12;t++){let did=false;
    S.agendas.forEach((a,ai)=>{if(did)return;const res=S.agendaRes[ai];if(res&&!res.partial)return;if(S.agendaStep&&!(a.pid&&a.pid===S.agendaStep.pid))return;
      const v=agendaView(a);const can=k=>{const o=v.opts.find(x=>x.k===k);return o&&!optNeed(o)};const cush=c=>S.money>c*1.4;let k=null;
      switch(a.kind){
        case 'mid':k='yes';break;case 'college':k=can('yes')&&cush(5*prod(S.year))?'yes':null;break;
        case 'marry':k=S.agendaStep?(S.year>=1980&&can('out')?'out':'stay'):(can('mid')&&cush(weddingCost('mid'))?'mid':can('plain')?'plain':null);break;
        case 'house':k=can('yes')&&S.money>costOf('house')*1.1?'yes':null;break;
        case 'shop':case 'whole':case 'factory':{const c=costOf(a.kind);const ok=v.opts.find(o=>o.k!=='no'&&!optNeed(o));k=ok&&cush(c)?ok.k:null;break}
        case 'biz':{if(bizFade()<1||S.year>=bizOf().y[1]){const o=v.opts.filter(o=>o.k!=='no'&&!optNeed(o)).sort((x,z)=>BIZ[z.k].m-BIZ[x.k].m)[0];k=o?o.k:'no'}else k='no';break}
        case 'arts':{const o=['pro','lesson','self','hobby'].find(x=>can(x)&&(x==='pro'?S.money>cm(12)*4:x==='lesson'?S.money>cm(4)*3:true));k=o||null;break}
        case 'skill':case 'bank':k='yes';break;
        case 'buy':{if(res&&res.partial)break;const o=v.opts.find(o=>o.need&&S.money>o.need.money*4);k=o?o.k:null;break}
        case 'apt':k=can('yes')&&S.money>(v.opts[0].need?v.opts[0].need.money:0)*1.6?'yes':null;break;
      }
      if(k&&can(k)){runAgenda(ai,k);did=true}});
    if(!did&&!S.agendaStep)break;
    if(!did&&S.agendaStep){const ai=S.agendas.findIndex(a=>a.pid===S.agendaStep.pid);runAgenda(ai,'stay')}
  }
}
function autoStep(){
  const au=UI.auto;
  switch(S.phase){
    case 'prologue':if(S.proOut)A.proNext();else A.pro(0);return true;
    case 'notice':{const n=S.notices[0];if(!n)return false;
      if(n.kind==='genpage'||n.kind==='finale')return false;
      if(n.kind==='era'&&au.stopEra&&!n.autoSeen){n.autoSeen=true;return false}
      if(n.kind==='goal'){A.goal(n.opts[0]||'');return true}
      A.noticeNext();return true}
    case 'spring':if(au.until&&S.year>=au.until)return false;A.springGo();return true;
    case 'summer':{const i=curCard();if(i<0){A.summerEnd();return true}
      if(au.stopMajor&&S.hand[i].major&&!S.hand[i].autoSeen){S.hand[i].autoSeen=true;return false}
      resolveCard(i,autoPickCard(i));return true}
    case 'autumn':{if(au.stopDeath&&S.report&&S.report.major.some(m=>m.death)&&!S.report.autoSeen){S.report.autoSeen=true;return false}
      if(S.report&&S.report.births.length&&au.stopBirth&&!S.report.autoSeenB){S.report.autoSeenB=true;return false}
      A.autumnNext();return true}
    case 'seollal':autoSeollal();A.seollalNext();return true;
  }
  return false;
}
let autoTimer=null;
function autoRun(){
  clearTimeout(autoTimer);if(!UI.auto||!UI.auto.on)return;
  let ok=false;try{ok=autoStep()}catch(e){console.error(e);ok=false}
  if(!ok){UI.auto.on=false;UI.auto.stoppedAt=S.year;render();return}
  render();autoTimer=setTimeout(autoRun,UI.auto.fast?60:420);
}
function autoBar(){const au=UI.auto||{};if(['title','ending'].includes(S.phase))return '';
  return `<div class="autobar">${au.on?`<span class="auto-on">자동 진행 중${au.until?' · '+au.until+'년까지':''}</span><button class="btn small-btn" data-act="autoStop">멈추기</button>`
   :`<span class="lbl">자동 진행</span><button class="btn small-btn" data-act="autoGo" data-a="5">5년</button><button class="btn small-btn" data-act="autoGo" data-a="10">10년</button><button class="btn small-btn" data-act="autoGo" data-a="0">계속</button>
     <details class="au-more"><summary>멈출 때</summary><div class="au-opts">
     <label class="ck"><input type="checkbox" id="au-major" data-auto="stopMajor" ${au.stopMajor!==false?'checked':''}> 중요한 일에서 멈춤</label>
     <label class="ck"><input type="checkbox" id="au-era" data-auto="stopEra" ${au.stopEra?'checked':''}> 시대 이벤트에서 멈춤</label>
     <label class="ck"><input type="checkbox" id="au-death" data-auto="stopDeath" ${au.stopDeath!==false?'checked':''}> 식구가 세상을 떠나면 멈춤</label>
     <label class="ck"><input type="checkbox" id="au-birth" data-auto="stopBirth" ${au.stopBirth?'checked':''}> 아이가 태어나면 멈춤(이름 짓기)</label>
     <label class="ck"><input type="checkbox" id="au-fast" data-auto="fast" ${au.fast?'checked':''}> 빠르게</label>
     <span class="small muted" style="flex-basis:100%">장례·유산, 대표 고르기, 세대 교체, 엔딩에서는 늘 멈춘다. 자동으로 고르는 선택은 무난한 쪽(돈이 넉넉하면 정성, 빠듯하면 아끼기)이다.</span></div></details>
     ${au.stoppedAt?`<span class="small muted">${au.stoppedAt}년에 멈췄다. 직접 정할 일이 있다.</span>`:''}`}
   </div>`}
let hasSave=false;
function render(){
  if(!IS_DOM)return;
  const app=document.getElementById('app');
  let body;
  if(S.phase==='title')body=hdr()+titleView();
  else if(S.phase==='ending')body=hdr()+endingView();
  else{if(S.phase!=='seollal')S.relLine=null;body=hdr()+autoBar()+sceneView()+`<div class="grid">${asideView()}<section class="stage" aria-live="polite">${stageView()}</section></div>`}
  if(UI.err){body+=`<div class="modal" role="alertdialog"><div class="modal-box"><h2>문제가 생겼어요</h2><p>${esc(UI.err)}</p><p class="small muted">이 화면을 캡처해 알려 주세요.</p><button class="btn go" data-act="errClose">닫기</button></div></div>`}
  if(UI.tree)body+=treeModal();if(UI.open)body+=personModal();if(UI.help)body+=helpView();if(UI.cloud&&typeof cloudView==='function')body+=cloudView();
  app.innerHTML=body;paintPixels();save();if(typeof cloudAuto==='function')cloudAuto();
}
function save(){try{if(S&&S.phase!=='title'){const j=JSON.stringify(S);localStorage.setItem('jokbo-save5',j);if(!UI._bk||S.year!==UI._bk){UI._bk=S.year;if(S.phase==='spring')localStorage.setItem('jokbo-save5-bak',j)}}}catch(e){}}
function load(){for(const k of ['jokbo-save5','jokbo-save5-bak']){try{const s=localStorage.getItem(k);if(s){const o=JSON.parse(s);if(o&&o.v===5&&o.people&&o.people.length)return o}}catch(e){}}return null}

/* ---------- 동작 ---------- */
const A={
  hudToggle(){UI.hudOpen=!UI.hudOpen},
  setOpt(g,k){const o=Object.assign({},S.opt);o[g]=k||null;newGame(Object.assign(o,{sur:S.sur}))},
  reroll(){newGame(Object.assign({},S.opt))},
  resume(){const o=load();if(o){S=o;try{PRO=buildPro()}catch(e){}try{migrate()}catch(e){console.warn('migrate',e)}if(['title','ending'].includes(S.phase)&&S.year<2110)S.phase='spring'}},
  start(){try{const o=localStorage.getItem('jokbo-save5');if(o)localStorage.setItem('jokbo-save5-prev',o)}catch(e){}newGame(Object.assign({},S.opt,{sur:S.sur}));S.phase='prologue';S.pro=0;S.turn=1},
  pro(ci){const d=PRO[S.pro];let def=d;if(d.variant){if(!S.proVar)S.proVar=pick(['A','B','C']);def=d.v[S.proVar]}
    const c=def.ch[ci];if(!c)return;const out=[];applyFx(c.fx,{subj:rep(),nb:NB('pirani')},out,{raw:true});S.proOut={t:fill(c.t,{nb:NB('pirani')}),msgs:out};logIt(d.title+': '+S.proOut.t)},
  proNext(){S.pro++;S.proOut=null;if(S.pro>=PRO.length){S.year=1953;S.turn=PRO.length;startTurn()}else S.turn++},
  noticeNext(){S.notices.shift();nextNotice()},
  goal(k){S.goal=k||null;S.notices.shift();nextNotice()},
  genNext(){S.notices.shift();S.goalAskGen=S.curGen;const o=goalOptions();if(o.length)S.notices.push({kind:'goal',year:S.year,opts:o});S.afterNotice='seollal';nextNotice()},
  finale(){endGame('finale')},
  assign(pid,slot){const p=P(pid);if(p&&slotOK(p,slot)==='')p.slot=slot},
  springGo(){S.springM=S.money;S.springF=forecast().net*S.step;drawHand();S.phase='summer';S.banner=null},
  choose(i,ci){resolveCard(i,ci)},
  autoRest(){autoRest()},
  summerEnd(){if(S.hand.some(h=>!h.done))return;S.hand=[];simulate(S.step);S.phase='autumn'},
  autumnNext(){if(S.report)for(const b of S.report.births){const c=P(b.id);if(c){c.f.newborn=false;S.log.unshift({y:b.y,t:b.parents+' 부부에게 '+(c.sex==='m'?'아들':'딸')+' '+c.name+' 출생'})}}afterAutumn()},
  setName(pid,v){const c=P(pid);v=String(v||'').trim().slice(0,5);if(c&&v&&/^[가-힣]+$/.test(v))c.name=v},
  reName(pid){const c=P(pid);if(!c)return;for(let k=0;k<14;k++){const n=genName(c.sex,c.birth);if(n!==c.name&&!S.people.some(q=>q.alive&&q.name===n)){c.name=n;break}}},
  agenda(ai,k){runAgenda(ai,k)},
  seollalNext(){if(S.agendaStep)return;startTurn()},
  inhSet(k,v){inhToggle(k,v)},
  inhConfirm(){inhConfirm()},
  inhNext(){inhNext()},
  chooseRep(id){chooseRep(id)},
  endHun(k){S.hunPicked=k;META.clears++;if(!META.huns.includes(k))META.huns.push(k);for(const t of S.ending.titles)if(!META.titles.includes(t))META.titles.push(t);metaSave(META);try{localStorage.removeItem('jokbo-save5')}catch(e){}},
  newRun(){newGame({});S.phase='title'},
  autoGo(n){UI.auto=Object.assign({stopMajor:true,stopDeath:true},UI.auto||{},{on:true,until:n?S.year+n:null,stoppedAt:null});setTimeout(autoRun,50)},
  autoStop(){if(UI.auto)UI.auto.on=false;clearTimeout(autoTimer)},
  errClose(){UI.err=null},tab(t){UI.tab=t},treeBig(){UI.tree=!UI.tree},famAll(){UI.famAll=!UI.famAll},openP(id){UI.open=id},closeP(){UI.open=null},help(){UI.help=!UI.help}
};
if(IS_DOM){
  const app=document.getElementById('app');
  app.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
    const act=b.dataset.act,a=b.dataset.a,bb=b.dataset.b;const num=v=>v!==undefined&&v!==''&&!isNaN(v)?+v:v;
    if(!A[act])return;
    if(UI.auto&&UI.auto.on&&!['autoStop','autoGo','tab','openP','closeP','help','treeBig','famAll'].includes(act)){UI.auto.on=false;clearTimeout(autoTimer)}
    const pre=snap();try{A[act](num(a),num(bb))}catch(err){console.error(err);UI.err='처리 중 문제가 생겼다: '+err.message}UI.d=['tab','openP','closeP','help','treeBig','famAll'].includes(act)?UI.d:diffSnap(pre,snap());
    render();
    if(['noticeNext','goal','genNext','choose','springGo','summerEnd','autumnNext','seollalNext','proNext','inhNext','start','chooseRep','newRun','finale'].includes(act)){
      const st=document.querySelector('.stage')||app;if(st&&st.getBoundingClientRect().top<0)st.scrollIntoView({block:'start'})}
  });
  app.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.auto){UI.auto=Object.assign({stopMajor:true,stopDeath:true},UI.auto||{});UI.auto[el.dataset.auto]=el.checked;return}if(el.dataset&&el.dataset.name){A.setName(+el.dataset.name,el.value);render()}});
  app.addEventListener('keydown',e=>{const el=e.target;if(e.key==='Enter'&&el.dataset&&el.dataset.name)el.blur()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(UI.open||UI.help||UI.tree||UI.cloud)){if(UI.open)UI.open=null;else{UI.help=false;UI.tree=false;UI.cloud=false}render()}
    if(e.key==='Enter'&&UI.cloud&&e.target&&(e.target.id==='cl-pw'||e.target.id==='cl-email')&&typeof cloudAuth==='function')cloudAuth(CLOUD.mode)});
  const start=(data)=>{
    META=metaLoad();hasSave=!!load();
    if(data&&data.S){S=data.S;Object.assign(UI,data.UI||{});PRO=buildPro();migrate()}
    else{newGame({});S.phase='title'}
    render();
  };
  window.claude?.hot?.snapshot?.(()=>({S,UI}));
  window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
}
