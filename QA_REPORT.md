# QA raporu — Everyday English: Mystery Club v1.1.0 (defter tasarımı + 6 oyun)

Tarih: 2026-10-05 · Ortam: Windows 11 Pro, Node v24.19.0, Microsoft Edge 154 (headless, `playwright-core`), yerel statik sunucu `scripts/serve.mjs`.

> Bu testler **benim bilgisayar ortamımdaki statik sunucuda** yapıldı. Bu, GitHub Pages üzerinde gerçek yayın testi **değildir** (depo oluşturma / yayımlama yapılmadı). Yayından sonra `GITHUB_YAYINLAMA_TR.md` §5'teki kısa kontrolü yapın.

## Özet

| Test grubu | Ne üzerinde | Sonuç |
|---|---|---|
| İçerik doğrulama (`npm run validate`) | `site/` ve derlenmiş `dist/` | **Geçti** — 204 soru, dağılımlar şartnameyle aynı, 0 hata, 0 uyarı |
| Birim testleri (`npm run test:unit`) | cevap kontrolü, puanlama/oturum, cümle üretici, yönlendirme, renk kontrastı, seslendirme telaffuzu | **37/37 geçti** |
| Uçtan uca tarayıcı testleri (`npm run test:e2e`) | **READY_TO_UPLOAD.zip ayrı klasöre açılıp** `/test-repo/` alt yolunda ve `/` kökte | **119/119 geçti** |
| Paket tutarlılığı (`npm run package`) | iki ZIP | **Geçti** — site dosyaları iki pakette aynı; `index.html` ve `.nojekyll` en üst seviyede |
| Görsel inceleme (ekran görüntüleri) | ana sayfa, kelime kartı, Learn, 8 soru türü, sonuç, oyunlar, Speak; 1920/1366/1024/768/390 px | Yapıldı; bulunan 6 sorun düzeltildi (aşağıda) |

Ayrıntılı tablo (her test: beklenen, gerçek, sonuç): `tests/e2e/E2E_RESULTS.md` ve `tests/e2e/results.json`. Ekran görüntüleri: test çalıştırılınca `tests/e2e/screenshots/`.

## Gerçekten çalıştırılan uçtan uca senaryolar (şartname §16 eşleşmesi)

| § | Senaryo | Sonuç |
|---|---|---|
| 1 | Home → Week 1 → Words → Learn → Practise → Home | Geçti |
| 2 | Learn adımına doğrudan bağlantı + yenileme; tarayıcı geri/ileri; 12 Learn konusunun hepsi açılıyor | Geçti |
| 3 | Bilinmeyen hafta, yayımlanmamış hafta, HTML içeren bozuk hash (enjeksiyon yok), bilinmeyen sayfa, 404 hafta dosyası, bozuk JSON, eksik resim | Geçti — anlaşılır mesaj + Home bağlantısı |
| 4 | **8 soru türünün her biri:** boş cevap, yanlış + soruya özel ipucu, ikinci deneme, Hint, Show answer | Geçti (8 × 6 kontrol) |
| 5 | Check'e çift tıklama / hızlı tekrar → tek puan | Geçti (8 türde) |
| 6 | İlk/son soru sınırları, cevapsız soruyu atlama ve geri dönme, bitmemiş soruyla Finish | Geçti |
| 7 | Jumbled: dokunma, yalnızca klavye (Tab + Enter), Undo, yerleşmiş kartı geri alma, Clear, aynı kelimeden iki kart (“Do … do”) | Geçti |
| 8 | Kabul edilen farklı sıra (“Every day I read a book.”) ve gerçekten yanlış sıra | Geçti |
| 9 | Kıvrık kesme işareti, fazla boşluk, büyük harf; *does not / do not*; *don't ≠ doesn't*; *dont* uyarısı; küçük “i” notu; Enter ile kontrol | Geçti |
| 10 | Seçenekler karışık gösteriliyor (12/12) ama kimlikle değerlendiriliyor; yeniden çizimde sıra değişmiyor | Geçti |
| 11 | Bağlantıdaki ayarlar (5 olumsuz soru), Resume, Retry mistakes (yeni tur, eski sonuç aynı), Restart (onaylı), Cancel hiçbir şeyi değiştirmiyor, New lesson yalnızca kendi anahtarlarını siliyor (başka projenin anahtarı korunuyor) | Geçti |
| 12 | Classroom / Practice ayrı durum: Practice'te açılan cevap Classroom'da yok, geri dönünce duruyor | Geçti |
| 13 | localStorage kapalı, dolu (QuotaExceeded), bozuk JSON, silinmiş soru ID'leri içeren kayıt | Geçti — ders çalışıyor, uyarı notu görünüyor |
| 14 | Şablondan geçici Week 2 (tek dosyalı JPG resimle) eklendi; Week 2 açılıyor; Week 1 ve kaydı korunuyor | Geçti (test verisi yayımlanmadı) |
| 15 | 46 resim dosyasının hepsi yükleniyor; alt metinler cevap vermiyor; hata durumunda “Picture not available” | Geçti |
| 16 | Full screen (izin/ret çökme yok), Copy link (pano izni yok → seçilebilir bağlantı), Listen (ses yoksa gizli) | Geçti — bkz. sınırlamalar |
| 17 | 1920×1080, 1366×768, 1024×768, 768×1024, 390×844: 12 ekran (6 oyun dahil) + 8 soru türü, yatay taşma yok, Check ekran içinde; düğmeler ≥ 44 px | Geçti |
| — | Classroom modunda örnek cümle 1920×1080'de 44 px (hedef 32–44) | Geçti |
| 18 | prefers-reduced-motion: Question Door açılıyor; Picture Reveal, Sentence Switch, Memory Match (doğru çift açık kalır, yanlış çift kapanır), Yes or No? (yanlışta ipucu, tek puan), Spin and Say (cümle slotlarla uyumlu) çalışıyor | Geçti |
| 19 | Aynı paket `/test-repo/` alt yolunda ve kök `/` adreste; tüm CSS/JS/JSON/resim istekleri başarılı | Geçti |
| 20 | Tüm koşu boyunca uygulama kaynaklı konsol hatası/uyarısı: 0; başarısız istek: 0. Ok tuşunun tam bir adım ilerlemesi (birikmiş dinleyici yok) | Geçti |

