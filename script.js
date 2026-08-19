/* ============================================================
   inkhavens portfolio
   Renders the games section from data/games.json.
   ============================================================ */

/* Fallback data, used only if the JSON cannot be fetched
   (for example when the page is opened straight from disk). */
const FALLBACK = {
  updated: "2026-08-18T00:00:00Z",
  games: [
    { name:"Obby But With A Frisbee", url:"https://www.roblox.com/games/89264631334016/Obby-But-With-A-Frisbee",
      icon:"assets/frisbee-icon.png", thumb:"assets/frisbee-thumb.png", group:"Erthlord", role:"Programmer",
      released:"July 2025", visits:160422, favorites:4850, playing:0, peakCCU:null,
      blurb:"An obby built around one idea. You carry a frisbee and you throw it to solve every level. The frisbee becomes a platform you can stand on, a hook that sticks to vines, and a shield that blocks lava. You get six throws to work with, so each level turns into a small puzzle about aim and timing rather than pure parkour.",
      work:["Built the full frisbee throw system, including flight path, collision, and stick behavior",
            "Wrote the level and checkpoint framework that every stage runs on",
            "Made the cash reward loop and the frisbee skin unlock shop",
            "Handled client and server replication so throws feel instant but stay secure"] },
    { name:"Duel a Brainrot", url:"https://www.roblox.com/games/129670777283252/Duel-a-Brainrot",
      icon:"assets/duel-icon.png", thumb:"assets/duel-thumb.png", group:"Cowboy Simulator", role:"Programmer",
      released:"December 2025", visits:152918, favorites:7887, playing:0, peakCCU:null,
      blurb:"A duel and progression game where you shoot to build strength, take on brainrot enemies, and push into new areas. It runs on a full rebirth loop with pets, perks, and boosts, and it ships a new update every week.",
      work:["Built the duel and combat system with server side hit checks",
            "Wrote the strength, rebirth, and perk progression loop",
            "Made the pet system with collection, equipping, and stat boosts",
            "Set up saving with retry and session locking so player data does not get lost",
            "Built the area unlock flow and the weekly update pipeline"] },
    { name:"Become a Cowboy", url:"https://www.roblox.com/games/97085651464740/Become-a-Cowboy",
      icon:"assets/cowboy-icon.png", thumb:"assets/cowboy-thumb.png", group:"Cowboy Simulator", role:"Programmer",
      released:"September 2024", visits:35422, favorites:1108, playing:0, peakCCU:null,
      blurb:"A wild west simulator built on shooting, dueling, and steady progression. Players train strength, collect pets, rebirth for perks, and unlock new regions of the map. This one came first and the systems in it grew into the later projects.",
      work:["Built the core shooting and strength gain loop",
            "Wrote the rebirth and perk system",
            "Made the pet collection and boost system",
            "Built the region unlock progression and the group reward check"] }
  ]
};

const fmt = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function gameCard(g){
  // The public Roblox API does not expose peak concurrent players,
  // so show a dash until the number is filled in by hand.
  const peak = (g.peakCCU === null || g.peakCCU === undefined)
    ? '<div class="gstat tbd"><span>Peak CCU</span><b>&mdash;</b></div>'
    : '<div class="gstat"><span>Peak CCU</span><b>' + fmt(g.peakCCU) + '</b></div>';

  return '' +
  '<article class="panel game">' +
    '<div class="game-media">' +
      '<img src="' + g.thumb + '" alt="' + esc(g.name) + ' thumbnail">' +
    '</div>' +
    '<div class="game-body">' +
      '<div class="game-head">' +
        '<img class="game-icon" src="' + g.icon + '" alt="' + esc(g.name) + ' icon">' +
        '<div>' +
          '<h3>' + esc(g.name) + '</h3>' +
          '<p class="role">' + esc(g.role) + ' &middot; ' + esc(g.group) + ' &middot; released ' + esc(g.released) + '</p>' +
        '</div>' +
      '</div>' +
      '<p>' + esc(g.blurb) + '</p>' +
      '<div>' +
        '<p class="work-title">What I built</p>' +
        '<ul class="work">' + g.work.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul>' +
      '</div>' +
      '<div class="gstats">' +
        '<div class="gstat"><span>Visits</span><b>' + fmt(g.visits) + '</b></div>' +
        '<div class="gstat"><span>Favorites</span><b>' + fmt(g.favorites) + '</b></div>' +
        peak +
        '<div class="gstat"><span>Playing now</span><b>' + fmt(g.playing) + '</b></div>' +
      '</div>' +
      '<p><a class="link" href="' + g.url + '" target="_blank" rel="noopener">Play the game &rarr;</a></p>' +
    '</div>' +
  '</article>';
}

function render(data){
  const list = document.getElementById('game-list');
  if(!list) return;
  list.innerHTML = data.games.map(gameCard).join('');

  const line = document.getElementById('updated-line');
  if(line && data.updated){
    const d = new Date(data.updated);
    line.textContent = 'Counts pulled from the Roblox API. Last updated ' +
      d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', timeZone:'UTC' }) + '.';
  }
}

fetch('data/games.json', { cache:'no-store' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(render)
  .catch(() => render(FALLBACK));
