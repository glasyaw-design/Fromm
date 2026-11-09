/* =====================================================================
   족보 없는 집 — 게임 본체
   ===================================================================== */
const IS_DOM = typeof document !== 'undefined';
const R = Math.random;
const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
const pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sg=v=>{v=Math.round(v*10)/10;return v>0?'+'+v:'−'+Math.abs(v)};
function josa(w,pair){w=String(w||'');const [a,b]=pair.split('/');const c=w.charCodeAt(w.length-1)-0xAC00;const has=c>=0&&c<=11171&&c%28!==0;
  if(pair==='으로/로')return has&&c%28!==8?a:b;return has?a:b}

const SURN=['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','홍','전','고','문','양','손','배','백','허','남','노'];
const NAMES={
  m1:['막동','덕수','만석','순돌','기남','춘식','용팔','수길','봉구','창수','태복','갑석'],
  f1:['말순','정자','순이','옥분','복례','끝순','영자','분이','점례','귀남','금순','춘자'],
  m2:['영수','영철','정호','상철','성수','진호','동욱','재원','종훈','광수','병철','용호','명수','길수'],
  f2:['정숙','영희','미숙','경자','순자','명숙','혜숙','은주','미경','순희','현숙','영미','옥희','경희'],
  m3:['성민','지훈','현우','준호','상우','민수','동현','재훈','성진','태호','정훈','상현'],
  f3:['은정','미영','지영','수진','은영','혜진','선영','지은','미란','소영','지혜','수정'],
  m4:['민준','서준','도윤','예준','시우','주원','지호','건우','현준','유준'],
  f4:['서연','지우','서윤','하은','민서','수아','지민','채원','예은','다은'],
  m5:['이안','도하','시온','로운','한결','이준','하준','은호','윤우','태오'],
  f5:['이서','하린','아린','윤슬','다온','서아','하윤','로아','시아','라온']
};
function genName(sex,birth){const k=birth<1940?'1':birth<1965?'2':birth<1990?'3':birth<2015?'4':'5';return pick(NAMES[(sex==='m'?'m':'f')+k])}

const TALENTS=['셈','손재주','글','말솜씨','몸','끈기','눈썰미','마음씨'];
const TAL_DESC={셈:'장사·돈 계산',손재주:'기술·공장 일',글:'공부·직장',말솜씨:'장사·이웃 사귀기',몸:'힘쓰는 일·건강',끈기:'능력치가 크는 속도',눈썰미:'장사 수완·소문 가려듣기',마음씨:'정 쌓기·돌봄'};
const PERS=['성실','사교','모험','온화','고집'];
const PERS_DESC={성실:'능력치가 빨리 큰다',사교:'품앗이·이웃 정이 잘 쌓인다',모험:'집을 떠나기 쉽다',온화:'원한이 덜 쌓인다',고집:'뜻대로 안 되면 원한이 더 쌓인다'};
const DESIRES=['출세','부','안정','자유','사랑','인정'];
const DESIRE_HINT={출세:'책을 붙들고 있는 날이 많다',부:'동전을 모으는 걸 좋아한다',안정:'변하는 걸 싫어한다',자유:'자꾸 집 밖으로 나돈다',사랑:'동생들을 잘 챙긴다',인정:'칭찬받으면 하루 종일 웃는다'};
const ALIGN={출세:['study'],부:['trade'],안정:['craft','home'],자유:['rest','trade'],사랑:['home','rest','care'],인정:['help','study','care']};
const TRAITS=['고집','순종','야심','다정','질투','낙천','소심'];
const SLOT_ORDER=['trade','craft','study','care','help','home','rest'];

let S=null;
const UI={tab:'family',d:null,open:null,help:false};

/* ===================== 돈과 물가 =====================
   내부 돈은 실질 단위(1 = 1978년 돈 2만 6천 원). 화면에는 그해 물가로 바꾼 원화와,
   지금(2026년) 돈으로 환산한 값을 함께 보여 준다. 물가지수는 1978년 = 100.
   소비자물가지수(2020=100) 근사치. 1962년 전은 환(10환 = 1원). */
const CPI=[[1950,.12],[1953,.35],[1955,.6],[1957,.85],[1960,1.15],[1962,1.35],[1965,3.04],[1967,3.6],[1970,5.05],[1972,6.3],[1975,9.46],[1976,10.9],[1977,12.0],[1978,13.75],[1979,16.3],[1980,20.95],[1982,26.0],[1985,28.8],[1988,32.5],[1990,38.0],[1992,45.1],[1995,52.0],[1997,57.7],[1998,62.2],[2000,63.2],[2005,75.1],[2008,82.4],[2010,87.0],[2015,94.9],[2020,100],[2022,107.7],[2024,113.7],[2026,118.9]];
function interp(T,y){if(y<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++){const [y1,v1]=T[i],[y0,v0]=T[i-1];if(y<=y1)return v0+(v1-v0)*(y-y0)/(y1-y0)}return T[T.length-1][1]}
function cpi(y){if(y>2026)return 118.9*Math.pow(1.02,y-2026);return interp(CPI,y)}
const UNIT78=26000;
function priceIdx(y){return Math.round(cpi(y)/cpi(1978)*1000)/10}
function inflation(y){return cpi(y+1)/cpi(y)-1}
/* 실질 소득 수준: 시대가 지날수록 벌이와 생활비가 함께 커진다 */
const PROD=[[1950,1],[1960,1.2],[1970,1.75],[1980,2.4],[1987,3.4],[1995,7.6],[2000,8.4],[2010,8.6],[2020,9.2],[2030,9.6],[2050,10],[2075,10.4]];
function prod(y){return interp(PROD,y)}
function ms(y){return Math.pow(prod(y??S.year),.85)}  // 사건 돈 크기 보정
const SAV=[[1950,.06],[1955,.1],[1965,.24],[1972,.16],[1980,.18],[1982,.1],[1990,.09],[1997,.12],[1999,.06],[2005,.04],[2010,.03],[2016,.016],[2023,.035],[2030,.025]];
function savRate(y){return Math.min(interp(SAV,y),Math.max(0,inflation(y))+.02)}
function fmtWon(n,cur){cur=cur||'원';const neg=n<0;n=Math.abs(n);let s;
  if(n>=1e8){const e=Math.floor(n/1e8),m=Math.round((n%1e8)/1e4);s=e.toLocaleString('ko-KR')+'억'+(m?' '+m.toLocaleString('ko-KR')+'만':'')+' '+cur}
  else if(n>=1e4)s=Math.round(n/1e4).toLocaleString('ko-KR')+'만 '+cur;
  else s=(Math.round(n/10)*10).toLocaleString('ko-KR')+cur;
  return (neg?'−':'')+s}
function nominal(u,y){return u*UNIT78*cpi(y)/cpi(1978)}
function wonY(u,y){y=y??S.year;const hw=y<1962;return fmtWon(Math.abs(nominal(u,y))*(hw?10:1),hw?'환':'원')}
function wonNow(u){return fmtWon(Math.abs(u)*UNIT78*cpi(2026)/cpi(1978))}
function wonBoth(u,y){return wonY(u,y)+' (지금 돈 '+wonNow(u)+')'}
function sgW(u,y){return (u>=0?'+':'−')+wonY(u,y)}
/* 카드의 돈: 작은 지출은 덜, 큰 지출은 소득만큼 커지게. 2010년 기준 생일상(2)≈40만 원, 잔치(10)≈500만 원, 결혼식(20)≈1,500만 원 */
function msC(y){return Math.pow(prod(y??S.year),.7)}
function cm(u,y){const a=Math.abs(u);const f=a>=20?a:a*Math.pow(a/20,.6);return Math.sign(u)*f*msC(y)}
function moneyText(t){return String(t).replace(/\((\d+)\)/g,(m,n)=>'('+wonY(cm(+n))+')').replace(/, (\d+)\)/g,(m,n)=>', '+wonY(cm(+n))+')')}

/* ===================== 동네와 이사 ===================== */
const TOWNS={
  seoul:{name:'버드내',full:'서울 변두리 판자촌 버드내',trade:1,craft:1,land:1.3,unlock:0,desc:'땅값이 가장 많이 오른다'},
  busan:{name:'국제시장 골목',full:'부산 국제시장 뒷골목',trade:1.2,craft:.95,land:1,unlock:1,desc:'장사 수입 +20%'},
  factory:{name:'공단 마을',full:'공단 옆 노동자 마을',trade:.95,craft:1.2,land:.85,unlock:2,desc:'기술 수입 +20%'},
  port:{name:'항구 마을',full:'남쪽 항구 마을',trade:1.05,craft:1,land:.75,abroad:1.6,unlock:3,desc:'해외로 나갈 기회가 많다'}
};
const MOVES={
  gangnam:{name:'강 건너 새 아파트 단지',y:[1976,1999],cost:140,face:4,land:1.8,trade:.85,craft:1,house:'apt',kind:'apt',desc:'체면과 집값이 오르지만 옛 이웃과 단골을 잃는다'},
  newtown:{name:'신도시 아파트',y:[1991,2035],cost:90,face:2,land:1.2,trade:.9,craft:1,house:'apt',kind:'apt',desc:'넓은 집. 장사는 처음부터 다시'},
  rural:{name:'시골 마을',y:[1995,2110],cost:-30,face:-1,land:.5,trade:.7,craft:.8,house:'own',kind:'rural',desc:'집을 팔고 내려가 돈이 남는다. 벌이는 줄지만 이웃 정이 깊다'},
  back:{name:'옛 동네',y:[1960,2110],cost:30,face:0,house:'own',kind:'origin',desc:'떠났던 동네로 돌아간다. 옛 이웃이 남아 있을 수도 있다'}
};
const NB_ROLES={
  tobagi:{ch:'T',sex:'m',t:[[0,'토박이 소작농'],[1970,'땅을 지킨 집'],[1985,'땅 부자'],[1995,'재개발 조합장 집'],[2010,'상가 건물주'],[2035,'기록관에 땅을 내놓은 집']]},
  pirani:{ch:'P',sex:'m',t:[[0,'같은 배 피란민'],[1965,'시장 상인'],[1980,'도매상'],[1998,'부도 뒤 재기 중인 집'],[2015,'배달 창업 집'],[2035,'로봇 배달 거점']]},
  gwabu:{ch:'G',sex:'f',t:[[0,'과부와 자식 셋'],[1975,'아들이 은행원인 집'],[1995,'지점장 집'],[2015,'공무원 손녀 집'],[2035,'복지관장 집']]},
  yangban:{ch:'Y',sex:'m',t:[[0,'몰락한 양반 집'],[1965,'교사 집'],[1985,'교수 집안'],[2005,'자녀가 유학 간 집'],[2040,'귀국한 연구자 집']]},
  smith:{ch:'D',sex:'m',t:[[0,'대장간'],[1968,'작은 공장 집'],[1985,'공장 사장 집'],[1998,'구조조정 겪은 집'],[2015,'IT 창업 손자 집'],[2035,'로봇 정비 공장']]},
  jumak:{ch:'J',sex:'f',t:[[0,'주막 겸 복덕방'],[1975,'부동산 중개소'],[1995,'재개발 브로커 집'],[2015,'동네 소식 채널 집'],[2040,'동네 아카이브 집']]}
};
const NEW_NB=[[1950,['피란 온 새 이웃','행상 집']],[1975,['상경한 새 이웃','셋방 사는 신혼부부']],[1990,['아파트 입주민','맞벌이 부부']],[2000,['이주민 가족','원룸 청년']],[2012,['젊은 카페 사장','1인 가구 청년']],[2030,['은퇴한 귀향 부부','이주민 노동자 가족']],[2050,['돌봄 공동체 식구','젊은 이주 가족']]];
function nbTitle(n){if(n.custom)return n.custom;const T=NB_ROLES[n.role]?NB_ROLES[n.role].t:[[0,'이웃']];let t=T[0][1];for(const [y,s] of T)if(S.year>=y)t=s;return t}
function placeName(){return S.place.name}
function jeongPow(y){return y<1980?1:y<1990?.9:y<2000?.8:y<2010?.6:y<2025?.45:y<2035?.6:y<2045?.75:.85}

/* ===================== 사람 ===================== */
function age(p,y){return (y??S.year)-p.birth}
function P(id){return S.people.find(p=>p.id===id)}
function rep(){return P(S.repId)}
function nbName(n){return n.sur+'씨네'}
function NB(role){return S.nbs.find(n=>n.role===role)}
function homeAlive(){return S.people.filter(p=>p.alive&&p.status==='home')}
function blood(p){return !p.inlaw}

function pickTraits(){
  const w={고집:1,순종:1,야심:1,다정:1,질투:1,낙천:1,소심:1};const g=S.gap;
  if(g.s>2){w.순종+=2;w.고집+=1}if(g.s<-2){w.다정+=2;w.낙천+=1}
  if(g.f>2){w.야심+=2;w.질투+=1}if(g.f<-2){w.낙천+=1}if(g.d>2){w.고집+=1}
  const out=[];while(out.length<2){let tot=0;for(const k in w)if(!out.includes(k))tot+=w[k];let r=R()*tot;
    for(const k in w){if(out.includes(k))continue;r-=w[k];if(r<=0){out.push(k);break}}}
  return out;
}
function mkPerson(o){
  let nm=o.name;if(!nm){for(let k=0;k<14;k++){nm=genName(o.sex,o.birth);if(!S.people.some(q=>q.alive&&q.name===nm))break}}
  const p={id:S.nid++,name:nm,sex:o.sex,birth:o.birth,gen:o.gen,alive:true,death:null,status:'home',away:null,spouse:null,
    parents:o.parents||[],inlaw:!!o.inlaw,sur:o.sur||S.sur,tal:{},cap:{},pers:{},desire:pick(DESIRES),traits:[],
    aff:o.aff??2,grudge:0,slot:'rest',edu:o.edu||0,sy:{e:0,m:0,c:0},f:{},recs:[],mis:0,affAcc:0,hist:{},grow:{}};
  const gift=pick(TALENTS),gift2=pick(TALENTS.filter(t=>t!==gift));const g=S.gap;
  for(const t of TALENTS){let cap=ri(40,90)/10;if(t===gift)cap=ri(88,100)/10;else if(t===gift2)cap=ri(70,98)/10;
    if(t==='몸'&&g.d>2)cap+=.8;if(t==='글'&&g.s>2)cap+=.8;if(t==='마음씨'&&g.s<-2)cap+=.8;if(t==='끈기'&&g.d>2)cap+=.8;
    if(S.hun==='study'&&t==='글')cap+=1;
    cap=Math.min(10,cap);p.cap[t]=cap;
    p.tal[t]=o.adult?Math.min(cap,ri(15,50)/10+(t===gift?ri(10,25)/10:0)):Math.min(cap,ri(0,12)/10)}
  for(const k of PERS)p.pers[k]=ri(15,85)/10;
  p.pers.성실=clamp(p.pers.성실+Math.sign(g.d)*Math.min(2,Math.abs(g.d)),0,10);
  p.pers.온화=clamp(p.pers.온화-Math.sign(g.s)*Math.min(2,Math.abs(g.s)),0,10);
  p.pers.사교=clamp(p.pers.사교+(g.f>2?1:0),0,10);
  p.traits=pickTraits();
  if(o.adult){p.f.desireKnown=true;p.f.adultSet=true}
  S.people.push(p);return p;
}
function pt(v){return Math.round((v||0)*10)}
function relLabel(p){
  if(p.id===S.repId)return '대표';
  const r=rep();if(r&&p.id===r.spouse)return '배우자';
  const d=p.gen-(r?r.gen:S.curGen);
  if(p.inlaw)return d>=1?(p.sex==='f'?'며느리':'사위'):d<=-1?'윗대 어른':'형제의 짝';
  if(d<=-1)return '어른';if(d===0)return '형제';if(d===1)return '자녀';if(d===2)return '손주';if(d>=3)return '증손';return '가족';
}
/* 아이 능력치는 자라면서 보인다: 4살 전 ?, 4~9살 범위(±2), 10~15살 범위(±1), 16살부터 정확한 값 */
function revealTal(p,k){const a=age(p);const v=pt(p.tal[k]);if(p.inlaw||a>=16)return {lo:v,hi:v,txt:String(v)};
  if(a<4)return {lo:0,hi:100,txt:'?'};const w=a<10?20:10;const lo=Math.max(0,Math.floor((v-w)/5)*5),hi=Math.min(100,Math.ceil((v+w)/5)*5);return {lo,hi,txt:lo+'~'+hi}}
function revealCap(p,k){const a=age(p);if(p.inlaw||a>=16)return String(pt(p.cap[k]));if(a<10)return '';return p.cap[k]>=8?'상':p.cap[k]>=5.5?'중':'하'}
function revealPers(p,k){const a=age(p);const v=pt(p.pers[k]);if(p.inlaw||a>=13)return {lo:v,hi:v,txt:String(v)};if(a<6)return {lo:0,hi:100,txt:'?'};
  const lo=Math.max(0,Math.floor((v-20)/5)*5),hi=Math.min(100,Math.ceil((v+20)/5)*5);return {lo,hi,txt:lo+'~'+hi}}

/* ===================== 일과 수입 ===================== */
const ERA_MULT=[[1950,{trade:1.3,craft:1.0,study:.6,care:.6}],[1960,{trade:1.2,craft:1.3,study:1.0,care:.7}],[1980,{trade:1.1,craft:1.1,study:1.3,care:.8}],
  [1990,{trade:.85,craft:.85,study:1.2,care:.9}],[2000,{trade:1.0,craft:1.1,study:1.05,care:.95}],[2010,{trade:1.0,craft:1.0,study:.95,care:1.0}],
  [2030,{trade:.9,craft:1.12,study:.9,care:1.2}],[2040,{trade:1.0,craft:1.1,study:1.0,care:1.2}],[2050,{trade:.95,craft:1.0,study:.95,care:1.2}]];
function eraMult(path,y){let m=ERA_MULT[0][1];for(const [yy,v] of ERA_MULT)if(y>=yy)m=v;return m[path]??1}
function modMult(k,y){let m=1;for(const md of S.mods)if(md.k===k&&md.until>=y)m*=md.m;return m}
function placeMult(k){const pl=S.place;let m=pl[k]??1;if(S.loc==='market'&&k==='trade')m*=1.1;if(S.loc==='factory'&&k==='craft')m*=1.1;if(S.loc==='school'&&k==='study')m*=1.1;return m}
function liveF(y){return prod(y)*.68}
/* 예체능 꿈 */
const ARTS={
 음악:{tal:'손재주',lesson:y=>y<1975?'풍금·노래 교습':y<2010?'피아노 학원':'음악 학원',school:y=>y<1970?'음악 학교':'예술고',job:(a,y)=>a<40?'음악가':'음악 선생',dream:'음악'},
 미술:{tal:'손재주',lesson:y=>y<1975?'그림 교습':y<2010?'미술 학원':'미술·디자인 학원',school:y=>y<1970?'미술 학교':'예술고',job:(a,y)=>y<2000?'화가':a<40?'디자이너':'화가',dream:'그림'},
 운동:{tal:'몸',lesson:y=>y<1975?'동네 운동부':y<2010?'태권도장·운동부':'스포츠 클럽',school:y=>'체육 특기생',job:(a,y)=>a<34?'운동선수':'코치',dream:'운동'},
 연기:{tal:'말솜씨',lesson:y=>y<1975?'웅변·노래 교습':y<2010?'연기·노래 학원':'연기·보컬 학원',school:y=>y<1990?'연극 학교':'예술고',job:(a,y)=>y<2000?'배우':a<35?'배우·가수':'연기 선생',dream:'노래와 연기'}};
function artsKindFor(p){const c=[['음악',p.tal.손재주+R()*3],['미술',p.tal.손재주+p.tal.눈썰미*.5+R()*3-2],['운동',p.tal.몸+R()*3],['연기',p.tal.말솜씨+R()*3]].sort((a,b)=>b[1]-a[1]);return c[0][0]}
/* 장사 업종: 벌이 수준(m), 해마다 기복(v), 중요한 재주(w), 시대(y) */
const BIZ={
 stall:{n:y=>y<1962?'좌판 행상':'노점',y:[1950,1975],m:.9,v:.9,w:{셈:.9,말솜씨:1,눈썰미:.5},big:'시장 도매',d:'밑천이 적게 든다. 벌이는 적다'},
 rice:{n:y=>y<1990?'쌀가게':'쌀·잡곡 가게',y:[1953,2005],m:.95,v:.55,w:{셈:1.1,말솜씨:.6,눈썰미:.5},big:'양곡 도매상',d:'벌이가 고르다. 크게 남지는 않는다'},
 food:{n:y=>y<1975?'국밥집':y<2000?'식당':'밥집',y:[1950,2110],m:1,v:1,w:{셈:.6,말솜씨:.7,손재주:.8},big:'음식점 여러 곳',d:'손맛(손재주)이 벌이를 좌우한다'},
 cloth:{n:y=>y<1975?'포목점':y<2005?'옷가게':'옷 가게',y:[1955,2110],m:1.05,v:1.3,w:{셈:.7,말솜씨:.7,눈썰미:1},big:'의류 도매',d:'유행을 잘 보면(눈썰미) 크게 번다. 기복이 크다'},
 hard:{n:y=>'철물점',y:[1958,2030],m:.95,v:.7,w:{셈:.8,손재주:.8,눈썰미:.5},big:'건자재 도매',d:'꾸준하다. 집 짓는 시절에 잘된다'},
 store:{n:y=>y<1980?'구멍가게':y<1995?'슈퍼마켓':y<2040?'편의점':'무인 상점',y:[1955,2110],m:.9,v:.5,w:{셈:1,말솜씨:.6,눈썰미:.5},big:'유통 회사',d:'벌이가 고르지만 적다. 오래 문을 열어야 한다'},
 radio:{n:y=>y<1980?'전파사':y<2010?'전자 대리점':'전자 수리점',y:[1965,2030],m:1.1,v:1.1,w:{셈:.7,손재주:1,눈썰미:.5},big:'전자 유통',d:'손재주가 있어야 한다. 새 물건이 나올 때 잘된다'},
 bakery:{n:y=>y<2000?'제과점':'카페',y:[1975,2110],m:1.05,v:1.2,w:{손재주:.9,말솜씨:.6,눈썰미:.7},big:'프랜차이즈 본사',d:'동네 단골이 중요하다. 문 닫는 집도 많다'},
 video:{n:y=>y<1998?'비디오 가게':'PC방',y:[1985,2014],m:1.15,v:1.4,w:{셈:.8,말솜씨:.5,눈썰미:.9},big:'체인 사업',d:'유행 장사다. 반짝 벌고 금세 저문다'},
 chicken:{n:y=>'치킨집',y:[1985,2110],m:1,v:1.3,w:{셈:.7,말솜씨:.7,손재주:.6},big:'치킨 체인',d:'누구나 하는 장사다. 경쟁이 세다'},
 online:{n:y=>y<2030?'온라인 쇼핑몰':'가상 상점',y:[2003,2110],m:1.1,v:1.6,w:{셈:.6,눈썰미:1.1,글:.5},big:'유통 플랫폼',d:'잘 팔리면 크게 벌고, 안 되면 바닥이다'}};
function bizOf(){return BIZ[S.biz]||BIZ.stall}
function bizFade(y){y=y??S.year;const b=bizOf();return y>b.y[1]?Math.max(.5,1-.06*(y-b.y[1])):1}
function bizCost(){return cm(6)*[1,1.8,3][S.tradeSt-1]}
function pickN(a,n){a=a.slice();const o=[];while(a.length&&o.length<n)o.push(a.splice(Math.floor(R()*a.length),1)[0]);return o}
function bizChoices(){const y=S.year;return Object.keys(BIZ).filter(k=>k!==S.biz&&y>=BIZ[k].y[0]&&y<=BIZ[k].y[1]-3&&k!=='stall')}
function slotLabel(p,slot,y){
  y=y??S.year;const a=age(p,y);
  if(p.f&&p.f.job&&p.f.jobSlot===slot&&slot!=='home'&&!(slot==='trade'&&S.tradeSt>=2)&&!(slot==='craft'&&S.craftSt>=3)&&a<65)return p.f.job;
  if(slot==='trade'){const b=bizOf();if(S.tradeSt>=3)return b.big;if(S.biz==='stall'||!S.biz)return S.tradeSt===2?(y<2000?'점포':'가게'):b.n(y);return b.n(y)+(S.tradeSt===2&&S.biz!=='stall'?'':'')}
  if(slot==='craft'){if(S.craftSt===1)return y<1980?'공장 일':y<2000?'생산직':y<2030?'기술직':'로봇 정비';if(S.craftSt===2)return y<2000?'기능공':'숙련 기술자';return y<2000?'우리 공장':'기술 회사'}
  if(slot==='study'){if(a<=13)return y<1996?'국민학교':'초등학교';if(a<=19)return p.f.artsPro?ARTS[p.f.dream].school(y):p.f.voc?(y<1990?'공업고등학교':'특성화고'):'중·고교';
    if(p.f.artsPro&&p.f.dream&&!(p.f.college&&p.edu<3&&a<=26))return ARTS[p.f.dream].job(a,y);
    if(p.f.college&&p.edu<3&&a<=26)return '대학';if(p.f.exam)return EXAMS[p.f.exam]?EXAMS[p.f.exam].n(y)+' 준비':'시험 공부';if(p.edu>=3)return p.f.official?'공직':'회사';if(p.edu>=2)return '사무 일';return '시험 공부'}
  if(slot==='care')return y<2025?'간병 일':'돌봄 일';
  return {help:'품앗이',home:'집안일',rest:'쉼'}[slot];
}
function retAge(y){return y<1990?55:y<2010?58:y<2030?60:65}
function retire(p,why){if(p.f.retired)return;p.f.retired=S.year;if(['trade','craft','study','care'].includes(p.slot))p.slot=p.f.married?'home':'rest';p.recs.push({y:S.year,t:(why||'일에서 물러났다'),w:1})}
function slotOK(p,slot){
  const a=age(p);if(a<7)return '어림';
  if(p.f.retired&&['trade','craft','study','care'].includes(slot))return '은퇴함';
  if(slot==='study'){if(a<=13)return '';if(a<=19)return p.f.mid?'':'진학 안 함';return ''}
  if(slot==='care')return a<18?'18살부터':S.year<1990?'1990년부터':'';
  if(slot==='trade'||slot==='craft'||slot==='help')return a>=12?'':'12살부터';
  return '';
}
/* 직업마다 성격이 다르다
   장사: 해마다 들쭉날쭉(운·눈썰미·모험심), 가게 크기만큼만 일손이 필요하다, 시대 타격이 크다
   기술: 꾸준하다, 오래 할수록 숙련 수당이 붙는다, 몸이 약하면 다칠 수 있다
   직장: 학력이 있어야 한다, 가장 안정적이고 체면이 오른다, 오래 다니면 연금이 나온다
   돌봄: 벌이는 적지만 이웃 정과 시간 빚이 쌓인다 */
const JOB_INFO={
  trade:{name:'장사',good:'잘되는 해엔 크게 번다 · 가게를 키우면 더 번다',bad:'해마다 들쭉날쭉 · 가게 크기보다 일손이 많으면 남는 사람은 덜 번다 · 대형마트·불경기 타격',stat:'셈·말솜씨·눈썰미, 사교적이면 유리'},
  craft:{name:'기술',good:'꾸준하다 · 오래 할수록 숙련 수당',bad:'몸이 약하면 다칠 수 있다 · 공장 감산 타격',stat:'손재주·몸·끈기, 성실하면 유리'},
  study:{name:'직장',good:'가장 안정적 · 체면이 오른다 · 15년 넘게 다니면 늙어서 연금',bad:'고졸 이상이어야 하고 공부에 오래 돈이 든다',stat:'글·끈기'},
  care:{name:'돌봄',good:'이웃 정이 쌓인다 · 2030년대부터 대우가 좋아진다',bad:'벌이가 적다',stat:'마음씨·끈기, 온화하면 유리'},
  help:{name:'품앗이',good:'해마다 이웃 정이 쌓이고 정의 길에 보탬 · 가끔 이웃이 먹을거리를 보낸다',bad:'벌이가 아주 적다',stat:'말솜씨·마음씨, 사교적이면 유리'},
  home:{name:'집안일',good:'생활비를 줄인다 · 어린아이들 마음씨·말솜씨·글이 자란다 · 75세 이상 어르신 돌봄 비용이 1/3로 · 식구 애정',bad:'벌이는 없다',stat:'마음씨·손재주'},
  rest:{name:'쉼',good:'병이 낫고 몸이 회복된다 · 쌓인 원한이 풀린다 · 노인은 오래 산다',bad:'벌이 없음 (은퇴하면 연금)',stat:'50세 넘어 쉬지 않고 6년 넘게 일하면 몸이 축난다'}};
