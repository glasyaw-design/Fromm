/* ===================== 로그인 · 클라우드 저장 (Supabase) =====================
   config.js 에 window.JOKBO_CONFIG = {supabaseUrl, supabaseAnonKey} 가 있고
   supabase-js 가 불러와져 있을 때만 켜진다. 없으면 이 기기(localStorage)에만 저장한다. */
var CLOUD={on:false,sb:null,user:null,slots:null,busy:false,msg:'',err:'',mode:'login',lastAuto:0};
function cloudOn(){return !!(CLOUD&&CLOUD.on)}
const CLOUD_SLOTS=[0,1,2,3]; // 0번은 자동 저장 칸
function cloudInit(){
  const c=(typeof window!=='undefined'&&window.JOKBO_CONFIG)||null;
  if(!c||!c.supabaseUrl||!c.supabaseAnonKey||!window.supabase||!window.supabase.createClient)return;
  try{CLOUD.sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);CLOUD.on=true}catch(e){console.warn('cloud',e);return}
  CLOUD.sb.auth.getSession().then(({data})=>{CLOUD.user=data&&data.session?data.session.user:null;render()});
  CLOUD.sb.auth.onAuthStateChange((_ev,session)=>{CLOUD.user=session?session.user:null;CLOUD.slots=null;if(CLOUD.user&&UI.cloud)cloudList();render()});
}
function cloudSummary(){const r=rep();return (S.sur||'')+'씨네 '+S.curGen+'세대 · '+S.year+'년'+(r?' · 대표 '+r.name:'')}
async function cloudList(){
  if(!CLOUD.user)return;CLOUD.busy=true;render();
  const {data,error}=await CLOUD.sb.from('saves').select('slot,year,summary,updated_at').order('slot');
  CLOUD.busy=false;if(error){CLOUD.err='저장 목록을 못 불러왔어요: '+error.message}else{CLOUD.slots={};for(const r of data||[])CLOUD.slots[r.slot]=r}
  render();
}
async function cloudSave(slot,quiet){
  if(!CLOUD.user||!S||S.phase==='title')return;
  if(!quiet){CLOUD.busy=true;CLOUD.msg='';CLOUD.err='';render()}
  const row={user_id:CLOUD.user.id,slot,data:S,year:S.year,summary:cloudSummary(),updated_at:new Date().toISOString()};
  const {error}=await CLOUD.sb.from('saves').upsert(row,{onConflict:'user_id,slot'});
  if(quiet){if(error)console.warn('autosave',error.message);return}
  CLOUD.busy=false;if(error)CLOUD.err='저장하지 못했어요: '+error.message;else{CLOUD.msg=(slot===0?'자동 저장 칸':slot+'번 칸')+'에 저장했어요';await cloudList()}
  render();
}
async function cloudLoad(slot){
  if(!CLOUD.user)return;CLOUD.busy=true;CLOUD.err='';render();
  const {data,error}=await CLOUD.sb.from('saves').select('data').eq('slot',slot).maybeSingle();
  CLOUD.busy=false;
  if(error||!data){CLOUD.err='불러오지 못했어요'+(error?': '+error.message:'');render();return}
  S=data.data;try{PRO=buildPro()}catch(e){}try{migrate()}catch(e){console.warn(e)}
  if(S.phase==='title')S.phase='spring';UI.cloud=false;UI.open=null;CLOUD.msg='';render();
}
/* 해마다 봄이 되면 자동 저장 칸(0번)에 올린다 */
function cloudAuto(){if(!cloudOn()||!CLOUD.user||!S||S.phase!=='spring')return;if(CLOUD.lastAuto===S.year)return;CLOUD.lastAuto=S.year;cloudSave(0,true)}
async function cloudAuth(kind){
  const em=(document.getElementById('cl-email')||{}).value||'',pw=(document.getElementById('cl-pw')||{}).value||'';
  CLOUD.err='';CLOUD.msg='';
  if(!/\S+@\S+\.\S+/.test(em)){CLOUD.err='이메일을 확인해 주세요';render();return}
  if(pw.length<6){CLOUD.err='비밀번호는 6자 이상이에요';render();return}
  CLOUD.busy=true;render();
  const res=kind==='signup'?await CLOUD.sb.auth.signUp({email:em,password:pw}):await CLOUD.sb.auth.signInWithPassword({email:em,password:pw});
  CLOUD.busy=false;
  if(res.error){CLOUD.err=({'Invalid login credentials':'이메일이나 비밀번호가 맞지 않아요','User already registered':'이미 가입한 이메일이에요'})[res.error.message]||res.error.message}
  else if(kind==='signup'&&!res.data.session){CLOUD.msg='가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.'}
  else{CLOUD.user=res.data.user;cloudList()}
  render();
}
function cloudView(){
  const u=CLOUD.user;const sl=CLOUD.slots||{};
  const when=t=>{try{const d=new Date(t);return d.toLocaleDateString('ko-KR')+' '+d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
  if(!cloudOn())return `<div class="modal" role="dialog" aria-label="저장 파일"><div class="modal-box"><button class="btn close" data-act="cloudClose">닫기</button><h2>저장 파일</h2>
   ${CLOUD.err?`<div class="banner" style="border-color:var(--warn)">${esc(CLOUD.err)}</div>`:''}${CLOUD.msg?`<div class="banner">${esc(CLOUD.msg)}</div>`:''}${fileSaveView()}</div></div>`;
  return `<div class="modal" role="dialog" aria-label="로그인과 저장"><div class="modal-box"><button class="btn close" data-act="cloudClose">닫기</button>
   <h2>${u?'내 저장':CLOUD.mode==='signup'?'가입하기':'로그인'}</h2>
   ${CLOUD.err?`<div class="banner" style="border-color:var(--warn)">${esc(CLOUD.err)}</div>`:''}${CLOUD.msg?`<div class="banner">${esc(CLOUD.msg)}</div>`:''}
   ${!u?`<p class="small muted">로그인하면 다른 기기에서도 이어서 할 수 있어요. 로그인하지 않아도 이 기기에는 저장돼요.</p>
     <div class="cl-form"><label for="cl-email">이메일</label><input id="cl-email" type="email" autocomplete="email" inputmode="email">
     <label for="cl-pw">비밀번호</label><input id="cl-pw" type="password" autocomplete="${CLOUD.mode==='signup'?'new-password':'current-password'}" minlength="6"></div>
     <div class="actions"><button class="btn go" data-act="cloudAuth" data-a="${CLOUD.mode}" ${CLOUD.busy?'disabled':''}>${CLOUD.mode==='signup'?'가입하기':'로그인'}</button>
     <button class="btn" data-act="cloudMode">${CLOUD.mode==='signup'?'이미 계정이 있어요':'처음이에요 (가입)'}</button></div>`
   :`<p class="small">${esc(u.email||'')} <button class="btn small-btn" data-act="cloudOut" style="margin-left:8px">로그아웃</button></p>
     <p class="small muted">해마다 봄이 되면 '자동 저장' 칸에 저절로 올라가요. 1~3번 칸은 원할 때 직접 저장해요.</p>
     ${CLOUD.slots?`<div class="cl-slots">${CLOUD_SLOTS.map(n=>{const r=sl[n];return `<div class="as-row"><div><b>${n===0?'자동 저장':n+'번 칸'}</b><div class="small muted">${r?esc(r.summary||'')+' · '+when(r.updated_at):'비어 있음'}</div></div>
       <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${n>0&&S.phase!=='title'?`<button class="btn small-btn" data-act="cloudSave" data-a="${n}" ${CLOUD.busy?'disabled':''}>여기에 저장</button>`:''}${r?`<button class="btn small-btn" data-act="cloudLoad" data-a="${n}" ${CLOUD.busy?'disabled':''}>불러오기</button>`:''}</div></div>`}).join('')}</div>`:'<p class="small muted">불러오는 중…</p>'}`}
   <hr style="margin:18px 0;border:0;border-top:1px dashed var(--line)">${fileSaveView()}
  </div></div>`;
}
/* 로그인 없이 다른 기기로 옮기기: 저장 파일 내려받기 / 불러오기 */
function fileSaveView(){return `<div class="lbl">저장 파일로 옮기기</div>
  <p class="small muted">지금 판을 파일 하나로 내려받아 두었다가, 다른 기기나 다른 브라우저에서 그 파일을 불러오면 이어서 할 수 있어요. 게임은 이 기기에 저절로 저장되고 있어요.</p>
  <div class="actions" style="flex-wrap:wrap">${S.phase!=='title'?'<button class="btn go" data-act="fileSave">저장 파일 내려받기</button>':''}
  <label class="btn" for="sv-file" style="cursor:pointer">저장 파일 불러오기</label><input id="sv-file" type="file" accept=".jokbo,.json,application/json" style="position:absolute;opacity:0;width:1px;height:1px"></div>`}
function fileSave(){try{const r=rep();const name=(S.sur||'족보')+'씨네_'+S.year+'년.jokbo';const blob=new Blob([JSON.stringify(S)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  CLOUD.msg=name+' 파일을 내려받았어요';CLOUD.err=''}catch(e){CLOUD.err='내려받지 못했어요: '+e.message}}
function fileLoad(file){const rd=new FileReader();rd.onload=()=>{try{const o=JSON.parse(rd.result);if(!o||o.v!==5||!o.people)throw new Error('족보 없는 집 저장 파일이 아니에요');
    S=o;try{PRO=buildPro()}catch(e){}try{migrate()}catch(e){}if(S.phase==='title')S.phase='spring';UI.cloud=false;UI.open=null;CLOUD.msg='';CLOUD.err='';render()}
  catch(e){CLOUD.err='불러오지 못했어요: '+e.message;render()}};rd.readAsText(file)}
if(typeof document!=='undefined')document.addEventListener('change',e=>{if(e.target&&e.target.id==='sv-file'&&e.target.files&&e.target.files[0])fileLoad(e.target.files[0])});
if(typeof A!=='undefined')Object.assign(A,{
  cloudOpen(){UI.cloud=true;CLOUD.err='';CLOUD.msg='';if(CLOUD.user)cloudList()},
  cloudClose(){UI.cloud=false},
  fileSave(){fileSave()},
  cloudMode(){CLOUD.mode=CLOUD.mode==='signup'?'login':'signup';CLOUD.err='';CLOUD.msg=''},
  cloudAuth(k){cloudAuth(k)},
  cloudOut(){CLOUD.sb.auth.signOut();CLOUD.user=null;CLOUD.slots=null},
  cloudSave(n){cloudSave(+n)},
  cloudLoad(n){if(S.phase!=='title'&&!window.confirm?.('지금 하던 판 대신 저장한 판을 불러올까요?'))return;cloudLoad(+n)}
});
if(typeof IS_DOM!=='undefined'&&IS_DOM)setTimeout(cloudInit,0);
