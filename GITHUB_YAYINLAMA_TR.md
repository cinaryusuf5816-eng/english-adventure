# GitHub Pages'te yayımlama — kısa kılavuz (terminal gerekmez)

Bu yol için npm, Python veya terminal **gerekmez**.

## 1. Paketi bilgisayarınızda açın
1. `READY_TO_UPLOAD.zip` dosyasına sağ tıklayın → **Tümünü ayıkla**.
2. Açılan klasörün içinde **doğrudan** şunlar görünmeli: `index.html`, `.nojekyll`, `assets`, `data`, `js`, `styles`.
   - `.nojekyll` gizli bir dosyadır. Windows'ta görmek için Gezgin → **Görünüm → Göster → Gizli öğeler**.

> ZIP dosyasının kendisini GitHub'a yüklemeyin. **Açılmış klasörün içindeki dosya ve klasörleri** yükleyin.

## 2. GitHub'da depo oluşturun
1. github.com → sağ üst **+** → **New repository**.
2. Bir ad verin (örnek: `everyday-english`). **Public** seçin. **Create repository**.

## 3. Dosyaları yükleyin
1. Yeni depoda **uploading an existing file** bağlantısına (veya **Add file → Upload files**) tıklayın.
2. Açtığınız klasörün **içindeki her şeyi** seçip sürükleyin: `index.html`, `.nojekyll` ve `assets`, `data`, `js`, `styles` klasörleri.
   - Klasörün kendisini değil, içindekileri sürükleyin. `index.html` deponun en üst seviyesinde olmalıdır.
   - Tarayıcı `.nojekyll` dosyasını atlarsa: **Add file → Create new file** → ad: `.nojekyll` → içi boş → **Commit**.
3. **Commit changes**.

## 4. Pages'i açın
1. Depoda **Settings → Pages**.
2. **Source: Deploy from a branch**.
3. **Branch: `main`**, klasör: **`/ (root)`** → **Save**.
4. 1–3 dakika bekleyin. Adres: `https://KULLANICI-ADINIZ.github.io/DEPO-ADI/`

## 5. Kontrol
- Ana sayfada büyük kapak resmi görünüyor mu? Week 1 → Words → resimler geliyor mu?
- Resim yoksa: dosya adlarında büyük/küçük harf veya eksik `assets` klasörü olabilir; klasörü yeniden yükleyin.
- Sayfayı yenileyin (F5): aynı bölüm açılmalı (adres `#/week/...` şeklindedir).

## Güncelleme
Yeni sürümde aynı yolla dosyaları tekrar yükleyin (aynı adlı dosyaların üzerine yazılır). Öğrencilerin bu tarayıcıdaki kayıtları korunur.

## Not: iki yöntemi karıştırmayın
- **Yöntem A (bu kılavuz):** hazır paket → Source: *Deploy from a branch*.
- **Yöntem B (geliştirici):** `SOURCE_CODE.zip` içeriği depo olur, `.github/workflows/deploy.yml` otomatik derler → Source: *GitHub Actions*. Ayrıntı: `README_TR.md`.
