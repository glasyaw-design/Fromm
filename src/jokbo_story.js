/* =====================================================================
   족보 이야기: 게임 제목을 꿰는 줄기
   S.jb = { bon: 본관 이름|null, kind: 'none'|'true'|'bought'|'fake'|'ours', pages: 기록한 쪽수,
            women: 딸·며느리 이름을 올리는가, adopted: 입양·다문화 식구를 올리는가, preface: 서문 }
   단계마다 '족보' 슬롯의 중요 카드가 나오고, 고른 길이 다음 이야기와 엔딩을 바꾼다.
   ===================================================================== */
const HOMETOWNS=['함흥','단천','북청','길주','해주','연백','개성','평산','안주','정주'];
function jbInit(){
  S.jb={bon:null,kind:'none',pages:0,women:false,adopted:false,preface:null,hometown:pick(HOMETOWNS),insult:false,clanCost:false};
  if(S.lineage==='fallen'){S.jb.bon=pick(['안동','진주','밀양','경주','전주']);S.jb.kind='true';S.jb.pages=3}
  if(S.lineage==='native')S.jb.hometown=placeName();
}
function jbBonText(){const j=S.jb;if(!j||!j.bon)return '본관 없음';return j.bon+' '+S.sur+'씨'}
function jbKindText(){return {none:'족보 없음',true:'옛 족보를 이은 집',bought:'남의 종친회 족보에 이름을 산 집',fake:'사들인 가짜 족보',ours:'우리부터 시작한 새 족보'}[S.jb.kind]}
const JB_CARDS=[
 {id:'jb-1',slot:'집안',major:true,y:[1957,1966],nb:'yangban',cond:()=>S.jb&&S.jb.kind==='none',title:'본관이 어디요',
  text:'동네 잔칫날, {nb}의 {nbHead} 어른이 사람들 앞에서 물었다. "그 집은 본관이 어디요? 족보도 없는 집안에 딸을 줄 수는 없지." 식구들 얼굴이 화끈거렸다.',
  ch:[{t:'고향 이름을 대며 반드시 찾겠다고 한다',fx:{jb:{insult:true},frag:1,nbj:-1,recRep:'"본관이 어디요" 소리를 듣고 족보를 찾기로 마음먹었다',recW:4}},
      {t:'"족보가 밥 먹여 주오" 하고 맞선다',fx:{nbj:-3,gap:{f:-2},jb:{insult:true},recRep:'족보 없는 집이라는 말에 "족보가 밥 먹여 주오" 하고 맞섰다',recW:3}},
      {t:'웃어넘긴다',fx:{face:-2,jb:{insult:true}}}]},
 {id:'jb-2',slot:'집안',major:true,y:[1962,1975],cond:()=>S.jb&&S.jb.kind==='none'&&!S.jb.bon,title:'호적의 빈칸',
  text:()=>'동사무소에서 피란민 호적을 새로 정리한다. 본관 칸이 비어 있다. 기억하는 고향은 '+S.jb.hometown+'. 고향 기억 조각은 '+S.frag+'개다.',
  ch:[{t:'기억대로 고향 이름을 적는다',fx:ctx=>S.frag>=2?{jb:{bon:S.jb.hometown,kind:'true',pagesAdd:1},recRep:'호적에 고향 '+S.jb.hometown+'을 본관으로 적었다',recW:3}:{jb:{bon:S.jb.hometown,kind:'fake'},recRep:'기억이 흐린 채로 호적에 본관을 적었다',recW:2}},
      {t:'흔한 본관을 적어 둔다',fx:{jb:{bon:'김해',kind:'fake'},face:2,recRep:'호적에 남들 많이 쓰는 본관을 적어 넣었다',recW:2}},
      {t:'빈칸으로 둔다',fx:{gap:{f:-1}}}]},
 {id:'jb-3',slot:'집안',major:true,y:[1970,1990],cond:()=>S.jb&&(S.jb.kind==='none'||S.jb.kind==='fake')&&S.face>=20,title:'종친회에서 온 사람',
  text:'양복 입은 사람이 찾아왔다. "같은 성씨끼리 돕고 살아야지요. 회비를 내시면 우리 종친회 족보에 올려 드립니다." 회비가 만만찮다.',
  ch:[{t:'회비를 내고 이름을 올린다 (25)',need:{money:25},fx:{money:-25,face:4,jb:{kind:'bought',bon:'(종친회)',pagesAdd:1},recRep:'종친회에 회비를 내고 남의 족보에 이름을 올렸다',recW:3,chain:{id:'jb-3b',in:12}}},
      {t:'남의 족보에 끼고 싶지 않다',fx:{gap:{f:-1},jb:{clanRefused:true}}},
      {t:'조금 더 생각해 보겠다',fx:{}}]},
 {id:'jb-3b',slot:'집안',chainOnly:true,major:true,title:'종친회 총회',text:'종친회 총회에 갔더니 우리 집 이름 옆에 "계보 미상"이라고 적혀 있다. 뒷자리에서 수군거리는 소리가 들린다.',
  ch:[{t:'항의하고 회비를 돌려 달라고 한다',fx:{money:8,face:-2,jb:{kind:'none',bon:null},recRep:'종친회 족보에서 이름을 뺐다',recW:2}},
      {t:'찬조금을 더 내서 계보를 이어 붙인다 (15)',need:{money:15},fx:{money:-15,face:2,jb:{pagesAdd:1}}},
      {t:'모른 척 다닌다',fx:{face:-1}}]},
 {id:'jb-4',slot:'시대',major:true,y:[1978,1998],cond:()=>S.jb&&S.jb.kind!=='true'&&S.money>=cm(20),title:'족보 장사꾼',
  text:'인쇄소를 한다는 사람이 그럴듯한 족보 한 질을 보여 준다. "양반 가문 족보 중간에 댁 어른 이름을 끼워 드립니다. 아무도 몰라요."',
  ch:[{t:'산다 (30)',need:{money:30},fx:()=>({money:-30,face:6,jb:{kind:'fake',bon:pick(['안동','파평','청주','남양']),pagesAdd:2,fakeBought:true},recRep:'족보 장사꾼에게 양반 족보를 샀다',recW:4,chain:{id:'jb-4b',in:15}})},
      {t:'내쫓는다',fx:{gap:{f:-2},recRep:'가짜 족보를 사라는 말에 장사꾼을 내쫓았다',recW:2}}]},
 {id:'jb-4b',slot:'집안',chainOnly:true,major:true,title:'들통',text:()=>'사돈댁에서 우리 족보를 대조해 봤다고 한다. "'+(S.jb.bon||'')+' 족보에는 그런 어른이 없던데요."',
  ch:[{t:'사실대로 털어놓는다',fx:{face:-6,jb:{kind:'none',bon:null,pages:0},flag:'exposed',recRep:'산 족보가 가짜인 것이 들통나 사실대로 털어놓았다',recW:4}},
      {t:'끝까지 우긴다',fx:{rnd:[{p:.5,fx:{face:-12,flag:'exposed',jb:{kind:'none',bon:null,pages:0}},msg:'온 동네에 소문이 났다'},{p:.5,fx:{face:-2},msg:'겨우 넘어갔다. 하지만 사돈댁 눈빛이 달라졌다'}]}}]},
 {id:'jb-5',slot:'집안',major:true,y:[1965,2010],cond:()=>S.jb&&S.jb.kind==='none'&&(S.face>=30||S.flags.ourJokbo),title:'우리부터 쓰는 족보',
  text:()=>'남의 족보를 빌릴 게 아니라, 피란 내려온 그해부터 우리 족보를 새로 쓰자는 말이 나왔다. 본관은 무엇으로 할까?',
  ch:[{t:()=>'고향 '+S.jb.hometown+'을 본관으로 삼는다',fx:()=>({jb:{bon:S.jb.hometown,kind:S.frag>=3?'true':'ours',pagesAdd:2},flag:'ourJokbo',recRep:'고향 '+S.jb.hometown+'을 본관으로 삼아 우리 족보 첫 장을 썼다',recW:5})},
      {t:()=>'이 동네 '+placeName()+'를 본관으로 삼는다',fx:()=>({jb:{bon:placeName(),kind:'ours',pagesAdd:2},flag:'ourJokbo',gap:{f:-1},recRep:placeName()+' '+S.sur+'씨의 시조가 되었다',recW:5})},
      {t:'아직 때가 아니다',fx:{}}]},
 {id:'jb-6',slot:'집안',major:true,y:[1990,2025],cond:()=>S.jb&&S.jb.kind!=='none'&&S.jb.pages>=1&&!S.jb.womenAsked,title:'딸들의 이름',
  text:'족보를 새로 정리하는데, 옛 법대로라면 딸은 이름 없이 사위 이름만 올라간다. 딸들이 묻는다. "우리는 이 집 사람이 아니에요?"',
  ch:[{t:'딸과 며느리 이름도 올린다',fx:{jb:{women:true,womenAsked:true,pagesAdd:1},affAll:2,gap:{s:-1},recRep:'족보에 딸과 며느리 이름을 처음으로 올렸다',recW:4}},
      {t:'옛 법대로 한다',fx:{jb:{womenAsked:true},affAll:-1,gap:{s:1}}}]},
 {id:'jb-7',slot:'시대',major:true,y:[2003,2040],cond:()=>S.jb&&S.lineage!=='native',title:'유전자 검사',
  text:'집안 내력을 알아보려고 유전자 검사를 했다. 몇 주 뒤 결과가 왔다.',
  ch:[{t:'결과를 열어 본다',fx:()=>S.jb.kind==='fake'?{rnd:[{p:.7,fx:{jb:{kind:'none',bon:null,pages:0},face:-3,flag:'exposed'},msg:'족보에 적힌 집안과는 피가 다르다는 결과였다'},{p:.3,fx:{},msg:'뚜렷한 결과는 없었다'}]}:{rnd:[{p:Math.min(.7,.15+.12*S.frag),fx:{frag:2,jb:{pagesAdd:1},affAll:2,recRep:'유전자 검사로 먼 친척 집안을 찾았다',recW:4},msg:'바다 건너 사는 먼 친척과 연결됐다'},{p:.5,fx:{},msg:'뚜렷한 결과는 없었다'}]}},
      {t:'몰라도 된다며 덮어 둔다',fx:{gap:{f:-1}}}]},
 {id:'jb-8',slot:'집안',major:true,y:[2005,2070],cond:()=>S.jb&&S.jb.kind!=='none'&&S.people.some(p=>p.alive&&(p.f.adopted||(p.inlaw&&/다문화|바다 건너|이주/.test(p.recs.map(r=>r.t).join(' ')))))||(S.jb&&S.jb.kind!=='none'&&S.adopted),title:'족보에 올릴 이름',
  text:'피가 섞이지 않은 식구도 족보에 올릴 것인가. 어른들 의견이 갈린다.',
  ch:[{t:'한 식구면 한 족보다',fx:{jb:{adopted:true,pagesAdd:1},affAll:2,recRep:'입양하고 시집온 식구까지 모두 족보에 올렸다',recW:4}},
      {t:'피가 이어진 사람만 올린다',fx:{affAll:-2,gap:{f:1}}}]},
 {id:'jb-9',slot:'집안',major:true,y:[2045,2072],cond:()=>S.jb&&S.jb.kind!=='none'&&S.jb.pages>=2&&!S.jb.preface,title:'족보 서문',
  text:()=>'정착 100년을 앞두고 족보를 책으로 묶기로 했다. 첫 장 서문에 무엇을 적을까. ('+jbBonText()+', 지금까지 '+S.jb.pages+'쪽)',
  ch:[{t:'"보따리 하나로 시작했다"',fx:{jb:{preface:'보따리 하나로 시작한 집이다. 이름 없이 내려와 이름을 남겼다.',pagesAdd:1},recRep:'족보 서문에 "보따리 하나로 시작했다"고 적었다',recW:3}},
      {t:'"이웃 덕에 살았다"',fx:{jb:{preface:'우리는 이웃 덕에 살았다. 이 책의 절반은 그들의 이름이다.',pagesAdd:1},jAll:2}},
      {t:'"저마다의 길을 존중한다"',fx:{jb:{preface:'이 집 사람들은 저마다 제 길을 갔다. 그 길이 모두 이 책에 있다.',pagesAdd:1},affAll:2}}]},
 {id:'jb-r',slot:'집안',rep:true,y:[1960,2075],cond:()=>S.jb&&S.jb.kind!=='none',title:'족보 한 쪽',
  text:()=>'올해 있었던 일을 족보에 적어 넣을까? ('+jbBonText()+', '+S.jb.pages+'쪽)',
  ch:[{t:'정성껏 적는다 (2)',need:{money:2},fx:{money:-2,jb:{pagesAdd:1}}},{t:'나중에 몰아서 적는다',fx:{}}]}
];
/* 정이 돌려주는 것: 이웃 하나하나와의 사이 */
const NB_LEVELS=[[-20,'원수','뒤에서 험담을 해 해마다 체면이 깎인다'],[-9,'껄끄러운 사이','도움을 기대하기 어렵다'],[-2,'데면데면','—'],[3,'인사하는 사이','—'],
  [7,'가까운 이웃','경조사에 와 준다 · 장례 조문객'],[11,'단골·품앗이 사이','우리 가게 단골이 된다(장사 +4%) · 어르신을 살펴 준다'],[15,'식구 같은 이웃','위기 때 돈을 빌려준다 · 해마다 먹을거리를 나눈다 · 좋은 혼처를 소개한다']];
function nbLevel(j){let L=NB_LEVELS[0];for(const x of NB_LEVELS)if(j>=x[0])L=x;return {name:L[1],perk:L[2]}}
