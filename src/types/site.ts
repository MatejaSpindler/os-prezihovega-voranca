export type NavigationItem = {
  label: string;
  sourceUrl: string;
  route: string;
  children: NavigationItem[];
};

export type ImportedPage = {
  title: string;
  sourceUrl: string;
  route: string;
  context: string;
  kind: 'content' | 'document' | 'external' | 'resource';
  description: string;
  html: string;
  status: string;
  wordCount?: number;
};

export type ImportedSite = {
  source: string;
  generatedAt: string;
  navigation: NavigationItem[];
  pages: ImportedPage[];
};
