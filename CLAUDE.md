# DansMaZone Browser Extension

## Build Commands
- Build: `npm run build` (all browsers) or `npm run build:chrome|firefox|edge`
- Development: `npm run dev` (Chrome) or `npm run dev:chrome|firefox|edge`
- Linting: `npm run lint` (check) or `npm run lint:fix` (auto-fix)
- Formatting: `npm run format` (check) or `npm run format:fix` (auto-fix)

## Code Style
- Linter: Biome (configured in biome.json)
- Indentation: 2 spaces
- Line length: 100 chars max
- Strings: Single quotes, template literals for interpolation
- Semicolons: Required
- Variables: Prefer `const` over `let/var`
- Imports: External libs first, internal modules second, styles last
- Naming: camelCase (variables, functions), PascalCase (classes)
- Error handling: Try/catch with centralized `handleError` function
- Internationalization: Use browser.i18n API for all user-facing text

## Project Structure
Browser extension that suggests local Canadian alternatives to Amazon products by detecting categories and offering relevant local retailers.