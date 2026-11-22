'use strict';
// سێرڤەری ماڵپەڕ — بێ هیچ پێویستییەکی دەرەکی (zero dependencies)
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = +process.env.PORT || 3000;
const DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const FILE = path.join(DIR, 'data.json');
const AUSER = process.env.ADMIN_USER || 'admin';
const APASS = process.env.ADMIN_PASS || '';
const APATH = ('/' + (process.env.ADMIN_PATH || 'panel')).replace(/\/+/g, '/').replace(/\/$/, '');
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const KINDS = ['services', 'skills', 'works', 'process', 'pricing', 'testimonials', 'clients', 'team', 'gallery', 'posts', 'faq', 'news'];
const T = (ckb, ar, en) => ({ ckb, ar, en });
const CSP = "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";

/* ---------- data ---------- */
let db, tm;
const rid = () => crypto.randomBytes(6).toString('hex');
function seed() {
  const it = (kind, title, body, extra = '') => ({ id: rid(), ts: Date.now(), kind, title, body, link: '', extra });
  return {
    views: 0, messages: [],
    profile: {
      name: T('ناوی تۆ', 'اسمك', 'Your Name'),
      tagline: T('بیرۆکەکانت دەکەمە ڕاستی', 'أحوّل أفكارك إلى واقع', 'I turn your ideas into reality'),
      bio: T('لێرەدا باسی خۆت و بزنسەکەت بکە. لە ژووری ئەدمینەوە دەتوانیت ئەم دەقە بگۆڕیت.', 'اكتب هنا عنك وعن عملك. يمكنك تعديل هذا النص من لوحة الإدارة.', 'Write about yourself and your business here. You can edit this text from the admin panel.'),
      email: '', phone: '', address: T('هەولێر، کوردستان', 'أربيل، كردستان', 'Erbil, Kurdistan')
    },
    items: [
      it('news', T('بەخێربێن بۆ ماڵپەڕە نوێیەکەم', 'مرحباً بكم في موقعي الجديد', 'Welcome to my new website')),
      it('news', T('کارە نوێیەکان زیاد دەکرێن', 'تتم إضافة أعمال جديدة', 'New projects are being added')),
      it('services', T('دیزاینی وێب', 'تصميم المواقع', 'Web Design'), T('ماڵپەڕی مۆدێرن و خێرا بۆ بزنسەکەت.', 'مواقع حديثة وسريعة لعملك.', 'Modern, fast websites for your business.')),
      it('services', T('براندینگ', 'العلامة التجارية', 'Branding'), T('ناسنامەیەکی بینراو بۆ براندەکەت.', 'هوية بصرية مميزة لعلامتك.', 'A distinctive visual identity for your brand.')),
      it('services', T('ڕاوێژکاری', 'استشارات', 'Consulting'), T('ڕاوێژی پراکتیکی بۆ گەشەکردن.', 'استشارات عملية للنمو.', 'Practical advice to help you grow.')),
      it('skills', T('دیزاین', 'التصميم', 'Design'), T('', '', ''), '90'),
      it('skills', T('پڕۆگرامسازی', 'البرمجة', 'Development'), T('', '', ''), '85'),
      it('skills', T('بازاڕگەری', 'التسويق', 'Marketing'), T('', '', ''), '75'),
      it('process', T('گفتوگۆ', 'نقاش', 'Discuss'), T('پێداویستییەکانت دەزانین.', 'نفهم احتياجاتك.', 'We learn what you need.')),
      it('process', T('پلان', 'تخطيط', 'Plan'), T('نەخشەی کار دادەنێین.', 'نضع خطة العمل.', 'We map out the work.')),
      it('process', T('دروستکردن', 'تنفيذ', 'Build'), T('بە وردی جێبەجێی دەکەین.', 'ننفذ بدقة.', 'We build it with care.')),
      it('process', T('ڕادەستکردن', 'تسليم', 'Launch'), T('ئامادەیە بۆ بەکارهێنان.', 'جاهز للاستخدام.', 'Ready to go live.')),
      it('pricing', T('بنەڕەتی', 'أساسي', 'Basic'), T('یەک لاپەڕە\nدیزاینی ئاسایی', 'صفحة واحدة\nتصميم عادي', 'One page\nStandard design'), '$199'),
      it('pricing', T('پرۆفیشناڵ', 'احترافي', 'Pro'), T('پێنج لاپەڕە\nئەنیمەیشن\nسێ زمان', 'خمس صفحات\nحركات\nثلاث لغات', 'Five pages\nAnimations\nThree languages'), '$499'),
      it('faq', T('چەند کات دەخایەنێت؟', 'كم يستغرق؟', 'How long does it take?'), T('بەگشتی ١ تا ٣ هەفتە.', 'عادةً من أسبوع إلى ثلاثة.', 'Usually 1 to 3 weeks.')),
      it('faq', T('دەتوانم پاشان بیگۆڕم؟', 'هل يمكنني التعديل لاحقاً؟', 'Can I edit it later?'), T('بەڵێ، لە ژووری ئەدمینەوە.', 'نعم، من لوحة الإدارة.', 'Yes, from the admin panel.'))
    ]
  };
}
function save() { clearTimeout(tm); fs.mkdirSync(DIR, { recursive: true }); const t = FILE + '.tmp'; fs.writeFileSync(t, JSON.stringify(db)); fs.renameSync(t, FILE); }
function dirty() { clearTimeout(tm); tm = setTimeout(save, 800); }
try { db = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { db = seed(); try { save(); } catch (e2) { console.error('cannot save', e2.message); } }

/* ---------- helpers ---------- */
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const eq = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const sign = v => crypto.createHmac('sha256', SECRET).update(v).digest('base64url');
const mkTok = () => { const e = String(Date.now() + 8 * 3600e3); return e + '.' + sign(e); };
function okTok(t) {
  if (!t) return false; const [e, s] = t.split('.'); if (!e || !s) return false;
  const g = sign(e); if (s.length !== g.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(g))) return false;
  return +e > Date.now();
}
const getSid = req => { const m = /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie || ''); return m ? m[1] : ''; };
const isAdm = req => okTok(getSid(req));
const hits = new Map();
function limited(key, max, win) { const n = Date.now(); let h = hits.get(key); if (!h || h.r < n) { h = { c: 0, r: n + win }; hits.set(key, h); } h.c++; return h.c > max; }
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (v.r < n) hits.delete(k); }, 60000).unref();
const ipOf = req => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
const str = (v, n) => typeof v === 'string' ? v.trim().slice(0, n) : '';
const ml = (o, n) => ({ ckb: str(o && o.ckb, n), ar: str(o && o.ar, n), en: str(o && o.en, n) });
const url = v => { v = str(v, 500); return /^https?:\/\//i.test(v) ? v : ''; };
const cleanItem = b => ({ kind: KINDS.includes(b.kind) ? b.kind : null, title: ml(b.title, 200), body: ml(b.body, 3000), link: url(b.link), extra: str(b.extra, 100) });
const SOC = ['facebook', 'instagram', 'tiktok', 'linkedin', 'whatsapp', 'telegram', 'youtube', 'x'];
const social = (k, v) => { v = str(v, 300); if (k === 'whatsapp' && /^\+?[\d\s-]{6,20}$/.test(v)) return 'https://wa.me/' + v.replace(/\D/g, ''); return /^https?:\/\//i.test(v) ? v : ''; };
const cleanProfile = b => ({ socials: Object.fromEntries(SOC.map(k => [k, social(k, b.socials && b.socials[k])])), name: ml(b.name, 100), tagline: ml(b.tagline, 200), bio: ml(b.bio, 2000), email: str(b.email, 100), phone: str(b.phone, 40), address: ml(b.address, 200) });
function send(res, code, body, type, extra) {
  const b = (typeof body === 'string' || Buffer.isBuffer(body)) ? body : JSON.stringify(body);
  res.writeHead(code, Object.assign({ 'Content-Type': type || 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin', 'Content-Security-Policy': CSP, 'Cache-Control': 'no-store' }, extra || {}));
  res.end(b);
}
function readBody(req, max = 400000) {
  return new Promise((ok, no) => {
    let s = '', n = 0;
    req.on('data', c => { n += c.length; if (n > max) { no(new Error('big')); req.destroy(); } else s += c; });
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { no(e); } });
    req.on('error', no);
  });
}

/* ---------- static ---------- */
const PUB = path.join(__dirname, 'public');
const FILES = {
  '/': ['index.html', 'text/html; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'application/javascript; charset=utf-8'], '/admin.js': ['admin.js', 'application/javascript; charset=utf-8']
};
FILES[APATH] = ['admin.html', 'text/html; charset=utf-8'];
const cache = {};
const load = f => cache[f] || (cache[f] = fs.readFileSync(path.join(PUB, f)));

/* ---------- server ---------- */
const server = http.createServer(async (req, res) => {
  try {
    const p = new URL(req.url, 'http://x').pathname.replace(/(.)\/$/, '$1'), m = req.method;
    if (m === 'GET' || m === 'HEAD') {
      const f = FILES[p];
      if (f) return send(res, 200, m === 'HEAD' ? '' : load(f[0]), f[1]);
      if (p === '/api/data') return send(res, 200, { profile: db.profile, items: db.items, views: db.views });
      if (p === '/healthz') return send(res, 200, 'ok', 'text/plain');
    }
    if (m !== 'GET' && m !== 'HEAD') {
      const o = req.headers.origin;
      if (o) { try { if (new URL(o).host !== req.headers.host) return send(res, 403, { error: 'origin' }); } catch (e) { return send(res, 403, { error: 'origin' }); } }
    }
    if (p === '/api/view' && m === 'POST') {
      if (limited('v' + ipOf(req), 30, 60000)) return send(res, 429, { error: 'rate' });
      db.views++; dirty(); return send(res, 200, { views: db.views });
    }
    if (p === '/api/contact' && m === 'POST') {
      if (limited('c' + ipOf(req), 5, 600000)) return send(res, 429, { error: 'rate' });
      const b = await readBody(req, 20000);
      if (b.website) return send(res, 200, { ok: 1 }); // honeypot
      const text = str(b.text, 2000); if (!text) return send(res, 400, { error: 'text' });
      db.messages.unshift({ id: rid(), name: str(b.name, 100), contact: str(b.contact, 150), text, ts: Date.now() });
      db.messages = db.messages.slice(0, 500); save(); return send(res, 200, { ok: 1 });
    }
    if (p === '/api/admin/login' && m === 'POST') {
      if (limited('l' + ipOf(req), 8, 900000)) return send(res, 429, { error: 'rate' });
      const b = await readBody(req, 5000);
      const a1 = eq(str(b.user, 100), AUSER), a2 = eq(str(b.pass, 200), APASS);
      if (!APASS || !a1 || !a2) return send(res, 401, { error: 'bad' });
      const sec = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
      return send(res, 200, { ok: 1 }, null, { 'Set-Cookie': 'sid=' + mkTok() + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800' + sec });
    }
    if (p === '/api/admin/logout' && m === 'POST') return send(res, 200, { ok: 1 }, null, { 'Set-Cookie': 'sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    if (p.startsWith('/api/admin/')) {
      if (!isAdm(req)) return send(res, 401, { error: 'auth' });
      if (p === '/api/admin/me') return send(res, 200, { ok: 1 });
      if (p === '/api/admin/messages' && m === 'GET') return send(res, 200, db.messages);
      if (p === '/api/admin/export' && m === 'GET') return send(res, 200, db, null, { 'Content-Disposition': 'attachment; filename="backup.json"' });
      if (p === '/api/admin/import' && m === 'POST') {
        const b = await readBody(req);
        if (!b || !Array.isArray(b.items)) return send(res, 400, { error: 'format' });
        const items = b.items.map(i => Object.assign({ id: /^[a-f0-9]{6,24}$/.test(i.id) ? i.id : rid(), ts: +i.ts || Date.now() }, cleanItem(i))).filter(i => i.kind);
        db.items = items; if (b.profile) db.profile = cleanProfile(b.profile); save(); return send(res, 200, { ok: 1, items: items.length });
      }
      if (p === '/api/admin/profile' && m === 'PUT') { db.profile = cleanProfile(await readBody(req)); save(); return send(res, 200, { ok: 1 }); }
      if (p === '/api/admin/items' && m === 'POST') {
        const c = cleanItem(await readBody(req)); if (!c.kind) return send(res, 400, { error: 'kind' });
        const it = Object.assign({ id: rid(), ts: Date.now() }, c); db.items.push(it); save(); return send(res, 200, it);
      }
      const mm = /^\/api\/admin\/(items|messages)\/([a-f0-9]+)$/.exec(p);
      if (mm) {
        const list = db[mm[1]], i = list.findIndex(x => x.id === mm[2]);
        if (i < 0) return send(res, 404, { error: 'nf' });
        if (m === 'DELETE') { list.splice(i, 1); save(); return send(res, 200, { ok: 1 }); }
        if (m === 'PUT' && mm[1] === 'items') {
          const c = cleanItem(await readBody(req)); if (!c.kind) return send(res, 400, { error: 'kind' });
          list[i] = Object.assign({}, list[i], c); save(); return send(res, 200, list[i]);
        }
      }
      return send(res, 404, { error: 'nf' });
    }
    send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  } catch (e) { try { send(res, 400, { error: 'bad request' }); } catch (x) { } }
});
process.on('SIGTERM', () => { try { save(); } catch (e) { } process.exit(0); });
server.listen(PORT, () => {
  console.log('Server on :' + PORT + ' | admin at ' + APATH);
  if (!APASS) console.warn('WARNING: ADMIN_PASS is not set — admin login is DISABLED.');
});
