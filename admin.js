(function () {
'use strict';
var KINDS = { services: 'خزمەتگوزاری', skills: 'شارەزایی (extra = ٠-١٠٠)', works: 'کار (لینک)', process: 'هەنگاوی کارکردن', pricing: 'نرخ (extra = نرخ، body = هەر دێڕێک تایبەتمەندییەک)', testimonials: 'ڕای کڕیار (title = ناو، extra = پیشە)', clients: 'کڕیار (لینک)', team: 'ئەندامی تیم (extra = پیشە)', gallery: 'وێنە (link = لینکی وێنە)', posts: 'پۆست', faq: 'پرسیارە باو', news: 'هەواڵی ڕیزی ژێرەوە (تەنها سەردێڕ، لینک ئارەزوومەندانە)' };
var LG = ['ckb', 'ar', 'en'], LB = { ckb: 'کوردی', ar: 'عربي', en: 'English' };
var root = document.getElementById('r'), tab = 'content', kind = 'services', editId = null, items = [], prof = {}, msgs = [], note = '';
function h(tag, a, kids) { var e = document.createElement(tag); if (a) for (var k in a) { if (k === 'onclick') e.onclick = a[k]; else if (a[k] != null) e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c == null) return; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }); return e; }
function api(m, p, b) { return fetch('/api/admin/' + p, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }).then(function (r) { if (r.status === 401) { login(); throw new Error('auth'); } if (!r.ok) throw new Error('err'); return r.json(); }); }
function login(msg) {
  root.textContent = '';
  var u = h('input', { placeholder: 'ناوی بەکارهێنەر', autocomplete: 'username' }), p = h('input', { type: 'password', placeholder: 'پاسۆرد', autocomplete: 'current-password' }), m = h('p', { class: 'm' }, [msg || '']);
  var go = function () { fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: u.value, pass: p.value }) }).then(function (r) { if (r.ok) return load(); m.textContent = r.status === 429 ? 'زۆر هەوڵت دا، دواتر هەوڵ بدەرەوە' : 'ناو یان پاسۆرد هەڵەیە'; }); };
  p.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  root.appendChild(h('div', { class: 'card', style: 'max-width:380px;margin:12vh auto' }, [h('h3', 0, ['چوونەژوورەوە']), u, p, h('button', { class: 'p', onclick: go }, ['چوونەژوورەوە']), m]));
}
function load() {
  return Promise.all([fetch('/api/data').then(function (r) { return r.json(); }), api('GET', 'messages')]).then(function (a) { items = a[0].items; prof = a[0].profile; msgs = a[1]; views = a[0].views; draw(); }).catch(function () { });
}
var views = 0;
function ml(id, label, v, area) { return h('div', 0, [h('p', { class: 'mu' }, [label]), h('div', { class: 'g3' }, LG.map(function (l) { var f = h(area ? 'textarea' : 'input', { 'data-f': id, 'data-l': l, placeholder: LB[l], rows: area ? 3 : null }); f.value = (v && v[l]) || ''; return f; }))]); }
function rd(id) { var o = {}; root.querySelectorAll('[data-f="' + id + '"]').forEach(function (f) { o[f.getAttribute('data-l')] = f.value; }); return o; }
function draw() {
  root.textContent = '';
  var tabs = h('div', { class: 'tabs' }, [['content', 'ناوەڕۆک'], ['profile', 'پرۆفایل'], ['messages', 'نامەکان (' + msgs.length + ')'], ['backup', 'باکئەپ']].map(function (t) { return h('button', { class: tab === t[0] ? 'on' : '', onclick: function () { tab = t[0]; note = ''; draw(); } }, [t[1]]); })
    .concat([h('button', { onclick: function () { fetch('/api/admin/logout', { method: 'POST' }).then(function () { login(); }); } }, ['چوونەدەرەوە']), h('a', { href: '/', style: 'color:var(--mu);align-self:center;font-size:.85rem' }, ['ماڵپەڕ ↗'])]));
  root.appendChild(tabs);
  var m = h('p', { class: 'm' }, [note]);
  if (tab === 'content') {
    var sel = h('select', 0, Object.keys(KINDS).map(function (k) { var o = h('option', { value: k }, [KINDS[k]]); if (k === kind) o.selected = true; return o; }));
    sel.onchange = function () { kind = sel.value; editId = null; draw(); };
    var cur = editId ? items.filter(function (i) { return i.id === editId; })[0] : null;
    var link = h('input', { placeholder: 'link (https://...)', dir: 'ltr' }), extra = h('input', { placeholder: 'extra', dir: 'ltr' });
    link.value = cur ? cur.link : ''; extra.value = cur ? cur.extra : '';
    var save = function () {
      var b = { kind: kind, title: rd('t'), body: rd('b'), link: link.value, extra: extra.value };
      if (!b.title.ckb && !b.title.ar && !b.title.en) { note = 'سەردێڕ بنووسە'; return draw(); }
      api(editId ? 'PUT' : 'POST', 'items' + (editId ? '/' + editId : ''), b).then(function () { editId = null; note = 'پاشەکەوت کرا ✓'; return load(); }).catch(function () { });
    };
    root.appendChild(h('div', { class: 'card' }, [h('h3', 0, [editId ? 'دەستکاریکردن' : 'زیادکردن']), sel, ml('t', 'سەردێڕ', cur && cur.title), ml('b', 'دەق / وەسف', cur && cur.body, true), link, extra,
      h('button', { class: 'p', onclick: save }, [editId ? 'پاشەکەوتکردن' : 'زیادکردن']), editId ? h('button', { onclick: function () { editId = null; draw(); } }, ['هەڵوەشاندنەوە']) : null, m]));
    var list = items.filter(function (i) { return i.kind === kind; });
    root.appendChild(h('div', { class: 'card' }, [h('h3', 0, [KINDS[kind].split(' (')[0] + ' (' + list.length + ')'])].concat(list.map(function (i) {
      return h('div', { class: 'row' }, [h('span', 0, [i.title.ckb || i.title.en || i.title.ar || '—']), h('span', 0, [h('button', { onclick: function () { editId = i.id; draw(); window.scrollTo(0, 0); } }, ['✎']), ' ', h('button', { class: 'd', onclick: function () { if (confirm('دڵنیایت؟')) api('DELETE', 'items/' + i.id).then(load); } }, ['✕'])])]);
    }))));
  } else if (tab === 'profile') {
    var em = h('input', { placeholder: 'Email', dir: 'ltr' }), ph = h('input', { placeholder: 'Phone', dir: 'ltr' }); em.value = prof.email || ''; ph.value = prof.phone || '';
    var SO = ['tiktok', 'facebook', 'instagram', 'linkedin', 'whatsapp', 'telegram', 'youtube', 'x'], so = {};
    SO.forEach(function (k) { so[k] = h('input', { placeholder: k + (k === 'whatsapp' ? ' (ژمارە وەک +964750... یان لینک)' : ' (https://...)'), dir: 'ltr' }); so[k].value = (prof.socials && prof.socials[k]) || ''; });
    root.appendChild(h('div', { class: 'card' }, [h('h3', 0, ['پرۆفایل']), ml('n', 'ناو', prof.name), ml('tg', 'دەستەواژەی سەرەکی', prof.tagline), ml('bi', 'دەربارە', prof.bio, true), ml('ad', 'ناونیشان', prof.address), em, ph, h('p', { class: 'mu' }, ['لینکی سۆشیال میدیا (بەتاڵ = نانیشاندرێت)']), ...SO.map(function (k) { return so[k]; }),
      h('button', { class: 'p', onclick: function () { api('PUT', 'profile', { name: rd('n'), tagline: rd('tg'), bio: rd('bi'), address: rd('ad'), email: em.value, phone: ph.value, socials: (function () { var o = {}; SO.forEach(function (k) { o[k] = so[k].value; }); return o; })() }).then(function () { note = 'پاشەکەوت کرا ✓'; return load(); }); } }, ['پاشەکەوتکردن']), m]));
  } else if (tab === 'messages') {
    root.appendChild(h('div', { class: 'card' }, [h('h3', 0, ['نامەکان | بینەر: ' + views])].concat(msgs.length ? msgs.map(function (x) {
      return h('div', { class: 'row', style: 'align-items:flex-start' }, [h('div', 0, [h('b', 0, [x.name || '—']), h('span', { class: 'mu' }, [' ' + (x.contact || '') + ' · ' + new Date(x.ts).toLocaleString()]), h('p', { style: 'white-space:pre-wrap' }, [x.text])]), h('button', { class: 'd', onclick: function () { api('DELETE', 'messages/' + x.id).then(load); } }, ['✕'])]);
    }) : [h('p', { class: 'mu' }, ['هیچ نامەیەک نییە'])])));
  } else {
    var fi = h('input', { type: 'file', accept: 'application/json' });
    root.appendChild(h('div', { class: 'card' }, [h('h3', 0, ['باکئەپ']), h('p', { class: 'mu' }, ['ئەگەر Render لە پلانی بێبەرامبەر بێت، داتاکان لە دووبارە دەستپێکردنەوە ڕەنگە بسڕێنەوە؛ بۆیە باکئەپ بگرە.']),
      h('p', 0, [h('a', { href: '/api/admin/export', style: 'color:var(--b)' }, ['⬇ داگرتنی باکئەپ'])]), h('p', { class: 'mu' }, ['گەڕاندنەوە:']), fi,
      h('button', { class: 'p', onclick: function () { var f = fi.files[0]; if (!f) return; f.text().then(function (tx) { return api('POST', 'import', JSON.parse(tx)); }).then(function () { note = 'گەڕایەوە ✓'; return load(); }).catch(function () { note = 'فایلەکە دروست نییە'; draw(); }); } }, ['گەڕاندنەوە']), m]));
  }
}
fetch('/api/admin/me').then(function (r) { if (r.ok) load(); else login(); });
})();