const PAY=.62; // 전체 소득 수준(통계 가구 소득에 맞춤)
function persF(p,k){return 1+.03*((p.pers&&p.pers[k]||5)-5)}
function incomeOf(p,slot,y){
  y=y??S.year;const a=age(p,y);if(a<7)return 0;const t=p.tal;
  const half=(a<14&&(slot==='trade'||slot==='craft'))?.5:1;const base=prod(y)*PAY;const old=a>=70?.6:a>=62?.85:1;
  if(slot==='trade'){if(a<12)return 0;
    const repuF=(y>=2000&&S.tradeSt>=2)?(.8+.4*S.repu/100):1;
    const bw=bizOf().w;let tw=0;for(const k in bw)tw+=(t[k]||0)*bw[k];
    return (4.5+tw*2.3/Object.values(bw).reduce((a,b)=>a+b,0))*bizOf().m*bizFade(y)*persF(p,'사교')*[1,1.35,1.7][S.tradeSt-1]*eraMult('trade',y)*modMult('trade',y)*placeMult('trade')*repuF*half*old*base}
  if(slot==='craft'){if(a<12)return 0;
    const senior=1+Math.min(.4,(p.hist.craft||0)*.018);
    return (6+t.손재주*1.1+t.몸*.4+t.끈기*.5)*persF(p,'성실')*senior*[1,1.22,1.5][S.craftSt-1]*eraMult('craft',y)*modMult('craft',y)*placeMult('craft')*half*old*base}
  if(slot==='study'){if(a<20||(p.f.college&&p.edu<3&&a<=26)||p.f.exam)return 0;
    if(p.f.artsPro&&p.f.dream){const k=ARTS[p.f.dream].tal;const peak=p.f.dream==='운동'?(a<34?1.15:.8):1;return Math.max(1.5,(t[k]*1.7+t.끈기*.4-3)*peak)*(1+Math.min(.4,(p.hist.study||0)*.015))*old*base}
    const senior=1+Math.min(.5,(p.hist.study||0)*.02);
    if(p.edu>=3)return (11+t.글*1.5+t.끈기*.4)*senior*(p.f.official?1.3:1)*(p.f.jobMul||1)*eraMult('study',y)*modMult('study',y)*placeMult('study')*old*base;
    if(p.edu>=2)return (8+t.글*.9+t.끈기*.3)*senior*eraMult('study',y)*modMult('study',y)*old*base;return 0}
  if(slot==='care')return a<18?0:(6+t.마음씨*1.0+t.끈기*.3)*persF(p,'온화')*eraMult('care',y)*modMult('care',y)*old*base;
  if(slot==='help')return a>=12?(2+t.말솜씨*.2+t.마음씨*.2)*persF(p,'사교')*base*.6:0;
  if(slot==='home')return (a>=14?1.0:.3)*liveF(y);
  if(slot==='rest'||!slot)return pensionOf(p,y);
  return 0;
}
function pensionOf(p,y){const a=age(p,y);if(a<60)return 0;let v=0;
  if((p.hist.study||0)>=15&&p.edu>=2)v=(4+p.tal.글*.5)*(p.f.official?1.5:1)*prod(y)*PAY;
  else if(y>=1988&&((p.hist.craft||0)+(p.hist.study||0)+(p.hist.trade||0))>=10)v=1.6*prod(y)*PAY*(y>=2008?1.3:1);
  return v}
function feeOf(p,slot,y){
  y=y??S.year;if(slot!=='study')return 0;const a=age(p,y);if(a<7)return 0;const pf=prod(y)*(S.hun==='study'?1.2:1);
  if(a<=13)return .8*pf;if(a<=19)return p.f.mid?2.2*pf:0;if(p.f.college&&p.edu<3&&a<=26)return 5*pf;return 0;
}
/* 성장: 일마다 오르는 능력치가 여러 개, 끈기·성실이 높을수록 빨리, 같은 일을 잘하는 식구가 있으면 더 빨리 */
const GROW={trade:[['셈',.6],['말솜씨',.4],['눈썰미',.35]],craft:[['손재주',.65],['몸',.35],['끈기',.3]],study:[['글',.85],['끈기',.3],['셈',.2]],
  care:[['마음씨',.6],['끈기',.35]],help:[['말솜씨',.45],['마음씨',.5]],home:[['마음씨',.35],['손재주',.3],['셈',.15]],rest:[['몸',.2],['마음씨',.15]]};
/* 예체능의 길로 간 식구는 학교·일터에서 그쪽 재주가 오른다 */
function growList(p,slot){if(slot==='study'&&p.f&&p.f.artsPro&&ARTS[p.f.dream]){const k=ARTS[p.f.dream].tal;const L={음악:[['손재주',.85],['끈기',.35],['마음씨',.2]],미술:[['손재주',.8],['눈썰미',.45],['끈기',.2]],운동:[['몸',.9],['끈기',.4],['마음씨',.15]],연기:[['말솜씨',.85],['마음씨',.3],['끈기',.2]]}[p.f.dream];return L||[[k,.85],['끈기',.3]]}
  if(slot==='study'&&p.f&&p.f.dream&&p.f.artsLv&&!p.f.artsDone&&age(p)<20){const k=ARTS[p.f.dream].tal;return [['글',.7],[k,.4],['끈기',.25]]}
  if(slot==='study'&&p.f&&p.f.voc&&age(p)<20)return [['손재주',.75],['끈기',.3],['글',.3]];
  return GROW[slot]||[]}
function grow(p,slot,yr){
  const a=age(p,yr);const out=[];
  const boost=1+.07*(p.tal.끈기-5)+.04*(p.pers.성실-5)+(a<25?.15:a>55?-.25:0);
  const list=a<7?[['몸',.35],['마음씨',.3],['말솜씨',.2]]:growList(p,slot);
  for(const [k,pr] of list){
    let prob=pr*boost;
    const mentor=homeAlive().some(q=>q.id!==p.id&&q.slot===slot&&q.tal[k]>=p.tal[k]+3);if(mentor)prob+=.2;
    if(p.tal[k]>=p.cap[k])continue;
    prob=Math.min(.95,prob*1.5);if(R()<prob){let inc=(.3+R()*.8)*(R()<prob*.2?1.8:1);inc=Math.min(inc,p.cap[k]-p.tal[k]);p.tal[k]=Math.round((p.tal[k]+inc)*100)/100;p.grow[k]=(p.grow[k]||0)+inc;out.push(k)}
  }
  return out;
}

/* ===================== 재산 ===================== */
/* 자산 시세: 지금(2026년) 돈 기준 실제 시세를 시대별로 잡고, 그해 물가로 바꿔 쓴다
   (서울 변두리 기준 대략치. 2026년 이후는 가상의 미래) */
const U26=UNIT78*cpi(2026)/cpi(1978);
const won26=t=>y=>interp(t,y)*1e4/U26;   // 만 원(지금 돈) → 내부 단위
const P_HOUSE=won26([[1953,600],[1965,1500],[1975,4500],[1985,12000],[1990,19000],[2000,20000],[2010,32000],[2020,38000],[2030,36000],[2050,30000],[2075,28000]]);
const P_APT=won26([[1970,7000],[1975,9000],[1985,22000],[1990,34000],[2000,32000],[2010,48000],[2020,60000],[2030,55000],[2050,45000],[2075,40000]]);
const P_LAND=won26([[1953,150],[1965,500],[1975,2500],[1985,8000],[1990,15000],[2000,14000],[2010,22000],[2020,26000],[2030,23000],[2050,18000],[2075,16000]]);
const P_SHOP=won26([[1953,200],[1965,500],[1975,1500],[1985,3500],[1990,6000],[2000,7000],[2010,10000],[2020,11000],[2050,10000],[2075,9000]]);
const RI=won26([[1953,400],[1965,700],[1975,1600],[1985,2800],[1995,4500],[2005,5000],[2015,5800],[2025,6500],[2050,7000],[2075,7200]]); // 가구 소득
function landVal(y){return P_LAND(y??S.year)*(S.place.land??1)}
function houseVal(y){y=y??S.year;const pl=S.place.land??1;if(S.house==='shack')return P_HOUSE(y)*.08;if(S.house==='own')return P_HOUSE(y)*(S.place.kind==='rural'?.45:pl);return P_APT(Math.max(1970,y))*pl}
function netWorth(){return S.money+houseVal()+landTotal()-(S.landDebt||0)}
function houseName(){return {shack:'판잣집',own:S.place.kind==='rural'?'시골집':S.year<1975?'기와집':'단독주택',apt:'아파트'}[S.house]}

/* ===================== 이벤트 카드 ===================== */
const FILLER={
 '가족':[
  {id:'f-A1',slot:'가족',rep:true,title:'별일 없는 해',text:()=>S.year<1980?'큰일 없이 한 해가 간다. 저녁이면 마루에 모여 앉는다.':S.year<2040?'큰일 없이 한 해가 간다. 저녁 밥상에 다들 휴대폰만 본다.':'큰일 없이 한 해가 간다. 집 안 화면이 오늘 날씨와 식구들 일정을 읽어 준다.',ch:[{t:'쉬어 간다',fx:{affAll:1,money:-1}},{t:'조금 더 일한다',fx:{money:2,affAll:-1}}]},
  {id:'f-A2',slot:'가족',rep:true,who:'adult',title:'고단한 하루',text:'{subj}{subj:이/가} 저녁상 앞에서 꾸벅꾸벅 존다.',ch:[{t:'일찍 재운다',fx:{aff:1,money:-1}},{t:'내일 일을 같이 걱정한다',fx:{money:2,aff:-1}}]},
  {id:'f-A3',slot:'가족',rep:true,who:'elder',title:'어른의 옛이야기',text:()=>'{subj}{subj:이/가} '+(S.year<2000?'피란 내려오던 겨울':'젊어서 고생하던 시절')+' 이야기를 또 꺼낸다.',ch:[{t:'끝까지 들어 드린다',fx:{aff:2,money:-1}},{t:'바쁘다며 일어선다',fx:{aff:-1,money:1}}]},
  {id:'f-A4',slot:'가족',rep:true,who:'adult',wc:p=>age(p)>=40,title:'쑤시는 허리',text:'{subj}{subj:이/가} 허리가 쑤신다며 일어날 때마다 끙 소리를 낸다.',ch:[{t:'병원에 보낸다 (2)',need:{money:2},fx:{money:-2,talent:{몸:1}}},{t:'파스 붙이고 버틴다',fx:{talent:{몸:-1}}}]},
  {id:'f-A5',slot:'가족',rep:true,who:'adult',title:'부부 말다툼',wc:p=>p.f.married,text:'사소한 일로 {subj}{subj:이/가} 배우자와 며칠째 말을 안 한다.',ch:[{t:'먼저 사과하게 한다',fx:{aff:1,grudge:1}},{t:'외식으로 풀어 본다 (2)',need:{money:2},fx:{money:-2,affAll:1}}]}],
 '자녀':[
  {id:'f-B1',slot:'자녀',rep:true,who:'any',wc:p=>age(p)>=3&&age(p)<=17,title:'아이들 크는 해',text:'{subj}{subj:이/가} 몰라보게 컸다. 옷이 벌써 작다.',ch:[{t:'새 옷을 사 준다 (2)',need:{money:2},fx:{money:-2,aff:1}},{t:'물려 입힌다',fx:{money:1,aff:-1}}]},
  {id:'f-B2',slot:'자녀',rep:true,who:'any',wc:p=>age(p)>=3&&age(p)<=12,title:'키 재기',text:'문설주에 {subj}의 키를 새로 그었다.',ch:[{t:'칭찬해 준다',fx:{aff:1}},{t:'밥을 더 먹으라고 한다',fx:{talent:{몸:1},aff:-1}}]},
  {id:'f-B3',slot:'자녀',rep:true,who:'any',wc:p=>age(p)>=7&&age(p)<=17,title:'성적표',text:()=>'{subj}의 '+(S.year<1990?'통지표':'성적표')+'가 나왔다. 오른 과목도, 떨어진 과목도 있다.',ch:[{t:'잘한 것만 칭찬한다',fx:{aff:1}},{t:'떨어진 과목을 다그친다',fx:{talent:{글:1},aff:-1,grudge:1}}]},
  {id:'f-B4',slot:'자녀',rep:true,who:'any',wc:p=>age(p)>=18&&age(p)<=34&&!p.f.married,title:'늦은 귀가',text:'{subj}{subj:이/가} 요즘 밤늦게 들어온다. 친구들과 어울린다고만 한다.',ch:[{t:'믿고 둔다',fx:{aff:1,pers:{모험:1}}},{t:'문단속 시간을 정한다',fx:{aff:-1,gap:{s:1}}}]}],
 '동네':[
  {id:'f-N1',slot:'동네',rep:true,nb:'any',title:'골목 인사',text:()=>'{nb}{nb:과/와} '+(S.year<2030?'골목':'엘리베이터')+'에서 마주쳤다.',ch:[{t:'먹을 것을 나눈다',fx:{money:-1,nbj:1}},{t:'인사만 한다',fx:{}}]},
  {id:'f-N2',slot:'동네',rep:true,nb:'minj',title:'서먹한 이웃',text:'{nb}{nb:과/와} 요즘 말을 안 섞는다.',ch:[{t:'먼저 찾아간다',fx:{nbj:2,money:-1}},{t:'그냥 둔다',fx:{nbj:-1}}]},
  {id:'f-N3',slot:'동네',rep:true,nb:'any',title:'빌려 간 물건',text:()=>'{nb}{nb:이/가} 빌려 간 '+(S.year<1980?'맷돌을':S.year<2030?'사다리를':'공구 상자를')+' 아직 안 돌려준다.',ch:[{t:'달라고 한다',fx:{nbj:-1}},{t:'모른 척한다',fx:{money:-1,nbj:1}}]},
  {id:'f-N4',slot:'동네',rep:true,nb:'maxj',title:'이웃 잔치',text:'{nb}에 좋은 일이 있어 떡을 돌렸다.',ch:[{t:'답례를 한다 (2)',need:{money:2},fx:{money:-2,nbj:2}},{t:'고맙다는 말만 한다',fx:{}}]}],
 '시대':[
  {id:'f-E1',slot:'시대',rep:true,title:'달라지는 세상',text:()=>S.year<1970?'라디오에서 나라가 바뀐다는 소식이 이어진다.':S.year<2000?'텔레비전 뉴스가 매일 새 물건, 새 동네 이야기를 한다.':S.year<2050?'새로 나온 기기를 다들 하나씩 들고 다닌다.':'새 기술 소식이 쏟아지지만 어른들은 따라가기 벅차다.',ch:[{t:'배워 본다 (1)',need:{money:1},fx:{money:-1,affAll:1}},{t:'하던 대로 산다',fx:{money:1}}]},
  {id:'f-E2',slot:'시대',rep:true,title:'오른 물가',text:()=>S.year<2030?'장바구니 물가가 또 올랐다.':'배달 요금과 전기 요금이 또 올랐다.',ch:[{t:'허리띠를 졸라맨다',fx:{money:2,affAll:-1}},{t:'그냥 쓴다',fx:{money:-1}}]}],
 '집안':[
  {id:'f-H1',slot:'집안',rep:true,title:'살림 정리',text:'한 해 살림을 정리할 때다.',ch:[{t:'아껴 쓴다',fx:{money:2,gap:{f:-1}}},{t:'식구들 옷을 새로 장만한다 (2)',need:{money:2},fx:{money:-2,affAll:1}}]},
  {id:'f-H2',slot:'집안',rep:true,title:'집 손보기',text:()=>S.house==='apt'?'욕실 배수구가 막히고 문고리가 헐거워졌다.':'지붕과 문짝이 삐걱거린다.',ch:[{t:'손수 고친다',fx:{affAll:-1}},{t:'사람을 불러 고친다 (3)',need:{money:3},fx:{money:-3,affAll:1}}]},
  {id:'f-H3',slot:'집안',rep:true,title:'계절 준비',text:()=>S.year<1990?'겨울을 나려면 연탄을 들여야 한다.':S.year<2040?'겨울 난방비 고지서가 걱정이다.':'여름 냉방비가 겨울 난방비보다 더 든다.',ch:[{t:'넉넉히 준비한다 (2)',need:{money:2},fx:{money:-2,affAll:1}},{t:'아껴 버틴다',fx:{money:1,affAll:-1}}]}],
 '공통':[
  {id:'f-C1',slot:'공통',rep:true,title:()=>S.year<1990?'장날':'주말 시장',text:()=>S.year<1990?'장이 선다.':'동네에 주말 장터가 열렸다.',ch:[{t:'구경 간다',fx:{affAll:1,money:-1}},{t:'물건을 내다 판다',fx:{money:2,affAll:-1}}]},
  {id:'f-C2',slot:'공통',rep:true,title:'나들이',text:()=>S.year<1980?'봄볕이 좋아 식구들이 뒷산에 올랐다.':'오랜만에 쉬는 날, 식구들이 바람 쐬러 나가자고 한다.',ch:[{t:'다 같이 간다 (1)',need:{money:1},fx:{money:-1,affAll:1}},{t:'집에서 쉰다',fx:{}}]}]
};
let CARDS=[];const CARD_BY_ID={};
const KIN_WHY=['출가','분가','갈라섬','상경','공장 기숙사','제 길','사랑을 따라','타지','귀촌','부모 따라'];
/* 떠나 사는 식구와 오가는 일 */
const KIN_CARDS=[
 {id:'k-visit',slot:'가족',rep:true,awayOK:true,who:'kin',wc:p=>p.aff>=0,y:[1953,2075],title:'반가운 걸음',text:p=>'따로 사는 {subj}{subj:이/가} '+(S.year<1990?'보따리에 반찬을 싸 들고':'주말에 차를 몰고')+' 다녀갔다.',
  ch:[{t:'하룻밤 묵어 가라고 한다',fx:{aff:2,affAll:1}},{t:'손에 뭐라도 들려 보낸다 (2)',need:{money:2},fx:{money:-2,aff:3}},{t:'바쁘다며 일찍 보낸다',fx:{aff:-1}}]},
 {id:'k-money',slot:'가족',rep:true,awayOK:true,who:'kin',wc:p=>age(p)>=25&&age(p)<=60,y:[1955,2075],title:'따로 사는 자식의 부탁',text:'{subj}{subj:이/가} 살림이 어렵다며 돈을 좀 융통해 달라고 한다.',
  ch:[{t:'선뜻 보태 준다 (8)',need:{money:8},fx:{money:-8,aff:3}},{t:'조금만 보탠다 (3)',need:{money:3},fx:{money:-3,aff:1}},{t:'우리도 어렵다고 한다',fx:{aff:-2,grudge:1}}]},
 {id:'k-gift',slot:'가족',rep:true,awayOK:true,who:'kin',wc:p=>p.aff>=3&&age(p)>=28,y:[1960,2075],title:'용돈 봉투',text:p=>'{subj}{subj:이/가} '+(S.year<1985?'명절 쇠라며 봉투를 내밀었다':S.year<2015?'부모님 용돈을 부쳐 왔다':'용돈을 계좌로 보내왔다')+'.',
  ch:[{t:'고맙게 받는다',fx:{money:5,aff:1}},{t:'"마음만 받으마" 하고 돌려준다',fx:{aff:2,face:1}},{t:'받아서 손주 몫으로 모아 둔다',fx:{money:5,gap:{f:-1}}}]},
 {id:'k-grandkid',slot:'자녀',rep:true,awayOK:true,who:'kin',wc:p=>S.people.some(c=>c.alive&&c.parents.includes(p.id)&&age(c)<=12),y:[1960,2075],title:'손주가 왔다',text:'따로 사는 {subj}{subj:이/가} 아이를 데리고 왔다. 집 안이 시끌벅적하다.',
  ch:[{t:'방학 동안 맡아 준다',fx:{aff:2,affAll:2,money:-2}},{t:'용돈을 쥐여 보낸다 (2)',need:{money:2},fx:{money:-2,aff:1,affAll:1}},{t:'저녁만 먹여 보낸다',fx:{affAll:1}}]},
 {id:'k-help',slot:'집안',rep:true,awayOK:true,who:'kin',wc:p=>p.aff>=1,cond:()=>homeAlive().some(p=>age(p)>=70||p.f.sick),y:[1955,2075],title:'따로 사는 자식의 손길',text:'어른이 편찮다는 소식에 {subj}{subj:이/가} 며칠 와서 간병을 거들었다.',
  ch:[{t:'고맙다고 한다',fx:{aff:2}},{t:'아예 들어와 살자고 한다',fx:{aff:1,chain:{id:'k-return',in:0}}}]},
 {id:'k-return',slot:'가족',chainOnly:true,awayOK:true,who:'kin',title:'다시 한집에',text:'{subj}{subj:이/가} 식구들을 데리고 집으로 들어오는 문제를 고민한다.',
  ch:[{t:'들어와 살자',fx:{aff:2,comeHome:true}},{t:'지금처럼 오가며 살자',fx:{aff:1}}]},
 {id:'k-feud',slot:'가족',awayOK:true,who:'estranged',wc:p=>p.grudge>=1,y:[1955,2075],title:'끊긴 발길',text:'갈라선 {subj}{subj:이/가} 몇 해째 소식이 없다. 건너 건너 사는 형편을 들었다.',
  ch:[{t:'먼저 연락한다',fx:{rnd:[{p:.5,fx:{grudge:-3,aff:3,reconcile:true},msg:'{subj}{subj:이/가} 전화를 받았다. 오래 이야기를 나눴다'},{p:.5,fx:{grudge:-1},msg:'{subj}{subj:은/는} 아직 마음을 열지 않았다'}]}},
      {t:'사람을 넣어 안부만 묻는다',fx:{grudge:-1}},{t:'저쪽에서 먼저 와야 한다',fx:{grudge:1,gap:{f:1}}}]},
 {id:'k-sib',slot:'가족',rep:true,awayOK:true,who:'sib',y:[1955,2075],title:'따로 사는 형제',text:'따로 사는 형제 {subj}{subj:이/가} 오랜만에 찾아왔다. 사는 게 만만치 않은 눈치다.',
  ch:[{t:'술 한잔 하며 이야기를 들어 준다',fx:{aff:2}},{t:'살림에 보태라고 봉투를 쥐여 준다 (4)',need:{money:4},fx:{money:-4,aff:3}},{t:'바쁘다며 일찍 보낸다',fx:{aff:-2}}]},
 {id:'k-wedding',slot:'집안',awayOK:true,who:'kin',wc:p=>S.people.some(c=>c.alive&&c.parents.includes(p.id)&&age(c)>=24&&!c.f.married),y:[1975,2075],title:'따로 사는 집 혼사',text:'따로 사는 {subj}의 자식이 혼인을 한다. 큰집 어른으로서 어떻게 할까?',
  ch:[{t:'혼수를 보태 준다 (8)',need:{money:8},fx:{money:-8,aff:3,face:1}},{t:'축의금만 낸다 (2)',need:{money:2},fx:{money:-2,aff:1}},{t:'형편껏 마음만 전한다',fx:{}}]}
];
function registerCards(list){for(const c of list){if(c.y&&c.y[1]>=2075)c.y=[c.y[0],2110];if(c.slot==='가족A')c.slot='가족';if(c.slot==='가족B')c.slot='자녀';CARDS.push(c);CARD_BY_ID[c.id]=c}}
for(const k in FILLER)for(const c of FILLER[k])CARD_BY_ID[c.id]=c;
for(const k in FILLER)for(const c of FILLER[k])if(c.y&&c.y[1]>=2075)c.y=[c.y[0],2110];
for(const c of KIN_CARDS)if(c.y&&c.y[1]>=2075)c.y=[c.y[0],2110];

/* ===================== 텍스트·효과 ===================== */
function fill(s,ctx){
  if(typeof s==='function')s=s(ctx||{});if(!s)return '';
  return String(s).replace(/\{(\w+)(?::([^}]+))?\}/g,(m,k,j)=>{let w='';
    if(k==='subj')w=ctx&&ctx.subj?ctx.subj.name:'';else if(k==='nb')w=ctx&&ctx.nb?nbName(ctx.nb):'이웃';
    else if(k==='nbHead')w=ctx&&ctx.nb?ctx.nb.head:'';else if(k==='fam')w=S.sur;else if(k==='rep')w=rep()?rep().name:'';
    else if(k==='year')w=String(S.year);else if(k==='frag')w=String(S.frag);else if(k==='place')w=placeName();
    else if(k==='nbJ')w=ctx&&ctx.nb?String(ctx.nb.j):'0';else if(k==='subjGeul')w=ctx&&ctx.subj?String(pt(ctx.subj.tal.글)):'';
    return j?josa(w,j):w});
}
function gapWord(k,v){const n={d:['근면','여유'],f:['체면','실속'],s:['엄격','다정']}[k];return (v>0?n[0]:n[1])+' 쪽으로'}
function applyFx(fx,ctx,out,opt){
  if(!fx)return;opt=opt||{};if(typeof fx==='function')fx=fx(Object.assign({},ctx,{nb:ctx.nb?nbHalf(ctx.nb):null}));
  const sj=ctx.subj,nb=ctx.nb;
  if(fx.rnd){const r=R();let acc=0;for(const o of fx.rnd){acc+=o.p;if(r<acc){out.push('▸ '+fill(o.msg,ctx));applyFx(o.fx,ctx,out,opt);break}}}
  if(fx.money){const v=opt.raw?fx.money:cm(fx.money);S.money+=v;out.push('돈 '+sgW(v))}
  if(fx.face){const v=fx.face>0?Math.round(fx.face*.9*10)/10:Math.round(fx.face*.6*10)/10;S.face=clamp(S.face+v,0,100);out.push('체면 '+sg(v))}
  if(fx.aff&&sj){sj.aff=clamp(sj.aff+fx.aff,-10,10);out.push(sj.name+' 애정 '+sg(fx.aff))}
  if(fx.grudge&&sj){let v=fx.grudge;if(v>0){if(sj.pers.온화>=7)v=Math.max(0,v-1);if(sj.pers.고집>=7)v+=1}
    if(v){sj.grudge=clamp(sj.grudge+v,0,10);out.push(v>0?sj.name+'의 표정이 굳었다':sj.name+'의 마음이 조금 풀렸다')}}
  if(fx.affAll){for(const p of homeAlive())if(p.id!==S.repId)p.aff=clamp(p.aff+fx.affAll,-10,10);out.push('식구들 애정 '+sg(fx.affAll))}
  const jgain=v=>v>0?Math.max(1,Math.round(v*2*jeongPow(S.year)+(S.hun==='nb'?.6:0)+(R()-.5))):Math.round(v*2+(R()-.5));
  if(fx.nbj&&nb){const v=jgain(fx.nbj);nb.j=clamp(nb.j+v,-20,20);out.push(nbName(nb)+' 정 '+sg(v))}
  if(fx.jAll){const v=jgain(fx.jAll);for(const n of S.nbs)n.j=clamp(n.j+v,-20,20);out.push('이웃 모두 정 '+sg(v))}
  if(fx.ledger&&nb)S.ledger.unshift({y:S.year,nb:nb.sur+'씨네',t:fill(fx.ledger,ctx),d:fx.nbj||0});
  if(fx.rentY){(S.rents=S.rents||[]).push({v:cm(fx.rentY.v),until:S.year+fx.rentY.n});out.push('해마다 세 '+wonY(cm(fx.rentY.v))+' ('+fx.rentY.n+'년)')}
  if(fx.dream){const t=sj||rep();if(t&&!t.f.dream){t.f.dream=fx.dream==='auto'?artsKindFor(t):fx.dream;t.f.dreamSet=true;out.push(t.name+'의 꿈: '+ARTS[t.f.dream].dream)}}
  if(fx.talent){const t=sj||rep();if(t)for(const k in fx.talent){const v=fx.talent[k];if(!(k in t.tal))continue;
    if(v>0&&t.tal[k]+v>t.cap[k]&&R()<.5){t.cap[k]=Math.min(10,t.cap[k]+v*.6);out.push(t.name+' '+k+' 한계를 넘었다')}
    t.tal[k]=v>0?Math.min(t.cap[k],t.tal[k]+v):Math.max(0,t.tal[k]+v);out.push(t.name+' '+k+' '+sg(v*10))}}
  if(fx.pers&&sj){for(const k in fx.pers)if(k in sj.pers){sj.pers[k]=clamp(sj.pers[k]+fx.pers[k],0,10);out.push(sj.name+' '+k+' '+sg(fx.pers[k]*10))}}
  if(fx.gap){for(const k in fx.gap)S.gap[k]=clamp(S.gap[k]+fx.gap[k],-5,5);out.push('가풍이 '+Object.entries(fx.gap).map(([k,v])=>gapWord(k,v)).join(', ')+' 기운다')}
  if(fx.frag){S.frag=clamp(S.frag+fx.frag,0,5);out.push('고향 기억 조각 '+sg(fx.frag))}
  if(fx.tradeY){S.tradeY=Math.max(0,S.tradeY+fx.tradeY);out.push('장사 경력 '+sg(fx.tradeY)+'년')}
  if(fx.craftY){S.craftY=Math.max(0,S.craftY+fx.craftY);out.push('기술 경력 '+sg(fx.craftY)+'년')}
  if(fx.land){if(fx.land>0)for(let i=0;i<fx.land;i++)landAdd();else for(let i=0;i<-fx.land&&S.land;i++)landRemove();out.push('땅 '+sg(fx.land)+'필지')}
  if(fx.run){try{const m=fx.run(ctx);if(m)out.push(m)}catch(e){}}
  if(fx.repu){S.repu=clamp(S.repu+fx.repu,0,100);out.push('가게 평판 '+sg(fx.repu))}
  if(fx.timeDebt){S.timeDebt=Math.max(0,S.timeDebt+fx.timeDebt);out.push('돌봄 시간 빚 '+sg(fx.timeDebt))}
  if(fx.house){const before=S.house;S.house=fx.house;if(before!==fx.house)out.push({own:'내 집이 생겼다',apt:'아파트로 들어갔다',shack:'집을 잃었다'}[fx.house])}
  if(fx.loc)S.loc=fx.loc;
  if(fx.flag)S.flags[fx.flag]=S.year;
  if(fx.sflag&&sj)sj.f[fx.sflag]=true;
  if(fx.sflag==='artsPro'&&sj){if(!sj.f.dream)sj.f.dream='미술';sj.f.artsDone=true;sj.f.artsLv=2}
  if(fx.sick&&sj){sj.f.sick=true;out.push(sj.name+josa(sj.name,'이/가')+' 앓아누웠다')}
  if(fx.heal&&sj){sj.f.sick=false;out.push(sj.name+josa(sj.name,'이/가')+' 털고 일어났다')}
  const modOne=m=>{S.mods.push({k:m.k,m:m.m,until:S.year+m.n});out.push(({trade:'장사',craft:'기술',study:'직장',care:'돌봄'})[m.k]+' 벌이 ×'+m.m+' ('+m.n+'년)')};
  if(fx.mod)modOne(fx.mod);if(fx.mods)fx.mods.forEach(modOne);
  if(fx.chain)S.chains.push({id:fx.chain.id,at:S.year+(fx.chain.in||0),subj:sj?sj.id:null,nb:nb?nb.key:null});
  const gone=sj&&(!sj.alive||sj.status!=='home');
  if(fx.sflag==='army'&&sj&&!gone&&!fx.awayYears){fx=Object.assign({},fx,{awayYears:S.year<1970?3:S.year<1995?3:2,army:true})}
  if(fx.awayYears&&sj&&!gone){const army=fx.army||ctx.army;const why=army?'군대':(fx.why||ctx.why||'타지');
    if(army)sj.f.army=true;sj.status='away';sj.away={why,until:S.year+fx.awayYears};out.push(sj.name+josa(sj.name,'이/가')+' '+(army?'입대했다 ('+fx.awayYears+'년)':fx.awayYears+'년 동안 집을 떠난다 ('+why+')'))}
  if(fx.leave&&sj&&!(sj.status!=='home'&&fx.awayYears)){sj.status='away';sj.away={why:fx.leave,until:null};out.push(sj.name+josa(sj.name,'이/가')+' 집을 떠났다 ('+fx.leave+')')}
  if(fx.reconcile&&sj&&sj.away&&['의절','갈라섬'].includes(sj.away.why)){sj.away.why='분가';out.push(sj.name+josa(sj.name,'과/와')+' 화해했다. 이제 따로 살며 오간다');sj.recs.push({y:S.year,t:'오랜 세월 끝에 집안과 화해했다',w:3})}
  if(fx.comeHome&&sj&&sj.status==='away'){sj.status='home';sj.away=null;out.push(sj.name+josa(sj.name,'이/가')+' 다시 집으로 들어왔다');for(const q of S.people)if(q.alive&&q.status==='away'&&(q.id===sj.spouse||q.parents.includes(sj.id))&&q.away&&KIN_WHY.includes(q.away.why)){q.status='home';q.away=null;out.push(q.name+'도 함께 왔다')}}
  if(fx.jb&&S.jb){const j=fx.jb;for(const k in j){if(k==='pagesAdd'){S.jb.pages+=j[k];out.push('족보 '+j[k]+'쪽을 더 적었다 (모두 '+S.jb.pages+'쪽)')}else S.jb[k]=j[k]}
    if(j.bon!==undefined||j.kind)out.push('족보: '+jbKindText()+(S.jb.bon?' · '+jbBonText():''));if(j.kind==='bought')S.flags.bongwan=S.year;if(j.kind==='ours'||j.kind==='true')S.flags.ourJokbo=S.flags.ourJokbo||S.year}
  if(fx.marry&&sj&&!sj.f.married){doMarry(sj,fx.marry,out);if(marryHome(sj)==='out'&&sj.status==='home'){moveOut(sj,'출가');out.push(sj.name+josa(sj.name,'은/는')+' 시댁으로 들어갔다')}familySync()}
  if(fx.official&&sj){sj.f.official=true;sj.slot='study'}
  if(fx.edu&&sj)sj.edu=Math.max(sj.edu,fx.edu);
  if(fx.die&&sj)killP(sj,out);
  if(fx.rec){const t=sj||rep();if(t)t.recs.push({y:S.year,t:fill(fx.rec,ctx),w:fx.recW||2})}
  if(fx.recRep){const t=rep();if(t)t.recs.push({y:S.year,t:fill(fx.recRep,ctx),w:fx.recW||2})}
}
function needOK(need){if(!need)return '';if(need.money&&S.money<cm(need.money))return wonY(cm(need.money))+josa('원','이/가')+' 필요하다';if(need.face&&S.face<need.face)return '체면 '+need.face+' 필요';return ''}
function killP(p,out){p.alive=false;p.death=S.year;if(out)out.push(p.name+josa(p.name,'이/가')+' 세상을 떠났다');if(p.id===S.repId)S.repDied=true}
/* ===== 혼인: 시대에 따라 혼처·사돈댁·신혼살림이 달라진다 ===== */
const INLAW_JOBS=[
 {l:'농사일',slot:'home',t:['몸','끈기'],y:[1950,1985],tier:'p'},
 {l:'행상',slot:'trade',t:['말솜씨','셈'],y:[1950,1975],tier:'p'},
 {l:'미싱사',slot:'craft',t:['손재주','끈기'],y:[1962,1995],sex:'f',tier:'p'},
 {l:'버스 안내양',slot:'help',t:['말솜씨','몸'],y:[1961,1989],sex:'f',tier:'p'},
 {l:'공장 공원',slot:'craft',t:['손재주','몸'],y:[1965,2005],tier:'p'},
 {l:'목수',slot:'craft',t:['손재주','몸'],y:[1950,2010],sex:'m',tier:'p'},
 {l:'운전기사',slot:'craft',t:['몸','눈썰미'],y:[1960,2035],sex:'m',tier:'p'},
 {l:'식당 일',slot:'trade',t:['손재주','말솜씨'],y:[1955,2110],tier:'p'},
 {l:'미용사',slot:'trade',t:['손재주','말솜씨'],y:[1968,2110],tier:'p'},
 {l:'요리사',slot:'craft',t:['손재주','끈기'],y:[1985,2110],tier:'p'},
 {l:'택배·배달 기사',slot:'craft',t:['몸','끈기'],y:[2000,2060],sex:'m',tier:'p'},
 {l:'돌봄 기사',slot:'care',t:['마음씨','끈기'],y:[2025,2110],tier:'p'},
 {l:'로봇 정비사',slot:'craft',t:['손재주','눈썰미'],y:[2040,2110],tier:'p'},
 {l:'타자수·경리',slot:'study',t:['셈','손재주'],y:[1960,1995],sex:'f',tier:'m',edu:2},
 {l:'간호사',slot:'care',t:['마음씨','끈기'],y:[1960,2110],tier:'m',edu:2,keep:true},
 {l:'공무원',slot:'study',t:['글','끈기'],y:[1955,2110],tier:'m',edu:2,keep:true},
 {l:'회사원',slot:'study',t:['셈','글'],y:[1970,2110],tier:'m',edu:3},
 {l:'은행원',slot:'study',t:['셈','글'],y:[1965,2110],tier:'m',edu:3},
 {l:'프로그래머',slot:'study',t:['셈','글'],y:[1992,2110],tier:'m',edu:3},
 {l:'디자이너',slot:'study',t:['손재주','눈썰미'],y:[1995,2110],tier:'m',edu:3},
 {l:'교사',slot:'study',t:['글','마음씨'],y:[1950,2110],tier:'g',edu:3,keep:true},
 {l:'의사',slot:'study',t:['글','마음씨'],y:[1960,2110],tier:'g',edu:3,keep:true},
 {l:'기자',slot:'study',t:['글','말솜씨'],y:[1960,2110],tier:'g',edu:3},
 {l:'연구원',slot:'study',t:['글','셈'],y:[1975,2110],tier:'g',edu:3},
 {l:'데이터 분석가',slot:'study',t:['셈','눈썰미'],y:[2025,2110],tier:'g',edu:3}];
