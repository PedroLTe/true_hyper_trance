# TR-01 :: hypertrance

Site de fã sobre hypertrance / uplifting trance / revival do trance Y2K: o selo hypertrance, a discografia do nuphory e o Virtual Self como origem.

Site estático (HTML/CSS/JS, sem build). O fundo é uma explosão de cristal em 3D (three.js 0.187.0 via CDN), o player é a YouTube IFrame API com fallback para o embed do Bandcamp, e as capas vêm do CDN do Bandcamp.

## Rodar

O YouTube não toca em `file://`, então precisa de um servidor http:

```bash
python3 -m http.server 8421
```

Depois abra http://localhost:8421.

No Firefox, se o vídeo não começar sozinho, clique uma vez na tela do player (o Firefox bloqueia o autoplay dentro do iframe). Para liberar de vez: cadeado → Permissões → Reprodução automática → Permitir áudio e vídeo.

## Arquivos

- `albums.js`: catálogo (`HT_ALBUMS`) e fileiras (`HT_SHELVES`). Edite aqui para adicionar lançamentos.
- `app.js`: player, playlist, fileiras e ficha do lançamento.
- `bg3d.js`: fundo 3D.
- `style.css`, `index.html`
- `reports/`, `research_notes/`: pesquisa de estética que guiou o design.

Capas, artes e áudio pertencem aos artistas. Projeto de fã, sem afiliação.
