import rawSite from '../data/imported-pages.json';
import type { ImportedSite, NavigationItem } from '../types/site';

export const importedSite = rawSite as ImportedSite;
export const navigation = importedSite.navigation;
export const importedPages = importedSite.pages;

const routesBySource = new Map(
  importedPages.map((page) => [normalizeSource(page.sourceUrl), page.route]),
);

export function normalizeSource(value: string) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.href;
  } catch {
    return value;
  }
}

export function routeForSource(sourceUrl: string) {
  return routesBySource.get(normalizeSource(sourceUrl)) || sourceUrl;
}

export function flattenNavigation(items: NavigationItem[]): NavigationItem[] {
  return items.flatMap((item) => [item, ...flattenNavigation(item.children)]);
}