const INLAW_BG={
 p:[[1950,1990,'농사짓는 집'],[1950,1990,'바닷가 어촌 집'],[1950,2110,'시장에서 장사하는 집'],[1965,2010,'공장 다니는 집'],[1950,1985,'셋방 사는 피란민 집'],[1990,2110,'맞벌이하는 집'],[2030,2110,'귀촌한 집']],
 m:[[1950,2110,'읍내에서 가게 하는 집'],[1955,2110,'공무원 집'],[1970,2110,'회사원 집'],[1980,2110,'아파트 사는 집'],[1950,2110,'선생님 집안']],
 g:[[1950,1972,'땅 많은 지주 집안'],[1950,1990,'양조장 하는 집'],[1965,2110,'은행 간부 집'],[1960,2110,'의사 집안'],[1965,2110,'사업하는 집안'],[1975,2110,'대학교수 집안'],[1985,2060,'강남 사는 집'],[1995,2110,'건물 가진 집']]};
const TIER_OF={good:'g',mid:'m',plain:'p'};
function meetHow(y){return y<1970?'중매로':y<1985?pick(['중매로','맞선으로','중매로']):y<2000?pick(['맞선으로','연애로','연애로']):y<2030?pick(['연애로','소개팅으로','연애로','회사에서 만나']):pick(['연애로','소개 앱으로','동호회에서 만나'])}
function weddingStyle(y){return y<1962?'마당에 멍석 깔고 구식 혼례를 올렸다':y<1990?'예식장에서 혼례를 올렸다':y<2025?'웨딩홀에서 식을 올렸다':'가까운 사람만 모아 작은 결혼식을 올렸다'}
function makeCand(p,tier){const y=S.year,tk=TIER_OF[tier],sex=p.sex==='m'?'f':'m';
  const jobs=INLAW_JOBS.filter(j=>y>=j.y[0]&&y<=j.y[1]&&(!j.sex||j.sex===sex)&&(j.tier===tk||(tk==='g'&&j.tier==='m'&&R()<.3)||(tk==='p'&&j.tier==='m'&&R()<.15)));
  if(sex==='m'&&y<2000){for(let i=jobs.length-1;i>=0;i--)if(['간호사','미용사'].includes(jobs[i].l))jobs.splice(i,1)}
  if(sex==='f'&&y<1975){const ok=['교사','간호사','타자수·경리','미싱사','버스 안내양','식당 일','농사일','행상','미용사'];for(let i=jobs.length-1;i>=0;i--)if(!ok.includes(jobs[i].l))jobs.splice(i,1)}
  let job=pick(jobs.length?jobs:INLAW_JOBS.filter(j=>y>=j.y[0]&&y<=j.y[1]&&(!j.sex||j.sex===sex)));
  /* 옛날엔 혼처로 오는 딸이 집안일만 하던 경우가 많다 */
  if(sex==='f'&&y<1970&&tk!=='g'&&R()<.45)job={l:'집안일',slot:'home',t:['마음씨','손재주'],tier:tk};
  const bgL=INLAW_BG[tk].filter(b=>y>=b[0]&&y<=b[1]);const bg=pick(bgL)[2];
  const sur=pick(SURN.filter(x=>x!==S.sur));const birth=p.birth+(sex==='f'?ri(0,4):ri(-4,0));
  return {sex,sur,birth,name:genName(sex,birth),bg,job,how:meetHow(y),tier}}
function candText(c){return c.sur+'씨네 '+c.bg+' '+(c.sex==='f'?'딸':'아들')+' '+c.name+'('+(S.year-c.birth)+'세) · '+c.job.l}
function doMarry(p,tier,out,cand){
  cand=cand||makeCand(p,tier);const sex=cand.sex,sur=cand.sur;const tk=TIER_OF[tier]||'p';
  const sp=mkPerson({sex,birth:cand.birth,gen:p.gen,inlaw:true,adult:true,aff:1,sur,name:cand.name});
  /* 혼인해 들어오는 사람: 살아온 만큼 능력이 있다 */
  const base={p:[28,55],m:[32,58],g:[35,62]}[tk];
  for(const t of TALENTS){sp.tal[t]=Math.min(sp.cap[t],ri(base[0],base[1])/10)}
  for(const t of cand.job.t){sp.cap[t]=Math.max(sp.cap[t],ri(70,92)/10);sp.tal[t]=Math.min(sp.cap[t],sp.tal[t]+ri(15,28)/10)}
  sp.edu=Math.max(cand.job.edu||0,tk==='g'?(S.year<1965&&sex==='f'?2:3):tk==='m'?2:(S.year<1960?0:1));if(sp.edu>=3)sp.f.college=true;
  sp.f.bg=sur+'씨네 '+cand.bg;sp.f.job=cand.job.l;sp.f.jobSlot=cand.job.slot;
  /* 1980년대까지는 여자가 혼인하면 직장을 그만두는 일이 많았다 */
  const quit=sex==='f'&&!cand.job.keep&&(S.year<1975||(S.year<1990&&R()<.6)||(S.year<2005&&R()<.25));
  sp.slot=quit?'home':(slotOK(sp,cand.job.slot)?'home':cand.job.slot);
  if(quit&&cand.job.slot!=='home')sp.f.jobQuit=true;
  sp.f.married=true;p.f.married=true;sp.spouse=p.id;p.spouse=sp.id;
  const T={good:{face:2,w:'이름난 집안'},mid:{face:1,w:'무난한 집안'},plain:{face:0,w:'형편 비슷한 집'}}[tier]||{face:0,w:'형편 비슷한 집'};
  const cost=-weddingCost(tier);S.money+=cost;S.face=clamp(S.face+T.face,0,100);
  out.push(p.name+josa(p.name,'이/가')+' '+cand.how+' '+sp.f.bg+'의 '+sp.name+josa(sp.name,'과/와')+' 혼인했다. '+weddingStyle(S.year));
  out.push(sp.name+' — '+cand.job.l+(sp.f.jobQuit?' (혼인하며 일을 그만두었다)':'')+' · '+cand.job.t.map(t=>t+' '+pt(sp.tal[t])).join(', '));
  out.push('혼사 비용 '+sgW(cost));if(T.face)out.push('체면 +'+T.face);
  if(p.desire==='사랑'&&tier==='good'&&cand.how!=='연애로'){p.grudge=clamp(p.grudge+2,0,10);out.push(p.name+josa(p.name,'은/는')+' 마음에 둔 사람이 따로 있었다')}
  if(tier==='good'&&S.face<55&&R()<.5){S.face=clamp(S.face-3,0,100);sp.aff=clamp(sp.aff-3,-10,10);out.push('사돈댁이 우리 집 형편을 은근히 깔본다 (체면 −3)')}
  p.recs.push({y:S.year,t:sp.f.bg+' '+sp.name+josa(sp.name,'과/와')+' 혼인했다',w:2});
  sp.recs.push({y:S.year,t:S.sur+'씨 집안 '+p.name+josa(p.name,'과/와')+' 혼인했다',w:2});
  S.newsY.push({major:true,t:p.name+' 혼인 — '+sp.f.bg+' '+sp.name});
  return sp;
}
/* 신혼살림: 시대마다 다르다. 1980년대까지 딸은 시집으로 가고 며느리는 우리 집으로 들어온다 */
function marryHome(p){const y=S.year;const r0=rep();
  if(r0&&(p.id===r0.id||p.id===r0.spouse))return 'in';
  if(p.sex==='f'&&y<2000){const bro=S.people.some(q=>q.alive&&!q.inlaw&&q.id!==p.id&&q.gen===p.gen&&q.sex==='m'&&q.parents.some(x=>p.parents.includes(x)));
    const heirs=S.people.filter(q=>q.alive&&!q.inlaw&&q.gen===p.gen&&q.status==='home'&&q.id!==p.id).length;
    if(!heirs)return 'son-in-law';return 'out'}
  if(p.sex==='m'&&y<1990)return 'in';
  return 'ask'}

/* ===================== 시작 ===================== */
const LINEAGES={
  refugee:{name:'함경도 피란민',desc:'보따리 하나로 내려온 부부. 고향 기억 조각을 모으면 이산가족 상봉을 노릴 수 있다.',unlock:0},
  native:{name:'토박이 소작농',desc:'원래 이 동네에 살던 집. 논 한 필지와 이웃 정을 갖고 시작하지만 체면은 낮다.',unlock:1},
  orphan:{name:'전쟁고아가 꾸린 가족',desc:'고아원에서 만난 부부. 친척도 재산도 없지만 식구끼리 정이 깊다.',unlock:2},
  fallen:{name:'몰락한 양반 집안',desc:'불탄 족보와 빚만 남은 집. 체면은 높게 시작하지만 빚이 있다.',unlock:2}
};
const HUNS={
  noguar:{name:'보증은 서지 마라',desc:'보증 부탁을 거절해도 정을 잃지 않지만, 보증을 설 수 없다.'},
  study:{name:'배워야 산다',desc:'자녀 글 한계 +1, 학비 20% 더 든다.'},
  nb:{name:'이웃이 재산이다',desc:'이웃 정이 더 잘 쌓이고 모두와 정 +2로 시작. 돈 10% 적게 시작.'},
  nodebt:{name:'남에게 손 벌리지 마라',desc:'체면 +5로 시작. 빚이 생기면 체면이 두 배로 깎인다.'},
  free:{name:'하고 싶은 거 해라',desc:'바라는 일을 하면 애정이 두 배로 오르지만, 체면은 덜 오른다.'}
};
function newGame(opt){
  opt=opt||{};const town=opt.town||'seoul',lineage=opt.lineage||'refugee',hun=opt.hun||null;
  S={v:5,phase:'title',opt:{town,lineage,hun},town,lineage,hun,sur:opt.sur||pick(SURN),year:1950,turn:0,money:10,face:5,gap:{d:0,f:0,s:0},
     house:'shack',land:0,repu:50,timeDebt:0,loc:null,frag:0,flags:{},people:[],nbs:[],oldNbs:null,ledger:[],log:[],chains:[],resolved:{},
     hand:[],report:null,era:[],mods:[],lastInc:{},pro:0,proVar:null,proOut:null,nid:1,repId:null,curGen:1,
     agendas:[],agendaRes:{},agendaStep:null,inh:null,pages:[],photos:[],notices:[],banner:null,genPass:null,repDied:false,
     goal:null,goalsDone:[],moves:[],place:Object.assign({kind:'origin'},TOWNS[town]),tradeY:0,craftY:0,tradeSt:1,craftSt:1,biz:'stall',
     newsY:[],lastDecade:null,ending:null,step:1};
  const h=mkPerson({sex:'m',birth:1925,gen:1,adult:true,aff:3});
  const w=mkPerson({sex:'f',birth:1927,gen:1,adult:true,aff:3});
  h.spouse=w.id;w.spouse=h.id;h.f.married=w.f.married=true;h.slot='trade';w.slot='home';S.repId=h.id;
  const used=[S.sur];const sur=()=>{const s=pick(SURN.filter(x=>!used.includes(x)));used.push(s);return s};
  S.nbs=Object.keys(NB_ROLES).map(role=>({key:role,role,ch:NB_ROLES[role].ch,sur:sur(),head:genName(NB_ROLES[role].sex,ri(1912,1924)),j:0,since:1950}));
  if(lineage==='native'){landAdd('farm',.8);S.face=8;for(const n of S.nbs)n.j=4;S.money=8}
  if(lineage==='orphan'){S.money=4;S.face=2;h.aff=w.aff=6;h.f.orphan=w.f.orphan=true}
  if(lineage==='fallen'){S.face=28;S.money=-8;S.flags.fallen=1950}
  if(hun==='nb'){for(const n of S.nbs)n.j+=4;S.money*=.9}
  if(hun==='nodebt')S.face+=5;
  jbInit();
  S.era=buildEraSchedule();
  PRO=buildPro();
}
function logIt(t){S.log.unshift({y:S.year,t})}

/* ===================== 턴 흐름 ===================== */
function computeStep(){
  const y=S.year;
  if(S.era.some(e=>!e.done&&e.y===y+1))return 1;
  if(S.chains.some(c=>c.at<=y+1))return 1;
  const r=rep();if(r&&age(r)>=62)return 1;
  if(S.people.some(p=>p.alive&&p.gen<=S.curGen&&age(p)>=68))return 1;
  if(homeAlive().some(p=>!p.inlaw&&[13,18,22].includes(age(p)+1)))return 1;
  if(Math.floor((y+1)/10)!==Math.floor(y/10)&&(y+2)%10===0)return 1;
  return 2;
}
function bestWork(p){if(p.f.retired)return p.f.married?'home':'rest';let best='trade',bv=-1;for(const s of ['trade','craft','study','care']){if(slotOK(p,s))continue;const v=incomeOf(p,s,S.year);if(v>bv){bv=v;best=s}}return best}
function defaultAssign(){
  for(const p of homeAlive()){
    const a=age(p);if(a<7){p.slot='rest';continue}
    const studying=p.f.college&&p.edu<3&&a<=26;
    if(a>=20&&!p.f.adultSet&&p.id!==S.repId){p.f.adultSet=true;if(!studying){p.slot=bestWork(p);continue}}
    if(a>=7&&a<=13&&!p.f.kidSet){p.f.kidSet=true;p.slot='study';continue}
    if(a>=14&&a<=19&&!p.f.teenSet){p.f.teenSet=true;if(S.year>=1975&&!p.f.midDecided){p.f.mid=true;p.f.midDecided=true}p.slot=p.f.mid?'study':'trade';continue}
    if(age(p)>=75&&!p.f.retired){retire(p,'일흔다섯에 일손을 놓았다');S.newsY.push({t:p.name+' 은퇴 ('+age(p)+'세)'});continue}
    // 회사·공장 월급쟁이는 정년이 있다. 장사나 내 공장은 일흔까지 할 수 있다
    if(!p.f.retired&&a>=retAge(S.year)&&(p.slot==='study'&&a>=20||(p.slot==='craft'&&S.craftSt<3)||p.slot==='care')){retire(p,a+'세에 정년퇴직했다');S.newsY.push({major:true,t:p.name+' 정년퇴직 ('+a+'세)'});continue}
    if(!p.f.retired&&a>=70&&['trade','craft'].includes(p.slot)){retire(p,'일흔에 가게·공장 일에서 물러났다');S.newsY.push({major:true,t:p.name+' 은퇴 ('+a+'세)'});continue}
    if(a>=20&&p.slot==='study'&&p.edu<2&&!(p.f.college&&a<=26)&&!p.f.examing&&!p.f.exam&&!p.f.examPick){p.slot=bestWork(p);continue}
    if(slotOK(p,p.slot)==='')continue;
    if(a<=13)p.slot='study';else if(a<=19)p.slot=p.f.mid?'study':'trade';else p.slot=bestWork(p);
  }
}
function startTurn(){
  S.turn++;S.step=computeStep();if(S.year>=2074)S.step=1;
  defaultAssign();S.hand=[];S.newsY=[];
  const dec=Math.floor(S.year/10)*10;
  if(S.lastDecade!==dec){S.lastDecade=dec;const ch=chapterFor(S.year);if(ch)S.notices.push({kind:'chapter',...ch,year:S.year})}
  if(!S.goal&&S.goalAskGen!==S.curGen&&S.turn>4){S.goalAskGen=S.curGen;const o=goalOptions();if(o.length)S.notices.push({kind:'goal',year:S.year,opts:o})}
  for(const e of S.era)if(!e.done&&e.y<=S.year)S.notices.push({kind:'era',eraId:e.id,year:S.year});
  movingNeighbors();
  nextNotice();
}
function nextNotice(){
  while(S.notices.length){
    const n=S.notices[0];
    if(n.kind==='era'&&!n.fired){const e=S.era.find(x=>x.id===n.eraId);if(!e||e.done){S.notices.shift();continue}Object.assign(n,fireEra(e));n.fired=true}
    S.phase='notice';return;
  }
  if(S.afterNotice==='seollal'){S.afterNotice=null;goSeollal();return}
  S.phase='spring';
}
function whoList(who,wc){
  const H=homeAlive();const r=rep();const cg=r?r.gen:S.curGen;let L=[];
  switch(who){
    case 'rep':L=r&&r.status==='home'?[r]:[];break;
    case 'spouse':L=r?H.filter(p=>p.id===r.spouse):[];break;
    case 'adult':L=H.filter(p=>age(p)>=18&&p.id!==S.repId);break;
    case 'elder':L=H.filter(p=>age(p)>=60);break;
    case 'inlaw':L=H.filter(p=>p.inlaw&&p.id!==S.repId&&(!r||p.id!==r.spouse));break;
    case 'kid':L=H.filter(p=>age(p)>=7&&age(p)<=13);break;
    case 'teen':L=H.filter(p=>age(p)>=14&&age(p)<=19&&!p.inlaw);break;
    case 'young':L=H.filter(p=>age(p)<7);break;
    case 'single':L=H.filter(p=>age(p)>=21&&!p.f.married&&!p.inlaw&&p.gen>cg-0&&p.id!==S.repId);break;
    case 'student':L=H.filter(p=>p.slot==='study'&&age(p)>=7&&age(p)<=23);break;
    case 'adultStudy':L=H.filter(p=>age(p)>=18&&p.slot==='study');break;
    case 'adultKid':L=H.filter(p=>p.gen>cg&&age(p)>=18&&!p.inlaw);break;
    case 'grandkid':L=H.filter(p=>p.gen>=cg+2);break;
    case 'worker':L=H.filter(p=>age(p)>=18&&(p.slot==='trade'||p.slot==='craft'));break;
    case 'gen1':L=S.people.filter(p=>p.alive&&p.gen===1&&!p.inlaw);break;
    case 'kidOrTeen':L=H.filter(p=>age(p)>=7&&age(p)<=19&&!p.inlaw);break;
    case 'any':L=H;break;
    case 'kin':L=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&KIN_WHY.includes(p.away.why)&&age(p)>=18&&p.gen>cg&&(!r||age(r)-age(p)>=15));break;
    case 'sib':L=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&KIN_WHY.includes(p.away.why)&&p.gen===cg&&p.id!==S.repId);break;
    case 'estranged':L=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&['의절','갈라섬'].includes(p.away.why)&&p.gen>=cg&&p.id!==S.repId);break;
  }
  if(wc){try{L=L.filter(wc)}catch(e){L=[]}}return L;
}
function nbHalf(n){return Object.assign({},n,{j:n.j/2})}
function pickNb(spec,ncond){
  let L=S.nbs.slice();if(!L.length)return null;
  if(spec==='maxj')L=[L.reduce((a,b)=>b.j>a.j?b:a)];else if(spec==='minj')L=[L.reduce((a,b)=>b.j<a.j?b:a)];
  else if(spec&&spec!=='any')L=L.filter(n=>n.role===spec);
  if(ncond)L=L.filter(n=>{try{return ncond(nbHalf(n))}catch(e){return false}});
  return L.length?pick(L):null;
}
function maxNb(){return S.nbs.length?S.nbs.reduce((a,b)=>b.j>a.j?b:a):null}
const ARMY_RE=/입영|입대|군대에 간다/;const ABROAD_RE=/중동|파견|사막|원양|서독|베트남/;
function cardWhy(card){const t=(typeof card.title==='string'?card.title:'')+' '+(typeof card.text==='string'?card.text:'');
  if(ARMY_RE.test(t))return 'army';if(ABROAD_RE.test(t))return '해외 근무';if(/유학/.test(t))return '유학';if(/기숙사|공단/.test(t))return '공장 기숙사';if(/워킹홀리데이/.test(t))return '해외 체류';if(/시험|재수|학원/.test(t))return '공부';return null}
const widowed=p=>{const sp=p.spouse?P(p.spouse):null;return !sp||!sp.alive};
const SANE=[[/혼자 ?된|홀로 지내|홀로 남|혼자 지내|혼자 사시|홀어머니|홀아버지|홀시|사별/,widowed],[/키를 |키 재|키가 컸|장난감|숙제|운동회|소풍|받아쓰기|통지표|코흘리개|딱지|구슬치기|고무줄놀이|세발자전거|그림일기|어린이날/,p=>age(p)>=3&&age(p)<=15],
 [/백일|돌잡이|돌잔치|첫걸음마|기저귀|젖먹이/,p=>age(p)<=2],[/수능|학력고사|예비고사|대입|고3|재수/,p=>age(p)>=16&&age(p)<=22],
 [/첫 월급|첫 출근/,p=>age(p)>=17&&age(p)<=35],[/환갑/,p=>age(p)>=58&&age(p)<=62],[/칠순|고희/,p=>age(p)>=68&&age(p)<=72],[/팔순/,p=>age(p)>=78&&age(p)<=82],
 [/정년|은퇴|퇴직금/,p=>age(p)>=45],[/노망|치매|틀니|보청기|지팡이/,p=>age(p)>=55],[/사춘기|여드름|교복/,p=>age(p)>=12&&age(p)<=20],
 [/임신|입덧|출산|산후|태교|진통/,p=>p.sex==='f'&&p.f.married&&age(p)>=19&&age(p)<=44],[/며느리/,p=>!(p.sex==='m')],[/사위/,p=>!(p.sex==='f')],
 [/신혼|남편|아내|부부/,p=>p.f.married||p.id===S.repId||(rep()&&p.id===rep().spouse)],[/맞선|중매|혼처|선을 보|소개팅|청혼/,p=>!p.f.married]];
