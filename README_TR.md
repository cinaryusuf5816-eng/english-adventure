# Everyday English — Mystery Club

İlkokul başlangıç düzeyi (Pre-A1 / A1) için haftalık büyüyen İngilizce öğretim sitesi.
İlk teslim: **Week 1 — Present Simple** (olumlu, olumsuz, Do/Does soruları, kısa cevaplar, destekli What/Where/What time).

- Statik site: HTML + CSS + modüler JavaScript (derleme adımı yok, sunucu yok, hesap yok, API anahtarı yok).
- GitHub Pages'te hem kök adreste (`kullanici.github.io/`) hem depo alt yolunda (`kullanici.github.io/depo-adi/`) çalışır; tüm yollar görelidir.
- Bölümler hash adresleriyle açılır: `#/week/week-01/learn/doesnt/3` — yenileme ve doğrudan bağlantı 404 vermez.
- Site metinleri tamamen İngilizcedir (öğretmen notları dahil). Bu kılavuzlar Türkçedir.

## Klasörler

| Yol | Ne var |
|---|---|
| `site/` | Yayımlanan sitenin kaynağı (index.html, styles, js, data, assets) |
| `site/data/curriculum.json` | Hafta listesi (yayınlanan / Coming soon) |
| `site/data/weeks/week-01/week.json` | Week 1: kelimeler, 12 Learn konusu, konuşma kartları, oyunlar, görsel listesi |
| `site/data/weeks/week-01/questions.json` | Week 1: 204 puanlanabilir soru, bilgi kartları, okuma metinleri |
| `site/data/templates/` | Yeni hafta şablonları |
| `raw-images/` | Görsellerin orijinalleri (JPG) |
| `scripts/` | Görsel dönüştürme, içerik doğrulama, build, paketleme, yerel sunucu |
| `tests/unit/` | Node birim testleri (cevap kontrolü, puanlama, cümle üretici, yönlendirme, kontrast) |
| `tests/e2e/` | Gerçek tarayıcı testleri (paketi açıp çalıştırır) |
| `.github/workflows/deploy.yml` | İsteğe bağlı otomatik yayımlama (Yöntem B) |

## Yayımlama
- **Yöntem A — hazır paket (önerilen, terminal yok):** `GITHUB_YAYINLAMA_TR.md`.
- **Yöntem B — kaynak deposu + GitHub Actions:** `SOURCE_CODE.zip` içeriğini (klasörün içindekileri) bir depoya yükleyin → Settings → Pages → Source: **GitHub Actions**. Her `main` gönderiminde içerik kontrolü + birim testleri + build yapılıp `dist/` yayımlanır. Bu yöntemde depoda `index.html` en üstte değildir; bu normaldir.
- İki yöntemi aynı depoda karıştırmayın.

