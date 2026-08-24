// popup.js - RTL Direction Controller (Clean & Minimal)

const translations = {
  en: {
    appTitle: "RTL Direction",
    appDesc: "Layout Inspector",
    statusReady: "Ready",
    statusInspecting: "Inspecting",
    statusPageRtl: "Page: RTL",
    statusOverridden: "{n} Changed",
    statusIdle: "Ready",
    secPageDir: "PAGE DIRECTION",
    btnPageLtr: "LTR",
    btnPageRtl: "RTL",
    btnInspectTitle: "Inspect Element",
    btnInspectDesc: "Click any element to toggle direction",
    btnResetElement: "Reset Pick",
    btnResetAll: "Reset All",
    chkDualModeTitle: 'Set <code>dir="rtl"</code> attribute',
    chkDualModeDesc: "For Tailwind & CSS frameworks",
    chkForceAlignTitle: 'Force <code>text-align: right</code>',
    chkForceAlignDesc: "Aligns hardcoded LTR text blocks",
    footerTip: "Press <kbd>Esc</kbd> on page to exit inspector"
  },
  ar: {
    appTitle: "توجيه RTL",
    appDesc: "فاحص التخطيط والمحاذاة",
    statusReady: "جاهز",
    statusInspecting: "جاري الفحص",
    statusPageRtl: "الصفحة: RTL",
    statusOverridden: "تم تعديل {n}",
    statusIdle: "جاهز",
    secPageDir: "اتجاه الصفحة",
    btnPageLtr: "LTR",
    btnPageRtl: "RTL",
    btnInspectTitle: "فحص عنصر",
    btnInspectDesc: "اضغط على أي عنصر لتبديل اتجاهه",
    btnResetElement: "إعادة تعيين",
    btnResetAll: "إعادة تعيين الكل",
    chkDualModeTitle: 'تعيين سمة <code>dir="rtl"</code>',
    chkDualModeDesc: 'لتوافق Tailwind ومكتبات CSS',
    chkForceAlignTitle: 'إجبار المحاذاة (<code>text-align: right</code>)',
    chkForceAlignDesc: 'لتعديل الكتل ذات المحاذاة اليدوية',
    footerTip: "اضغط <kbd>Esc</kbd> على الصفحة للخروج من الفحص"
  }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', async () => {
  const htmlRoot = document.getElementById('htmlRoot');
  const btnLangToggle = document.getElementById('btnLangToggle');
  const langEn = document.getElementById('langEn');
  const langAr = document.getElementById('langAr');

  const statusBadge = document.getElementById('statusBadge');
  const btnPageLtr = document.getElementById('btnPageLtr');
  const btnPageRtl = document.getElementById('btnPageRtl');
  const btnInspect = document.getElementById('btnInspect');
  const btnResetElement = document.getElementById('btnResetElement');
  const btnResetAll = document.getElementById('btnResetAll');
  const chkDualMode = document.getElementById('chkDualMode');
  const chkForceAlign = document.getElementById('chkForceAlign');

  let currentTabStatus = null;

  function applyLanguage(lang) {
    currentLang = lang;
    const t = translations[lang] || translations.en;

    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlRoot.setAttribute('lang', lang);

    if (lang === 'ar') {
      langAr.classList.add('active');
      langEn.classList.remove('active');
    } else {
      langEn.classList.add('active');
      langAr.classList.remove('active');
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    updateStatusUi(currentTabStatus);
  }

  // Toggle Language
  btnLangToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(nextLang);
    chrome.storage.local.set({ lang: nextLang });
    sendTabMessage('setLanguage', { lang: nextLang });
  });

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  function getOptionsConfig() {
    return {
      setDirAttr: chkDualMode.checked,
      forceTextAlign: chkForceAlign.checked,
      lang: currentLang
    };
  }

  async function ensureContentScriptInjected(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
    } catch (e) {}
  }

  async function sendTabMessage(action, payload = {}) {
    const tab = await getActiveTab();
    if (!tab || !tab.id || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
      return null;
    }

    const message = Object.assign({ action, config: getOptionsConfig() }, payload);

    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, message, async (res) => {
        if (chrome.runtime.lastError) {
          await ensureContentScriptInjected(tab.id);
          chrome.tabs.sendMessage(tab.id, message, (retryRes) => {
            if (chrome.runtime.lastError) resolve(null);
            else resolve(retryRes);
          });
        } else {
          resolve(res);
        }
      });
    });
  }

  function updateStatusUi(status) {
    currentTabStatus = status;
    const t = translations[currentLang] || translations.en;

    if (!status) {
      statusBadge.textContent = t.statusReady;
      statusBadge.className = 'status-pill';
      return;
    }

    if (status.isInspecting) {
      statusBadge.textContent = t.statusInspecting;
      statusBadge.className = 'status-pill inspecting';
    } else if (status.isPageRtl) {
      statusBadge.textContent = t.statusPageRtl;
      statusBadge.className = 'status-pill active';
      btnPageRtl.classList.add('active');
      btnPageLtr.classList.remove('active');
    } else {
      statusBadge.textContent = status.modifiedCount > 0 
        ? t.statusOverridden.replace('{n}', status.modifiedCount) 
        : t.statusIdle;
      statusBadge.className = status.modifiedCount > 0 ? 'status-pill active' : 'status-pill';
      btnPageLtr.classList.add('active');
      btnPageRtl.classList.remove('active');
    }
  }

  // Load preferences
  const saved = await chrome.storage.local.get(['setDirAttr', 'forceTextAlign', 'lang']);
  if (saved.setDirAttr !== undefined) chkDualMode.checked = saved.setDirAttr;
  if (saved.forceTextAlign !== undefined) chkForceAlign.checked = saved.forceTextAlign;
  if (saved.lang) applyLanguage(saved.lang);
  else applyLanguage('en');

  function persistOptions() {
    chrome.storage.local.set({
      setDirAttr: chkDualMode.checked,
      forceTextAlign: chkForceAlign.checked,
      lang: currentLang
    });
  }

  chkDualMode.addEventListener('change', persistOptions);
  chkForceAlign.addEventListener('change', persistOptions);

  // Segmented Page Direction Buttons
  btnPageLtr.addEventListener('click', async () => {
    btnPageLtr.classList.add('active');
    btnPageRtl.classList.remove('active');
    const res = await sendTabMessage('setPageDirection', { direction: 'ltr' });
    updateStatusUi(res?.status);
  });

  btnPageRtl.addEventListener('click', async () => {
    btnPageRtl.classList.add('active');
    btnPageLtr.classList.remove('active');
    const res = await sendTabMessage('setPageDirection', { direction: 'rtl' });
    updateStatusUi(res?.status);
  });

  // Hero Inspect Action
  btnInspect.addEventListener('click', async () => {
    statusBadge.textContent = (translations[currentLang] || translations.en).statusInspecting;
    statusBadge.className = 'status-pill inspecting';
    await sendTabMessage('startElementMode');
    window.close();
  });

  // Reset Element Pick Mode
  btnResetElement.addEventListener('click', async () => {
    statusBadge.textContent = 'Reset Pick...';
    statusBadge.className = 'status-pill inspecting';
    await sendTabMessage('startResetMode');
    window.close();
  });

  // Reset All Overrides
  btnResetAll.addEventListener('click', async () => {
    btnPageLtr.classList.add('active');
    btnPageRtl.classList.remove('active');
    const res = await sendTabMessage('resetAll');
    updateStatusUi(res?.status);
  });

  // Initial State Query
  const initial = await sendTabMessage('getStatus');
  updateStatusUi(initial?.status);
});