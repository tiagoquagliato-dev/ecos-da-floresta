# Ecos da Floresta V0.7

RPG pixel-art experimental para navegador, construído com **Phaser 3 + Vite**.

## Jogar

Produção: https://ecos-da-floresta-cyan.vercel.app/

## Executar no VS Code

```bash
npm install
npm run dev
```

## V0.7: Cavaleiro Sombrio

- O personagem jogável e o retrato principal utilizam o visual da referência enviada pelo autor.
- Asset transparente: `public/assets/cavaleiro-sombrio.png`.
- `src/game/entities/KnightSprites.js` cria quatro direções com animações básicas. As poses laterais e posteriores são adaptações provisórias, não sprites pintados individualmente.
- Novo menu de início com **Continuar jornada** e **Nova jornada** (quando há progresso).
- HUD reduzida, menu de inventário e missões recolhido, avisos temporários e interação contextual.
- Missão e salvamento local preservados, com opção explícita de reinício.
- Prioridade de interação corrigida para coletar fragmentos perto da ponte.
- Clique para caminhar agora desiste quando o personagem fica bloqueado por um obstáculo.
- Cenário menos granulado, doze combinações de copas, água com pequenas animações e rótulos fixos removidos.

## Teclas

- WASD ou setas: mover
- E ou espaço: interagir
- I: inventário
- Q: missões
- Esc ou Enter: fechar diálogos
- Clique/toque no cenário: caminhar

## Organização

- `src/main.js`: cena principal e missão dos fragmentos
- `src/chapter.js`: introdução, diário, marco e altar
- `src/game/entities/KnightSprites.js`: animações do protagonista
- `src/game/entities/PlayerController.js`: controles e movimento
- `src/game/world/WorldBuilder.js`: terreno, decorações, obstáculos, rio e ponte
- `src/game/world/WorldGeometry.js`: geometria e área explorável
- `src/game/systems/SaveSystem.js`: gravação e reinício do progresso

## Status técnico

Esta versão é uma **prévia em desenvolvimento**. O build da Vercel verifica a compilação, mas não substitui teste manual de jogabilidade. Ainda faltam: sprites manuais de quatro direções, trilha sonora, mapa definitivo desenhado por um artista, testes automatizados de navegador e refinamento completo dos controles mobile.

## Checklist antes de convidar colaboradores

1. Jogar a partir de **Nova jornada**, confirmando o início limpo.
2. Movimentar o Cavaleiro Sombrio em quatro direções e validar colisões.
3. Atravessar a ponte, explorar a cabana e as ruínas.
4. Falar com o Guardião e coletar os três fragmentos.
5. Recarregar a página e verificar **Continuar jornada**.
6. Conferir a legibilidade dos menus em desktop e celular.

A imagem de referência do personagem foi fornecida pelo autor do projeto. Verifique as permissões de uso da arte antes de distribuição comercial.
