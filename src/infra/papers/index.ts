import { XMLParser } from "fast-xml-parser";

const PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export type MeditationPaper = {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  pubDate: string;
};

type ESearchResult = {
  esearchresult: {
    idlist: string[];
  };
};

type AuthorEntry = {
  LastName?: string;
  ForeName?: string;
  CollectiveName?: string;
};

type AbstractText = string | { "#text": string } | Array<string | { "#text": string }>;

type PubmedArticle = {
  MedlineCitation?: {
    PMID?: string | { "#text": string };
    Article?: {
      ArticleTitle?: string | { "#text": string };
      Abstract?: {
        AbstractText?: AbstractText;
      };
      AuthorList?: {
        Author?: AuthorEntry | AuthorEntry[];
      };
      Journal?: {
        Title?: string;
        JournalIssue?: {
          PubDate?: {
            Year?: string;
            MedlineDate?: string;
          };
        };
      };
    };
  };
};

type EFetchResult = {
  PubmedArticleSet?: {
    PubmedArticle?: PubmedArticle | PubmedArticle[];
  };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  textNodeName: "#text",
  isArray: (name) => ["PubmedArticle", "Author", "AbstractText"].includes(name),
});

export const fetchRecentMeditationPapers = async (
  count = 5,
): Promise<MeditationPaper[]> => {
  // Search for recent meditation papers
  const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=meditation+mindfulness&sort=date&retmax=${count}&retmode=json&datetype=pdat&reldate=30`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    throw new Error(`PubMed search failed: ${searchRes.status}`);
  }

  const searchData = (await searchRes.json()) as ESearchResult;
  const ids = searchData.esearchresult.idlist;

  if (ids.length === 0) {
    return [];
  }

  // Fetch abstracts
  const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?db=pubmed&id=${ids.join(",")}&rettype=abstract&retmode=xml`;
  const fetchRes = await fetch(fetchUrl);
  if (!fetchRes.ok) {
    throw new Error(`PubMed fetch failed: ${fetchRes.status}`);
  }

  const xmlText = await fetchRes.text();
  return parsePubMedXml(xmlText, ids);
};

const extractText = (value: string | { "#text": string } | undefined): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value["#text"] ?? "";
};

const extractAbstract = (abstractText: AbstractText | undefined): string => {
  if (!abstractText) return "";
  const items = Array.isArray(abstractText) ? abstractText : [abstractText];
  return items.map(extractText).join(" ").trim();
};

const extractAuthors = (authorList: PubmedArticle["MedlineCitation"]["Article"]["AuthorList"]): string[] => {
  if (!authorList?.Author) return [];
  const authors = Array.isArray(authorList.Author) ? authorList.Author : [authorList.Author];
  return authors.slice(0, 3).map((a) => {
    if (a.CollectiveName) return a.CollectiveName;
    if (a.LastName) return a.ForeName ? `${a.LastName} ${a.ForeName}` : a.LastName;
    return "";
  }).filter(Boolean) as string[];
};

const extractPubDate = (pubDate: { Year?: string; MedlineDate?: string } | undefined): string => {
  if (!pubDate) return "Unknown";
  if (pubDate.Year) return pubDate.Year;
  return pubDate.MedlineDate ?? "Unknown";
};

const parsePubMedXml = (xml: string, ids: string[]): MeditationPaper[] => {
  const parsed = parser.parse(xml) as EFetchResult;
  const articleSet = parsed.PubmedArticleSet?.PubmedArticle;
  if (!articleSet) return [];

  const articles = Array.isArray(articleSet) ? articleSet : [articleSet];
  const papers: MeditationPaper[] = [];

  articles.forEach((article, index) => {
    const citation = article.MedlineCitation;
    if (!citation?.Article) return;

    const article_ = citation.Article;
    const title = extractText(article_.ArticleTitle) || "Unknown Title";
    const abstract = extractAbstract(article_.Abstract?.AbstractText);
    if (!abstract) return;

    const journal = article_.Journal?.Title ?? "Unknown Journal";
    const pubDate = extractPubDate(article_.Journal?.JournalIssue?.PubDate);
    const authors = extractAuthors(article_.AuthorList);
    const id = ids[index] ?? String(index);

    papers.push({ id, title, abstract, authors, journal, pubDate });
  });

  return papers;
};
