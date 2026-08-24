// content.js - RTL Direction Engine (High Performance & Zero Memory Leaks)

let elementModeActive = false;
let resetMode = false;
let activeHoverEl = null;
let tooltipEl = null;
let topHudEl = null;
let toastEl = null;

let config = {
  setDirAttr: true,
  forceTextAlign: false,
  lang: 'en'
};

const i18n = {
  en: {
    hudInspect: 'Click element to toggle RTL',
    hudReset: 'Click element to reset direction',
    hudDone: 'Done (Esc)',
    toastApplied: 'RTL applied to {desc}',
    toastRestored: 'LTR restored on {desc}',
    toastPageRtl: 'Page set to RTL',
    toastPageLtr: 'Page set to LTR',
    toastResetAll: 'All overrides cleared'
  },
  ar: {
    hudInspect: 'اضغط على أي عنصر لتبديل الاتجاه',
    hudReset: 'اضغط على العنصر لإلغاء الاتجاه',
    hudDone: 'إنهاء (Esc)',
    toastApplied: 'تم تطبيق RTL على {desc}',
    toastRestored: 'تمت استعادة LTR لـ {desc}',
    toastPageRtl: 'تم تعيين الصفحة إلى RTL',
    toastPageLtr: 'تم تعيين الصفحة إلى LTR',
    toastResetAll: 'تمت استعادة الوضع الافتراضي'
  }
};

function t(key, params = {}) {
  const dict = i18n[config.lang] || i18n.en;
  let str = dict[key] || i18n.en[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

function getElementDescriptor(el) {
  if (!el || !el.tagName) return 'element';
  const tag = el.tagName.toLowerCase();
  const idStr = el.id ? `#${el.id}` : '';
  let classStr = '';
  if (typeof el.className === 'string' && el.className) {
    classStr = '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.');
  } else if (el.className && typeof el.className.baseVal === 'string' && el.className.baseVal) {
    classStr = '.' + el.className.baseVal.split(/\s+/).filter(Boolean).slice(0, 2).join('.');
  }
  return `<${tag}${idStr}${classStr}>`;
}

// 1. Top HUD Banner
function getOrCreateTopHud() {
  if (!topHudEl) {
    topHudEl = document.createElement('div');
    topHudEl.dataset.rtlHud = 'true';
    topHudEl.style.cssText = `
      position: fixed;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: #0f172a;
      border: 1px solid #38bdf8;
      border-radius: 6px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #f8fafc;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      user-select: none;
      pointer-events: auto;
    `;

    const icon = document.createElement('span');
    icon.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`;
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    topHudEl.appendChild(icon);

    const text = document.createElement('span');
    text.id = 'rtl-hud-text';
    text.textContent = t('hudInspect');
    topHudEl.appendChild(text);

    const doneBtn = document.createElement('button');
    doneBtn.id = 'rtl-hud-done-btn';
    doneBtn.textContent = t('hudDone');
    doneBtn.style.cssText = `
      background: #38bdf8;
      color: #04101e;
      border: none;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    `;
    doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopElementMode();
    });
    topHudEl.appendChild(doneBtn);

    document.documentElement.appendChild(topHudEl);
  }
  return topHudEl;
}

function updateHudLanguage() {
  if (topHudEl) {
    topHudEl.setAttribute('dir', config.lang === 'ar' ? 'rtl' : 'ltr');
    const hudText = document.getElementById('rtl-hud-text');
    if (hudText) hudText.textContent = resetMode ? t('hudReset') : t('hudInspect');
    const doneBtn = document.getElementById('rtl-hud-done-btn');
    if (doneBtn) doneBtn.textContent = t('hudDone');
  }
}

// 2. Mini Toast Feedback
function showToast(msg, isSuccess = true) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.dataset.rtlToast = 'true';
    toastEl.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: #0f172a;
      border-radius: 6px;
      padding: 6px 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.15s ease;
      opacity: 0;
    `;
    document.documentElement.appendChild(toastEl);
  }

  toastEl.setAttribute('dir', config.lang === 'ar' ? 'rtl' : 'ltr');
  toastEl.textContent = msg;
  toastEl.style.border = isSuccess ? '1px solid #38bdf8' : '1px solid #f43f5e';
  toastEl.style.color = isSuccess ? '#38bdf8' : '#f43f5e';
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    if (toastEl) {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(6px)';
    }
  }, 1800);
}

