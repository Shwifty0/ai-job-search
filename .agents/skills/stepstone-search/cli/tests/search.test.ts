import { describe, test, expect } from "bun:test";
import { runCLI, parseJSON } from "./helpers";

interface JobCard {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
}
interface SearchResult {
  meta: { count: number; page: number };
  results: JobCard[];
}

describe("stepstone-search live smoke tests", () => {
  test("search returns real results for a realistic query", async () => {
    const result = await runCLI([
      "search",
      "-q",
      "Werkstudent Machine Learning",
      "-l",
      "Hamburg",
      "--limit",
      "5",
    ]);
    const data = parseJSON<SearchResult>(result);
    expect(data.results.length).toBeGreaterThan(0);
    const first = data.results[0];
    expect(first.id).toBeTruthy();
    expect(first.title).toBeTruthy();
    expect(first.url).toContain("stepstone.de");
  }, 30000);

  test("detail returns a parsed job for a real ID", async () => {
    const search = await runCLI(["search", "-q", "Werkstudent", "-l", "Berlin", "--limit", "1"]);
    const data = parseJSON<SearchResult>(search);
    expect(data.results.length).toBeGreaterThan(0);
    const id = data.results[0].id;

    const detail = await runCLI(["detail", id, "--format", "json"]);
    expect(detail.exitCode).toBe(0);
    const job = JSON.parse(detail.stdout);
    expect(job.title).toBeTruthy();
    expect(job.url).toContain("stepstone.de");
  }, 30000);
});