function rawStr(x){if(typeof x==='function'){try{return String(x({})||'')}catch(e){return ''}}return String(x||'')}
function subjText(card){if(card._st!==undefined)return card._st;const t=rawStr(card.title)+' '+rawStr(card.text);
  // 주인공({subj}) 바로 앞뒤 문장만 본다
  const parts=t.split(/(?<=[.!?。])\s+/).filter(x=>/\{subj/.test(x));card._st=parts.join(' ')+(/\{subj/.test(rawStr(card.title))?'':' '+rawStr(card.title));return card._st}
function subjOK(card,p){
  if(card.who){const st=subjText(card);for(const [re,f] of SANE)if(re.test(st)&&!f(p))return false}
  const w=cardWhy(card);
  if(w==='army')return p.sex==='m'&&!p.f.army&&!p.inlaw&&age(p)>=18&&age(p)<=28;
  if(w==='해외 근무'&&p.sex==='m'&&age(p)<=27&&!p.f.army&&S.year>=1953)return false;
  return true}
/* 형편에 맞는 문구: 넉넉한 집에서는 '빚을 내서' 같은 말을 빼고, 빚 선택지는 돈이 없어도 고를 수 있게(빚이 된다) */
const DEBT_RE=/빚을 내서라도 |빚을 내서 |빚을 얻어 |빚내서 /;
const POOR_RE=/쌀독|굶|끼니를 거|돈이 없|형편이 어려|살림이 어려|빠듯|월세가 밀|전당포/;
function rich(){return S.money>=cm(30)}
function chText(t,c){const cost=c.need&&c.need.money?cm(c.need.money):0;
  if(DEBT_RE.test(t)&&S.money>=Math.max(cost,cm(8)))return t.replace(DEBT_RE,'').replace(/^낸다/,'바로 낸다').replace(/^산다/,'바로 산다');
  return t}
function chShow(inst,ci){const def=defOf(inst);const c=def.ch[ci];const raw=inst.ch[ci].raw??inst.ch[ci].t;return chText(raw,c||{})}
/* 돈이 넉넉하면 '빚을 내서' 선택지는 같은 값의 보통 선택지와 겹치므로 숨긴다 */
function chCost(c){const f=typeof c.fx==='object'&&c.fx?c.fx:null;return (c.need&&c.need.money)||(f&&f.money<0?-f.money:0)}
function chHide(inst,ci){const def=defOf(inst);const c=def.ch[ci];if(!c)return false;const raw=inst.ch[ci].raw??inst.ch[ci].t;
  const t=chShow(inst,ci);if(def.ch.some((o,j)=>j<ci&&chShow(inst,j)===t))return true;
  if(!DEBT_RE.test(raw))return false;const cost=chCost(c);
  return def.ch.some((o,j)=>j!==ci&&!DEBT_RE.test(inst.ch[j].raw??inst.ch[j].t)&&o.need&&o.need.money&&Math.abs(o.need.money-cost)<=cost*.35&&!needOK(o.need))}
function chDebt(inst,ci){return /빚을 내|빚을 얻|빚내/.test(chShow(inst,ci))}
function chNeed(inst,ci){const def=defOf(inst);const c=def.ch[ci];if(!c)return '';if(chDebt(inst,ci))return '';return needOK(c.need)}
function makeInst(card,pre){
  pre=pre||{};const ctx={};
  if(card.y&&!(S.year>=card.y[0]&&S.year<=card.y[1])&&!pre.chain)return null;
  if(card.who){let subj=pre.subj?P(pre.subj):null;
    if(subj&&card.who==='kin'&&rep()&&subj.gen<=rep().gen)return null;
    if(subj&&!(subj.alive&&(subj.status==='home'||card.awayOK)))subj=null;
    if(subj&&card.wc){let ok=true;try{ok=!!card.wc(subj)}catch(e){ok=false}if(!ok){if(pre.chain)return null;subj=null}}
    if(subj&&!subjOK(card,subj))subj=null;
    if(!subj){const L=whoList(card.who,card.wc).filter(p=>subjOK(card,p)&&!(pre.busy&&pre.busy.has(p.id)));if(!L.length)return null;subj=pick(L)}ctx.subj=subj}
  if(card.nb||pre.nb){let nb=pre.nb?S.nbs.find(n=>n.key===pre.nb):pickNb(card.nb,card.ncond);
    if(nb&&card.ncond){try{if(!card.ncond(nbHalf(nb)))nb=null}catch(e){nb=null}}
    if(!nb)return null;ctx.nb=nb}
  if(card.cond){try{if(!card.cond(ctx))return null}catch(e){return null}}
  {const tx=typeof card.text==='string'?card.text:'';if(POOR_RE.test(tx)&&rich()&&!pre.chain)return null}
  let title,text,ch;try{title=fill(card.title,ctx);text=fill(card.text,ctx);ch=card.ch.map(c=>({raw:fill(c.t,ctx),t:fill(c.t,ctx)}))}catch(e){return null}
  if(S.hun==='noguar'&&/보증/.test(title))return null;
  return {cid:card.id,slot:card.slot,title,text,subj:ctx.subj?ctx.subj.id:null,nb:ctx.nb?ctx.nb.key:null,ch,major:!!card.major,done:false,out:null};
}
function defOf(inst){return CARD_BY_ID[inst.cid]}
function handSize(){
  const H=homeAlive();let n=4+Math.floor(H.length/3)+(R()<.5?1:0)+(S.notices.length?0:0);
  if(S.step>1)n+=1;return clamp(n,4,9);
}
/* 카드 뽑기: 같은 카드가 되풀이되지 않게 한다
   - 한 번 해결한 일반 카드는 다시 안 나온다
   - 반복 카드는 한 번 나오면 10년 동안 쉬고, 한 판에 3번까지(분가 식구 카드는 4번)
   - 빈칸 메우기 카드는 정말 쓸 카드가 없을 때만, 그것도 8년에 한 번 */
/* 오래 걸쳐 있는 이야기 카드는 한 세대(25년) 뒤 다른 식구에게 한 번 더 나올 수 있다 */
function longAgain(c,sh){return !c.major&&c.y&&c.y[1]-c.y[0]>=25&&(sh.n||0)<3&&S.year-sh.last>=(c.nb?20:15)}
function canShow(c){
  const sh=(S.shown||{})[c.id];if(!sh)return true;
  if(!c.rep)return longAgain(c,sh);
  const max=/^k-/.test(c.id)?4:/^f-/.test(c.id)?99:3;const cool=/^f-/.test(c.id)?8:/^k-/.test(c.id)?6:10;
  return sh.n<max&&S.year-sh.last>=cool;
}
function markShown(inst){S.shown=S.shown||{};const sh=S.shown[inst.cid]||{n:0,last:-99};sh.n++;sh.last=S.year;S.shown[inst.cid]=sh}
function drawHand(){
  const n=handSize();const hand=[];const used=new Set();
  const due=S.chains.filter(c=>c.at<=S.year);
  for(const c of due.slice(0,3)){const card=CARD_BY_ID[c.id];S.chains.splice(S.chains.indexOf(c),1);if(!card)continue;
    const inst=makeInst(card,{subj:c.subj,nb:c.nb,chain:true});if(inst){inst.chainTag=true;hand.push(inst);used.add(inst.cid)}}
  const elig=CARDS.filter(c=>!c.chainOnly&&canShow(c)&&(!c.y||(S.year>=c.y[0]&&S.year<=c.y[1])));
  const slots=['가족','자녀','동네','시대','집안'].concat(shuffle(['집안','가족','자녀','동네','공통','시대','집안','공통','가족']));
  const tryPick=list=>{const busy=new Set(hand.filter(h=>h.subj).map(h=>h.subj));
    const L=shuffle(list.filter(c=>!used.has(c.id)));const fresh=L.filter(c=>!c.rep),reps=L.filter(c=>c.rep);
    const order=fresh.concat(reps.filter(()=>R()<.6)).concat(reps);
    for(const c of order){const inst=makeInst(c,{busy});if(inst)return inst}return null};
  for(const slot of slots){
    if(hand.length>=n)break;
    let inst=tryPick(elig.filter(c=>slot==='공통'||c.slot===slot));
    if(!inst)inst=tryPick(elig);
    if(inst){used.add(inst.cid);hand.push(inst)}else break;
  }
  if(hand.length<4){// 쓸 카드가 모자라면 가장 오래전에 나온 반복 카드부터
    const last=c=>((S.shown||{})[c.id]||{last:-99}).last;
    const cnt=c=>((S.shown||{})[c.id]||{n:0}).n||0;
    const back=shuffle(CARDS.filter(c=>c.rep&&!c.chainOnly&&!used.has(c.id)&&S.year-last(c)>=7&&cnt(c)<5&&(!c.y||(S.year>=c.y[0]&&S.year<=c.y[1])))).sort((a,b)=>cnt(a)-cnt(b)||last(a)-last(b));
    const busy=new Set(hand.filter(h=>h.subj).map(h=>h.subj));
    for(const c of back){if(hand.length>=4)break;const inst=makeInst(c,{busy});if(inst){used.add(c.id);hand.push(inst)}}
    const fl=[].concat(...Object.values(FILLER)).filter(f=>!used.has(f.id)).sort((a,b)=>last(a)-last(b));
    for(const f of fl){if(hand.length>=4)break;const inst=makeInst(f);if(inst){used.add(f.id);hand.push(inst)}}}
  for(const h of hand)markShown(h);
  hand.sort((a,b)=>(b.major?1:0)-(a.major?1:0));
  S.hand=hand;
}
function curCard(){return S.hand.findIndex(h=>!h.done)}
function resolveCard(i,ci){
  const inst=S.hand[i];if(!inst||inst.done||i!==curCard())return;
  const def=defOf(inst);let c=def.ch[ci];
  if(ci===-1){if(def.ch.some((x,k)=>!chNeed(inst,k)))return;c={fx:{}}}
  if(!c||(ci>=0&&chNeed(inst,ci)))return;
  const ctx={subj:inst.subj?P(inst.subj):null,nb:inst.nb?S.nbs.find(n=>n.key===inst.nb):null};
  const w=cardWhy(def);if(w==='army')ctx.army=true;else if(w)ctx.why=w;
  const out=[];try{applyFx(c.fx,ctx,out)}catch(e){out.push('(효과 처리 오류)')}
  if(ctx.subj&&ctx.subj.alive&&age(ctx.subj)>=45&&/퇴직|은퇴|정년/.test(rawStr(def.title)+' '+rawStr(def.text))&&!/재취업|다시 일/.test(chShow(inst,Math.max(0,ci)))){retire(ctx.subj,'일에서 물러났다');out.push(ctx.subj.name+josa(ctx.subj.name,'은/는')+' 이제 일을 하지 않는다')}
  skipGone();
  const shown=ci===-1?'형편이 안 돼 넘겼다':moneyText(chShow(inst,ci));
  inst.done=true;inst.out={choice:shown,msgs:out};
  if(!def.rep)S.resolved[inst.cid]=true;
  logIt(inst.title+': '+inst.out.choice);
}
function skipGone(){for(const h of S.hand){if(h.done||!h.subj)continue;const p=P(h.subj);if(p&&p.alive&&(p.status==='home'||CARD_BY_ID[h.cid]&&CARD_BY_ID[h.cid].awayOK))continue;
  h.done=true;h.skipped=true;h.out={choice:'없던 일이 됐다',msgs:[p?(p.alive?p.name+josa(p.name,'이/가')+' 집에 없어 넘어갔다':p.name+josa(p.name,'이/가')+' 세상을 떠나 넘어갔다'):'넘어갔다']}}}
function autoRest(){let g=0;while(curCard()>=0&&g++<12){const i=curCard();const def=defOf(S.hand[i]);
  let best=-1;def.ch.forEach((c,ci)=>{if(best<0&&!chNeed(S.hand[i],ci))best=ci});resolveCard(i,best)}}

/* ===================== 가을 정산 ===================== */
function deathAge(y){return interp([[1950,57],[1970,61],[1990,66],[2010,72],[2030,76],[2050,80]],y)}
/* 본가에 사는 다 큰 자식은 벌이를 다 내놓지 않는다 */
function contribRate(p){const r0=rep(),a=age(p);if(r0&&p.id!==r0.id&&p.id!==r0.spouse&&p.gen>r0.gen&&a>=20)return p.f.married||(p.spouse&&P(p.spouse))?.25:a>=25?.45:.75;return 1}
/* 봄에 보여 줄 한 해 예상: simulate 와 같은 셈법, 운은 평균값으로 */
function forecast(){const yr=S.year,H=homeAlive(),pb=prod(yr)*PAY,F={work:0,pension:0,help:0,rent:0,nb:0,kin:0,fee:0,base:0,crowd:0,care:0,house:0,upkeep:0,tax:0,spend:0,overCap:0,kept:0};
  const traders=H.filter(p=>p.slot==='trade'&&age(p)>=12);const cap=S.tradeSt+1;const rank=traders.slice().sort((a,b)=>incomeOf(b,'trade',yr)-incomeOf(a,'trade',yr)).map(p=>p.id);
  let tradeInc=0;
  for(const p of H){const a=age(p);F.base+=(a<14?1.5:3)*liveF(yr);const slot=a<7?'rest':p.slot;
    if(a>=60&&slot==='home')F.pension+=pensionOf(p,yr);
    if(a>=7){let v=incomeOf(p,slot,yr);if(slot==='trade'&&rank.indexOf(p.id)>=cap){F.overCap+=v*.55;v*=.45}
      const cr=contribRate(p);F.kept+=v*(1-cr);v*=cr;F.work+=v;if(slot==='trade')tradeInc+=v;F.fee+=feeOf(p,slot,yr);
      if(slot==='help'&&a>=12)F.help+=.3*1.2*pb}}
  F.rent=landRent(yr)+(S.rents||[]).filter(x=>x.until>=yr).reduce((a,x)=>a+x.v,0);
  for(const n of S.nbs){if(n.j>=11&&tradeInc>0)F.nb+=tradeInc*.04;if(n.j>=15)F.nb+=.3*1.2*pb}
  const rg=rep()?rep().gen:S.curGen;
  for(const p of S.people)if(p.alive&&!p.inlaw&&p.status==='away'&&p.away&&KIN_WHY.includes(p.away.why)&&p.gen>rg&&p.aff>=2&&age(p)>=25&&age(p)<70)F.kin+=.6*(1.5+p.aff*.2)*prod(yr)*PAY*1.3*(p.f.housed?1.4:1);
  if(H.length>6)F.crowd=(H.length-6)*.8*liveF(yr);
  const carer=H.some(p=>p.slot==='home'&&age(p)>=18&&age(p)<75),nbCare=S.nbs.some(n=>n.j>=11);
  for(const o of H.filter(p=>age(p)>=75)){let c=1.5*liveF(yr);if(carer)c*=.35;if(nbCare)c*=.8;if(S.timeDebt>0)c*=.3;F.care+=c}
  if(S.house!=='shack')F.house+=.6*liveF(yr);if(S.flags.fridge&&H.length>=3)F.house-=.25*liveF(yr);
  const nT=H.filter(p=>p.slot==='trade'&&age(p)>=14).length,nC=H.filter(p=>p.slot==='craft'&&age(p)>=14).length;
  F.upkeep=(nT?[0,3,8][S.tradeSt-1]*pb:0)+(nC?[0,0,9][S.craftSt-1]*pb:0);
  F.inc=F.work+F.pension+F.help+F.rent+F.nb+F.kin;
  F.tax=.15*Math.max(0,F.inc-35*pb)+.12*Math.max(0,F.inc-80*pb);
  F.spend=.2*Math.max(0,F.inc)+.02*Math.max(0,S.money);
  F.out=F.fee+F.base+F.crowd+F.care+F.house+F.upkeep+F.tax+F.spend;F.net=F.inc-F.out;return F}
/* 식구 자리 맞추기: 혼인해 들어온 사람은 짝을 따라가고, 어린아이는 부모를 따라간다 */
const HOUSE_WHY=['출가','분가','갈라섬','의절','상경','타지','귀촌','사랑을 따라','부모 따라','이민','제 길'];
function familySync(){
  for(const p of S.people){if(!p.alive||p.inlaw)continue;const sp=p.spouse?P(p.spouse):null;if(!sp||!sp.alive||!sp.inlaw)continue;
    if(p.status!=='home'&&p.away&&HOUSE_WHY.includes(p.away.why)&&sp.status==='home'){sp.status='away';sp.away={why:p.away.why,until:null}}
    else if(p.status==='home'&&sp.status!=='home'&&sp.away&&HOUSE_WHY.includes(sp.away.why)){sp.status='home';sp.away=null}}
  for(const c of S.people){if(!c.alive||c.inlaw||age(c)>=18)continue;const ps=c.parents.map(P).filter(q=>q&&q.alive);if(!ps.length)continue;
    const away=ps.every(q=>q.status!=='home'&&q.away&&['출가','분가','갈라섬','의절','이민','귀촌'].includes(q.away.why));
    if(away&&c.status==='home'){c.status='away';c.away={why:'부모 따라',until:null}}
    else if(!away&&ps.some(q=>q.status==='home')&&c.status!=='home'&&c.away&&c.away.why==='부모 따라'){c.status='home';c.away=null}}}
function simulate(years){familySync();
  const rp={summer:S.springM!=null?S.money-S.springM:0,fcNet:S.springF,y0:S.year,y1:S.year+years-1,inc:{},fee:0,live:0,care:0,start:S.money,startNW:netWorth(),notes:[],major:S.newsY.slice(),slotName:{},births:[],grow:{},erosion:0,interest:0};
  for(const p of S.people)p.grow={};
  for(let i=0;i<years;i++){
    const yr=S.year;const H=homeAlive();let inc=0,fee=0,live=0;
    // 올해 장사 운: 눈썰미 좋은 식구가 있으면 평균이 오르고, 모험심이 크면 폭이 커진다
    const traders=H.filter(p=>p.slot==='trade'&&age(p)>=12);
    const eye=traders.length?Math.max(...traders.map(p=>p.tal.눈썰미)):5,adv=traders.length?traders.reduce((a,p)=>a+p.pers.모험,0)/traders.length:5;
    const g=(R()+R()+R()-1.5)/0.87;const luck=clamp(1+.025*(eye-5)+g*.28*bizOf().v*(1+.06*(adv-5)),.3,2.1);
    const cap=S.tradeSt+1;const tradeRank=traders.slice().sort((a,b)=>incomeOf(b,'trade',yr)-incomeOf(a,'trade',yr)).map(p=>p.id);
    if(traders.length){rp.luck=rp.luck||[];rp.luck.push(Math.round(luck*100))}
    for(const p of H){
      const a=age(p);live+=(a<14?1.5:3)*liveF(yr);
      const slot=a<7?'rest':p.slot;
      if(a>=60&&slot==='home'){const pv=pensionOf(p,yr);if(pv>0){inc+=pv;rp.inc[p.id]=(rp.inc[p.id]||0)+pv;rp.slotName[p.id]='연금'}}
      if(a>=7){p.hist[slot]=(p.hist[slot]||0)+1;rp.slotName[p.id]=slotLabel(p,slot,yr);
        let v=incomeOf(p,slot,yr);if(slot==='trade'){v*=luck;if(tradeRank.indexOf(p.id)>=cap)v*=.45}
        if(slot==='craft'&&p.tal.몸<4&&R()<.03){p.tal.몸=Math.max(0,p.tal.몸-1);v*=.5;rp.notes.push(p.name+josa(p.name,'이/가')+' 일하다 다쳤다 (몸 −1)')}
        v*=contribRate(p);inc+=v;rp.inc[p.id]=(rp.inc[p.id]||0)+v;fee+=feeOf(p,slot,yr);
        if(slot==='trade')S.tradeY+=a>=14?1:.5;if(slot==='craft')S.craftY+=a>=14?1:.5;
        if(slot==='study'){if(a<=13)p.sy.e++;else if(a<=19&&p.f.mid)p.sy.m++;else if(p.f.college&&p.edu<3&&a<=26)p.sy.c++}
        if((slot==='help'||slot==='care')&&S.nbs.length&&R()<.5){const n=pick(S.nbs);n.j=clamp(n.j+ri(1,2),-20,20)}
        if(slot==='care'&&yr>=2030)S.timeDebt+=1;
        if(slot==='help'||slot==='care')routeAdd('jeong',.3);if(slot==='craft'&&p.tal.손재주>=7)routeAdd('craft',.15);if(slot==='study'&&p.edu>=3)routeAdd('learn',.1);
        if(a>=14&&p.id!==S.repId){
          if(ALIGN[p.desire].includes(slot)){p.mis=0;p.affAcc+=S.hun==='free'?1:.5;if(p.affAcc>=1){p.aff=clamp(p.aff+1,-10,10);p.affAcc=0}}
          else{p.mis++;const lim=p.pers.온화>=7?4:p.pers.고집>=7?2:3;if(p.mis>=lim)p.grudge=clamp(p.grudge+1,0,10)}}
        if(p.f.official)S.face+=.2;if(p.edu>=3)S.face+=.08;
      }
      grow(p,slot,yr);
      // 일하지 않는 일의 쓸모
      if(slot==='rest'&&a>=7){if(p.f.sick&&R()<.45){p.f.sick=false;rp.notes.push(p.name+josa(p.name,'이/가')+' 푹 쉬고 병을 털었다')}
        if(p.tal.몸<p.cap.몸&&R()<.5)p.tal.몸=Math.min(p.cap.몸,p.tal.몸+.3+R()*.4);p.grudge=Math.max(0,p.grudge-(R()<.5?1:0));if(R()<.5)p.aff=clamp(p.aff+1,-10,10)}
      if(slot==='home'&&a>=14){for(const q of H)if(q.id!==p.id&&age(q)<12&&R()<.35){const k=pick(['마음씨','말솜씨','글']);if(q.tal[k]<q.cap[k])q.tal[k]=Math.min(q.cap[k],q.tal[k]+.4)}
        if(R()<.35){const q=pick(H);if(q&&q.id!==p.id)q.aff=clamp(q.aff+1,-10,10)}}
      if(slot==='help'&&a>=12){if(S.nbs.length){const n=pick(S.nbs);n.j=clamp(n.j+ri(1,2),-20,20)}if(R()<.3){const g2=1.2*prod(yr)*PAY;inc+=g2;rp.gift=(rp.gift||0)+g2;rp.notes.push(p.name+'의 품앗이에 이웃이 먹을거리를 보내왔다')}}
      p.f.workY=['trade','craft','study','care'].includes(slot)&&a>=50?(p.f.workY||0)+1:0;
      if(p.f.workY>=6&&R()<.15){p.tal.몸=Math.max(0,p.tal.몸-.6);rp.notes.push(p.name+josa(p.name,'이/가')+' 쉬지 않고 일해 몸이 축났다 (몸 −6)')}
    }
    // 밖에 사는 식구도 제 일을 하며 자란다
    for(const p of S.people)if(p.alive&&p.status==='away'&&age(p)>=7&&R()<.7)grow(p,age(p)<20?'study':(p.slot&&p.slot!=='rest'?p.slot:'trade'),yr);
    {const rx=(S.rents||[]).filter(x=>x.until>=yr).reduce((a,x)=>a+x.v,0);if(rx>0){inc+=rx;rp.rent=(rp.rent||0)+rx}}
    {const rent=landRent(yr)*((S.lands||[]).some(p=>p.vacant&&yr-p.vacant<2)?.5:1);if(rent>0){inc+=rent;rp.rent=(rp.rent||0)+rent}}
    // 이웃 정이 돌려주는 것
    {const pbb=prod(yr)*PAY;const tradeInc=H.filter(p=>p.slot==='trade').reduce((a,p)=>a+(rp.inc[p.id]||0),0)/Math.max(1,i+1);
     for(const n of S.nbs){const lv=n.j;
      if(lv>=11&&tradeInc>0){const g3=tradeInc*.04;inc+=g3;rp.nbGain=(rp.nbGain||0)+g3}
      if(lv>=15&&R()<.3){const g3=1.2*pbb;inc+=g3;rp.nbGain=(rp.nbGain||0)+g3;if(i===0)rp.notes.push(nbName(n)+josa(nbName(n),'이/가')+' '+pick(S.year<1990?['김장 김치를 나눠 줬다','쌀 한 말을 보내왔다','아이들 옷을 물려줬다']:['반찬을 나눠 줬다','아이를 봐 줬다','집수리를 거들어 줬다'])+' ('+wonY(g3)+'어치)')}
      if(lv<=-10){S.face=Math.max(0,S.face-.6);if(i===0)rp.notes.push(nbName(n)+josa(nbName(n),'이/가')+' 우리 집 험담을 하고 다닌다 (체면 −0.6/년)')}
     }}
    // 분가: 결혼한 자식은 시대가 갈수록 따로 나가 산다. 어른을 모실 한 집(맏이나 대표 쪽)은 남는다
    {const rr=rep();const old70=H.some(q=>age(q)>=70);
     const stayer=H.filter(q=>!q.inlaw&&q.f.married&&rr&&q.gen>rr.gen).sort((x,y)=>(y.f.heir?1:0)-(x.f.heir?1:0)||x.birth-y.birth)[0];
     for(const p of H){if(p.inlaw||!rr||p.gen<=rr.gen||p.id===S.repId)continue;const a=age(p);
       const keep=stayer&&p.id===stayer.id&&(yr<1995||old70)&&!(yr>=2010&&!old70);
       if(p.f.married&&!keep){const pr=yr<1965?.08:yr<1980?.25:yr<1995?.4:.55;
         if(R()<pr){moveOut(p,'분가');rp.notes.push(p.name+' 부부가 따로 살림을 났다')}}
       else if(!p.f.married&&yr>=1990&&a>=(yr<2010?29:27)&&R()<(yr<2010?.12:.2)){moveOut(p,'타지');rp.notes.push(p.name+josa(p.name,'이/가')+' 혼자 나가 살기로 했다')}
     }}
    // 한집에 식구가 너무 많으면 비좁고 다툼이 잦다
    if(H.length>6){const ex=H.length-6;live+=ex*.8*liveF(yr);
      if(R()<.12*ex){const q=pick(H.filter(x=>x.inlaw||age(x)>=15));if(q){q.grudge=clamp(q.grudge+1,0,10);q.aff=clamp(q.aff-1,-10,10);if(i===0)rp.notes.push('식구가 '+H.length+'명이라 집이 비좁다. '+q.name+josa(q.name,'이/가')+' 불편해한다')}}}
    // 따로 사는 식구: 정이 있으면 용돈을 부치고 어른을 찾아온다. 정이 없으면 멀어진다
    const rg=rep()?rep().gen:S.curGen;
    for(const p of S.people){if(!p.alive||p.inlaw||p.status!=='away'||!p.away||!KIN_WHY.includes(p.away.why)||age(p)<20)continue;
      if(p.gen>rg&&p.aff>=2&&age(p)>=25&&age(p)<70&&R()<.6){const g2=(1.5+p.aff*.2)*prod(yr)*PAY*1.3*(p.f.housed?1.4:1);inc+=g2;rp.kin=(rp.kin||0)+g2}
      if(p.aff>=1&&R()<.4){const e=H.find(q=>age(q)>=60&&q.parents.length===0||p.parents.includes(q.id));if(e)e.aff=clamp(e.aff+1,-10,10)}
      if(p.aff<=-3&&R()<.15&&p.away.why==='분가'){p.away.why='갈라섬';rp.notes.push('따로 사는 '+p.name+josa(p.name,'과/와')+' 발길이 끊겼다')}
      if(p.grudge>0&&p.aff>=2&&R()<.3)p.grudge--;
      if(R()<.12)p.aff=clamp(p.aff-1,-10,10);}
    // 노인 돌봄
    const old=S.people.filter(p=>p.alive&&p.status==='home'&&age(p)>=75);
    const carer=H.some(p=>p.slot==='home'&&age(p)>=18&&age(p)<75);
    const nbCare=S.nbs.some(n=>n.j>=11);for(const o of old){let c=1.5*liveF(yr);if(carer)c*=.35;if(nbCare)c*=.8;if(S.timeDebt>0){S.timeDebt--;c*=.3}live+=c;rp.care+=c}
    if(S.house!=='shack')live+=.6*liveF(yr);
    if(S.flags.fridge&&H.length>=3)live-=.25*liveF(yr);
    // 씀씀이는 버는 만큼 커지고, 많이 벌면 세금이 붙는다. 가게·공장은 유지비가 든다
    const pb=prod(yr)*PAY;const nT=H.filter(p=>p.slot==='trade'&&age(p)>=14).length,nC=H.filter(p=>p.slot==='craft'&&age(p)>=14).length;
    const upkeep=(nT?[0,3,8][S.tradeSt-1]*pb:0)+(nC?[0,0,9][S.craftSt-1]*pb:0);
    if(S.tradeSt>1){S.idleT=nT?0:(S.idleT||0)+1;if(S.idleT>=3){S.tradeSt--;S.idleT=0;rp.major.push({major:true,t:'가게를 볼 사람이 없어 가게를 줄였다'})}}
    if(S.craftSt>2){S.idleC=nC?0:(S.idleC||0)+1;if(S.idleC>=3){S.craftSt--;S.idleC=0;rp.major.push({major:true,t:'공장을 돌릴 사람이 없어 공장을 정리했다'})}}
    const tax=.15*Math.max(0,inc-35*pb)+.12*Math.max(0,inc-80*pb);
    live+=.2*Math.max(0,inc)+tax+upkeep+.02*Math.max(0,S.money);rp.upkeep=(rp.upkeep||0)+upkeep;rp.tax=(rp.tax||0)+tax;
    if(S.tradeSt>=3)S.face+=.25;if(S.craftSt>=3)S.face+=.25;
    for(const p of H)examYear(p,rp);
    S.money+=inc-fee-live;rp.fee+=fee;rp.live+=live;rp.incTot=(rp.incTot||0)+inc;S.lastY={y:yr,inc,out:live+fee};
    // 물가와 이자: 장롱 돈은 물가만큼 가치가 깎이고, 통장 돈은 이자가 붙는다
    const pi=inflation(yr);
    if(S.money>0){const r=S.flags.savings?savRate(yr):0;const before=S.money;S.money=S.money*(1+r)/(1+pi);
      const d=S.money-before;if(d<0)rp.erosion+=-d;else rp.interest+=d}
    else if(S.money<0){const r=savRate(yr)+.04;S.money=S.money*(1+r)/(1+pi)}
    if(S.money<-35*prod(yr)){const helper=S.nbs.filter(n=>n.j>=15&&!(S.nbLoan&&S.nbLoan[n.key]&&yr-S.nbLoan[n.key]<15))[0];
      if(helper){const v=20*prod(yr)*PAY;S.money+=v;helper.j=clamp(helper.j-4,-20,20);(S.nbLoan=S.nbLoan||{})[helper.key]=yr;S.ledger.unshift({y:yr,nb:nbName(helper),t:'빚에 몰렸을 때 돈을 빌려줌',d:-4});
        rp.major.push({major:true,t:nbName(helper)+josa(nbName(helper),'이/가')+' 선뜻 돈을 빌려줘 고비를 넘겼다 ('+sgW(v)+', 정 −4)'})}
    }
    if(S.money<-35*prod(yr)){
      if(S.land>0){const lp=landRemove();const v=parcelVal(lp)*.85+(lp.bld?bldVal()*.8:0);S.money+=v;rp.major.push({major:true,t:'빚을 갚으려고 땅 한 필지를 팔았다 ('+sgW(v)+')'})}
      else if(S.house!=='shack'){const v=houseVal()*.8;S.money+=v;S.house='shack';S.face=clamp(S.face-6,0,100);rp.major.push({major:true,t:'빚잔치 끝에 집을 넘기고 셋방으로 나앉았다 (체면 −6)'});const r0=rep();if(r0)r0.recs.push({y:yr,t:'빚에 몰려 집을 넘겼다',w:4})}
      else{S.money=-15*prod(yr);S.face=clamp(S.face-8,0,100);rp.major.push({major:true,t:'빚을 감당하지 못해 파산했다. 빚 일부를 탕감받았다 (체면 −8)'});const r0=rep();if(r0)r0.recs.push({y:yr,t:'빚을 못 이겨 파산했다',w:4})}
    }
    if(S.money<-8*prod(yr)*PAY){const d=S.hun==='nodebt'?1.5:.7;S.face-=d;if(i===0)rp.notes.push('빚이 많아 동네에서 수군거린다 (체면 −'+d+'/년)')}
    // 체면은 가만두면 조금씩 내려간다 (유지하려면 계속 애써야 한다)
    if(S.face>35)S.face-=(S.face-35)*.055;
    S.face=clamp(S.face,0,100);
    if(yr>=2000&&S.tradeSt>=2)S.repu=clamp(S.repu+(S.repu<50?.8:-.6),0,100);
    for(const p of S.people)if(p.alive&&p.f.forged&&!p.f.exposed&&R()<.05){p.f.exposed=true;S.face=clamp(S.face-15,0,100);S.flags.exposed=yr;
      p.recs.push({y:yr,t:'산 졸업장이 들통났다',w:4});rp.major.push({major:true,t:p.name+'의 졸업장 위조가 들통났다 (체면 −15)'})}
    for(const p of S.people){if(!p.alive)continue;const a=yr-p.birth;
      if(p.status==='home'){
        if(a===13&&p.sy.e>=4&&p.edu<1){p.edu=1}
        if(a>=19&&p.sy.m>=4&&p.edu<2){p.edu=2;rp.notes.push(p.name+' 고등학교 졸업');p.recs.push({y:yr,t:'고등학교를 마쳤다',w:1})}
        if(p.f.college&&p.sy.c>=3&&p.edu<3){p.edu=3;p.slot='study';S.face=clamp(S.face+2,0,100);rp.major.push({major:true,t:p.name+' 대학 졸업 (체면 +2)'});
          const first=!S.people.some(q=>q.id!==p.id&&q.edu>=3&&!q.inlaw);p.recs.push({y:yr,t:first?'집안에서 처음으로 대학을 나왔다':'대학을 나왔다',w:first?3:1})}
      }
      if(a+1===7&&!p.inlaw)rp.notes.push(p.name+josa(p.name,'이/가')+' 학교 갈 나이가 됐다');
      if(a+1===10&&!p.inlaw)rp.notes.push(p.name+': '+DESIRE_HINT[p.desire]);
      if(a+1===16&&!p.inlaw)rp.notes.push(p.name+'의 능력치가 이제 정확히 보인다');
      if(a+1===18&&!p.f.desireKnown){p.f.desireKnown=true;rp.notes.push(p.name+josa(p.name,'이/가')+' 바라는 것: '+p.desire)}
      if(p.status==='away'&&p.away&&p.away.until&&yr+1>=p.away.until){
        // 다 큰 자식은 돌아와도 제 살림을 차리는 일이 많다(시대가 갈수록)
        const rr=rep();const own=!p.inlaw&&rr&&p.gen>rr.gen&&(p.f.married||a>=(yr<1985?32:yr<2005?28:26));
        const pr=yr<1975?.15:yr<1990?.45:yr<2010?.7:.8;
        if(own&&R()<pr){p.away={why:p.f.married?'분가':'타지',until:null};rp.notes.push(p.name+josa(p.name,'이/가')+' 돌아와서는 '+(p.f.married?'따로 살림을 차렸다':'혼자 나가 살기로 했다'))}
        else{p.status='home';p.away=null;rp.notes.push(p.name+josa(p.name,'이/가')+' 집으로 돌아왔다')}}
    }
    // 징병
    if(yr>=1953)for(const p of S.people){if(!p.alive||p.inlaw||p.sex!=='m'||p.f.army||p.id===S.repId)continue;const a=yr-p.birth;
      if(a<20||a>27)continue;if(p.f.college&&p.edu<3&&a<=22)continue;if(a<23&&R()>.6)continue;
      if(p.status!=='home'){if(p.away&&['이민','해외 정착','유학','해외 체류','의절'].includes(p.away.why))continue;
        if(p.away&&p.away.until)continue;p.f.army=true;p.recs.push({y:yr,t:'군대에 다녀왔다',w:1});rp.notes.push(p.name+josa(p.name,'이/가')+' 객지에서 입대했다');continue}
      const n=yr<1970?3:yr<2000?3:yr<2020?2:1.5;p.f.army=true;p.status='away';p.away={why:'군대',until:Math.ceil(yr+n)};
      p.recs.push({y:yr,t:yr<1970?'전쟁 끝난 지 얼마 안 된 군대에서 3년을 복무했다':'군대에 다녀왔다',w:1});rp.major.push({major:true,t:p.name+' 입대 ('+Math.ceil(n)+'년)'})}
    // 출생
    const bp=yr<1965?.28:yr<1975?.18:yr<1990?.12:yr<2010?.09:yr<2040?.07:.06;const maxK=yr<1965?5:yr<1975?4:yr<1990?3:2;
    for(const m of S.people){
      if(m.sex!=='f'||!m.alive||!m.f.married)continue;const sp=P(m.spouse);if(!sp||!sp.alive||sp.status!==m.status)continue;
      if(m.status!=='home'&&!(m.away&&['분가','갈라섬','상경','이민','타지'].includes(m.away.why)))continue;
      const a=yr-m.birth;if(a<20||a>41)continue;const kids=S.people.filter(c=>c.parents.includes(m.id)).length;if(kids>=maxK)continue;
      let pr=bp;if(kids===0&&a>=26)pr*=2.6;if(kids===0&&a>=32)pr*=1.6;if(kids===1&&a>=30&&yr>=1990)pr*=1.3;
      if(R()<pr){const sex=R()<.5?'m':'f';const gen=Math.max(m.gen,sp.gen)+1;
        const c=mkPerson({sex,birth:yr,gen,parents:[m.id,sp.id],aff:3,sur:sp.sur||S.sur});c.f.newborn=m.status==='home';
        if(m.status!=='home'){c.status='away';c.away={why:m.away.why,until:null};rp.notes.push(sp.name+'·'+m.name+' 부부('+m.away.why+')에게 '+(sex==='m'?'아들':'딸')+' '+c.name+josa(c.name,'이/가')+' 태어났다');continue}
        rp.births.push({id:c.id,parents:sp.name+'·'+m.name,y:yr});
        const first=!S.people.some(q=>q.id!==c.id&&q.gen===gen&&!q.inlaw);if(first&&gen>=2)rp.major.push({major:true,t:(gen-1)+'세대의 첫 아이가 태어났다'})}
    }
    // 사망
    const T=deathAge(yr);
    for(const p of S.people){if(!p.alive)continue;const a=yr-p.birth;
      let pd=a>=T?.012+(a-T)*.012:a>=40?.003:a<7?.0015:.0008;if(p.f.sick)pd+=.035;if(a>=55){if(p.slot==='rest')pd*=.8;else if(['trade','craft','study','care'].includes(p.slot))pd*=1.15}if(a>=75&&carer)pd*=.85;if(p.tal.몸<2.5)pd*=1.3;pd=Math.min(pd,.55);
      if(R()<pd){p.alive=false;p.death=yr;rp.major.push({major:true,t:p.name+' ('+a+'세) 세상을 떠났다',death:true});logIt(p.name+' 별세');if(p.id===S.repId)S.repDied=true}}
    S.year++;
    if(S.repDied)break;
  }
  for(const p of S.people){const g=Object.entries(p.grow).filter(([k,v])=>v>0);if(g.length&&p.alive)rp.grow[p.id]=g}
  rp.end=S.money;rp.endNW=netWorth();rp.yEnd=S.year-1;S.lastInc=rp.inc;S.report=rp;
}

/* ===================== 가문 목표 ===================== */
const GOALS={
  house:{t:'내 집 마련',d:'판잣집을 벗어난다',ok:()=>S.house!=='shack'},
  college:{t:'대학 보내기',d:'자녀 한 명을 대학까지 보낸다',ok:()=>S.people.some(p=>!p.inlaw&&p.gen>S.curGen&&p.edu>=3)},
  shop:{t:'번듯한 가게',d:'장사를 점포 이상으로 키운다',ok:()=>S.tradeSt>=2},
  craft:{t:'기술로 일어서기',d:'기능공 이상이 된다',ok:()=>S.craftSt>=2},
  nb:{t:'정 많은 집',d:'정 14 이상인 이웃 두 집',ok:()=>S.nbs.filter(n=>n.j>=14).length>=2},
  face:{t:'알아주는 집',d:'체면 45 이상',ok:()=>S.face>=45},
  land:{t:'땅 한 필지',d:'땅을 한 필지 이상 갖는다',ok:()=>S.land>=1},
  rich:{t:'넉넉한 살림',d:'재산을 지금 돈 5억 원 이상으로',ok:()=>netWorth()*UNIT78*cpi(2026)/cpi(1978)>=5e8},
  together:{t:'함께 사는 집',d:'혈육 모두 집에서 같이 산다 (식구 4명 이상)',ok:()=>{const b=S.people.filter(p=>p.alive&&!p.inlaw);return b.length>=4&&b.every(p=>p.status==='home')}},
  official:{t:'공직에 나간 자식',d:'시험에 붙은 식구가 생긴다',ok:()=>S.people.some(p=>p.alive&&p.f.official)},
  repu:{t:'단골이 많은 가게',d:'가게 평판 75 이상',ok:()=>S.repu>=75&&S.tradeSt>=2&&S.year>=2000,av:()=>S.year>=1995&&S.tradeY>=3},
  savings:{t:'통장 하나',d:'은행에 통장을 만들어 저축을 시작한다',ok:()=>!!S.flags.savings,av:()=>S.year>=1960},
  apt:{t:'아파트 입주',d:'아파트로 들어간다',ok:()=>S.house==='apt',av:()=>S.year>=1975},
  land3:{t:'땅 부자',d:'땅을 세 필지 이상 갖는다',ok:()=>S.land>=3,av:()=>S.land>=1},
  bld:{t:'우리 건물',d:'우리 땅에 건물을 올린다',ok:()=>(S.lands||[]).some(p=>p.bld),av:()=>S.land>=1&&S.year>=1975},
  bigshop:{t:'큰 가게',d:'장사를 상회 규모로 키운다',ok:()=>S.tradeSt>=3,av:()=>S.tradeSt>=2},
  factory:{t:'내 공장',d:'공장을 차린다',ok:()=>S.craftSt>=3,av:()=>S.craftSt>=2},
  rich2:{t:'큰 재산',d:'재산을 지금 돈 20억 원 이상으로',ok:()=>netWorth()*UNIT78*cpi(2026)/cpi(1978)>=2e9,av:()=>S.goalsDone.includes('rich')},
  debt:{t:'빚 청산',d:'빚을 모두 갚는다',ok:()=>S.money>=0,av:()=>S.money<0},
  college2:{t:'둘 다 대학',d:'자녀 두 명 이상을 대학까지 보낸다',ok:()=>S.people.filter(p=>!p.inlaw&&p.gen>S.curGen&&p.edu>=3).length>=2,av:()=>S.year>=1965},
  daughter:{t:'딸도 대학',d:'딸을 대학까지 보낸다',ok:()=>S.people.some(p=>!p.inlaw&&p.sex==='f'&&p.gen>S.curGen&&p.edu>=3),av:()=>S.year>=1960&&S.people.some(p=>p.alive&&!p.inlaw&&p.sex==='f'&&p.gen>S.curGen&&age(p)<18)},
  wed:{t:'자식 혼사',d:'자식 하나를 혼인시킨다',ok:()=>S.people.some(p=>!p.inlaw&&p.gen>S.curGen&&p.f.married),av:()=>S.people.some(p=>p.alive&&!p.inlaw&&p.gen>S.curGen&&age(p)>=12)},
  grand:{t:'손주 보기',d:'손주를 품에 안는다',ok:()=>S.people.some(p=>p.alive&&p.gen>=S.curGen+2),av:()=>S.people.some(p=>p.alive&&!p.inlaw&&p.gen===S.curGen+1&&age(p)>=16)},
  elder:{t:'팔순 잔치',d:'집안 어른이 여든을 넘긴다',ok:()=>S.people.some(p=>p.alive&&age(p)>=80),av:()=>S.people.some(p=>p.alive&&age(p)>=62&&age(p)<80)},
  harmony:{t:'화목한 집',d:'집 식구 셋 이상, 모두 애정 5 이상에 원한이 없다',ok:()=>{const H=homeAlive().filter(p=>age(p)>=10);return H.length>=3&&H.every(p=>p.aff>=5&&p.grudge<=0)}},
  nb3:{t:'단골 이웃',d:'정 11 이상인 이웃 세 집',ok:()=>S.nbs.filter(n=>n.j>=11).length>=3},
  face60:{t:'이름난 집',d:'체면 60 이상',ok:()=>S.face>=60,av:()=>S.goalsDone.includes('face')},
  jokbo:{t:'우리 족보',d:'족보를 갖는다 (찾든 새로 쓰든)',ok:()=>!!(S.flags.ourJokbo||S.flags.reunion||(S.jb&&['ours','true'].includes(S.jb.kind))),av:()=>S.year>=1960},
  bongwan:{t:'본관 찾기',d:'우리 집 본관을 정한다',ok:()=>!!S.flags.bongwan,av:()=>S.year>=1955},
  reconcile:{t:'다시 한 상에',d:'연이 끊긴 식구와 모두 화해한다',ok:()=>!S.people.some(p=>p.alive&&p.away&&['의절','갈라섬'].includes(p.away.why)),av:()=>S.people.some(p=>p.alive&&p.away&&['의절','갈라섬'].includes(p.away.why))},
  dream:{t:'꿈을 좇는 자식',d:'바라는 길을 가도록 허락한 자식이 생긴다',ok:()=>S.people.some(p=>!p.inlaw&&p.f.freed),av:()=>S.people.some(p=>p.alive&&!p.inlaw&&p.gen>S.curGen&&age(p)>=14)},
  master:{t:'장인 기르기',d:'손재주 80 이상인 식구가 생긴다',ok:()=>S.people.some(p=>p.alive&&!p.inlaw&&p.tal.손재주>=8),av:()=>S.craftY>=3},
  scholar:{t:'글 잘하는 집',d:'글 80 이상인 식구가 생긴다',ok:()=>S.people.some(p=>p.alive&&!p.inlaw&&p.tal.글>=8)}
};
function goalOptions(){
  const L=Object.keys(GOALS).filter(k=>!S.goalsDone.includes(k)&&(!GOALS[k].av||GOALS[k].av())&&!GOALS[k].ok());
  return shuffle(L).slice(0,3);
}
function checkGoal(){
  if(!S.goal)return null;const g=GOALS[S.goal];if(!g||!g.ok())return null;
  S.goalsDone.push(S.goal);const t=g.t;S.goal=null;S.goalAskGen=null;S.face=clamp(S.face+3,0,100);for(const p of homeAlive())p.aff=clamp(p.aff+2,-10,10);
  const r=rep();if(r)r.recs.push({y:S.year,t:'집안 목표 「'+t+'」를 이뤘다',w:3});
  return '집안 목표 「'+t+'」를 이뤘다! 체면 +3, 식구들 애정 +2';
}

/* ===================== 설 가족 회의 ===================== */
function eldestOfGen(g){const L=S.people.filter(p=>p.gen===g&&!p.inlaw&&p.alive);L.sort((a,b)=>a.birth-b.birth);return L[0]||null}
function buildAgendas(){
  const L=[];const H=homeAlive();const r=rep();
  for(const p of H){const a=age(p);if(!p.inlaw&&a>=12&&a<=15&&!p.f.midDecided&&S.year<1975){L.push({kind:'mid',pid:p.id});break}}
  for(const p of H){const a=age(p);if(!p.inlaw&&p.f.mid&&p.sy.m>=3&&a>=18&&a<=21&&!p.f.collegeDecided){L.push({kind:'college',pid:p.id});break}}
  const mAge=S.year<1980?22:S.year<2010?26:29;
  const single=H.filter(p=>!p.inlaw&&p.gen>=2&&!p.f.married&&age(p)>=mAge&&age(p)<=45&&p.id!==S.repId).sort((a,b)=>a.birth-b.birth)[0];
  if(single)L.push({kind:'marry',pid:single.id});
  if(S.tradeY>=3&&(bizFade()<1||S.year>=bizOf().y[1]-3||!(S.bizY&&S.year-S.bizY<6)&&R()<.35)&&bizChoices().length)L.push({kind:'biz',opts:pickN(bizChoices(),3)});
  if(S.tradeSt===1&&S.tradeY>=5&&Math.max(0,...H.map(p=>p.tal.셈))>=5)L.push({kind:'shop'});
  if(S.tradeSt===2&&S.tradeY>=14&&S.year>=1968)L.push({kind:'whole'});
  if(S.craftSt===1&&S.craftY>=5&&Math.max(0,...H.map(p=>p.tal.손재주))>=5)L.push({kind:'skill'});
  if(S.craftSt===2&&S.craftY>=12&&S.year>=1968)L.push({kind:'factory'});
  if(S.house==='shack'&&S.year>=1956)L.push({kind:'house'});
  if(S.house!=='apt'&&S.year>=1975&&S.place.kind!=='rural')L.push({kind:'apt'});
  if(!S.flags.savings&&S.year>=1955)L.push({kind:'bank'});
  if(S.year>=1956)L.push({kind:'land',offers:landOffers()});
  const mv=Object.keys(MOVES).filter(k=>{const m=MOVES[k];if(!(S.year>=m.y[0]&&S.year<=m.y[1]))return false;if(k==='back')return S.place.kind!=='origin';return S.place.kind==='origin'||(k==='rural'&&S.place.kind!=='rural')});
  if(mv.length)L.push({kind:'move',opts:mv});
  if(S.face>=35&&!S.flags.bongwan&&!S.flags.ourJokbo&&S.year>=1965)L.push({kind:'ourjokbo'});
  for(const p of H){const a=age(p);if(!p.inlaw&&a>=9&&a<=15&&!p.f.dreamSet){p.f.dreamSet=true;const top=Math.max(p.tal.손재주,p.tal.몸,p.tal.말솜씨);if(R()<.12+top*.035)p.f.dream=artsKindFor(p)}}
  {const ak=H.filter(p=>!p.inlaw&&p.f.dream&&age(p)>=8&&age(p)<=19&&!p.f.artsDone&&!(p.f.artsY&&S.year-p.f.artsY<2)).sort((a,b)=>b.birth-a.birth)[0];if(ak&&S.year>=1956)L.push({kind:'arts',pid:ak.id})}
  {const ex=H.filter(p=>age(p)>=18&&age(p)<=50&&!p.f.college&&examOpts(p).length&&((p.slot==='study'&&!p.f.exam&&!p.f.job&&p.edu<3)||(p.f.exam&&(p.f.examY||0)>=EXAMS[p.f.exam].maxY)||(!p.f.exam&&!p.f.examDone&&p.tal.글>=6.5&&p.slot!=='study'&&!(p.f.jobAsk&&S.year-p.f.jobAsk<6))));
   if(ex.length){const p=ex.sort((a,b)=>b.tal.글-a.tal.글)[0];p.f.jobAsk=S.year;L.push({kind:'exam',pid:p.id})}}
  if(S.year>=1955&&buyList().length)L.push({kind:'buy'});
  if(S.year>=1956){
    const kids=H.filter(p=>!p.inlaw&&age(p)>=7&&age(p)<=19);if(kids.length&&!(S.lastEdu&&S.year-S.lastEdu<4))L.push({kind:'tutor'});
    if(!(S.lastFeast&&S.year-S.lastFeast<5))L.push({kind:'feast'});
    {const hk=heritageKind();if(hk&&!(S.lastWork&&S.year-S.lastWork<5))L.push({kind:'workshop',hk:hk.k,mid:hk.mid})}
    if(S.year>=1960&&!(S.lastRoot&&S.year-S.lastRoot<6))L.push({kind:'roots'});
    const fr=H.filter(p=>!p.inlaw&&!p.f.freed&&!p.f.retired&&p.id!==S.repId&&freeAgeOK(p)&&(p.grudge>=2||p.desire==='자유'||p.desire==='사랑')).sort((a,b)=>b.grudge-a.grudge)[0];if(fr)L.push({kind:'free',pid:fr.id});
  }
  const kin=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&['분가','상경','타지','귀촌'].includes(p.away.why)&&p.aff>=2&&age(p)>=20).sort((a,b)=>b.aff-a.aff)[0];if(kin)L.push({kind:'kinhome',pid:kin.id});
  if(H.filter(p=>age(p)>=20&&p.id!==S.repId).length)L.push({kind:'rep'});
  return L;
}
/* 살림 장만: 형편이 좋을수록 고를 수 있는 것이 많아진다. c는 그해 가구 연 소득(RI) 대비 값 */
const kidsIn=(a,b)=>homeAlive().filter(p=>!p.inlaw&&age(p)>=a&&age(p)<=b);
const eldersIn=()=>homeAlive().filter(p=>age(p)>=60);
const BUY_ITEMS=[
 {id:'bike',n:y=>'짐자전거',y:[1953,1975],c:.12,once:true,d:'장사 물건을 더 멀리 나른다',fx:o=>{addMod({k:'trade',m:1.08,n:4});o.push('장사 벌이 +8% (4년)')}},
 {id:'radio',n:y=>'라디오',y:[1955,1972],c:.15,once:true,d:'저녁마다 식구들이 둘러앉는다',fx:o=>{affAllN(1);S.face=clamp(S.face+1,0,100);o.push('식구들 애정 +1, 체면 +1')}},
 {id:'sewing',n:y=>'재봉틀',y:[1955,1985],c:.25,once:true,d:'집에서 삯바느질을 할 수 있다',fx:o=>{S.craftY+=2;for(const p of homeAlive().filter(p=>p.slot==='home'&&age(p)>=14))p.tal.손재주=Math.min(p.cap.손재주,p.tal.손재주+.6);o.push('집안일 하는 식구 손재주 +6, 기술 경력 +2년');S.flags.sewing=true}},
 {id:'tv',n:y=>'흑백 텔레비전',y:[1966,1980],c:.35,once:true,d:'골목 아이들이 우리 집 마루로 모인다',fx:o=>{for(const n of S.nbs)n.j=clamp(n.j+1,-20,20);affAllN(1);S.face=clamp(S.face+1,0,100);o.push('이웃 정 +1, 애정 +1, 체면 +1')}},
 {id:'phone',n:y=>'전화 놓기',y:[1970,1988],c:.25,once:true,d:'주문을 전화로 받는다',fx:o=>{addMod({k:'trade',m:1.12,n:6});S.face=clamp(S.face+1,0,100);o.push('장사 벌이 +12% (6년), 체면 +1')}},
 {id:'fridge',n:y=>'냉장고',y:[1975,1995],c:.2,once:true,d:'음식을 덜 버린다',fx:o=>{affAllN(1);S.flags.fridge=true;o.push('애정 +1, 생활비가 조금 준다')}},
 {id:'ctv',n:y=>'컬러 텔레비전',y:[1980,1998],c:.17,once:true,d:'프로야구와 연속극을 온 식구가 본다',fx:o=>{affAllN(1);o.push('애정 +1')}},
 {id:'piano',n:y=>'피아노',y:[1975,2008],c:.25,once:true,need:()=>kidsIn(5,14).length,d:'아이들 정서와 체면에 좋다',fx:o=>{for(const p of kidsIn(5,14))p.tal.마음씨=Math.min(p.cap.마음씨,p.tal.마음씨+.8);S.face=clamp(S.face+1,0,100);o.push('아이들 마음씨 +8, 체면 +1')}},
 {id:'pc',n:y=>y<2000?'개인용 컴퓨터':'새 컴퓨터',y:[1990,2020],c:.12,once:true,need:()=>kidsIn(8,25).length,d:'아이들 공부에 쓴다',fx:o=>{for(const p of kidsIn(8,25))p.tal.글=Math.min(p.cap.글,p.tal.글+.7);routeAdd('learn',1.5);o.push('아이들 글 +7, 학문의 길에 보탬')}},
 {id:'car',n:y=>y<1995?'자가용':y<2040?'새 차':'자율주행차',y:[1985,2110],c:.8,once:true,d:'장사 배달과 나들이가 편해진다',fx:o=>{S.face=clamp(S.face+2,0,100);affAllN(1);if(S.tradeY>0)addMod({k:'trade',m:1.08,n:5});o.push('체면 +2, 애정 +1'+(S.tradeY>0?', 장사 벌이 +8% (5년)':''))}},
 {id:'aircon',n:y=>'에어컨',y:[1995,2110],c:.1,once:true,d:'여름을 덜 지친다',fx:o=>{for(const p of homeAlive())if(age(p)>=65)p.tal.몸=Math.min(p.cap.몸,p.tal.몸+.4);o.push('어르신 몸 +4')}},
 {id:'fix',n:y=>y<1980?'지붕과 담장 손보기':'집 고치기',y:[1956,2110],c:.3,cd:12,need:()=>S.house==='own',d:'집이 번듯해진다',fx:o=>{S.face=clamp(S.face+1.5,0,100);affAllN(1);o.push('체면 +1.5, 애정 +1')}},
 {id:'trip',n:y=>y<1989?'온 식구 나들이':'가족 해외여행',y:[1970,2110],c:.25,cd:6,d:'쌓인 마음이 풀린다',fx:o=>{affAllN(2);for(const p of homeAlive())p.grudge=Math.max(0,p.grudge-1);o.push('애정 +2, 원한 −1')}},
 {id:'hyodo',n:y=>y<1990?'어르신 보약':'부모님 효도 여행',y:[1960,2110],c:.2,cd:5,need:()=>eldersIn().length,d:'어르신 몸과 마음을 챙긴다',fx:o=>{for(const p of eldersIn()){p.aff=clamp(p.aff+3,-10,10);p.f.sick=false;p.tal.몸=Math.min(p.cap.몸,p.tal.몸+.5)}o.push('어르신 애정 +3, 몸 +5, 병을 털었다')}},
 {id:'carebot',n:y=>'돌봄 기계',y:[2075,2110],c:.4,once:true,need:()=>homeAlive().some(p=>age(p)>=75),d:'어르신 돌봄 비용이 준다',fx:o=>{S.timeDebt=(S.timeDebt||0)+6;o.push('6년 동안 돌봄 비용이 준다')}},
 {id:'pupil',n:y=>'동네 아이 한 명 학비 대 주기',y:[1958,2110],c:.12,cd:4,tier:2,d:'형편 어려운 이웃 아이 한 해 학비',fx:o=>{const n=pick(S.nbs);if(n)n.j=clamp(n.j+3,-20,20);S.face=clamp(S.face+.5,0,100);routeAdd('jeong',1);o.push((n?n.name+'네 ':'')+'정 +3, 체면 +0.5')}},
 {id:'elders',n:y=>y<1990?'동네 어르신 잔치':'경로잔치 열기',y:[1958,2110],c:.15,cd:5,tier:2,d:'동네 어른들께 한 상 차려 드린다',fx:o=>{for(const n of S.nbs)n.j=clamp(n.j+1,-20,20);S.face=clamp(S.face+1,0,100);o.push('이웃 정 +1, 체면 +1')}},
 {id:'books',n:y=>y<1990?'마을 문고 책 보내기':y<2040?'작은 도서관에 책 기증':'동네 배움터에 기기 기증',y:[1960,2110],c:.2,cd:7,tier:3,d:'동네 아이들 공부에 쓰인다',fx:o=>{routeAdd('learn',2);S.face=clamp(S.face+1,0,100);for(const p of homeAlive().filter(p=>age(p)>=6&&age(p)<=18))p.tal.글=Math.min(p.cap.글,p.tal.글+.3);o.push('체면 +1, 우리 아이들 글 +3, 학문의 길에 보탬')}},
 {id:'scholar',n:y=>'동네 장학금',y:[1965,2110],c:.7,cd:8,tier:4,d:'해마다 동네 아이 몇에게 학비를 댄다',fx:o=>{S.face=clamp(S.face+2,0,100);for(const n of S.nbs)n.j=clamp(n.j+2,-20,20);routeAdd('jeong',3);routeAdd('learn',2);o.push('체면 +2, 이웃 정 +2, 정·학문의 길에 보탬')}},
 {id:'found',n:y=>'우리 집 이름 장학 재단',y:[1975,2110],c:3,once:true,tier:5,d:'집안 이름을 건 장학 재단을 세운다',fx:o=>{S.face=clamp(S.face+5,0,100);for(const n of S.nbs)n.j=clamp(n.j+3,-20,20);routeAdd('jeong',6);routeAdd('learn',5);const r0=rep();if(r0)r0.recs.push({y:S.year,t:'집안 이름을 건 장학 재단을 세웠다',w:5});o.push('체면 +5, 이웃 정 +3, 정·학문의 길에 크게 보탬')}},
 {id:'kidhome',n:y=>'혼인한 자식 살림집 마련해 내보내기',y:[1960,2110],c:-1,cost:()=>P_HOUSE(S.year)*.45,cd:1,need:()=>kidHomeCand(),d:'본가가 붐빌 때. 작은 집이나 전셋집을 마련해 분가시킨다',fx:o=>{const p=kidHomeCand();if(!p)return;moveOut(p,'분가');p.f.housed=true;p.aff=clamp(p.aff+3,-10,10);p.grudge=Math.max(0,p.grudge-2);S.face=clamp(S.face+1,0,100);o.push(p.name+' 내외가 새 살림집으로 나갔다. 애정 +3, 체면 +1. 따로 살아도 용돈과 왕래가 이어진다')}},
 {id:'kinhelp',n:y=>'따로 사는 자식 집 장만 보태기',y:[1960,2110],c:-1,cost:()=>P_HOUSE(S.year)*.25,cd:3,need:()=>kinHouseCand(),d:'분가한 자식이 집을 마련하는 데 보탠다',fx:o=>{const p=kinHouseCand();if(!p)return;p.f.housed=true;p.aff=clamp(p.aff+4,-10,10);p.grudge=Math.max(0,p.grudge-2);routeAdd('jeong',2);o.push(p.name+'네가 제 집을 마련했다. 애정 +4, 앞으로 부치는 용돈이 는다')}},
 {id:'seonsan',n:y=>y<2000?'선산 마련':'가족 납골당 마련',y:[1975,2110],c:1.6,once:true,tier:4,d:'조상 모실 자리를 마련한다',fx:o=>{S.face=clamp(S.face+2,0,100);routeAdd('root',6);o.push('체면 +2, 뿌리의 길에 크게 보탬')}},
 {id:'hall',n:y=>'마을 회관 짓는 데 보태기',y:[1970,2110],c:2.2,once:true,tier:5,d:'동네에 이름이 남는다',fx:o=>{S.face=clamp(S.face+4,0,100);for(const n of S.nbs)n.j=clamp(n.j+3,-20,20);routeAdd('jeong',6);o.push('체면 +4, 이웃 정 +3, 정의 길에 크게 보탬')}}
];
function addMod(m){S.mods.push({k:m.k,m:m.m,until:S.year+m.n})}
function affAllN(v){for(const p of homeAlive())p.aff=clamp(p.aff+v,-10,10)}
const WEALTH=['어려움','빠듯함','보통','넉넉함','여유로움','부유함'];
function wealthTier(){const m=S.money/RI(S.year);return m<.15?0:m<.5?1:m<1.2?2:m<2.5?3:m<6?4:5}
function incomeTier(){if(!S.lastY)return null;const r=S.lastY.inc/RI(S.year);return r<.5?0:r<.8?1:r<1.25?2:r<2?3:r<3.5?4:5}
function buyCost(it){return it.cost?it.cost():it.c*RI(S.year)}
function kidHomeCand(){const r0=rep();return homeAlive().filter(p=>!p.inlaw&&r0&&p.id!==r0.id&&p.gen>r0.gen&&(p.f.married||(p.spouse&&P(p.spouse)&&P(p.spouse).alive))&&age(p)>=22).sort((a,b)=>a.birth-b.birth)[0]}
function kinHouseCand(){return S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&p.away.why==='분가'&&!p.f.housed&&age(p)>=25&&age(p)<60)[0]}
function buyList(){const t=wealthTier();S.bought=S.bought||{};
  return BUY_ITEMS.filter(it=>S.year>=it.y[0]&&S.year<=it.y[1]&&!(it.once&&S.bought[it.id])&&!(it.cd&&S.bought[it.id]&&S.year-S.bought[it.id]<it.cd)&&(!it.need||it.need())&&t>=(it.tier||0)-1&&S.money>=buyCost(it)*.5)
   .sort((a,b)=>(b.cost?1:0)-(a.cost?1:0)||buyCost(b)-buyCost(a)).slice(0,Math.min(7,3+t))}
