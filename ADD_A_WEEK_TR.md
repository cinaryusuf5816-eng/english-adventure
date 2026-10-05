# Yeni hafta ekleme

Yeni hafta = **yeni içerik klasörü + görseller + curriculum kaydı**. Uygulama kodu kopyalanmaz, eski haftalar silinmez. (İstisna: yeni bir *etkinlik türü* istenirse kod değişir.)

Bu yol `npm run test:e2e` testinde gerçekten denendi: şablondan geçici bir Week 2 eklendi, Week 2 açıldı, Week 1 ve Week 1 kayıtları bozulmadı. O test haftası yayımlanmadı.

## Adım adım (örnek: Week 2)

### 1. Klasör ve dosyalar
`data/weeks/week-02/` klasörünü açın ve şablonları kopyalayın:
- `data/templates/week-template.json` → `data/weeks/week-02/week.json`
- `data/templates/questions-template.json` → `data/weeks/week-02/questions.json`

`week.json` içinde `"id": "week-02"` olmalı.

### 2. Görseller (iki yol)
**Yol 1 — araçsız (GitHub'da doğrudan):** Görseli `assets/images/week-02/` içine koyun (küçük harfli ad, örn. `ride-a-bike.jpg`, ideal genişlik 1200–1600 px, 300 KB altı). `week.json` → `images`:
```json
"ride-a-bike": { "file": "assets/images/week-02/ride-a-bike.jpg", "w": 1600, "h": 1200, "alt": "A girl rides a bike in the park." }
```
**Yol 2 — geliştirici (daha hızlı yüklenen WebP):** Orijinali `raw-images/week-02/ride-a-bike.jpg` olarak koyun → `npm run images` → `assets/images/week-02/ride-a-bike-lg.webp` ve `-sm.webp` oluşur:
```json
"ride-a-bike": { "src": "assets/images/week-02/ride-a-bike", "w": 1400, "h": 1050, "alt": "A girl rides a bike in the park." }
```
Alt metin resmi anlatır, cevabı vermez. Görsellere İngilizce yazı gömmeyin; bütün metinler JSON'dadır. Yeni görseli `ASSET_MANIFEST.json` ve `scripts/image-log.json` içine kaydedin.

### 3. İçerik alanları (`week.json`)
| Alan | Açıklama |
|---|---|
| `id`, `contentVersion`, `title`, `subtitle`, `published`, `cover` | Kimlik, sürüm, başlıklar, kapak görsel anahtarı |
| `goals` | Öğrenciye görünen “I can …” cümleleri |
| `teacherGoals`, `teacherNote` | Öğretmen notları (İngilizce) |
| `images` | Görsel anahtarı → `src` veya `file` + `alt` |
| `words[]` | `phrase`, `image`, `example` (isteğe bağlı `time`, `note`) |
| `learn[]` | `id`, `title`, `rule`, `image`, `teacherNote`, `examples[]` (≥ 6), `practice[]` (tam 2: `together` + `try`) |
| `examples[]` biçimleri | `text` · `from`+`text` (dönüşüm) · `q`+`a` (soru-cevap) · `rows` (+ − ?) · ek: `speaker`, `label`, `calendar` (7 gün, 1/0), `time` |
| `speaking[]` | `question`, `image`, `help[]`, `sample`, `personal` |
| `games` | `pictureReveal[]`, `sentenceSwitch` (`subjects`, `verbs` → `base` + doğrulanmış `s` biçimi), `questionDoor[]` |

Metinde `**vurgu**` kırmızı vurgulanır, `~~silinen~~` üstü çizili gösterilir.

### 4. Sorular (`questions.json`)
Her sorunun benzersiz `id`'si (örn. `w2-mc-001`), `v` (sürüm), `type`, `target` (`affirmative` / `negative` / `question` / `mixed`), `level`, `hint`, `explain` alanı olmalı.
- `mcq` / `dialogue` / `reading`: `options` (2–4) + `answer` (`"a"`, `"b"`, …). Seçenekler ekranda karışık görünür ama kimlikle değerlendirilir.
- `jumbled`: `tokens`, `answers` (kabul edilen bütün sıralar), `end` (`.` veya `?`).
- `fill`: `text` (tek `___`), `answers` (alternatifler: `"don't", "do not"`), `pool` (kelime kutusu).
- `change`: `from`, `task` (`negative` / `question`), `answers`.
- `fix`: `words`, `wrong` (yanlış kelimenin sırası, 0'dan başlar), `fixes`, `fix`, `explain` (= düzeltilmiş cümle).
- `decide`: `card` + `statement` + `answer` (true/false). Yanlışlık karttan gerçekten çıkarılabilmeli.
- Bir sorunun cevabı veya içeriği değişirse `v` değerini artırın: eski kayıt o soruya taşınmaz. Soru silinirse eski kayıt uygulamayı bozmaz.

### 5. Hafta listesine ekleyin (`data/curriculum.json`)
```json
{ "id": "week-02", "number": 2, "title": "Can / Can't", "subtitle": "…", "published": true,
  "file": "data/weeks/week-02/week.json", "cover": "assets/images/week-02/cover", "coverAlt": "" }
```
Kapak için araçsız yolda `"cover"` yerine `"coverFile": "assets/images/week-02/cover.jpg"` yazın.
`published: false` olan hafta menüde “Coming soon” olarak, tıklanamaz biçimde görünür.

### 6. Kontrol ve yükleme
- Geliştirici: `npm run validate` (ayrıca `npm run release`).
- Araçsız: değişen dosyaları GitHub'da **Add file → Upload files** ile aynı klasörlere yükleyin. Sonra siteyi açıp hafta → her bölüm → bir alıştırma deneyin.
- `.json` dosyasında virgül hatası varsa sitede “The file is broken.” mesajı çıkar; diğer haftalar etkilenmez.


## v2.0 ek alanları (isteğe bağlı)
| Alan | Açıklama |
|---|---|
| `dashboard` | Ana sayfa tabelası: `tagline`, `bubbleLeft` / `bubbleRight` (konuşma balonu satırları) |
| `missions[]` | Today's Mission: `{ "text": "...", "check": { "section": "learn", "min": 3 } }` (bölümler: words, learn, examples, practise, play, challenge, speak) veya `{ "all": true }` |
| `examples[]` | Change Machine kartları: `{ "id", "image", "subject", "verb", "note" }` — subject/verb `games.sentenceSwitch` içinden |
| Learn örneği `{ "machine": { "subject", "verb", "to" } }` | to: `negative`, `question`, `positive-s`, `all` |
| `extraWordSets[]` | Ek kelime setleri (ör. kitap kelimeleri): `{ "id", "title", "source", "words": [...] }` |
| Soru `"bank": "book"` | Soruyu ayrı bir bankada toplar (`banks` listesine aynı id ile ekleyin); 204'lük temel sayıma girmez |
