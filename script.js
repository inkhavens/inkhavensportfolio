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
      released:"July 2025", visits:160422, favorites:4850, playing:0,
      blurb:"An obby built on one mechanic. You throw a frisbee and it becomes whatever the level needs, a platform to stand on, a hook that catches a vine, or a shield that eats lava. Six throws per stage turns every room into a puzzle about aim and timing instead of pure parkour.",
      work:["Wrote the frisbee flight from scratch using raycast sweeps instead of physics parts, so fast throws never tunnel through walls",
            "Client side prediction with the server holding final say, so the throw feels instant but cannot be faked",
            "Built a data driven level framework where stages load from config, so new content ships without touching code",
            "Checkpoint and respawn state that survives a rejoin",
            "Cash economy and skin shop with every purchase validated on the server"] },
    { name:"Duel a Brainrot", url:"https://www.roblox.com/games/129670777283252/Duel-a-Brainrot",
      icon:"assets/duel-icon.png", thumb:"assets/duel-thumb.png", group:"Cowboy Simulator", role:"Programmer and owner",
      released:"December 2025", visits:152918, favorites:7887, playing:0,
      blurb:"A duel and progression game where you shoot to build strength, take on brainrots, and push into new areas. Full rebirth loop with pets, perks, and boosts, shipping a new update every week to a live player base.",
      work:["Server authoritative combat with hit validation and rate limits, so damage and rewards cannot be spoofed by an exploiter",
            "Session locked data saving with retries and rollback protection, so nobody loses an inventory to a crash",
            "Pet system with equipping, stacking stat modifiers, and caps that keep the economy from breaking",
            "Rebirth and progression curve tuned around retention rather than raw numbers",
            "Anti exploit passes over every remote that touches currency or items",
            "A weekly update pipeline that ships changes to a live game without wiping player data"] },
    { name:"Become a Cowboy", url:"https://www.roblox.com/games/97085651464740/Become-a-Cowboy",
      icon:"assets/cowboy-icon.png", thumb:"assets/cowboy-thumb.png", group:"Cowboy Simulator", role:"Programmer and owner",
      released:"September 2024", visits:35422, favorites:1108, playing:0,
      blurb:"A wild west simulator built on shooting, dueling, and steady progression. Players train strength, collect pets, rebirth for perks, and unlock new regions. This one came first, and most of the systems in it grew into everything I built after.",
      work:["Built the first version of the core systems that the later games inherited and improved on",
            "Currency, rebirth, and perk progression written from scratch",
            "Pet collection with server side ownership checks on every equip",
            "Region unlocking driven by saved player state, so progress holds across sessions",
            "Group reward verification through the Roblox API"] }
  ]
};

