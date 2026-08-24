![RTL Direction & Layout Inspector](assets/banner.png)

<p align="center">
  <strong>English</strong> • <a href="README.ar.md">العربية</a>
</p>

<p align="center">
  <strong>فاحص واختبار توافق الواجهات العربية (RTL) — Developer-Grade Layout & Direction Inspector</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-38bdf8?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Performance-O(1)%20Zero%20Jank-10b981?style=flat-square" alt="Performance" />
  <img src="https://img.shields.io/badge/Bilingual-English%20%7C%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-3b82f6?style=flat-square" alt="Bilingual" />
  <img src="https://img.shields.io/badge/Tailwind%20%26%20Bootstrap-Compatible-8b5cf6?style=flat-square" alt="Tailwind & Bootstrap" />
  <img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License MIT" />
</p>

---

A lightweight, developer-grade Chrome and Edge extension (Manifest V3) for inspecting and testing Right-to-Left (RTL) layout compatibility on any webpage.

---

## 🎯 Key Features

- **Interactive Element Inspector**: Hover over any component to view its tag/class selector and click to toggle RTL/LTR direction instantly.
- **Segmented Page Switcher**: 1-click toggle between `LTR Normal` and `RTL Mirrored` across `<html>` and `<body>`.
- **Dual Mode Support**: Applies both `style.direction = "rtl"` and the HTML `dir="rtl"` attribute for full compatibility with **Tailwind CSS (`rtl:`)**, **Bootstrap 5 RTL**, and modern CSS frameworks.
- **Force Text Align**: Optional setting to override hardcoded `text-align: left` rules.
- **In-Page HUD Banner**: Non-intrusive floating status pill on page with keyboard shortcut hints.
- **Bilingual Interface**: Instant toggle between **English** and **Arabic (العربية)** with native RTL layout.
- **High Performance & Memory Efficient**: $O(1)$ hover cleanup and zero detached DOM memory leaks.
- **Zero AI Slop**: Minimalist design system with sharp inline SVG vector icons and no dependencies.

---

## 🚀 Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/AboALhasanx/rtl-direction-extension.git
   ```
2. Open your Chromium browser (Chrome, Edge, Brave, Arc, etc.) and navigate to:
   - `chrome://extensions/` or `edge://extensions/`
3. Enable **Developer mode** (toggle in top-right corner).
4. Click **Load unpacked** and select the extension folder.

---

## ⌨️ Usage & Shortcuts

- **Inspect Elements**: Open the extension popup and click **Inspect Element**. Click any element on the page to toggle its direction.
- **Exit Inspector**: Press <kbd>Esc</kbd> or click **Done** in the top HUD banner.
- **Reset All**: Click **Reset All** in the popup to clear all applied RTL overrides without reloading the page.

---

## 📄 License

[MIT](LICENSE)
