# Ecos da Floresta — V0.6

RPG 2D para navegador feito com **Phaser 3 + Vite**. Versão experimental da demonstração **Capítulo I: O Despertar**.

## Executar localmente

```bash
npm install
npm run dev
```

Para compilar: `npm run build`.

## Controles

- WASD ou setas: movimentar o personagem
- Clique/toque: caminhar até um ponto acessível
- E / espaço: interagir
- I: inventário
- Q: missão
- Enter / Esc: fechar diálogo

## Explore

A floresta agora é desenhada por camadas distintas, não como uma única imagem de fundo. Há árvores com profundidade por Y, arbustos, rochas, clareiras, rio, ponte, cabana abandonada, fogueira e ruínas. Troncos, rochas, margem do rio e construções possuem obstáculos físicos no Phaser Arcade.

Visite o Guardião, recupere os três fragmentos e examine o diário, o marco e o altar. Cabana, ponte, fogueira e ruínas oferecem diálogos adicionais.

## Arquitetura

- `src/main.js`: cena e progressão principal
- `src/chapter.js`: mistérios, exploração e introdução
- `src/game/world/WorldBuilder.js`: cenário em camadas e obstáculos estáticos
- `src/game/world/WorldGeometry.js`: dimensões e geometria
- `src/game/entities/TravelerSprites.js`: spritesheet original e animações de quatro direções
- `src/game/entities/PlayerController.js`: movimento e comandos
- `src/game/systems/SaveSystem.js`: salvamento local

## Limites conhecidos

A versão 0.6 é **uma base técnica nova**, não a arte final aprovada. A vegetação e o personagem são desenhados proceduralmente, sem sprites pintados manualmente. Faltam animações sofisticadas, som, combate, acessibilidade mobile refinada e teste visual completo. O mundo tem uma única região de 1536×1024.

## Publicação

Pushes na branch `main` acionam a Vercel. Antes de apresentar a outra pessoa, validar manualmente: abrir tela inicial, caminhar, atravessar ponte, colidir com árvores e rio, interagir com Guardião, recolher os 3 fragmentos e reiniciar.
