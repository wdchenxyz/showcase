# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Architecture

This is a Next.js 16 application using the App Router with React 19 and Tailwind CSS v4.

### Key Structure
- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Reusable UI components (shadcn style with radix-mira theme)
- `lib/utils.ts` - Utility functions including `cn()` for class merging

### UI Component System
Components use shadcn/ui patterns with:
- **Styling**: `class-variance-authority` (cva) for variant management
- **Class merging**: `cn()` helper combining `clsx` + `tailwind-merge`
- **Primitives**: Radix UI primitives via `radix-ui` package
- **Icons**: Hugeicons (`@hugeicons/react`)

### Tailwind CSS v4 Setup
- CSS imports in `app/globals.css`: `@import "tailwindcss"`, `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`
- Theme uses oklch color format with CSS variables
- Dark mode via `.dark` class selector

### Path Aliases
- `@/*` maps to project root (e.g., `@/components`, `@/lib`)
