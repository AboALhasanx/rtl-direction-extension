# RTL Direction & Layout Inspector

A lightweight, developer-grade Chrome and Edge extension (Manifest V3) for inspecting and testing Right-to-Left (RTL) layout compatibility on any webpage.

---

## Key Features

- **Interactive Element Inspector**: Hover over any component to view its tag/class selector and click to toggle RTL/LTR direction instantly.
- **Segmented Page Switcher**: 1-click toggle between `LTR Normal` and `RTL Mirrored` across `<html>` and `<body>`.
- **Dual Mode Support**: Applies both `style.direction = "rtl"` and the HTML `dir="rtl"` attribute for full compatibility with **Tailwind CSS (`rtl:`)**, **Bootstrap 5 RTL**, and modern CSS frameworks.
- **Force Text Align**: Optional setting to override hardcoded `text-align: left` rules.
- **In-Page HUD Banner**: Non-intrusive floating status pill on page with keyboard shortcut hints.
- **Bilingual Interface**: Instant toggle between **English** and **Arabic (العربية)** with native RTL layout.
- **High Performance & Memory Efficient**: $O(1)$ hover cleanup and zero detached DOM memory leaks.
- **Zero AI Slop**: Minimalist design system with sharp inline SVG vector icons and no dependencies.

---

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/AboALhasanx/rtl-direction-extension.git
   ```
2. Open your Chromium browser (Chrome, Edge, Brave, Arc, etc.) and navigate to:
   - `chrome://extensions/` or `edge://extensions/`
3. Enable **Developer mode** (toggle in top-right corner).
4. Click **Load unpacked** and select the extension folder.

---

## Usage & Shortcuts

- **Inspect Elements**: Open the extension popup and click **Inspect Element** (or press the hero button). Click any element on the page to toggle its direction.
- **Exit Inspector**: Press <kbd>Esc</kbd> or click **Done** in the top HUD banner.
- **Reset All**: Click **Reset All** in the popup to clear all applied RTL overrides without reloading the page.

---

## License

[MIT](LICENSE)
