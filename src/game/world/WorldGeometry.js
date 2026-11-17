export const WORLD_WIDTH = 1536;
export const WORLD_HEIGHT = 1024;

export const TRAIL_POINTS = [
  [130,450],[270,440],[400,420],[520,455],[650,505],[780,530],
  [930,535],[1080,536],[1225,555],[1310,633],[1390,760],[1405,890]
];

export function distance(ax,ay,bx,by) {
  return Math.hypot(ax-bx,ay-by);
}

export function distanceToTrail(x,y) {
  let min=Infinity;
  for(let i=1;i<TRAIL_POINTS.length;i++) {
    const [ax,ay]=TRAIL_POINTS[i-1], [bx,by]=TRAIL_POINTS[i];
    const dx=bx-ax, dy=by-ay;
    const lengthSq=dx*dx+dy*dy;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(lengthSq||1)));
    min=Math.min(min,distance(x,y,ax+dx*t,ay+dy*t));
  }
  return min;
}

// Open exploration now uses individual Phaser physics colliders instead of an invisible trail corridor.
export function isWalkable(x,y) {
  return Number.isFinite(x) && Number.isFinite(y) && x>=42 && x<=WORLD_WIDTH-42 && y>=42 && y<=WORLD_HEIGHT-42;
}
