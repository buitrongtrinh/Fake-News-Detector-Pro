interface Source {
  title: string,
  url: string;
  domain: string;
  date_published: string;
  status: "supports" | "refutes";
}

export interface FactCheckResult {
  input: string;
  isfakenews: "true" | "false" | "null" | "";
  reasoning: string[];
  sources: Source[];
  advice: String;
}