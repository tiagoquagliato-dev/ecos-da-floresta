export function installPlayerControls(scene) {
  const keys=scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,I,Q,ESC,ENTER');
  scene.keys=keys;

  scene.input.keyboard.on('keydown-E',()=>scene.interact());
  scene.input.keyboard.on('keydown-SPACE',()=>scene.interact());
  scene.input.keyboard.on('keydown-I',()=>scene.inventory());
  scene.input.keyboard.on('keydown-Q',()=>scene.questDialog());
  scene.input.keyboard.on('keydown-ESC',()=>scene.closeDialog());
  scene.input.keyboard.on('keydown-ENTER',()=>scene.closeDialog());

  scene.input.on('pointerdown',p=>{
    if(scene.dialogOpen)return;
    const point=scene.cameras.main.getWorldPoint(p.x,p.y);
    if(scene.inTrail(point.x,point.y,128))scene.destination={x:point.x,y:point.y};
    else scene.toast('Siga pela trilha. A floresta é muito densa por aqui.');
  });
}

// Retains V0.5 movement behaviour while isolating input and animation from the scene.
export function updatePlayer(scene,delta) {
  const p=scene.player;
  if(!p)return;
  if(scene.dialogOpen){p.setVelocity(0);return}
  if(!scene.inTrail(p.x,p.y)){
    p.setPosition(scene.lastSafe?.x??290,scene.lastSafe?.y??462);
    p.setVelocity(0);
    scene.destination=null;
    scene.toast('Você precisa permanecer na trilha.');
  } else scene.lastSafe={x:p.x,y:p.y};

  let dx=0,dy=0;
  const k=scene.keys;
  if(k.A.isDown||k.LEFT.isDown)dx-=1;
  if(k.D.isDown||k.RIGHT.isDown)dx+=1;
  if(k.W.isDown||k.UP.isDown)dy-=1;
  if(k.S.isDown||k.DOWN.isDown)dy+=1;
  if(dx||dy)scene.destination=null;
  if(scene.destination){
    const vx=scene.destination.x-p.x,vy=scene.destination.y-p.y;
    const length=Math.hypot(vx,vy);
    if(length<19){scene.destination=null;scene.interact()}
    else {dx=vx/length;dy=vy/length}
  }
  const len=Math.hypot(dx,dy)||1;
  p.setVelocity(dx/len*175,dy/len*175);
  if(dx||dy){
    scene.elapsed+=delta*.014;
    p.setScale(.83,.83+Math.sin(scene.elapsed)*.012);
    if(dx>.2)p.setFlipX(true);
    if(dx<-.2)p.setFlipX(false);
  } else {p.setScale(.83);scene.elapsed=0}
  p.setDepth(p.y+15);
  scene.playerShadow.setPosition(p.x,p.y+1).setDepth(p.y-4);
}
