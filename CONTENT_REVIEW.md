# İçerik incelemesi — Week 1 (Present Simple)

Bu belge, otomatik testlerin yerini tutmayan **insan gözüyle yapılan içerik incelemesini** kaydeder. Otomatik doğrulama (`npm run validate`) sayıları, kimlikleri, cevap anahtarlarını ve dosya yollarını kontrol eder; dilin doğallığını ve pedagojik uygunluğu kontrol edemez.

## Gerçek içerik sayıları (doğrulama çıktısından)

| Bölüm | Sayı | Dağılım |
|---|---|---|
| A Multiple Choice | 60 | 18 olumlu · 18 olumsuz · 18 soru/kısa cevap · 6 karma |
| B Jumbled | 36 | 12 olumlu · 12 olumsuz · 12 soru (4'ü WH) |
| C Fill in the Blanks | 30 | 10 olumlu · 10 olumsuz · 10 soru/kısa cevap (2'si WH) |
| D Change the Sentence | 18 | 9 → olumsuz · 9 → yes/no sorusu |
| E Fix the Mistake | 18 | 6 olumlu · 6 olumsuz · 6 soru |
| F Look / Read and Decide | 18 | 9 doğru · 9 yanlış |
| G Complete the Dialogue | 12 | 2–4 satır, konuşanlar adlandırılmış |
| H Mini Reading | 3 metin × 4 = 12 | metinler 34, 36, 34 kelime |
| **Toplam puanlanabilir** | **204** | |
| I Speaking Cards | 12 | açık uçlu, puanlanmaz |
| Learn | 12 konu · 84 örnek · 24 öğretmenle uygulama adımı | |
| Words | 12 kart | |
| Oyunlar (6) | Picture Reveal 14 resim · Sentence Switch 9 özne × 12 eylem · Question Door 10 kapı · Memory Match 12 kelimeden 6 çift · Yes or No? 12 ipucu · Spin and Say (Sentence Switch verisiyle) | bankalardan bağımsız, toplama eklenmedi |

Öğretim örnekleri, oyun maddeleri ve aynı sorunun karıştırılmış hâlleri 204'e **dahil değildir**.

## Kelime kapsamı
Hedef 12 ifade: play football, read a book, watch TV, eat apples, drink water, go to school, get up, have breakfast, do homework, brush my teeth, study English, like cats.
Ek kelimeler resimle veya bağlamla desteklenir: *every day / morning / evening, at seven, on Sunday* (takvim şeridi ve saat kutusu HTML'dir), *in the park, at school, at home, toast, orange juice, milk, fish, Leo, Ana, Ms. Rosa*. Belirli bir ders kitabına uyum iddiası yoktur.

## İnceleme ilkeleri ve verilen kararlar
1. **Tek doğru cevap:** Her MC/diyalog/okuma maddesinde tek doğru seçenek var; çeldiriciler hedef hatalardan (plays/play, don't/doesn't, Do/Does, my/her) geliyor. Seçenekler göstermede karışır, kimlikle değerlendirilir.
2. **Kişisel tercih:** “Do you like cats?” gibi sorular yalnızca bağlam (karakter kartı / “Sam likes cats.”) verildiğinde puanlanır. Konuşma kartlarında kişisel sorular açık uçludur, “Answers can be different.” notu vardır.
3. **Konuşanın korunması:** “Ms. Rosa asks Sam: Do you…?” → “Yes, I do.” doğru; “Yes, you do.” çeldiricidir. “Do you and Sam…?” → “Yes, we do.”
4. **Doğru/yanlış maddeleri:** Her “False” maddesi karttaki ✗, saat, takvim veya açık bir olumsuz cümleyle çürütülür (örn. “Mia reads every evening. She doesn't watch TV.” → “Mia watches TV every evening.” = False). Metinde söylenmeyen bilgi “yanlış” sayılmadı.
5. **Resim–cümle uyumu:** Olumsuz cümlelerde, cümleyle çelişen resimler (ör. “He doesn't drink water.” + su içen Sam) incelemede bulunup 17 maddede değiştirildi. Tek bir eylem resminden “her gün / hiç” sonucu çıkarılmaz; rutin için takvim şeridi kullanılır.
6. **Fiil biçimleri:** plays, watches, brushes, goes, does, studies, has ve doesn't/Does sonrası yalın fiil, doğrulanmış listeden gelir. Sentence Switch, verideki `base` + `s` biçimlerini kullanır (harf ekleyip çıkarmaz); iyelik (my/your/his/her/our/their) özneyle değişir. Birim testleri: `He watches TV.`, `She has breakfast.`, `Does Sam study English?`, `She brushes her teeth.`, `Do you brush your teeth?`
7. **İki “do”:** “He doesn't do his homework.” / “Do you do your homework?” örneklerinde yardımcı do ile eylem do ayrı gösterildi (Learn 7 notu, Jumbled B-30 iki ayrı “do” kartı).
8. **Kapsam sınırları:** am/is/are ayrı ünite değil; yalnızca Learn 12'de “She is happy. → Is she happy?” ile “She plays. → Does she play?” farkı. Present Continuous, Past Simple vb. yok. “Bütün sorular Do/Does ile başlar” denmedi.
9. **Yazılı cevap normalizasyonu:** boşluk, büyük/küçük harf, düz/kıvrık kesme işareti, sondaki noktalama; *do not = don't*, *does not = doesn't*. *don't ≠ doesn't* korunur. *dont* kabul edilmez ama öğrenciye “Write don't with '” denir. Küçük “i” kabul edilir, nazik not gösterilir. Yaklaşık (fuzzy) eşleştirme yok.
10. **Jumbled alternatifleri:** Zaman/yer başa alınabilen cümlelerde iki sıra da kabul edilir (“Every day I read a book.”). Diğerlerinde tek doğal sıra vardır ve ipucu başlangıcı söyler.

## Bilinen yargı noktaları (öğretmen kararı)
- Bazı olumsuz maddelerde resim yalnızca konuyu/karakteri hatırlatır (ör. okul resmi + “on Sunday”); cevabı resim değil dil bilgisi belirler.
- Fix the Mistake çeldiricilerinde öğrencilerin sık yaptığı yazım hataları bilerek kullanıldı (*playes, studys, haves*); bunlar yalnızca “yanlış seçenek” olarak görünür.
- “It's a cat!” (G-9) ve “Pepper is Sam's cat.” (H-3) içinde *is* geçer; ayrı öğretilmez, anlamı resimden açıktır.
- Okuma metinleri 30–45 kelime aralığında; yeni kelimeler (toast, orange juice, fish) resimde görünür.

## İnceleme kapsamı
Her maddenin metni, seçenekleri, cevabı, ipucu ve açıklaması tek tek okundu; Learn örnekleri ve kartlar da gözden geçirildi. Yine de ikinci bir öğretmen gözüyle sınıf öncesi kısa bir kontrol önerilir. Otomatik doğrulama pedagojik incelemenin yerine geçmez.


## v2.0 eklemeleri
- Kitap kelimeleri (Language Log, Unit 1, s.18): live, speak, study, dance, play, walk, ride, eat, smile, visit. 10 kelime kartı, Learn 13 (8 örnek + 2 uygulama), **I · Book words: 30 soru** (10 resim-kelime, 8 cümle biçimi, 6 cümle kurma, 6 boşluk doldurma), 4 konuşma kartı. Toplam puanlanabilir: 204 temel + 30 = **234**.
- **v2.2 — A1 action verbs:** run, jump, swim, sing, draw, sleep, write, cook, clean, wash, climb, fly, catch, open, listen, feed. 16 resimli kelime kartı (3. kelime seti), **J · Action verbs: 24 soru** (8 resim-kelime, 8 olumlu, 4 olumsuz, 4 soru), Listen and Choose / Picture Reveal / Sentence Switch / Yes or No (20) ve 2 yeni konuşma kartı (toplam 18). Toplam puanlanabilir: 204 temel + 30 + 24 = **258**. Rozetler artık madalya görselleri; sertifika süslü çerçeveli; worksheet renkli başlıklı.
- dance → dances, ride → rides, smile → smiles (sadece -s); live → lives. Change Machine bu biçimleri doğrulanmış `s` alanından alır.
- Examples: 16 Change Machine örneği (he/she/it/isimler ve I/you/we/they).
