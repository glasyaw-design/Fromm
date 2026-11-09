/* =====================================================================
   땅: 필지마다 종류·위치·쓰임이 다르다
   S.lands = [{kind, m(위치 값 배수), lease(세놓음), bld(건물), since}]
   S.land 는 필지 수(옛 코드와 맞추기 위해 늘 동기화)
   ===================================================================== */
const LAND_KINDS={
  farm:{name:'논밭',m:[.5,.9],lease:.035,desc:'세를 주면 해마다 소작료가 들어온다'},
  lot:{name:'집터',m:[.9,1.3],lease:.02,build:true,desc:'건물을 올릴 수 있다'},
  hill:{name:'산자락',m:[.25,.55],lease:.01,desc:'싸지만 잘 안 오른다. 개발되면 크게 뛴다'},
  road:{name:'길가 땅',m:[1.3,1.8],lease:.03,build:true,desc:'비싸지만 상가를 올리기 좋다'}
};
function landKindFor(y){const w=y<1975?{farm:5,lot:3,hill:3,road:1}:y<2000?{farm:2,lot:4,hill:2,road:2}:{farm:1,lot:4,hill:2,road:2};
  let t=0;for(const k in w)t+=w[k];let r=R()*t;for(const k in w){r-=w[k];if(r<=0)return k}return 'lot'}
const LAND_PY={farm:[600,1500],lot:[60,160],hill:[1500,6000],road:[80,220]};
const LAND_NM={farm:['아랫논','윗논','개울가 논','큰 밭','앞들 논','뒷밭','물꼬 논','신작로 옆 밭'],lot:['골목 안 집터','언덕배기 집터','우물가 집터','모퉁이 집터','시장 뒤 집터'],
  hill:['뒷산 자락','소나무 산','묏자리 산','고개 너머 산','바위 산비탈'],road:['신작로 땅','큰길가 땅','정류장 앞 땅','사거리 땅','버스길 땅']};
function landFill(p,place){if(!p.py){const [a,b]=LAND_PY[p.kind]||[100,300];const K=LAND_KINDS[p.kind];const t=(p.m-K.m[0])/Math.max(.01,K.m[1]-K.m[0]);p.py=Math.round((a+(b-a)*Math.max(0,Math.min(1,t)))/10)*10}
  if(!p.nm){const used=new Set((S.lands||[]).map(x=>x.nm));const L=(LAND_NM[p.kind]||['땅']).filter(n=>!used.has(n));p.nm=L.length?L[Math.floor(R()*L.length)]:(LAND_NM[p.kind]||['땅'])[0]+' '+((S.lands||[]).length+1)}
  if(!p.at)p.at=place||(S.place&&S.place.name)||'';return p}
function landSync(){S.lands=S.lands||[];for(const p of S.lands)landFill(p);S.land=S.lands.length}
function parcelVal(p,y){return landVal(y)*p.m}
function bldVal(y){return P_SHOP(y??S.year)*2.2}
function landTotal(y){S.lands=S.lands||[];return S.lands.reduce((a,p)=>a+parcelVal(p,y)+(p.bld?bldVal(y):0),0)}
function landAdd(kind,m){kind=kind||landKindFor(S.year);const K=LAND_KINDS[kind];S.lands=S.lands||[];
  const p={kind,m:m??(K.m[0]+R()*(K.m[1]-K.m[0])),lease:false,bld:false,since:S.year};landFill(p);p.paid=parcelVal(p);S.lands.push(p);landSync();return p}
function landRemove(idx){S.lands=S.lands||[];if(idx===undefined){if(!S.lands.length)return null;idx=S.lands.reduce((b,p,i)=>parcelVal(p)<parcelVal(S.lands[b])?i:b,0)}
  const p=S.lands.splice(idx,1)[0];landSync();return p}
function landDesc(p){return (p.nm?p.nm+' ':'')+(p.py?p.py.toLocaleString()+'평 ':'')+LAND_KINDS[p.kind].name+(p.bld?' + 상가 건물':'')+(p.lease&&!p.bld?' (세놓음)':'')}
function landRent(y){let v=0;for(const p of (S.lands||[])){if(p.bld)v+=bldVal(y)*.055;else if(p.lease)v+=parcelVal(p,y)*LAND_KINDS[p.kind].lease}return v}
function landOffers(){const n=2+(R()<.5?1:0);const L=[];for(let i=0;i<n;i++){const kind=landKindFor(S.year);const K=LAND_KINDS[kind];const m=K.m[0]+R()*(K.m[1]-K.m[0]);L.push({kind,m,price:landVal()*m*(1+.08*(S.land||0))})}return L}

