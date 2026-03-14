/**
 * Keyboard event handler module.
 * Maps physical keys to calculator actions.
 */

export function initKeyboard({ onDigit, onOperator, onEquals, onDelete, onClear }) {
  document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'Enter') {
      event.preventDefault();
      onEquals();
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      onDelete();
      return;
    }

    if (key === 'Escape') {
      onClear();
      return;
    }

    if (/^[0-9]$/.test(key)) {
      onDigit(key);
      return;
    }

    if (['+', '-', '*', '/', '.', '%'].includes(key)) {
      onOperator(key);
    }
  });
}
