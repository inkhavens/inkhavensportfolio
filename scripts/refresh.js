// Pulls live visit / favorite / player counts from the Roblox API
// and writes them into data/games.json. Hand written fields are kept.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'games.json');

async function main() {
  const doc = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ids = doc.games.map(g => g.id).join(',');

  const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${ids}`);
  if (!res.ok) throw new Error(`Roblox API returned ${res.status}`);
  const { data } = await res.json();

  const byId = new Map(data.map(d => [d.id, d]));
  let totalVisits = 0;
  let totalFavorites = 0;

  for (const game of doc.games) {
    const live = byId.get(game.id);
    if (!live) {
      console.warn(`No API data for ${game.name} (${game.id}), leaving as is.`);
      totalVisits += game.visits;
      totalFavorites += game.favorites;
      continue;
    }
    game.visits = live.visits;
    game.favorites = live.favoritedCount;
    game.playing = live.playing;
    game.maxPlayers = live.maxPlayers;

    totalVisits += live.visits;
    totalFavorites += live.favoritedCount;
    console.log(`${game.name}: ${live.visits} visits, ${live.playing} playing`);
  }

  doc.totals = { visits: totalVisits, favorites: totalFavorites };
  doc.updated = new Date().toISOString();

  fs.writeFileSync(FILE, JSON.stringify(doc, null, 2) + '\n');
  console.log(`Wrote ${FILE}`);
}

main().catch(err => { console.error(err); process.exit(1); });
