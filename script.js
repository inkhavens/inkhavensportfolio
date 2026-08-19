/* ============================================================
   inkhavens portfolio
   ============================================================ */

/* ---------- fallback data (used if fetch is blocked, e.g. file://) ---------- */
const FALLBACK = {
  updated: "2026-08-18T00:00:00Z",
  games: [
    { name:"Obby But With A Frisbee", url:"https://www.roblox.com/games/89264631334016/Obby-But-With-A-Frisbee",
      icon:"assets/frisbee-icon.png", thumb:"assets/frisbee-thumb.png", group:"Erthlord", role:"Programmer",
      released:"July 2025", visits:160422, favorites:4850, playing:0, maxPlayers:8, peakCCU:null,
      blurb:"An obby built around one idea. You carry a frisbee and you throw it to solve every level. The frisbee becomes a platform you can stand on, a hook that sticks to vines, and a shield that blocks lava. You get six throws to work with, so each level turns into a small puzzle about aim and timing rather than pure parkour.",
      work:["Built the full frisbee throw system, including flight path, collision, and stick behavior",
            "Wrote the level and checkpoint framework that every stage runs on",
            "Made the cash reward loop and the frisbee skin unlock shop",
            "Handled client and server replication so throws feel instant but stay secure"] },
    { name:"Duel a Brainrot", url:"https://www.roblox.com/games/129670777283252/Duel-a-Brainrot",
      icon:"assets/duel-icon.png", thumb:"assets/duel-thumb.png", group:"Cowboy Simulator", role:"Programmer",
      released:"December 2025", visits:152918, favorites:7887, playing:0, maxPlayers:20, peakCCU:null,
      blurb:"A duel and progression game where you shoot to build strength, take on brainrot enemies, and push into new areas. It runs on a full rebirth loop with pets, perks, and boosts, and it ships a new update every week.",
      work:["Built the duel and combat system with server side hit checks",
            "Wrote the strength, rebirth, and perk progression loop",
            "Made the pet system with collection, equipping, and stat boosts",
            "Set up saving with retry and session locking so player data does not get lost",
            "Built the area unlock flow and the weekly update pipeline"] },
    { name:"Become a Cowboy", url:"https://www.roblox.com/games/97085651464740/Become-a-Cowboy",
      icon:"assets/cowboy-icon.png", thumb:"assets/cowboy-thumb.png", group:"Cowboy Simulator", role:"Programmer",
      released:"September 2024", visits:35422, favorites:1108, playing:0, maxPlayers:10, peakCCU:null,
      blurb:"A wild west simulator built on shooting, dueling, and steady progression. Players train strength, collect pets, rebirth for perks, and unlock new regions of the map. This one came first and the systems in it grew into the later projects.",
      work:["Built the core shooting and strength gain loop",
            "Wrote the rebirth and perk system",
            "Made the pet collection and boost system",
            "Built the region unlock progression and the group reward check"] }
  ]
};

const fmt = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ============================================================
   1. animated background
   ============================================================ */
(function background(){
  const cv = document.getElementById('bg');
  if(!cv) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ cv.style.display='none'; return; }
  const ctx = cv.getContext('2d');
  let w, h, dots = [], raf;

  function size(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.width  = innerWidth  * dpr;
    h = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = innerWidth; h = innerHeight;
    build();
  }
  function build(){
    const count = Math.min(72, Math.floor((w * h) / 20000));
    dots = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.5 + .55
    }));
  }
  function tick(){
    ctx.clearRect(0, 0, w, h);
    for(const d of dots){
      d.x += d.vx; d.y += d.vy;
      if(d.x < 0) d.x = w; if(d.x > w) d.x = 0;
      if(d.y < 0) d.y = h; if(d.y > h) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,175,255,.42)';
      ctx.fill();
    }
    for(let i = 0; i < dots.length; i++){
      for(let j = i + 1; j < dots.length; j++){
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = dx * dx + dy * dy;
        if(dist < 17000){
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(110,140,235,' + (.16 * (1 - dist / 17000)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(tick);
  }
  addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) cancelAnimationFrame(raf); else tick();
  });
  size(); tick();
})();

/* ============================================================
   2. nav shadow on scroll
   ============================================================ */
(function nav(){
  const el = document.querySelector('.nav');
  const on = () => el.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', on, { passive:true }); on();
})();

/* ============================================================
   3. count up numbers
   ============================================================ */
function countUp(el){
  const target = Number(el.dataset.count);
  if(!target){ el.textContent = fmt(target); return; }
  const dur = 1500, start = performance.now();
  function step(now){
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.floor(target * eased));
    if(p < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   4. reveal on scroll
   ============================================================ */
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(!e.isIntersecting) continue;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    if(e.target.hasAttribute('data-count')) countUp(e.target);
    io.unobserve(e.target);
  }
}, { threshold:.15, rootMargin:'0px 0px -40px 0px' });

function watch(scope){
  (scope || document).querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
    io.observe(el);
  });
}

/* ============================================================
   5. render games
   ============================================================ */
function gameCard(g){
  const peak = (g.peakCCU === null || g.peakCCU === undefined)
    ? '<div class="gstat tbd"><b>&mdash;</b><span>Peak CCU</span></div>'
    : '<div class="gstat"><b>' + fmt(g.peakCCU) + '</b><span>Peak CCU</span></div>';

  return '' +
  '<article class="card game reveal">' +
    '<div class="game-media">' +
      '<img src="' + g.thumb + '" alt="' + esc(g.name) + ' thumbnail" loading="lazy">' +
    '</div>' +
    '<div class="game-body">' +
      '<div class="game-head">' +
        '<img class="game-icon" src="' + g.icon + '" alt="' + esc(g.name) + ' icon" loading="lazy">' +
        '<div class="game-title">' +
          '<h3>' + esc(g.name) + '</h3>' +
          '<div class="game-sub">' + esc(g.role) + ' &middot; ' + esc(g.group) + ' &middot; released ' + esc(g.released) + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="game-blurb">' + esc(g.blurb) + '</p>' +
      '<div>' +
        '<div class="work-title">What I built</div>' +
        '<ul class="work">' + g.work.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul>' +
      '</div>' +
      '<div class="gstats">' +
        '<div class="gstat"><b>' + fmt(g.visits) + '</b><span>Visits</span></div>' +
        '<div class="gstat"><b>' + fmt(g.favorites) + '</b><span>Favorites</span></div>' +
        peak +
        '<div class="gstat live"><b>' + fmt(g.playing) + '</b><span>Playing now</span></div>' +
      '</div>' +
      '<div class="game-actions">' +
        '<a class="btn btn-primary sm" href="' + g.url + '" target="_blank" rel="noopener">Play the game</a>' +
      '</div>' +
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
    line.textContent = 'Live counts pulled from the Roblox API. Last updated ' +
      d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) + '.';
  }
  watch(list);
}

fetch('data/games.json', { cache:'no-store' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(render)
  .catch(() => render(FALLBACK));

watch(document);
