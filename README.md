# GSS Tebligat Otomasyonu 

Bu proje, Elektronik Belge Yönetim Sistemleri (EBYS) veya ilgili kurum portalları (özellikle GSS tebligat işlemleri) üzerinde rutin evrak doldurma, onaylama ve imzalama süreçlerini otomatize etmek için geliştirilmiş tarayıcı tabanlı bir JavaScript otomasyonudur. 

Yazılım, tarayıcı konsolu üzerinden veya kullanıcı betiği (userscript) eklentileriyle çalıştırılarak, manuel yapılan tıklama ve form doldurma işlemlerini insan hatasını ortadan kaldırarak hızlandırır.

## Özellikler

* **Sürüklenebilir Kontrol Paneli (Dashboard):** Ekranın sağ üst köşesinde beliren, durum ve istatistikleri anlık olarak gösteren modern bir arayüz.
* **Gerçek Zamanlı İstatistikler:** Başarılı, Hatalı, Atlanan ve Toplam Taranan evrak sayılarını anında takip edebilme.
* **İşlem Akış Grafiği:** Alt panelde yer alan Canvas tabanlı grafik sayesinde, son 43 işlemin (Başarı/Hata/Atlanan) görsel renk haritasını sunar.
* **Dinamik Hız Çarpanı:** Panel üzerinden script'in çalışma hızını (`0.5x` ile `3.0x` arası) manuel olarak ayarlayabilme.
* **Akıllı Bekleme (Smart Sleep) ve MutationObserver:** Sistemin "Bekleyiniz" (AJAX) diyaloglarını DOM üzerinden dinleyerek, sistem yoğunluğuna göre otomasyonu duraklatır ve sayfa hazır olana kadar güvenle bekler.
* **Hata Toleransı ve Atlayabilme:** Bir evrakta eksik bilgi (örneğin TCKN bulunamaması) veya DOM hatası tespit edilirse, sistemi kilitlemeden o evrakı atlar ve sıradaki işleme geçer.
* **Tam Otomatik Form Doldurma:** * Evrak metninden (CKEditor) TC Kimlik Numarası ayıklama.
    * Gereği Tipi ve LOV (List of Values) ağaç seçimleri.
    * Tebligat kanunu seçimi ve adres onay kutuları.
    * SGK TCKN otomatik girişleri ve Paraf/İmza tetiklemeleri.

## Kurulum ve Kullanım

Bu script herhangi bir sunucu kurulumu gerektirmez doğrudan istemci (tarayıcı) tarafında çalışır.

### Tarayıcı Konsolu
1. GSS / Tebligat işlemlerini yaptığınız kurum portalına giriş yapın ve evrak gelen kutusu (Inbox) sayfasını açın.
2. Klavyenizden `F12` tuşuna basarak (veya Sağ Tık -> İncele diyerek) **Geliştirici Araçları (DevTools)** menüsünü açın.
3. **Console (Konsol)** sekmesine geçin.
4. Bu depodaki JavaScript kodunun tamamını kopyalayıp konsola yapıştırın ve `Enter` tuşuna basın.
5. kodda bulunan const akisNode = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:22\\:akisLov\\:lovTree\\:0", 5000); bu bölümü :lovTree//:0 0 yerine kullandığınız imza akışını tanımlayınız yani 3. imza akışını kullanıyorsanız 2 yazacaksınız yazılım index kuralları gereği 1. sıra yazılım da 0 olarak başlar yani 3. akışı kullanmak istiyorsanız 0 bölümünü 2 olarak güncelleyeceksiniz. ve program S-İMZA kullananlar için geliştirilmiştir. E-İMZA da sorun yaşayabilirsiniz. istek üzerine E-İMZA seçeneği eklenebilir fakat stabilite tehlikeye girebilir.
6. Sağ üst köşede "GSS Tebligat Otomasyonu" paneli belirecektir. İşlem otomatik olarak başlar.

## Arayüz (Dashboard) Tanıtımı

Otomasyon çalıştığında ekrana gelen panel şu bileşenlerden oluşur:
* **Başlık Çubuğu:** Sürüklenebilir alan ve paneli küçültme/büyütme (`- / +`) butonu.
* **Hız Çarpanı:** Otomasyonun tıklama ve bekleme hızını sisteminizin hızına göre optimize edebileceğiniz kaydırma çubuğu.
* **Sayaçlar:** Başarı (Yeşil), Hata (Kırmızı), Atlandı (Sarı) ve Toplam (Gri) kutucukları.
* **Sistem Gecikme Durumu:** O anki AJAX meşguliyeti ve hız çarpanına göre sistemin bekleme durumunu (çarpansal olarak) gösterir.
* **İşlem Akış Grafiği:** Renk kodlu çubuk grafik.

## Yasal Uyarı ve Sorumluluk Reddi

Bu yazılım tamamen **eğitim ve süreç hızlandırma/otomasyon tekniklerini gösterme** amacıyla geliştirilmiştir. 
* Kamu kurumlarına veya özel şirketlere ait portallar üzerinde otomasyon araçları kullanmak ilgili kurumun kullanım koşullarına (TOS) aykırı olabilir.
* Bu betiğin kullanımı sonucunda oluşabilecek veri hataları, hatalı evrak imzalama işlemleri veya hesabınızın kısıtlanması gibi durumlardan **geliştirici sorumlu tutulamaz**. 
* Betiği kullanmadan önce test ortamında denemeniz ve sorumluluğun tamamen sizde olduğunu unutmamanız önemle rica olunur.
* BELGENET kesintileri gibi teknik sorunlar beraberinde gelişen hatalar ve diğer hatalar yüzünden **geliştirici sorumlu tutulamaz**.
* Sistem değişikliği veya Güncellemesi ile değişen Selector idleri yüzünden program çalışmayabilir bu durumdan **geliştirici sorumlu tutulamaz**.

## Geliştirici

* **Yazılım Geliştirici:** Muhammet İÇTEN
* **Versiyon:** 1.0.0
