// 사용법: node validate.js cards_A.js
const fs=require('fs'),vm=require('vm');
const file=process.argv[2];const src=fs.readFileSync(file,'utf8');
const m=src.match(/const\s+(CARDS_\w+)\s*=/);if(!m){console.log('ERROR: const CARDS_X = [...] 형식이 아님');process.exit(1)}
const people=[];const ctx={S:{year:1970,money:50,face:30,house:'shack',tradeY:5,craftY:3,tradeSt:1,craftSt:1,land:0,repu:50,flags:{},curGen:1,town:'seoul',people,biz:'food',lands:[],chains:[]},
  age:p=>30,rep:()=>({id:1,name:'갑수',sex:'m',tal:{},pers:{},f:{}}),P:()=>null,homeAlive:()=>[],Math,console,won:x=>x+'단위',cm:x=>x,ms:()=>1,S_biz:0};
vm.createContext(ctx);
try{vm.runInContext(src+`;this.__C=${m[1]};`,ctx)}catch(e){console.log('ERROR: 문법 오류',e.message);process.exit(1)}
const C=ctx.__C;const errs=[];
const SLOTS=['가족','자녀','동네','시대','집안','공통'];
const WHO=['rep','spouse','adult','elder','inlaw','kid','teen','young','single','student','adultStudy','adultKid','grandkid','worker','any'];
const NB=['any','maxj','minj','tobagi','pirani','gwabu','yangban','smith','jumak'];
const FX=['money','face','aff','grudge','affAll','nbj','jAll','ledger','talent','pers','gap','frag','tradeY','craftY','house','flag','sflag','mod','mods','chain','awayYears','leave','marry','official','edu','die','rec','recW','recRep','rnd','land','repu','timeDebt','heal','sick','dream','rentY','run','why','army','jb','comeHome','reconcile','recW'];
const TAL=['셈','손재주','글','말솜씨','몸','끈기','눈썰미','마음씨'];const PERS=['성실','사교','모험','온화','고집'];
const ids=new Set();
function chkFx(fx,where,card){
  if(typeof fx==='function'){try{fx={subj:{name:'갑수',tal:{글:5},pers:{}},nb:{j:3}}?fx({subj:{name:'갑수',tal:{글:5,셈:5},pers:{},f:{}},nb:{j:3,sur:'박'}}):fx}catch(e){errs.push(where+': fx 함수 실행 오류 '+e.message);return}}
  if(!fx||typeof fx!=='object'){errs.push(where+': fx 없음');return}
  for(const k in fx){if(!FX.includes(k))errs.push(where+': 모르는 fx 키 '+k);}
  if(fx.talent)for(const k in fx.talent)if(!TAL.includes(k))errs.push(where+': 모르는 능력치 '+k);
  if(fx.pers)for(const k in fx.pers)if(!PERS.includes(k))errs.push(where+': 모르는 성격 '+k);
  if(fx.gap)for(const k in fx.gap)if(!['d','f','s'].includes(k))errs.push(where+': gap 키는 d,f,s');
  if((fx.aff||fx.grudge||fx.talent||fx.pers||fx.sflag||fx.awayYears||fx.leave||fx.marry||fx.die||fx.official||fx.edu||fx.heal||fx.sick)&&!card.who)errs.push(where+': 사람 효과인데 카드에 who 없음');
  if((fx.nbj||fx.ledger)&&!card.nb)errs.push(where+': 이웃 효과인데 카드에 nb 없음');
  if(fx.chain&&!fx.chain.id)errs.push(where+': chain.id 없음');
  if(fx.rnd){let s=0;for(const o of fx.rnd){s+=o.p;if(!o.msg)errs.push(where+': rnd에 msg 없음');chkFx(o.fx,where+' rnd',card)}if(s>1.0001)errs.push(where+': rnd 확률 합이 1 초과')}
  if(fx.marry&&!['good','mid','plain'].includes(fx.marry))errs.push(where+': marry는 good|mid|plain');
}
const chainIds=new Set();
for(const c of C){
  const w='['+c.id+']';
  if(!c.id)errs.push('id 없는 카드');if(ids.has(c.id))errs.push(w+' id 중복');ids.add(c.id);
  if(!SLOTS.includes(c.slot))errs.push(w+' slot 잘못: '+c.slot);
  if(!c.chainOnly){if(!Array.isArray(c.y)||c.y.length!==2||c.y[0]<1950||c.y[1]>2110||c.y[0]>c.y[1])errs.push(w+' y 범위 잘못')}
  if(c.who&&!WHO.includes(c.who))errs.push(w+' who 잘못: '+c.who);
  if(c.nb&&!NB.includes(c.nb))errs.push(w+' nb 잘못: '+c.nb);
  const txt=(typeof c.title==='function'?c.title({}):c.title)+' '+(typeof c.text==='function'?c.text({}):c.text)+' '+c.ch.map(x=>x.t).join(' ');
  if(/\{subj/.test(txt)&&!c.who)errs.push(w+' {subj} 썼는데 who 없음');
  if(/\{nb/.test(txt)&&!c.nb)errs.push(w+' {nb} 썼는데 nb 없음');
  const toks=txt.match(/\{[^}]*\}/g)||[];for(const t of toks)if(!/^\{(subj|nb|nbHead|fam|rep|year)(:[^}]+)?\}$/.test(t))errs.push(w+' 모르는 토큰 '+t);
  if(!Array.isArray(c.ch)||c.ch.length<2||c.ch.length>4)errs.push(w+' 선택지는 2~4개');
  else{
    if(c.ch.every(x=>x.need))errs.push(w+' 돈 없이 고를 수 있는 선택지가 하나는 있어야 함');
    c.ch.forEach((x,i)=>{if(!x.t)errs.push(w+' 선택지 문구 없음');
      if(x.need){const mm=String(x.t).match(/\((\d+)\)/);if(x.need.money&&(!mm||+mm[1]!==x.need.money))errs.push(w+' 선택지 '+i+': 문구 괄호 숫자와 need.money 불일치')}
      chkFx(x.fx,w+' 선택지 '+i,c);if(x.fx&&x.fx.chain)chainIds.add(x.fx.chain.id)})
  }
}
for(const id of chainIds)if(!ids.has(id))errs.push('chain 대상 카드 없음: '+id+' (같은 파일에 chainOnly 카드로 만들 것. 공용 연쇄 id는 bankson, repay, guar, gye, oesang, partner, landresult만 허용)');
const allowed=['bankson','repay','guar','gye','oesang','partner','landresult'];
for(let i=errs.length-1;i>=0;i--)if(allowed.some(a=>errs[i]==='chain 대상 카드 없음: '+a+' (같은 파일에 chainOnly 카드로 만들 것. 공용 연쇄 id는 bankson, repay, guar, gye, oesang, partner, landresult만 허용)'))errs.splice(i,1);
const bySlot={};for(const c of C)bySlot[c.slot]=(bySlot[c.slot]||0)+1;
console.log('카드',C.length,'장',JSON.stringify(bySlot),'major',C.filter(c=>c.major).length);
if(errs.length){console.log('오류 '+errs.length+'개:\n'+errs.slice(0,60).join('\n'));process.exit(1)}console.log('OK');
