/**
 * Safe math expression parser.
 * Supports: +, -, *, /, %, parentheses, decimals.
 * No eval / new Function — uses recursive-descent parsing.
 */

// ── Tokenizer ──────────────────────────────────────────────

function tokenize(expr) {
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < expr.length && /[0-9]/.test(expr[i + 1]))) {
      let num = '';
      while (i < expr.length && (/[0-9]/.test(expr[i]) || expr[i] === '.')) {
        num += expr[i++];
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    if ('+-*/%'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'rparen' }); i++; continue; }

    throw new Error('Carácter inválido: ' + ch);
  }

  return tokens;
}

// ── Recursive-descent parser ───────────────────────────────

function parse(tokens) {
  let pos = 0;

  function peek() { return tokens[pos]; }
  function consume() { return tokens[pos++]; }

  // expression = term (('+' | '-') term)*
  function expression() {
    let left = term();
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  // term = unary (('*' | '/') unary)*
  function term() {
    let left = unary();
    while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
      const op = consume().value;
      const right = unary();
      if (op === '/') {
        if (right === 0) throw new Error('División por cero');
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  // unary = ('+' | '-')? postfix
  function unary() {
    if (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const val = postfix();
      return op === '-' ? -val : val;
    }
    return postfix();
  }

  // postfix = factor ('%')*   — each '%' divides by 100
  function postfix() {
    let val = factor();
    while (peek() && peek().type === 'op' && peek().value === '%') {
      consume();
      val = val / 100;
    }
    return val;
  }

  // factor = NUMBER | '(' expression ')'
  function factor() {
    const t = peek();
    if (!t) throw new Error('Expresión incompleta');

    if (t.type === 'number') {
      consume();
      return t.value;
    }

    if (t.type === 'lparen') {
      consume(); // '('
      const val = expression();
      if (!peek() || peek().type !== 'rparen') throw new Error('Falta paréntesis de cierre');
      consume(); // ')'
      return val;
    }

    throw new Error('Token inesperado');
  }

  const result = expression();
  if (pos < tokens.length) throw new Error('Entrada inesperada después de la expresión');
  return result;
}

// ── Public API ─────────────────────────────────────────────

/**
 * Evaluate a math expression string safely.
 * Returns the numeric result or throws on error.
 */
export function evaluate(expr) {
  const sanitized = expr.trim();
  if (sanitized === '') throw new Error('Expresión vacía');

  // Whitelist check — only digits, operators, dots, parens, spaces
  if (!/^[0-9+\-*/.%() ]+$/.test(sanitized)) {
    throw new Error('Caracteres no permitidos');
  }

  const tokens = tokenize(sanitized);
  return parse(tokens);
}

/**
 * Validate whether appending `char` to current `expression` is allowed.
 * Prevents consecutive operators and multiple decimals in the same number.
 */
export function canAppend(expression, char) {
  const operators = ['+', '-', '*', '/', '%'];
  const lastChar = expression.slice(-1);

  // Prevent consecutive operators (allow minus after operator for negative)
  if (operators.includes(char) && char !== '-' && operators.includes(lastChar)) {
    return false;
  }
  if (char === '-' && lastChar === '-') {
    return false;
  }

  // Prevent multiple decimals in the same number segment
  if (char === '.') {
    // Get the current number segment (everything after the last operator)
    const segments = expression.split(/[+\-*/%]/);
    const currentSegment = segments[segments.length - 1] || '';
    if (currentSegment.includes('.')) {
      return false;
    }
  }

  return true;
}
