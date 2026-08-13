# Life Dashboard

## Project Overview
A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript.
No frameworks or build tools — just plain files served in a browser.

## Features
- **Theme Toggle** — dark/light mode switch (top-right button); theme persisted via localStorage; flash-of-unstyled-content prevented by an inline `<script>` in `<head>` that applies the stored theme before first paint
- **Greeting & Clock** — live clock with time-based greeting, date display, and an editable user name (pencil button reveals inline input; name persisted via localStorage)
- **Focus Timer** — countdown timer with configurable duration (1–120 min, default 25); supports start, pause, and reset; duration input is disabled while running; last-used duration persisted via localStorage; browser notification on session complete
- **To-Do List** — add, edit, delete, and complete tasks; duplicate task detection with custom alert; sortable (default, A→Z, Z→A, active-first, done-first); progress bar; stat pills showing total / done / remaining; all tasks persisted via localStorage
- **Quick Links** — bookmarked URLs displayed as icon chips in the header (below the date); favicons fetched via Google S2 API; add form toggled via "+ Add link" button; edit and delete per chip; default seed links (Google, YouTube, GitHub) on first load; persisted via localStorage

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
- localStorage keys: `dashboard_theme`, `dashboard_user_name`, `dashboard_tasks`, `dashboard_tasks_sort`, `dashboard_links`, `dashboard_timer_minutes`
- IDs for tasks use prefix `t_`, links use prefix `l_`
- CSS class naming: BEM-like `.card`, `.btn-primary`, `.task-item`, `.link-chip`, `.stat-pill`
- Tailwind utility classes for layout; custom CSS for component-level styles
- No external JS libraries — keep it dependency-free
- Theme variables defined via CSS custom properties on `:root` / `[data-theme="dark"]` and `[data-theme="light"]`; all themed values must use `var(--*)` tokens
- Custom alert (`showAlert(message, type, duration)`) used for user feedback instead of native `alert()`

## Style Guidelines
- Theming: CSS custom properties on `[data-theme]` — both dark and light sets defined in `style.css`
- Dark theme base: `#030712` (gray-950), cards `rgba(17, 24, 39, 0.85)`
- Light theme base: `#f1f5f9`, cards `rgba(255, 255, 255, 0.9)`
- Accent color: indigo (`#4f46e5` / `#818cf8`) — same in both themes
- Buttons: `.btn-primary` (indigo, fixed), `.btn-secondary` (themed gray), `.btn-ghost` (transparent, themed border)
- Inputs: `.input-field` class with focus ring; themed via CSS vars
- Animations: `fade-in` class for newly inserted elements; `modal-in` keyframe for modals
- Smooth theme transitions: `body` has `transition: background-color 0.3s ease, color 0.3s ease`