/* 가업 전수: 집안 어른이 가장 잘하는 재주, 집안이 해 온 일에 따라 물려줄 것이 달라진다 */
const HERIT={
 craft:{tal:['손재주','끈기'],route:'craft',t:y=>y<1990?'손기술 전수':'공방',what:'손기술',big:y=>y<1990?'작은 공방을 꾸린다':'공방을 연다',small:'저녁마다 손수 가르친다',bigFx:()=>{S.craftY+=2;S.repu=clamp(S.repu+4,0,100)}},
 trade:{tal:['셈','말솜씨','눈썰미'],route:'wealth',t:y=>'장사 비결',what:'장사 수완',big:y=>'아이들을 가게에 세워 손님 받는 법을 가르친다',small:'저녁 장부 정리를 같이 한다',bigFx:()=>{S.tradeY+=1.5;S.repu=clamp(S.repu+3,0,100)}},
 eye:{tal:['눈썰미','셈'],route:'wealth',t:y=>'물건 보는 눈',what:'좋은 물건 알아보는 눈',big:y=>y<1990?'장날마다 데리고 다니며 물건을 고르게 한다':'경매장·도매시장에 데리고 다닌다',small:'집에서 진짜와 가짜를 가려 보게 한다',bigFx:()=>{S.tradeY+=1;addMod({k:'trade',m:1.06,n:4})}},
 learn:{tal:['글','끈기'],route:'learn',t:y=>y<1980?'글방':'집안 공부방',what:'글',big:y=>y<1980?'동네 아이들까지 모아 글방을 연다':'집에 공부방을 꾸리고 책을 들인다',small:'저녁마다 책을 읽어 주고 가르친다',bigFx:()=>{S.face=clamp(S.face+1,0,100)}},
 speech:{tal:['말솜씨','마음씨'],route:'jeong',t:y=>'사람 대하는 법',what:'사람을 얻는 말솜씨',big:y=>'경조사마다 데리고 다니며 어른들께 인사시킨다',small:'밥상머리에서 사람 대하는 법을 일러 준다',bigFx:()=>{for(const n of S.nbs)n.j=clamp(n.j+1,-20,20)}},
 body:{tal:['몸','끈기'],route:'craft',t:y=>'몸 쓰는 일',what:'몸 쓰는 요령',big:y=>y<1990?'일터에 데리고 나가 일을 가르친다':'운동부·체육관에 보낸다',small:'새벽마다 같이 뛰고 일한다',bigFx:()=>{}}};
