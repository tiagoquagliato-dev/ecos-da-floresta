// Cavaleiro Sombrio: sprite derivado da referência visual fornecida pelo autor.
// O arquivo /assets/cavaleiro-sombrio.png preserva a arte frontal original.
// As demais direções são adaptações temporárias dessa arte, até a criação
// de quadros desenhados individualmente por um pixel artist.
const DIRECTIONS=['down','left','right','up'];
const FRAME_W=64;
const FRAME_H=112;
export function createKnightAnimations(scene) {
  if(scene.textures.exists('dark-knight'))return;
  const source=scene.textures.get('dark-knight-source')?.getSourceImage();
  if(!source?.width)throw new Error('O sprite do Cavaleiro Sombrio não foi carregado.');
  const canvas=document.createElement('canvas');
  canvas.width=FRAME_W*4;
  canvas.height=FRAME_H*4;
  const context=canvas.getContext('2d');
  context.imageSmoothingEnabled=false;
  const offset=[0,1,0,-1];
  DIRECTIONS.forEach((direction,row)=>{
    for(let frame=0;frame<4;frame++){
      const x=frame*FRAME_W,y=row*FRAME_H;
      const bob=offset[frame];
      context.save();
      context.translate(x+FRAME_W/2,y+FRAME_H+bob);
      if(direction==='right')context.scale(-.86,1);
      else if(direction==='left')context.scale(.86,1);
      context.drawImage(source,-FRAME_W/2,-FRAME_H,FRAME_W,FRAME_H);
      context.restore();
      // Vista posterior provisória: ocultar o crânio com o interior do capuz.
      if(direction==='up'){
        context.fillStyle='#1b1a1c';
        context.fillRect(x+24,y+16+bob,16,13);
        context.fillStyle='#3d2528';
        context.fillRect(x+22,y+15+bob,2,16);
        context.fillRect(x+40,y+15+bob,2,16);
        context.fillStyle='#555155';
        context.fillRect(x+28,y+13+bob,8,3);
      }
      if(frame===1||frame===3){
        // Deslocamento leve da bainha dá leitura de passo sem distorcer a silhueta.
        context.fillStyle='#4c2022';
        context.fillRect(x+(frame===1?22:39),y+89+bob,2,8);
      }
    }
  });
  scene.textures.addSpriteSheet('dark-knight',canvas,{frameWidth:FRAME_W,frameHeight:FRAME_H});
  DIRECTIONS.forEach((direction,row)=>{
    scene.anims.create({key:'knight-walk-'+direction,frames:scene.anims.generateFrameNumbers('dark-knight',{start:row*4,end:row*4+3}),frameRate:7,repeat:-1});
    scene.anims.create({key:'knight-idle-'+direction,frames:[{key:'dark-knight',frame:row*4}],frameRate:1,repeat:0});
  });
}
