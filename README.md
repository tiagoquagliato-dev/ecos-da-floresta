# Ecos da Floresta — V0.4 | Edição Ilustrada

RPG 2D para navegador, feito com Phaser 3 e Vite. Esta edição substitui a floresta de formas procedurais por uma composição original ilustrada em pixel art, incluindo novo personagem e Guardião, com a missão completa.

## Rodar

Requer Node.js 20+. No terminal da pasta do projeto:

```bash
npm install
npm run dev
```

Abra a URL local mostrada no terminal.

## Controles

- WASD / setas: caminhar
- E ou Espaço: interagir e recolher fragmentos
- I: inventário
- Q: diário da missão
- Esc / Enter: fechar diálogo
- Clique ou toque: caminhar até um ponto acessível da trilha

## Escopo

Missão completa com três fragmentos e Guardião; progresso salvo localmente no navegador; interface responsiva. O cenário é uma **área ilustrada fixa** com deslocamento de câmera, não um mapa expansível composto de tiles. A movimentação fica restrita à trilha para impedir que o personagem atravesse a vegetação pintada na imagem. Os sprites são ilustrações originais recortadas de um estudo de direção de arte, com animação de deslocamento sutil (sem spritesheet de caminhada direcional). O código está organizado em `src/main.js` e o layout em `src/style.css`.

O progresso da versão anterior não é importado: a versão 0.4 tem salvamento separado para a nova missão.