// 3. Floating Tag Label
function getOrCreateTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.dataset.rtlTooltip = 'true';
    tooltipEl.style.cssText = `
      position: fixed;
      z-index: 2147483646;
      background: #0f172a;
      border: 1px solid #38bdf8;
      border-radius: 4px;
      padding: 2px 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 600;
      color: #38bdf8;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      display: none;
    `;
    document.documentElement.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function updateTooltip(el) {
  try {
    const tip = getOrCreateTooltip();
    if (!el || !elementModeActive) {
      tip.style.display = 'none';
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      tip.style.display = 'none';
      return;
    }

    const desc = getElementDescriptor(el);
    const isCurrentlyRtl = el.style.direction === 'rtl' || el.getAttribute('dir') === 'rtl';

    tip.textContent = `${desc} ${isCurrentlyRtl ? '[RTL]' : '[LTR]'}`;
    tip.style.borderColor = resetMode ? '#f43f5e' : '#38bdf8';
    tip.style.color = resetMode ? '#f43f5e' : '#38bdf8';

    let top = rect.top - 24;
    let left = rect.left;
    if (top < 4) top = rect.bottom + 4;
    if (left + 160 > window.innerWidth) left = window.innerWidth - 170;
    if (left < 4) left = 4;

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
    tip.style.display = 'block';
  } catch (e) {}
}

function getSafeTarget(target) {
  if (!target) return null;
  let el = target.nodeType === Node.TEXT_NODE ? target.parentElement : target;
  if (!el || !el.getAttribute) return null;
  if (el.closest && (el.closest('[data-rtl-hud]') || el.closest('[data-rtl-tooltip]') || el.closest('[data-rtl-toast]'))) {
    return null;
  }
  return el;
}

// O(1) Fast Hover Cleanup (Prevents full-DOM scan on every mouse event)
function clearActiveHighlight() {
  if (activeHoverEl) {
    activeHoverEl.style.outline = '';
    activeHoverEl.style.outlineOffset = '';
    delete activeHoverEl.dataset.rtlHighlight;
    activeHoverEl = null;
  }
  if (tooltipEl) tooltipEl.style.display = 'none';
}

function handleMouseMove(e) {
  if (!elementModeActive) return;
  const el = getSafeTarget(e.target);
  if (!el || el === activeHoverEl) return;

  clearActiveHighlight();
  activeHoverEl = el;

  const color = resetMode ? '#f43f5e' : '#38bdf8';
  el.dataset.rtlHighlight = 'true';
  el.style.outline = `2px solid ${color}`;
  el.style.outlineOffset = '-1px';

  updateTooltip(el);
}

function handleMouseOut(e) {
  if (!elementModeActive) return;
  const el = getSafeTarget(e.target);
  if (el && el === activeHoverEl) {
    clearActiveHighlight();
  }
}

function handleClick(e) {
  if (!elementModeActive) return;
  const el = getSafeTarget(e.target);
  if (!el) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const isCurrentlyRtl = el.style.direction === 'rtl' || el.getAttribute('dir') === 'rtl';
  const shouldMakeRtl = resetMode ? false : !isCurrentlyRtl;

  applyRtlToElement(el, !shouldMakeRtl);

  const desc = getElementDescriptor(el);
  if (shouldMakeRtl) {
    showToast(t('toastApplied', { desc }), true);
  } else {
    showToast(t('toastRestored', { desc }), false);
  }

  updateTooltip(el);
}

function applyRtlToElement(el, remove = false) {
  if (!el) return;
  if (remove) {
    el.style.direction = '';
    if (config.setDirAttr) el.removeAttribute('dir');
    if (config.forceTextAlign) el.style.textAlign = '';
    delete el.dataset.rtlModified;
  } else {
    el.style.direction = 'rtl';
    if (config.setDirAttr) el.setAttribute('dir', 'rtl');
    if (config.forceTextAlign) el.style.textAlign = 'right';
    el.dataset.rtlModified = 'true';
  }
}

