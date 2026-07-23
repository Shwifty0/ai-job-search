import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

describe("stepstone-search flag validation", () => {
  test("search without --query exits 1 with a JSON error on stderr", async () => {
    const result = await runCLI(["search", "-l", "Berlin"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("NO_QUERY");
  });

  test("search with a non-numeric --jobage exits 1 with a JSON error", async () => {
    const result = await runCLI(["search", "-q", "test", "--jobage", "notanumber"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("BAD_ARG");
  });

  test("search with --page 2 is rejected (robots.txt disallows pagination)", async () => {
    const result = await runCLI(["search", "-q", "test", "--page", "2"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("PAGE_NOT_ALLOWED");
  });

  test("detail without an id exits 1 with a JSON error", async () => {
    const result = await runCLI(["detail"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("NO_ID");
  });

  test("detail with an unparseable id exits 1 with a JSON error", async () => {
    const result = await runCLI(["detail", "not-an-id"]);
    expect(result.exitCode).toBe(1);
    const err = JSON.parse(result.stderr);
    expect(err.code).toBe("BAD_ID");
  });
});
