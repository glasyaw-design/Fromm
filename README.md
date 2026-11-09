# 족보 없는 집

1950년, 보따리 하나로 시작한 피란민 가족. 셋째 세대가 모두 세상을 떠날 때까지 한국 현대사를 한 집안의 눈으로 건너가는 가문 경영 웹게임.

- 게임 본체는 `public/index.html` 한 장이다. 서버가 필요 없다.
- 로그인과 클라우드 저장은 [Supabase](https://supabase.com)(무료 요금제로 충분)를 쓴다.
- Supabase를 연결하지 않아도 게임은 돌아간다. 그때는 이 기기(브라우저)에만 저장된다.

---

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `public/` | Netlify가 그대로 올리는 폴더 |
| `public/index.html` | 게임 본체 (`build.py`로 만든다) |
| `public/og.png`, `favicon.svg`, `manifest.webmanifest` | 공유 미리보기 그림, 아이콘, 홈 화면 추가 설정 |
| `src/` | 게임 소스 조각 (규칙·카드·화면) |
| `build.py` | `src/`를 합쳐 `public/index.html`을 만든다 |
| `scripts/make-config.js` | Netlify 빌드 때 환경 변수로 `public/config.js`를 만든다 |
| `supabase/schema.sql` | 클라우드 저장 테이블과 보안 규칙 |
| `netlify.toml` | Netlify 빌드·헤더 설정 |

---

## 1. Supabase 준비 (로그인·저장, 약 5분)

1. [supabase.com](https://supabase.com)에 가입하고 **New project**를 만든다. 지역은 Northeast Asia (Seoul)를 고른다.
2. 왼쪽 메뉴 **SQL Editor**를 열고 `supabase/schema.sql` 내용을 붙여 넣은 뒤 **Run**을 누른다.
3. **Authentication → Sign In / Providers**에서 **Email**이 켜져 있는지 확인한다.
   - 가입 확인 메일 없이 바로 쓰게 하려면 **Confirm email**을 끈다.
   - 켜 두면 가입 뒤 메일의 링크를 눌러야 로그인할 수 있다.
4. **Authentication → URL Configuration**의 **Site URL**에 Netlify 주소를 넣는다. 예: `https://jokbo.netlify.app` (Netlify 배포 뒤에 넣어도 된다)
5. **Project Settings → API**(또는 **Data API**)에서 두 값을 복사해 둔다.
   - **Project URL** → `SUPABASE_URL`
   - **anon public** 키 → `SUPABASE_ANON_KEY`

> anon 키는 브라우저에 공개되는 키라 괜찮다. 저장은 `schema.sql`의 행 단위 보안(RLS) 규칙 때문에 각자 자기 것만 읽고 쓸 수 있다.
> **service_role 키는 절대 넣지 않는다.**

---

## 2. GitHub에 올리기

```bash
cd jokbo-deploy
git init
git add .
git commit -m "족보 없는 집 첫 배포"
git branch -M main
git remote add origin https://github.com/<내 아이디>/jokbo.git
git push -u origin main
```

GitHub 웹에서 빈 저장소(`jokbo`)를 먼저 만들어 둔다. README나 .gitignore는 체크하지 않는다.

---

## 3. Netlify에 연결하기

1. [app.netlify.com](https://app.netlify.com) → **Add new project → Import an existing project → GitHub**에서 저장소를 고른다.
2. 빌드 설정은 `netlify.toml`이 알아서 채운다.
   - Build command: `node scripts/make-config.js`
   - Publish directory: `public`
3. **Environment variables**에 다음 두 개를 넣는다. 사이트를 만든 뒤라면 **Site configuration → Environment variables**에서 넣는다.
   - `SUPABASE_URL` = 1-5에서 복사한 Project URL
   - `SUPABASE_ANON_KEY` = 1-5에서 복사한 anon public 키
4. **Deploy**를 누른다. 환경 변수를 나중에 넣었다면 **Deploys → Trigger deploy**로 다시 배포한다.
5. 나온 주소(예: `https://xxx.netlify.app`)를 Supabase **Site URL**에 넣는다(1-4).
6. **Site configuration → Change site name**에서 주소를 바꿀 수 있다.

이제 `main`에 push할 때마다 Netlify가 자동으로 다시 배포한다.

---

## 4. 게임을 고친 뒤

```bash
# src/ 안의 파일을 고친 다음
python3 build.py                   # public/index.html 다시 만들기
node src/validate.js src/cards_A.js   # (선택) 카드 파일 검사
git add . && git commit -m "고친 내용" && git push
```

`public/index.html`도 함께 커밋해야 한다. Netlify는 파이썬 빌드를 돌리지 않는다.

---

## 저장 방식

| 칸 | 언제 저장되나 |
|---|---|
| 이 기기 저장 | 화면이 바뀔 때마다 브라우저에 저장. 해마다 봄에 백업 한 벌을 따로 둔다. |
| 클라우드 자동 저장 (0번 칸) | 로그인해 있으면 해마다 봄에 자동으로 올라간다. |
| 클라우드 1~3번 칸 | '저장' 버튼에서 원할 때 직접 저장하고 불러온다. 다른 기기에서도 이어 할 수 있다. |

---

## 문제가 생기면

| 증상 | 확인할 것 |
|---|---|
| 로그인 버튼이 안 보인다 | Netlify 환경 변수 두 개가 들어갔는지, 넣은 뒤 다시 배포했는지 확인한다. 배포 로그에 `config.js: 로그인·클라우드 저장 켬`이 찍혀야 한다. |
| 저장할 때 `permission denied`나 `relation "saves" does not exist`가 뜬다 | `schema.sql`을 Run했는지 확인한다. |
| 가입했는데 로그인이 안 된다 | 가입 확인 메일의 링크를 눌렀는지 확인한다. 아니면 **Confirm email**을 끈다. |
| 메일 링크가 localhost로 간다 | Supabase **Site URL**을 Netlify 주소로 바꾼다. |
