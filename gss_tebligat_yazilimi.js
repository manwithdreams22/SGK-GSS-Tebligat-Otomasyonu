// AUTHOR : MUHAMMET ICTEN BU PROGRAM MUHAMMET ICTEN TARAFINDAN GELISTIRILMISTIR.
(async () => {
  // ---------------- PANEL & İSTATİSTİK KONTROLLERİ----------------
  let running = true;
  let speed = 1; 
  let dynamicDelay = 1; 
  
  const stats = { success: 0, fail: 0, skipped: 0, total: 0 };
  const history = [];

  // MutationObserver - Bekleyiniz durumunu gözlemle
  const observer = new MutationObserver(() => {
    const bekleyiniz = document.querySelector("#bekleyinizStatusDialog[aria-hidden='false']");
    dynamicDelay = bekleyiniz ? 3 : 1; 
  });
  observer.observe(document.body, { subtree: true, attributes: true, childList: true });

  // Dashboard Arayüzünün Oluşturulması
  if (!document.getElementById("autobotPanel")) {
    const panel = document.createElement("div");
    panel.id = "autobotPanel";
    panel.style = `
      position: fixed; top: 20px; right: 20px; width: 380px; 
      background: #ffffff; color: #333333; padding: 0; 
      font-size: 13px; z-index: 99999; overflow: hidden; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      border: 1px solid #e0e0e0; border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: height 0.3s ease;
    `;
    
    panel.innerHTML = `
      <div id="autobotHeader" style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #ffffff; padding: 12px 16px; font-weight: 600; font-size: 14px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 11px; border-top-right-radius: 11px;">
        <span>GSS Tebligat Otomasyonu</span>
        <button id="minimizeBtn" style="background:transparent; border:none; color:#fff; cursor:pointer; font-size:16px; padding:0 5px; line-height:1;">−</button>
      </div>
      <div id="autobotBody" style="padding: 16px;">
        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-weight: 500; color: #4b5563;">Hız Çarpanı: <span id="speedVal" style="font-weight:600; color:#1e3a8a;">1.0x</span></span>
          <input type="range" id="speedRange" min="0.5" max="3" step="0.1" value="1" style="width: 60%; cursor: pointer; accent-color: #3b82f6;">
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 11fr); gap: 10px; margin-bottom: 15px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #166534; font-weight: 600; text-transform: uppercase;">Başarı</div>
            <div id="successCount" style="font-size: 20px; font-weight: 700; color: #15803d; margin-top: 4px;">0</div>
          </div>
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #991b1b; font-weight: 600; text-transform: uppercase;">Hata</div>
            <div id="failCount" style="font-size: 20px; font-weight: 700; color: #b91c1c; margin-top: 4px;">0</div>
          </div>
          <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #92400e; font-weight: 600; text-transform: uppercase;">Atlandı</div>
            <div id="skippedCount" style="font-size: 20px; font-weight: 700; color: #b45309; margin-top: 4px;">0</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase;">Toplam Taranan</div>
            <div id="totalCount" style="font-size: 20px; font-weight: 700; color: #334155; margin-top: 4px;">0</div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #64748b; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>Sistem Gecikme Durumu:</span>
          <span id="delayStatus" style="font-weight: 600; color: #0f172a;">1.00x</span>
        </div>

        <div style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">İşlem Akış Grafiği</div>
        <canvas id="flowGraph" width="346" height="80" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; display: block; margin-bottom: 12px;"></canvas>
        
        <div style="text-align: right; font-size: 10px; color: #94a3b8; font-weight: 500; letter-spacing: 0.3px;">
          Yazılım Geliştirici: <span style="color: #4b5563; font-weight: 600;">Muhammet İÇTEN</span>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    const header = document.getElementById("autobotHeader");
    header.onmousedown = function(e){
      if(e.target.tagName === 'BUTTON') return;
      let offsetX = e.clientX - panel.offsetLeft;
      let offsetY = e.clientY - panel.offsetTop;
      const move = e2 => { panel.style.left = (e2.clientX - offsetX)+"px"; panel.style.top = (e2.clientY - offsetY)+"px"; };
      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
      document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
    };

    let isMinimized = false;
    document.getElementById("minimizeBtn").onclick = () => {
      const body = document.getElementById("autobotBody");
      isMinimized = !isMinimized;
      body.style.display = isMinimized ? "none" : "block";
      document.getElementById("minimizeBtn").innerText = isMinimized ? "+" : "−";
    };

    document.getElementById("speedRange").oninput = (e) => {
      speed = parseFloat(e.target.value);
      document.getElementById("speedVal").innerText = speed.toFixed(1) + "x";
    };
  }

  const updateUI = () => {
    document.getElementById("successCount").innerText = stats.success;
    document.getElementById("failCount").innerText = stats.fail;
    document.getElementById("skippedCount").innerText = stats.skipped;
    document.getElementById("totalCount").innerText = stats.total;
    document.getElementById("delayStatus").innerText = (dynamicDelay * (1 / speed)).toFixed(2) + "x";

    const flowGraphEl = document.getElementById("flowGraph");
    if (!flowGraphEl) return;
    const ctx = flowGraphEl.getContext("2d");
    ctx.clearRect(0,0,346,80);
    
    history.slice(-43).forEach((h,i)=>{
      if(h.status==="success") ctx.fillStyle="#10b981"; 
      else if(h.status==="fail") ctx.fillStyle="#ef4444";    
      else if(h.status==="skipped") ctx.fillStyle="#f59e0b"; 
      ctx.fillRect(i*8, 75, 6, -45);
    });
  };

  // ---------------- ZAMANLAMA VE DOM YARDIMCILARI ----------------
  const sleep = ms => new Promise(r => setTimeout(r, (ms * dynamicDelay) / speed));

  const clickReal = el => {
    if (!el) throw new Error("Tıklanacak element bulunamadı");
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    console.log("Tıklama yapıldı:", el);
  };

  const waitFor = async (sel, timeout = 30000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(sel);
      if (el) return el;
      await sleep(200);
    }
    return null;
  };

  const waitForBekleyiniz = async () => {
    if (document.querySelector("#bekleyinizStatusDialog[aria-hidden='false']")) {
      console.log("Bekleyiniz açık akış yavaşlıyor...");
      await sleep(1500);
    }
  };

  const getTcFromCkeditor = () => {
    const textarea = document.querySelector("#inboxItemInfoForm\\:ckeditorInstance_window11");
    if (!textarea) return null;
    const html = textarea.value || "";
    const match = html.match(/TC Kimlik Numarası:\s*([0-9]{11})/i);
    return match ? match[1] : null;
  };

  const typeSlow = async (input, text, delay = 100) => {
    input.focus();
    input.value = "";
    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(delay);
    }
  };

  const smartSleep = async ms => {
    let total = 0;
    while (total < ms) {
      const ajaxBusy = !!document.querySelector("#bekleyinizStatusDialog[aria-hidden='false']");
      if (ajaxBusy) {
        await sleep(1000);
        total += 1000;
      } else {
        await sleep(250);
        total += 250;
      }
    }
  };

  const closeDialogSafely = async () => {
    const closeBtn = document.querySelector(".ui-dialog-titlebar-close");
    if (closeBtn) {
      clickReal(closeBtn);
      await smartSleep(2000);
    }
  };

  // ---------------- ANA DÖNGÜ ----------------
  while (true) {
    if (!running) { 
      await new Promise(r => setTimeout(r, 500)); 
      continue; 
    }

    let success = false;
    let isDataFilledSuccessfully = false;
    let tcknBackup = null;

    // Indexli detay butonlarını sırayla dene 
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      if (!running) break;
      
      try {
        const detayBtn = document.querySelector(
          `#mainInboxForm\\:inboxDataTable\\:${rowIndex}\\:detayGosterButton`
        );

        if (!detayBtn) {
          console.log(`index ${rowIndex} yok, diğerine geçiliyor...`);
          continue;
        }

        stats.total++;
        updateUI();
        console.log(`Detay deneniyor index: ${rowIndex}`);
        clickReal(detayBtn);
        await smartSleep(2000);

        const tckn = getTcFromCkeditor();
        if (!tckn) {
          console.warn(`TC okunamadı index ${rowIndex}, diğer belgeye geçiliyor`);
          stats.skipped++;
          history.push({ status: "skipped", tckn: null, time: new Date().toLocaleTimeString() });
          updateUI();
          await closeDialogSafely();
          continue;
        }

        tcknBackup = tckn;
        console.log("TC bulundu:", tckn);

        // Bilgiler sekmesine geç
        const bilgilerTab = await waitFor("#inboxItemInfoForm\\:dialogTabMenuLeft\\:uiRepeat\\:1\\:cmdbutton", 5000);
        if (!bilgilerTab) throw new Error("Bilgiler tabı yok");
        clickReal(bilgilerTab);
        await smartSleep(1200);

        // Gereği tipi
        const geregiTipi = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:19\\:geregiSecimTipiId", 5000);
        if (!geregiTipi) throw new Error("Gereği tipi combobox yok");
        geregiTipi.value = "G";
        geregiTipi.dispatchEvent(new Event("change", { bubbles: true }));
        await smartSleep(1000);

        // TC input
        const tcInput = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:19\\:geregiLov\\:LovText", 5000);
        if (!tcInput) throw new Error("TC input bulunamadı");
        await typeSlow(tcInput, tckn, 100);

        tcInput.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
        tcInput.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));
        await smartSleep(500);

        await waitForBekleyiniz();
        await smartSleep(1000);

        // LOV node
        const nodeSel = "#inboxItemInfoForm\\:evrakBilgileriList\\:19\\:geregiLov\\:lovTree\\:0_0";
        const node = await waitFor(nodeSel, 5000);
        if (!node) {
        
          console.warn(`TC listede görünmedi index ${rowIndex}, diğer belgeye geçiliyor`);
          stats.skipped++;
          history.push({ status: "skipped", tckn, time: new Date().toLocaleTimeString() });
          updateUI();
          await closeDialogSafely();
          continue;
        }
        
        const treeLabel = node.querySelector("span.ui-treenode-label");
        if (!treeLabel) throw new Error("Tree node label bulunamadı");
        clickReal(treeLabel);
        await smartSleep(1000);

        await waitForBekleyiniz();
        await smartSleep(700);

        // Lov seçilen tablo
        const table = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:19\\:geregiLov\\:LovSecilenTable", 5000);
        if (!table) {
          console.warn(`LovSecilenTable bulunamadı index ${rowIndex}, diğer belgeye geçiliyor`);
          stats.skipped++;
          history.push({ status: "skipped", tckn, time: new Date().toLocaleTimeString() });
          updateUI();
          await closeDialogSafely();
          continue;
        }

        // Posta ve kanun 
        const s1 = table.querySelector("select[id$=':selectOneMenu']");
        if (s1) { s1.value = "1"; s1.dispatchEvent(new Event("change", { bubbles: true })); await smartSleep(500); }
        const s2 = table.querySelector("select[id$=':selectOneMenuTebligKanunu']");
        if (s2) { s2.value = "2"; s2.dispatchEvent(new Event("change", { bubbles: true })); await smartSleep(500); }

        // Checkbox
        const chkInput = table.querySelector("input[id$=':tebligAdresId_input']");
        if (chkInput && !chkInput.checked) clickReal(chkInput);
        await smartSleep(300);

        // Akış LOV
        const akisBtn = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:22\\:akisLov\\:treeButton", 5000);
        if (akisBtn) clickReal(akisBtn);
        await smartSleep(750);
        const akisNode = await waitFor("#inboxItemInfoForm\\:evrakBilgileriList\\:22\\:akisLov\\:lovTree\\:0", 5000);
        if (akisNode) {
          const akisLabel = akisNode.querySelector("span.ui-treenode-label");
          if (akisLabel) clickReal(akisLabel);
        }
        await smartSleep(600);

        // SGK TC
        const sgk = document.querySelector("#inboxItemInfoForm\\:evrakBilgileriList\\:25\\:sgkTcknAutoComplete_input");
        if (sgk) { sgk.value = tckn; sgk.dispatchEvent(new Event("input", { bubbles: true })); await smartSleep(750); }

        // Paraf
        const parafBtn = await waitFor("#inboxItemInfoForm\\:dialogTabMenuRight\\:uiRepeat\\:2\\:cmdbutton", 5000);
        if (!parafBtn) throw new Error("Paraf butonu bulunamadı");
        console.log("Paraf butonuna basılıyor...");
        clickReal(parafBtn);
        
        // Giriş Veri doldurma aşaması başarıyla bitti.
        isDataFilledSuccessfully = true;
        break; 

      } catch (err) {
     
        console.warn(`Giriş Veri doldurma aşamasında hata oluştu ->`, err.message);
        stats.fail++;
        history.push({ status: "fail", tckn: null, time: new Date().toLocaleTimeString() });
        updateUI();
        
        await closeDialogSafely();
        continue; 
      }
    }

    // PARAF SONRASI
    // Parafa basıldıktan sonra imza tamamlanana kadar bu evraktan çıkış imkansızdır.!
    if (isDataFilledSuccessfully) {
      let imzaBtn = null;
      console.log("İmza butonu yüklenene kadar bekleniyor...");
      
      while (!imzaBtn) {
        imzaBtn = document.querySelector("#imzalaForm\\:imzalaButton");
        if (!imzaBtn) {
          await new Promise(r => setTimeout(r, 300)); 
        }
      }

      console.log("İmza butonu yakalandı! 3 saniye bekleniyor...");
      await smartSleep(3000);
      await waitForBekleyiniz();

      console.log("İmza butonuna basılıyor...");
      clickReal(imzaBtn);

      console.log("İmza tıklandı. ekran tamamen kapanana kadar bekleniyor...");
      // İmza ekranı yok olana kadar kodu burada kilitler
      while (true) {
        const acikDialog = document.querySelector(".ui-dialog[aria-hidden='false']");
        if (!acikDialog) {
          console.log("Pencere kapandı sıradaki evraka geçiliyor.");
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }

      stats.success++;
      history.push({ status: "success", tckn: tcknBackup, time: new Date().toLocaleTimeString() });
      updateUI();
      success = true;
    }

    if (!success && running) {
      console.log("Liste sonuna gelindi veya tüm işlemler beklemede kontrol ediliyor...");
      await smartSleep(5000);
    }
  }
})();