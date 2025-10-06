# RCM React/Next.js Migration

This repository has been updated to use React/Next.js with TypeScript and Tailwind CSS.

## Structure

- `/components/` - React components (Hero, About, Projects, ATLExcerpt, Footer)
- `/pages/` - Next.js pages
- `/styles/` - Global CSS with Tailwind
- `/src/` - Alternative App.tsx for other React frameworks

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Components

All components use Tailwind CSS with the neutral color palette for consistency:
- `neutral-50` to `neutral-900` for text and backgrounds
- Consistent spacing with Tailwind spacing tokens
- No custom pixel values

## Legacy Files

The original HTML/CSS files are preserved for reference:
- `index.html` - Original static site
- `styles.css` - Original styles