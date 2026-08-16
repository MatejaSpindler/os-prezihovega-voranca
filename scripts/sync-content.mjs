import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';

const HOME_URL = 'https://www.o-pvoranca.mb.edus.si/';
const OUTPUT_PATH = resolve('src/data/imported-pages.json');
const SCHOOL_HOSTS = new Set([
  'www.o-pvoranca.mb.edus.si',
  'o-pvoranca.mb.edus.si',
  'ospvmb.splet.arnes.si',
  'knjiznicaospvmb.splet.arnes.si',
]);
const RESOURCE_EXTENSIONS = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|png|jpe?g|gif|webp|svg)$/i;
const TECHNICAL_LABELS = new Set(['elegant themes', 'wordpress', 'avtor teme', 'poganja']);
const SKIP_PATHS = ['/wp-admin/', '/wp-login.php'];

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return cleanText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72) || 'povezava';
}

function shortHash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 7);
}

function normalizeUrl(value, base = HOME_URL) {
  if (!value || value.startsWith('#') || /^javascript:/i.test(value)) {
    return null;
  }

  try {
    const url = new URL(value, base);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || key === 'fbclid') {
        url.searchParams.delete(key);
      }
    }
    return url.href;
  } catch {
    return null;
  }
}

function isWebUrl(url) {
  return /^https?:/i.test(url);
}

function isImportableHtml(url) {
  const parsed = new URL(url);
  return (
    SCHOOL_HOSTS.has(parsed.hostname) &&
    !RESOURCE_EXTENSIONS.test(parsed.pathname) &&
    !SKIP_PATHS.some((path) => parsed.pathname.startsWith(path))
  );
}

function routeFor(url, label) {
  const parsed = new URL(url);
  const isMainHost = parsed.hostname === 'www.o-pvoranca.mb.edus.si' || parsed.hostname === 'o-pvoranca.mb.edus.si';

  if (isMainHost && !RESOURCE_EXTENSIONS.test(parsed.pathname)) {
    const path = parsed.pathname.replace(/^\/+|\/+$/g, '');
    if (path && path !== 'page/2') {
      return '/' + path + '/';
    }
  }

  const prefix = SCHOOL_HOSTS.has(parsed.hostname) ? 'solske-vsebine' : 'zunanje-povezave';
  return '/' + prefix + '/' + slugify(label) + '-' + shortHash(url) + '/';
}

function directChild(element, selector, $) {
  return $(element).children(selector).first();
}

function readMenuItem(element, $) {
  const anchor = directChild(element, 'a', $);
  const label = cleanText(anchor.clone().children().remove().end().text()) || cleanText(anchor.text());
  const url = normalizeUrl(anchor.attr('href'));
  const children = directChild(element, 'ul', $)
    .children('li')
    .map((_, child) => readMenuItem(child, $))
    .get()
    .filter((item) => item.label && item.url);

  return { label, url, children };
}

function flattenMenu(items) {
  return items.flatMap((item) => [item, ...flattenMenu(item.children || [])]);
}

function extractHomepageData(html) {
  const $ = load(html, { baseURI: HOME_URL });
  let menuRoot = $('#top-menu').first();
  if (!menuRoot.length) {
    menuRoot = $('.et_mobile_menu').first();
  }

  const navigation = menuRoot
    .children('li')
    .map((_, element) => readMenuItem(element, $))
    .get()
    .filter((item) => item.label && item.url);

  const destinations = new Map();
  const remember = (label, url, context = 'homepage') => {
    const normalized = normalizeUrl(url);
    const cleanedLabel = cleanText(label);
    if (!normalized || !isWebUrl(normalized) || !cleanedLabel || cleanedLabel.length > 140) {
      return;
    }
    if (TECHNICAL_LABELS.has(cleanedLabel.toLowerCase())) {
      return;
    }

    const current = destinations.get(normalized);
    const generic = /^(več\.{0,3}|preberi več|klikni|povezava)$/i.test(cleanedLabel);
    if (!current || (current.generic && !generic)) {
      destinations.set(normalized, { label: cleanedLabel, url: normalized, context, generic });
    }
  };

  for (const item of flattenMenu(navigation)) {
    remember(item.label, item.url, 'navigation');
  }

  $('#main-content a, #et-main-area a, footer a').each((_, anchor) => {
    const element = $(anchor);
    const imageAlt = cleanText(element.find('img').first().attr('alt') || '');
    remember(cleanText(element.text()) || imageAlt, element.attr('href'), 'homepage');
  });

  remember(
    'Uživajmo v zdravju',
    'http://ospvmb.splet.arnes.si/cemu-projekt-uzivajmo-v-zdravju/',
    'homepage',
  );

  destinations.delete(HOME_URL);
  return { navigation, destinations: [...destinations.values()] };
}

function decorateNavigation(items, routeMap) {
  return items.map((item) => ({
    label: item.label,
    sourceUrl: item.url,
    route: item.url === HOME_URL ? '/' : (routeMap.get(item.url) || item.url),
    children: decorateNavigation(item.children || [], routeMap),
  }));
}

function absoluteAttribute(value, pageUrl) {
  if (!value) return null;
  try {
    return new URL(value, pageUrl).href;
  } catch {
    return null;
  }
}

function secureSchoolAsset(value) {
  if (!value) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' && SCHOOL_HOSTS.has(url.hostname)) {
      url.protocol = 'https:';
    }
    return url.href;
  } catch {
    return value;
  }
}

function pickContentRoot($) {
  const entry = $('.entry-content').first();
  if (entry.length && cleanText(entry.text()).length > 30) return entry;

  const leftArea = $('#left-area').first();
  if (leftArea.length && cleanText(leftArea.text()).length > 30) return leftArea;

  const article = $('main article, article').first();
  if (article.length && cleanText(article.text()).length > 30) return article;

  const main = $('main, #main-content, #content').first();
  if (main.length && cleanText(main.text()).length > 30) return main;

  return $('body').first();
}

