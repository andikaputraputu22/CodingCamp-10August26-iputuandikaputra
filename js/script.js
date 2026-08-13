/* =============================================
   Life Dashboard — script.js
   Vanilla JS | No frameworks | localStorage
   ============================================= */

'use strict';

// ─────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────
const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  },
};

// ─────────────────────────────────────────────
// 1. GREETING & CLOCK
// ─────────────────────────────────────────────
const NAME_KEY      = 'dashboard_user_name';

const clockEl            = document.getElementById('clock');
const greetingEl         = document.getElementById('greeting');
const dateDisplayEl      = document.getElementById('date-display');
const greetingEditBtn    = document.getElementById('greeting-edit-btn');
const greetingNameEditor = document.getElementById('greeting-name-editor');
const greetingNameInput  = document.getElementById('greeting-name-input');
const greetingNameSave   = document.getElementById('greeting-name-save');
const greetingNameCancel = document.getElementById('greeting-name-cancel');

let userName = Storage.get(NAME_KEY, '');

function getGreetingPhrase(hour) {
  if (hour >= 5  && hour < 12) return '🌅 Good morning';
  if (hour >= 12 && hour < 17) return '☀️ Good afternoon';
  if (hour >= 17 && hour < 21) return '🌆 Good evening';
  return '🌙 Good night';
}

function buildGreeting(hour) {
  const phrase = getGreetingPhrase(hour);
  return userName ? `${phrase}, ${userName}!` : `${phrase}!`;
}

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');

  clockEl.textContent    = `${h}:${m}:${s}`;
  greetingEl.textContent = buildGreeting(now.getHours());

  dateDisplayEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

// --- Name editor ---
function openNameEditor() {
  greetingNameInput.value = userName;
  greetingNameEditor.classList.remove('hidden');
  greetingEditBtn.classList.add('hidden');
  greetingNameInput.focus();
  greetingNameInput.select();
}

function closeNameEditor() {
  greetingNameEditor.classList.add('hidden');
  greetingEditBtn.classList.remove('hidden');
}

function saveUserName() {
  const trimmed = greetingNameInput.value.trim();
  userName = trimmed;
  Storage.set(NAME_KEY, userName);
  updateClock();          // refresh greeting text immediately
  closeNameEditor();
}

greetingEditBtn.addEventListener('click', openNameEditor);
greetingNameSave.addEventListener('click', saveUserName);
greetingNameCancel.addEventListener('click', closeNameEditor);
greetingNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter')  saveUserName();
  if (e.key === 'Escape') closeNameEditor();
});

updateClock();
setInterval(updateClock, 1000);


// ─────────────────────────────────────────────
// 2. FOCUS TIMER
// ─────────────────────────────────────────────
const DEFAULT_TIMER_MINUTES = 25;

const timerDisplay      = document.getElementById('timer-display');
const timerStatus       = document.getElementById('timer-status');
const timerMinutesInput = document.getElementById('timer-minutes-input');
const timerSetBtn       = document.getElementById('timer-set-btn');
const btnStart          = document.getElementById('timer-start');
const btnStop           = document.getElementById('timer-stop');
const btnReset          = document.getElementById('timer-reset');

// Load last-used duration from storage (fallback 25 min)
let timerSetMinutes = Storage.get('dashboard_timer_minutes', DEFAULT_TIMER_MINUTES);
let timerTotalSec   = timerSetMinutes * 60;
let timerRemaining  = timerTotalSec;
let timerInterval   = null;
let timerRunning    = false;

// Sync input to stored value on load
timerMinutesInput.value = timerSetMinutes;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerRemaining);
}

function setTimerState(state) {
  // state: 'idle' | 'running' | 'paused' | 'finished'
  timerDisplay.classList.remove('running', 'finished');
  if (state === 'running')  timerDisplay.classList.add('running');
  if (state === 'finished') timerDisplay.classList.add('finished');

  // Disable duration input while running
  const canEdit = state === 'idle' || state === 'finished';
  timerMinutesInput.disabled = !canEdit;
  timerSetBtn.disabled       = !canEdit;
  timerMinutesInput.style.opacity = canEdit ? '1' : '0.4';
  timerSetBtn.style.opacity       = canEdit ? '1' : '0.4';

  const statusMap = {
    idle:     'Ready to focus',
    running:  '🔥 Focusing…',
    paused:   '⏸ Paused',
    finished: '🎉 Session complete! Great work!',
  };
  timerStatus.textContent = statusMap[state] || '';
}

