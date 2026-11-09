// Netlify 빌드 때 환경 변수로 public/config.js 를 만든다.
// SUPABASE_URL, SUPABASE_ANON_KEY 가 없으면 로그인 없이(이 기기 저장만) 동작하는 빈 설정을 만든다.
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_ANON_KEY || '';
const cfg = url && key ? { supabaseUrl: url, supabaseAnonKey: key } : null;

const out = path.join(__dirname, '..', 'public', 'config.js');
fs.writeFileSync(out, '// 자동 생성 파일 (scripts/make-config.js)\nwindow.JOKBO_CONFIG = ' + JSON.stringify(cfg) + ';\n');
console.log(cfg ? 'config.js: 로그인·클라우드 저장 켬' : 'config.js: 환경 변수가 없어 로그인 없이 배포');
