import { chrowingHTML, getComponents, isNeedOverwriting, readdir, start } from "./shad";
import { test, expect } from "@jest/globals";

const shadcnUIList = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Aspect Ratio",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "ChartNew",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "Context Menu",
  "Data Table",
  "Date Picker",
  "Dialog",
  "Drawer",
  "Dropdown Menu",
  "Form",
  "Hover Card",
  "Input",
  "Input OTP",
  "Label",
  "Menubar",
  "Navigation Menu",
  "Pagination",
  "Popover",
  "Progress",
  "Radio Group",
  "Resizable",
  "Scroll Area",
  "Select",
  "Separator",
  "Sheet",
  "Skeleton",
  "Slider",
  "Sonner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Tooltip",
];

describe("Verify that the scan directory is valid.", () => {
  test("Read in directory files.", () => {
    expect(readdir("./test")).toEqual(["hello.txt", "next-test", "ui"]);
  });
});

describe("Verify that the Chrowing is valid.", () => {
  test("GET request is valid to shadcn/ui website ( status: 200 )", async () => {
    const html = await chrowingHTML();
    expect(html.status).toBe(200);
  });

  test("Chrowing in shadcn/ui menu.", async () => {
    expect(await getComponents().then((res) => res)).toEqual(shadcnUIList);
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
