/* 그래픽은 시뮬레이션 난수를 소비하지 않는다. 인물 ID마다 외형을 고정한다. */
function portraitView(p){return `<canvas class="pixel-portrait" width="32" height="40" data-person="${p.id}" role="img" aria-label="${esc(p.name)}의 도트 초상"></canvas>`}
function sceneView(title=false){const y=S.phase==='prologue'?String(PRO[Math.min(S.pro,PRO.length-1)].y).replace(/년.*$/,''):S.year;const season=seasonOf();return `<figure class="pixel-scene"><canvas width="576" height="${title?196:128}" data-scene role="img" aria-label="${y}년 ${esc(placeName())}의 ${season||'봄'} 풍경"></canvas><div class="scene-label">${esc(placeName())} · ${y}년${season?' / '+season:''}</div><figcaption class="scene-foot"><span>${y<1960?'보따리 하나에서 시작된 우리 집':y<1980?'골목마다 삶이 자라는 동네':'달라진 풍경, 이어지는 우리 가족'}</span><span>가진 것은 적어도, 남길 이야기는 있다.</span></figcaption></figure>`}
function pxPainter(c){const g=c.getContext('2d');g.imageSmoothingEnabled=false;return {g,r:(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}}}
function paintPerson(c,p){const {g,r}=pxPainter(c),a=Math.max(0,age(p)),id=p.id,skin=['#d9a16e','#e4b585','#ca9467'][id%3],hair=a>=57?'#b7b4a0':'#34352d',cloth=['#526c70','#a77560','#788459','#666780','#856347'][id%5];
 r(0,0,32,40,'#c4c8a4');r(2,2,28,36,'#dce0be');r(3,30,26,8,'#a9b18c');r(6,37,21,2,'#879476');
 const by=a<13?4:0;g.save();g.translate(0,by);
 r(7,25,18,15,cloth);r(5,29,22,11,cloth);r(7,27,3,13,'#364d49');r(22,29,3,11,'#364d49');r(13,21,6,6,skin);r(13,25,6,3,'#c28c62');r(10,27,4,3,'#f1e3c0');r(18,27,3,3,'#f1e3c0');r(14,29,4,2,'#ede0be');r(16,31,1,9,'#b8aa88');
 r(9,9,14,13,hair);r(7,12,18,9,skin);r(10,9,12,15,skin);r(12,22,8,3,skin);r(10,9,12,4,hair);r(8,11,3,7,hair);r(22,11,2,8,hair);r(10,7,11,3,hair);r(12,6,7,2,hair);
 if(p.sex==='f'){r(7,11,3,13,hair);r(22,11,3,13,hair);r(5+(id%2)*19,22,3,4,hair);r(9,9,5,5,hair);r(14,10,4,3,hair)}else {r(18,10,5,5,hair);if(a>=40)r(11,23,10,1,'#9f744f')}
 r(11,16,2,2,'#373c31');r(19,16,2,2,'#373c31');r(16,18,1,3,'#b17a52');r(14,22,5,1,'#965f44');r(10,20,3,1,'#d09268');r(20,20,2,1,'#d09268');
 if(a>=60){r(10,18,3,1,'#ab845e');r(19,18,3,1,'#ab845e');r(12,24,2,1,'#ab845e')}
 if(p.edu>=2){r(10,15,5,4,'#494a3e');r(18,15,5,4,'#494a3e');r(11,16,3,2,skin);r(19,16,3,2,skin);r(15,16,3,1,'#494a3e')}
 if(p.grudge>=5){r(11,14,3,1,hair);r(18,14,3,1,hair);r(14,22,5,1,'#673f2f')}
 g.restore();
}
function houseArt(r,x,y,w=46,h=28,type='shack',roof='#786554'){
 r(x+3,y+h+2,w+2,3,'#56614a');r(x,y+8,w,h-8,'#c6b38a');r(x+2,y+10,w-4,h-10,'#decea7');r(x,y+h-3,w,3,'#a28a62');
 for(let i=3;i<w-2;i+=8)r(x+i,y+10,1,h-13,'#bcaa83');
 r(x-3,y+5,w+6,6,roof);r(x,y+2,w,4,roof);r(x+6,y,w-12,3,roof);for(let i=0;i<w;i+=6)r(x+i,y+4,2,5,'#4c534b');
 r(x+Math.floor(w*.43),y+h-17,10,17,'#625b47');r(x+Math.floor(w*.43)+7,y+h-10,1,2,'#d6c093');r(x+5,y+14,9,8,'#586e67');r(x+6,y+15,7,2,'#a1b4a0');r(x+9,y+14,1,8,'#d3bb8b');
 if(type==='own'){r(x+w-14,y+13,9,9,'#657c6d');r(x+w-10,y+13,1,9,'#e4d0a3');r(x-1,y+h, w+2,2,'#76654d')}
 r(x+w-8,y-5,5,9,'#756e5c');r(x+w-9,y-6,7,2,'#575c4c');
}
function treeArt(r,x,y,season=0,scale=1){const q=(a,b,w,h,c)=>r(x+a*scale,y+b*scale,w*scale,h*scale),leaf=season===2?'#b98042':season===3?'#8d9e8a':'#5e7950';q(8,18,4,16,'#7e6e4b');q(10,19,2,14,'#a19262');q(2,9,19,13,leaf);q(5,4,14,7,leaf);q(8,1,8,4,leaf);q(0,13,24,5,leaf);q(5,6,8,5,season===2?'#d6ab5f':season===3?'#e4e2c7':'#8d9e65');q(3,12,6,4,season===2?'#c99548':'#728d58');if(season===0){q(13,8,3,3,'#e4c3a0');q(5,15,3,2,'#dfbd9c')}if(season===3)q(3,9,16,3,'#f0e9d2')}
function paintScene(c){const {g,r}=pxPainter(c),H=c.height,Y=S.phase==='prologue'?PRO[S.pro].y:S.year,season={spring:0,summer:1,autumn:2,seollal:3}[S.phase]??0,winter=season===3,ground=winter?'#d9d9be':season===2?'#b9b07e':'#aab78a';
 r(0,0,576,H,winter?'#a9bab2':'#b9cbb4');r(0,0,576,18,'#aabfb0');r(452,18,20,20,'#eee1a5');r(448,22,28,12,'#eee1a5');
 for(let k=0;k<7;k++){const x=k*97-30,y=H*.24+((k*17)%19);r(x,y+12,115,H-y,'#94a98b');r(x+18,y+3,77,20,'#94a98b');r(x+32,y-5,46,18,'#94a98b')}
 for(let k=0;k<8;k++){const x=k*83-20,y=H*.42+((k*11)%14);r(x,y,85,H-y,'#7e9478');r(x+15,y-10,49,15,'#7e9478');r(x+27,y-17,26,12,'#7e9478')}
 const floor=Math.round(H*.63);r(0,floor,576,H-floor,ground);r(0,H-24,576,20,'#c4b58c');r(0,H-24,576,2,'#dcd0a5');r(0,H-4,576,4,'#92a27a');
 for(let i=0;i<230;i++){const x=(i*79+11)%576,y=floor+(i*37)%(H-floor);if(y<H-26)r(x,y,2+i%3,1,winter?'#ece8d3':i%3?'#95a574':'#c0c795')}
 if(Y>=1980){for(let k=0;k<4;k++){const x=300+k*44,y=floor-43-k%2*12;r(x,y,35,floor-y,'#a1afa0');r(x+2,y+2,31,3,'#d3d5b8');for(let j=0;j<5;j++)for(let i=0;i<3;i++)r(x+5+i*10,y+9+j*9,5,5,'#627e76')}}
 else if(Y>=1960){r(365,floor-22,75,24,'#a4a68b');r(360,floor-26,84,6,'#6a7770');for(let i=0;i<6;i++)r(371+i*11,floor-15,6,8,'#5d7870');r(430,floor-43,7,30,'#7b7f6c')}
 houseArt(r,38,floor-14,58,36,'shack','#77796a');houseArt(r,141,floor-26,68,44,S.house!=='shack'?'own':'shack',S.house!=='shack'?'#496765':'#7a6951');houseArt(r,258,floor-10,49,30,'shack','#8c7962');houseArt(r,455,floor-9,59,33,'shack','#66766c');
 if(Y>=1960){houseArt(r,339,floor+1,58,28,'own','#8f674d');for(let i=0;i<7;i++)r(336+i*9,floor+10,9,6,i%2?'#eee0ab':'#9c5540');r(337,floor+16,65,2,'#674d39')}
 treeArt(r,10,floor-19,season,1.5);treeArt(r,223,floor-19,season,1.3);treeArt(r,525,floor-21,season,1.5);treeArt(r,553,floor-2,season,.8);
 // 빨랫줄과 장독대
 r(103,floor-6,1,27,'#776b4b');r(135,floor-6,1,27,'#776b4b');r(103,floor-4,33,1,'#716e51');r(109,floor-3,7,10,'#eee6cc');r(120,floor-3,7,9,'#ae8570');
 for(let k=0;k<3;k++){r(207+k*8,floor+14,6,8,'#77654a');r(206+k*8,floor+13,8,2,'#514e3b');r(208+k*8,floor+16,2,4,'#98815b')}
 // 담장, 전봇대, 멀리 보이는 전선
 for(let i=0;i<12;i++){r(323+i*8,H-38,3,13,'#887e58')}r(321,H-35,95,2,'#aa956b');r(321,H-29,95,2,'#aa956b');
 r(430,26,3,H-39,'#6d7259');r(422,30,19,2,'#5b6652');r(424,26,2,6,'#d6d5af');r(438,26,2,6,'#d6d5af');g.strokeStyle='#6e7c64';g.lineWidth=1;g.beginPath();g.moveTo(0,22);g.quadraticCurveTo(210,48,432,30);g.quadraticCurveTo(500,37,576,28);g.stroke();
 const folks=S.people.filter(p=>p.alive&&p.status==='home').slice(0,8);folks.forEach((p,i)=>{const x=118+i*28,y=H-26;const clothes=['#5c7773','#9c7460','#657c52','#b3935d'][p.id%4];r(x,y-2,7,2,'#8c936a');r(x+1,y-16,5,5,'#d8ae7d');r(x+1,y-18,5,3,'#454b3c');r(x,y-11,7,8,clothes);r(x+1,y-3,2,4,'#484d3d');r(x+5,y-3,2,4,'#484d3d')});
 // 바닥의 작은 돌과 풀
 for(let i=0;i<38;i++)r((i*43)%576,H-20+(i*7)%13,2+i%3,1,'#ad9d78');
 if(winter)for(let i=0;i<65;i++)r((i*71)%576,8+(i*31)%(H-12),2,2,'#f4efda');
}
function paintTile(c){const {r}=pxPainter(c),t=c.dataset.tile,st=S.year<1960?0:S.year<1980?1:2;r(0,0,32,32,'#aab58a');for(let i=0;i<12;i++)r((i*17)%31,(i*11)%31,2,1,'#92a076');if(t==='='){r(0,0,32,32,'#c4b68e');r(0,0,32,2,'#d7c99f');r(0,30,32,2,'#9ea27a');for(let i=0;i<4;i++)r(3+i*8,15,3,1,'#ac9f7b');return}if(t==='.'){treeArt(r,8,3, S.phase==='autumn'?2:S.phase==='seollal'?3:1,.7);return}
 if('OTPGYDJ'.includes(t)){houseArt(r,4,7,24,19,t==='O'&&S.house!=='shack'?'own':'shack',t==='O'?'#a75c44':'#69786a');return}
 if(t==='W'){r(7,16,18,10,'#7c897d');r(10,17,12,5,'#3c625d');r(7,15,18,3,'#c7c8a5');r(8,6,2,12,'#807151');r(22,6,2,12,'#807151');r(5,5,22,3,'#6c7359');return}
 if(t==='C'){houseArt(r,6,12,21,17,'own','#786e59');r(14,1,3,12,'#7b6a4e');r(11,4,9,3,'#7b6a4e');return}
 if(t==='M'){r(4,14,24,13,'#b79462');for(let i=0;i<4;i++)r(2+i*7,9,7,7,i%2?'#e6d4a0':'#a35d44');r(2,16,28,2,'#715b3e');r(7,23,19,4,'#766647');r(9,20,4,3,'#c3a750');r(17,20,5,3,'#7b8d4d');return}
 if(t==='F'){r(3,14,26,14,'#999b7d');r(5,3,5,13,'#7d8068');r(3,2,8,3,'#626b58');r(16,10,13,5,'#727d69');for(let i=0;i<3;i++)r(6+i*8,18,4,5,'#506b63');return}
 r(5,st===2?5:10,23,23,'#c7c4a0');r(3,st===2?3:8,27,4,'#6c7d6d');for(let y=11;y<26;y+=7)for(let x=9;x<27;x+=7)r(x,y,4,4,'#5c7b72');r(14,24,6,7,'#797655');
}
function paintIcon(c){const {r}=pxPainter(c),t=c.dataset.icon;r(0,0,32,32,'#ded5b8');if(t.includes('가족')){r(7,12,18,15,'#c9b087');r(4,11,24,4,'#8e7154');r(8,7,16,5,'#9c7956');r(12,4,8,4,'#9c7956');r(14,19,5,8,'#705a42');r(9,17,4,4,'#728778');r(20,17,3,4,'#728778')}else if(t==='시대'){r(8,5,18,23,'#9d7b4c');r(6,3,18,23,'#f5e6b6');r(9,7,12,3,'#9d5a3d');for(let i=0;i<4;i++)r(9,13+i*3,12-i%2*4,1,'#9e8b60')}else{treeArt(r,4,0,2,.8);houseArt(r,15,13,13,14,'own','#596e5c')}}
function paintPixels(){document.querySelectorAll('canvas[data-person]').forEach(c=>{const p=P(+c.dataset.person);if(p)paintPerson(c,p)});document.querySelectorAll('canvas[data-scene]').forEach(paintScene);document.querySelectorAll('canvas[data-tile]').forEach(paintTile);document.querySelectorAll('canvas[data-icon]').forEach(paintIcon)}

