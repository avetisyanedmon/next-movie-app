# Movie App (Next.js + Tailwind)

A polished movie discovery app built with Next.js App Router, TypeScript, and Tailwind CSS. Browse popular and recommended movies, search in real time, and view rich details with cast info and IMDb linking.

## Quick Start

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

```bash
npm run dev
```

Open http://localhost:3000

## Features

- Home: avatar header, search with live results, horizontal carousels (snap scrolling)
- Details: full-width poster with overlay play button, back/share controls, runtime chip, tags (age/genres/rating), expandable overview, cast row, IMDb button
- Favorites: local persistence via Context + localStorage
- Responsive: mobile-first, smooth horizontal scroll

## Structure

```
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx                 # Home (carousels + search)
│  └─ movie/[id]/page.tsx      # Details (poster overlay, info, cast)
├─ components/
│  ├─ MovieCard.tsx
│  └─ SearchBar.tsx
├─ contexts/
│  └─ FavoritesContext.tsx
├─ lib/
│  └─ tmdb.ts
└─ types/
   └─ movie.ts
```

## Configuration

- `next.config.ts` allows TMDb images with:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
  ];
}
```

- TMDb helpers in `src/lib/tmdb.ts`.

## Troubleshooting

- Alias imports error: use relative paths or ensure `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }` and restart dev server.
- Images not loading: verify `image.tmdb.org` remote pattern with `pathname: "/t/p/**"`.
- TMDb API errors: check `NEXT_PUBLIC_TMDB_API_KEY`.

MIT
