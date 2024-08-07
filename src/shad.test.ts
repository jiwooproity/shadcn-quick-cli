import { chrowingHTML, getComponents, isNeedOverwriting, readdir } from "./shad";
import { test, expect } from "@jest/globals";

describe("Verify that the scan directory is valid.", () => {
  test("Read in directory files.", () => {
    expect(readdir("./test")).toEqual(["ui"]);
  });
});

describe("Verify that the crawling is valid.", () => {
  test("GET request is valid to shadcn/ui website ( status: 200 )", async () => {
    const html = await chrowingHTML();
    expect(html.status).toBe(200);
  });

  test("Crawling in shadcn/ui menu.", async () => {
    expect(await getComponents().then((res) => res)).toHaveLength(49);
  });
});

describe("Verify that the scan component is valid.", () => {
  test("Check if overwriting to button component.", async () => {
    expect(await isNeedOverwriting("button").then((res) => res)).toEqual(true);
  });

  test("Check if not needs overwriting to button component.", async () => {
    expect(await isNeedOverwriting("accordian").then((res) => res)).toEqual(false);
  });
});
