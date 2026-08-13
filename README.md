# Life Dashboard

A personal productivity dashboard that lives in your browser tab. It shows the current time, a focus timer, a to-do list, and quick-access links to your favorite websites — all stored locally with no backend required.

---

## Features

### Greeting & Clock
- Live clock updated every second
- Date display (day, month, year)
- Time-based greeting: Good morning / afternoon / evening / night
- Editable name — personalize the greeting with your own name, saved to Local Storage

### Focus Timer
- Configurable countdown timer (default: 25 minutes, adjustable 1–120 min)
- Start, Pause, and Reset controls
- Visual state feedback: idle, running, finished
- Browser notification when a session completes (with permission)

### To-Do List
- Add tasks via input or pressing Enter
- Edit tasks inline via a modal
- Mark tasks as done / undone with a checkbox
- Delete individual tasks
- Duplicate task detection
- Progress bar showing completion percentage
- Task stats: total, done, remaining
- Sortable: Default, A→Z, Z→A, Active first, Done first
- All tasks persisted in Local Storage

### Quick Links
- Add bookmarks with a label and URL
- Favicon auto-fetched for each link
- Edit or delete any link
- Links open in a new tab
- Seeded with common defaults (Google, YouTube, GitHub, LinkedIn, Instagram, Facebook)
- All links persisted in Local Storage

### UI / UX
- Dark and light theme toggle, preference saved to Local Storage
- Mobile-first responsive layout (Tailwind CSS grid)
- Animated toast alert for duplicate/validation warnings
- Smooth fade-in animations on rendered items
- Custom styled scrollbar

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Structure  | HTML5                               |
| Styling    | Tailwind CSS (CDN) + custom CSS     |
| Logic      | Vanilla JavaScript (ES2020, strict) |
| Storage    | Browser Local Storage API           |
| Backend    | None                                |

---

## Project Structure

```
.
├── index.html        # Main HTML — layout and markup
├── css/
│   └── style.css     # Custom CSS variables, component styles, theme tokens
└── js/
    └── script.js     # All feature logic (clock, timer, tasks, links)
```

---

## Getting Started

No build step, no dependencies to install.

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

```bash
# Example using a simple local server (optional)
npx serve .
```

Or just double-click `index.html` — it works as a standalone file.

---

## Browser Compatibility

Tested and supported in:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Apple Safari (latest)

---

## Local Storage Keys

| Key                      | Description                        |
|--------------------------|------------------------------------|
| `dashboard_theme`        | Active color theme (`dark`/`light`)|
| `dashboard_user_name`    | Personalized greeting name         |
| `dashboard_timer_minutes`| Last-used timer duration           |
| `dashboard_tasks`        | To-do list array                   |
| `dashboard_tasks_sort`   | Active sort preference             |
| `dashboard_links`        | Quick links array                  |

All data stays on your device and is never sent anywhere.

---

## Author

**I Putu Andika Putra**  
CodingCamp — 10 August 2026
