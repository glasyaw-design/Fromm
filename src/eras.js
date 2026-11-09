/* =====================================================================
   현대사: 시대별 장(章)과 시대 이벤트
   - 사실은 담담하게, 평가는 넣지 않는다. 한 집안이 그 해를 어떻게 겪었는지로 그린다.
   - 시대 이벤트는 그해 초 '새해 소식'으로 뜨고, 변형 셋 중 하나가 반드시 일어난다.
   - 2021년 이후는 게임이 그리는 가상의 미래다.
   ===================================================================== */
const CHAPTERS=[
 {y:1950,no:'서장',title:'피란길',sub:'1950~1952',text:'전쟁이 났다. 사람들은 보따리 하나에 살림을 담아 남쪽으로 내려갔다.'},
 {y:1953,no:'제1장',title:'폐허 위의 판자촌',sub:'1953~1959',text:'휴전. 도시 변두리마다 판잣집이 들어섰다. 미군 물자와 구호 밀가루, 보릿고개가 일상이던 시절이다. 가진 것은 몸뚱이와 식구뿐이다.'},
 {y:1960,no:'제2장',title:'격동과 공장의 불빛',sub:'1960년대',text:'4월의 거리, 5월의 새벽 방송, 그리고 경제개발계획. 들판 옆에 공장이 서고, 시골 젊은이들이 기차를 타고 도시로 올라왔다.'},
 {y:1970,no:'제3장',title:'잘살아 보세',sub:'1970년대',text:'고속도로가 뚫리고 새마을 노래가 아침마다 울렸다. 공장은 밤새 돌았고, 아버지들은 중동 사막으로 떠났다. 텔레비전 앞에 온 골목이 모였다.'},
 {y:1980,no:'제4장',title:'광장과 아파트',sub:'1980년대',text:'남쪽 도시의 오월은 오래 말해지지 못했다. 컬러텔레비전과 프로야구, 강 건너 아파트와 입시 열풍. 그리고 1987년 여름, 거리가 다시 사람으로 가득 찼다.'},
 {y:1990,no:'제5장',title:'세계화와 무너진 것들',sub:'1990년대',text:'해외여행과 삐삐, 대형마트가 왔다. 다리가 끊어지고 백화점이 무너졌다. 그리고 1997년 겨울, 나라 곳간이 비었다는 소식이 들려왔다.'},
 {y:2000,no:'제6장',title:'붉은 거리, 빠른 인터넷',sub:'2000년대',text:'초고속 인터넷과 휴대폰, 온 나라가 붉게 물든 여름. 아파트값은 뛰고 비정규직이라는 말이 생겼다. 시장 골목은 하나둘 프랜차이즈 간판으로 바뀌었다.'},
 {y:2010,no:'제7장',title:'각자도생의 시대',sub:'2010년대',text:'스마트폰이 손에 쥐어졌다. 청년들은 공무원 시험에, 부모들은 노후 걱정에 매달렸다. 바다에서 배가 가라앉은 봄을 온 나라가 오래 앓았다.'},
 {y:2020,no:'제8장',title:'멈춘 거리, 다시 쓰는 동네',sub:'2020년대',text:'마스크를 쓴 채 몇 해를 보냈다. 거리는 텅 비었다가 천천히 돌아왔다. 낡은 동네엔 재건축 펜스가 둘러쳐졌다. (2021년부터는 이 게임이 그리는 가상의 미래다)'},
 {y:2030,no:'제9장',title:'늙어 가는 나라',sub:'2030년대 · 가상',text:'아이 울음소리가 귀해지고 학교가 문을 닫는다. 기계가 주문을 받고 물건을 나른다. 사람만이 할 수 있는 일이 무엇인지, 다들 묻기 시작했다.'},
 {y:2040,no:'제10장',title:'서로 기대는 동네',sub:'2040년대 · 가상',text:'여름은 길고 비는 거칠어졌다. 혼자서는 버티기 어려운 날이 늘자, 사람들은 다시 이웃의 문을 두드렸다.'},
 {y:2050,no:'제11장',title:'100년 된 동네',sub:'2050년대 · 가상',text:'빈집이 늘고 골목은 조용해졌다. 피란민 판자촌이던 이곳에 사람이 산 지 어느덧 100년. 누군가는 이 동네의 이야기를 남겨야 한다.'},
 {y:2060,no:'제12장',title:'기억하는 사람들',sub:'2060년대 · 가상',text:'처음 이 동네에 온 사람들은 이제 아무도 없다. 남은 것은 족보 몇 장과 사진 몇 장, 그리고 그 이야기를 들은 아이들이다.'},
 {y:2070,no:'제13장',title:'길어진 삶',sub:'2070년대 · 가상',text:'아흔을 넘긴 어른이 흔해졌다. 일을 놓는 나이도, 자식이 집을 떠나는 나이도 제각각이다. 바닷물은 조금씩 해안을 밀고 올라왔다.'},
 {y:2080,no:'제14장',title:'마지막 증인들',sub:'2080년대 · 가상',text:'전쟁을 아이 눈으로 본 사람들이 하나둘 떠난다. 이제 그 시절은 사람의 입이 아니라 기록으로만 전해진다.'},
 {y:2090,no:'제15장',title:'새 세기의 문턱',sub:'2090년대 · 가상',text:'학교는 줄고 동네는 작아졌다. 그래도 명절이면 누군가는 옛집 대문을 연다. 22세기가 코앞이다.'},
 {y:2100,no:'제16장',title:'다음 백 년',sub:'2100년~ · 가상',text:'보따리 하나로 시작한 집이 한 세기 반을 건넜다. 이 집의 셋째 세대가 마지막 장을 쓰고 있다.'}
];
function chapterFor(y){let c=null;for(const x of CHAPTERS)if(y>=x.y)c=x;if(!c)return null;if(S.chapterShown&&S.chapterShown.includes(c.y))return null;(S.chapterShown=S.chapterShown||[]).push(c.y);return c}

