import { describe, it, expect } from 'vitest';
import { evaluate, canAppend } from '../src/calculator.js';

describe('evaluate', () => {
  // ── Basic operations ──────────────────────────────────────
  describe('basic operations', () => {
    it('adds two numbers', () => {
      expect(evaluate('2+3')).toBe(5);
    });

    it('subtracts two numbers', () => {
      expect(evaluate('10-4')).toBe(6);
    });

    it('multiplies two numbers', () => {
      expect(evaluate('3*7')).toBe(21);
    });

    it('divides two numbers', () => {
      expect(evaluate('20/4')).toBe(5);
    });

    it('handles spaces in expression', () => {
      expect(evaluate(' 2 + 3 ')).toBe(5);
    });
  });

  // ── Division by zero ──────────────────────────────────────
  describe('division by zero', () => {
    it('throws on division by zero', () => {
      expect(() => evaluate('5/0')).toThrow('División por cero');
    });

    it('throws on complex expression with division by zero', () => {
      expect(() => evaluate('10+5/0')).toThrow('División por cero');
    });
  });

  // ── Chained operations ────────────────────────────────────
  describe('chained operations', () => {
    it('respects operator precedence (* before +)', () => {
      expect(evaluate('2+3*4')).toBe(14);
    });

    it('respects operator precedence (/ before -)', () => {
      expect(evaluate('10-6/2')).toBe(7);
    });

    it('handles multiple additions', () => {
      expect(evaluate('1+2+3+4')).toBe(10);
    });

    it('handles mixed operations', () => {
      expect(evaluate('2*3+4/2-1')).toBe(7);
    });

    it('handles parentheses', () => {
      expect(evaluate('(2+3)*4')).toBe(20);
    });
  });

  // ── Decimal inputs ────────────────────────────────────────
  describe('decimal inputs', () => {
    it('adds decimals correctly', () => {
      expect(evaluate('1.5+2.3')).toBeCloseTo(3.8);
    });

    it('multiplies decimals', () => {
      expect(evaluate('0.1*0.2')).toBeCloseTo(0.02);
    });

    it('handles leading decimal point', () => {
      expect(evaluate('.5+.5')).toBe(1);
    });
  });

  // ── Empty input ───────────────────────────────────────────
  describe('empty input', () => {
    it('throws on empty string', () => {
      expect(() => evaluate('')).toThrow('Expresión vacía');
    });

    it('throws on whitespace only', () => {
      expect(() => evaluate('   ')).toThrow('Expresión vacía');
    });
  });

  // ── Invalid characters ────────────────────────────────────
  describe('invalid characters', () => {
    it('rejects alphabetic characters', () => {
      expect(() => evaluate('2+abc')).toThrow('Caracteres no permitidos');
    });

    it('rejects special characters', () => {
      expect(() => evaluate('2$3')).toThrow('Caracteres no permitidos');
    });

    it('rejects semicolons (code injection attempt)', () => {
      expect(() => evaluate('1;alert(1)')).toThrow('Caracteres no permitidos');
    });
  });

  // ── Percentage ────────────────────────────────────────────
  describe('percentage', () => {
    it('evaluates percentage as /100', () => {
      expect(evaluate('50%')).toBeCloseTo(0.5);
    });

    it('evaluates percentage in expression', () => {
      expect(evaluate('200*50%')).toBeCloseTo(100);
    });
  });

  // ── Unary minus ───────────────────────────────────────────
  describe('unary minus', () => {
    it('handles negative number at start', () => {
      expect(evaluate('-5+3')).toBe(-2);
    });

    it('handles negative in parentheses', () => {
      expect(evaluate('(-3)*2')).toBe(-6);
    });
  });
});

describe('canAppend', () => {
  it('prevents consecutive operators', () => {
    expect(canAppend('5+', '+')).toBe(false);
    expect(canAppend('5+', '*')).toBe(false);
  });

  it('allows minus after operator (for negation)', () => {
    expect(canAppend('5+', '-')).toBe(true);
  });

  it('prevents double minus', () => {
    expect(canAppend('5-', '-')).toBe(false);
  });

  it('prevents multiple dots in same number', () => {
    expect(canAppend('1.2', '.')).toBe(false);
  });

  it('allows dot in new number segment', () => {
    expect(canAppend('1.2+', '.')).toBe(true);
  });

  it('allows first dot', () => {
    expect(canAppend('5', '.')).toBe(true);
  });

  it('allows digits after operator', () => {
    expect(canAppend('5+', '3')).toBe(true);
  });
});
