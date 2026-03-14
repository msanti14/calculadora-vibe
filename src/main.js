import '../styles.css';
import { evaluate, canAppend } from './calculator.js';
import { initHistory, addEntry, clearHistory } from './history.js';
import { initTheme } from './theme.js';
import { initKeyboard } from './keyboard.js';

// ── DOM refs ───────────────────────────────────────────────

const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.getElementById('theme-toggle');
const historyToggleBtn = document.getElementById('history-toggle');
const historyPanel = document.querySelector('.history');

// ── Error display helper ───────────────────────────────────

let errorTimeout = null;

function showError() {
  display.value = 'Error';
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    display.value = '';
  }, 2000);
}

// ── Input helpers ──────────────────────────────────────────

function appendValue(value) {
  // Clear error state if user starts typing
  if (display.value === 'Error') display.value = '';
  if (!canAppend(display.value, value)) return;
  display.value += value;
}

function clearDisplay() {
  clearTimeout(errorTimeout);
  display.value = '';
}

function deleteLast() {
  if (display.value === 'Error') { display.value = ''; return; }
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const expression = display.value.trim();
    if (expression === '' || expression === 'Error') return;

    const result = evaluate(expression);

    // Round to avoid floating-point artifacts (max 10 decimals)
    const rounded = Math.round(result * 1e10) / 1e10;
    const operation = `${expression} = ${rounded}`;

    addEntry(operation);
    display.value = rounded;
  } catch {
    showError();
  }
}

// ── Copy to clipboard on double-click ──────────────────────

display.addEventListener('dblclick', () => {
  const text = display.value;
  if (text && text !== 'Error') {
    navigator.clipboard.writeText(text);
  }
});

// ── Calculator button events ───────────────────────────────

document.querySelectorAll('.buttons button').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) appendValue(value);
    if (action === 'clear') clearDisplay();
    if (action === 'delete') deleteLast();
    if (action === 'calculate') calculate();
  });
});

// ── Clear history ──────────────────────────────────────────

clearHistoryBtn.addEventListener('click', clearHistory);

// ── Mobile history toggle ──────────────────────────────────

historyToggleBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('history--open');
  const isOpen = historyPanel.classList.contains('history--open');
  historyToggleBtn.textContent = isOpen ? '✕' : '📜';
  historyToggleBtn.setAttribute('aria-expanded', String(isOpen));
});

// ── Init modules ───────────────────────────────────────────

initHistory(historyList, (expression) => {
  display.value = expression;
});

initTheme(themeToggle);

initKeyboard({
  onDigit: appendValue,
  onOperator: appendValue,
  onEquals: calculate,
  onDelete: deleteLast,
  onClear: clearDisplay,
});