/* 프롤로그 */
let PRO=[];
const PRO_BASE=[
 {y:'1950년 여름',title:'피란 보따리',text:'포성이 가까워진다. 보따리 하나에 무엇을 넣을지 정해야 한다.',ch:[
   {t:'아버지 사진과 집안 문서 몇 장',fx:{frag:2,recRep:'피란 보따리에 아버지 사진을 넣었다',recW:3}},{t:'무쇠솥과 쌀',fx:{money:6}}]},
 {y:'1950년 겨울',title:'피란길',variant:true,v:{
   A:{text:'흥남 부두에 배가 들어왔다. 사람이 너무 많다. 옆에 {nb}도 서 있다.',ch:[
     {t:'짐을 버리고 탄다',fx:{money:-3}},{t:'{nb} 아이를 안고 같이 탄다',fx:{nbj:3,ledger:'피란 배에서 아이를 안아 줌',recRep:'피란 배에서 남의 아이를 안고 탔다',recW:3}}]},
   B:{text:'걸어서 남쪽으로 내려간다. 눈이 무릎까지 쌓였다.',ch:[
     {t:'지름길 산길로 간다',fx:{talent:{몸:-1},money:2}},{t:'{nb}{nb:과/와} 함께 큰길로 간다',fx:{nbj:2,ledger:'피란길을 함께 걸음'}}]},
   C:{text:'피란 행렬 속에서 동생 손을 놓쳤다.',ch:[
     {t:'하루를 더 기다린다',fx:{frag:1,flag:'lostSibling',recRep:'피란길에서 동생 손을 놓쳤다',recW:4}},
     {t:'살려면 떠나야 한다',fx:{flag:'lostSibling',recRep:'동생을 찾지 못하고 남쪽으로 내려왔다',recW:4}}]}}},
 {y:'1951년',title:'천막 피란촌',text:'남쪽 항구의 천막촌. 품을 팔아야 먹고산다.',ch:[
   {t:'부두에서 품을 판다',fx:{money:5,talent:{몸:1}}},{t:'천막 이웃과 끼니를 나눈다',fx:{nbj:2,ledger:'천막촌에서 끼니를 나눔'}}]},
 {y:'1953년',title:'정착',text:'휴전. {place}에 판잣집 한 칸을 얻었다. 어디에 자리를 잡을까?',ch:[
   {t:'장터 가까운 곳',fx:{loc:'market'},hint:'장사 벌이 +10%'},{t:'공장 가까운 곳',fx:{loc:'factory'},hint:'기술 벌이 +10%'},{t:'학교 가까운 곳',fx:{loc:'school'},hint:'직장 벌이 +10%'}]}
];
function buildPro(){
  const L=PRO_BASE.map(x=>x);
  if(S.lineage==='native'){
    L[0]={y:'1950년 여름',title:'전쟁이 지나간 마을',text:'인민군이 마을을 지나갔고, 몇 달 뒤 국군이 돌아왔다. 대대로 부쳐 먹던 논은 그대로지만 사람이 많이 줄었다.',ch:[
      {t:'논을 지키며 버틴다',fx:{money:3,recRep:'전쟁 통에도 논을 떠나지 않았다',recW:3}},{t:'피란 온 사람들에게 헛간을 내준다',fx:{jAll:1,recRep:'전쟁 때 피란민에게 헛간을 내주었다',recW:3}}]};
    L[1]={y:'1951년 겨울',title:'피란민이 몰려온다',text:'북쪽에서 내려온 사람들이 마을 어귀에 천막을 쳤다. 그중 {nb}도 있다.',ch:[
      {t:'쌀을 나눠 준다',fx:{money:-2,nbj:3,ledger:'피란 왔을 때 쌀을 나눠 받음'}},{t:'우리 먹을 것도 모자란다',fx:{nbj:-2}}]};
    L[2]={y:'1952년',title:'땅문서',text:'전쟁 통에 땅문서가 불탔다는 소문이 돈다. 면사무소에 가서 확인해야 한다.',ch:[
      {t:'먼 길을 걸어 확인한다',fx:{talent:{글:1}}},{t:'이웃 말만 믿는다',fx:{rnd:[{p:.3,fx:{land:-1},msg:'논 한 자락이 남의 이름으로 넘어가 있었다'}]}}]};
  }
  if(S.lineage==='orphan'){
    L[0]={y:'1950년 여름',title:'잃어버린 가족',text:'열다섯 살 소년과 소녀가 폭격에 가족을 잃었다. 둘은 피란 행렬 속에서 서로를 의지했다.',ch:[
      {t:'서로 손을 놓지 않는다',fx:{affAll:2,recRep:'전쟁에 가족을 잃고 피란길에서 아내를 만났다',recW:4}},{t:'군인 트럭을 얻어 탄다',fx:{money:2}}]};
    L[2]={y:'1951년',title:'고아원',text:'둘은 남쪽 도시의 고아원에서 몇 해를 보냈다. 원장은 엄했지만 글을 가르쳐 줬다.',ch:[
      {t:'글을 배운다',fx:{talent:{글:2}}},{t:'일찍 나가 일을 배운다',fx:{talent:{손재주:2},money:2}}]};
  }
  if(S.lineage==='fallen'){
    L[0]={y:'1950년 여름',title:'불타는 사랑채',text:'대대로 내려온 사랑채가 불탔다. 족보 궤짝을 들고 나올 것인가, 쌀을 들고 나올 것인가.',ch:[
      {t:'족보 궤짝을 든다',fx:{frag:2,face:4,flag:'bongwan',recRep:'불타는 사랑채에서 족보 궤짝을 들고 나왔다',recW:4}},{t:'쌀가마를 든다',fx:{money:6,recRep:'족보 대신 쌀가마를 들고 나왔다',recW:3}}]};
  }
  if(S.town!=='seoul'){L[3]=Object.assign({},L[3],{text:'휴전. '+TOWNS[S.town].full+'에 판잣집 한 칸을 얻었다. 어디에 자리를 잡을까?'})}
  return L;
}

