import axios from "axios";
import select from "@inquirer/select";
import { load } from "cheerio";
import { resolve } from "path";
import { readdirSync } from "fs";
import { exec } from "child_process";

const readdir = () => {
  const path = resolve("./");
  return readdirSync(path);
};

const searchPkgName = () => {
  const files = readdir();

  if (files.includes("package-lock.json")) {
    return "npx";
  } else if (files.includes("yarn.lock")) {
    return "yarn dlx";
  }
};

const getHTML = async () => {
  try {
    return await axios.get("https://ui.shadcn.com/docs/components/accordion");
  } catch (error) {
    console.error(error);
  }
};

const getComponentList = async () => {
  const html = await getHTML();
  const $ = load(html?.data);
  const $container = $(".pb-4");
  const $grid = $container[1].children;
  const $items = $($grid).find(".group");
  const $links = $items.map((_, item) => $(item).text());
  return $links.get();
};

const controlOptions = (overwrite: boolean) => {
  let options = "";

  if (overwrite) {
    options += "--overwrite";
  }

  return options;
};

export const start = async (overwrite: boolean = false) => {
  const options = controlOptions(overwrite);
  const installCommand = searchPkgName();
  const components = await getComponentList();

  try {
    const choices = components.map((comp) => ({ name: comp, value: comp }));
    const answer = await select({ message: "What would you like to add in project", choices });
    exec(`${installCommand} shadcn-ui@latest add ${answer} ${options}`);
  } catch (e) {
    console.error("Canceled");
  }
};
