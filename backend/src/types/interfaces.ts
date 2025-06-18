interface Source {
  title: string,
  url: string;
  domain: string;
  date_published: string;
  status: string;
}

export interface FactCheckResult {
  input: string;
  isfakenews: string;
  reasoning: string[];
  sources: Source[];
  advice: string;
}