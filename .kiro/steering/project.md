# Life Dashboard — Project Steering

## Project Overview
A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript.
No frameworks or build tools — just plain files served in a browser.

## Features
- **Greeting & Clock** — live clock with time-based greeting and date display
- **Focus Timer** — 25-minute Pomodoro-style countdown timer with browser notifications
- **To-Do List** — add, edit, delete, and complete tasks with progress bar; persisted via localStorage
- **Quick Links** — save, edit, and delete bookmarked URLs with favicons; persisted via localStorage

## Tech Stack
- HTML5 (semantic markup)
- Tailwind CSS (via CDN) + custom `css/style.css`
- Vanilla JavaScript (`js/script.js`) — no frameworks, no bundler
- `localStorage` for persistent data

## File Structure
```
index.html        ← main page and all markup
css/style.css     ← custom styles (complements Tailwind)
js/script.js      ← all JavaScript logic
```

## Coding Conventions
- JavaScript: `'use strict'`, no ES modules, no transpilation
- Use `escapeHtml()` and `escapeAttr()` for any dynamic DOM content to prevent XSS
- localStorage keys: `dashboard_tasks`, `dashboard_links`
- IDs for tasks use prefix `t_`, links use prefix `l_`
- CSS class naming: BEM-like `.card`, `.btn-primary`, `.task-item`, `.link-chip`
- Tailwind utility classes for layout; custom CSS for component-level styles
- No external JS libraries — keep it dependency-free

## Style Guidelines
- Dark theme: base color `#030712` (gray-950), cards use `rgba(17, 24, 39, 0.8)`
- Accent color: indigo (`#4f46e5` / `#818cf8`)
- Buttons: `.btn-primary` (indigo), `.btn-secondary` (gray), `.btn-ghost` (transparent)
- Inputs: `.input-field` class with focus ring
- Animations: `fade-in` class for newly inserted elements
