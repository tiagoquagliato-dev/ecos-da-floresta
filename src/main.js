import Phaser from 'phaser';
import { installChapter } from './chapter.js';

const WIDTH = 1536, HEIGHT = 1024;
const SAVE_KEY = 'ecos-floresta-v04';
const TRAIL = [[130,450],[270,440],[400,420],[520,455],[650,505],[780,530],[930,535],[1080,536],[1225,555],[1310,633],[1390,760],[1405,890]];
const ELEMENTS = {
 dialog:document.querySelector('#dialog'),title:document.querySelector('#dialog-title'),body:document.querySelector('#dialog-body'),
 toast:document.querySelector('#toast'),talk:document.querySelector('#talk-check'),fragments:document.querySelector('#fragment-check'),
 finish:document.querySelector('#finish-check'),counter:document.querySelector('#count'),hint:document.querySelector('#quest-hint'),
 interact:document.querySelector('#interact-btn')
};
function loadSave(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}catch{return {}}}
const distance=(a,b,c,d)=>Math.hypot(a-c,b-d);
function trailDistance(x,y){let best=Infinity;for(let i=1;i<TRAIL.length;i++){const [ax,ay]=TRAIL[i-1],[bx,by]=TRAIL[i];const dx=bx-ax,dy=by-ay;const t=Phaser.Math.Clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);best=Math.min(best,distance(x,y,ax+dx*t,ay+dy*t))}return best}
let gameScene;
class Floresta extends Phaser.Scene{
 constructor(){super('Floresta');this.saveData=loadSave();this.collected=new Set(this.saveData.collected||[]);this.talked=!!this.saveData.talked;this.finished=!!this.saveData.finished;this.dialogOpen=false;this.destination=null;this.near=null;this.elapsed=0;this.noticeTimer=null}
 preload(){this.load.image('forest','/assets/floresta.png');this.load.image('hero','/assets/heroi.png');this.load.image('guardian','/assets/guardiao.png');this.load.image('fragment','/assets/fragment.png')}
 create(){gameScene=this;
  this.cameras.main.setBackgroundColor('#101b15');this.physics.world.setBounds(0,0,WIDTH,HEIGHT);this.cameras.main.setBounds(0,0,WIDTH,HEIGHT);
  this.add.image(0,0,'forest').setOrigin(0,0).setDepth(0);
  this.add.ellipse(255,470,36,12,0x152318,.48).setDepth(15);
  const start=this.saveData.player && this.inTrail(this.saveData.player.x,this.saveData.player.y)?this.saveData.player:{x:290,y:462};
  this.playerShadow=this.add.ellipse(start.x,start.y+2,42,14,0x171d12,.43).setDepth(18);
  this.player=this.physics.add.sprite(start.x,start.y,'hero').setOrigin(.5,1).setDepth(20).setCollideWorldBounds(true);
  this.player.body.setSize(23,18).setOffset(22,97);this.player.setScale(.83);
  this.guardianShadow=this.add.ellipse(514,464,70,16,0x161c13,.38).setDepth(19);
  this.guardian=this.add.image(514,464,'guardian').setOrigin(.5,1).setScale(.88).setDepth(21);
  this.guardianLabel=this.add.text(514,351,'✦  GUARDIÃO',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#f9e0aa',backgroundColor:'#1d2f25db',padding:{x:10,y:6}}).setOrigin(.5).setDepth(40);
  this.tweens.add({targets:this.guardianLabel,alpha:.7,duration:1400,yoyo:true,repeat:-1});
  this.items=[{id:0,x:790,y:543},{id:1,x:1095,y:548},{id:2,x:1389,y:821}];
  this.items.forEach(item=>this.renderItem(item));
  this.chapter=installChapter(this);
  this.cameras.main.startFollow(this.player,true,.095,.095);this.cameras.main.setZoom(1.06);
  this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,I,Q,ESC,ENTER');
  this.input.keyboard.on('keydown-E',()=>this.interact());this.input.keyboard.on('keydown-SPACE',()=>this.interact());
  this.input.keyboard.on('keydown-I',()=>this.inventory());this.input.keyboard.on('keydown-Q',()=>this.questDialog());
  this.input.keyboard.on('keydown-ESC',()=>this.closeDialog());this.input.keyboard.on('keydown-ENTER',()=>this.closeDialog());
  this.input.on('pointerdown',p=>{if(this.dialogOpen)return;const point=this.cameras.main.getWorldPoint(p.x,p.y);if(this.inTrail(point.x,point.y,128))this.destination={x:point.x,y:point.y};else this.toast('Siga pela trilha. A floresta é muito densa por aqui.')});
  this.refreshUI();this.toast(this.finished?'A luz voltou à floresta. Continue explorando.':'Encontre o Guardião e siga a trilha.');
  this.events.on('shutdown',()=>this.save());
 }
 inTrail(x,y,max=102){return x>80&&x<WIDTH-35&&y>320&&y<HEIGHT-28&&trailDistance(x,y)<max}
 renderItem(item){if(this.collected.has(item.id))return;
  const glow=this.add.circle(item.x,item.y-18,23,0xf1d879,.13).setDepth(14).setBlendMode(Phaser.BlendModes.ADD);
  const ring=this.add.circle(item.x,item.y-17,16,0xdec56a,.14).setDepth(24);ring.setStrokeStyle(2,0xf6df9d,.7);
  const crystal=this.add.image(item.x,item.y,'fragment').setOrigin(.5,.9).setScale(.9).setDepth(26);
  this.tweens.add({targets:[crystal,glow,ring],y:'-=7',duration:1300,ease:'Sine.easeInOut',yoyo:true,repeat:-1});
  this.tweens.add({targets:glow,alpha:{from:.08,to:.32},duration:1100,yoyo:true,repeat:-1});
  Object.assign(item,{glow,ring,crystal});
 }
 refreshUI(){ELEMENTS.talk.textContent=this.talked?'☑':'□';ELEMENTS.fragments.textContent=this.collected.size===3?'☑':'□';ELEMENTS.finish.textContent=this.finished?'☑':'□';ELEMENTS.counter.textContent=`${this.collected.size}/3`;ELEMENTS.hint.textContent=this.finished?'Missão concluída!':this.talked?'Reúna os fragmentos brilhantes':'Encontre o Guardião da floresta';}
 save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({talked:this.talked,collected:[...this.collected],finished:this.finished,player:{x:Math.round(this.player.x),y:Math.round(this.player.y)}}))}catch(e){console.warn('Não foi possível salvar:',e)}}
 toast(message){ELEMENTS.toast.textContent=message;clearTimeout(this.noticeTimer);this.noticeTimer=setTimeout(()=>{ELEMENTS.toast.textContent=this.finished?'A floresta está em paz.':'Aproxime-se e pressione E para interagir.'},4300)}
 openDialog(title,text){this.dialogOpen=true;this.destination=null;this.player.setVelocity(0);ELEMENTS.title.textContent=title;ELEMENTS.body.textContent=text;ELEMENTS.dialog.hidden=false}
 closeDialog(){if(document.querySelector('#opening')?.hidden===false)return;this.dialogOpen=false;ELEMENTS.dialog.hidden=true}
 inventory(){if(this.dialogOpen){this.closeDialog();return}this.openDialog('Inventário',`✦ Fragmentos da luz: ${this.collected.size} de 3\n\n${this.finished?'A floresta foi restaurada.':'Fragmentos antigos escondidos pela trilha. Encontre todos e entregue ao Guardião.'}`)}
 questDialog(){if(this.dialogOpen){this.closeDialog();return}this.openDialog('A Primeira Luz',this.finished?'Missão concluída! Você devolveu a luz à floresta.':this.talked?`Encontre os três fragmentos e retorne ao Guardião.\n\nProgresso: ${this.collected.size}/3.`:'Encontre o Guardião na clareira e converse com ele para iniciar sua jornada.')}
 interact(){if(document.querySelector('#opening')?.hidden===false)return;if(this.dialogOpen){this.closeDialog();return}const x=this.player.x,y=this.player.y;
  if(this.chapter?.interact(x,y))return;const nearItem=this.items.find(i=>!this.collected.has(i.id)&&distance(x,y,i.x,i.y)<84);if(nearItem){this.collected.add(nearItem.id);[nearItem.crystal,nearItem.ring,nearItem.glow].forEach(o=>o?.destroy());this.toast(`Fragmento da luz encontrado! ${this.collected.size}/3`);this.refreshUI();this.save();return}
  if(distance(x,y,514,464)<112){this.talked=true;if(this.collected.size===3){this.finished=true;this.openDialog('A floresta desperta','Você reuniu os três fragmentos!\n\nA luz retorna lentamente entre as árvores. Seu primeiro capítulo está completo.\n\n✦ MISSÃO CONCLUÍDA ✦')}else{this.openDialog('O Guardião',`Viajante, uma antiga luz se partiu.\n\nSiga a trilha e encontre os três fragmentos escondidos na floresta.\n\nTraga-os até mim. A floresta precisa de você.\n\nFragmentos encontrados: ${this.collected.size}/3.`)}this.refreshUI();this.save();return}
  this.toast('Aproxime-se do Guardião ou de um fragmento brilhante.')
 }
 update(_,delta){if(!this.player)return;
  if(this.dialogOpen){this.player.setVelocity(0);this.near=null;ELEMENTS.interact.hidden=true;return}
  const p=this.player; if(!this.inTrail(p.x,p.y)){p.setPosition(this.lastSafe?.x??290,this.lastSafe?.y??462);p.setVelocity(0);this.destination=null;this.toast('Você precisa permanecer na trilha.')}else this.lastSafe={x:p.x,y:p.y};
  let dx=0,dy=0;const k=this.keys;
  if(k.A.isDown||k.LEFT.isDown)dx-=1;if(k.D.isDown||k.RIGHT.isDown)dx+=1;if(k.W.isDown||k.UP.isDown)dy-=1;if(k.S.isDown||k.DOWN.isDown)dy+=1;
  if(dx||dy)this.destination=null;
  if(this.destination){let vx=this.destination.x-p.x,vy=this.destination.y-p.y;const d=Math.hypot(vx,vy);if(d<19){this.destination=null;this.interact()}else{dx=vx/d;dy=vy/d}}
  const length=Math.hypot(dx,dy)||1,spd=175;p.setVelocity(dx/length*spd,dy/length*spd);
  if(dx||dy){this.elapsed+=delta*.014;p.setScale(.83,.83+Math.sin(this.elapsed)*.012);if(dx>.2)p.setFlipX(true);if(dx<-.2)p.setFlipX(false)}else{p.setScale(.83);this.elapsed=0}
  p.setDepth(p.y+15);this.playerShadow.setPosition(p.x,p.y+1).setDepth(p.y-4);
  this.near=distance(p.x,p.y,514,464)<108 || this.items.some(i=>!this.collected.has(i.id)&&distance(p.x,p.y,i.x,i.y)<83) || !!this.chapter?.nearby(p.x,p.y);
  ELEMENTS.interact.hidden=!this.near;
  if(this.near){const prompt=this.chapter?.nearby(p.x,p.y)?.hint || (distance(p.x,p.y,514,464)<108?'Falar com Guardião':'Coletar fragmento');ELEMENTS.interact.querySelector('span').textContent=prompt}
  this.chapter?.update(delta);this.saveElapsed=(this.saveElapsed||0)+delta;if(this.saveElapsed>3000){this.saveElapsed=0;this.save()}
 }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1100,height:700,backgroundColor:'#14251c',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{debug:false}},render:{antialias:false},scene:[Floresta]});
document.querySelector('#dialog-close').addEventListener('click',()=>gameScene?.closeDialog());
document.querySelector('#inventory-btn').addEventListener('click',()=>gameScene?.inventory());
document.querySelector('#quests-btn').addEventListener('click',()=>gameScene?.questDialog());
document.querySelector('#interact-btn').addEventListener('click',()=>gameScene?.interact());
document.querySelector('#reset-btn').addEventListener('click',()=>{if(confirm('Reiniciar toda a jornada e apagar o progresso da V0.5?')){localStorage.removeItem(SAVE_KEY);localStorage.removeItem('ecos-floresta-capitulo-v05');localStorage.removeItem('ecos-floresta-intro-v05');location.reload()}});
