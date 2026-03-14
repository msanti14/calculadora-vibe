# Vibe Calculator v2

Evolución de mi primera app web. Misma calculadora, reescrita con arquitectura modular, tooling profesional y tests unitarios.

## Qué cambió respecto a la v1

| | v1 | v2 |
|---|---|---|
| Estructura | 1 archivo JS | 5 módulos ES |
| Build tool | ninguno | Vite |
| Tests | ninguno | 31 tests (Vitest) |
| Eval | `new Function()` | parser recursivo seguro |
| Responsive | no | sí (mobile first) |
| Accesibilidad | básica | aria-labels, focus-visible |

## Features nuevas

- Botón `%` como operador postfijo
- Doble-click en el display copia el resultado al portapapeles
- Tooltips con atajos de teclado al hacer hover
- Historial limitado a 20 items con animación slide-in
- Panel de historial colapsable en mobile

## Stack

- Vite + JavaScript vanilla (ES modules)
- Vitest para tests unitarios
- Sin frameworks

## Comandos
```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run test     # 31 tests unitarios
```

## Demo

https://msanti14.github.io/vibe-calculator-v2/

---

> ¿Querés ver de dónde viene? La v1 original está en [vibe-calculator](https://github.com/msanti14/vibe-calculator).