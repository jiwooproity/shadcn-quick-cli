import axios from "axios";
import select from "@inquirer/select";
import { load } from "cheerio";
import { resolve } from "path";
import { readdirSync, readFileSync } from "fs";
import { exec } from "child_process";

interface OptionsIF {
  help: boolean;
  overwrite: boolean;
  target: string;
  select: boolean;
  docs: boolean;
}

const readdir = (path: string) => {
  const resolvePath = resolve(path);
  return readdirSync(resolvePath);
};

const validationComp = async (componentName: string) => {
  const configFile = readFileSync("./components.json").toString();
  const configPath = await JSON.parse(configFile);
  const filePath = resolve(`./${configPath.aliases.components}/ui`);
  const fileNames = readdirSync(filePath).map((file) => file.split("."));
  return fileNames.map((file) => file[0]).includes(componentName);
};

const searchPkgName = () => {
  const files = readdir("./");

  if (files.includes("package-lock.json")) {
    return "npx";
  } else if (files.includes("yarn.lock")) {
    return "yarn add";
  } else if (files.includes(".yarn")) {
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

const controlOptions = (param: OptionsIF) => {
  let options = "";

  if (param.overwrite) {
    options += "--overwrite";
  }

  return options;
};

const exit = () => {
  process.exit();
};

const output = (_: any, stdout: string, stderr: string) => {
  console.log(stdout);
  console.error(stderr);
  exit();
};

const command = (manage: string, answer: string, options: string) => {
  exec(`${manage} shadcn-ui@latest add ${answer.toLowerCase()} ${options}`, output);
};

export const start = async (param: OptionsIF) => {
  let answer = "";
  let options = controlOptions(param);
  const manage = searchPkgName() as string;

  try {
    if (param.docs) {
      console.log("Please, check document in https://ui.shadcn.com/");
      exit();
    }

    if (param.select) {
      const components = await getComponentList();
      const choices = components.map((comp) => ({ name: comp, value: comp }));
      answer = await select({ message: "What would you like to add in project", choices });
    }

    if (param.target) {
      answer = param.target;
    }

    if ((await validationComp(answer.toLowerCase())) && !param.overwrite) {
      const selectArr = ["Yes", "No"];
      const choices = selectArr.map((select) => ({ name: select, value: select }));
      const check = await select({ message: "Woul you like to overwrite?", choices });

      switch (check) {
        case "Yes":
          options += controlOptions({ ...param, overwrite: true });
          break;
        case "No":
          console.log("Canceled installing");
          process.exit();
        default:
          break;
      }
    }

    command(manage, answer, options);
  } catch (e) {
    console.error("Canceled");
  }
};
