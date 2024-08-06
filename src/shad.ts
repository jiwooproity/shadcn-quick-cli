import axios from "axios";
import select from "@inquirer/select";
import { readdirSync, readFileSync } from "fs";
import { exec } from "child_process";
import { load } from "cheerio";

export type ProcessArgv = {
  help: boolean;
  overwrite: boolean;
  target?: string;
  select: boolean;
  docs: boolean;
};

interface ChoiceItem {
  name: string;
  value: string;
}

const QUESTION = {
  COMPONENT: "What would you like to add in project",
  OVERWRITE: "Would you like to overwrite?",
};

export const readdir = (path: string) => {
  return readdirSync(path);
};

export const readFile = (path: string) => {
  return readFileSync(path);
};

export const chrowingHTML = async () => {
  return await axios.get("https://ui.shadcn.com/docs/components/accordion");
};

export const getComponents = async (): Promise<string[]> => {
  const html = await chrowingHTML();
  const $ = load(html?.data);
  const $menu = $(".pb-4");
  const $children = $menu[1].children;
  const $items = $($children).find(".group");
  return $items.map((_, item) => $(item).text()).get();
};

export const isNeedOverwriting = async (componentName: string) => {
  let filePath = "";

  const configFile = readFile("./components.json").toString();
  const configPath = await JSON.parse(configFile);

  if (configPath.aliases.components.includes("@")) {
    const tsconfigFile = readFile("./tsconfig.json").toString();
    const tsconfigJSON = await JSON.parse(tsconfigFile);
    const tsconfigPath = tsconfigJSON.compilerOptions.paths["@/*"][0].split("/")[1];
    filePath = `./${tsconfigPath}/${configPath.aliases.components.replace("@/", "")}/ui`;
  } else {
    filePath = `./${configPath.aliases.components}/ui`;
  }

  try {
    const fileNames = readdirSync(filePath).map((file) => file.split("."));
    return fileNames.map((file) => file[0]).includes(componentName);
  } catch (e) {
    return false; // ui 폴더가 없는 경우, shadcn-ui CLI 실행
  }
};

export const output = (_: any, stdout: string, stderr: string) => {
  console.log(stdout);
  console.log(stderr);
};

export class CreateChoice {
  constructor(private items: string[]) {
    this.items = items;
  }

  private convertValue(item: string) {
    return item.toLowerCase().replace(" ", "-");
  }

  private async createSelect<T>(message: string, choices: ChoiceItem[]): Promise<T | string> {
    return (await select({ message, choices })) as T;
  }

  private createItems(): ChoiceItem[] {
    return this.items.map((item) => ({ name: item, value: this.convertValue(item) }));
  }

  public async get<T>(type: string): Promise<T | string> {
    const answer = await this.createSelect<T>(type, this.createItems());
    return answer;
  }
}

export class ShadcnCLI {
  private options: string;
  private manage: string;
  private answer: string;
  private overwriteTrigger: boolean;

  constructor(public argv: ProcessArgv) {
    this.argv = argv;
    this.options = "";
    this.manage = "npx";
    this.answer = "";
    this.overwriteTrigger = false;
    this.init();
  }

  private setOptions() {
    if (this.argv.overwrite) {
      this.options += "--overwrite";
    }
  }

  async question() {
    if (this.argv.select) {
      const choices = new CreateChoice(await getComponents());
      this.answer = await choices.get(QUESTION.COMPONENT);
    }

    if (!this.argv.select && this.argv.target) {
      this.answer = this.argv.target;
    }

    this.overwriteTrigger = await isNeedOverwriting(this.answer);
  }

  private setPackageName() {
    const files = readdir("./");

    if (files.includes("package-lock.json")) {
      this.manage = "npx";
    } else if (files.includes(".yarn")) {
      this.manage = "yarn dlx";
    }
  }

  async execute() {
    if (!this.argv.overwrite && this.overwriteTrigger) {
      const choices = new CreateChoice(["yes", "no"]);
      const agree = await choices.get<"yes" | "no">(QUESTION.OVERWRITE);

      switch (agree) {
        case "yes":
          this.options += "--overwrite";
          break;
        case "no":
          process.exit();
        default:
          break;
      }
    }

    const cli = `${this.manage} shadcn-ui@latest add ${this.answer} ${this.options}`;
    exec(cli, output);
    console.log(cli);
  }

  async init() {
    this.setOptions();
    this.setPackageName();
  }
}

export const start = async (argv: ProcessArgv) => {
  const CLI = new ShadcnCLI(argv);

  try {
    await CLI.question().then(() => CLI.execute());
  } catch (e) {
    console.error("Canceled");
  }
};
