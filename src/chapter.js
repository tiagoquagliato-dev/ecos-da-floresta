import Phaser from 'phaser';
import {resetGame} from './game/systems/SaveSystem.js';

const POINTS = [
  { id:'diario', x:681, y:515, label:'Diário esquecido', hint:'Examinar diário', symbol:'▤' },
  { id:'marco', x:976, y:526, label:'Marco antigo', hint:'Investigar marco', symbol:'✧' },
  { id:'altar', x:1309, y:650, label:'Altar das raízes', hint:'Examinar altar', symbol:'◇' }
];
const CHAPTER_KEY='ecos-floresta-capitulo-v05';
const INTRO_KEY='ecos-floresta-intro-v05';

function read(){try{return JSON.parse(localStorage.getItem(CHAPTER_KEY)||'{}')}catch{return {}}}
export function installChapter(scene) {
  const state = read();
  const visited = new Set(state.visited || []);
  let openedIntro = false;
  const info = document.querySelector('#discovery');
  const intro = document.querySelector('#opening');
  const startBtn = document.querySelector('#start-game');
  const newGameBtn = document.querySelector('#new-game');
  const soundBtn = document.querySelector('#sound-btn');
  const objects=[];

  const save=()=>{try{localStorage.setItem(CHAPTER_KEY,JSON.stringify({visited:[...visited]}))}catch{}};
  const drawPoint=(point)=>{
    const layer=scene.add.container(point.x,point.y).setDepth(point.y-5);
    const halo=scene.add.ellipse(0,-12,53,20,0xffd379,.12).setBlendMode(Phaser.BlendModes.ADD);
    const base=scene.add.ellipse(0,0,43,14,0x121c15,.48);
    const stone=scene.add.graphics();
    if(point.id==='diario'){
      stone.fillStyle(0x684629);stone.fillRoundedRect(-19,-16,38,21,4);
      stone.fillStyle(0xd1b67a);stone.fillRoundedRect(-13,-20,27,24,3);
      stone.lineStyle(2,0x765639);stone.strokeLineShape(new Phaser.Geom.Line(0,-18,0,2));
      stone.fillStyle(0x785d3d);stone.fillCircle(8,-8,2);
    } else if(point.id==='marco'){
      stone.fillStyle(0x283e35);stone.fillTriangle(-23,-3,-15,-31,16,-37);
      stone.fillStyle(0x6d8874);stone.fillTriangle(-16,-6,-12,-34,17,-37);
      stone.lineStyle(3,0xeac87c,.8);stone.lineBetween(-2,-24,6,-19);stone.lineBetween(6,-19,0,-12);
    } else {
      stone.fillStyle(0x4d5747);stone.fillRoundedRect(-24,-19,48,21,4);
      stone.fillStyle(0x899d7f);stone.fillRoundedRect(-17,-26,34,18,5);
      stone.fillStyle(0xeccc83);stone.fillTriangle(0,-42,-9,-25,8,-25);
    }
    const spark=scene.add.text(0,-58,'✦',{fontFamily:'Georgia',fontSize:'20px',color:'#f8d58b',stroke:'#1a2517',strokeThickness:3}).setOrigin(.5);
    layer.add([halo,base,stone,spark]);
    scene.tweens.add({targets:spark,y:-64,alpha:{from:.5,to:1},duration:1300+point.x%350,yoyo:true,repeat:-1});
    if(visited.has(point.id)){spark.setVisible(false);halo.setAlpha(.25)}
    objects.push({point,layer,spark,halo});
  };

  const flowers=scene.add.graphics().setDepth(9);
  let rand=29131;
  const rng=()=>{rand=(rand*1664525+1013904223)>>>0;return rand/4294967296};
  for(let i=0;i<230;i++){
    const x=140+rng()*1240,y=300+rng()*630;
    if(scene.inTrail(x,y,55))continue;
    flowers.fillStyle([0xe4d08d,0xe9aaa1,0x8fae8c,0xf0dfbb][Math.floor(rng()*4)],rng()*.35+.24);
    flowers.fillCircle(x,y,1+rng()*1.7);
  }
  for(const point of POINTS)drawPoint(point);
  // Faint, slow moving motes above the clearing.
  const motes=scene.add.particles(0,0,'fragment',{
    x:{min:220,max:1400},y:{min:360,max:930},
    lifespan:4200,speedY:{min:-9,max:-3},speedX:{min:-3,max:3},
    scale:{start:.12,end:0},alpha:{start:.35,end:0},
    quantity:1,frequency:360,blendMode:'ADD'
  }).setDepth(30);
  const setDiscovery=()=>{
    if(!info)return;
    const n=visited.size;
    info.textContent=n===3?'3/3 DESCOBERTAS':n+'/3 DESCOBERTAS';
    info.title='Diário, marco e altar espalhados pela floresta';
  };
  setDiscovery();
  const message=(title,body)=>scene.openDialog(title,body);
  function interact(x,y) {
    const found=objects.find(({point})=>Math.hypot(point.x-x,point.y-y)<83);
    if(!found)return false;
    const id=found.point.id;
    if(id==='diario'){
      message('Páginas molhadas','“A luz não morreu. Ela foi escondida sob as raízes. Não confie no silêncio da floresta.”\n\nUma assinatura foi arrancada da última página.');
    } else if(id==='marco'){
      message('Marco dos antigos','Símbolos gastos apontam para um altar mais adiante. No verso da pedra, alguém gravou: “O que foi partido pode voltar a brilhar.”');
    } else if(scene.collected.size<3){
      message('Altar das raízes','Três cavidades vazias cercam uma pequena chama azul. Parece que o altar espera os fragmentos espalhados pela trilha.');
    }else{
      message('O eco responde','Os fragmentos brilham perto do altar. Uma voz murmura entre as árvores:\n\n“Esta floresta guarda uma porta que ainda não pode ser aberta.”\n\nVocê encontrou o primeiro segredo.');
    }
    visited.add(id);found.spark.setVisible(false);found.halo.setAlpha(.25);setDiscovery();save();
    return true;
  }
  function nearby(x,y){return objects.find(({point})=>Math.hypot(point.x-x,point.y-y)<83)?.point||null}
  function openIntro(){
    if(!intro)return;
    const saved=scene.saveData||{};
    const hasProgress=visited.size>0||scene.talked||scene.finished||scene.collected.size>0||
      (saved.player && Math.hypot(saved.player.x-290,saved.player.y-462)>45);
    if(startBtn)startBtn.innerHTML=(hasProgress?'CONTINUAR JORNADA':'INICIAR JORNADA')+' <span>→</span>';
    if(newGameBtn)newGameBtn.hidden=!hasProgress;
    openedIntro=true;
    intro.hidden=false;
    scene.dialogOpen=true;
    scene.player.setVelocity(0);
  }
  const start=()=>{
    intro.hidden=true;openedIntro=false;scene.dialogOpen=false;
    try{localStorage.setItem(INTRO_KEY,'seen')}catch{}
    scene.toast('Capítulo I: siga os sinais pela trilha.');
  };
  startBtn?.addEventListener('click',start);
  newGameBtn?.addEventListener('click',()=>{
    if(!confirm('Iniciar uma nova jornada? Todo o progresso desta aventura será apagado.'))return;
    resetGame();location.reload();
  });
  const onEnter=(event)=>{if(openedIntro && (event.key==='Enter'||event.key===' ')){event.preventDefault();start()}};
  document.addEventListener('keydown',onEnter);
  soundBtn?.addEventListener('click',()=>{const pressed=soundBtn.getAttribute('aria-pressed')==='true';soundBtn.setAttribute('aria-pressed',String(!pressed));soundBtn.textContent=pressed?'SOM: DESLIGADO':'SOM: EM BREVE';scene.toast('Trilha sonora original prevista para a próxima versão.')});
  openIntro();
  scene.events.once('shutdown',()=>{document.removeEventListener('keydown',onEnter);motes.destroy()});
  return {interact,nearby, update(){},visited};
}
