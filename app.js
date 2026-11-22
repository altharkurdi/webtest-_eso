(function () {
'use strict';
var LG = ['ckb', 'ar', 'en'], DIR = { ckb: 'rtl', ar: 'rtl', en: 'ltr' }, LN = { ckb: 'کوردی', ar: 'العربية', en: 'EN' };
var U = {
  hi: ['سڵاو، من', 'مرحباً، أنا', "Hi, I'm"], welcome: ['بەخێربێن ✦', 'أهلاً بكم ✦', 'Welcome ✦'],
  cta1: ['کارەکانم ببینە', 'شاهد أعمالي', 'See my work'], cta2: ['پەیوەندیم پێوە بکە', 'تواصل معي', 'Contact me'],
  news: ['گزنگ', 'عاجل', 'NEWS'], views: ['بینەر', 'زائر', 'Visitors'], works: ['کار', 'عمل', 'Projects'], clients: ['کڕیار', 'عميل', 'Clients'],
  name: ['ناو', 'الاسم', 'Name'], contact: ['ئیمەیڵ یان ژمارە', 'البريد أو الهاتف', 'Email or phone'], msg: ['نامەکەت', 'رسالتك', 'Your message'],
  send: ['ناردن', 'إرسال', 'Send'], sent: ['نامەکەت نێردرا. سوپاس!', 'تم الإرسال. شكراً!', 'Message sent. Thank you!'], err: ['کێشەیەک ڕوویدا', 'حدث خطأ', 'Something went wrong'],
  rights: ['هەموو مافەکان پارێزراون', 'جميع الحقوق محفوظة', 'All rights reserved'], open: ['بینین ↗', 'عرض ↗', 'Open ↗'],
  email: ['ئیمەیڵ', 'البريد', 'Email'], phone: ['تەلەفۆن', 'الهاتف', 'Phone'], addr: ['ناونیشان', 'العنوان', 'Address']
};
var SEC = {
  about: ['دەربارە', 'نبذة عني', 'About'], services: ['خزمەتگوزارییەکان', 'الخدمات', 'Services'], skills: ['شارەزایییەکان', 'المهارات', 'Skills'],
  works: ['کارەکان', 'الأعمال', 'Portfolio'], process: ['شێوازی کارکردن', 'طريقة العمل', 'How I Work'], pricing: ['نرخەکان', 'الأسعار', 'Pricing'],
  testimonials: ['ڕای کڕیارەکان', 'آراء العملاء', 'Testimonials'], clients: ['کڕیارەکانمان', 'عملاؤنا', 'Clients'], team: ['تیم', 'الفريق', 'Team'],
  gallery: ['گاڵێری', 'المعرض', 'Gallery'], posts: ['پۆستەکان', 'المقالات', 'Posts'], faq: ['پرسیارە باوەکان', 'أسئلة شائعة', 'FAQ'], contact: ['پەیوەندی', 'تواصل', 'Contact']
};
var ORDER = ['services', 'skills', 'works', 'process', 'pricing', 'testimonials', 'clients', 'team', 'gallery', 'posts', 'faq'];
var NAVS = ['about', 'services', 'works', 'pricing', 'posts', 'contact'];
var lang = 'ckb', D = null, tyTok = 0;
try { lang = localStorage.getItem('lang') || ''; } catch (e) { }
if (LG.indexOf(lang) < 0) { var nl = (navigator.language || '').toLowerCase(); lang = nl.indexOf('ar') === 0 ? 'ar' : (nl.indexOf('ku') === 0 || nl.indexOf('ckb') === 0) ? 'ckb' : nl.indexOf('en') === 0 ? 'en' : 'ckb'; }
function t(k) { return U[k][LG.indexOf(lang)]; }
function st(k) { return SEC[k][LG.indexOf(lang)]; }
function pick(o) { return o ? (o[lang] || o.ckb || o.en || o.ar || '') : ''; }
function h(tag, a, kids) {
  var e = document.createElement(tag);
  if (a) for (var k in a) { if (a[k] != null) e.setAttribute(k, a[k]); }
  (kids || []).forEach(function (c) { if (c == null || c === '') return; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
  return e;
}
function safe(u) { return /^https?:\/\//i.test(u || '') ? u : null; }
function lines(s) { return String(s || '').split('\n').filter(Boolean); }

/* ---- bg particles ---- */
var c = document.getElementById('bg'), x = c.getContext('2d'), W, H, P = [];
function rs() { W = c.width = innerWidth; H = c.height = innerHeight; } rs(); addEventListener('resize', rs);
for (var i = 0; i < 70; i++) P.push({ x: Math.random() * 1600, y: Math.random() * 1000, vx: Math.random() - .5, vy: Math.random() - .5 });
(function dr() {
  x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(139,92,246,.8)';
  for (var i = 0; i < P.length; i++) {
    var p = P[i]; p.x += p.vx * .5; p.y += p.vy * .5; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
    x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill();
    for (var j = i + 1; j < P.length; j++) { var q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 120) { x.strokeStyle = 'rgba(34,211,238,' + (.22 * (1 - d / 120)) + ')'; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } }
  }
  requestAnimationFrame(dr);
})();
addEventListener('pointermove', function (e) { var g = document.getElementById('gl'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: .1 });
function tilt(n) {
  n.addEventListener('pointermove', function (e) { var r = n.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; n.style.transform = 'perspective(700px) rotateY(' + px * 9 + 'deg) rotateX(' + (-py * 9) + 'deg) translateY(-4px)'; });
  n.addEventListener('pointerleave', function () { n.style.transform = ''; });
}
function typeIt(el, s) { var k = ++tyTok, i = 0; (function s1() { if (k !== tyTok) return; el.textContent = s.slice(0, ++i) + (i < s.length ? '▏' : ''); if (i < s.length) setTimeout(s1, 40); })(); }


/* ---- social icons ---- */
var NS = 'http://www.w3.org/2000/svg';
function sv(tag, a, kids) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); (kids || []).forEach(function (c) { e.appendChild(c); }); return e; }
function stx(s, a) { var e = sv('text', a); e.textContent = s; return e; }
var W_ = '#fff';
var IC = {
  facebook: function () { return [sv('circle', { cx: 20, cy: 20, r: 20, fill: '#1877F2' }), stx('f', { x: 22.5, y: 34, 'font-size': 32, 'font-weight': 800, 'text-anchor': 'middle', fill: W_, 'font-family': 'Poppins,Arial,sans-serif' })]; },
  instagram: function () { var g = sv('linearGradient', { id: 'igg', x1: 0, y1: 1, x2: 1, y2: 0 }, [sv('stop', { offset: '0', 'stop-color': '#FEDA75' }), sv('stop', { offset: '.35', 'stop-color': '#FA7E1E' }), sv('stop', { offset: '.65', 'stop-color': '#D62976' }), sv('stop', { offset: '1', 'stop-color': '#4F5BD5' })]);
    return [sv('defs', {}, [g]), sv('rect', { width: 40, height: 40, rx: 11, fill: 'url(#igg)' }), sv('rect', { x: 9, y: 9, width: 22, height: 22, rx: 7, fill: 'none', stroke: W_, 'stroke-width': 2.4 }), sv('circle', { cx: 20, cy: 20, r: 5.3, fill: 'none', stroke: W_, 'stroke-width': 2.4 }), sv('circle', { cx: 26.8, cy: 13.2, r: 1.5, fill: W_ })]; },
  tiktok: function () { var d = 'M22 9v14a5 5 0 1 1-5-5M22 9c.5 3.4 2.8 5.4 6.5 5.8'; var p = function (c, dx, dy) { return sv('path', { d: d, fill: 'none', stroke: c, 'stroke-width': 3.2, 'stroke-linecap': 'round', transform: 'translate(' + dx + ' ' + dy + ')' }); };
    return [sv('rect', { width: 40, height: 40, rx: 11, fill: '#111', stroke: 'rgba(255,255,255,.2)' }), p('#25F4EE', -1.3, -.6), p('#FE2C55', 1.3, .8), p(W_, 0, 0)]; },
  linkedin: function () { return [sv('rect', { width: 40, height: 40, rx: 9, fill: '#0A66C2' }), stx('in', { x: 20, y: 28, 'font-size': 21, 'font-weight': 800, 'text-anchor': 'middle', fill: W_, 'font-family': 'Poppins,Arial,sans-serif' })]; },
  whatsapp: function () { return [sv('circle', { cx: 20, cy: 20, r: 20, fill: '#25D366' }), sv('path', { d: 'M11 30l1.6-5.4A9.6 9.6 0 1 1 16 28.6z', fill: 'none', stroke: W_, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }), sv('path', { d: 'M16.6 15.6c-.7 1.1.3 3.3 2.6 5.5s4.5 3 5.6 2.4l.9-1.4-2.4-1.4-1.1 1c-1-.4-2.5-1.9-3-3.1l1-1.1-1.4-2.4z', fill: W_ })]; },
  telegram: function () { return [sv('circle', { cx: 20, cy: 20, r: 20, fill: '#229ED9' }), sv('path', { d: 'M9 19.6l21-8.2-3.4 17.4-6.2-4.6-3.1 3 .5-5.4 9.5-8.6-11.6 7z', fill: W_ })]; },
  youtube: function () { return [sv('rect', { x: 1, y: 7, width: 38, height: 26, rx: 8, fill: '#FF0000' }), sv('path', { d: 'M16 14l10.5 6L16 26z', fill: W_ })]; },
  x: function () { return [sv('rect', { width: 40, height: 40, rx: 11, fill: '#111', stroke: 'rgba(255,255,255,.25)' }), stx('X', { x: 20, y: 29, 'font-size': 23, 'font-weight': 800, 'text-anchor': 'middle', fill: W_, 'font-family': 'Poppins,Arial,sans-serif' })]; },
  email: function () { return [sv('rect', { width: 40, height: 40, rx: 11, fill: '#EA4335' }), sv('rect', { x: 9, y: 12, width: 22, height: 16, rx: 2.6, fill: 'none', stroke: W_, 'stroke-width': 2.3 }), sv('path', { d: 'M10 14l10 8 10-8', fill: 'none', stroke: W_, 'stroke-width': 2.3, 'stroke-linejoin': 'round' })]; }
};
var SORDER = ['tiktok', 'facebook', 'instagram', 'linkedin', 'whatsapp', 'telegram', 'youtube', 'x'];
function socials(P0) {
  var S = P0.socials || {}, list = [];
  if (P0.email) list.push(['email', 'mailto:' + P0.email]);
  SORDER.forEach(function (k) { var u = safe(S[k]); if (u) list.push([k, u]); });
  if (!list.length) return null;
  return h('div', { class: 'socials' }, list.map(function (it) {
    var s = sv('svg', { viewBox: '0 0 40 40', 'aria-hidden': 'true' }, IC[it[0]]());
    var a = h('a', { class: 'so', href: it[1], target: '_blank', rel: 'noopener noreferrer', title: it[0], 'aria-label': it[0] }); a.appendChild(s); return a;
  }));
}

/* ---- renderers ---- */
function lk(i) { var u = safe(i.link); return u ? h('a', { href: u, target: '_blank', rel: 'noopener noreferrer' }, [t('open')]) : null; }
var R = {
  services: function (i, n) { return h('div', { class: 'card rv' }, [h('div', { class: 'ic' }, [String(n + 1)]), h('h3', 0, [pick(i.title)]), h('p', 0, [pick(i.body)])]); },
  skills: function (i) { var v = Math.max(0, Math.min(100, parseInt(i.extra, 10) || 0)), b = h('i'); b.style.setProperty('--w', v + '%'); return h('div', { class: 'sk rv' }, [h('div', 0, [h('span', 0, [pick(i.title)]), h('span', 0, [v + '%'])]), h('div', { class: 'bar' }, [b])]); },
  works: function (i) { return h('div', { class: 'card rv' }, [h('h3', 0, [pick(i.title)]), h('p', 0, [pick(i.body)]), lk(i)]); },
  process: function (i, n) { return h('div', { class: 'card rv' }, [h('div', { class: 'ic' }, [String(n + 1)]), h('h3', 0, [pick(i.title)]), h('p', 0, [pick(i.body)])]); },
  pricing: function (i) { return h('div', { class: 'card rv' }, [h('h3', 0, [pick(i.title)]), h('div', { class: 'price' }, [i.extra]), h('ul', 0, lines(pick(i.body)).map(function (l) { return h('li', 0, [l]); })), lk(i)]); },
  testimonials: function (i) { return h('div', { class: 'card rv' }, [h('p', { class: 'q' }, ['“' + pick(i.body) + '”']), h('h3', { style: 'margin-top:12px' }, [pick(i.title)]), h('small', 0, [i.extra])]); },
  clients: function (i) { var u = safe(i.link); return h(u ? 'a' : 'span', Object.assign({ class: 'pill rv' }, u ? { href: u, target: '_blank', rel: 'noopener noreferrer' } : {}), [pick(i.title)]); },
  team: function (i) { return h('div', { class: 'card rv' }, [h('div', { class: 'ic' }, [pick(i.title).charAt(0)]), h('h3', 0, [pick(i.title)]), h('small', 0, [i.extra]), h('p', 0, [pick(i.body)]), lk(i)]); },
  gallery: function (i) { var u = safe(i.link); return u ? h('img', { class: 'rv', src: u, alt: pick(i.title), loading: 'lazy', referrerpolicy: 'no-referrer' }) : null; },
  posts: function (i) { return h('div', { class: 'card rv' }, [h('h3', 0, [pick(i.title)]), h('p', 0, [pick(i.body)]), lk(i)]); },
  faq: function (i) { return h('details', { class: 'rv' }, [h('summary', 0, [pick(i.title)]), h('p', 0, [pick(i.body)])]); }
};
var CLS = { clients: 'pills', faq: '', skills: 'grid', gallery: 'grid gal' };
function sec(id, kids) { return h('section', { id: id }, [h('h2', { class: 'rv' }, [st(id)])].concat(kids)); }
function render() {
  var P0 = D.profile, name = pick(P0.name), app = document.getElementById('app');
  document.documentElement.lang = lang; document.documentElement.dir = DIR[lang]; document.title = name;
  app.textContent = '';
  var sub = h('p', { class: 'sub' });
  app.appendChild(h('section', { class: 'hero', id: 'home' }, [h('span', { class: 'tag' }, [t('welcome')]), h('h1', 0, [t('hi') + ' ', h('span', 0, [name])]), sub,
    h('div', { class: 'btns' }, [h('a', { class: 'btn p', href: '#works' }, [t('cta1')]), h('a', { class: 'btn', href: '#contact' }, [t('cta2')])])]));
  typeIt(sub, pick(P0.tagline));
  var by = {}; ORDER.forEach(function (k) { by[k] = D.items.filter(function (i) { return i.kind === k; }); });
  ['works', 'posts'].forEach(function (k) { by[k].sort(function (a, b) { return b.ts - a.ts; }); });
  var vis = {};
  var st1 = h('div', { class: 'stats rv' }, [[D.views, t('views')], [by.works.length, t('works')], [by.clients.length, t('clients')]].map(function (a) { return h('div', { class: 'card stat' }, [h('b', 0, [String(a[0])]), a[1]]); }));
  app.appendChild(sec('about', [h('div', { class: 'card rv' }, [h('p', 0, [pick(P0.bio)])]), st1]));
  ORDER.forEach(function (k) {
    if (!by[k].length) return; vis[k] = 1;
    var kids = by[k].map(function (i, n) { return R[k](i, n); }).filter(Boolean);
    var cls = CLS[k] === undefined ? 'grid' : CLS[k];
    app.appendChild(sec(k, [h('div', cls ? { class: cls } : null, kids)]));
  });
  /* contact */
  var info = h('div', { class: 'card rv' }, [[t('email'), P0.email], [t('phone'), P0.phone], [t('addr'), pick(P0.address)]].filter(function (r) { return r[1]; }).map(function (r) { return h('p', 0, [r[0] + ': ' + r[1]]); }).concat([socials(P0)]));
  var fm = h('p', { class: 'fm' }), nm = h('input', { placeholder: t('name'), maxlength: 100 }), ct = h('input', { placeholder: t('contact'), maxlength: 150 }),
    tx = h('textarea', { rows: 5, placeholder: t('msg'), maxlength: 2000 }), hp = h('input', { class: 'hp', tabindex: -1, autocomplete: 'off', placeholder: 'website' }), bt = h('button', { class: 'btn p', type: 'submit' }, [t('send')]);
  var f = h('form', { class: 'card rv' }, [nm, ct, tx, hp, bt, fm]);
  f.addEventListener('submit', function (e) {
    e.preventDefault(); if (!tx.value.trim()) return; bt.disabled = true;
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nm.value, contact: ct.value, text: tx.value, website: hp.value }) })
      .then(function (r) { if (!r.ok) throw 0; fm.textContent = t('sent'); nm.value = ct.value = tx.value = ''; }).catch(function () { fm.textContent = t('err'); }).then(function () { bt.disabled = false; });
  });
  app.appendChild(sec('contact', [h('div', { class: 'cg' }, [info, f])]));
  /* nav + footer */
  var news = D.items.filter(function (i) { return i.kind === 'news' && pick(i.title); }).sort(function (a, b) { return b.ts - a.ts; });
  document.body.classList.toggle('hasnews', news.length > 0);
  var nav = document.getElementById('nav'); nav.textContent = '';
  var lg = h('div', { class: 'lg' }, LG.map(function (l) { var b = h('button', { class: l === lang ? 'on' : '', type: 'button' }, [LN[l]]); b.addEventListener('click', function () { lang = l; try { localStorage.setItem('lang', l); } catch (e) { } render(); window.scrollTo(0, 0); }); return b; }));
  nav.appendChild(h('b', 0, [name]));
  nav.appendChild(h('div', { class: 'lk' }, NAVS.filter(function (k) { return k === 'about' || k === 'contact' || vis[k]; }).map(function (k) { return h('a', { href: '#' + k }, [st(k)]); })));
  nav.appendChild(lg);
  if (news.length) {
    var len = news.reduce(function (s, i) { return s + pick(i.title).length + 6; }, 0), k = Math.max(1, Math.ceil(innerWidth / (len * 9)));
    var mk = function () { var kids = []; for (var n = 0; n < k; n++) news.forEach(function (i) { var u = safe(i.link); kids.push(h(u ? 'a' : 'span', Object.assign({ class: 'tk-i' }, u ? { href: u, target: '_blank', rel: 'noopener noreferrer' } : {}), [pick(i.title)])); }); return h('div', { class: 'tk-set' }, kids); };
    var inn = h('div', { class: 'tk-in ' + (DIR[lang] === 'rtl' ? 'tk-r' : 'tk-l') }, [mk(), mk()]);
    inn.style.setProperty('animation-duration', Math.max(15, Math.round(len * k * .16)) + 's');
    nav.appendChild(h('div', { class: 'tk' }, [h('span', { class: 'tk-lb' }, [t('news')]), h('div', { class: 'tk-tr' }, [inn])]));
  }
  var ft = document.getElementById('ft'); ft.textContent = '© ' + new Date().getFullYear() + ' ' + name + ' — ' + t('rights');
  document.querySelectorAll('.rv').forEach(function (n) { io.observe(n); });
  document.querySelectorAll('.card:not(.stat)').forEach(tilt);
}
fetch('/api/data').then(function (r) { return r.json(); }).then(function (d) { D = d; render(); });
try { if (!sessionStorage.getItem('v')) { sessionStorage.setItem('v', '1'); fetch('/api/view', { method: 'POST' }); } } catch (e) { }
/* deterrent only (the real protection is server-side) */
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('keydown', function (e) { var k = (e.key || '').toLowerCase(); if (e.key === 'F12' || (e.ctrlKey && (k === 'u' || k === 's')) || ((e.ctrlKey || e.metaKey) && e.shiftKey && 'ijc'.indexOf(k) > -1)) e.preventDefault(); });
})();