/** Parse and apply the minutes input as the new timer duration */
function applyCustomDuration() {
  const raw = parseInt(timerMinutesInput.value, 10);
  if (isNaN(raw) || raw < 1) {
    flashInvalid(timerMinutesInput);
    timerMinutesInput.value = timerSetMinutes;
    return;
  }
  const clamped = Math.min(Math.max(raw, 1), 120);
  timerSetMinutes = clamped;
  timerTotalSec   = clamped * 60;
  timerRemaining  = timerTotalSec;
  timerMinutesInput.value = clamped;
  Storage.set('dashboard_timer_minutes', timerSetMinutes);
  renderTimer();
  setTimerState('idle');
}

function startTimer() {
  if (timerRunning || timerRemaining <= 0) return;
  timerRunning = true;
  setTimerState('running');

  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();

    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      setTimerState('finished');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus session complete! 🎉', {
          body: `${timerSetMinutes}-minute session done. Take a break!`,
        });
      }
    }
  }, 1000);
}

function pauseTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerState('paused');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning   = false;
  timerRemaining = timerTotalSec;
  renderTimer();
  setTimerState('idle');
}

timerSetBtn.addEventListener('click', applyCustomDuration);
timerMinutesInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') applyCustomDuration();
});

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', pauseTimer);
btnReset.addEventListener('click', resetTimer);

// Request notification permission on first start
btnStart.addEventListener('click', () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, { once: true });

renderTimer();
setTimerState('idle');


// ─────────────────────────────────────────────
// 3. TO-DO LIST
// ─────────────────────────────────────────────
const TASKS_KEY = 'dashboard_tasks';

const taskInput      = document.getElementById('task-input');
const taskAddBtn     = document.getElementById('task-add-btn');
const taskList       = document.getElementById('task-list');
const taskEmpty      = document.getElementById('task-empty');
const taskTotal      = document.getElementById('task-total');
const taskDoneCount  = document.getElementById('task-done-count');
const taskRemaining  = document.getElementById('task-remaining');

const editModal      = document.getElementById('edit-modal');
const editTaskInput  = document.getElementById('edit-task-input');
const editSaveBtn    = document.getElementById('edit-save-btn');
const editCancelBtn  = document.getElementById('edit-cancel-btn');

let tasks         = Storage.get(TASKS_KEY, []);
let editingTaskId = null;

// --- Utilities ---
function generateId() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function saveTasks() {
  Storage.set(TASKS_KEY, tasks);
}

// --- Render ---
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskEmpty.classList.remove('hidden');
  } else {
    taskEmpty.classList.add('hidden');
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item fade-in${task.done ? ' done' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-checkbox${task.done ? ' checked' : ''}" data-action="toggle" data-id="${task.id}" title="Mark as ${task.done ? 'undone' : 'done'}"></div>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="task-btn" data-action="edit" data-id="${task.id}" title="Edit">✏️</button>
        <button class="task-btn delete" data-action="delete" data-id="${task.id}" title="Delete">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskStats();
}

const progressBarFill = document.getElementById('progress-bar-fill');

function updateTaskStats() {
  const total     = tasks.length;
  const done      = tasks.filter(t => t.done).length;
  const remaining = total - done;

  taskTotal.textContent     = `${total} task${total !== 1 ? 's' : ''}`;
  taskDoneCount.textContent = `${done} done`;
  taskRemaining.textContent = `${remaining} remaining`;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  progressBarFill.style.width = `${pct}%`;
}

// --- Actions ---
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.unshift({ id: generateId(), text: trimmed, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingTaskId       = id;
  editTaskInput.value = task.text;
  editModal.classList.remove('hidden');
  editTaskInput.focus();
  editTaskInput.select();
}

function saveEditTask() {
  const trimmed = editTaskInput.value.trim();
  if (!trimmed) return;
  const task = tasks.find(t => t.id === editingTaskId);
  if (task) {
    task.text = trimmed;
    saveTasks();
    renderTasks();
  }
  closeEditModal();
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingTaskId = null;
}

// --- Event Delegation ---
taskList.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  const id     = e.target.closest('[data-action]')?.dataset.id;
  if (!action || !id) return;

  if (action === 'toggle') toggleTask(id);
  if (action === 'edit')   openEditModal(id);
  if (action === 'delete') deleteTask(id);
});

taskAddBtn.addEventListener('click', () => {
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
    taskInput.value = '';
  }
});

editSaveBtn.addEventListener('click', saveEditTask);
editCancelBtn.addEventListener('click', closeEditModal);
editTaskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveEditTask();
  if (e.key === 'Escape') closeEditModal();
});

editModal.addEventListener('click', e => {
  if (e.target === editModal) closeEditModal();
});

// Initial render
renderTasks();


// ─────────────────────────────────────────────
// 4. QUICK LINKS
// ─────────────────────────────────────────────
const LINKS_KEY = 'dashboard_links';

