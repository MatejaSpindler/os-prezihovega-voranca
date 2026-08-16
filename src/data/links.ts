export type SchoolLink = {
  label: string;
  href: string;
};

export type LinkGroup = {
  title: string;
  links: SchoolLink[];
};

const school = 'https://www.o-pvoranca.mb.edus.si';

export const linkGroups: LinkGroup[] = [
  {
    title: 'Šola',
    links: [
      { label: 'Osnovni podatki o šoli', href: `${school}/osnovni-podatki-o-soli/` },
      { label: 'Publikacija 2025/2026', href: 'https://ospvmb.splet.arnes.si/files/2025/11/Publikacija_OS_Prezihovega_Voranca_Maribor_2025_2026-1.pdf' },
      { label: 'Šola v preteklosti', href: `${school}/sola-v-preteklosti-2/` },
      { label: 'Himna šole', href: `${school}/himna-sole-2/` },
      { label: 'Kodeks', href: `${school}/kodeks-2/` },
      { label: 'Galerija', href: `${school}/galerija/` },
      { label: 'Učbeniški sklad', href: `${school}/ucbeniski-sklad/` },
      { label: 'Uporaba prostorov', href: `${school}/uporaba-prostorov/` },
      { label: 'Javna naročila', href: `${school}/javna-narocila/` },
      { label: 'Katalog informacij javnega značaja', href: 'https://ospvmb.splet.arnes.si/files/2026/05/1katalog.pdf' },
      { label: 'Varstvo osebnih podatkov', href: `${school}/varstvo-osebnih-podatkov/` },
      { label: 'Prevozi učencev', href: 'https://ospvmb.splet.arnes.si/prevozi-ucencev/' },
    ],
  },
  {
    title: 'Za starše',
    links: [
      { label: 'Za starše – pregled', href: `${school}/za-starse/` },
      { label: 'Aktualno za starše', href: `${school}/aktualno/` },
      { label: 'Vloge in dokumenti', href: `${school}/pravilniki/` },
      { label: 'Dopoldanske govorilne ure 2025/2026', href: 'https://ospvmb.splet.arnes.si/files/2025/11/Dopoldanske_govorilne_ure_2025_26.pdf' },
      { label: 'Svet staršev', href: `${school}/svet-starsev/` },
      { label: 'Subvencioniranje šolske prehrane', href: `${school}/subvencioniranje-solske-prehrane/` },
      { label: 'Prejemanje položnic po e-pošti', href: `${school}/izjava-za-prejemanje-poloznic-na-e-naslov/` },
    ],
  },
  {
    title: 'Pouk in učenci',
    links: [
      { label: 'Za učence – pregled', href: `${school}/za-ucence/` },
      { label: 'Urnik 2025/2026', href: 'https://ospvmb.splet.arnes.si/files/2025/11/Urnik_Oddelki_2025_2026.pdf' },
      { label: 'Izbirni predmeti 2026/2027', href: `${school}/izbirni-predmeti-2/` },
      { label: 'Pisno ocenjevanje znanja', href: `${school}/pisno-ocenjevanje-znanja/` },
      { label: 'Podaljšano bivanje', href: `${school}/podaljsano-bivanje/` },
      { label: 'Nacionalno preverjanje znanja', href: `${school}/nacionalno-preverjanje-znanja/` },
      { label: 'Šolska skupnost', href: `${school}/solska-skupnost/` },
      { label: 'Predmetna področja', href: `${school}/predmetna-podrocja/` },
      { label: 'Slovenščina', href: `${school}/category/slovenscina/` },
      { label: 'Glasbena umetnost', href: `${school}/glasbena-umetnost/` },
      { label: 'Naravoslovni predmeti', href: `${school}/category/naravoslovnipredmeti/` },
      { label: 'Natečaji', href: `${school}/category/dejavnosti-sole/natecaji/` },
      { label: 'Izobraževanje na daljavo', href: `${school}/dela-na-daljavo/` },
    ],
  },
  {
    title: 'Knjižnica',
    links: [
      { label: 'Knjižnica', href: `${school}/knjiznica/` },
      { label: 'Bralna značka', href: `${school}/bralna-znacka/` },
      { label: 'Prežihova bralna značka', href: `${school}/category/za-ucence/knjiznica/prezihova-bralna-znacka/` },
      { label: 'Nemška bralna značka', href: `${school}/category/za-ucence/knjiznica/nemska-bralna-znacka/` },
      { label: 'Angleška bralna značka', href: `${school}/category/za-ucence/knjiznica/angleska-bralna-znacka/` },
      { label: 'Bralni kotiček', href: `${school}/category/za-ucence/knjiznica/bralni-koticek/` },
      { label: 'Cilji in naloge šolske knjižnice', href: `${school}/category/za-ucence/knjiznica/cilji-in-naloge-solske-knjiznice/` },
      { label: 'Digitalna knjižnica', href: `${school}/category/za-ucence/knjiznica/digitalna-knjiznica/` },
      { label: 'Domače branje', href: `${school}/category/za-ucence/knjiznica/domace-branje/` },
      { label: 'Koristne povezave', href: `${school}/category/za-ucence/knjiznica/koristne-povezave/` },
      { label: 'Predstavitev knjižnice', href: `${school}/category/za-ucence/knjiznica/predstavitev/` },
      { label: 'Vesela šola', href: `${school}/category/za-ucence/knjiznica/vesela-sola/` },
      { label: 'Raziskovalno delo', href: `${school}/category/za-ucence/knjiznica/raziskovalno-delo/` },
      { label: 'Spletna stran knjižnice', href: 'http://knjiznicaospvmb.splet.arnes.si/' },
    ],
  },
  {
    title: 'Šolska prehrana',
    links: [
      { label: 'Šolska prehrana', href: `${school}/solska-prehrana-2/` },
      { label: 'Jedilnik', href: `${school}/jedilnik/` },
      { label: 'Anketa o prehrani – učenci', href: `${school}/anketa-o-prehrani-ucenci/` },
      { label: 'Anketa o prehrani', href: 'https://forms.office.com/e/sF9du7aKVg' },
      { label: 'Subvencioniranje prehrane', href: `${school}/subvencioniranje-solske-prehrane/` },
      { label: 'Šolska shema sadja in zelenjave', href: `${school}/shema-solskega-sadja-in-zelenjave/` },
      { label: 'Označevanje alergenov', href: `${school}/oznacevanje-alergenov-v-zivilih/` },
      { label: 'Dnevi evropske kuhinje', href: `${school}/dnevi-evropske-kuhinje/` },
    ],
  },
  {
    title: 'Podpora in dejavnosti',
    links: [
      { label: 'Dejavnosti – pregled', href: `${school}/dejavnosti/` },
      { label: 'Svetovalna služba', href: `${school}/svetovalna-sluzba/` },
      { label: 'Preventiva', href: `${school}/category/za-ucence/preventiva/` },
      { label: 'Nadarjeni učenci', href: `${school}/category/za-ucence/svetovalna-sluzba/nadarjeni-ucenci/` },
      { label: 'Tekmovanja', href: `${school}/tekmovanja/` },
      { label: 'Šole v naravi', href: `${school}/sole-v-naravi/` },
      { label: 'Glasba in zborovsko petje', href: `${school}/zborovsko-petje/` },
      { label: 'Projekti', href: `${school}/projekti/` },
      { label: 'Bodoči prvošolčki', href: `${school}/bodoci-prvosolcki/` },
      { label: 'Mediacija', href: `${school}/category/za-ucence/svetovalna-sluzba/mediacija/` },
      { label: 'SamoRASTniki', href: `${school}/samorastniki-1-2/` },
      { label: 'Debatni klub', href: `${school}/debatni_klub_debata_pro_et_contra/` },
      { label: '#športajmoinberimo', href: `${school}/sportajmoinberimo2/` },
    ],
  },
  {
    title: 'Portali in projekti',
    links: [
      { label: 'Virtualni sprehod po šoli', href: 'http://www.solavirtual.si/item/osnovna-sola-prezihovega-voranca' },
      { label: 'Spletne učilnice', href: `${school}/spletne-ucilnice/` },
      { label: 'KREATIVNI.SMO', href: 'http://ospvmb.splet.arnes.si/kreativnismo/' },
      { label: 'SVETOVALNICA', href: 'https://dspospvmb.weebly.com/' },
      { label: 'Šolski sklad', href: `${school}/solski-sklad/` },
      { label: 'Nadarjeni', href: 'https://nadarjeniucenci.weebly.com/' },
      { label: 'Erasmus+', href: 'https://erasmusospvmb.weebly.com/' },
      { label: 'POGUM', href: `${school}/pogum/` },
      { label: 'KLJUČ', href: 'http://ospvmb.splet.arnes.si/projekt-kljuc/' },
      { label: 'Uživajmo v zdravju', href: 'http://ospvmb.splet.arnes.si/cemu-projekt-uzivajmo-v-zdravju/' },
      { label: 'Instagram', href: 'https://www.instagram.com/ospvmb/' },
      { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61552588658829' },
    ],
  },
];

export const news = [
  {
    title: 'LinguArt se predstavlja',
    date: '23. junij 2026',
    href: `${school}/linguart-se-predstavlja/`,
    image: '/images/linguart.png',
    excerpt: 'Prva raznojezična zbirka naše šole združuje besede, verze, zgodbe in slike učencev.',
  },
  {
    title: 'Rezultati ankete o šolski prehrani',
    date: '22. junij 2026',
    href: `${school}/rezultati-ankete-o-solski-prehrani/`,
    excerpt: 'Poglejte rezultate ankete o šolski prehrani za starše in učence.',
  },
  {
    title: 'Kolesarska dirka po Sloveniji',
    date: '18. junij 2026',
    href: `${school}/kolesarska-dirka-po-sloveniji/`,
    image: '/images/kolesarska-dirka.webp',
    excerpt: 'Četrto- in osmošolci so ob Mladinski ulici navijali za kolesarje dirke po Sloveniji.',
  },
  {
    title: 'Učbeniški sklad 2026/2027',
    date: '17. junij 2026',
    href: `${school}/ucbeniski-sklad-2026-2027/`,
    excerpt: 'Obvestila o učnih gradivih in brezplačni izposoji učbenikov za prihodnje šolsko leto.',
  },
  {
    title: 'Anketa za petošolce',
    date: '3. junij 2026',
    href: `${school}/anketa-za-petosolce/`,
    excerpt: 'Dostop do aktualne ankete za učenke in učence petega razreda.',
  },
  {
    title: 'Erasmus+ prijavnica',
    date: '1. junij 2026',
    href: `${school}/erasmus-prijavnica/`,
    excerpt: 'Prijavnica in informacije za sodelovanje v programu Erasmus+.',
  },
  {
    title: 'Četrtošolci v svetu umetne inteligence',
    date: '22. maj 2026',
    href: `${school}/cetrtosolci-na-izletu-v-svet-umetne-inteligenceprojekt-dali4us/`,
    excerpt: 'Učenci so v projektu DALI4US raziskovali računalniške koncepte skozi ustvarjalne dejavnosti.',
  },
  {
    title: 'Tekmovanje Pišek',
    date: '21. maj 2026',
    href: `${school}/tekmovanje-pisek/`,
    excerpt: 'Zaščitena objava z utrinki in informacijami o tekmovanju Pišek.',
  },
  {
    title: 'Petošolci na potepu',
    date: '15. maj 2026',
    href: `${school}/petosolci-na-potepu-znanost-zgodovina-in-eksotika-v-enem-dnevu/`,
    excerpt: 'Strokovna ekskurzija v Ljubljano je povezala znanost, zgodovino in nova doživetja.',
  },
];

export const notices: SchoolLink[] = [
  { label: 'RAP 2026/2027', href: `${school}/29266-2` },
  { label: 'Tabela z ocenjevanji znanj', href: `${school}/files/2026/03/SEZNAM-OCENJEVANJ-ZA-25_26_2obd.pdf` },
  { label: 'Koledar dogodkov', href: `${school}/files/2026/06/NapovednikJanuar24-6.png` },
];

export const supportingLinks: SchoolLink[] = [
  { label: 'Zavod RS za šolstvo', href: 'http://www.zrss.si/' },
  { label: 'Projekt POGUM', href: 'https://www.zrss.si/objava/projekt-pogum' },
  { label: 'Ministrstvo za vzgojo in izobraževanje', href: 'http://www.mizs.gov.si/' },
  { label: 'Evropski skladi', href: 'http://www.eu-skladi.si/' },
  { label: 'AAI prijava', href: 'http://ospvmb.splet.arnes.si/wp-admin/' },
  { label: 'Politika zasebnosti', href: 'https://splet.arnes.si/izjava-o-zasebnosti/' },
];
