# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Build all targets: `npm run build`
- Development watch mode: `npm run dev` or `npm run dev:chrome`
- Test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`
- Fix all: `npm run check:fix`

## Code Style
- Format: 2 space indentation, 100 char line width
- Quotes: Single quotes with semicolons
- Imports: Organize imports automatically (`biome` handles this)
- Types: Warn on explicit `any` usage, avoid non-null assertions
- Error handling: Log errors with proper error objects
- Browser compatibility: Support last 2 versions of major browsers
- Security: No dangerous innerHTML, validate user inputs
- Constants: Use `const` over `let` when possible
- Template strings: Prefer template literals for string interpolation
- Multilingual: Support for French (default) and English locales