// Procedural pixel-art terrain. All layers are Phaser objects, not one flat background.
import {WORLD_WIDTH as W, WORLD_HEIGHT as H, TRAIL_POINTS, distanceToTrail} from './WorldGeometry.js';

const COLOR={
 grass:['#3c5940','#405d42','#3f5b41','#425e43','#3b573e'],
 path:['#977a51','#a78c61','#b69b72','#897148'],
 river:['#254e57','#2e6670','#3d7d83','#459098'],
 leaf:['#183b35','#235246','#2e6252','#477457','#68835c','#93a36a','#b5ac69'],
 wood:['#3f3025','#6c4930','#9a6841','#c29b69']
};
let seed=117926;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const pick=a=>a[Math.floor(random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function sprite(scene,key,w,h,painter){
 if(scene.textures.exists(key))return;
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 painter(ctx,w,h);scene.textures.addCanvas(key,canvas);
}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function waterX(y){const d=y-540;return 1165+Math.sin(d*.006)*42+Math.sin(d*.019)*11}
function safeFromLandmark(x,y){
 return [[290,460,125],[514,465,134],[681,515,98],[790,543,92],
 [976,526,92],[1095,548,110],[1309,650,113],[1389,821,100],
 [880,360,155],[300,600,100]].some(([a,b,r])=>Math.hypot(x-a,y-b)<r);
}
function treeTexture(scene,variant){
 const key='forest-tree-'+variant;
 sprite(scene,key,116,148,(c)=>{
   const shadeGroups=[
    ['#183a37','#234a43','#315d4d','#4b7359','#6c8767','#829b78','#9cae8d'],
    ['#2b3e31','#39573e','#58764b','#7d9057','#a0a467','#c3b775','#d6c77f'],
    ['#173b3e','#225451','#32625c','#477c70','#668a76','#86a28b','#a3ad91']
   ];
   const shades=shadeGroups[variant%shadeGroups.length];
   rect(c,46,72,27,67,'#202b24');rect(c,49,74,21,62,'#765039');rect(c,54,83,12,53,'#976a45');
   for(let i=0;i<17;i++)rect(c,53+(i%3)*5,76+i*3,3,2,i%2?'#95734d':'#45372b');
   // Irregular leaf silhouette composed of clustered 8px color blocks.
   const rng=()=>random();
   const crowns=[
    [[28,76,25],[75,69,27],[55,42,33],[27,35,20],[86,38,19],[56,70,32],[45,20,20]],
    [[28,77,27],[78,77,27],[54,47,37],[17,54,21],[90,55,23],[58,22,22]],
    [[31,64,29],[77,57,24],[58,28,32],[19,39,18],[86,30,21],[56,79,28]],
    [[30,73,30],[79,65,25],[55,42,36],[27,27,23],[89,36,17],[57,79,28]]
   ];
   const blobs=crowns[Math.floor(variant/3)%crowns.length];
   blobs.forEach(([cx,cy,r],bi)=>{
     for(let y=-r;y<r;y+=5){
       for(let x=-r;x<r;x+=5){
         const d=(x*x+y*y)/(r*r);
         if(d>0.97-(rng()*.22))continue;
         const shade=clamp(Math.floor((cy+y)/18)-1+Math.floor(rng()*2),0,shades.length-1);
         rect(c,cx+x,cy+y,6,6,shades[shade]);
       }
     }
   });
   for(let i=0;i<80;i++){
     const x=14+rng()*86,y=8+rng()*96;
     const d=Math.hypot((x-57)/1.2,(y-53));
     if(d>52)continue;
     rect(c,x,y,2+rng()*4,2+rng()*3,pick(['#8d9f67','#aab17c','#d3bc79','#2c5144']));
   }
   for(let i=0;i<8;i++)rect(c,48+i*3,135,5,3,'#5d4935');
 });
 return key;
}
function makeSmallTextures(scene){
 sprite(scene,'forest-stone',40,27,c=>{
   rect(c,4,16,33,8,'#263e36');rect(c,7,8,27,12,'#64756a');rect(c,12,5,18,7,'#93a093');
   rect(c,16,9,10,3,'#bec4ab');rect(c,7,18,24,4,'#3f5b4b');
 });
 sprite(scene,'forest-bush',52,34,c=>{
   rect(c,2,21,48,10,'#183f34');
   for(const [x,y,r] of [[13,17,13],[27,11,15],[42,20,11]]){
     rect(c,x-r/2,y-r/2,r,r,'#285947');rect(c,x-r/3,y-r/3,r*.8,r*.55,'#527a54');
     rect(c,x-4,y-5,7,3,'#92a56a');
   }
 });
 sprite(scene,'forest-flower',17,21,c=>{
   rect(c,7,8,3,12,'#537a47');
   for(const [x,y] of [[3,5],[10,4],[5,11],[12,10]])rect(c,x,y,5,5,'#d9a5a1');
   rect(c,7,7,4,4,'#e7cf82');
 });
 sprite(scene,'forest-cabin',172,150,c=>{
   rect(c,19,58,132,87,'#332b25');rect(c,25,67,120,69,'#7b5236');
   for(let y=72;y<130;y+=14){rect(c,24,y,124,3,'#4d3527');rect(c,24,y+5,124,2,'#987048')}
   rect(c,10,59,152,14,'#4e362b');rect(c,19,45,132,14,'#634633');
   rect(c,35,27,102,18,'#79523a');rect(c,50,12,71,17,'#5b4332');
   rect(c,64,8,41,7,'#a47a4b');
   for(let x=22;x<155;x+=12){rect(c,x,45+((x/12)%2)*8,10,8,'#a06a43');rect(c,x,58,9,5,'#b18b5e')}
   rect(c,73,97,35,47,'#342b25');rect(c,77,101,26,43,'#58402d');
   rect(c,93,119,3,4,'#efd18a');
   for(const x of [35,121]){rect(c,x,94,18,24,'#302e28');rect(c,x+3,98,12,14,'#c1ad71');rect(c,x+8,98,2,14,'#765534')}
 });
 sprite(scene,'forest-ruin',116,116,c=>{
   for(const [x,y,w,h] of [[2,47,24,63],[84,35,24,74],[17,87,75,19]]){
     rect(c,x+4,y+5,w,h,'#263c36');rect(c,x,y,w,h,'#6e8071');rect(c,x+4,y+4,w-8,7,'#a4b29a');
     for(let i=1;i<4;i++)rect(c,x+5,y+9+i*12,w-11,2,'#43594d');
   }
   rect(c,29,79,49,23,'#344d43');rect(c,37,81,33,5,'#aaba99');
 });
 sprite(scene,'forest-fire',35,50,c=>{
   rect(c,3,38,29,7,'#493627');rect(c,8,31,5,15,'#98714b');rect(c,21,31,5,15,'#6b503a');
   rect(c,13,18,10,22,'#edb753');rect(c,15,9,6,27,'#e47f44');rect(c,17,22,4,11,'#f9d98b');
 });
}
function drawTerrain(scene){
 // Desenho das camadas de solo em canvas, enquanto obstáculos e copas permanecem
 // como objetos independentes do Phaser (colisão e ordenação por profundidade).
 sprite(scene,'forest-ground',W,H,c=>{
   rect(c,0,0,W,H,'#3c5940');
   for(let y=0;y<H;y+=32)for(let x=0;x<W;x+=32){
     const base=random();
     rect(c,x,y,32,32,base<.72?'#3e5b41':pick(COLOR.grass));
     for(let i=0;i<4;i++){
       const px=x+random()*31,py=y+random()*31;
       rect(c,px,py,2+random()*5,2+random()*2,pick(['#35513b','#54734b','#66835a']));
     }
   }
   // Trilha contínua, com margens orgânicas e detalhes concentrados nas bordas.
   c.lineJoin='round';c.lineCap='round';
   const trace=(width,color)=>{
     c.strokeStyle=color;c.lineWidth=width;c.beginPath();
     c.moveTo(TRAIL_POINTS[0][0],TRAIL_POINTS[0][1]);
     for(let i=1;i<TRAIL_POINTS.length;i++)c.lineTo(TRAIL_POINTS[i][0],TRAIL_POINTS[i][1]);
     c.stroke();
   };
   trace(132,'#5b6844');trace(118,'#8b734e');trace(106,'#a88e65');
   for(const [cx,cy,rx,ry] of [[305,470,128,82],[530,468,108,71],[880,430,120,76],[1320,690,118,84]]){
     c.fillStyle='#a78d64';c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);c.fill();
   }
   for(let i=0;i<2800;i++){
     const x=random()*W,y=random()*H,d=distanceToTrail(x,y);
     if(d>74)continue;
     const nearEdge=d>49;
     const color=nearEdge?pick(['#527347','#4b6946','#937e55']):pick(['#b69a70','#9a815b','#c2a67c']);
     rect(c,x,y,2+random()*6,1+random()*3,color);
   }
   // Margem sinuosa, água profunda e pequenas áreas de espuma.
   for(let y=0;y<H;y+=4){
     const x=waterX(y),width=105+Math.sin(y*.028)*9;
     rect(c,x-width/2-10,y,width+20,5,'#27483e');
     rect(c,x-width/2-5,y,width+10,5,'#182f36');
     rect(c,x-width/2+4,y,width-8,5,pick(['#2b5663','#326a73','#34737d']));
     if(y%20===0)rect(c,x-22+random()*40,y+1,9+random()*13,2,'#7db2b0');
     rect(c,x-width/2-13,y,4,5,'#64815e');
     rect(c,x+width/2+9,y,4,5,'#64815e');
   }
 });
 scene.add.image(0,0,'forest-ground').setOrigin(0).setDepth(0);
}
export function buildWorld(scene){
 seed=117926;
 makeSmallTextures(scene);
 for(let i=0;i<12;i++)treeTexture(scene,i);
 drawTerrain(scene);
 const staticColliders=[];
 const addCollider=(x,y,w,h)=>{
   const zone=scene.add.zone(x,y,w,h);
   scene.physics.add.existing(zone,true);
   staticColliders.push(zone);
 };
 const decor=scene.add.graphics().setDepth(3);
 for(let i=0;i<1800;i++){
   const x=random()*W,y=random()*H;
   if(distanceToTrail(x,y)<34)continue;
   const color=pick([0x719266,0x97a36b,0xa9a678,0x375f45,0xb7a77b]);
   decor.fillStyle(color,random()*.35+.2);
   decor.fillRect(x,y,2+random()*4,2+random()*3);
 }
 // Foliage clusters: trunk collides, canopy is rendered above the character.
 for(let i=0;i<190;i++){
   let x=random()*W,y=random()*H;
   if(distanceToTrail(x,y)<125||safeFromLandmark(x,y)||Math.abs(x-waterX(y))<90)continue;
   const variant=Math.floor(random()*12),scale=.70+random()*.55;
   scene.add.ellipse(x,y,65*scale,18*scale,0x0d221b,.35).setDepth(y-3);
   scene.add.image(x,y+7,'forest-tree-'+variant).setOrigin(.5,1).setScale(scale).setDepth(y+8);
   addCollider(x,y-7,23*scale,18*scale);
 }
 for(let i=0;i<145;i++){
   let x=random()*W,y=random()*H;
   if(distanceToTrail(x,y)<73||safeFromLandmark(x,y)||Math.abs(x-waterX(y))<70)continue;
   const typ=random();
   if(typ<.55){
     scene.add.image(x,y,'forest-bush').setScale(.8+random()*.5).setOrigin(.5,1).setDepth(y+2);
   }else if(typ<.8){
     scene.add.image(x,y,'forest-stone').setScale(.7+random()*.7).setOrigin(.5,1).setDepth(y+2);
     addCollider(x,y-5,22,13);
   }else{
     scene.add.image(x,y,'forest-flower').setScale(1+random()*.5).setOrigin(.5,1).setDepth(y);
   }
 }
 // Cabana: entrance faces the trail. Ruins provide a second distinct zone.
 scene.add.ellipse(873,453,150,32,0x10251e,.4).setDepth(453);
 scene.add.image(873,455,'forest-cabin').setOrigin(.5,1).setDepth(464);
 addCollider(873,402,117,75);
 scene.add.image(1471,755,'forest-ruin').setOrigin(.5,1).setScale(1.04).setDepth(765);
 addCollider(1483,711,57,32);
 scene.add.circle(312,563,60,0xe7a35a,.09).setDepth(4).setBlendMode('ADD');
 scene.add.image(312,587,'forest-fire').setOrigin(.5,1).setDepth(594);
 for(let i=0;i<24;i++){
   const y=24+i*43,x=waterX(y)+(random()-.5)*57;
   const ripple=scene.add.rectangle(x,y,10+random()*13,2,0x9dd0c5,.19).setDepth(5);
   scene.tweens.add({targets:ripple,alpha:{from:.07,to:.43},x:x+8,duration:1600+i*37,yoyo:true,repeat:-1});
 }
 // Wooden bridge crosses the river; collision zones create real banks.
 const bridgeY=540, bx=waterX(bridgeY);
 const g=scene.add.graphics().setDepth(6);
 g.fillStyle(0x282820);g.fillRect(bx-72,bridgeY-44,152,89);
 g.fillStyle(0x856040);g.fillRect(bx-73,bridgeY-37,155,72);
 for(let i=0;i<8;i++){
   g.fillStyle(i%2?0xa98151:0x966e47);
   g.fillRect(bx-70,bridgeY-35+i*9,148,8);
   g.fillStyle(0x4e3d2b);g.fillRect(bx-70,bridgeY-35+i*9,148,1);
 }
 for(const railY of [bridgeY-47,bridgeY+41]){
   g.fillStyle(0x5a3c29);g.fillRect(bx-80,railY,167,6);
   for(let x=bx-72;x<=bx+80;x+=31){g.fillStyle(0xb18756);g.fillRect(x,railY-9,7,19)}
 }
 for(let y=0;y<H;y+=26){
   if(y>bridgeY-42 && y<bridgeY+45)continue;
   addCollider(waterX(y)+4,y+13,94,28);
 }
 scene.physics.add.collider(scene.player,staticColliders);
 const landmarks=[
   {id:'fogueira',x:312,y:590,r:67,label:'Examinar fogueira',title:'O último acampamento',
     text:'A madeira ainda está quente. Alguém passou por aqui recentemente.\n\nEntre as cinzas, você encontra um pequeno símbolo igual ao gravado nas pedras antigas.'},
   {id:'cabana',x:873,y:473,r:78,label:'Explorar cabana',title:'A cabana esquecida',
     text:'A porta está trancada por dentro. Pela janela, você vê anotações, mapas e um retrato desbotado.\n\nNa madeira alguém escreveu: “Quando a terceira luz despertar, procure as raízes.”'},
   {id:'ponte',x:waterX(540),y:541,r:79,label:'Examinar ponte',title:'A ponte dos ecos',
     text:'O rio murmura uma melodia antiga sob as tábuas. Na margem oposta, o caminho parece continuar até ruínas esquecidas.'},
   {id:'ruinas',x:1450,y:776,r:83,label:'Investigar ruínas',title:'As ruínas adormecidas',
     text:'Uma construção de pedra resiste entre as raízes. Uma escada desce para a escuridão, mas a entrada está selada.\n\nHá sinais de que alguém tentou abri-la antes de você.'}
 ];
 const nearby=(x,y)=>landmarks.find(o=>Math.hypot(x-o.x,y-o.y)<o.r)||null;
 const interact=(x,y)=>{
   const object=nearby(x,y);
   if(!object)return false;
   scene.openDialog(object.title,object.text);
   return true;
 };
 return {colliders:staticColliders,nearby,interact};
}