/* 땅에 얽힌 일들 */
const LAND_CARDS=[
 {id:'l-rumor',slot:'시대',rep:true,y:[1962,2008],nb:'maxj',title:'개발 소문',text:'{nb}{nb:이/가} 귀띔한다. "저쪽 들판에 길이 난대. 지금 사 두면 몇 년 뒤 값이 확 뛸 거야."',
  ch:[{t:'한 필지 사 둔다',fx:{run:()=>{const p=landAdd(R()<.5?'hill':'farm');const c=parcelVal(p);S.money-=c;S.chains.push({id:'l-rumor2',at:S.year+ri(3,6),subj:null,nb:null});return '땅을 샀다 ('+sgW(-c)+')'}}},
      {t:'가진 땅을 지금 판다',fx:{run:()=>{if(!S.land)return '팔 땅이 없다';const p=landRemove();const v=parcelVal(p)*1.15;S.money+=v;return LAND_KINDS[p.kind].name+'을 소문 덕에 비싸게 팔았다 ('+sgW(v)+')'}}},
      {t:'소문은 소문일 뿐이다',fx:{}}]},
 {id:'l-rumor2',slot:'시대',chainOnly:true,major:true,title:'그 소문의 끝',text:'몇 년 전 들었던 개발 소문이 어떻게 됐는지 알려졌다.',
  ch:[{t:'결과를 듣는다',fx:{run:()=>{const r=R();const L=(S.lands||[]).filter(p=>S.year-p.since<=7);if(!L.length)return '그 땅은 이미 팔았다';
     if(r<.45){for(const p of L)p.m*=1.9;S.face=clamp(S.face+1,0,100);return '정말로 길이 났다! 그 땅값이 두 배 가까이 뛰었다'}
     if(r<.75){for(const p of L)p.m*=1.15;return '길은 났지만 조금 비켜 갔다. 땅값이 조금 올랐다'}
     for(const p of L)p.m*=.75;return '헛소문이었다. 땅값이 오히려 떨어졌다'}}}]},
 {id:'l-expro',slot:'시대',major:true,rep:true,y:[1968,2035],cond:()=>S.land>=1,title:()=>S.year<1990?'도로가 난다':'공공 개발 수용',text:'우리 땅 한 필지가 '+'공공 사업 부지에 들어갔다. 보상금이 나온다.',
  ch:[{t:'보상금을 받고 내준다',fx:{run:()=>{const p=landRemove(S.lands.reduce((b,q,i)=>q.m>S.lands[b].m?i:b,0));const v=parcelVal(p)*(.9+R()*.4);S.money+=v;return LAND_KINDS[p.kind].name+' 보상금 '+sgW(v)}}},
      {t:'보상금이 적다며 버틴다',fx:{run:()=>{const i=0;const p=S.lands[i];if(R()<.45){const q=landRemove(i);const v=parcelVal(q)*1.5;S.money+=v;return '버틴 끝에 보상금을 더 받았다 ('+sgW(v)+')'}const q=landRemove(i);const v=parcelVal(q)*.8;S.money+=v;S.face=clamp(S.face-1,0,100);return '강제 수용됐다. 보상금이 깎였다 ('+sgW(v)+')'}}},
      {t:'대토(다른 땅)로 받는다',fx:{run:()=>{const p=landRemove(0);landAdd('lot');return LAND_KINDS[p.kind].name+' 대신 집터 한 필지를 받았다'}}}]},
 {id:'l-border',slot:'동네',y:[1955,2060],nb:'any',cond:()=>S.land>=1,title:'땅 경계',text:'{nb}{nb:과/와} 땅 경계를 두고 말이 나왔다. 울타리가 한 뼘 우리 쪽으로 들어와 있다.',
  ch:[{t:'한 뼘쯤 양보한다',fx:{nbj:3,ledger:'땅 경계를 양보함'}},{t:'측량을 다시 해 따진다 (3)',need:{money:3},fx:{money:-3,nbj:-3,ledger:'땅 경계로 다툼'}},{t:'반씩 나누자고 한다',fx:{nbj:1,ledger:'땅 경계를 반씩 나눔'}}]},
 {id:'l-tenant',slot:'동네',y:[1953,1985],nb:'any',cond:()=>(S.lands||[]).some(p=>p.kind==='farm'&&!p.lease),title:'소작 부탁',text:'{nb}{nb:이/가} 우리 논밭을 부쳐 먹게 해 달라고 한다.',
  ch:[{t:'소작료를 받고 맡긴다',fx:{nbj:2,ledger:'우리 논밭을 소작으로 맡김',run:()=>{const p=S.lands.find(p=>p.kind==='farm'&&!p.lease);p.lease=true;return '논밭을 세놓았다. 해마다 소작료가 들어온다'}}},
      {t:'소작료를 낮춰 준다',fx:{nbj:4,ledger:'소작료를 낮춰 줌',run:()=>{const p=S.lands.find(p=>p.kind==='farm'&&!p.lease);p.lease=true;p.m*=.9;return '싸게 세놓았다'}}},
      {t:'우리가 짓겠다',fx:{nbj:-1}}]},
 {id:'l-boom',slot:'시대',rep:true,y:[1977,1991],title:'떴다방',text:'동네에 부동산 바람이 분다. 복덕방 앞에 사람들이 줄을 섰다. "웃돈 얹어 줄 테니 땅 파시오!"',
  ch:[{t:'웃돈 받고 판다',fx:{run:()=>{if(!S.land)return '팔 땅이 없다';const p=landRemove(S.lands.reduce((b,q,i)=>q.m>S.lands[b].m?i:b,0));const v=parcelVal(p)*1.35;S.money+=v;return '웃돈을 받고 팔았다 ('+sgW(v)+')'}}},
      {t:'빚을 내서라도 더 산다',fx:{run:()=>{const p=landAdd();const c=parcelVal(p)*1.25;S.money-=c;S.chains.push({id:'l-bust',at:S.year+ri(2,5),subj:null,nb:null});return '웃돈을 주고 땅을 샀다 ('+sgW(-c)+')'}}},
      {t:'바람에 휩쓸리지 않는다',fx:{gap:{f:-1}}}]},
 {id:'l-bust',slot:'시대',chainOnly:true,title:'바람이 지나간 뒤',text:'부동산 바람이 잦아들었다. 웃돈 주고 산 땅은 어떻게 됐을까.',
  ch:[{t:'시세를 알아본다',fx:{run:()=>{const L=(S.lands||[]).filter(p=>S.year-p.since<=6);if(R()<.55){for(const p of L)p.m*=1.3;return '그래도 올랐다'}for(const p of L)p.m*=.8;return '거품이 빠져 값이 떨어졌다'}}}]},
 {id:'l-scam',slot:'시대',y:[1998,2025],cond:()=>S.money>cm(20),title:'싸게 나온 땅',text:'"개발 예정지를 쪼개서 싸게 드립니다." 전화로 땅을 권하는 사람이 있다. 지도에 동그라미가 쳐져 있다.',
  ch:[{t:'한 필지 산다 (20)',need:{money:20},fx:{money:-20,run:()=>{if(R()<.7){landAdd('hill',.08);return '알고 보니 길도 없는 산비탈이었다. 사기였다'}landAdd('hill',.6);return '다행히 쓸 만한 땅이었다'}}},
      {t:'직접 가 보고 정한다',fx:{run:()=>'가 보니 길도 없는 산비탈이었다. 사지 않았다'}},
      {t:'전화를 끊는다',fx:{}}]},
 {id:'l-shoprent',slot:'집안',rep:true,y:[1985,2075],cond:()=>(S.lands||[]).some(p=>p.bld),title:'세입자의 사정',text:()=>'우리 상가 건물 세입자가 장사가 안 된다며 '+(S.year<2010?'월세를':'임대료를')+' 깎아 달라고 한다.',
  ch:[{t:'반년 치를 깎아 준다',fx:{run:()=>{const v=bldVal()*.025;S.money-=v;S.repu=clamp(S.repu+3,0,100);for(const n of S.nbs)n.j=clamp(n.j+1,-20,20);return '세를 깎아 주었다 ('+sgW(-v)+'). 동네에 착한 건물주 소문이 났다'}}},
      {t:'계약대로 받는다',fx:{run:()=>{if(R()<.35){const p=S.lands.find(p=>p.bld);p.vacant=S.year;return '세입자가 나갔다. 한동안 비어 있다'}return '세입자가 버티며 냈다'}}},
      {t:'다른 세입자를 찾는다',fx:{run:()=>{const v=bldVal()*.01;S.money-=v;return '중개 수수료를 내고 새 세입자를 들였다 ('+sgW(-v)+')'}}}]},
 {id:'l-tax',slot:'시대',rep:true,y:[2005,2075],cond:()=>S.land>=3,title:'땅 세금',text:'땅을 여러 필지 가진 집에 무거운 세금 고지서가 날아왔다.',
  ch:[{t:'낸다',fx:{run:()=>{const v=landTotal()*.012;S.money-=v;return '세금 '+sgW(-v)}}},
      {t:'한 필지를 팔아 정리한다',fx:{run:()=>{const p=landRemove();const v=parcelVal(p)*.95;S.money+=v;return LAND_KINDS[p.kind].name+'을 팔았다 ('+sgW(v)+')'}}}]},
 {id:'l-sib',slot:'가족',awayOK:true,who:'sib',cond:()=>S.land>=2,y:[1960,2075],title:'땅 좀 나누자',text:'따로 사는 형제 {subj}{subj:이/가} 부모님 땅이니 한 필지는 자기 몫이라고 한다.',
  ch:[{t:'한 필지를 떼어 준다',fx:{aff:4,grudge:-3,run:()=>{const p=landRemove();return LAND_KINDS[p.kind].name+' 한 필지를 형제에게 넘겼다'}}},
      {t:'판 돈을 나눠 준다',fx:{aff:2,grudge:-1,run:()=>{const p=landRemove();const v=parcelVal(p)*.95;S.money+=v/2;return '땅을 팔아 절반을 나눠 주었다 ('+sgW(v/2)+' 남음)'}}},
      {t:'거절한다',fx:{aff:-3,grudge:2}}]},
 {id:'l-loan',slot:'집안',rep:true,y:[1972,2075],cond:()=>S.land>=1&&S.money<cm(15),title:'땅 담보',text:'은행에서 땅을 담보로 돈을 빌려주겠다고 한다. 장사 밑천이 될 수도, 빚 수렁이 될 수도 있다.',
  ch:[{t:'빌린다',fx:{run:()=>{const v=landTotal()*.35;S.money+=v;S.landDebt=(S.landDebt||0)+v;S.chains.push({id:'l-loan2',at:S.year+5,subj:null,nb:null});return '땅 담보로 '+wonY(v)+'을 빌렸다'}}},{t:'땅은 건드리지 않는다',fx:{}}]},
 {id:'l-loan2',slot:'집안',chainOnly:true,title:'담보 대출 만기',text:'땅 담보로 빌린 돈의 만기가 돌아왔다.',
  ch:[{t:'갚는다',fx:{run:()=>{const v=(S.landDebt||0)*1.35;S.money-=v;S.landDebt=0;return '이자까지 갚았다 ('+sgW(-v)+')'}}},
      {t:'갚을 돈이 없으면 땅을 넘긴다',fx:{run:()=>{const v=(S.landDebt||0)*1.35;if(S.money>=v){S.money-=v;S.landDebt=0;return '다행히 갚았다 ('+sgW(-v)+')'}const p=landRemove();S.landDebt=0;return LAND_KINDS[p.kind].name+'을 은행에 넘겼다'}}}]},
 {id:'l-garden',slot:'동네',y:[2035,2075],cond:()=>(S.lands||[]).some(p=>!p.bld),nb:'any',title:'빈 땅의 쓰임',text:'놀고 있는 우리 땅을 동네 텃밭이나 쉼터로 쓰자는 이야기가 나왔다.',
  ch:[{t:'동네에 내준다',fx:{jAll:2,run:()=>{routeAdd('jeong',4);routeAdd('root',1);return '빈 땅이 동네 텃밭이 됐다'}}},{t:'세를 받고 빌려준다',fx:{run:()=>{const p=S.lands.find(p=>!p.bld);p.lease=true;return '땅을 세놓았다'}}},{t:'그냥 둔다',fx:{}}]},
 {id:'l-inherit',slot:'시대',rep:true,y:[1953,2075],cond:()=>R()<.25,title:'싸게 나온 땅',text:'급하게 이사 가는 집이 땅을 싸게 내놓았다.',
  ch:[{t:'산다',fx:{run:()=>{const p=landAdd();const c=parcelVal(p)*.8;if(S.money<c){landRemove(S.lands.length-1);return '돈이 모자라 사지 못했다'}S.money-=c;return LAND_KINDS[p.kind].name+' 한 필지를 싸게 샀다 ('+sgW(-c)+')'}}},{t:'남의 급한 사정을 이용하지 않는다',fx:{gap:{f:-1}}}]}
];