function heritageKind(){const H=homeAlive();const elders=H.filter(p=>age(p)>=35);if(!elders.length||!H.some(p=>age(p)>=10&&age(p)<=30))return null;
  let best=null;for(const p of elders)for(const t of ['손재주','셈','말솜씨','눈썰미','글','몸']){const v=p.tal[t];if(v>=6&&(!best||v>best.v))best={p,t,v}}
  if(S.tradeY>=6&&(!best||best.v<7))return {k:'trade',mid:(best||{}).p?best.p.id:null};
  if(S.craftY>=6&&(!best||best.v<7))return {k:'craft',mid:(best||{}).p?best.p.id:null};
  if(!best)return null;const k={손재주:'craft',셈:'trade',말솜씨:'speech',눈썰미:S.tradeY>0?'eye':'eye',글:'learn',몸:'body'}[best.t];return {k,mid:best.p.id}}
/* 시험의 길: 공부해서 붙으면 학력·일자리가 바뀐다 */
const EXAMS={
 gumjeong:{n:y=>'검정고시',d:'못 마친 학교 졸업 자격',need:p=>p.edu<2,diff:.45,maxY:4,pass:(p,o)=>{p.edu=Math.max(p.edu,2);o.push('중·고교 졸업 자격을 얻었다. 이제 사무 일을 할 수 있다')}},
 univ:{n:y=>y<1990?'늦깎이 대학 입시':'수능',d:'대학에 들어간다',need:p=>p.edu===2&&age(p)<=45,y:[1955,2110],diff:.28,maxY:4,pass:(p,o)=>{p.f.college=true;p.edu=3;o.push('대학에 붙었다. 대학을 다닌 셈으로 쳐 회사 일을 할 수 있다')}},
 license:{n:y=>y<1980?'이·미용 자격':y<2010?'공인중개사':y<2040?'요양보호사·간호조무사':'돌봄 기술 자격',d:'자격증을 따서 일한다',need:p=>p.edu>=1,diff:.35,maxY:4,
   pass:(p,o)=>{const y=S.year;if(y<1980){p.f.job='미용사';p.f.jobSlot='trade';p.slot='trade';p.tal.손재주=Math.min(p.cap.손재주,p.tal.손재주+.5)}else if(y<2010){p.f.job='공인중개사';p.f.jobSlot='trade';p.slot='trade';p.tal.말솜씨=Math.min(p.cap.말솜씨,p.tal.말솜씨+.5)}else{p.f.job=y<2040?'요양보호사':'돌봄 기사';p.f.jobSlot='care';p.slot='care'}o.push(p.f.job+' 자격을 땄다')}},
 gong:{n:y=>'공무원 시험',d:'나라 일을 한다. 벌이는 보통, 안정적이다',need:p=>p.edu>=2&&age(p)<=40,y:[1955,2110],diff:.14,maxY:6,pass:(p,o)=>{p.f.official=true;p.edu=Math.max(p.edu,3);p.f.job='공무원';p.f.jobSlot='study';p.f.jobMul=.95;S.face=clamp(S.face+2,0,100);o.push('공무원 시험에 붙었다 (체면 +2)')}},
 teacher:{n:y=>y<1990?'교사 자격':'임용 고시',d:'선생님이 된다. 체면이 오른다',need:p=>p.edu>=3&&age(p)<=40,diff:.14,maxY:6,pass:(p,o)=>{p.f.job='교사';p.f.jobSlot='study';p.f.jobMul=1.05;S.face=clamp(S.face+3,0,100);routeAdd('learn',3);o.push('선생님이 되었다 (체면 +3)')}},
 gosi:{n:y=>y<1963?'고등고시':y<2017?'사법 시험':'변호사 시험',d:'붙으면 집안이 달라진다. 거의 안 붙는다',need:p=>p.edu>=3&&age(p)<=38,diff:.05,maxY:8,pass:(p,o)=>{p.f.job=S.year<2017?(R()<.5?'판사':'검사'):'변호사';p.f.jobSlot='study';p.f.jobMul=1.9;S.face=clamp(S.face+8,0,100);routeAdd('learn',8);o.push(p.f.job+'가 되었다! 온 동네에 잔치가 열렸다 (체면 +8)')}}};
function examOpts(p){return Object.keys(EXAMS).filter(k=>{const e=EXAMS[k];return e.need(p)&&(!e.y||(S.year>=e.y[0]&&S.year<=e.y[1]))})}
function examChance(p){const e=EXAMS[p.f.exam];if(!e)return 0;const g=p.tal.글,n=p.tal.끈기;const yrs=p.f.examY||0;
  return clamp(e.diff*(.35+g*.13+n*.05)*(1+Math.min(.6,yrs*.12)),.01,.92)}
function examYear(p,rp){
  /* 일 대신 공부를 시키면 알맞은 시험을 저절로 고른다 */
  if(!p.f.exam&&p.slot==='study'&&p.status==='home'&&age(p)>=20&&!p.f.college&&p.edu<3&&!p.f.artsPro){const ks=examOpts(p);const k=ks.includes('gumjeong')?'gumjeong':ks.includes('gong')?'gong':ks[0];if(k){p.f.exam=k;p.f.examY=0;rp.notes.push(p.name+josa(p.name,'이/가')+' '+EXAMS[k].n(S.year)+' 공부를 시작했다 (설 가족회의에서 바꿀 수 있다)')}}
  if(!p.f.exam||p.slot!=='study'||p.status!=='home')return;const e=EXAMS[p.f.exam];if(!e){p.f.exam=null;return}
  p.f.examY=(p.f.examY||0)+1;p.tal.글=Math.min(p.cap.글,p.tal.글+.25);p.tal.끈기=Math.min(p.cap.끈기,p.tal.끈기+.12);
  if(R()<examChance(p)){const o=[];e.pass(p,o);p.recs.push({y:S.year,t:e.n(S.year)+'에 붙었다 ('+p.f.examY+'년 공부)',w:p.f.exam==='gosi'?5:3});
    rp.major.push({major:true,t:p.name+' '+e.n(S.year)+' 합격 — '+o.join(' ')});p.aff=clamp(p.aff+2,-10,10);p.f.exam=null;p.f.examY=0;p.f.examDone=true;
    if(p.slot==='study'&&p.f.jobSlot&&p.f.jobSlot!=='study')p.slot=p.f.jobSlot}
  else{rp.notes.push(p.name+josa(p.name,'이/가')+' '+e.n(S.year)+'에 떨어졌다 ('+p.f.examY+'년째'+(p.f.examY>=e.maxY?', 식구들 눈치가 보인다':'')+')');if(p.f.examY>=e.maxY)p.grudge=clamp(p.grudge+1,0,10)}}
function goodFace(){const n=S.nbs.filter(x=>x.j>=15).length;const jbB=S.jb&&(S.jb.kind==='true'||S.jb.kind==='ours')&&S.jb.pages>=3?5:0;return Math.max(40,60-8*n-jbB)}
/* 자식의 길: 바라는 것과 나이에 따라 다른 선택지. 안건이 만들어질 때 몇 개를 골라 고정한다 */
const FREE_PATHS={
 출세:{text:p=>p.name+josa(p.name,'은/는')+' 큰 사람이 되고 싶어 한다. '+(S.year<1990?'고시':S.year<2015?'고시나 전문직':'공무원 시험이나 대학원')+' 이야기를 꺼낸다.',
   opts:[{k:'exam',t:()=>(S.year<1990?'고시 공부를 밀어준다':'시험 준비를 밀어준다')+' ('+wonY(cm(10))+')',cost:10,fx:p=>{p.slot='study';p.f.examing=true;p.tal.글=Math.min(p.cap.글,p.tal.글+1);return '책값과 하숙비를 대 주었다. 글 +10'}},
     {k:'abroad',t:()=>'유학을 보낸다 ('+wonY(cm(25))+')',cost:25,min:1965,fx:p=>{p.status='away';p.away={why:'유학',until:S.year+3};p.tal.글=Math.min(10,p.tal.글+1.5);p.cap.글=Math.min(10,p.cap.글+1);routeAdd('learn',3);return '3년 동안 유학을 떠났다. 글 +15'}},
     {k:'night',t:'일하면서 야간 공부를 하게 한다',fx:p=>{p.tal.끈기=Math.min(p.cap.끈기,p.tal.끈기+.8);p.tal.글=Math.min(p.cap.글,p.tal.글+.5);return '낮엔 일하고 밤엔 공부한다. 끈기 +8, 글 +5'}},
     {k:'mentor',t:'아는 어른께 데려가 길을 묻는다',need:j=>S.nbs.some(n=>n.j>=11&&n.role==='yangban'||n.j>=15),fx:p=>{p.aff+=1;routeAdd('learn',2);return '동네 어른이 공부 길을 일러 주었다'}}]},
 부:{text:p=>p.name+josa(p.name,'은/는')+' 돈을 벌고 싶어 한다. 제 장사를 해 보겠다고 한다.',
   opts:[{k:'stake',t:()=>'장사 밑천을 대 준다 ('+wonY(cm(15))+')',cost:15,fx:p=>{p.slot='trade';S.tradeY+=2;p.tal.셈=Math.min(p.cap.셈,p.tal.셈+.5);routeAdd('wealth',0);return '밑천을 받아 장사를 시작했다. 장사 경력 +2년'}},
     {k:'heir',t:'집안 가게를 맡긴다',need:()=>S.tradeSt>=2,fx:p=>{p.slot='trade';p.f.shopHeir=true;p.tal.눈썰미=Math.min(p.cap.눈썰미,p.tal.눈썰미+.6);return '집안 가게를 맡았다. 눈썰미 +6'}},
     {k:'learnT',t:'남의 가게에서 3년 배우게 한다',fx:p=>{p.status='away';p.away={why:'가게살이',until:S.year+3};p.tal.셈=Math.min(p.cap.셈,p.tal.셈+1.2);p.tal.말솜씨=Math.min(p.cap.말솜씨,p.tal.말솜씨+.8);return '3년 동안 남의 가게에서 배운다. 셈 +12, 말솜씨 +8'}},
     {k:'online',t:()=>'인터넷 장사를 해 보게 한다 ('+wonY(cm(6))+')',cost:6,min:2000,fx:p=>{p.slot='trade';S.repu=clamp(S.repu+5,0,100);return '인터넷 가게를 열었다. 평판 +5'}}]},
 안정:{text:p=>p.name+josa(p.name,'은/는')+' 무엇보다 안정된 삶을 원한다.',
   opts:[{k:'skill',t:'기술을 배우게 한다',fx:p=>{p.slot='craft';p.tal.손재주=Math.min(p.cap.손재주,p.tal.손재주+1);return '기술을 배우기 시작했다. 손재주 +10'}},
     {k:'civil',t:()=>(S.year<1990?'면사무소 시험을 보게 한다':'공무원 시험을 보게 한다'),need:()=>true,fx:p=>{const pr=.15+p.tal.글*.05;if(R()<pr){p.f.official=true;p.edu=Math.max(p.edu,2);p.slot='study';return '시험에 붙었다! 공직에 나간다'}return '이번엔 떨어졌다. 마음은 편해졌다'}},
     {k:'near',t:'집 가까이 일자리를 구해 준다',fx:p=>{p.aff+=1;return '집 가까운 곳에 자리를 잡았다'}},
     {k:'house',t:()=>'신혼집 전셋돈을 보태 준다 ('+wonY(cm(20))+')',cost:20,min:1975,need:()=>true,fx:p=>{p.aff+=2;return '전셋돈을 보태 주었다. 살 걱정을 덜었다'}}]},
 자유:{text:p=>p.name+josa(p.name,'은/는')+' 남이 정한 길이 답답하다고 한다. '+(S.year<1985?'바깥세상을 보고 싶다고':'하고 싶은 일이 따로 있다고')+' 한다.',
   opts:[{k:'travel',t:'1년 동안 세상 구경을 보낸다',fx:p=>{p.status='away';p.away={why:'세상 구경',until:S.year+1};p.pers.모험=Math.min(10,p.pers.모험+1);p.tal.눈썰미=Math.min(p.cap.눈썰미,p.tal.눈썰미+.8);return '1년 떠났다 오기로 했다. 눈썰미 +8'}},
     {k:'art',t:()=>(S.year<1990?'노래·그림을 배우게 한다':'예술·창작 일을 해 보게 한다')+' ('+wonY(cm(5))+')',cost:5,fx:p=>{p.f.artist=true;p.recs.push({y:S.year,t:'집안의 반대 없이 '+(S.year<1990?'노래와 그림':'창작')+'의 길을 걸었다',w:3});routeAdd('free',2);return '하고 싶은 일을 시작했다'}},
     {k:'go',t:'제 길을 찾아 떠나게 한다',fx:p=>{p.status='away';p.away={why:'제 길',until:null};return '짐을 싸서 제 길을 찾아 떠났다'}},
     {k:'own',t:'집에 있되 제 일은 제가 정하게 한다',fx:p=>{p.aff+=1;return '집에 남되 간섭하지 않기로 했다'}}]},
 사랑:{text:p=>p.name+josa(p.name,'이/가')+' 마음에 둔 사람이 있다고 털어놓았다. '+(S.year<1980?'집안끼리 정한 혼처와는 다른 사람이다':'집안 사람들이 탐탁지 않아 하는 사람이다')+'.',
   opts:[{k:'love',t:'좋아하는 사람과 혼인을 허락한다',need:()=>true,fx:p=>{if(!p.f.married){const o=[];doMarry(p,'plain',o);if(marryHome(p)==='out'&&p.status==='home'){moveOut(p,'출가');o.push('시댁으로 들어갔다')}p.grudge=0;return o.join(' · ')}return '허락했다'}},
     {k:'meet',t:'일단 집에 한번 데려오라고 한다',fx:p=>{p.aff+=1;p.grudge=Math.max(0,p.grudge-1);return '집에 데려와 인사를 시켰다. 분위기가 조금 풀렸다'}},
     {k:'wait',t:'1년만 지켜보자고 한다',fx:p=>{return '1년 뒤에 다시 이야기하기로 했다'}},
     {k:'elope',t:'둘이 알아서 살라며 내보낸다',fx:p=>{p.status='away';p.away={why:'사랑을 따라',until:null};return '둘이 살림을 차려 나갔다'}}]},
 인정:{text:p=>p.name+josa(p.name,'은/는')+' 집안과 동네에서 인정받고 싶어 한다.',
   opts:[{k:'task',t:'동네 일을 맡겨 본다',fx:p=>{p.slot='help';for(const n of S.nbs)n.j=clamp(n.j+1,-20,20);S.face=clamp(S.face+1,0,100);return '동네 일을 맡았다. 이웃 모두 정 +1, 체면 +1'}},
     {k:'heirH',t:'집안 살림 한쪽을 맡긴다',fx:p=>{p.aff+=2;p.pers.성실=Math.min(10,p.pers.성실+.5);return '집안 살림을 함께 맡는다. 성실 +5'}},
     {k:'praise',t:'식구들 앞에서 크게 칭찬한다',fx:p=>{p.aff+=2;return '식구들 앞에서 칭찬받았다'}},
     {k:'repTrain',t:'다음 대표감으로 가르친다',need:()=>true,fx:p=>{p.f.repTrain=true;p.tal.말솜씨=Math.min(p.cap.말솜씨,p.tal.말솜씨+.6);return '어른들 자리에 데리고 다니며 가르친다. 말솜씨 +6'}}]}
};
/* 자식의 길은 앞날을 정하는 나이에만: 바라는 것마다 맞는 나이가 다르다 */
function freeAgeOK(p){const a=age(p);const r=rep();if(r&&p.gen<=r.gen)return false;
  switch(p.desire){case '출세':return a>=17&&a<=35;case '부':return a>=18&&a<=40;case '안정':return a>=18&&a<=35;
    case '자유':return a>=17&&a<=35;case '사랑':return a>=19&&a<=40&&!p.f.married;case '인정':return a>=17&&a<=45}return false}
function freeOpts(p,a){
  const d=FREE_PATHS[p.desire];if(!a.pick){const avail=d.opts.filter(o=>!(o.min&&S.year<o.min)&&!(o.need&&!o.need())&&!(p.desire==='사랑'&&o.k==='love'&&p.f.married));a.pick=shuffle(avail.slice()).slice(0,3).map(o=>o.k)}
  const opts=a.pick.map(k=>{const o=d.opts.find(x=>x.k===k);return {k,t:typeof o.t==='function'?o.t():o.t,need:o.cost?{money:cm(o.cost)}:null}});
  opts.push({k:'no',t:'집안 일이 먼저다'});
  return {text:d.text(p)+' (바라는 것: '+p.desire+(p.grudge>=3?' · 쌓인 게 있어 보인다':'')+')',opts};
}
function costOf(k,y){y=y??S.year;const pl=S.place.land??1;
  switch(k){case 'shop':return P_SHOP(y);case 'whole':return P_SHOP(y)*2.5;case 'factory':return P_SHOP(y)*3;
    case 'house':return P_HOUSE(y)*pl;case 'apt':return P_APT(Math.max(1970,y))*pl;
    case 'out':return RI(y)*interp([[1953,.25],[1980,.5],[2000,1.1],[2020,1.6],[2075,1.4]],y);}
  return 0}
