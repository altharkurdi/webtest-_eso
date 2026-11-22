# ماڵپەڕی شەخسی / بزنس — سێ زمان + ژووری ئەدمین

ماڵپەڕێکی تەواو بە Node.js (**هیچ پاکێجێکی دەرەکی پێویست نییە**)، بە کوردی/عەرەبی/ئینگلیزی.

## دانانی لەسەر GitHub و Render

1. لەسەر GitHub ڕیپۆیەکی نوێ دروست بکە و ئەم فایلانە باربکە (یان لە تێرمیناڵ):
   ```
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main
   ```
2. لە https://render.com : **New → Web Service** → ڕیپۆکەت هەڵبژێرە.
   - Runtime: **Node**
   - Build Command: `echo ok`
   - Start Command: `node server.js`
   (یان **New → Blueprint** و فایلی `render.yaml` بەکاربهێنە)
3. لە **Environment** ئەمانە زیاد بکە:
   | ناو | بەها |
   |---|---|
   | `ADMIN_USER` | ناوی بەکارهێنەری خۆت |
   | `ADMIN_PASS` | پاسۆردێکی **درێژ و بەهێز** |
   | `SESSION_SECRET` | دەقێکی هەڕەمەکی درێژ |
   | `ADMIN_PATH` | ناونیشانی نهێنی ئەدمین، بۆ نموونە `my-secret-door` |
4. ژووری ئەدمین: `https://ماڵپەڕەکەت.onrender.com/<ADMIN_PATH>` (بنەڕەت `/panel`).
   هیچ لینکێک بۆی لە ماڵپەڕەکەدا نییە.

## هەڵگرتنی داتا (گرنگ)
داتاکان لە `data/data.json` هەڵدەگیرێن. لە پلانی **Free**ی Render دیسکەکە هەمیشەیی نییە و دوای deploy یان دووبارە دەستپێکردنەوە دەسڕێتەوە.
- چارەسەری باش: **Persistent Disk** زیاد بکە (پلانی پارەدار)، mount path = `/var/data`، و `DATA_DIR=/var/data` دابنێ.
- یان لە ژووری ئەدمین بەشی **باکئەپ** بەکاربهێنە و بەردەوام باکئەپ بگرە.

## ئاسایش
- پاسۆرد لە ژینگەی سێرڤەرە، نەک لە کۆد. Cookie بە HttpOnly + SameSite=Strict + Secure.
- سنووردارکردنی هەوڵی چوونەژوورەوە، CSP، و پشکنینی Origin.
- کلیکی لای ڕاست/F12 داخراوە، بەڵام ئەمە تەنها ڕێگرییەکی سادەیە؛ کۆدی ڕووکار لە وێبگەڕ هەمیشە دەبینرێت. هەموو دەسەڵاتەکان لەسەر سێرڤەر پشکنین دەکرێن.

## کارکردن لەسەر کۆمپیوتەرەکەت
```
ADMIN_USER=admin ADMIN_PASS=1234 node server.js
```
ئینجا http://localhost:3000 و http://localhost:3000/panel
