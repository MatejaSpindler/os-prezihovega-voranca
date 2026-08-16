import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { load } from 'cheerio';
import importedSite from '../src/data/imported-pages.json' with { type: 'json' };

const DIST = resolve('dist');
const SCHOOL_HOSTS = [
  'www.o-pvoranca.mb.edus.si',
  'o-pvoranca.mb.edus.si',
  'ospvmb.splet.arnes.si',
  'knjiznicaospvmb.splet.arnes.si',
];
const MANUAL_ROUTES = ['/', '/odjava-prehrane/'];

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(path) : (path.endsWith('.html') ? [path] : []);
  }));
  return files.flat();
}

function targetPathFor(href) {
  const pathname = new URL(href, 'https://local.school').pathname;
  if (pathname.endsWith('.html')) return resolve(DIST, '.' + pathname);
  if (pathname.endsWith('/')) return resolve(DIST, '.' + pathname, 'index.html');
  return resolve(DIST, '.' + pathname, 'index.html');
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const htmlFiles = await collectHtml(DIST);
const failures = [];
let internalLinks = 0;
let navigationLinks = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  const pageName = relative(DIST, file);

  for (const anchor of $('a[href]').get()) {
    const element = $(anchor);
    const href = element.attr('href');
    if (!href || href.startsWith('#') || /^(mailto|tel):/i.test(href)) continue;

    const isNavigationLink = element.closest('.primary-navigation, .portal-navigation, .mobile-navigation-panel, #link-directory').length > 0;
    if (isNavigationLink) {
      navigationLinks++;
      if (/^https?:/i.test(href)) {
        const host = new URL(href).hostname;
        if (SCHOOL_HOSTS.includes(host)) {
          failures.push(pageName + ': shared navigation still targets old school URL ' + href);
        }
      }
    }

    if (href.startsWith('/')) {
      internalLinks++;
      const path = targetPathFor(href);
      if (!(await exists(path))) {
        failures.push(pageName + ': missing local route for ' + href);
      }
    }
  }
}

const expectedPages = importedSite.pages.length + MANUAL_ROUTES.length;
if (htmlFiles.length !== expectedPages) {
  failures.push('Expected ' + expectedPages + ' generated pages but found ' + htmlFiles.length);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  pages: htmlFiles.length,
  importedRoutes: importedSite.pages.length,
  internalLinksChecked: internalLinks,
  navigationLinksChecked: navigationLinks,
  failures: 0,
}, null, 2));
