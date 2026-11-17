// Original 4-direction pixel sprite sheet with distinct walking frames.
const colors={
 outline:'#172821',hair:'#352f2b',skin:'#e0b789',shade:'#a46f55',
 cloak:'#3c7186',light:'#72a6b4',dark:'#244b62',boots:'#3b3028',
 belt:'#b79b60',hood:'#244c60'
};
function px(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
function drawFrame(c,x,y,dir,phase){
  const p=(a,b,w,h,col)=>px(c,x+a,y+b,w,h,col);
  const step=[0,2,0,-2][phase],bob=(phase===1||phase===3)?1:0;
  const back=dir===3,left=dir===1,right=dir===2;
  // boots use visibly different left and right walking poses
  p(9,29+step,6,8,colors.outline);p(18,29-step,6,8,colors.outline);
  p(10,29+step,5,6,colors.boots);p(18,29-step,5,6,colors.boots);
  // outer cloak
  p(7,15+bob,19,16,colors.outline);
  p(9,16+bob,15,14,colors.dark);
  p(11,18+bob,11,11,colors.cloak);
  p(9,26+bob,4,6,colors.light);p(22,25+bob,3,6,colors.light);
  p(10,26+bob,13,3,colors.belt);
  p(7,18+bob+step/2,4,11,colors.outline);p(22,18+bob-step/2,4,11,colors.outline);
  p(8,20+bob+step/2,3,7,colors.cloak);p(23,20+bob-step/2,2,7,colors.cloak);
  // head and hood directions, giving each direction independent facial geometry
  p(9,4+bob,15,14,colors.outline);
  p(11,6+bob,11,11,colors.hood);
  if(back){
    p(11,7+bob,11,10,colors.dark);
    p(13,5+bob,7,3,colors.light);
    p(12,16+bob,9,3,colors.light);
  }else if(left){
    p(12,8+bob,8,8,colors.skin);
    p(10,6+bob,11,5,colors.hair);
    p(12,12+bob,2,2,colors.outline);
    p(19,9+bob,4,6,colors.dark);
  }else if(right){
    p(12,8+bob,8,8,colors.skin);
    p(10,6+bob,11,5,colors.hair);
    p(19,12+bob,2,2,colors.outline);
    p(9,9+bob,4,6,colors.dark);
  }else{
    p(12,8+bob,9,9,colors.skin);
    p(11,6+bob,11,4,colors.hair);
    p(14,12+bob,2,2,colors.outline);p(19,12+bob,2,2,colors.outline);
    p(16,16+bob,3,2,colors.shade);
  }
  p(9,17+bob,3,4,colors.light);
}
export function createTravelerAnimations(scene){
  if(scene.textures.exists('traveler'))return;
  const sheet=document.createElement('canvas');
  sheet.width=128;sheet.height=160;
  const ctx=sheet.getContext('2d');ctx.imageSmoothingEnabled=false;
  for(let dir=0;dir<4;dir++)for(let frame=0;frame<4;frame++)
    drawFrame(ctx,frame*32,dir*40,dir,frame);
  scene.textures.addSpriteSheet('traveler',sheet,{frameWidth:32,frameHeight:40});
  const dirs=['down','left','right','up'];
  dirs.forEach((name,row)=>{
    scene.anims.create({key:'traveler-walk-'+name,frames:scene.anims.generateFrameNumbers('traveler',{start:row*4,end:row*4+3}),frameRate:8,repeat:-1});
    scene.anims.create({key:'traveler-idle-'+name,frames:[{key:'traveler',frame:row*4}],frameRate:1,repeat:0});
  });
}
