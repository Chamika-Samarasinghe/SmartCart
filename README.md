# SmartCart

A modern shopping cart application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

- Browse a product catalog
- Add/remove items from the cart
- Real-time cart total calculation
- Responsive, mobile-first design

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router, Server Components
- [TypeScript](https://www.typescriptlang.org/) — type safety throughout
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (shop)/
    products/     # Product listing and detail pages
  cart/           # Cart page
  layout.tsx      # Root layout
  page.tsx        # Homepage
components/
  cart/           # Cart-related components
  product/        # Product card, grid, etc.
  ui/             # Shared UI primitives
hooks/            # Custom React hooks (e.g. useCart)
lib/              # Utilities and helpers
types/            # Shared TypeScript types
```

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