function clearAllHighlights() {
  clearActiveHighlight();
  document.querySelectorAll('[data-rtl-highlight]').forEach((el) => {
    el.style.outline = '';
    el.style.outlineOffset = '';
    delete el.dataset.rtlHighlight;
  });
  if (tooltipEl) tooltipEl.style.display = 'none';
}

function startElementMode(isReset = false) {
  stopElementMode();
  resetMode = isReset;
  elementModeActive = true;

  document.addEventListener('mouseover', handleMouseMove, { passive: true, capture: true });
  document.addEventListener('mouseout', handleMouseOut, { passive: true, capture: true });
  document.addEventListener('click', handleClick, true);
  document.documentElement.style.cursor = 'crosshair';

  const hud = getOrCreateTopHud();
  hud.style.display = 'flex';
  updateHudLanguage();
}

function stopElementMode() {
  elementModeActive = false;
  resetMode = false;
  document.removeEventListener('mouseover', handleMouseMove, { capture: true });
  document.removeEventListener('mouseout', handleMouseOut, { capture: true });
  document.removeEventListener('click', handleClick, true);
  clearAllHighlights();
  document.documentElement.style.cursor = '';

  if (topHudEl) topHudEl.style.display = 'none';
  if (tooltipEl) tooltipEl.style.display = 'none';
}

function setPageDirection(direction) {
  const isRtl = direction === 'rtl';
  const html = document.documentElement;
  const body = document.body;

  if (isRtl) {
    html.style.direction = 'rtl';
    if (body) body.style.direction = 'rtl';
    if (config.setDirAttr) {
      html.setAttribute('dir', 'rtl');
      if (body) body.setAttribute('dir', 'rtl');
    }
    showToast(t('toastPageRtl'), true);
  } else if (direction === 'ltr') {
    html.style.direction = 'ltr';
    if (body) body.style.direction = 'ltr';
    if (config.setDirAttr) {
      html.setAttribute('dir', 'ltr');
      if (body) body.setAttribute('dir', 'ltr');
    }
    showToast(t('toastPageLtr'), false);
  } else {
    html.style.direction = '';
    if (body) body.style.direction = '';
    html.removeAttribute('dir');
    if (body) body.removeAttribute('dir');
    showToast(t('toastResetAll'), false);
  }
}

function resetAllOverrides() {
  setPageDirection('reset');
  document.querySelectorAll('[data-rtl-modified]').forEach((el) => {
    el.style.direction = '';
    el.removeAttribute('dir');
    el.style.textAlign = '';
    delete el.dataset.rtlModified;
  });
  clearAllHighlights();
  stopElementMode();
  showToast(t('toastResetAll'), false);
}

function getPageStatus() {
  const htmlDir = document.documentElement.style.direction || document.documentElement.getAttribute('dir') || '';
  const bodyDir = document.body ? (document.body.style.direction || document.body.getAttribute('dir') || '') : '';
  const isPageRtl = htmlDir === 'rtl' || bodyDir === 'rtl';
  const modifiedCount = document.querySelectorAll('[data-rtl-modified]').length;
  return {
    isPageRtl,
    isInspecting: elementModeActive,
    modifiedCount
  };
}

// Runtime message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.config) {
    config = Object.assign(config, message.config);
    updateHudLanguage();
  }

  if (message.action === 'setLanguage') {
    config.lang = message.lang || 'en';
    updateHudLanguage();
    sendResponse({ success: true });
  } else if (message.action === 'startElementMode') {
    startElementMode(false);
    sendResponse({ success: true, status: getPageStatus() });
  } else if (message.action === 'startResetMode') {
    startElementMode(true);
    sendResponse({ success: true, status: getPageStatus() });
  } else if (message.action === 'stopElementMode') {
    stopElementMode();
    sendResponse({ success: true, status: getPageStatus() });
  } else if (message.action === 'setPageDirection') {
    setPageDirection(message.direction);
    sendResponse({ success: true, status: getPageStatus() });
  } else if (message.action === 'resetAll') {
    resetAllOverrides();
    sendResponse({ success: true, status: getPageStatus() });
  } else if (message.action === 'getStatus') {
    sendResponse({ success: true, status: getPageStatus() });
  }
  return true;
});

// Escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && elementModeActive) {
    stopElementMode();
  }
});