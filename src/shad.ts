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
}

const readdir = (path: string) => {
  const resolvePath = resolve(path);
  return readdirSync(resolvePath);
};

const validationComp = async (componentName: string) => {
  const configFile = readFileSync("./components.json").toString();
  const configPath = await JSON.parse(configFile);
  const filePath = resolve(__dirname, `${configPath.aliases.components}/ui`);
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

const output = (_: any, stdout: string, stderr: string) => {
  console.log(stdout);
  console.log(stderr);
};

const command = (manage: string, answer: string, options: string) => {
  exec(`${manage} shadcn-ui@latest add ${answer.toLowerCase()} ${options}`, output);
};

export const start = async (param: OptionsIF) => {
  let options = controlOptions(param);
  const manage = searchPkgName() as string;

  try {
    if (param.select) {
      const components = await getComponentList();
      const choices = components.map((comp) => ({ name: comp, value: comp }));
      const answer = await select({ message: "What would you like to add in project", choices });

      if ((await validationComp(answer)) && !param.overwrite) {
        const choiceArr = ["Yes", "No"];
        const choices = choiceArr.map((choice) => ({ name: choice, value: choice }));
        const check = await select({ message: "", choices });
        options += check ? "--overwrite" : "";
      }

      command(manage, answer, options);
    }

    if (param.target) {
      command(manage, param.target, options);
    }
  } catch (e) {
    console.error("Canceled");
  }
};
