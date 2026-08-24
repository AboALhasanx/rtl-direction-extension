---
name: anti-slop
description: Enforces clean, minimalist, professional developer-grade code and UI design. Eliminates AI slop, cheesy emojis, purple-to-blue gradient clichés, noisy boilerplate, and verbose fluff.
---

# Anti-Slop & Minimalist Design Standard

This skill establishes strict design, coding, and tone guidelines to prevent low-effort AI slop patterns and deliver clean, high-craft software.

## 1. UI & Visual Design Rules

- **Zero Emoji Slop**: Never use emojis (🎯, 🚀, 💡, 🧹, 🔄, ⚡) as UI icons or button prefixes. Use clean, accessible, inline SVG vector icons (Lucide / Heroicons style).
- **No Cliché Gradients**: Avoid default AI purple-to-cyan/purple-to-blue gradient banners, heavy radial glows, and unnecessary "PRO" / "AI" badges.
- **Palette**: Use restrained, functional palettes (e.g. Zinc / Slate with single purposeful accent like `#38bdf8` or `#3b82f6`).
- **Typography & Density**: Clean monospace tags (`ui-monospace`), crisp labels, tight paddings, and developer-grade information density (like Vercel, Linear, GitHub).
- **Micro-copy**: Cut unnecessary filler words. Use concise, precise action verbs ("Inspect", "Reset", "Direction") instead of "Click here to start our awesome inspection".

## 2. Code & Architecture Rules

- **Direct & Idiomatic**: Write focused, readable code without unnecessary abstractions or deep nesting.
- **No Ghost Comments**: Do not write comments that restate the obvious (e.g. `// get element by id` or `// set text content`). Write comments only when explaining non-trivial logic.
- **Zero Runtime Dependencies**: Prefer web standards and native browser APIs over bloated external packages when possible.
- **Error Resilient**: Protect event loops and DOM queries against edge cases (SVGs, TextNodes, missing tabs).

## 3. Communication Style

- Deliver direct, crisp answers.
- Avoid hyperbole ("super awesome", "groundbreaking", "unleash the power of").
- Focus on practical diffs, concrete steps, and verifiable facts.