function weddingCost(t){return RI(S.year)*{good:.55,mid:.28,plain:.1}[t]}
function agendaView(a){
  const p=a.pid?P(a.pid):null;
  switch(a.kind){
    case 'mid':return {title:p.name+' 중학교 진학',text:p.name+josa(p.name,'이/가')+' 국민학교를 마쳐 간다. 중·고교를 보내면 해마다 학비 '+wonY(2.2*prod(S.year))+'이 든다.'+(p.f.desireKnown?' 바라는 것: '+p.desire:''),opts:[{k:'yes',t:'보낸다'},{k:'no',t:'일을 시킨다'}]};
    case 'college':return {title:p.name+' 대학 진학',text:'대학 학비는 해마다 '+wonY(5*prod(S.year))+'. 졸업하면 직장 벌이와 체면이 오른다. (글 '+pt(p.tal.글)+')',opts:[{k:'yes',t:'보낸다'},{k:'no',t:'그만 공부하고 일하라'}]};
    case 'marry':{
      if(S.agendaStep&&S.agendaStep.pid===p.id)return {title:p.name+' 신혼살림',text:'신혼살림을 어디에 차릴까?'+(S.year>=2010?' 요즘은 거의 다 따로 나가 산다. 부모 집 가까이에 얻는 집도 많다.':p.sex==='f'?' 사위가 처가에 들어와 사는 집은 드물다.':' 요즘은 따로 나가 사는 집이 늘었다.'),opts:[{k:'stay',t:'집에서 함께 산다'},{k:'out',t:'나가서 산다 ('+wonY(costOf('out'))+')',need:{money:costOf('out')}}]};
      const C=a.cands=a.cands||{good:makeCand(p,'good'),mid:makeCand(p,'mid'),plain:makeCand(p,'plain')};const mh=marryHome(p);
      return {title:p.name+' 혼사 ('+age(p)+'세)',text:(S.year<1975?'중매쟁이가 혼처 셋을 물어 왔다. ':S.year<1995?'혼처가 셋 들어왔다. ':'만나는 사람, 소개받은 사람이 있다. ')+(mh==='out'?'딸은 혼인하면 시댁으로 간다. ':mh==='in'?'며느리는 우리 집으로 들어와 산다. ':'')+' 이름난 집안일수록 우리 체면이 받쳐 줘야 하고, 모자라면 사돈댁에 얕보일 수 있다.'+(p.desire==='사랑'?' '+p.name+josa(p.name,'은/는')+' 마음에 둔 사람이 있는 눈치다.':''),
        opts:[{k:'good',t:'이름난 집안 — '+candText(C.good)+' (체면 '+goodFace()+'↑, '+wonY(weddingCost('good'))+')',need:{face:goodFace(),money:weddingCost('good')}},{k:'mid',t:'무난한 집안 — '+candText(C.mid)+' (체면 '+(goodFace()-30)+'↑, '+wonY(weddingCost('mid'))+')',need:{face:goodFace()-30,money:weddingCost('mid')}},{k:'plain',t:'형편 비슷한 집 — '+candText(C.plain)+' ('+wonY(weddingCost('plain'))+')',need:{money:weddingCost('plain')}},{k:'later',t:'아직 이르다'}]}}
    case 'shop':{const keep=S.biz&&S.biz!=='stall';const ch=keep?[S.biz]:(a.opts=a.opts||pickN(bizChoices(),3));return {title:'점포 얻기',text:'장사 경력 '+Math.floor(S.tradeY)+'년. '+(S.year<1980?'시장에':'길가에')+' 번듯한 점포 자리가 났다. 장사 벌이가 1.35배가 된다.'+(keep?'':' 무슨 가게를 낼지도 정해야 한다.'),
      opts:ch.map(b=>({k:keep?'yes':'b_'+b,t:(keep?bizOf().n(S.year)+' 점포를 얻는다':BIZ[b].n(S.year)+josa(BIZ[b].n(S.year),'을/를')+' 연다')+' ('+wonY(costOf('shop'))+')'+(keep?'':' — '+BIZ[b].d),need:{money:costOf('shop')}})).concat([{k:'no',t:'아직 버틴다'}])}}
    case 'whole':return {title:S.year<2000?'도매상으로':'유통 회사로',text:'가게가 자리를 잡았다. 한 단계 더 키우면 벌이가 2.1배가 된다.',opts:[{k:'yes',t:'키운다 ('+wonY(costOf('whole'))+')',need:{money:costOf('whole')}},{k:'no',t:'지금도 충분하다'}]};
    case 'skill':return {title:'숙련 대우',text:'기술 경력 '+Math.floor(S.craftY)+'년. 숙련 기술자 대우를 해 주겠다고 한다.',opts:[{k:'yes',t:'받아들인다'},{k:'no',t:'지금 자리가 편하다'}]};
    case 'factory':return {title:S.year<2000?'우리 공장':'기술 회사 차리기',text:'내 사업을 차릴 기회가 왔다. 기술 벌이가 1.9배가 된다.',opts:[{k:'yes',t:'차린다 ('+wonY(costOf('factory'))+')',need:{money:costOf('factory')}},{k:'no',t:'월급이 편하다'}]};
    case 'house':return {title:'내 집 마련',text:'판잣집을 벗어날까? 집이 생기면 철거 걱정이 없고 집값도 오른다.',opts:[{k:'yes',t:'집을 산다 ('+wonY(costOf('house'))+')',need:{money:costOf('house')}},{k:'no',t:'아직이다'}]};
    case 'apt':return {title:'아파트',text:'동네에 아파트 분양이 났다. 지금 집을 팔고 보태면 들어갈 수 있다.'+(S.house==='own'?' (집 판 돈 '+wonY(houseVal()*.9)+' 포함)':''),
      opts:[{k:'yes',t:'들어간다 ('+wonY(Math.max(0,costOf('apt')-(S.house==='own'?houseVal()*.9:0)))+')',need:{money:Math.max(0,costOf('apt')-(S.house==='own'?houseVal()*.9:0))}},{k:'no',t:'땅 밟고 사는 게 좋다'}]};
    case 'bank':return {title:'통장 만들기',text:'올해 물가 상승률 '+Math.round(inflation(S.year)*100)+'%. 장롱 속 돈은 그만큼 가치가 깎인다. 통장에 넣으면 이자 '+Math.round(savRate(S.year)*100)+'%가 붙는다.',opts:[{k:'yes',t:'통장을 만든다'},{k:'no',t:'장롱이 더 믿음직하다'}]};
    case 'land':{const own=S.lands||[];const opts=[];
      a.offers.forEach((o,k)=>opts.push({k:'buy'+k,t:LAND_KINDS[o.kind].name+' 한 필지 산다 ('+wonY(o.price)+')',need:{money:o.price}}));
      if(a.offers.length>=2){const t=a.offers.reduce((x,o)=>x+o.price,0);opts.push({k:'buyall',t:'나온 땅을 모두 산다 ('+wonY(t)+')',need:{money:t}})}
      own.forEach((p,k)=>{if(k<4)opts.push({k:'sell'+k,t:landDesc(p)+' 판다 (+'+wonY((parcelVal(p)+(p.bld?bldVal():0))*.95)+')'})});
      const ls=own.findIndex(p=>!p.lease&&!p.bld);if(ls>=0)opts.push({k:'lease'+ls,t:LAND_KINDS[own[ls].kind].name+josa(LAND_KINDS[own[ls].kind].name,'을/를')+' 세놓는다'});
      const bd=own.findIndex(p=>LAND_KINDS[p.kind].build&&!p.bld);if(bd>=0&&S.year>=1965)opts.push({k:'build'+bd,t:'상가 건물을 올린다 ('+wonY(bldVal())+')',need:{money:bldVal()}});
      opts.push({k:'no',t:'그대로 둔다'});
      return {title:'땅',text:'가진 땅 '+own.length+'필지 ('+wonY(landTotal())+')'+(own.length?': '+own.map(landDesc).join(', '):'')+'. 올해 나온 땅 '+a.offers.length+'필지. 세놓으면 해마다 세가 들어오고, 건물을 올리면 월세를 받는다.',opts}}
    case 'move':return {title:'이사',text:'지금 사는 곳: '+placeName()+'. 이사를 가면 이웃과 단골이 바뀐다.',
      opts:a.opts.map(k=>{const m=MOVES[k];const c=moveCost(k);return {k,t:m.name+(c>0?' ('+wonY(c)+' 더 듦)':' (집 팔고 '+wonY(-c)+' 남음)')+' — '+m.desc,need:c>0?{money:c}:null}}).concat([{k:'no',t:'여기서 산다'}])};
    case 'tutor':{const ks=homeAlive().filter(p=>!p.inlaw&&age(p)>=7&&age(p)<=19);return {title:S.year<1980?'서당과 과외':S.year<2010?'학원과 과외':'아이들 공부',text:'아이들('+ks.map(p=>p.name).join(', ')+') 공부에 돈을 들일까? 글이 오르고 학문의 길에 보탬이 된다.',
      opts:[{k:'big',t:'제대로 시킨다 ('+wonY(cm(10))+')',need:{money:cm(10)}},{k:'small',t:'책을 사 준다 ('+wonY(cm(3))+')',need:{money:cm(3)}},{k:'no',t:'학교로 충분하다'}]}}
    case 'exam':{const ks=examOpts(p);const cur=p.f.exam&&EXAMS[p.f.exam];
      return {title:p.name+'의 시험 ('+age(p)+'세)',text:(cur?p.name+josa(p.name,'이/가')+' '+cur.n(S.year)+' 공부를 '+(p.f.examY||0)+'년째 하고 있다. 계속할까? ':p.name+josa(p.name,'은/는')+' 글 '+pt(p.tal.글)+', 끈기 '+pt(p.tal.끈기)+'. '+(p.slot==='study'?'일 대신 공부를 하고 있다. 무슨 시험을 볼까?':'글 솜씨가 아깝다. 일을 쉬고 시험을 준비해 볼까?'))+' 공부하는 동안은 벌이가 없다.',
       opts:ks.map(k=>{const e=EXAMS[k];const q=Object.assign({},p,{f:Object.assign({},p.f,{exam:k,examY:cur&&p.f.exam===k?p.f.examY:0})});return {k,t:e.n(S.year)+' — '+e.d+' (한 해 붙을 가능성 '+Math.round(examChance(q)*100)+'%)'}}).concat([{k:'no',t:cur?'그만두고 일을 찾는다':'일을 계속한다'}])}}
    case 'biz':{const b=bizOf();const c=bizCost();return {title:'업종 바꾸기',text:'지금 하는 장사: '+(S.tradeSt>=3?b.big+' ('+b.n(S.year)+')':b.n(S.year))+'. '+(bizFade()<1?'이 장사는 시대가 지나 손님이 줄었다 (벌이 '+Math.round(bizFade()*100)+'%). ':S.year>=b.y[1]-3?'이 장사도 곧 저물 것 같다. ':'')+'업종을 바꾸면 '+wonY(c)+'이 들고 단골 일부를 잃는다.',
      opts:a.opts.filter(k=>BIZ[k]).map(k=>({k,t:BIZ[k].n(S.year)+' ('+wonY(c)+') — '+BIZ[k].d+' · 중요한 재주: '+Object.keys(BIZ[k].w).sort((x,z)=>BIZ[k].w[z]-BIZ[k].w[x]).slice(0,2).join('·'),need:{money:c}})).concat([{k:'no',t:'하던 장사를 계속한다'}])}}
    case 'arts':{const A=ARTS[p.f.dream],a=age(p),y=S.year,k=A.tal;const lv=p.f.artsLv||0;
      const said={음악:y<1975?'라디오 노래를 하루 종일 따라 부르고, 밥상을 두드리며 박자를 맞춘다':'남의 집 피아노 소리만 들리면 창가에 붙어 선다',미술:'공책마다 그림이 가득하다. 교과서 귀퉁이에도 사람 얼굴이 그려져 있다',운동:'학교가 끝나면 날이 저물 때까지 운동장에서 안 들어온다',연기:'식구들 앞에서 연속극 흉내를 내고 노래를 부른다'}[p.f.dream];
      const base={title:p.name+'의 꿈 — '+A.dream+' ('+a+'세)',text:p.name+josa(p.name,'은/는')+' '+said+'. '+A.dream+josa(A.dream,'을/를')+' 하고 싶다고 한다. '+k+' '+Math.round(p.tal[k]*10)+(p.f.desireKnown?' · 바라는 것: '+p.desire:'')+'.'};
      if(a<=14||lv===0)return {...base,opts:[{k:'lesson',t:A.lesson(y)+'에 보낸다 ('+wonY(cm(4))+')',need:{money:cm(4)}},{k:'self',t:'돈 안 드는 방법을 찾아 준다'},{k:'later',t:'공부가 먼저다'}]};
      return {...base,text:base.text+' 배운 지 '+(y-(p.f.artsStart||y))+'년째다.',opts:[{k:'pro',t:A.school(y)+(p.f.dream==='운동'?'으로 키운다':'에 보낸다')+' ('+wonY(cm(12))+')',need:{money:cm(12)}},{k:'contest',t:'대회에 나가 본다 ('+wonY(cm(3))+')',need:{money:cm(3)}},{k:'hobby',t:'취미로 남기고 제 앞가림부터'},{k:'stop',t:'이제 그만두게 한다'}]}}
    case 'buy':{const L=buyList();const t=wealthTier();return {title:'살림 장만',text:'형편: '+WEALTH[t]+' (모아 둔 돈 '+wonY(S.money)+'). 형편이 좋을수록 고를 수 있는 것이 늘어난다. 여러 개를 사도 된다.',
      opts:L.map(it=>({k:it.id,t:it.n(S.year)+' ('+wonY(buyCost(it))+') — '+it.d,need:{money:buyCost(it)}})).concat([{k:'no',t:'이번엔 아낀다'}])}}
    case 'feast':return {title:S.year<1990?'동네 잔치':'동네에 베풀기',text:'동네에 베풀 기회다. 돈은 들지만 이웃 정이 깊어지고 정의 길에 보탬이 된다.',
      opts:[{k:'big',t:S.year<1990?'골목 잔치를 연다':'동네 행사에 크게 기부한다'+' ('+wonY(cm(12))+')',need:{money:cm(12)}},{k:'small',t:'어려운 집 몇 곳을 챙긴다 ('+wonY(cm(4))+')',need:{money:cm(4)}},{k:'no',t:'우리 살기도 바쁘다'}]};
    case 'workshop':{const H=HERIT[a.hk||'craft'],m=a.mid?P(a.mid):null;const RN={craft:'장인',wealth:'부',learn:'학문',jeong:'정'}[H.route];
      return {title:'가업 전수 — '+H.t(S.year),text:(m?m.name+josa(m.name,'이/가')+' 가진 ':'집안의 ')+H.what+josa(H.what,'을/를')+' 아랫대에 물려줄까? 식구들 '+H.tal.join('·')+josa(H.tal[H.tal.length-1],'이/가')+' 오르고 '+RN+'의 길에 보탬이 된다.',
      opts:[{k:'big',t:H.big(S.year)+' ('+wonY(cm(10))+')',need:{money:cm(10)}},{k:'small',t:H.small+' (일손이 조금 준다)'},{k:'no',t:'저마다 제 길을 찾게 둔다'}]}}
    case 'roots':return {title:S.year<2000?'고향과 족보':'집안 기록',text:'흩어진 집안 이야기를 모을까? 뿌리의 길에 보탬이 된다.',
      opts:[{k:'big',t:(S.year<1990?'고향 사람들을 수소문한다':'집안 기록을 책으로 엮는다')+' ('+wonY(cm(8))+')',need:{money:cm(8)}},{k:'small',t:'어른들 이야기를 받아 적는다'},{k:'no',t:'지난 일이다'}]};
    case 'free':{const o=freeOpts(p,a);return {title:p.name+'의 길 ('+age(p)+'세)',text:o.text,opts:o.opts}}
    case 'kinhome':return {title:p.name+' 식구와 함께 살기',text:'따로 사는 '+p.name+josa(p.name,'이/가')+' 설에 왔다가, 다시 들어와 살 수도 있다는 눈치다. 들어오면 가게 일손과 어르신 돌봄이 늘지만, 제 살림 몫은 따로 챙기니 집에 보태는 건 벌이의 4분의 1쯤이다. 따로 살면 대신 용돈을 부친다. 식구가 일곱이 넘으면 집이 비좁아 다툼이 잦다.',opts:[{k:'yes',t:'들어와 살자고 한다'},{k:'no',t:'지금처럼 오가며 산다'}]};
    case 'ourjokbo':return {title:'우리 족보',text:'동네에서 알아주는 집이 됐다. 남의 족보에 기대지 않고 우리 집 족보를 새로 쓰자는 말이 나온다.',opts:[{k:'yes',t:'족보는 우리부터 쓴다'},{k:'no',t:'때가 아니다'}]};
    case 'rep':{const r=rep();const cands=homeAlive().filter(q=>age(q)>=20&&q.id!==S.repId);
      return {title:'집안 대표',text:'집안을 이끌 사람을 바꿀 수 있다. 물러난 사람은 어른으로 남는다.'+(r&&age(r)>=70?' '+r.name+josa(r.name,'은/는')+' 벌써 '+age(r)+'세다.':''),opts:cands.map(q=>({k:'p'+q.id,t:q.name+' ('+relLabel(q)+', '+age(q)+'세)'}))}}
  }
}
function optNeed(o){if(!o.need)return '';if(o.need.face&&S.face<o.need.face)return '체면 '+o.need.face+' 필요';if(o.need.money&&S.money<o.need.money)return wonY(o.need.money)+' 필요';return ''}
function moveCost(k){const m=MOVES[k];const sell=S.house!=='shack'?houseVal()*.92:0;const pl=m.land??1;
  const buy=m.house==='apt'?P_APT(Math.max(1970,S.year))*pl:k==='rural'?P_HOUSE(S.year)*.45:P_HOUSE(S.year)*(TOWNS[S.town].land||1);
  return buy+RI(S.year)*.05-sell}
function doMove(k,out){
  const m=MOVES[k];const c=moveCost(k);S.money-=c;
  out.push(c<0?'집을 팔고 남은 돈 '+sgW(-c):'이사 비용 '+sgW(-c));
  if(k==='back'&&S.oldNbs){const cur=S.nbs;S.nbs=S.oldNbs.map(n=>Object.assign(n,{j:Math.round(n.j*.8)}));S.oldNbs=null;S.place=Object.assign({kind:'origin'},TOWNS[S.town]);out.push('옛 이웃들이 반긴다');void cur}
  else{
    if(S.place.kind==='origin')S.oldNbs=S.nbs.map(n=>Object.assign({},n));
    const used=[S.sur];S.nbs=Object.keys(NB_ROLES).map(role=>{let s;do{s=pick(SURN)}while(used.includes(s));used.push(s);
      return {key:role+'_'+S.year,role:'new',ch:NB_ROLES[role].ch,sur:s,head:genName(pick(['m','f']),S.year-ri(35,60)),j:m.kind==='rural'?1:0,since:S.year,custom:m.kind==='rural'?pick(['논농사 짓는 집','과수원 집','마을 이장 집','귀농한 부부','혼자 사는 할머니 집','민박 하는 집']):pick(['같은 동 이웃','윗집','아랫집','관리사무소 옆집','통장 집','맞벌이 집'])}});
    S.place=Object.assign({},TOWNS[S.town],{kind:m.kind,name:m.name,land:m.land??1,trade:(TOWNS[S.town].trade||1)*(m.trade??1),craft:(TOWNS[S.town].craft||1)*(m.craft??1)});
    if(m.trade<1&&S.tradeSt>1){S.tradeY*=.6;out.push('단골이 끊겨 장사 경력이 줄었다')}
  }
  if(m.house)S.house=m.house;
  S.face=clamp(S.face+m.face,0,100);if(m.face)out.push('체면 '+sg(m.face));
  S.moves.push({y:S.year,to:m.name});const r=rep();if(r)r.recs.push({y:S.year,t:m.name+(k==='back'?'으로 돌아왔다':'로 이사했다'),w:3});
  out.push(m.name+(k==='back'?'으로 돌아왔다':'로 이사했다'));
}
function runAgenda(ai,k){
  const a=S.agendas[ai];if(!a)return;const done=S.agendaRes[ai];if(done&&!done.partial)return;
  const v=agendaView(a);const o=v.opts.find(x=>x.k===k);if(!o||optNeed(o))return;
  const p=a.pid?P(a.pid):null;const out=[];const r=rep();
  switch(a.kind){
    case 'mid':p.f.midDecided=true;if(k==='yes'){p.f.mid=true;p.slot='study';out.push(p.name+' 중학교 진학')}else{if(p.desire==='출세'){p.grudge=clamp(p.grudge+2,0,10);out.push(p.name+josa(p.name,'이/가')+' 몰래 울었다')}p.slot='trade';out.push(p.name+josa(p.name,'은/는')+' 이제 일을 한다')}break;
    case 'college':p.f.collegeDecided=true;if(k==='yes'){p.f.college=true;p.slot='study';out.push(p.name+' 대학 진학');p.recs.push({y:S.year,t:'대학에 들어갔다',w:1})}else{if(p.desire==='출세')p.grudge=clamp(p.grudge+2,0,10);out.push(p.name+josa(p.name,'은/는')+' 공부를 접었다');p.f.adultSet=false}break;
    case 'marry':
      if(S.agendaStep&&S.agendaStep.pid===p.id){
        if(k==='out'){S.money-=costOf('out');const sp=P(p.spouse);p.status='away';p.away={why:'분가',until:null};if(sp){sp.status='away';sp.away={why:'분가',until:null}}out.push(p.name+' 부부가 따로 살림을 났다 ('+sgW(-costOf('out'))+')')}
        else out.push(p.name+' 부부가 한집에 산다');S.agendaStep=null;break}
      if(k==='later'){out.push('혼사를 미뤘다');break}
      doMarry(p,k,out,a.cands&&a.cands[k]);{const mh=marryHome(p);const sp=P(p.spouse);
        if(mh==='out'){moveOut(p,'출가');out.push(p.name+josa(p.name,'은/는')+' '+(S.year<1980?'출가외인이라며 ':'')+'시댁으로 들어갔다. 명절이면 친정에 다니러 온다');S.agendaStep=null;break}
        if(mh==='with'){familySync();out.push(p.name+' 부부는 '+(p.away?p.away.why+'해 ':'')+'사는 곳에서 살림을 차렸다');S.agendaStep=null;break}
        if(mh==='son-in-law'){out.push('집에 남을 자식이 없어 '+(sp?sp.name+josa(sp.name,'을/를')+' ':'')+'데릴사위로 들였다');S.agendaStep=null;break}
        if(mh==='in'){if(sp){sp.status='home';sp.away=null}out.push(sp?sp.name+josa(sp.name,'이/가')+' 우리 집 며느리로 들어왔다':'');S.agendaStep=null;break}}
      S.agendaStep={kind:'live',pid:p.id};S.agendaRes[ai]={title:v.title,msgs:out,partial:true};return;
    case 'shop':if(k==='yes'||k.startsWith('b_')){if(k.startsWith('b_')){S.biz=k.slice(2);S.bizY=S.year}S.money-=costOf('shop');S.tradeSt=2;S.face=clamp(S.face+2,0,100);out.push(bizOf().n(S.year)+' 점포를 얻었다 (체면 +2)');r.recs.push({y:S.year,t:'좌판에서 시작해 점포를 얻었다',w:3})}else out.push('지금 자리를 지킨다');break;
    case 'whole':if(k==='yes'){S.money-=costOf('whole');S.tradeSt=3;S.face=clamp(S.face+3,0,100);out.push('가게를 한 단계 키웠다 (체면 +3)');r.recs.push({y:S.year,t:'가게를 '+(S.year<2000?'도매상':'유통 회사')+'으로 키웠다',w:3})}else out.push('점포를 지킨다');break;
    case 'skill':if(k==='yes'){S.craftSt=2;out.push('숙련 대우를 받는다')}else out.push('지금 자리에 남는다');break;
    case 'factory':if(k==='yes'){S.money-=costOf('factory');S.craftSt=3;S.face=clamp(S.face+3,0,100);out.push('내 사업을 차렸다');r.recs.push({y:S.year,t:S.year<2000?'작은 공장을 차렸다':'기술 회사를 차렸다',w:3})}else out.push('월급을 받는다');break;
    case 'house':if(k==='yes'){S.money-=costOf('house');S.house='own';S.face=clamp(S.face+4,0,100);out.push('판잣집을 떠나 내 집을 마련했다 (체면 +4)');r.recs.push({y:S.year,t:'판잣집을 떠나 내 집을 마련했다',w:4})}else out.push('조금 더 모으기로 했다');break;
    case 'apt':if(k==='yes'){const c=Math.max(0,costOf('apt')-(S.house==='own'?houseVal()*.9:0));S.money-=c;S.house='apt';S.face=clamp(S.face+2,0,100);out.push('아파트로 들어갔다 (체면 +2)');r.recs.push({y:S.year,t:'아파트로 이사했다',w:2})}else out.push('지금 집에 산다');break;
    case 'bank':if(k==='yes'){S.flags.savings=S.year;out.push('통장을 만들었다. 이제 돈에 이자가 붙는다')}else out.push('장롱에 둔다');break;
    case 'land':{
      if(k==='no'){out.push('땅은 그대로 둔다');break}
      const buy=o=>{S.money-=o.price;const p=landAdd(o.kind,o.m);p.paid=o.price;out.push(LAND_KINDS[o.kind].name+' 한 필지를 샀다 ('+sgW(-o.price)+')');if(S.land===1)r.recs.push({y:S.year,t:'처음으로 땅을 샀다',w:2})};
      if(k==='buyall'){a.offers.forEach(buy);break}
      if(k.startsWith('buy')){buy(a.offers[+k.slice(3)]);break}
      if(k.startsWith('sell')){const p=landRemove(+k.slice(4));const v=(parcelVal(p)+(p.bld?bldVal():0))*.95;S.money+=v;out.push(landDesc(p)+josa(LAND_KINDS[p.kind].name,'을/를')+' 팔았다 ('+sgW(v)+')');break}
      if(k.startsWith('lease')){S.lands[+k.slice(5)].lease=true;out.push('땅을 세놓았다. 해마다 세가 들어온다');break}
      if(k.startsWith('build')){const p=S.lands[+k.slice(5)];S.money-=bldVal();p.bld=true;S.face=clamp(S.face+2,0,100);out.push('상가 건물을 올렸다 ('+sgW(-bldVal())+', 체면 +2)');r.recs.push({y:S.year,t:'우리 땅에 상가 건물을 올렸다',w:3});break}
      break}
    case 'move':if(k==='no'){out.push('지금 동네에 산다');break}doMove(k,out);break;
    case 'tutor':{const ks=homeAlive().filter(q=>!q.inlaw&&age(q)>=7&&age(q)<=19);if(k==='no'){out.push('학교 공부로 충분하다');break}S.lastEdu=S.year;
      const c=k==='big'?cm(10):cm(3);S.money-=c;for(const q of ks){const v=k==='big'?1.5:.7;if(q.tal.글<q.cap.글)q.tal.글=Math.min(q.cap.글,q.tal.글+v);if(k==='big'&&R()<.3)q.cap.글=Math.min(10,q.cap.글+1)}
      routeAdd('learn',k==='big'?3:1);out.push(ks.map(q=>q.name).join(', ')+' 글 +'+(k==='big'?15:7)+' ('+sgW(-c)+')');if(k==='big'&&ks.some(q=>q.desire==='자유'||q.desire==='부')){const q=ks.find(q=>q.desire==='자유'||q.desire==='부');q.grudge=clamp(q.grudge+1,0,10);out.push(q.name+josa(q.name,'은/는')+' 공부가 싫은 눈치다')}break}
    case 'exam':{if(k==='no'){if(p.f.exam){out.push(p.name+josa(p.name,'이/가')+' 시험을 접었다');p.f.exam=null;p.f.examY=0;p.f.examDone=true;if(p.slot==='study'&&p.edu<2)p.slot=bestWork(p)}else out.push(p.name+josa(p.name,'은/는')+' 하던 일을 계속한다');break}
      if(p.f.exam!==k)p.f.examY=0;p.f.exam=k;p.slot='study';out.push(p.name+josa(p.name,'이/가')+' '+EXAMS[k].n(S.year)+' 공부를 '+(p.f.examY?'이어 간다':'시작했다')+'. 가을마다 결과가 나온다');break}
    case 'biz':{if(k==='no'){S.bizY=S.year;out.push('하던 장사를 계속한다');break}const old=bizOf().n(S.year);S.money-=bizCost();S.biz=k;S.bizY=S.year;S.repu=Math.round((S.repu||50)*.6);S.tradeY*=.85;const nw=BIZ[k].n(S.year);const msg=old+josa(old,'을/를')+' 접고 '+nw+josa(nw,'을/를')+' 열었다';out.push(msg);const r0=rep();if(r0)r0.recs.push({y:S.year,t:msg,w:2});break}
    case 'arts':{const A=ARTS[p.f.dream],kk=A.tal;const up=(v)=>{p.tal[kk]=Math.min(p.cap[kk],p.tal[kk]+v)};p.f.artsY=S.year;
      if(k==='lesson'){S.money-=cm(4);up(.8);p.aff=clamp(p.aff+2,-10,10);p.f.artsLv=1;p.f.artsStart=p.f.artsStart||S.year;out.push(p.name+josa(p.name,'이/가')+' '+A.lesson(S.year)+'에 다닌다. '+kk+' +8, 애정 +2')}
      else if(k==='self'){up(.4);p.aff=clamp(p.aff+1,-10,10);p.f.artsLv=1;p.f.artsStart=p.f.artsStart||S.year;out.push(({음악:'교회 성가대에 넣어 줬다',미술:'헌 달력 뒷면과 크레파스를 모아 줬다',운동:'동네 형들 운동하는 데 끼워 줬다',연기:'학교 학예회에 나가게 했다'})[p.f.dream]+'. '+kk+' +4, 애정 +1')}
      else if(k==='later'){p.grudge=clamp(p.grudge+1,0,10);if(R()<.4){p.f.artsDone=true;out.push(p.name+josa(p.name,'은/는')+' 꿈을 접었다 (원한 +1)')}else out.push(p.name+josa(p.name,'이/가')+' 서운해한다 (원한 +1)')}
      else if(k==='pro'){S.money-=cm(12);up(1.2);p.cap[kk]=Math.min(10,p.cap[kk]+1);p.f.artsPro=true;p.f.artsDone=true;p.slot='study';p.aff=clamp(p.aff+3,-10,10);p.grudge=Math.max(0,p.grudge-2);routeAdd('free',3);p.recs.push({y:S.year,t:A.school(S.year)+'에 가 '+A.dream+'의 길을 걸었다',w:3});out.push(p.name+josa(p.name,'이/가')+' '+A.dream+'의 길로 간다. '+kk+' +12, 한계 +10, 자유의 길에 보탬')}
      else if(k==='contest'){S.money-=cm(3);up(.4);const win=R()<.15+p.tal[kk]*.06;if(win){S.face=clamp(S.face+2,0,100);p.aff=clamp(p.aff+2,-10,10);p.recs.push({y:S.year,t:A.dream+' 대회에서 상을 받았다',w:2});out.push(p.name+josa(p.name,'이/가')+' 대회에서 상을 받았다! 체면 +2')}else{p.tal.끈기=Math.min(p.cap.끈기,p.tal.끈기+.5);out.push(p.name+josa(p.name,'은/는')+' 상은 못 받았지만 다시 해 보겠다고 한다')}}
      else if(k==='hobby'){p.f.artsDone=true;p.f.artsHobby=true;out.push(p.name+josa(p.name,'은/는')+' '+A.dream+josa(A.dream,'을/를')+' 취미로 이어 간다')}
      else{p.f.artsDone=true;p.grudge=clamp(p.grudge+2,0,10);p.aff=clamp(p.aff-1,-10,10);out.push(p.name+josa(p.name,'이/가')+' 크게 서운해한다 (원한 +2)')}
      break}
    case 'buy':{if(k==='no'){out.push('살림은 그대로 둔다');break}const it=BUY_ITEMS.find(x=>x.id===k);if(!it)break;S.money-=buyCost(it);(S.bought=S.bought||{})[it.id]=S.year;out.push(it.n(S.year)+josa(it.n(S.year),'을/를')+' 장만했다');it.fx(out);
      if(buyList().length){const prev=S.agendaRes[ai];S.agendaRes[ai]={title:v.title,msgs:(prev&&prev.msgs||[]).concat(out),partial:true};logIt('설: 살림 장만 — '+out[0]);return}break}
    case 'feast':{if(k==='no'){out.push('올해는 넘어간다');break}S.lastFeast=S.year;const c=k==='big'?cm(12):cm(4);S.money-=c;const v=k==='big'?2:1;for(const n of S.nbs)n.j=clamp(n.j+v,-20,20);if(k==='big')S.face=clamp(S.face+2,0,100);
      routeAdd('jeong',k==='big'?5:2);out.push('이웃 모두 정 +'+v+(k==='big'?', 체면 +2':'')+' ('+sgW(-c)+')');if(k==='big')r.recs.push({y:S.year,t:S.year<1990?'골목 잔치를 열어 동네를 대접했다':'동네에 크게 베풀었다',w:2});break}
    case 'workshop':{const H=HERIT[a.hk||'craft'],m=a.mid?P(a.mid):null;if(k==='no'){out.push('저마다 제 길을 찾게 둔다');S.lastWork=S.year;break}S.lastWork=S.year;
      const H2=homeAlive().filter(q=>age(q)>=10&&age(q)<=40&&(!m||q.id!==m.id));
      if(k==='big'){const c=cm(10);S.money-=c;H.bigFx();routeAdd(H.route,4);out.push(H.big(S.year)+' ('+sgW(-c)+')');(m||r).recs.push({y:S.year,t:H.what+josa(H.what,'을/를')+' 아랫대에 물려주었다',w:2})}
      else{routeAdd(H.route,1.5);S.money-=cm(1.5);out.push(H.small+' (일손이 줄어 '+sgW(-cm(1.5))+')')}
      const got=[];for(const q of H2){let up=false;for(const t of H.tal)if(q.tal[t]<q.cap[t]&&R()<(k==='big'?.8:.5)){q.tal[t]=Math.min(q.cap[t],q.tal[t]+.4+R()*.6);up=true}if(up)got.push(q.name)}
      out.push(got.length?got.join('·')+'의 '+H.tal.join('·')+josa(H.tal[H.tal.length-1],'이/가')+' 늘었다':'아직 배울 만한 아이가 없다');break}
    case 'roots':{if(k==='no'){out.push('지난 일은 묻어 둔다');break}S.lastRoot=S.year;if(k==='big'){const c=cm(8);S.money-=c;routeAdd('root',4);S.frag=clamp(S.frag+1,0,5);out.push('흩어진 집안 이야기를 모았다 ('+sgW(-c)+', 고향 기억 조각 +1)');r.recs.push({y:S.year,t:S.year<1990?'고향 사람들을 수소문해 집안 내력을 모았다':'집안 기록을 책으로 엮었다',w:3})}
      else{routeAdd('root',1.5);if(R()<.4){S.frag=clamp(S.frag+1,0,5);out.push('어른들 이야기에서 고향 기억 조각 하나를 찾았다')}else out.push('어른들 이야기를 받아 적었다')}break}
    case 'free':{if(k==='no'){p.grudge=clamp(p.grudge+(p.pers.고집>=7?2:1),0,10);out.push(p.name+josa(p.name,'이/가')+' 입을 다물었다');break}
      const o=FREE_PATHS[p.desire].opts.find(x=>x.k===k);if(!o)break;if(o.cost){const c=cm(o.cost);S.money-=c;out.push('돈 '+sgW(-c))}
      p.f.freed=true;p.grudge=Math.max(0,p.grudge-2);p.aff=clamp(p.aff+2,-10,10);routeAdd('free',1);
      out.push(o.fx(p));p.aff=clamp(p.aff,-10,10);if(!p.recs.some(x=>/제 뜻/.test(x.t)))p.recs.push({y:S.year,t:'집안이 제 뜻을 들어주었다 ('+p.desire+')',w:2});break}
    case 'kinhome':if(k==='yes'){applyFx({comeHome:true},{subj:p},out)}else{out.push('지금처럼 오가며 지내기로 했다')}break;
    case 'ourjokbo':if(k==='yes'){S.flags.ourJokbo=S.year;S.gap.f=clamp(S.gap.f-2,-5,5);out.push('우리 집 족보 첫 장을 쓰기 시작했다');r.recs.push({y:S.year,t:'족보는 우리부터 쓴다며 첫 장을 적었다',w:4})}else out.push('다음으로 미뤘다');break;
    case 'rep':{const q=P(+k.slice(1));const old=rep();const ek=eldestOfGen(q.gen);
      if(q.gen>=2&&!q.inlaw&&ek&&ek.id!==q.id&&S.year<2000){S.face=clamp(S.face-3,0,100);ek.grudge=clamp(ek.grudge+2,0,10);out.push('친척들이 "맏이를 두고?" 하며 수군거린다 (체면 −3)');out.push(ek.name+josa(ek.name,'이/가')+' 서운해한다')}
      S.repId=q.id;out.push(q.name+josa(q.name,'이/가')+' 집안을 이끈다');
      if(old&&age(old)>=55){retire(old,age(old)+'세에 대표를 넘기고 일에서 물러났다');out.push(old.name+josa(old.name,'은/는')+' 일에서 물러나 어른으로 지낸다')}
      if(old)old.recs.push({y:S.year,t:age(old)+'세에 '+q.name+'에게 집안 대표를 넘겼다',w:1});break}
  }
  const prev=S.agendaRes[ai];S.agendaRes[ai]={title:prev&&prev.partial?prev.title:v.title,msgs:(prev&&prev.partial?prev.msgs:[]).concat(out)};logIt('설: '+v.title+' — '+out[0]);
}
function relativeLine(){
  const H=homeAlive();const L=[];
  if(S.house==='shack')L.push('"그래서 그 집은 언제 판잣집 면하나?"');
  const st=H.find(p=>p.slot==='study'&&age(p)>=10&&age(p)<=19);if(st)L.push('"'+st.name+josa(st.name,'은/는')+' 공부 잘한다며?"');
  const sg1=H.find(p=>!p.inlaw&&p.gen>=2&&!p.f.married&&age(p)>=(S.year<1990?25:31));if(sg1)L.push('"'+sg1.name+' '+(S.year<2000?'국수는 언제 먹여 줄 거야?':'결혼은 생각 있니?')+'"');
  const aw=S.people.find(p=>p.alive&&p.status==='away'&&!p.inlaw);if(aw)L.push('"'+aw.name+josa(aw.name,'은/는')+' 올해도 못 왔네."');
  if(S.face>=55)L.push('"요즘 이 집 칭찬이 자자하더라."');
  if(S.money<0)L.push('"빚은 좀 갚았어?"');
  if(S.year>=2015)L.push('"다들 휴대폰만 보지 말고 얼굴 좀 보자."');
  if(!L.length)L.push('"올해도 다들 무탈해서 다행이다."');
  return pick(L);
}

