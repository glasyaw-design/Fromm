"""《족보 없는 집》 빌드 스크립트

src/ 의 조각 파일을 합쳐 public/index.html 한 장을 만든다.
    python3 build.py

카드나 게임 규칙을 고친 뒤에는 이 스크립트를 다시 돌리고 public/index.html 을 커밋한다.
(Netlify 는 public/ 을 그대로 올리고, config.js 만 환경 변수로 만든다.)
"""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'public', 'index.html')

CARD_FILES = ['cards_0.js', 'cards_A.js', 'cards_B.js', 'cards_C.js', 'cards_D.js', 'cards_E.js',
              'cards_G.js', 'cards_H.js', 'cards_I.js', 'cards_J.js']
PARTS = ['core.js', 'land.js', 'jokbo_story.js', 'eras.js'] + \
        [f for f in CARD_FILES if os.path.exists(os.path.join(SRC, f))] + \
        ['pixel.js', 'views.js', 'cloud.js']

# 배포판 머리말: 공유 미리보기, 아이콘, 로그인용 스크립트
DEPLOY_HEAD = '''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>족보 없는 집</title>
<meta name="description" content="1950년 보따리 하나로 시작한 피란민 가족. 셋째 세대가 떠날 때까지 한국 현대사를 한 집안의 눈으로 건너가는 가문 경영 게임.">
<meta name="theme-color" content="#efe6cf">
<meta property="og:type" content="website">
<meta property="og:title" content="족보 없는 집">
<meta property="og:description" content="족보는 물려받는 게 아니라, 써 내려가는 것.">
<meta property="og:image" content="/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<script src="/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js" defer></script>
</head>
<body>
'''


def read(name):
    with open(os.path.join(SRC, name), encoding='utf8') as f:
        return f.read()


def main():
    css = read('fonts.css') + read('style.css')
    js = ''
    for f in PARTS:
        js += '\n/* ---- ' + f + ' ---- */\n' + read(f)
    names = [f.split('.')[0].upper().replace('CARDS_', '') for f in PARTS if f.startswith('cards_')]
    reg = '\nregisterCards(ERA_CARDS);registerCards(KIN_CARDS);registerCards(JB_CARDS);registerCards(LAND_CARDS);' + \
          ''.join(f'registerCards(CARDS_{n});' for n in names) + '\n'
    i = js.index('/* ---- pixel.js ---- */')
    js = js[:i] + reg + js[i:]
    # supabase 스크립트가 defer 라서, 게임 본체는 문서를 다 읽은 뒤 시작한다
    js = js.replace('if(typeof IS_DOM!==\'undefined\'&&IS_DOM)setTimeout(cloudInit,0);',
                    'if(typeof IS_DOM!==\'undefined\'&&IS_DOM)window.addEventListener(\'load\',cloudInit);')
    out = DEPLOY_HEAD + '<style>' + css + '</style>\n<div class="wrap" id="app"></div>\n<script>' + js + '\n</script>\n</body>\n</html>\n'
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf8') as f:
        f.write(out)
    print('public/index.html', round(len(out.encode('utf8')) / 1024), 'KB,', len(PARTS), 'parts')


if __name__ == '__main__':
    main()