function extractPage(html, pageUrl, fallbackTitle, routeMap) {
  const $ = load(html, { baseURI: pageUrl });
  const extractedTitle =
    cleanText($('h1.entry-title, main h1, article h1, h1').first().text()) ||
    fallbackTitle ||
    cleanText($('title').first().text()).replace(/\s*\|.*$/, '');
  const title = /^ni zadetkov$/i.test(extractedTitle) ? fallbackTitle : extractedTitle;
  const description =
    cleanText($('meta[name="description"]').attr('content') || '') ||
    cleanText($('meta[property="og:description"]').attr('content') || '');
  const root = pickContentRoot($).clone();

  root.find('script, style, noscript, iframe, form, nav, header, footer, aside, .sidebar, .et_pb_widget_area, .pagination, .post-meta').remove();
  root.find('h1.entry-title').remove();

  root.find('a').each((_, anchor) => {
    const element = $(anchor);
    const href = absoluteAttribute(element.attr('href'), pageUrl);
    if (!href) {
      element.removeAttr('href');
      return;
    }

    const normalized = normalizeUrl(href);
    const localRoute = normalized ? routeMap.get(normalized) : null;
    element.attr('href', localRoute || href);

    if (!localRoute && /^https?:/i.test(href)) {
      element.attr('target', '_blank');
      element.attr('rel', 'noreferrer');
    } else {
      element.removeAttr('target rel');
    }
  });

  root.find('img').each((_, image) => {
    const element = $(image);
    const source = secureSchoolAsset(
      absoluteAttribute(element.attr('data-lazy-src') || element.attr('src'), pageUrl),
    );
    if (!source) {
      element.remove();
      return;
    }
    element.attr('src', source);
    element.attr('loading', 'lazy');
    element.removeAttr('srcset sizes style class id data-lazy-src data-src');
  });

  root.find('*').each((_, node) => {
    $(node).removeAttr('style id onclick onload');
  });

  const content = sanitizeHtml(root.html() || '', {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'small', 'mark',
      'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'a', 'img', 'figure', 'figcaption', 'blockquote',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'div', 'span', 'section', 'article', 'hr',
      'video', 'source',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'loading', 'width', 'height'],
      table: ['summary'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      video: ['controls', 'poster', 'width', 'height'],
      source: ['src', 'type'],
      '*': ['class'],
    },
    allowedClasses: {
      '*': ['alignleft', 'alignright', 'aligncenter', 'wp-caption', 'gallery', 'gallery-item'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  });

  return {
    title,
    description,
    html: content,
    wordCount: cleanText(root.text()).split(' ').filter(Boolean).length,
  };
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'Mozilla/5.0 SchoolSiteContentSync/1.0' },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function importDestination(destination, routeMap, index, total) {
  const route = routeMap.get(destination.url);
  const base = {
    title: destination.label,
    sourceUrl: destination.url,
    route,
    context: destination.context,
  };

  if (!isImportableHtml(destination.url)) {
    console.log('[' + (index + 1) + '/' + total + '] resource ' + destination.label);
    return {
      ...base,
      kind: RESOURCE_EXTENSIONS.test(new URL(destination.url).pathname) ? 'document' : 'external',
      description: 'Ta vsebina je na zunanjem spletnem mestu ali v dokumentu.',
      html: '',
      status: 'linked',
    };
  }

  try {
    const response = await fetchWithTimeout(destination.url);
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('text/html')) {
      console.log('[' + (index + 1) + '/' + total + '] linked ' + destination.label + ' (' + response.status + ')');
      return {
        ...base,
        kind: 'resource',
        description: 'Vsebina ostaja dostopna na izvirnem naslovu.',
        html: '',
        status: String(response.status),
      };
    }

    const imported = extractPage(await response.text(), response.url, destination.label, routeMap);
    console.log('[' + (index + 1) + '/' + total + '] imported ' + imported.title);
    return {
      ...base,
      ...imported,
      kind: 'content',
      status: String(response.status),
    };
  } catch (error) {
    console.log('[' + (index + 1) + '/' + total + '] failed ' + destination.label + ': ' + error.message);
    return {
      ...base,
      kind: 'resource',
      description: 'Vsebine med sinhronizacijo ni bilo mogoče uvoziti. Uporabite izvirni naslov.',
      html: '',
      status: 'failed',
    };
  }
}

async function main() {
  console.log('Fetching source homepage...');
  const homepageResponse = await fetchWithTimeout(HOME_URL);
  if (!homepageResponse.ok) {
    throw new Error('Homepage returned HTTP ' + homepageResponse.status);
  }

  const homepage = extractHomepageData(await homepageResponse.text());
  const routeMap = new Map(
    homepage.destinations.map((destination) => [
      destination.url,
      routeFor(destination.url, destination.label),
    ]),
  );
  const navigation = decorateNavigation(homepage.navigation, routeMap);
  const pages = await mapLimit(homepage.destinations, 6, (destination, index) =>
    importDestination(destination, routeMap, index, homepage.destinations.length),
  );

  const output = {
    source: HOME_URL,
    generatedAt: new Date().toISOString(),
    navigation,
    pages: pages.sort((a, b) => a.route.localeCompare(b.route, 'sl')),
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const counts = output.pages.reduce((summary, page) => {
    summary[page.kind] = (summary[page.kind] || 0) + 1;
    return summary;
  }, {});
  console.log('Wrote ' + output.pages.length + ' routes to ' + OUTPUT_PATH);
  console.log(counts);
}

await main();
