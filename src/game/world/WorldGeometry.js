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

// The illustrated V0.5 landscape only supports the current walkable trail.
// This boundary will be replaced by colliders in the new layered tilemap.
export function isWalkable(x,y,margin=102) {
  return x>80 && x<WORLD_WIDTH-35 && y>320 &&
    y<WORLD_HEIGHT-28 && distanceToTrail(x,y)<margin;
}
