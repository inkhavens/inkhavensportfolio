# inkhavens portfolio

Roblox programming portfolio. Static site, no build step.

**Live:** https://inkhavens.github.io/inkhavensportfolio/

## Files

| Path | What it does |
| --- | --- |
| `index.html` | Page markup and all written copy |
| `styles.css` | All styling, dark theme, animations |
| `script.js` | Background canvas, scroll reveals, count up numbers, game rendering |
| `data/games.json` | Game data. Stats refresh on their own, text is hand written |
| `scripts/refresh.js` | Pulls live numbers from the Roblox API |
| `.github/workflows/refresh-stats.yml` | Runs the refresh every 6 hours |
| `assets/` | Game icons, thumbnails, group icons, video thumbnail |

## Editing content

Almost everything lives in `data/games.json`. Fields that refresh on their own:

- `visits`
- `favorites`
- `playing`
- `maxPlayers`

Fields that are hand written and never overwritten:

- `blurb` — the game description
- `work` — the list of what was built
- `role`, `group`, `released`

## Running it locally

```
npx serve .
```

Opening `index.html` straight from disk also works. The page falls back to a copy of
the data baked into `script.js` when it cannot fetch the JSON file.