const linkNameInput     = document.getElementById('link-name-input');
const linkUrlInput      = document.getElementById('link-url-input');
const linkAddBtn        = document.getElementById('link-add-btn');
const linksGrid         = document.getElementById('links-grid');
const linksEmpty        = document.getElementById('links-empty');

const editLinkModal      = document.getElementById('edit-link-modal');
const editLinkNameInput  = document.getElementById('edit-link-name-input');
const editLinkUrlInput   = document.getElementById('edit-link-url-input');
const editLinkSaveBtn    = document.getElementById('edit-link-save-btn');
const editLinkCancelBtn  = document.getElementById('edit-link-cancel-btn');

// Seed default links if first time
const DEFAULT_LINKS = [
  { id: generateLinkId(), name: 'Google',   url: 'https://google.com' },
  { id: generateLinkId(), name: 'YouTube',  url: 'https://youtube.com' },
  { id: generateLinkId(), name: 'GitHub',   url: 'https://github.com' },
];

let links         = Storage.get(LINKS_KEY, DEFAULT_LINKS);
let editingLinkId = null;

function generateLinkId() {
  return `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function saveLinks() {
  Storage.set(LINKS_KEY, links);
}

function getFaviconUrl(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch {
    return null;
  }
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function renderLinks() {
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksEmpty.classList.remove('hidden');
    return;
  }

  linksEmpty.classList.add('hidden');

  links.forEach(link => {
    const chip = document.createElement('div');
    chip.className = 'link-chip fade-in';
    chip.dataset.id = link.id;

    const favicon = getFaviconUrl(link.url);
    const imgTag  = favicon
      ? `<img src="${favicon}" alt="" class="link-favicon" onerror="this.style.display='none'">`
      : '';

    chip.innerHTML = `
      <a href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer" class="link-anchor" title="${escapeAttr(link.url)}">
        ${imgTag}
        <span>${escapeHtml(link.name)}</span>
      </a>
      <div class="link-controls">
        <button class="task-btn" data-action="edit-link" data-id="${link.id}" title="Edit">✏️</button>
        <button class="task-btn delete" data-action="delete-link" data-id="${link.id}" title="Delete">🗑️</button>
      </div>
    `;

    linksGrid.appendChild(chip);
  });
}

function addLink(name, url) {
  const trimmedName = name.trim();
  const normalUrl   = normalizeUrl(url);

  if (!trimmedName || !normalUrl) {
    flashInvalid(trimmedName ? linkUrlInput : linkNameInput);
    return false;
  }

  links.push({ id: generateLinkId(), name: trimmedName, url: normalUrl });
  saveLinks();
  renderLinks();
  return true;
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}

function openEditLinkModal(id) {
  const link = links.find(l => l.id === id);
  if (!link) return;
  editingLinkId            = id;
  editLinkNameInput.value  = link.name;
  editLinkUrlInput.value   = link.url;
  editLinkModal.classList.remove('hidden');
  editLinkNameInput.focus();
}

function saveEditLink() {
  const name     = editLinkNameInput.value.trim();
  const url      = normalizeUrl(editLinkUrlInput.value);
  if (!name || !url) return;

  const link = links.find(l => l.id === editingLinkId);
  if (link) {
    link.name = name;
    link.url  = url;
    saveLinks();
    renderLinks();
  }
  closeEditLinkModal();
}

function closeEditLinkModal() {
  editLinkModal.classList.add('hidden');
  editingLinkId = null;
}

// --- Event Delegation ---
linksGrid.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  const id     = e.target.closest('[data-action]')?.dataset.id;
  if (!action || !id) return;

  if (action === 'edit-link')   openEditLinkModal(id);
  if (action === 'delete-link') deleteLink(id);
});

linkAddBtn.addEventListener('click', () => {
  const ok = addLink(linkNameInput.value, linkUrlInput.value);
  if (ok) {
    linkNameInput.value = '';
    linkUrlInput.value  = '';
    linkNameInput.focus();
  }
});

linkUrlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') linkAddBtn.click();
});

editLinkSaveBtn.addEventListener('click', saveEditLink);
editLinkCancelBtn.addEventListener('click', closeEditLinkModal);

editLinkModal.addEventListener('click', e => {
  if (e.target === editLinkModal) closeEditLinkModal();
});

editLinkUrlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter')  saveEditLink();
  if (e.key === 'Escape') closeEditLinkModal();
});

// Initial render
renderLinks();


// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/** Escape text for safe innerHTML insertion */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/** Escape text for safe HTML attribute insertion */
function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Brief red-border flash on invalid input */
function flashInvalid(el) {
  el.style.borderColor = '#f87171';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; }, 1200);
}
