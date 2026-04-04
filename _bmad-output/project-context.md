---
project_name: 'App - Fono'
user_name: 'Thiago'
date: '2026-04-04T18:19:00Z'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 22
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Core**: React ^19.2.0 (Vite ^7.2.4)
- **Mobile**: Capacitor ^8.0.0 (Android target)
- **UI/UX**: Lucide-React ^0.561.0, @dnd-kit/sortable ^10.0.0
- **Audio/Synth**: @capacitor-community/text-to-speech ^6.1.0
- **Styling**: Strict **Vanilla CSS** (No Tailwind)
- **Environment**: ES Modules (`"type": "module"`)

## Critical Implementation Rules

### Language-Specific Rules (JavaScript/JSX)
- **Async/Await**: Mandatory for all TTS and asynchronous operations.
- **I18n Standard**: All symbol labels/text **MUST** support 7 languages: `pt`, `en`, `es`, `de`, `fr`, `zh`, `ja`.
- **Arrow Functions**: Use for all component and hook definitions.
- **Comment Policy**: Use **Brazil Portuguese** for all code comments and documentation.

### Framework-Specific Rules (React)
- **MVC Architecture**: 
    - `src/controllers`: Business logic and state (Hooks).
    - `src/views`: Page layouts.
    - `src/components`: UI components.
    - `src/models`: Static data structures.
- **Meta-tags**: Every view must use `Helmet` for SEO and accessibility.
- **Theming**: Use the established `theme` object pattern for color consistency.

### Testing Rules
- **Tools**: Adoption of **Vitest** for Unit tests and **Playwright** for E2E.
- **Priorities**: Focus on **Model Integrity** (I18n keys) and **Controller Logic** (State persistence).
- **Acessibility**: Verify high contrast and TTS volume/rate defaults.

### Code Quality & Style Rules
- **Naming**: PascalCase for `.jsx` (Components), camelCase for `.js` (Hooks/Logic).
- **Linter**: Follow `eslint.config.js`. Variables starting with UpperCase (Components) or Underscore are ignored by `no-unused-vars`.
- **Organization**: Keep logic out of the JSX where possible (use hooks).

### Development Workflow Rules
- **Web Deploy**: Automatic to **Render** via `main` branch.
- **Mobile Build**: Manual sync with `npx cap sync android`.
- **Commits**: Use **Conventional Commits** in Portuguese (ex: `feat(ia): ...`).

### Critical Don't-Miss Rules
- **No Duplication**: Avoid redundant state declarations (check `useAppController.js` for examples).
- **Hardware Limitation**: Do **NOT** attempt to write scripts to test native audio/mic — this must be manual or mocked via Capacitor plugins.
- **Safety**: Never hardcode API keys. Use environment variables defined in the system.
- **Performance**: Minimize re-renders in the symbol grid to ensure smooth mobile interaction.

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**
- Keep this file lean and focused on agent needs.
- Update when technology stack changes.
- Review quarterly for outdated rules.

Last Updated: 2026-04-04T18:19:00Z
