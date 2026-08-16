# OŠ Prežihovega Voranca Maribor

Responsive Astro redesign of the [OŠ Prežihovega Voranca Maribor](https://www.o-pvoranca.mb.edus.si/) homepage.

## Features

- mobile-friendly navigation and layouts
- searchable directory of school links
- current announcements and school news
- quick access to schedules, menus, assessments, and online classrooms
- prefilled same-day school meal cancellation email
- accessible keyboard navigation and reduced-motion support

## Development

```sh
npm install
npm run dev
```

Create a production build with:

```sh
npm run build
npm run validate:build
```

## Content sync

The source navigation and school-owned pages are imported into local Astro routes. Refresh the cached content with:

```sh
npm run sync:content
```

The importer sanitizes remote HTML, rewrites known school destinations to local routes, upgrades school assets to HTTPS, and keeps documents or third-party services behind local gateway pages.