## Yerel önizleme (isteğe bağlı, geliştirici)
`index.html` dosyasına çift tıklamak (file://) çalışmaz; tarayıcı modülleri ve JSON'u bu şekilde yüklemez. Bir HTTP sunucusu gerekir:

```bash
npm install
npm run serve        # dist/ klasörünü http://127.0.0.1:8080/ adresinde açar (önce npm run build)
node scripts/serve.mjs site 8080 --base /test-repo/   # alt yol denemesi: http://127.0.0.1:8080/test-repo/
```

## Komutlar (Node.js 20+)
| Komut | Ne yapar |
|---|---|
| `npm install` | Geliştirme araçlarını kurar (sharp, archiver, extract-zip, playwright-core) |
| `npm run images` | `raw-images/<klasör>/*.jpg` → `site/assets/images/<klasör>/<ad>-lg.webp` ve `-sm.webp` |
| `npm run validate` | Soru sayıları, ID'ler, cevap anahtarları, görsel yolları, büyük/küçük harf |
| `npm run test:unit` | Birim testleri |
| `npm run build` | `site/` → `dist/` + kontrol |
| `npm run package` | `release/READY_TO_UPLOAD.zip` + `release/SOURCE_CODE.zip` (aynı sürüm, aynı site dosyaları) |
| `npm run test:e2e` | READY_TO_UPLOAD.zip'i açar, `/test-repo/` ve `/` altında Edge/Chrome ile test eder |
| `npm run release` | Hepsi sırayla |

Uygulama kodu (JS/CSS) değişirse yeniden derleme gerekmez; ama `npm run build && npm run package` ile yeni paket üretip yükleyin. Yalnızca içerik (JSON + görsel) değiştiğinde de aynı paket yolu kullanılır; ya da ilgili dosyaları GitHub'da doğrudan güncelleyebilirsiniz (bkz. `ADD_A_WEEK_TR.md`).

## Görsel hata kontrolü
- Görsel yüklenemezse ekranda kırık ikon yerine “Picture not available” kutusu çıkar.
- GitHub büyük/küçük harfe duyarlıdır: `Play-Football.webp` ≠ `play-football.webp`. Tüm dosya adları küçük harflidir; `npm run validate` bunu kontrol eder.

## Kayıt ve gizlilik
İlerleme yalnızca o tarayıcının `localStorage` alanında, `eemc:v1:...` anahtarlarıyla tutulur. `localStorage.clear()` kullanılmaz; aynı alan adındaki başka projelere dokunulmaz. Öğrenci adı veya kişisel veri toplanmaz. Kayıt kapalı/dolu/bozuksa site çalışmaya devam eder ve üstte bir not gösterir.

## Diğer belgeler
`TEACHER_GUIDE_TR.md` · `ADD_A_WEEK_TR.md` · `CONTENT_REVIEW.md` · `QA_REPORT.md` · `ASSET_MANIFEST.json` · `IMAGE_PROMPTS.md`


## v2.0.0 — English Adventure şablonu (2026-10-05)
- Site adı **English Adventure**: sol menü + hafta seçici (Week 1 ▾, Coming soon haftalar kilitli), üst bar (Discover / Learn / Practice / Grow, Classroom, Full screen, Copy link, “Hello, Explorer!”).
- Ana sayfa = seçili haftanın panosu: ahşap tabela (Unit 1 – Week 1, Present Simple), tabelalar, **Choose Your Path** (Learn, Examples, Practice, Games, Challenge), **My Progress** (gerçek ilerleme, bu tarayıcıda), baykuş ipuçları, **Today's Mission** (otomatik işaretlenir), manzara bandı, hafta kartları.
- Yeni bölümler: **Examples** (16 resimli örnek + Change Machine), **Challenge** (15 karışık soru, yıldızlar), **My Progress**.
- **Change Machine:** renkli bloklar (who / helper / verb / ending) ile + → −, + → ?, I → he adım adım; -s/-es eki “does”a uçar; has→have, studies→study doğru gösterilir. Learn 4, 6, 7, 8, 9, 12'ye eklendi.
- **Kitap kelimeleri** (Language Log Unit 1 s.18): live, speak, study, dance, play, walk, ride, eat, smile, visit — 10 kelime kartı (Words → Book words), Learn 13, soru bankası **I · Book words (30 soru)**, 4 konuşma kartı, oyun maddeleri. Şarkı sözleri telif nedeniyle kopyalanmadı.
- Görseller: +9 kitap kelimesi sahnesi, +9 şablon görseli (Canva AI, ikinci bağlantı). Toplam 41 görsel.
- Telaffuz: “read” her zaman geniş zaman (reed) okunur. “my teeth” satırı kaldırıldı.
- Testler: 40 birim testi + **128/128** uçtan uca test (READY_TO_UPLOAD.zip açılıp /test-repo/ ve / altında, Edge 154).
- Haftalık ekleme aynı: `data/weeks/week-02/` + `data/curriculum.json`. İsteğe bağlı yeni alanlar: `dashboard`, `missions`, `examples`, `extraWordSets`, soru bankası için `"bank"` alanı (bkz. ADD_A_WEEK_TR.md).
