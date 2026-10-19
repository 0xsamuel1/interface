# Contributing to SO4 Market

Thank you for your interest in contributing to SO4 Market! This guide will help you get started.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- [Node.js](https://nodejs.org) >= 20
- [Stellar CLI](https://github.com/stellar/stellar-cli) 22.x (for contract binding generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/SO4-Markets/interface.git
cd interface

# Install dependencies
bun install

# Install git hooks (macOS and Linux)
bunx lefthook install

# On Windows, use:
# bunx lefthook install --skip-ci
```

## Pre-commit Hooks

This project uses [Lefthook](https://github.com/evilmartians/lefthook) to enforce code quality on staged files. Hooks run automatically before each commit on macOS and Linux.

### What hooks run

- **Lint**: ESLint checks staged files and auto-fixes violations when possible
- **Format**: Prettier formats code to the project style

### Running hooks manually

```bash
# Run all hooks
bunx lefthook run pre-commit

# Run a specific hook
bunx lefthook run lint
```

### Skipping hooks

If you need to skip hooks temporarily:

```bash
git commit --no-verify
```

## Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feat/my-feature
git checkout -b fix/my-fix
git checkout -b chore/update-deps
```

### 2. Make your changes

- Follow the project structure in the [README](./README.md#project-structure)
- One component or feature per file
- Use Tailwind utility classes for styling
- Keep components focused on a single responsibility

### 3. Format and lint before commit

```bash
# Format all changed files
bun format

# Lint and auto-fix
bun lint --fix

# Type check
bun typecheck
```

Alternatively, the pre-commit hooks will run these automatically on staged files.

### 4. Commit with a clear message

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add limit order confirmation dialog
fix: resolve chart flicker on theme toggle
chore: upgrade lightweight-charts to v5.3
docs: document contract integration stubs
refactor: extract oracle normalisation into shared util
```

### 5. Push and open a pull request

```bash
git push origin feat/my-feature
```

Open a PR against `main` with:
- A clear title and description
- Screenshots or recordings for UI changes
- Any assumptions about contract integration

## Code Style

### TypeScript / React

- Use TypeScript for all new code (no `any` types)
- Use functional components and React hooks
- Prop types should be explicit interfaces or types
- Keep components under 300 lines where possible
- One component per file

### Styling

- Use Tailwind utility classes
- Avoid inline styles
- Use CSS custom properties from `packages/ui/src/styles/globals.css` for design tokens
- Test both light and dark themes

### Comments

- Only add comments for non-obvious intent
- Avoid restating what the code already says
- Link to issues or discussions when relevant

### Imports

- Use absolute workspace imports where available: `@workspace/ui/...`
- Avoid deep relative paths (`../../components/Button`)
- Group imports: React -> workspace packages -> relative imports -> styles

## Testing

The project uses TypeScript type checking via `bun typecheck`. No unit test suite is currently configured. Test your changes manually in the dev server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- All pages load without errors
- Wallet connect flows work
- Orders and trades execute (mocked)
- Theme switching works and persists
- No console errors or warnings

## Common Commands

```bash
# Start development server
bun dev

# Build for production
bun build

# Run linter on all files
bun lint

# Auto-fix lint errors
bun lint --fix

# Format all files
bun format

# Type check all files
bun typecheck

# Generate contract bindings
bun contracts:gen:all

# View and manage git hooks
bunx lefthook list
bunx lefthook uninstall
```

## Reporting Issues

Open a GitHub issue with:
- A clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Browser, OS, and Bun version if relevant

## Contract Integration

Most contract calls are currently stubs in `lib/stellar.ts`, `lib/earn.ts`, and `lib/referrals.ts`. Real Soroban SDK calls are documented with `TODO` comments. See the [README](./README.md#contract-integration) for contract details.

## Questions?

- Check existing issues and discussions
- Read the [README](./README.md) and code comments
- Look at similar components for patterns

Thank you for contributing to SO4 Market!