Ağ notu: Ekran hızla değiştirildiğinde tarayıcının yarıda bıraktığı 2 resim isteği (`ERR_ABORTED`) hata sayılmadı; bu, sayfa değişince normaldir. Google Fonts erişilebilirdi; erişilemezse sistem yazı tipi kullanılır.

## Renk kontrastı (ölçüldü, `tests/unit/contrast.test.mjs`)
En düşük: yanlış/vurgu kırmızısı 4.70:1. Diğerleri 5.14–14.32:1. Bütün metin çiftleri ≥ 4.5:1.

## İnceleme sırasında bulunup düzeltilen sorunlar
1. 1366×768'de cevap seçenekleri ve Check ekranın altına düşüyordu → cevap alanı resmin yanına alındı.
2. Ana sayfa kapak resmi tam genişlikte değildi → düzeltildi.
3. Sentence Switch'te “null” yazısı görünüyordu → düzeltildi.
4. Kayıt alanı doluyken alıştırma başlamıyordu → bellek içi yedek eklendi (test 13).
5. Mod değişince alıştırma adresi kayboluyordu → ayar ekranı aynı adreste gösteriliyor.
6. 17 olumsuz maddede resim cümleyle çelişiyordu → resimler değiştirildi (CONTENT_REVIEW.md).
7. Defter tasarımında sayfa çevirme animasyonu kısa bir yatay taşma yapıyordu → düzeltildi.
8. Telefonda uzun sayfalarda arka plan açık renge dönüyordu (sabit arka plan) → düzeltildi.
Ayrıca vurgu biçimi (“drink s” boşluğu) ve 0 cevaplı sonuç başlığı düzeltildi.

## Çalıştırılamayan / sınırlı kontroller
- **GitHub Pages'te gerçek yayın:** yapılmadı (hesabınızda işlem yapmadım).
- **Gerçek akıllı tahta, dokunmatik tablet ve telefon:** yapılmadı; ekran boyutları masaüstü tarayıcıda taklit edildi (dokunma yerine fare tıklaması).
- **Firefox ve Safari:** test edilmedi (yalnızca Edge/Chromium).
- **Sesli okuma (Listen) açık durumu:** test ortamında İngilizce ses yoktu; yalnızca “ses yoksa düğme gizli” yolu doğrulandı. Sesli cihazda elle deneyin.
- **Tam ekranın gerçekten açılması:** başsız (headless) tarayıcıda yalnızca çökme olmadığı doğrulandı.
- **Ekran okuyucu (NVDA/VoiceOver) ile dinleme:** yapılmadı; ARIA etiketleri, canlı bölge, odak yönetimi kodda var ve klavye testleri geçti.
- **Pedagojik doğruluk:** otomatik testler dilin doğallığını kanıtlamaz; içerik elle incelendi (CONTENT_REVIEW.md).

Hiçbir test mutlak hatasızlık garantisi vermez.


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
