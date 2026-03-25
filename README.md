# Product List Mini App (Senior Edition)

A high-performance, production-ready CRUD application built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Senior-Level Features

- **Advanced Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind 4, shadcn/ui.
- **Optimized Data Layer**: 
  - Custom `useLocalStorage` hook with cross-tab synchronization.
  - Memoized `useProducts` and `useCategories` hooks for peak performance.
  - Strict Zod schema validation with descriptive error messages.
- **Premium UI/UX**:
  - **shadcn/ui**: Button, Input, Table, Dialog, Select, Card, Badge, Label.
  - **Framer Motion**: Smooth page transitions and modal animations.
  - **Dark Mode**: Complete light/dark mode support with `next-themes`.
  - **Advanced Product Table**: Real-time search, category filtering, and multi-column sorting (useMemo optimized).
- **Responsive Architecture**: Fully responsive sidebar navigation with a mobile-friendly drawer.

## Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/`: Next.js App Router pages and global styles.
- `components/`:
  - `ui/`: shadcn/ui base components.
  - `layout/`: Theme provider, Sidebar, and Page transitions.
  - `features/`: Product and Category specific forms and tables.
- `hooks/`: Optimized data and state hooks.
- `lib/`: Shared Zod schemas and constants.
- `types/`: Comprehensive TypeScript interfaces.
- `utils/`: Formatting and logic helper functions.

## Deployment

### Vercel
1. Push to GitHub.
2. Link repository to [Vercel](https://vercel.com/).
3. Automatic deployment handles the build.

### Git Initialization
```bash
git init
git add .
git commit -m "feat: initial commit for senior product mini app"
```
# CRUD