const fmt = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function gameCard(g){
  return '' +
  '<article class="panel game">' +
    '<div class="game__media">' +
      '<img src="' + g.thumb + '" alt="' + esc(g.name) + ' thumbnail">' +
    '</div>' +
    '<div class="game__body">' +
      '<div class="game__head">' +
        '<img class="game__icon" src="' + g.icon + '" alt="' + esc(g.name) + ' icon">' +
        '<div>' +
          '<h3>' + esc(g.name) + '</h3>' +
          '<p class="badge">' + esc(g.role) + ' &middot; ' + esc(g.group) + ' &middot; ' + esc(g.released) + '</p>' +
        '</div>' +
      '</div>' +
      '<p>' + esc(g.blurb) + '</p>' +
      '<div class="game__work">' +
        '<p class="panel__caption">What I built</p>' +
        '<ul class="bullets">' + g.work.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul>' +
      '</div>' +
      '<div class="grid-3">' +
        '<div class="cell"><span class="cell__value">' + fmt(g.visits) + '</span><span class="cell__label">Visits</span></div>' +
        '<div class="cell"><span class="cell__value">' + fmt(g.favorites) + '</span><span class="cell__label">Favorites</span></div>' +
        '<div class="cell"><span class="cell__value">' + fmt(g.playing) + '</span><span class="cell__label">Playing now</span></div>' +
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

/* ============================================================
   Work examples and the detail modal
   ============================================================ */
let WORK = [];

function workCard(w, i){
  return '' +
  '<article class="panel work">' +
    '<div class="work__media">' +
      '<img src="' + w.cover + '" alt="' + esc(w.title) + '">' +
      (w.video ? '<span class="work__flag">Video &middot; ' + esc(w.video.length) + '</span>' : '') +
    '</div>' +
    '<div class="work__body">' +
      '<p class="badge">' + esc(w.tag) + '</p>' +
      '<h3>' + esc(w.title) + '</h3>' +
      '<p>' + esc(w.short) + '</p>' +
      '<button class="btn" type="button" data-work="' + i + '">View more</button>' +
    '</div>' +
  '</article>';
}

/* Minimal Lua highlighter. Single pass so nothing gets escaped twice.
   Kept local on purpose, no external library and no link back to a source. */
function highlightLua(src){
  const re = /(--\[\[[\s\S]*?\]\]|--[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b(?:local|function|return|end|if|then|else|elseif|for|while|do|in|not|and|or|true|false|nil)\b)/g;
  let out = '', last = 0, m;
  while((m = re.exec(src)) !== null){
    if(m.index > last) out += esc(src.slice(last, m.index));
    if(m[1])      out += '<span class="c-com">' + esc(m[1]) + '</span>';
    else if(m[2]) out += '<span class="c-str">' + esc(m[2]) + '</span>';
    else if(m[3]) out += '<span class="c-num">' + esc(m[3]) + '</span>';
    else if(m[4]) out += '<span class="c-kw">'  + esc(m[4]) + '</span>';
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

function codeBlock(code){
  if(!code || !code.lines) return '';
  const src  = code.lines.join('\n');
  const nums = code.lines.map((_, i) => i + 1).join('\n');
  return '' +
    '<div class="modal__block">' +
      '<p class="modal__caption">' + esc(code.filename) + '</p>' +
      (code.caption ? '<p class="code__note">' + esc(code.caption) + '</p>' : '') +
      '<div class="code" data-noselect>' +
        '<pre class="code__nums" aria-hidden="true">' + nums + '</pre>' +
        '<pre class="code__src"><code>' + highlightLua(src) + '</code></pre>' +
      '</div>' +
    '</div>';
}

function workDetail(w){
  const video = w.video && w.video.provider === 'vimeo'
    ? '<div class="modal__video">' +
        '<iframe src="https://player.vimeo.com/video/' + esc(w.video.id) + '" ' +
        'title="' + esc(w.title) + ' demo" frameborder="0" ' +
        'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>' +
      '</div>'
    : '';

  const shots = (w.shots || []).map(s =>
    '<figure class="shot">' +
      '<img src="' + s.src + '" alt="' + esc(s.caption) + '">' +
      '<figcaption>' + esc(s.caption) + '</figcaption>' +
    '</figure>').join('');

  const block = (title, arr) => arr && arr.length
    ? '<div class="modal__block">' +
        '<p class="modal__caption">' + title + '</p>' +
        '<ul class="bullets">' + arr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
      '</div>'
    : '';

  return '' +
    '<p class="badge">' + esc(w.tag) + '</p>' +
    '<h3 id="modal-title" class="modal__title">' + esc(w.title) + '</h3>' +
    video +
    '<div class="modal__block">' + (w.body || []).map(p => '<p>' + esc(p) + '</p>').join('') + '</div>' +
    block('What it does', w.features) +
    block('How it is put together', w.architecture) +
    codeBlock(w.code) +
    (shots ? '<div class="modal__block"><p class="modal__caption">Inside the project</p><div class="shots">' + shots + '</div></div>' : '') +
    (w.video ? '<p><a class="link" href="' + w.video.url + '" target="_blank" rel="noopener">Open the video on Vimeo &rarr;</a></p>' : '');
}

const modal     = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
let lastFocused = null;

function openModal(i){
  const w = WORK[i];
  if(!w || !modal) return;
  lastFocused = document.activeElement;
  modalBody.innerHTML = workDetail(w);
  modal.hidden = false;
  document.body.classList.add('is-locked');
  modal.querySelector('.modal__scroll').scrollTop = 0;
  const close = modal.querySelector('.modal__close');
  if(close) close.focus();
}

function closeModal(){
  if(!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('is-locked');
  modalBody.innerHTML = '';           // stops the video playing
  if(lastFocused) lastFocused.focus();
}

if(modal){
  modal.addEventListener('click', e => { if(e.target.hasAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  /* Friction against casual copying of the code block. This is not real
     protection, since anything rendered is readable from the page source. */
  const guard = e => { if(e.target.closest && e.target.closest('[data-noselect]')) e.preventDefault(); };
  modal.addEventListener('copy', guard);
  modal.addEventListener('cut', guard);
  modal.addEventListener('contextmenu', guard);
  modal.addEventListener('dragstart', guard);
}

function renderWork(data){
  const list = document.getElementById('work-list');
  if(!list) return;
  WORK = data.items || [];
  list.innerHTML = WORK.map(workCard).join('');
  list.querySelectorAll('[data-work]').forEach(btn => {
    btn.addEventListener('click', () => openModal(Number(btn.dataset.work)));
  });
}

fetch('data/work.json', { cache:'no-store' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(renderWork)
  .catch(() => {
    const list = document.getElementById('work-list');
    if(list) list.innerHTML = '<p class="section__sub">Work examples could not be loaded.</p>';
  });

/* ============================================================
   Site visitor count
   Stays hidden if the request fails, so a blocked tracker never
   leaves a broken line in the footer.
   ============================================================ */
fetch('https://inkhavens.goatcounter.com/counter/TOTAL.json')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(d => {
    const el = document.getElementById('site-count');
    if(!el || !d || !d.count) return;

    // count arrives as a formatted string, e.g. "1,234"
    const n = parseInt(String(d.count).replace(/[^0-9]/g, ''), 10);
    if(!n) return;                       // nothing worth showing at zero

    el.innerHTML = n === 1
      ? '<b>1</b> person has viewed this portfolio!'
      : '<b>' + esc(d.count) + '</b> people have viewed this portfolio!';
    el.hidden = false;
  })
  .catch(() => {});

/* ---------- smooth scroll for the header menu ---------- */
document.querySelectorAll('.menu a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    const header = document.querySelector('.header');
    const top = target.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight : 0) - 12;
    window.scrollTo({ top, behavior:'smooth' });
  });
});