/* 시대 이벤트 일정 */
function buildEraSchedule(){
  const L=[['borit',ri(1955,1957)],['april19',1960],['may16',1961],['money62',1962],['abroad',ri(1964,1966)],['saemaul',1971],['highway',1970],['yushin',1972],['oil',1973],
    ['mideast',ri(1975,1977)],['gangnam',ri(1976,1979)],['oct26',1979],['may18',1980],['curfew',1982],['reunion',1983],['june87',1987],['olympic',1988],['travel',1989],
    ['realname',1993],['collapse',1995],['imf',1997],['gold',1998],['worldcup',2002],['crisis08',2008],['sewol',2014],['candle',2016],['covid',2020],
    ['postcovid',2023],['rebuild',ri(2025,2030)],['school',ri(2031,2034)],['ai',ri(2035,2039)],['climate',ri(2041,2045)],['hometown',ri(2046,2050)],
    ['population',ri(2050,2052)],['centennial',2053],['rebuild2',ri(2060,2066)],
    ['longlife',ri(2068,2070)],['seawall',ri(2071,2074)],['northrail',ri(2075,2078)],['carebot',ri(2079,2082)],['witness',ri(2083,2086)],
    ['lastschool',ri(2087,2090)],['heat',ri(2091,2094)],['archive',ri(2095,2098)],['century',2100],['lastalley',ri(2103,2107)]];
  const seen={};return L.map(([id,y])=>{while(seen[y])y++;seen[y]=1;return {id,y,done:false}});
}
const BK=p=>!p.inlaw;
const ERA_DEF={
 borit:{title:'보릿고개',kicker:'흉년',v:{
   A:{w:()=>S.money<15?2:1,text:'흉년이다. 쌀값이 두 배로 뛰었다. 골목마다 빈 자루를 든 사람들이 오간다. 올여름 누군가 쌀을 꾸러 올 것 같다.',fx:{money:-6,affAll:-1,chain:{id:'boritAsk',in:0}}},
   B:{w:()=>avgJ()>=2?2:1,text:'흉년이지만 골목 사람들이 쌀을 조금씩 모아, 굶는 집 없이 넘겼다.',fx:{money:-3,jAll:1}},
   C:{w:()=>1,text:'구호물자 배급 줄이 동네 끝까지 섰다. 우리 집도 밀가루 한 포대를 받았다.',fx:{money:4,face:-1}}}},
 april19:{title:'4월의 거리',kicker:'1960년 4월',headline:'부정선거 규탄 시위 전국 확산, 대통령 하야',who:'any',wc:p=>BK(p)&&age(p)>=15&&age(p)<=30&&p.id!==S.repId,v:{
   A:{w:c=>c.subj?1.5:0,text:'3월 선거가 부정이었다며 학생들이 거리로 나섰다. {subj}{subj:도} 친구들과 함께 나갔다가 밤늦게야 돌아왔다. 4월 말, 대통령이 물러났다.',fx:{grudge:-1,pers:{모험:1},rec:'1960년 4월, 친구들과 거리에 나섰다',recW:3}},
   B:{w:()=>S.tradeY>0?1.5:.6,text:'시위대와 경찰이 맞서는 날이 이어지며 시장이 며칠씩 문을 닫았다. 4월 말, 대통령이 물러났다는 방송이 나왔다.',fx:{money:-3}},
   C:{w:()=>1,text:'골목 사람들이 라디오 앞에 모여 숨죽여 소식을 들었다. 4월 말, 대통령이 물러났다. 어른들은 이제 좀 나아지려나 하고 중얼거렸다.',fx:{jAll:1}}}},
 may16:{title:'새벽 방송',kicker:'1961년 5월',headline:'군 장교들 정변, 군사정부 수립',v:{
   A:{w:()=>1,text:'새벽 라디오에서 군인들이 정권을 잡았다는 방송이 흘러나왔다. 통행금지와 단속이 엄해져 밤장사가 줄었다.',fx:{mod:{k:'trade',m:.9,n:1}}},
   B:{w:()=>S.flags.blackMarket?2:.7,text:'정변 뒤 암시장과 밀수 단속이 시작됐다. 뒷거래로 들여오던 물건 줄이 끊겼다.',fx:{money:-4}},
   C:{w:()=>1,text:'세상이 뒤집혔다는데 판자촌 살림은 그대로다. 어른들은 "누가 잡든 먹고사는 건 우리 몫"이라며 일터로 나갔다.',fx:{gap:{d:1}}}}},
 money62:{title:'화폐개혁',kicker:'1962년 6월',headline:'10환을 1원으로, 예금 일부 동결',v:{
   A:{w:()=>1.5,raw:true,text:'하룻밤 사이에 돈 이름이 환에서 원으로 바뀌었다. 모아 둔 현금 일부가 묶였다.',fx:()=>({money:-Math.round(Math.max(0,S.money)*.2)})},
   B:{w:()=>(maxNb()&&maxNb().j>=10)?2.5:.4,nb:'maxj',raw:true,text:'{nb}{nb:이/가} 며칠 전 귀띔해 준 덕분에 현금을 미리 물건으로 바꿔 두었다.',fx:()=>({money:Math.round(Math.max(0,S.money)*.04),nbj:1})},
   C:{w:()=>S.money<20?2:.4,text:'돈 이름이 바뀌는 통에 빚 부담이 오히려 가벼워졌다.',fx:{money:8}}}},
 abroad:{title:'바다 건너 일자리',kicker:'1960년대 중반',headline:'서독 광부·간호사 파견, 베트남 파병과 기술자 진출',who:'adult',wc:p=>BK(p)&&age(p)>=20&&age(p)<=38&&p.id!==S.repId&&!(p.sex==='m'&&!p.f.army&&age(p)<28),v:{
   A:{w:c=>c.subj?(S.place.abroad||1)*1.6:0,text:'{subj}{subj:이/가} 서독 광산과 병원으로 가는 사람들 틈에 끼었다. 3년 동안 월급을 꼬박꼬박 부쳐 왔다.',fx:{awayYears:3,why:'서독 파견',money:40,affAll:-1,rec:'서독에서 3년을 일하며 돈을 부쳤다',recW:3}},
   B:{w:c=>c.subj?1.2:0,text:'{subj}{subj:이/가} 베트남 건설 현장에 기술자로 갔다가 한 해 만에 다쳐서 돌아왔다.',fx:{awayYears:1,why:'베트남 파견',money:12,talent:{몸:-2},rec:'베트남 건설 현장에서 다쳐 돌아왔다',recW:3}},
   C:{w:c=>c.subj?.7:1,text:'동네 청년 여럿이 서독과 베트남으로 떠났다. 그 집들이 부쳐 온 돈이 시장에 돌았다.',fx:{jAll:1,mod:{k:'trade',m:1.1,n:3}}}}},
 highway:{title:'고속도로',kicker:'1970년 7월',headline:'서울과 부산 잇는 고속도로 개통',v:{
   A:{w:()=>S.tradeY>0?1.5:.8,text:'서울과 부산을 잇는 고속도로가 뚫렸다. 지방 물건이 하루 만에 올라와 시장이 활기를 띤다.',fx:{mod:{k:'trade',m:1.1,n:3}}},
   B:{w:()=>1,text:'고향 가는 길이 반나절로 줄었다. 올 추석엔 온 식구가 고향 친척 집을 다녀왔다.',fx:{affAll:1,money:-2}},
   C:{w:()=>1,text:'길이 뚫리자 땅값이 오른다는 소문이 돈다. 복덕방이 바빠졌다.',fx:{flag:'landRumor'}}}},
 saemaul:{title:'새마을',kicker:'1970년대 초',headline:'새마을운동 전국으로',v:{
   A:{w:()=>1,text:'아침마다 새마을 노래가 울린다. 골목 사람들이 모여 길을 넓히고 하수구를 팠다.',fx:{jAll:1,face:1}},
   B:{w:()=>S.house!=='apt'?1.5:.2,text:'초가와 낡은 판잣집 지붕을 슬레이트로 바꾸라는 지시가 내려왔다.',fx:{money:-4}},
   C:{w:()=>S.craftY>0?1.5:.6,text:'공장들이 새벽부터 밤까지 돌았다. 일감은 넘치지만 몸이 고되다.',fx:{mod:{k:'craft',m:1.1,n:2},affAll:-1}}}},
 yushin:{title:'10월의 헌법',kicker:'1972년 10월',headline:'비상계엄 선포, 새 헌법 확정',v:{
   A:{w:()=>S.people.some(p=>p.alive&&p.f.college&&p.edu<3)?2:.3,text:'비상계엄과 함께 헌법이 바뀌었다. 대학에 다니는 식구가 있는 집은 학교가 문을 닫을까 봐 마음을 졸였다.',fx:{affAll:-1}},
   B:{w:()=>1,text:'헌법이 바뀌었다는 소식에 어른들은 "말조심하라"는 말만 되풀이했다.',fx:{gap:{s:1}}},
   C:{w:()=>1,text:'반상회가 더 자주 열리고, 통장이 집집마다 돌았다. 살림은 그대로다.',fx:{jAll:1}}}},
 oil:{title:'석유파동',kicker:'1973년 겨울',headline:'중동 산유국 감산, 기름값 폭등',v:{
   A:{w:()=>S.craftY>0?2:.3,text:'기름값이 뛰고 공장마다 감산에 들어갔다.',fx:{mod:{k:'craft',m:.65,n:2}}},
   B:{w:()=>S.tradeY>0?2:.3,text:'연탄과 등유를 찾는 손님이 줄을 섰다. 가게가 바쁘다.',fx:{money:12}},
   C:{w:()=>1,text:'물가가 하루가 다르게 오른다.',fx:{money:-8,affAll:-1}}}},
 mideast:{title:'중동 건설',kicker:'1970년대 중반',headline:'중동 건설 수주 붐, 해외 근로자 급증',who:'adult',wc:p=>BK(p)&&p.sex==='m'&&age(p)>=22&&age(p)<=45&&p.id!==S.repId&&!(p.sex==='m'&&!p.f.army&&age(p)<28),v:{
   A:{w:c=>c.subj?2*(S.place.abroad||1):0,text:'{subj}{subj:이/가} 중동 사막의 건설 현장으로 떠났다. 3년 동안 부쳐 온 돈으로 빚을 갚았다.',fx:{awayYears:3,why:'중동 건설',money:45,affAll:-1,rec:'중동 사막에서 3년을 일했다',recW:3}},
   B:{w:c=>c.subj?1:0,text:'중동으로 떠난 {subj}{subj:이/가} 모래바람에 몸이 상해 한 해 만에 돌아왔다.',fx:{awayYears:1,why:'중동 건설',money:12,talent:{몸:-2},rec:'중동 현장에서 몸이 상해 돌아왔다',recW:3}},
   C:{w:c=>c.subj?.6:1,text:'골목의 아버지들이 하나둘 중동으로 떠났다. 편지와 송금이 오는 날이면 집집마다 잔치였다.',fx:{jAll:1}}}},
 gangnam:{title:'강 건너 땅 소문',kicker:'1970년대 후반',headline:'강남 개발 본격화, 땅값 수십 배',v:{
   A:{w:()=>1.5,nb:'maxj',text:'{nb}{nb:이/가} 강 건너 허허벌판 땅값이 오른다는 소문을 전했다. 올여름 안에 정해야 한다.',fx:{chain:{id:'gangnamBuy',in:0}}},
   B:{w:()=>1,text:'강 건너 땅 소문이 한바탕 돌다가 잠잠해졌다. 덥석 땅을 산 옆 골목 사람은 속을 끓인다.',fx:{gap:{f:-1}}},
   C:{w:()=>1,text:'옆 동네가 개발되면서 우리 골목 집값도 덩달아 조금 올랐다.',fx:()=>S.house!=='shack'?{face:1,flag:'landRumor'}:{face:-1}}}},
 oct26:{title:'10월 26일',kicker:'1979년 10월',headline:'대통령 피격 서거, 비상계엄',v:{
   A:{w:()=>1,text:'아침 라디오가 대통령이 측근의 총에 숨졌다고 전했다. 시장은 문을 닫았고, 사람들은 말을 아꼈다.',fx:{money:-2}},
   B:{w:()=>S.people.some(p=>p.alive&&BK(p)&&age(p)>=18&&age(p)<=26)?1.5:.4,text:'계엄이 선포됐다. 대학생 식구가 있는 집에서는 "이제 세상이 바뀌려나" 하는 말과 "조심하라"는 말이 오갔다.',fx:{gap:{s:1}}},
   C:{w:()=>1,text:'겨울 내내 통행금지가 엄해졌다. 밤장사는 일찍 문을 닫아야 했다.',fx:{mod:{k:'trade',m:.92,n:1}}}}},
 may18:{title:'오월',kicker:'1980년 5월',headline:'(그해 신문은 제대로 전하지 못했다)',v:{
   A:{w:()=>1,text:'5월, 광주에서 계엄군의 진압으로 많은 시민이 목숨을 잃었다. 그때 신문과 방송은 거의 전하지 못했고, 버드내 사람들은 소문으로만 들었다. 진실은 오랜 세월에 걸쳐 밝혀졌다.',fx:{recRep:'그해 오월 남쪽 도시의 소식을 오래 입에 올리지 못했다',recW:2}},
   B:{w:()=>S.people.some(p=>p.alive&&p.status==='away'&&p.away&&p.away.why==='군대')?2:.5,text:'5월, 광주에서 계엄군의 진압으로 많은 시민이 희생됐다. 군대 간 아들의 편지가 한동안 끊겨 어머니는 밤마다 잠을 이루지 못했다. 진실은 오랜 세월 뒤에야 밝혀졌다.',fx:{affAll:-1}},
   C:{w:()=>.8,text:'5월, 광주에서 계엄군의 진압으로 많은 시민이 희생됐다. 남쪽에 사는 친척과 며칠째 연락이 닿지 않다가, 겨우 무사하다는 소식을 들었다.',fx:{affAll:1,frag:0}}}},
 curfew:{title:'통금 해제',kicker:'1982년 1월',headline:'36년 만에 야간 통행금지 해제',v:{
   A:{w:()=>S.tradeY>0?2:.6,text:'밤 12시 사이렌이 사라졌다. 늦게까지 문을 여는 가게가 늘었다.',fx:{mod:{k:'trade',m:1.12,n:4}}},
   B:{w:()=>1,text:'컬러텔레비전에 프로야구까지. 밤마다 식구들이 텔레비전 앞에 모였다.',fx:{affAll:1,money:-3}},
   C:{w:()=>1,text:'밤이 길어지자 젊은 식구들이 늦게 들어오는 날이 많아졌다.',fx:{gap:{s:-1}}}}},
 reunion:{title:'이산가족 찾기',kicker:'1983년 여름',headline:'생방송 이산가족 찾기, 1만여 가족 상봉',who:'gen1',v:{
   A:{w:c=>c.subj&&S.lineage!=='native'?Math.min(.85,.1+.15*S.frag)*3:0,text:'방송국 앞 벽이 사연 쪽지로 가득 찼다. {subj}{subj:이/가} 30여 년 만에 고향 가족을 만났다.',fx:{face:6,affAll:3,flag:'reunion',rec:'이산가족 찾기에서 고향 가족을 만났다',recW:5}},
   B:{w:c=>c.subj?1:0,text:'방송을 보고 친척이라는 사람이 찾아왔다. 돈을 빌려 가더니 연락이 끊겼다.',fx:{money:-10,rec:'친척이라던 사람에게 돈을 떼였다',recW:3}},
   C:{w:()=>1,text:'방송국 앞에 사람들이 줄을 섰다. 집집마다 텔레비전 앞에서 함께 울었다. 우리 집은 끝내 찾던 얼굴을 만나지 못했다.',fx:{affAll:-1,recRep:'이산가족 찾기 방송을 밤새 지켜봤다',recW:2}}}},
 june87:{title:'6월의 거리',kicker:'1987년 6월',headline:'대통령 직선제 개헌 수용',who:'any',wc:p=>BK(p)&&age(p)>=18&&age(p)<=35&&p.id!==S.repId,v:{
   A:{w:c=>c.subj?1.6:0,text:'최루탄 연기 속에 학생과 넥타이 맨 회사원들이 함께 거리를 메웠다. {subj}{subj:도} 그 속에 있었다. 6월 말, 대통령 직선제를 받아들인다는 발표가 나왔다.',fx:{pers:{사교:1},rec:'1987년 6월, 거리의 사람들 속에 있었다',recW:3}},
   B:{w:()=>S.tradeY>0?1.4:.5,text:'가게 앞까지 최루탄 연기가 밀려와 한동안 장사를 공쳤다. 6월 말, 대통령 직선제가 받아들여졌다.',fx:{money:-3}},
   C:{w:()=>1,text:'퇴근길 버스에서 사람들이 경적을 울리며 박수를 쳤다. 대통령을 직접 뽑게 됐다는 소식이었다.',fx:{jAll:1}}}},
 olympic:{title:'서울올림픽',kicker:'1988년 가을',headline:'서울올림픽 개막',v:{
   A:{w:()=>S.tradeSt>=2?2:.5,text:'올림픽 손님으로 시장이 붐빈다.',fx:{money:15}},
   B:{w:()=>S.house==='shack'?3:0,text:'올림픽을 앞두고 판잣집 정비 단속이 나왔다.',fx:{face:-4,money:-6}},
   C:{w:()=>S.house!=='shack'?2:.3,text:'집값과 땅값이 뛰었다. 텔레비전에선 하루 종일 경기가 나왔다.',fx:{face:1,affAll:1}}}},
 travel:{title:'해외여행 자유화',kicker:'1989년',headline:'누구나 해외여행 가능해져',who:'elder',v:{
   A:{w:c=>c.subj?1.5:0,text:'누구나 여권을 낼 수 있게 됐다. 식구들이 돈을 모아 {subj}{subj:을/를} 효도 관광 보내 드렸다.',fx:{money:-6,affAll:2,rec:'처음으로 비행기를 타고 효도 관광을 다녀왔다',recW:2}},
   B:{w:()=>S.people.some(p=>p.alive&&p.away&&/이민|해외/.test(p.away.why))?2:.4,text:'해외에 사는 식구가 처음으로 가족을 초청했다.',fx:{affAll:1}},
   C:{w:()=>1,text:'옆집이 해외여행을 다녀와 기념품을 돌렸다. 아이들이 부러워한다.',fx:{gap:{f:1}}}}},
 realname:{title:'금융실명제',kicker:'1993년 8월',headline:'모든 금융거래 실명으로',v:{
   A:{w:()=>S.tradeSt>=2?1.5:.5,text:'하루아침에 차명 거래가 금지됐다. 현금 장사 손님들이 한동안 뜸해졌다.',fx:{mod:{k:'trade',m:.92,n:1}}},
   B:{w:()=>S.flags.savings?1.4:.6,text:'통장 이름을 정리하느라 은행 창구가 북새통이었다. 우리 통장은 처음부터 내 이름이라 걱정이 없었다.',fx:{face:1}},
   C:{w:()=>1,text:'뉴스는 연일 시끄러웠지만 우리 살림과는 먼 이야기였다.',fx:{}}}},
 collapse:{title:'무너진 것들',kicker:'1994~1995년',headline:'한강 다리 붕괴에 이어 백화점 붕괴',v:{
   A:{w:()=>1,text:'출근길 다리가 끊어지고, 이듬해 여름 백화점이 무너졌다. 그날 그 길로 가지 않은 식구는 한참을 말없이 앉아 있었다.',fx:{affAll:2,recRep:'무너진 다리와 백화점 소식에 식구들 얼굴을 다시 보았다',recW:2}},
   B:{w:()=>S.nbs.length?1:0,nb:'any',text:'백화점이 무너진 날, {nb}의 식구가 돌아오지 않았다. 골목 사람들이 함께 빈소를 지켰다.',fx:{money:-2,nbj:2,ledger:'백화점 참사 때 빈소를 지킴'}},
   C:{w:()=>S.tradeSt>=2||S.house!=='shack'?1.4:.5,text:'참사 뒤 건물 안전 점검이 이어졌다. 우리 가게와 집도 손볼 데가 많았다.',fx:{money:-5}}}},
 imf:{title:'외환위기',kicker:'1997년 겨울',headline:'국제통화기금에 구제금융 신청',v:{
   A:{w:()=>(S.tradeSt>=2||S.craftSt>=2)?2:1,raw:true,text:'거래처가 줄줄이 부도났다. 가게와 공장이 휘청인다.',fx:()=>({money:-Math.round(Math.max(0,S.money)*.2),mods:[{k:'trade',m:.7,n:2},{k:'craft',m:.7,n:2}]})},
   B:{w:()=>S.money>cm(50)?2:.5,text:'빚 없이 버텨 온 덕에 큰 탈 없이 넘겼다. 헐값에 나온 이웃 가게를 보며 마음이 복잡하다.',fx:{face:1,gap:{f:-1}}},
   C:{w:()=>S.people.some(p=>p.alive&&p.edu>=3&&p.slot==='study')?2:.5,text:'회사 다니던 식구가 명예퇴직을 당했다. 아침마다 양복을 입고 나가 산에 앉아 있다 들어왔다.',fx:{affAll:-1,mod:{k:'study',m:.5,n:2}}}}},
 gold:{title:'금 모으기',kicker:'1998년 초',headline:'나라 빚 갚자, 금 모으기 운동',v:{
   A:{w:()=>1.4,text:'돌반지와 결혼반지를 들고 은행 앞에 줄을 섰다. 우리 집도 반지 몇 개를 내놓았다.',fx:{money:-3,face:1,affAll:1}},
   B:{w:()=>S.money>0?1:.3,text:'헐값에 나온 가게와 땅이 쏟아졌다. 현금이 있는 집에는 기회였다.',fx:{chain:{id:'cheapLand',in:0}}},
   C:{w:()=>1,text:'실직한 이웃이 늘었다. 골목 사람들이 쌀과 반찬을 나눴다.',fx:{jAll:1,money:-2}}}},
 worldcup:{title:'붉은 여름',kicker:'2002년 6월',headline:'월드컵 4강, 거리 응원 수백만',v:{
   A:{w:()=>S.tradeY>0?1.6:.5,text:'경기가 있는 날이면 가게가 사람으로 미어터졌다.',fx:{money:8,repu:3}},
   B:{w:()=>1.2,text:'온 식구가 붉은 옷을 입고 거리로 나갔다. 모르는 사람과 얼싸안고 울었다.',fx:{affAll:2}},
   C:{w:()=>1,text:'동네 공터에 큰 화면이 걸리고 골목 사람들이 모두 모였다.',fx:{jAll:1}}}},
 crisis08:{title:'금융위기',kicker:'2008년 가을',headline:'미국발 금융위기, 증시 폭락',v:{
   A:{w:()=>S.money>cm(40)?1.5:.4,raw:true,text:'은행이 권한 펀드가 반 토막 났다.',fx:()=>({money:-Math.round(Math.max(0,S.money)*.12)})},
   B:{w:()=>S.people.some(p=>p.alive&&p.away&&/이민|해외|유학/.test(p.away.why))?2:.4,text:'바다 건너 살던 식구가 일자리를 잃고 집으로 돌아왔다.',fx:{affAll:1}},
   C:{w:()=>1,text:'빚 없이 살아온 덕에 큰 탈은 없었다. 동네에선 우리 집을 알뜰한 집이라고 불렀다.',fx:{face:1}}}},
 sewol:{title:'가라앉은 봄',kicker:'2014년 4월',headline:'수학여행 학생 태운 여객선 침몰',v:{
   A:{w:()=>S.people.some(p=>p.alive&&age(p)>=14&&age(p)<=19)?2:.4,text:'수학여행 가던 학생들을 태운 배가 바다에 가라앉았다. 그날 저녁, 고등학생 아이를 오래 안아 주었다.',fx:{affAll:2}},
   B:{w:()=>1,text:'수학여행 가던 학생들을 태운 배가 가라앉았다. 가게 문에 노란 리본을 달았다. 온 나라가 오래 슬퍼했다.',fx:{jAll:1}},
   C:{w:()=>1,text:'배가 가라앉은 뒤로 아이들 수학여행과 행사가 줄줄이 취소됐다. 식구들은 한동안 말이 없었다.',fx:{gap:{s:-1}}}}},
 candle:{title:'촛불의 겨울',kicker:'2016~2017년',headline:'광장에 촛불, 헌법재판소 대통령 파면 결정',who:'any',wc:p=>BK(p)&&age(p)>=16,v:{
   A:{w:c=>c.subj?1.2:0,text:'겨울 내내 주말마다 광장에 촛불이 모였다. {subj}{subj:도} 촛불을 들고 나갔다. 이듬해 봄, 헌법재판소가 대통령 파면을 결정했다.',fx:{rec:'그해 겨울 광장에서 촛불을 들었다',recW:2}},
   B:{w:()=>1,text:'광장 소식이 매주 이어졌다. 명절 밥상에서 식구들끼리 생각이 달라 한동안 말이 줄었다. 이듬해 봄, 대통령 파면 결정이 내려졌다.',fx:{affAll:-1}},
   C:{w:()=>S.tradeY>0?1:.5,text:'주말마다 사람이 몰려 가게가 바빴다. 이듬해 봄, 대통령 파면 결정이 내려졌다.',fx:{money:3}}}},
 covid:{title:'멈춘 거리',kicker:'2020년',headline:'코로나19 대유행, 사회적 거리두기',v:{
   A:{w:()=>S.tradeY>0?2:.5,text:'손님이 끊겼다. 가게 문을 열어도 하루 종일 한 명도 오지 않는 날이 이어졌다.',fx:{mod:{k:'trade',m:.6,n:2},repu:-2}},
   B:{w:()=>S.tradeY>0?1:.2,text:'배달로 돌린 것이 맞아떨어졌다. 주문 알림이 쉴 새 없이 울린다.',fx:{mod:{k:'trade',m:1.15,n:2},repu:4}},
   C:{w:()=>1,text:'명절에 모이지 못하고 화면으로 얼굴을 봤다. 어르신들은 화면 속 손주를 손끝으로 쓰다듬었다.',fx:{affAll:-1}}}},
 postcovid:{title:'돌아온 거리',kicker:'2023년',headline:'(가상) 마스크를 벗은 첫 봄',v:{
   A:{w:()=>1,text:'마스크를 벗은 첫 봄. 거리에 사람들이 돌아왔다.',fx:{mod:{k:'trade',m:1.1,n:2}}},
   B:{w:()=>1,text:'물가가 크게 올랐다. 장바구니가 가벼워졌다.',fx:{money:-4}},
   C:{w:()=>1,text:'떨어져 지낸 몇 해 사이 아이들이 훌쩍 컸다. 오랜만에 온 식구가 한 상에 모였다.',fx:{affAll:1}}}},
 rebuild:{title:'재건축',kicker:'2020년대 후반 · 가상',headline:'(가상) 낡은 동네 재건축 결정',v:{
   A:{w:()=>S.place.kind==='origin'?1.5:.3,text:'동네에 재건축이 확정됐다. 오래된 골목이 펜스로 둘러쳐졌다. 집이 있는 집은 새 아파트 입주권을 받았다.',fx:()=>S.house!=='shack'?{house:'apt',face:1}:{money:-4}},
   B:{w:()=>1,text:'재건축 조합이 분담금 문제로 갈라졌다. 몇 해째 공사가 멈춰 있다.',fx:{jAll:-1}},
   C:{w:()=>1,text:'재건축 대신 옛 골목을 살리기로 했다. 오래된 가게들이 '+'노포'+'로 이름을 얻기 시작했다.',fx:{repu:4,face:1}}}},
 school:{title:'문 닫는 학교',kicker:'2030년대 · 가상',headline:'(가상) 아이가 없어 동네 학교 폐교',v:{
   A:{w:()=>1,text:'아이가 없어 동네 학교가 문을 닫았다. 건물은 노인 복지관이 됐다.',fx:{jAll:1}},
   B:{w:()=>1,text:'문 닫은 학교가 청년 창업 공간으로 바뀌었다.',fx:{mod:{k:'trade',m:1.08,n:3}}},
   C:{w:()=>1,text:'문 닫은 학교 건물이 빈 채로 남았다. 아이들 웃음소리가 그립다.',fx:{affAll:-1}}}},
 ai:{title:'기계의 일상',kicker:'2030년대 · 가상',headline:'(가상) 상점·물류 무인화 급속 확산',v:{
   A:{w:()=>1,text:'가게마다 기계가 주문을 받고 물건을 나른다. 우리 가게도 일손이 줄었다.',fx:{mod:{k:'trade',m:1.1,n:4}}},
   B:{w:()=>S.people.some(p=>p.alive&&(p.slot==='craft'||p.slot==='study'))?1.5:.5,text:'일하던 자리를 기계가 대신하게 됐다. 식구 하나가 재교육을 받으러 다닌다.',fx:{mods:[{k:'craft',m:.85,n:3},{k:'study',m:.9,n:3}]}},
   C:{w:()=>1,text:'기계가 늘수록 사람 손으로 만든 물건과 사람이 건네는 말이 귀해졌다.',fx:{repu:5,mod:{k:'care',m:1.15,n:5}}}}},
 climate:{title:'기후 재난',kicker:'2040년대 · 가상',headline:'(가상) 기록적 폭염과 도심 침수',v:{
   A:{w:()=>S.house==='apt'?.5:1.5,text:'기록적인 폭우에 골목이 잠겼다. 반지하 이웃들이 우리 집으로 피했다.',fx:{money:-6,jAll:2,timeDebt:2}},
   B:{w:()=>1,text:'폭염이 한 달 넘게 이어졌다. 어르신들 걱정에 밤마다 식구들이 돌아가며 깨어 있었다.',fx:{affAll:1,money:-3}},
   C:{w:()=>S.money>cm(30)?1.5:.5,text:'미리 대비해 둔 덕에 큰 피해 없이 넘겼다. 우리 집이 동네 쉼터가 됐다.',fx:{jAll:2,face:1}}}},
 hometown:{title:'북쪽 고향 소식',kicker:'2040년대 · 가상',headline:'(가상) 이산가족 고향 방문 길 열려',v:{
   A:{w:()=>S.frag>=3?1.2:.3,text:'고향 방문 길이 열렸다. 1세대가 남긴 고향 기억 조각을 들고, 손주들이 할아버지의 고향 땅을 밟았다.',fx:{face:3,affAll:3,flag:'homecoming',recRep:'1세대의 고향 땅을 밟고 돌아왔다',recW:5}},
   B:{w:()=>1,text:'고향 방문 길이 열린다는 소문이 돌다 잠잠해졌다.',fx:{}},
   C:{w:()=>1,text:'고향 방문 길이 열렸지만, 그 고향을 기억하는 사람은 이제 집안에 아무도 없다.',fx:{affAll:-1,recRep:'고향 길이 열렸지만 그곳을 기억하는 사람이 없었다',recW:3}}}},
 population:{title:'비어 가는 골목',kicker:'2050년대 · 가상',headline:'(가상) 인구 감소로 빈집 급증',v:{
   A:{w:()=>1,text:'골목에 빈집이 늘었다. 싸게 나온 빈집을 사 두라는 권유가 들어온다.',fx:{chain:{id:'cheapLand',in:0}}},
   B:{w:()=>S.land>0?1.5:.5,text:'사람이 줄자 땅값이 떨어졌다.',fx:{face:-1}},
   C:{w:()=>1,text:'이주민 가족들이 빈집에 들어와 골목이 다시 북적인다.',fx:{jAll:1}}}},
 centennial:{title:'정착 100주년',kicker:'2053년 · 가상',headline:'(가상) 피란민 마을 정착 100년',v:{
   A:{w:()=>S.face>=45?1.5:.5,text:'동네 정착 100주년 잔치를 우리 집이 주관했다.',fx:{face:3,jAll:2,money:-5}},
   B:{w:()=>1,text:'동네 기록관이 문을 열었다. 우리 집 족보와 옛 사진도 전시됐다.',fx:{face:2,recRep:'동네 기록관에 우리 집 이야기가 전시됐다',recW:3}},
   C:{w:()=>1,text:'100주년은 조용히 지나갔다. 어른들만 옛이야기를 나눴다.',fx:{affAll:1}}}},
 rebuild2:{title:'두 번째 재건축',kicker:'2060년대 · 가상',headline:'(가상) 노후 단지 2차 재건축',v:{
   A:{w:()=>1,text:'30여 년 된 아파트 단지가 다시 재건축에 들어갔다.',fx:()=>S.house==='apt'?{money:-10,face:1}:{}},
   B:{w:()=>1,text:'옛 골목을 보존하자는 쪽이 이겼다. 오래된 집들이 수리를 받았다.',fx:{repu:3,jAll:1}},
   C:{w:()=>1,text:'재건축이 무산됐다. 낡은 동네는 낡은 대로 남았다.',fx:{}}}},
 longlife:{title:'백 살의 나라',kicker:'2070년 무렵 · 가상',headline:'(가상) 연금 받는 나이 늦춰져, 노인 일자리 확대',v:{
   A:{w:()=>homeAlive().some(p=>age(p)>=60)?1.5:.6,text:'연금 받는 나이가 늦춰졌다. 집안 어른들 주머니가 한동안 가벼워졌다.',fx:{money:-5,affAll:-1}},
   B:{w:()=>1,text:'동네에 노인 일자리가 생겼다. 어른들이 아침마다 조끼를 입고 골목 화단을 가꾼다.',fx:{jAll:1,affAll:1}},
   C:{w:()=>avgJ()>=3?1.5:.7,text:'혼자 사는 노인 집을 이웃끼리 돌아가며 들여다보는 모임이 생겼다.',fx:{jAll:2}}}},
 seawall:{title:'차오르는 바다',kicker:'2070년대 · 가상',headline:'(가상) 해수면 상승, 해안 저지대 침수 잦아',v:{
   A:{w:()=>1,text:'큰 만조에 바닷물이 하수구를 타고 거꾸로 올라왔다. 집 아래층이 물에 잠겨 손을 봐야 했다.',fx:{money:-8}},
   B:{w:()=>avgJ()>=3?2:.6,text:'물이 차오른 밤, 이웃들이 모래주머니를 날라 우리 집 문턱을 막아 줬다.',fx:{jAll:2,money:-2}},
   C:{w:()=>S.land>0?1.5:.5,text:'높은 땅으로 옮겨 가려는 사람이 늘면서 언덕 쪽 땅값이 오른다는 소문이 돈다.',fx:{flag:'landRumor'}}}},
 northrail:{title:'북으로 가는 기차',kicker:'2070년대 후반 · 가상',headline:'(가상) 대륙 잇는 철길 정기 운행',v:{
   A:{w:()=>S.frag>=2?1.5:.6,text:'북쪽을 지나 대륙까지 가는 기차가 다니기 시작했다. 식구 몇이 1세대가 말하던 고향 언저리까지 다녀왔다.',fx:{money:-3,affAll:1,frag:1,recRep:'북으로 가는 기차를 타고 옛 고향 언저리를 다녀왔다',recW:3}},
   B:{w:()=>S.tradeY>0?1.5:.7,text:'철길로 먼 곳 물건이 싸게 들어온다. 장사하는 집들은 새 판로를 찾느라 바쁘다.',fx:{mod:{k:'trade',m:1.1,n:3}}},
   C:{w:()=>1,text:'기차가 다닌다는 뉴스를 보며 어른들은 "살아서 볼 줄 몰랐다"고만 했다.',fx:{affAll:1}}}},
 carebot:{title:'돌봄 기계',kicker:'2080년 무렵 · 가상',headline:'(가상) 가정용 돌봄 로봇 보급',v:{
   A:{w:()=>homeAlive().some(p=>age(p)>=75)?2:.4,text:'어르신 곁에 돌봄 기계를 들였다. 약 시간을 챙기고 말벗도 해 준다. 값이 만만치 않다.',fx:{money:-6,affAll:1}},
   B:{w:()=>1,text:'"기계가 손을 잡아 주진 않는다"며 이웃끼리 돌봄 품앗이를 이어 가기로 했다.',fx:{jAll:1}},
   C:{w:()=>S.craftY>0?1.5:.6,text:'기계를 고치고 손볼 사람이 모자라다. 손재주 있는 집에 일감이 몰렸다.',fx:{mod:{k:'craft',m:1.12,n:3}}}}},
 witness:{title:'마지막 증인',kicker:'2080년대 · 가상',headline:'(가상) 전쟁을 겪은 마지막 세대, 역사 속으로',v:{
   A:{w:()=>1,text:'전쟁을 기억하는 마지막 어르신들이 세상을 떠난다는 뉴스가 나왔다. 식구들이 1세대의 피란 이야기를 다시 꺼내 적었다.',fx:{face:1,recRep:'1세대의 피란 이야기를 글로 남겼다',recW:3}},
   B:{w:()=>1,text:'동네 기록관에서 피란민 집안들의 이야기를 모은다. 우리 집 이야기도 한 쪽 실렸다.',fx:{face:2,jAll:1}},
   C:{w:()=>1,text:'뉴스를 봐도 아이들은 그 전쟁을 교과서 속 일로만 안다. 어른들은 조금 쓸쓸해했다.',fx:{affAll:-1}}}},
 lastschool:{title:'마지막 졸업식',kicker:'2080년대 말 · 가상',headline:'(가상) 학생 줄어 동네 학교 문 닫아',v:{
   A:{w:()=>1,text:'동네 초등학교가 마지막 졸업식을 열었다. 학교 건물은 동네 사랑방으로 바뀐다.',fx:{jAll:1,face:1}},
   B:{w:()=>homeAlive().some(p=>age(p)>=6&&age(p)<=12)?2:.3,text:'학교가 문을 닫아 아이가 먼 학교까지 차를 타고 다니게 됐다.',fx:{money:-3,affAll:-1}},
   C:{w:()=>1,text:'이주민 가족 아이들이 들어와 학교가 겨우 문을 닫지 않았다. 운동회 날 골목이 시끌벅적했다.',fx:{jAll:1}}}},
 heat:{title:'끝나지 않는 여름',kicker:'2090년대 · 가상',headline:'(가상) 40도 넘는 더위 한 달 넘게 이어져',v:{
   A:{w:()=>1,text:'한 달 넘게 불볕더위가 이어졌다. 냉방비가 치솟고 어르신들이 기운을 잃었다.',fx:{money:-5,affAll:-1}},
   B:{w:()=>avgJ()>=3?2:.7,text:'동네 회관을 더위 쉼터로 열었다. 낮이면 골목 어른들이 모여 부채를 부친다.',fx:{jAll:2}},
   C:{w:()=>S.tradeY>0?1.5:.5,text:'낮에는 거리에 사람이 없다. 가게들은 밤에만 문을 연다.',fx:{mod:{k:'trade',m:.9,n:2}}}}},
 archive:{title:'모두의 족보',kicker:'2090년대 후반 · 가상',headline:'(가상) 국가 가족기록 보관소 문 열어',v:{
   A:{w:()=>S.jb&&['ours','true'].includes(S.jb.kind)?2:.5,text:'나라에서 집집의 가족 기록을 모아 보관한다. 우리 족보가 한 권 그대로 실렸다.',fx:{face:2,recRep:'우리 족보가 나라 기록 보관소에 실렸다',recW:4}},
   B:{w:()=>S.jb&&['ours','true'].includes(S.jb.kind)?.3:1.5,text:'가족 기록을 내라는데, 우리 집엔 이름 몇 줄밖에 없다. 빈칸이 많다.',fx:{face:-1}},
   C:{w:()=>1,text:'기록을 맞춰 보다가 먼 친척 집과 연락이 닿았다. 1세대의 고향 이야기를 조금 더 알게 됐다.',fx:{affAll:1,frag:1}}}},
 century:{title:'새 세기',kicker:'2100년 1월 · 가상',headline:'(가상) 22세기 첫날',v:{
   A:{w:()=>1,text:'22세기 첫날, 온 식구가 모여 해돋이를 봤다. 1950년에 태어난 어른이 있었다면 150살이다.',fx:{affAll:2,money:-3}},
   B:{w:()=>avgJ()>=3?1.5:.7,text:'골목 집들이 함께 새 세기 잔치를 열었다.',fx:{jAll:1,money:-2}},
   C:{w:()=>1,text:'새 세기라는데 여느 아침과 다르지 않았다. 떡국을 먹고 일터로 나갔다.',fx:{affAll:1}}}},
 lastalley:{title:'마지막 골목',kicker:'2100년대 · 가상',headline:'(가상) 옛 피란민 마을, 마지막 정비 사업',v:{
   A:{w:()=>S.house!=='shack'?1.5:.5,text:'옛 동네 마지막 골목까지 정비 사업이 들어왔다. 보상금을 받고 새 집으로 옮길 수 있다.',fx:{money:15,face:-1}},
   B:{w:()=>S.face>=45?1.5:.6,text:'이 골목을 피란민 마을 보존 지구로 남기기로 했다. 우리 집 대문에도 작은 안내판이 붙었다.',fx:{face:2,recRep:'우리 집이 피란민 마을 보존 지구에 남았다',recW:4}},
   C:{w:()=>1,text:'떠날 사람은 떠나고 남을 사람은 남았다. 남은 몇 집이 더 가까워졌다.',fx:{jAll:2}}}}
};
function avgJ(){return S.nbs.length?S.nbs.reduce((a,n)=>a+n.j,0)/S.nbs.length/2:0}
function fireEra(e){
  const d=ERA_DEF[e.id];const ctx={};
  if(d.who){const L=whoList(d.who,d.wc);if(L.length)ctx.subj=d.who==='gen1'?(L.find(p=>p.id===S.repId)||L[0]):pick(L)}
  const keys=['A','B','C'];const ws=keys.map(k=>{try{return Math.max(0,d.v[k].w(ctx))}catch(er){return 0}});const tot=ws.reduce((a,b)=>a+b,0);
  let k='C';if(tot>0){let r=R()*tot;for(let i=0;i<3;i++){r-=ws[i];if(r<=0){k=keys[i];break}}}
  const vd=d.v[k];if(vd.nb){ctx.nb=pickNb(vd.nb);if(!ctx.nb){k='C'}}
  const v2=d.v[k];const text=fill(v2.text,ctx);const out=[];try{applyFx(v2.fx,ctx,out,{raw:!!v2.raw})}catch(er){}
  e.done=true;logIt(d.title+' (변형 '+k+')');
  return {title:d.title,kicker:d.kicker||'',headline:d.headline||'',variant:k,text,msgs:out};
}
/* 시대 이벤트에서 이어지는 여름 카드 */
const ERA_CARDS=[
 {id:'boritAsk',slot:'동네',chainOnly:true,major:true,nb:'gwabu',title:'빈 자루',text:'{nb}의 {nbHead} 씨가 빈 자루를 들고 찾아왔다. 아이들이 사흘째 죽만 먹었다고 한다.',
  ch:[{t:'쌀을 나눈다 (6)',need:{money:6},fx:{money:-6,nbj:4,ledger:'보릿고개에 쌀 한 자루를 나눔',recRep:'보릿고개에 {nb}에 쌀을 나눴다',recW:3,chain:{id:'bankson',in:20}}},
      {t:'반 자루만 나눈다 (3)',need:{money:3},fx:{money:-3,nbj:2,ledger:'보릿고개에 쌀 반 자루를 나눔'}},
      {t:'꿔 준다',fx:{money:-6,nbj:1,ledger:'쌀 한 자루를 꿔 줌',chain:{id:'repay',in:2}}},
      {t:'돌려보낸다',fx:{nbj:-3,ledger:'쌀을 꾸러 왔는데 돌려보냄'}}]},
 {id:'gangnamBuy',slot:'시대',chainOnly:true,major:true,title:'강 건너 땅',text:'강 건너 땅을 살까? 지금 사면 몇 년 뒤 크게 오를 수도, 헛소문일 수도 있다.',
  ch:[{t:'크게 산다 (40)',need:{money:40},fx:{money:-40,chain:{id:'landresult',in:5}}},
      {t:'조금만 산다 (20)',need:{money:20},fx:{money:-20,flag:'landHalf',chain:{id:'landresult',in:5}}},
      {t:'흘려듣는다',fx:{}}]},
 {id:'cheapLand',slot:'시대',chainOnly:true,title:'헐값 매물',text:'헐값에 나온 땅 한 필지가 있다. 지금 사 두면 언젠가 값이 오를지도 모른다.',
  ch:[{t:'산다 (25)',need:{money:25},fx:{money:-25,land:1,recRep:'헐값 매물로 땅을 샀다',recW:2}},{t:'남의 불행으로 돈 벌고 싶지 않다',fx:{gap:{f:-1}}}]}
];
/* 마지막 명절: 3세대가 모두 세상을 떠난 해 */
function finaleVariant(){
  const blood=S.people.filter(p=>p.alive&&!p.inlaw);const away=blood.filter(p=>p.status!=='home').length;
  const last=S.finaleBy?P(S.finaleBy):null;const y=S.year,span=y-1950;
  const who=last?last.name+josa(last.name,'이/가')+' 떠난 이듬해':'3대가 모두 떠난 이듬해';
  if(!blood.length)return {k:'D',text:y+'년. '+who+', 이 집 문패를 기억하는 사람이 없다. 족보 몇 장만 남았다.'};
  if(away>=Math.max(2,blood.length/2))return {k:'B',text:y+'년 설. '+who+'. 빈 방석이 많은 밥상이다. 떠난 사람들의 이름을 하나씩 불러 본다.'};
  if(y>=2040&&R()<.35)return {k:'C',text:y+'년 설. '+who+'. 멀리 사는 식구들은 화면으로 모였다. 화면 너머에서도 떡국을 먹는다.'};
  return {k:'A',text:y+'년 설. '+who+'. 남은 식구들이 한 상에 모였다. '+span+'년 전 보따리 하나로 시작한 집이다.'};
}
