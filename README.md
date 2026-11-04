# TR-01 :: hypertrance

Site de fã sobre hypertrance / uplifting trance / revival do trance Y2K: o selo hypertrance, a discografia do nuphory e o Virtual Self como origem.

Site estático (HTML/CSS/JS, sem build). O player usa a YouTube IFrame API, com o embed do Bandcamp como alternativa. As capas vêm do CDN do Bandcamp.

## Esta branch: `sem-3d` (cromo-liquido sem o 3D)

- Tudo do `cromo-liquido`, menos o fundo 3D: sai o canvas, o `bg3d.js` e o three.js.
- Fundo fixo com a capa "exoplanet '02" desfocada, gradiente lilás, retícula e scanlines. A página fica bem mais leve.

## Branches

| Branch | O que é |
|---|---|
| `main` | Versão original: player na coluna da esquerda, fundo 3D de cacos de cristal |
| `player-circulo` | Player dentro do círculo do Virtual Self, playlist à direita com moldura |
| `cromo-liquido` | + fundo 3D de cromo líquido, tema claro para o nuphory, visualizer |
| `sem-3d` | `cromo-liquido` sem o 3D, com a capa desfocada de fundo |

Para trocar de versão: `git checkout <branch>` e recarregue a página com Ctrl+Shift+R.

## Rodar

O YouTube não toca em `file://`, então precisa de um servidor http:

```bash
python3 -m http.server 8421
```

Depois abra http://localhost:8421.

## Limitações conhecidas

- **O player do Bandcamp não obedece aos controles do TR·AMP.** O embed do Bandcamp é um iframe de outro domínio e não aceita comandos de fora. Com um lançamento tocando pelo Bandcamp:
  - play/pausa, anterior/próximo, a barra de progresso e o **volume** do TR·AMP não funcionam;
  - use os controles do próprio embed, e o volume da aba ou do sistema;
  - o player mostra "use o player" no LCD e desativa o botão de play;
  - no fim de um vídeo, o avanço automático pula os lançamentos que só existem no Bandcamp (samplepack, digital dreams), para a reprodução contínua não parar.
- **Firefox bloqueia o autoplay do YouTube** quando o play vem dos botões da página. O player avisa "clique na tela": um clique direto no vídeo libera, e os próximos tocam sozinhos. Para liberar de vez: cadeado → Permissões → Reprodução automática → Permitir áudio e vídeo.
- **Vídeos do YouTube podem sumir** ou ter o embed bloqueado pelo dono. Nesse caso o player cai sozinho para o Bandcamp (ou pula, se não houver Bandcamp).
- **Notas do RYM são aproximadas:** o RYM bloqueia acesso automatizado.
- **Não tem tema claro.** Quem fazia a troca para o branco era o script do 3D, então tocar a discografia do nuphory não muda o fundo.
- **O visualizer é simulado** (pulsa a 140 BPM, não reage às frequências reais).

## Arquivos

- `albums.js`: catálogo (`HT_ALBUMS`) e fileiras (`HT_SHELVES`). Edite aqui para adicionar lançamentos.
- `app.js`: player, playlist, fileiras e ficha do lançamento.
- `viz.js`: visualizer espelhado (simulado).
- `style.css`, `index.html`
- `reports/`, `research_notes/`: pesquisas que guiaram o design.

Capas, artes e áudio pertencem aos artistas. Projeto de fã, sem afiliação.
