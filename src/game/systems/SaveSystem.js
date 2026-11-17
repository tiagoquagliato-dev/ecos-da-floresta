export const SAVE_KEY='ecos-floresta-v04';
export const CHAPTER_SAVE_KEY='ecos-floresta-capitulo-v05';
export const INTRO_SAVE_KEY='ecos-floresta-intro-v05';

export function loadGame() {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    const state=raw?JSON.parse(raw):{};
    return state && typeof state==='object' ? state : {};
  } catch(e) {
    console.warn('Não foi possível ler o salvamento',e);
    return {};
  }
}

export function saveGame(scene) {
  if(!scene?.player)return;
  try {
    const data={
      talked:!!scene.talked,
      collected:[...scene.collected],
      finished:!!scene.finished,
      player:{x:Math.round(scene.player.x),y:Math.round(scene.player.y)}
    };
    localStorage.setItem(SAVE_KEY,JSON.stringify(data));
  } catch(e) {
    console.warn('Não foi possível salvar o progresso',e);
  }
}

export function resetGame() {
  [SAVE_KEY,CHAPTER_SAVE_KEY,INTRO_SAVE_KEY].forEach(key=>{
    try{localStorage.removeItem(key)}catch(e){console.warn('Falha ao limpar salvamento',e)}
  });
}