/* ===================== 이웃의 세월 ===================== */
function movingNeighbors(){
  // 이웃 집안도 대가 바뀐다
  for(const n of S.nbs){if(S.year-n.since>=30&&R()<.25){n.since=S.year;n.head=genName(pick(['m','f']),S.year-ri(35,50));const old=n.j;n.j=Math.round(n.j*.6);
    S.newsY.push({t:nbName(n)+'도 대가 바뀌었다. 새 어른 '+n.head+' (정 '+old+' → '+n.j+')'})}}
  if(S.year<1988||S.place.kind!=='origin')return;
  for(let i=0;i<S.nbs.length;i++){const n=S.nbs[i];if(R()<.025){
    const pool=NEW_NB.filter(x=>x[0]<=S.year).pop()[1];const used=S.nbs.map(x=>x.sur).concat([S.sur]);let s;do{s=pick(SURN)}while(used.includes(s));
    const nn={key:'new'+S.year+'_'+i,role:'new',ch:n.ch,sur:s,head:genName(pick(['m','f']),S.year-ri(28,50)),j:0,since:S.year,custom:pick(pool)};
    S.ledger.unshift({y:S.year,nb:nbName(n),t:'이사를 갔다 (정 '+n.j+')',d:0});
    S.newsY.push({major:n.j>=12,t:nbName(n)+josa(nbName(n),'이/가')+' 동네를 떠났다. 빈집에 '+nbName(nn)+'('+nn.custom+')'+josa(nn.custom,'이/가')+' 들어왔다'});
    S.nbs[i]=nn}}
}

/* ===================== 장례·유산·세대 ===================== */
function moveOut(p,why){p.status='away';p.away={why,until:null};const sp=p.spouse?P(p.spouse):null;if(sp&&sp.alive&&sp.status==='home'){sp.status='away';sp.away={why,until:null}}
  for(const c of S.people)if(c.alive&&c.status==='home'&&c.parents.includes(p.id)&&age(c)<20){c.status='away';c.away={why:'부모 따라',until:null}}}
function recallHome(){
  const L=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&age(p)>=16).sort((a,b)=>(a.away&&a.away.why==='의절'?1:0)-(b.away&&b.away.why==='의절'?1:0)||a.gen-b.gen||a.birth-b.birth);
  const p=L[0];if(!p)return null;p.status='home';p.away=null;const sp=p.spouse?P(p.spouse):null;if(sp&&sp.alive){sp.status='home';sp.away=null}
  for(const c of S.people)if(c.alive&&c.parents.includes(p.id)&&c.status==='away'&&c.away&&c.away.why===p.away?.why){c.status='home';c.away=null}
  return p;
}
function repCands(){return homeAlive().filter(p=>age(p)>=16&&p.id!==S.repId).sort((a,b)=>a.gen-b.gen||a.birth-b.birth)}
function mourners(){const L=S.nbs.filter(n=>n.j>=6);if(L.length&&S.lastMourn!==S.year){S.lastMourn=S.year;S.face=clamp(S.face+L.length*.3,0,100)}return L.length?L.map(nbName).join(', ')+' (체면 +'+Math.round(L.length*.3*10)/10+')':'친척 몇 사람'}
function afterAutumn(){
  const goalMsg=checkGoal();if(goalMsg)S.banner=goalMsg;
  const g=S.people.filter(p=>p.gen<=S.curGen&&p.alive);
  if(!g.length){
    const last=S.people.filter(p=>p.gen===S.curGen).sort((a,b)=>(b.death||0)-(a.death||0))[0];
    S.repDied=false;
    if(S.curGen>=3){S.finaleBy=last?last.id:null;return startFinale()}
    S.genPass={reason:'death',from:last?last.id:null};
    const kids=S.people.filter(p=>p.gen===S.curGen+1&&!p.inlaw&&p.alive);
    if(!kids.length){
      if(S.adopted>=2)return endGame('line');
      S.adopted=(S.adopted||0)+1;const sex=R()<.5?'m':'f';
      const c=mkPerson({sex,birth:S.year-ri(16,22),gen:S.curGen+1,adult:true,aff:1});c.f.adopted=true;c.f.adultSet=false;
      c.recs.push({y:S.year,t:'먼 친척 집에서 양자로 들어와 대를 이었다',w:4});
      S.newsY.push({major:true,t:c.name+josa(c.name,'이/가')+' 양자로 들어와 대를 잇는다'});
      S.banner='대를 이을 자식이 없어, 먼 친척 집 '+c.name+josa(c.name,'을/를')+' 양자로 들였다.';
    }
    return startInherit();
  }
  if(!homeAlive().length&&!S.people.some(p=>p.alive&&!p.inlaw)&&(S.adopted||0)<2){
    /* 핏줄이 모두 끊겼다: 먼 친척 집에서 양자를 들여 대를 잇는다 */
    S.adopted=(S.adopted||0)+1;const c=mkPerson({sex:R()<.5?'m':'f',birth:S.year-ri(18,26),gen:S.curGen+1,adult:true,aff:1});c.f.adopted=true;
    c.recs.push({y:S.year,t:'핏줄이 끊긴 집에 먼 친척 집에서 양자로 들어와 대를 이었다',w:4});S.repId=c.id;
    S.newsY.push({major:true,t:c.name+josa(c.name,'이/가')+' 양자로 들어와 대를 잇는다'});
    S.banner='집안에 핏줄이 아무도 남지 않아, 먼 친척 집 '+c.name+josa(c.name,'을/를')+' 양자로 들였다.'}
  if(!homeAlive().length){const b=recallHome();if(!b)return endGame('scatter');S.repId=b.id;S.repDied=false;S.banner=(S.banner?S.banner+' ':'')+'빈집이 된 우리 집에 '+b.name+josa(b.name,'이/가')+' 돌아와 대표를 맡았다.'}
  if(S.repDied){
    S.repDied=false;const old=rep();const c=repCands();
    if(c.length>1){S.repPick={from:old.id};S.phase='chooseRep';return}
    const nr=c[0]||homeAlive().sort((a,b)=>a.birth-b.birth)[0];if(!nr)return endGame('scatter');S.repId=nr.id;
    S.banner=(S.banner?S.banner+' ':'')+old.name+josa(old.name,'이/가')+' 세상을 떠났다. 조문객: '+mourners()+'. 이제 '+nr.name+josa(nr.name,'이/가')+' 집안을 맡는다.';
    return goSeollal();
  }
  goSeollal();
}
function goSeollal(){
  if(S.year>=2110)return startFinale();
  S.agendas=buildAgendas();S.agendaRes={};S.agendaStep=null;S.relLine=null;
  S.visitors=S.people.filter(p=>p.alive&&!p.inlaw&&p.status==='away'&&p.away&&(KIN_WHY.includes(p.away.why)||/파견|군대|유학|공부|해외/.test(p.away.why)&&R()<.4)&&R()<(p.aff+5)/11).map(p=>p.id);
  for(const id of S.visitors){const p=P(id);p.aff=clamp(p.aff+1,-10,10)}
  S.phase='seollal'}
function inheritKids(){return S.people.filter(p=>p.gen===S.curGen+1&&!p.inlaw&&p.alive)}
function startInherit(){
  const kids=inheritKids();if(!kids.length)return finishGen();
  const A=[];
  if(S.house!=='shack')A.push({k:'house',l:houseName(),v:houseVal()});
  if(S.tradeSt>=2)A.push({k:'shop',l:S.tradeSt===2?'가게':'큰 가게',v:costOf(S.tradeSt===2?'shop':'whole')});
  if(S.craftSt>=3)A.push({k:'factory',l:'우리 회사·공장',v:costOf('factory')});
  {const groups={};(S.lands||[]).forEach((p,i)=>{const g=p.bld?'bld':p.kind;(groups[g]=groups[g]||[]).push(i)});
   for(const g in groups){const idx=groups[g];const v=idx.reduce((a,i)=>a+parcelVal(S.lands[i])+(S.lands[i].bld?bldVal():0),0);
     A.push({k:'land_'+g,l:(g==='bld'?'상가 건물 딸린 땅':LAND_KINDS[g].name)+' '+idx.length+'필지',v,land:true,idx})}}
  if(S.money>0)A.push({k:'cash',l:'현금',v:S.money,cash:true});
  A.push({k:'jesa',l:'제사',v:0,jesa:true});
  S.inh={assets:A,asg:{},done:false,res:[]};S.phase='inherit';
}
function inhToggle(k,pid){const I=S.inh;if(I.done)return;const a=I.assets.find(x=>x.k===k);if(!a)return;
  let L=I.asg[k]||[];if(a.jesa){I.asg[k]=L[0]===pid?[]:[pid];return}
  if(pid==='all'){I.asg[k]=inheritKids().map(c=>c.id);return}
  I.asg[k]=L.includes(pid)?L.filter(x=>x!==pid):L.concat([pid])}
/* 옛 저장 판 맞추기: 필지 목록이 없으면 만들고, 유산 목록의 땅을 종류별 묶음으로 바꾼다 */
function migrate(){
  if(!S)return;
  if(!S.biz)S.biz=S.year<1972?'stall':'store';
  S.bought=S.bought||{};S.mods=S.mods||[];S.rents=S.rents||[];S.flags=S.flags||{};S.nbs=S.nbs||[];S.shown=S.shown||{};S.resolved=S.resolved||{};S.goalsDone=S.goalsDone||[];if(S.repu==null)S.repu=50;
  for(const p of S.people){p.f=p.f||{};p.recs=p.recs||[];p.hist=p.hist||{};p.grow=p.grow||{}}
  try{landSync()}catch(e){}
  if(S.era){const have=new Set(S.era.map(x=>x.id));for(const x of buildEraSchedule())if(!have.has(x.id)&&x.y>S.year)S.era.push(x)}
  if(!S.lands&&S.land>0){S.lands=[];const n=S.land;for(let i=0;i<n;i++)S.lands.push({kind:'lot',m:1,lease:false,bld:false,since:S.year})}
  S.lands=S.lands||[];landSync();
  if(!S.jb)jbInit();
  const I=S.inh;if(I&&!I.done&&I.assets.some(a=>a.land&&!a.idx)){
    const oldAsg=I.asg;const nonLand=I.assets.filter(a=>!a.land);const groups={};
    S.lands.forEach((p,i)=>{const g=p.bld?'bld':p.kind;(groups[g]=groups[g]||[]).push(i)});
    const landA=Object.entries(groups).map(([g,idx])=>({k:'land_'+g,l:(g==='bld'?'상가 건물 딸린 땅':LAND_KINDS[g].name)+' '+idx.length+'필지',v:idx.reduce((a,i)=>a+parcelVal(S.lands[i])+(S.lands[i].bld?bldVal():0),0),land:true,idx}));
    const firstLandAsg=Object.keys(oldAsg).filter(k=>/^land\d+$/.test(k)).map(k=>oldAsg[k]).find(v=>v&&v.length)||[];
    I.assets=landA.concat(nonLand);const na={};for(const a of nonLand)na[a.k]=oldAsg[a.k]||[];for(const a of landA)na[a.k]=firstLandAsg.slice();I.asg=na;
  }
}
/* 시대마다 자식들이 기대하는 몫이 다르다.
   옛날엔 집에 남아 부모를 모시고 제사를 맡는 자식이 대부분을 받고, 시집간 딸은 거의 기대하지 않았다.
   집 장만을 도와준 자식은 이미 몫을 받은 셈이다. */
function inhWeight(c){const y=S.year;let w=1;
  const home=c.status==='home';const out=c.away&&['출가','분가'].includes(c.away.why);
  if(home)w=y<1990?2.2:y<2010?1.5:1.15;
  if(c.away&&c.away.why==='출가')w=y<1980?.25:y<1995?.45:y<2010?.75:1;
  else if(out&&c.sex==='f'&&y<1990)w=.5;
  if(c.f&&c.f.housed)w*=.55;
  return w}
function inhExpect(kids,tot){const ws=kids.map(inhWeight);const sw=ws.reduce((a,b)=>a+b,0)||1;const e={};kids.forEach((c,i)=>e[c.id]=tot*ws[i]/sw);return e}
function inhScore(c,val,fair,mx,jesaId){if(typeof fair==='object')fair=fair[c.id];let pen=val[c.id]<fair*.25?3:val[c.id]<fair*.6?1:0;if(c.away&&c.away.why==='출가'&&S.year<1995)pen=Math.min(pen,1);let sc=c.grudge-Math.floor(c.aff/3)+pen+(mx>0&&val[c.id]<mx*.4&&fair>mx*.3?1:0);if(jesaId===c.id&&val[c.id]<fair)sc+=1;
  /* 몫을 많이 받은 자식은 집을 떠나지 않는다 */
  if(val[c.id]>=fair*1.4)sc=Math.min(sc-2,4);
  /* 이미 따로 사는 자식은 '갈라섬'이 아니라 서운함으로 그친다(원한만 쌓인다) — 정말 크게 틀어질 때만 의절 */
  if(c.status!=='home'&&sc>4&&sc<=7)sc=4;return sc}
/* 이대로 나누면 어떻게 될지 미리 본다: 갈라서는 자녀는 제가 받은 현금·땅을 들고 나간다 */
function inhPredict(){const I=S.inh;const kids=inheritKids();const val={};for(const c of kids)val[c.id]=0;
  for(const a of I.assets){if(a.jesa)continue;const L=I.asg[a.k]||[];for(const id of L)val[id]+=a.v/L.length}
  const tot=Object.values(val).reduce((x,y)=>x+y,0)||1;const fair=inhExpect(kids,tot);const mx=Math.max(0,...Object.values(val));const jesaId=(I.asg.jesa||[])[0];
  let out=0;const by={};for(const c of kids){const sc=inhScore(c,val,fair,mx,jesaId);const t=sc<=0?'화목':sc<=4?'서운함':sc<=7?'갈라섬':'의절';
    let take=0;if(t==='갈라섬'||t==='의절')for(const a of I.assets){const L=I.asg[a.k]||[];if(L.includes(c.id)&&(a.cash||a.land))take+=a.v/L.length}
    out+=take;by[c.id]={t,take}}
  const all=I.assets.filter(a=>!a.jesa).reduce((x,a)=>x+a.v,0);return {by,out,stay:all-out,all}}
function inhConfirm(){
  migrate();
  const I=S.inh;const kids=inheritKids();if(I.assets.some(a=>!(I.asg[a.k]||[]).length))return;
  const val={};for(const c of kids)val[c.id]=0;
  for(const a of I.assets){if(a.jesa)continue;const L=I.asg[a.k];for(const id of L)val[id]+=a.v/L.length}
  const tot=Object.values(val).reduce((x,y)=>x+y,0)||1;const fair=inhExpect(kids,tot);const mx=Math.max(...Object.values(val));
  const jesaId=(I.asg.jesa||[])[0];
  for(const c of kids){
    const share=val[c.id]/tot;
    const sc=inhScore(c,val,fair,mx,jesaId);
    let tier,txt;
    if(sc<=0){tier='화목';c.aff=clamp(c.aff+2,-10,10);txt='고맙게 받아들였다'}
    else if(sc<=4){tier='서운함';txt='말은 없지만 서운한 눈치다';c.grudge=clamp(c.grudge+1,0,10);c.recs.push({y:S.year,t:'유산 분배에 서운함을 품었다',w:1})}
    else if(sc<=7){tier='갈라섬';txt='제 몫을 챙겨 따로 나갔다';c.recs.push({y:S.year,t:'유산 문제로 형제들과 갈라섰다',w:3})}
    else{tier='의절';txt='다시는 이 집 문턱을 넘지 않겠다고 했다';c.recs.push({y:S.year,t:'유산 다툼 끝에 집안과 연을 끊었다',w:5})}
    if(tier==='갈라섬'||tier==='의절'){
      if(c.status==='home'){c.status='away';c.away={why:tier,until:null};const sp=c.spouse?P(c.spouse):null;if(sp&&sp.alive&&sp.status==='home'){sp.status='away';sp.away={why:tier,until:null}}}
      // 나간 자식은 받은 현금과 땅을 들고 나간다
      for(const a of I.assets){const L=I.asg[a.k];if(!L.includes(c.id))continue;if(a.cash)S.money-=a.v/L.length;if(a.land){const take=L.length===1?a.idx.length:Math.floor(a.idx.length/L.length)+(R()<(a.idx.length%L.length)/L.length?1:0);a.goneIdx=(a.goneIdx||[]).concat(a.idx.filter(i=>!(a.goneIdx||[]).includes(i)).slice(0,take))}}
    }
    I.res.push({id:c.id,tier,txt,share:Math.round(share*100)});
  }
  {const gone=new Set();for(const a of I.assets)if(a.land&&a.goneIdx)a.goneIdx.forEach(i=>gone.add(i));S.lands=(S.lands||[]).filter((p,i)=>!gone.has(i));landSync()}
  if(jesaId){const j=P(jesaId);if(j)j.recs.push({y:S.year,t:'부모의 제사를 맡았다',w:2})}
  I.done=true;familySync();
}
function inhNext(){
  const r=rep();if(r&&r.alive&&r.status==='home'&&r.gen>S.curGen)return finishGen();
  if(repCands().filter(p=>p.gen>S.curGen).length){S.phase='chooseRep';return}
  for(const p of S.people)if(p.alive&&p.gen===S.curGen+1&&!p.inlaw&&p.away&&p.away.why==='분가'){p.status='home';p.away=null;const sp=P(p.spouse);if(sp&&sp.alive){sp.status='home';sp.away=null}}
  if(repCands().filter(p=>p.gen>S.curGen).length){S.phase='chooseRep';return}
  if(r&&r.alive&&r.status==='home')return finishGen();
  const b=recallHome();if(b){S.repId=b.id;S.banner=b.name+josa(b.name,'이/가')+' 집으로 돌아와 대표를 맡았다.';return finishGen()}
  /* 어린 자식만 남았다: 맏이가 이름만 대표를 잇고, 먼 친척 어른이 들어와 돌봐 준다 */
  const young=homeAlive().filter(p=>!p.inlaw&&p.gen>S.curGen).sort((a,b)=>a.birth-b.birth)[0];
  if(young){S.repId=young.id;const g=mkPerson({sex:'f',birth:S.year-ri(45,58),gen:S.curGen,adult:true,inlaw:true,aff:2,sur:pick(SURN.filter(x=>x!==S.sur))});g.f.guardian=true;g.slot='home';
    young.recs.push({y:S.year,t:'어린 나이에 집안을 물려받았다',w:3});S.banner='부모를 여읜 '+young.name+'('+age(young)+'세)'+josa(young.name,'이/가')+' 집을 잇는다. 먼 친척 '+g.name+josa(g.name,'이/가')+' 들어와 아이들을 돌본다.';return finishGen()}
  endGame('scatter');
}
function chooseRep(id){
  const q=P(id);if(!q)return;const ek=eldestOfGen(q.gen);let note='';
  if(q.gen>=2&&!q.inlaw&&ek&&ek.id!==q.id&&ek.alive&&S.year<2000){S.face=clamp(S.face-3,0,100);ek.grudge=clamp(ek.grudge+2,0,10);note=' 친척들이 "맏이를 두고?" 하며 수군거렸다.'}
  S.repId=q.id;
  if(S.genPass){return finishGen()}
  const old=S.repPick?P(S.repPick.from):null;S.repPick=null;
  S.banner=(old?old.name+josa(old.name,'이/가')+' 세상을 떠났다. 조문객: '+mourners()+'. ':'')+'이제 '+q.name+josa(q.name,'이/가')+' 집안을 맡는다.'+note;
  goSeollal();
}
function lineFor(p){
  const R2=p.recs.slice().sort((a,b)=>b.w-a.w||a.y-b.y).slice(0,2).sort((a,b)=>a.y-b.y);
  let s=R2.map(r=>r.t).join('. ');
  if(!s){const h=p.hist;let best='rest',bv=0;for(const k in h)if(h[k]>bv){bv=h[k];best=k}
    s={trade:'평생 장사를 했다',craft:'기름 묻은 손으로 평생 일했다',study:p.edu>=3?'대학을 나와 직장에 다녔다':'책을 손에서 놓지 않았다',care:'아픈 사람들을 돌보며 살았다',home:'집안 살림을 도맡았다',help:'동네일이라면 빠지지 않았다',rest:'조용히 살았다'}[best];
    if(age(p)<10&&p.alive)s='아직 어리다'}
  if(p.status==='away'&&p.alive&&p.away){const sf={분가:'따로 살림을 났다',상경:'도심에서 산다',이민:'바다 건너에 산다',유학:'유학 중이다'}[p.away.why];
    if(sf&&!/떠났|집을 나|갈라섰|연을 끊|눌러앉/.test(s))s+=(s?'. ':'')+sf}
  return s+'.';
}
function photoSnap(gen){
  return {gen,year:S.year,people:S.people.filter(p=>p.alive||(p.death&&p.death>=S.year-8)).filter(p=>p.gen>=gen-1&&p.gen<=gen+2).sort((a,b)=>a.gen-b.gen||a.birth-b.birth).slice(0,14)
    .map(p=>({id:p.id,name:p.name,ghost:!p.alive||p.status!=='home',note:!p.alive?'故':p.status!=='home'?(p.away?p.away.why:''):''}))};
}
function finishGen(){
  const gen=S.curGen;
  const ppl=S.people.filter(p=>p.gen===gen);
  S.photos.push(photoSnap(gen+1));
  S.pages.push({gen,year:S.year,lines:ppl.map(p=>({id:p.id,name:p.name,sur:p.inlaw?p.sur:null,birth:p.birth,death:p.death,inlaw:p.inlaw,line:lineFor(p)})),goals:S.goalsDone.slice()});
  S.curGen++;S.genPass=null;S.goal=null;
  S.notices.unshift({kind:'genpage',gen,year:S.year});
  S.phase='genpage';
}
/* 가문의 길: 돈 말고도 집안을 일으키는 여섯 갈래. 각 길은 별 0~5개로 매겨지고 엔딩 칭호가 된다 */
const ROUTES={
 wealth:{name:'부(富)의 길',desc:'재산을 일군다',titles:['','살 만한 집','넉넉한 집','부잣집','큰 부자','재벌 소리 듣는 집']},
 learn:{name:'학문의 길',desc:'자손을 가르치고 공직·학자를 낸다',titles:['','글 아는 집','배운 집안','선비 집안','학자 집안','명문 학자가']},
 jeong:{name:'정(情)의 길',desc:'이웃과 동네를 챙긴다',titles:['','인사 받는 집','정 있는 집','동네 기둥','덕망 있는 집','동네가 기억하는 집']},
 craft:{name:'장인의 길',desc:'기술과 손맛을 대를 이어 잇는다',titles:['','손재주 있는 집','기술자 집','장인 집안','명장 집안','이름난 공방']},
 root:{name:'뿌리의 길',desc:'고향과 족보, 한집에 모여 사는 식구',titles:['','뿌리를 찾는 집','족보 있는 집','뿌리 깊은 집','큰집','종가']},
 free:{name:'자유의 길',desc:'자식들이 바라는 대로 살게 한다',titles:['','숨통 트인 집','저마다의 집','꿈을 좇은 집','자유로운 집안','각자의 별을 단 집']}
};
function routeRaw(){
  const b=S.people.filter(p=>!p.inlaw);const T=S.routeAcc||{};
  return {
    wealth:netWorth()*UNIT78*cpi(2026)/cpi(1978)/1e8,
    learn:b.filter(p=>p.edu>=3).length*2+b.filter(p=>p.f.official).length*3+b.filter(p=>p.tal.글>=8).length+(T.learn||0),
    jeong:S.nbs.reduce((a,n)=>a+Math.max(0,n.j)/2,0)+(T.jeong||0)+S.timeDebt*.5,
    craft:(S.craftSt-1)*3+b.filter(p=>p.tal.손재주>=8).length*2+b.filter(p=>(p.hist.craft||0)>=15).length*2+(T.craft||0),
    root:(S.jb?S.jb.pages*1.5+(S.jb.kind==='true'?6:S.jb.kind==='ours'?5:S.jb.kind==='bought'?1:0)+(S.jb.women?2:0)+(S.jb.adopted?2:0)+(S.jb.preface?3:0):0)+S.frag+(S.flags.reunion?5:0)+(S.flags.homecoming?5:0)+(S.flags.ourJokbo?4:0)+(S.flags.bongwan?2:0)+(S.place.kind==='origin'?3:0)+b.filter(p=>p.alive&&p.status==='home').length+(T.root||0),
    free:b.filter(p=>p.f.freed).length*2+b.filter(p=>p.aff>=6&&p.grudge<=1).length+(T.free||0)-b.filter(p=>p.away&&p.away.why==='의절').length*3};
}
const ROUTE_TH={wealth:[.6,1.6,4,10,25],learn:[6,14,24,36,50],jeong:[40,70,100,135,180],craft:[10,20,30,42,58],root:[16,28,40,52,66],free:[6,14,24,34,46]};
function routeScores(){const raw=routeRaw();const sc={};for(const k in raw){const th=ROUTE_TH[k];let n=0;for(const t of th)if(raw[k]>=t)n++;sc[k]=n}return sc}
function routeAdd(k,v){S.routeAcc=S.routeAcc||{};S.routeAcc[k]=(S.routeAcc[k]||0)+v}
function titlesOf(){
  const T=[];const peo=S.people;
  if(S.flags.reunion)T.push('잃었던 족보를 찾은 집');
  if(S.flags.exposed)T.push('들통난 집');
  if(S.jb&&S.jb.kind==='ours'&&S.jb.bon===placeName())T.push(placeName()+' '+S.sur+'씨의 시조');
  if(S.flags.ourJokbo)T.push('족보는 우리부터');
  if(S.flags.bongwan)T.push('본관 있는 집');
  if(peo.filter(p=>p.f.official).length>=2)T.push('공직자 집안');else if(peo.some(p=>p.f.official))T.push('사(士)자 집안의 시작');
  if(S.tradeSt>=3&&S.repu>=60)T.push('시장통 부자');
  if(S.craftSt>=3&&S.people.filter(p=>!p.inlaw&&(p.hist.craft||0)>=10).length>=2)T.push('기술자 집안');
  if((S.lands||[]).some(p=>p.bld))T.push('건물주');else if(S.land>=3)T.push('땅 부자');
  if(S.nbs.filter(n=>n.j>=14).length>=2)T.push('정 많은 집');
  const ghosts=peo.filter(p=>!p.inlaw&&p.alive&&p.status==='away'&&p.away&&['의절','갈라섬','상경','음악','해외 정착','이민'].includes(p.away.why)).length;
  if(ghosts>=2)T.push('사진 속 빈자리가 많은 집');
  if(S.moves.length>=2)T.push('떠돌며 일군 집');
  if(S.place.kind==='origin'&&S.year>=2050)T.push('동네에 남은 마지막 집');
  if(S.goalsDone.length>=4)T.push('뜻을 이룬 집');
  if(S.house!=='shack')T.push('내 집 가진 집');
  if(!T.length)T.push('이름 없이 버틴 집');
  return T;
}
function startFinale(){S.finaleV=finaleVariant();S.notices=[{kind:'finale',year:S.year}];S.phase='notice'}
function endGame(reason){
  const gen=S.curGen;const ppl=S.people.filter(p=>p.gen===gen);
  S.photos.push(photoSnap(gen));
  S.pages.push({gen,year:S.year,lines:ppl.map(p=>({id:p.id,name:p.name,sur:p.inlaw?p.sur:null,birth:p.birth,death:p.death,inlaw:p.inlaw,line:lineFor(p)})),goals:S.goalsDone.slice(),last:true});
  if(gen+1<=5){const nx=S.people.filter(p=>p.gen===gen+1);if(nx.length)S.pages.push({gen:gen+1,year:S.year,lines:nx.map(p=>({id:p.id,name:p.name,sur:p.inlaw?p.sur:null,birth:p.birth,death:p.death,inlaw:p.inlaw,line:lineFor(p)})),goals:[],last:true})}
  const rs=routeScores();const best=Object.entries(rs).sort((a,b)=>b[1]-a[1]);
  const rt=best.filter(([k,v])=>v>=3).map(([k,v])=>ROUTES[k].titles[v]);
  S.ending={reason,titles:rt.concat(titlesOf()),year:S.year,nw:netWorth(),routes:rs};S.phase='ending';
}
function metaLoad(){try{const s=IS_DOM&&localStorage.getItem('jokbo-meta');if(s)return JSON.parse(s)}catch(e){}return {clears:0,huns:[],titles:[]}}
function metaSave(m){try{if(IS_DOM)localStorage.setItem('jokbo-meta',JSON.stringify(m))}catch(e){}}
let META={clears:0,huns:[],titles:[]};
