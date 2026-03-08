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

type EFetchArticle = {
  MedlineCitation: {
    Article: {
      ArticleTitle: string;
      Abstract?: {
        AbstractText: string | string[];
      };
      AuthorList?: {
        Author: Array<{
          LastName?: string;
          ForeName?: string;
          CollectiveName?: string;
        }>;
      };
      Journal: {
        Title: string;
        JournalIssue?: {
          PubDate?: {
            Year?: string;
            MedlineDate?: string;
          };
        };
      };
    };
  };
  PubmedData?: {
    ArticleIdList?: {
      ArticleId: Array<{ "#text": string; "@IdType": string }>;
    };
  };
};

type EFetchResult = {
  PubmedArticleSet?: {
    PubmedArticle: EFetchArticle | EFetchArticle[];
  };
};

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

const parsePubMedXml = (
  xml: string,
  ids: string[],
): MeditationPaper[] => {
  const papers: MeditationPaper[] = [];

  // Extract each PubmedArticle block
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g);
  if (!articleMatches) return papers;

  articleMatches.forEach((articleXml, index) => {
    const title = extractTag(articleXml, "ArticleTitle") || "Unknown Title";
    const abstract = extractAbstract(articleXml);
    const journal = extractTag(articleXml, "Title") || "Unknown Journal";
    const pubDate = extractPubDate(articleXml);
    const authors = extractAuthors(articleXml);

    if (abstract) {
      papers.push({
        id: ids[index] || String(index),
        title: cleanText(title),
        abstract: cleanText(abstract),
        authors,
        journal,
        pubDate,
      });
    }
  });

  return papers;
};

const extractTag = (xml: string, tag: string): string | null => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : null;
};

const extractAbstract = (xml: string): string | null => {
  const abstractMatch = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
  if (!abstractMatch) return null;
  const abstractXml = abstractMatch[1];
  const texts = abstractXml.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g);
  if (!texts) return null;
  return texts
    .map((t) => t.replace(/<[^>]+>/g, "").trim())
    .join(" ");
};

const extractPubDate = (xml: string): string => {
  const year = extractTag(xml, "Year");
  const month = extractTag(xml, "Month");
  if (year && month) return `${year}-${month}`;
  if (year) return year;
  const medline = extractTag(xml, "MedlineDate");
  return medline || "Unknown";
};

const extractAuthors = (xml: string): string[] => {
  const authors: string[] = [];
  const authorMatches = xml.match(/<Author[^>]*>([\s\S]*?)<\/Author>/g);
  if (!authorMatches) return authors;
  authorMatches.slice(0, 3).forEach((authorXml) => {
    const lastName = extractTag(authorXml, "LastName");
    const foreName = extractTag(authorXml, "ForeName");
    const collective = extractTag(authorXml, "CollectiveName");
    if (collective) {
      authors.push(collective);
    } else if (lastName) {
      authors.push(foreName ? `${lastName} ${foreName}` : lastName);
    }
  });
  return authors;
};

const cleanText = (text: string): string =>
  text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
