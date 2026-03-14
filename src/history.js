const STORAGE_KEY = 'calculatorHistory';
const MAX_ITEMS = 20;

let history = [];
let listEl = null;
let onItemClick = null;

export function initHistory(listElement, itemClickCallback) {
  listEl = listElement;
  onItemClick = itemClickCallback;
  load();
}

export function addEntry(entry) {
  history.unshift(entry);
  if (history.length > MAX_ITEMS) {
    history = history.slice(0, MAX_ITEMS);
  }
  save();
  render();
}

export function clearHistory() {
  history = [];
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      history = JSON.parse(stored).slice(0, MAX_ITEMS);
    }
  } catch {
    history = [];
  }
  render();
}

function render() {
  if (!listEl) return;
  listEl.innerHTML = '';

  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.classList.add('history-item');
    // Slide-in animation via staggered delay
    li.style.animationDelay = `${index * 40}ms`;

    li.addEventListener('click', () => {
      const expression = item.split(' = ')[0];
      if (onItemClick) onItemClick(expression);
    });

    listEl.appendChild(li);
  });
}
